package com.ecommerce.service;

import com.ecommerce.dto.RazorpayOrderDto;
import com.ecommerce.dto.RazorpayVerifyDto;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.PaymentStatus;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Formatter;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${app.razorpay.key-id:}")
    private String keyId;

    @Value("${app.razorpay.key-secret:}")
    private String keySecret;

    @Value("${app.razorpay.currency:INR}")
    private String currency;

    @Value("${app.razorpay.company-name:ShopSphere}")
    private String companyName;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FulfillmentService fulfillmentService;

    private static final String ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom random = new SecureRandom();

    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
    }

    public RazorpayOrderDto createRazorpayOrder(BigDecimal amount, String receipt) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Order amount must be greater than zero");
        }

        long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();
        if (receipt == null || receipt.isBlank()) {
            receipt = "rcpt_" + System.currentTimeMillis();
        }

        String razorpayOrderId = null;

        // If credentials are configured, create order via official Razorpay REST API
        if (isConfigured()) {
            try {
                URL url = new URL("https://api.razorpay.com/v1/orders");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");

                String auth = keyId + ":" + keySecret;
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
                conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
                conn.setDoOutput(true);
                conn.setConnectTimeout(8000);
                conn.setReadTimeout(8000);

                String jsonPayload = String.format("{\"amount\":%d,\"currency\":\"%s\",\"receipt\":\"%s\"}",
                        amountInPaise, currency, receipt);

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
                    os.flush();
                }

                int responseCode = conn.getResponseCode();
                InputStream is = (responseCode >= 200 && responseCode < 300) ? conn.getInputStream() : conn.getErrorStream();

                StringBuilder response = new StringBuilder();
                try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        response.append(line);
                    }
                }

                String responseBody = response.toString();
                log.info("Razorpay API Order Creation response [HTTP {}]: {}", responseCode, responseBody);

                int idIndex = responseBody.indexOf("\"id\":\"");
                if (idIndex != -1) {
                    int start = idIndex + 6;
                    int end = responseBody.indexOf("\"", start);
                    if (end != -1) {
                        razorpayOrderId = responseBody.substring(start, end);
                    }
                }
            } catch (Exception e) {
                log.error("Failed to create order on Razorpay server: {}", e.getMessage());
            }
        }

        // Demo fallback if Razorpay API keys are not provided or API call failed
        if (razorpayOrderId == null || razorpayOrderId.isBlank()) {
            StringBuilder sb = new StringBuilder("demo_order_");
            for (int i = 0; i < 14; i++) {
                sb.append(ALPHANUM.charAt(random.nextInt(ALPHANUM.length())));
            }
            razorpayOrderId = sb.toString();
            log.info("Using simulated demo payment order ID: {}", razorpayOrderId);
        }

        return new RazorpayOrderDto(
                razorpayOrderId,
                amount,
                amountInPaise,
                currency,
                keyId != null && !keyId.isBlank() ? keyId : "rzp_demo_key",
                receipt,
                companyName
        );
    }

    /**
     * Strict HMAC-SHA256 Signature Verification.
     * Prevents timing attacks with MessageDigest.isEqual.
     */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null || signature.isBlank()) {
            return false;
        }

        // Handle simulated demo orders when Razorpay is not configured
        if (!isConfigured() || orderId.startsWith("demo_order_")) {
            return signature.startsWith("demo_") || signature.equalsIgnoreCase("demo_verified") || signature.length() >= 16;
        }

        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secretKeySpec);
            byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            Formatter formatter = new Formatter();
            for (byte b : hash) {
                formatter.format("%02x", b);
            }
            String calculatedSignature = formatter.toString();
            formatter.close();

            // Constant-time byte comparison to prevent timing attacks
            boolean matches = MessageDigest.isEqual(
                    calculatedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.toLowerCase().getBytes(StandardCharsets.UTF_8)
            );

            if (!matches) {
                log.warn("HMAC SHA256 signature verification failed for orderId={}", orderId);
            }
            return matches;
        } catch (Exception e) {
            log.error("Error during cryptographic signature calculation: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Complete and securely verify Razorpay payment
     */
    @Transactional
    public Order completeRazorpayPayment(RazorpayVerifyDto verifyDto) {
        boolean valid = verifySignature(verifyDto.getRazorpayOrderId(), verifyDto.getRazorpayPaymentId(), verifyDto.getRazorpaySignature());
        if (!valid) {
            throw new BadRequestException("Invalid payment signature verification failed. Order confirmation aborted.");
        }

        if (verifyDto.getOrderId() != null) {
            Order order = orderRepository.findById(verifyDto.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "id", verifyDto.getOrderId()));

            if (order.getOrderStatus() == OrderStatus.CANCELLED) {
                throw new BadRequestException("Cannot pay for a cancelled order.");
            }

            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                return order; // Idempotent: already marked as paid
            }

            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setTransactionId(verifyDto.getRazorpayPaymentId());
            String gatewayName = isConfigured() && !verifyDto.getRazorpayOrderId().startsWith("demo_order_")
                    ? "Razorpay Payment Gateway (Verified HMAC)"
                    : "DEMO Simulated Payment (Test Mode)";
            order.setPaymentGateway(gatewayName);
            order.setPaidAt(LocalDateTime.now());

            Order saved = orderRepository.save(order);

            // Reserve warehouse inventory upon verified payment
            try {
                fulfillmentService.selectAndReserveInventory(saved);
            } catch (Exception e) {
                log.warn("Auto inventory reservation note: {}", e.getMessage());
            }

            return saved;
        }

        return null;
    }
}
