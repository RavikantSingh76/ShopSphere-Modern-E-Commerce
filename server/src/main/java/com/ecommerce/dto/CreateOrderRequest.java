package com.ecommerce.dto;

import com.ecommerce.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {
    @NotNull(message = "Shipping address is required")
    private AddressDto shippingAddress;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod = PaymentMethod.COD;

    private String couponCode;
    private String notes;

    public CreateOrderRequest() {}

    public AddressDto getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(AddressDto shippingAddress) { this.shippingAddress = shippingAddress; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
