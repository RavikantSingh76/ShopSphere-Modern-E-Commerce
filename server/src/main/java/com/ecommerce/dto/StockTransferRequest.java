package com.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockTransferRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Source Location ID is required")
    private Long fromLocationId;

    @NotNull(message = "Destination Location ID is required")
    private Long toLocationId;

    @NotNull(message = "Transfer quantity is required")
    @Min(value = 1, message = "Transfer quantity must be at least 1")
    private Integer quantity;

    private String performedBy;
    private String notes;

    public StockTransferRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getFromLocationId() { return fromLocationId; }
    public void setFromLocationId(Long fromLocationId) { this.fromLocationId = fromLocationId; }

    public Long getToLocationId() { return toLocationId; }
    public void setToLocationId(Long toLocationId) { this.toLocationId = toLocationId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
