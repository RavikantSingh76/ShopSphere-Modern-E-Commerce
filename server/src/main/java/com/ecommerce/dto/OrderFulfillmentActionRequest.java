package com.ecommerce.dto;

public class OrderFulfillmentActionRequest {
    // Pick fields
    private String pickedBy;
    private String pickerNotes;

    // Pack fields
    private String packedBy;
    private Double packageWeightKg;
    private String packageBoxSize;
    private String packageBarcode;

    // Ready To Ship / Dispatch fields
    private String manifestedBy;
    private Long deliveryPartnerId;
    private String courierName;
    private String trackingNumber;

    public OrderFulfillmentActionRequest() {}

    public String getPickedBy() { return pickedBy; }
    public void setPickedBy(String pickedBy) { this.pickedBy = pickedBy; }

    public String getPickerNotes() { return pickerNotes; }
    public void setPickerNotes(String pickerNotes) { this.pickerNotes = pickerNotes; }

    public String getPackedBy() { return packedBy; }
    public void setPackedBy(String packedBy) { this.packedBy = packedBy; }

    public Double getPackageWeightKg() { return packageWeightKg; }
    public void setPackageWeightKg(Double packageWeightKg) { this.packageWeightKg = packageWeightKg; }

    public String getPackageBoxSize() { return packageBoxSize; }
    public void setPackageBoxSize(String packageBoxSize) { this.packageBoxSize = packageBoxSize; }

    public String getPackageBarcode() { return packageBarcode; }
    public void setPackageBarcode(String packageBarcode) { this.packageBarcode = packageBarcode; }

    public String getManifestedBy() { return manifestedBy; }
    public void setManifestedBy(String manifestedBy) { this.manifestedBy = manifestedBy; }

    public Long getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(Long deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; }

    public String getCourierName() { return courierName; }
    public void setCourierName(String courierName) { this.courierName = courierName; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
}
