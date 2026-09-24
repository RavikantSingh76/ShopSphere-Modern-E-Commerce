package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.RazorpayOrderDto;
import com.ecommerce.dto.RazorpayVerifyDto;
import com.ecommerce.entity.Order;
import com.ecommerce.service.RazorpayService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
public class RazorpayController {

    @Autowired
    private RazorpayService razorpayService;

    // Standard REST endpoint for Razorpay Order creation
    @PostMapping("/api/payment/razorpay/create-order")
    public ResponseEntity<ApiResponse<RazorpayOrderDto>> createOrder(@RequestBody Map<String, Object> payload) {
        BigDecimal amount = BigDecimal.valueOf(Double.parseDouble(payload.getOrDefault("amount", "500").toString()));
        String receipt = (String) payload.getOrDefault("receipt", "order_rcpt_" + System.currentTimeMillis());
        RazorpayOrderDto orderDto = razorpayService.createRazorpayOrder(amount, receipt);
        return ResponseEntity.ok(ApiResponse.success("Razorpay order generated", orderDto));
    }

    // Direct compatibility endpoint matching user snippet /create-order
    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderDto> createOrderDirect(@RequestBody Map<String, Object> payload) {
        BigDecimal amount = BigDecimal.valueOf(Double.parseDouble(payload.getOrDefault("amount", "500").toString()));
        String receipt = (String) payload.getOrDefault("receipt", "order_rcpt_" + System.currentTimeMillis());
        RazorpayOrderDto orderDto = razorpayService.createRazorpayOrder(amount, receipt);
        return ResponseEntity.ok(orderDto);
    }

    // Razorpay payment verification
    @PostMapping("/api/payment/razorpay/verify-payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPayment(@Valid @RequestBody RazorpayVerifyDto verifyDto) {
        Order order = razorpayService.completeRazorpayPayment(verifyDto);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", Map.of(
                "verified", true,
                "paymentId", verifyDto.getRazorpayPaymentId(),
                "orderId", verifyDto.getOrderId() != null ? verifyDto.getOrderId() : 0,
                "orderNumber", order != null ? order.getOrderNumber() : ""
        )));
    }
}
