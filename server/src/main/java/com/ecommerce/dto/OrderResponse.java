package com.ecommerce.dto;

import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.PaymentMethod;
import com.ecommerce.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private String userEmail;
    private AddressDto shippingAddress;
    private OrderStatus orderStatus;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private String paymentGateway;
    private LocalDateTime paidAt;
    private String trackingNumber;
    private String courierName;
    private LocalDateTime estimatedDeliveryDate;
    private DeliveryPartnerDto deliveryPartner;
    private String deliveryOtp;
    private LocalDateTime deliveryAssignedAt;
    private LocalDateTime deliveredAt;

    // Warehouse Fulfillment Fields
    private Long fulfillmentLocationId;
    private String fulfillmentLocationName;
    private String fulfillmentLocationCode;
    private LocalDateTime pickedAt;
    private String pickedBy;
    private String pickerNotes;
    private LocalDateTime packedAt;
    private String packedBy;
    private Double packageWeightKg;
    private String packageBoxSize;
    private String packageBarcode;
    private LocalDateTime readyToShipAt;
    private String manifestBatchId;

    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String couponCode;
    private String notes;
    private List<OrderItemDto> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public AddressDto getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(AddressDto shippingAddress) { this.shippingAddress = shippingAddress; }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPaymentGateway() { return paymentGateway; }
    public void setPaymentGateway(String paymentGateway) { this.paymentGateway = paymentGateway; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCourierName() { return courierName; }
    public void setCourierName(String courierName) { this.courierName = courierName; }

    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }

    public DeliveryPartnerDto getDeliveryPartner() { return deliveryPartner; }
    public void setDeliveryPartner(DeliveryPartnerDto deliveryPartner) { this.deliveryPartner = deliveryPartner; }

    public String getDeliveryOtp() { return deliveryOtp; }
    public void setDeliveryOtp(String deliveryOtp) { this.deliveryOtp = deliveryOtp; }

    public LocalDateTime getDeliveryAssignedAt() { return deliveryAssignedAt; }
    public void setDeliveryAssignedAt(LocalDateTime deliveryAssignedAt) { this.deliveryAssignedAt = deliveryAssignedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public Long getFulfillmentLocationId() { return fulfillmentLocationId; }
    public void setFulfillmentLocationId(Long fulfillmentLocationId) { this.fulfillmentLocationId = fulfillmentLocationId; }

    public String getFulfillmentLocationName() { return fulfillmentLocationName; }
    public void setFulfillmentLocationName(String fulfillmentLocationName) { this.fulfillmentLocationName = fulfillmentLocationName; }

    public String getFulfillmentLocationCode() { return fulfillmentLocationCode; }
    public void setFulfillmentLocationCode(String fulfillmentLocationCode) { this.fulfillmentLocationCode = fulfillmentLocationCode; }

    public LocalDateTime getPickedAt() { return pickedAt; }
    public void setPickedAt(LocalDateTime pickedAt) { this.pickedAt = pickedAt; }

    public String getPickedBy() { return pickedBy; }
    public void setPickedBy(String pickedBy) { this.pickedBy = pickedBy; }

    public String getPickerNotes() { return pickerNotes; }
    public void setPickerNotes(String pickerNotes) { this.pickerNotes = pickerNotes; }

    public LocalDateTime getPackedAt() { return packedAt; }
    public void setPackedAt(LocalDateTime packedAt) { this.packedAt = packedAt; }

    public String getPackedBy() { return packedBy; }
    public void setPackedBy(String packedBy) { this.packedBy = packedBy; }

    public Double getPackageWeightKg() { return packageWeightKg; }
    public void setPackageWeightKg(Double packageWeightKg) { this.packageWeightKg = packageWeightKg; }

    public String getPackageBoxSize() { return packageBoxSize; }
    public void setPackageBoxSize(String packageBoxSize) { this.packageBoxSize = packageBoxSize; }

    public String getPackageBarcode() { return packageBarcode; }
    public void setPackageBarcode(String packageBarcode) { this.packageBarcode = packageBarcode; }

    public LocalDateTime getReadyToShipAt() { return readyToShipAt; }
    public void setReadyToShipAt(LocalDateTime readyToShipAt) { this.readyToShipAt = readyToShipAt; }

    public String getManifestBatchId() { return manifestBatchId; }
    public void setManifestBatchId(String manifestBatchId) { this.manifestBatchId = manifestBatchId; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
