package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FulfillmentService fulfillmentService;

    private final Random random = new Random();

    @Transactional
    public OrderResponse createOrder(User user, CreateOrderRequest request) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("User has no active cart"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your shopping cart is empty");
        }

        // Validate stock availability and recalculate subtotal using live product catalog prices
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (!product.isActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable.");
            }
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Product '" + product.getName() + "' is out of stock or insufficient quantity available.");
            }
            // Real-time authoritative price validation against catalog
            BigDecimal currentPrice = product.getDiscountedPrice();
            item.setUnitPrice(currentPrice);
            subtotal = subtotal.add(currentPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Calculate discount
        BigDecimal discountAmount = BigDecimal.ZERO;
        String appliedCouponCode = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            var couponOpt = couponRepository.findByCodeIgnoreCaseAndActiveTrue(request.getCouponCode().trim());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                if (coupon.isValidFor(subtotal)) {
                    discountAmount = coupon.calculateDiscount(subtotal);
                    if (discountAmount.compareTo(subtotal) > 0) {
                        discountAmount = subtotal;
                    }
                    appliedCouponCode = coupon.getCode();
                    coupon.setTimesUsed(coupon.getTimesUsed() + 1);
                    couponRepository.save(coupon);
                }
            }
        }

        // Shipping fee (free for orders less than 100 or above 500)
        BigDecimal shippingFee = (subtotal.compareTo(BigDecimal.valueOf(100)) < 0 || subtotal.compareTo(BigDecimal.valueOf(500)) >= 0) ? BigDecimal.ZERO : BigDecimal.valueOf(50);
        BigDecimal taxAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee).add(taxAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Create Order entity
        Order order = new Order();
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + (1000 + random.nextInt(9000));
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setOrderStatus(OrderStatus.CONFIRMED);

        PaymentMethod method = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.COD;
        order.setPaymentMethod(method);
        if (method == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PENDING);
            order.setTransactionId("COD-PENDING-" + (System.currentTimeMillis() % 1000000));
            order.setPaymentGateway("Cash on Delivery (Pay at Doorstep)");
        } else {
            // Online orders start in PENDING payment status until verified via payment gateway
            order.setPaymentStatus(PaymentStatus.PENDING);
            order.setTransactionId("TXN-" + System.currentTimeMillis() + "-" + (1000 + random.nextInt(9000)));
            order.setPaymentGateway(method.name() + " Gateway");
        }
        order.setTrackingNumber("TRK-" + (10000000 + random.nextInt(90000000)));
        order.setCourierName("Express Courier Services");
        order.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(4));

        // Shipping Address snapshot
        AddressDto addr = request.getShippingAddress();
        order.setShippingFullName(addr.getFullName());
        order.setShippingPhone(addr.getPhone());
        order.setShippingStreetAddress(addr.getStreetAddress());
        order.setShippingApartment(addr.getApartment());
        order.setShippingCity(addr.getCity());
        order.setShippingState(addr.getState());
        order.setShippingPostalCode(addr.getPostalCode());
        order.setShippingCountry(addr.getCountry() != null ? addr.getCountry() : "India");

        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(totalAmount);
        order.setCouponCode(appliedCouponCode);
        order.setNotes(request.getNotes());

        Order savedOrder = orderRepository.save(order);

        // Convert cart items to order items and deduct product catalogue stock atomically to prevent race conditions
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            int rowsUpdated = productRepository.decrementStockIfAvailable(product.getId(), cartItem.getQuantity());
            if (rowsUpdated == 0) {
                throw new BadRequestException("Insufficient stock for product '" + product.getName() + "'. Please adjust your cart quantity.");
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());

            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    product,
                    product.getName(),
                    product.getPrimaryImageUrl(),
                    product.getSku(),
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice()
            );
            orderItems.add(orderItem);
            orderItemRepository.save(orderItem);
        }

        savedOrder.setOrderItems(orderItems);

        // Execute Fulfillment Routing & Stock Reservation
        try {
            fulfillmentService.selectAndReserveInventory(savedOrder);
        } catch (Exception e) {
            // Log fulfillment routing error non-fatally
        }

        // Create payment record
        Payment payment = new Payment(
                savedOrder,
                "TXN-" + System.currentTimeMillis(),
                savedOrder.getPaymentMethod(),
                savedOrder.getPaymentStatus(),
                totalAmount,
                savedOrder.getPaymentMethod() == PaymentMethod.COD ? "COD" : "Online Gateway"
        );
        paymentRepository.save(payment);

        // Clear cart
        cartItemRepository.deleteByCart(cart);
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponse(savedOrder);
    }

    public PagedResponse<OrderResponse> getUserOrders(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToOrderResponse).collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    public OrderResponse getOrderByIdAndUser(Long id, User user) {
        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToOrderResponse(order);
    }

    public OrderResponse trackOrder(String orderNumberOrId) {
        Order order;
        try {
            Long id = Long.parseLong(orderNumberOrId);
            order = orderRepository.findById(id)
                    .orElseGet(() -> orderRepository.findByOrderNumber(orderNumberOrId)
                            .orElseThrow(() -> new ResourceNotFoundException("Order not found with identifier: " + orderNumberOrId)));
        } catch (NumberFormatException e) {
            order = orderRepository.findByOrderNumber(orderNumberOrId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumberOrId));
        }
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id, User user) {
        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        if (order.getOrderStatus() == OrderStatus.DELIVERED ||
            order.getOrderStatus() == OrderStatus.SHIPPED ||
            order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            throw new BadRequestException("Order cannot be cancelled as it is already " + order.getOrderStatus());
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        // Restore catalogue stock
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() != null) {
                    Product p = item.getProduct();
                    p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                    productRepository.save(p);
                }
            }
        }

        // Release warehouse reserved stock
        try {
            fulfillmentService.releaseReservedInventory(order);
        } catch (Exception ignored) {}

        order.setOrderStatus(OrderStatus.CANCELLED);
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        Order saved = orderRepository.save(order);
        return mapToOrderResponse(saved);
    }

    // Admin Methods
    public PagedResponse<OrderResponse> getAllOrders(int page, int size, OrderStatus status, String query) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage;

        if (query != null && !query.isBlank()) {
            orderPage = orderRepository.searchOrders(query.trim(), pageable);
        } else if (status != null) {
            orderPage = orderRepository.findByOrderStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            orderPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToOrderResponse).collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(request.getStatus());

        if (request.getStatus() == OrderStatus.CANCELLED && previousStatus != OrderStatus.CANCELLED) {
            // Restore catalogue stock
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    if (item.getProduct() != null) {
                        Product p = item.getProduct();
                        p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                        productRepository.save(p);
                    }
                }
            }
            // Release warehouse reserved stock
            try {
                fulfillmentService.releaseReservedInventory(order);
            } catch (Exception ignored) {}

            if (order.getPaymentStatus() == PaymentStatus.PAID) {
                order.setPaymentStatus(PaymentStatus.REFUNDED);
            }
        }

        if (request.getStatus() == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setDeliveredAt(LocalDateTime.now());
        }

        if (request.getStatus() == OrderStatus.SHIPPED) {
            fulfillmentService.fulfillAndDeductInventory(order);
        }

        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        if (request.getCourierName() != null && !request.getCourierName().isBlank()) {
            order.setCourierName(request.getCourierName());
        }
        if (request.getEstimatedDeliveryDate() != null) {
            order.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        }

        Order saved = orderRepository.save(order);
        return mapToOrderResponse(saved);
    }

    public OrderResponse mapToResponse(Order order) {
        return mapToOrderResponse(order);
    }

    public OrderResponse mapToOrderResponse(Order order) {
        if (order == null) return null;
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setOrderNumber(order.getOrderNumber());

        if (order.getUser() != null) {
            res.setUserId(order.getUser().getId());
            res.setUserName(order.getUser().getName());
            res.setUserEmail(order.getUser().getEmail());
        }

        AddressDto addr = new AddressDto();
        addr.setFullName(order.getShippingFullName());
        addr.setPhone(order.getShippingPhone());
        addr.setStreetAddress(order.getShippingStreetAddress());
        addr.setApartment(order.getShippingApartment());
        addr.setCity(order.getShippingCity());
        addr.setState(order.getShippingState());
        addr.setPostalCode(order.getShippingPostalCode());
        addr.setCountry(order.getShippingCountry());
        res.setShippingAddress(addr);

        res.setOrderStatus(order.getOrderStatus());
        res.setPaymentMethod(order.getPaymentMethod());
        res.setPaymentStatus(order.getPaymentStatus());
        res.setTransactionId(order.getTransactionId() != null ? order.getTransactionId() : ("TXN-" + order.getPaymentMethod() + "-" + order.getId()));
        res.setPaymentGateway(order.getPaymentGateway() != null ? order.getPaymentGateway() : "ShopSphere Payment Gateway");
        res.setPaidAt(order.getPaidAt() != null ? order.getPaidAt() : (order.getPaymentStatus() == PaymentStatus.PAID ? order.getCreatedAt() : null));
        res.setTrackingNumber(order.getTrackingNumber());
        res.setCourierName(order.getCourierName());
        res.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());

        if (order.getDeliveryPartner() != null) {
            DeliveryPartnerDto partnerDto = new DeliveryPartnerDto();
            partnerDto.setId(order.getDeliveryPartner().getId());
            partnerDto.setName(order.getDeliveryPartner().getName());
            partnerDto.setPhone(order.getDeliveryPartner().getPhone());
            partnerDto.setEmail(order.getDeliveryPartner().getEmail());
            partnerDto.setVehicleNumber(order.getDeliveryPartner().getVehicleNumber());
            partnerDto.setVehicleType(order.getDeliveryPartner().getVehicleType());
            partnerDto.setStatus(order.getDeliveryPartner().getStatus());
            partnerDto.setCurrentArea(order.getDeliveryPartner().getCurrentArea());
            partnerDto.setRating(order.getDeliveryPartner().getRating());
            partnerDto.setTotalDeliveries(order.getDeliveryPartner().getTotalDeliveries());
            partnerDto.setActive(order.getDeliveryPartner().isActive());
            res.setDeliveryPartner(partnerDto);
        }

        res.setDeliveryOtp(order.getDeliveryOtp());
        res.setDeliveryAssignedAt(order.getDeliveryAssignedAt());
        res.setDeliveredAt(order.getDeliveredAt());

        // Warehouse Fulfillment details
        res.setFulfillmentLocationId(order.getFulfillmentLocationId());
        res.setFulfillmentLocationName(order.getFulfillmentLocationName());
        res.setFulfillmentLocationCode(order.getFulfillmentLocationCode());
        res.setPickedAt(order.getPickedAt());
        res.setPickedBy(order.getPickedBy());
        res.setPickerNotes(order.getPickerNotes());
        res.setPackedAt(order.getPackedAt());
        res.setPackedBy(order.getPackedBy());
        res.setPackageWeightKg(order.getPackageWeightKg());
        res.setPackageBoxSize(order.getPackageBoxSize());
        res.setPackageBarcode(order.getPackageBarcode());
        res.setReadyToShipAt(order.getReadyToShipAt());
        res.setManifestBatchId(order.getManifestBatchId());

        res.setSubtotal(order.getSubtotal());
        res.setDiscountAmount(order.getDiscountAmount());
        res.setShippingFee(order.getShippingFee());
        res.setTaxAmount(order.getTaxAmount());
        res.setTotalAmount(order.getTotalAmount());
        res.setCouponCode(order.getCouponCode());
        res.setNotes(order.getNotes());
        res.setCreatedAt(order.getCreatedAt());
        res.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDto> itemDtos = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                OrderItemDto dto = new OrderItemDto();
                dto.setId(item.getId());
                if (item.getProduct() != null) {
                    dto.setProductId(item.getProduct().getId());
                }
                dto.setProductName(item.getProductName());
                dto.setProductImage(item.getProductImage());
                dto.setProductSku(item.getProductSku());
                dto.setQuantity(item.getQuantity());
                dto.setUnitPrice(item.getUnitPrice());
                dto.setTotalPrice(item.getTotalPrice());
                dto.setAllocatedLocationId(item.getAllocatedLocationId());
                dto.setAllocatedLocationName(item.getAllocatedLocationName());
                dto.setBinRackNumber(item.getBinRackNumber());
                dto.setItemStatus(item.getItemStatus());
                itemDtos.add(dto);
            }
        }
        res.setItems(itemDtos);

        return res;
    }
}
