package com.ecommerce.dto;

import java.math.BigDecimal;

public class OrderItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String productSku;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private Long allocatedLocationId;
    private String allocatedLocationName;
    private String binRackNumber;
    private String itemStatus;

    public OrderItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public Long getAllocatedLocationId() { return allocatedLocationId; }
    public void setAllocatedLocationId(Long allocatedLocationId) { this.allocatedLocationId = allocatedLocationId; }

    public String getAllocatedLocationName() { return allocatedLocationName; }
    public void setAllocatedLocationName(String allocatedLocationName) { this.allocatedLocationName = allocatedLocationName; }

    public String getBinRackNumber() { return binRackNumber; }
    public void setBinRackNumber(String binRackNumber) { this.binRackNumber = binRackNumber; }

    public String getItemStatus() { return itemStatus; }
    public void setItemStatus(String itemStatus) { this.itemStatus = itemStatus; }
}
