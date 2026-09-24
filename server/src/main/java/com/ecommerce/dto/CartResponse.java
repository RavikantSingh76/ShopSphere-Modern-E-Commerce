package com.ecommerce.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private Long id;
    private List<CartItemDto> items = new ArrayList<>();
    private int totalItemCount;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal shipping = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;

    public CartResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public int getTotalItemCount() { return totalItemCount; }
    public void setTotalItemCount(int totalItemCount) { this.totalItemCount = totalItemCount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getShipping() { return shipping; }
    public void setShipping(BigDecimal shipping) { this.shipping = shipping; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
