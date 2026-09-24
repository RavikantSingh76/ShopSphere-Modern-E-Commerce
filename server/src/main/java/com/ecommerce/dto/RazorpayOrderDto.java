package com.ecommerce.dto;

import java.math.BigDecimal;

public class RazorpayOrderDto {
    private String razorpayOrderId;
    private BigDecimal amount;
    private long amountInPaise;
    private String currency;
    private String keyId;
    private String receipt;
    private String companyName;

    public RazorpayOrderDto() {}

    public RazorpayOrderDto(String razorpayOrderId, BigDecimal amount, long amountInPaise, String currency, String keyId, String receipt, String companyName) {
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.keyId = keyId;
        this.receipt = receipt;
        this.companyName = companyName;
    }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public long getAmountInPaise() { return amountInPaise; }
    public void setAmountInPaise(long amountInPaise) { this.amountInPaise = amountInPaise; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public String getReceipt() { return receipt; }
    public void setReceipt(String receipt) { this.receipt = receipt; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}
