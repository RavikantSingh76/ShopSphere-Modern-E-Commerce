package com.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockAdjustmentRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Location ID is required")
    private Long locationId;

    @NotNull(message = "New on-hand quantity is required")
    @Min(value = 0, message = "On-hand quantity cannot be negative")
    private Integer newQuantityOnHand;

    private String binRackNumber;
    private String performedBy;
    private String notes;

    public StockAdjustmentRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public Integer getNewQuantityOnHand() { return newQuantityOnHand; }
    public void setNewQuantityOnHand(Integer newQuantityOnHand) { this.newQuantityOnHand = newQuantityOnHand; }

    public String getBinRackNumber() { return binRackNumber; }
    public void setBinRackNumber(String binRackNumber) { this.binRackNumber = binRackNumber; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
