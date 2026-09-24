package com.ecommerce.dto;

import com.ecommerce.entity.InventoryTransactionType;
import java.time.LocalDateTime;

public class InventoryTransactionDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Long locationId;
    private String locationName;
    private Long orderId;
    private String orderNumber;
    private InventoryTransactionType transactionType;
    private int quantity;
    private int previousOnHand;
    private int newOnHand;
    private int previousReserved;
    private int newReserved;
    private String referenceNumber;
    private String performedBy;
    private String notes;
    private LocalDateTime createdAt;

    public InventoryTransactionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public InventoryTransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(InventoryTransactionType transactionType) { this.transactionType = transactionType; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getPreviousOnHand() { return previousOnHand; }
    public void setPreviousOnHand(int previousOnHand) { this.previousOnHand = previousOnHand; }

    public int getNewOnHand() { return newOnHand; }
    public void setNewOnHand(int newOnHand) { this.newOnHand = newOnHand; }

    public int getPreviousReserved() { return previousReserved; }
    public void setPreviousReserved(int previousReserved) { this.previousReserved = previousReserved; }

    public int getNewReserved() { return newReserved; }
    public void setNewReserved(int newReserved) { this.newReserved = newReserved; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
