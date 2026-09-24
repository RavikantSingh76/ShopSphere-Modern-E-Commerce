package com.ecommerce.dto;

import com.ecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class OrderStatusUpdateRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;

    private String trackingNumber;
    private String courierName;
    private LocalDateTime estimatedDeliveryDate;

    public OrderStatusUpdateRequest() {}

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCourierName() { return courierName; }
    public void setCourierName(String courierName) { this.courierName = courierName; }

    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
}
