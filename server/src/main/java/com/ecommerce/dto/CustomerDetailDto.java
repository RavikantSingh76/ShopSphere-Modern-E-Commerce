package com.ecommerce.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CustomerDetailDto {
    private UserDto user;
    private List<OrderResponse> orders = new ArrayList<>();
    private BigDecimal lifetimeValue = BigDecimal.ZERO;
    private int totalOrders = 0;
    private BigDecimal averageOrderValue = BigDecimal.ZERO;
    private List<AddressDto> addresses = new ArrayList<>();

    public CustomerDetailDto() {}

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public List<OrderResponse> getOrders() { return orders; }
    public void setOrders(List<OrderResponse> orders) { this.orders = orders; }

    public BigDecimal getLifetimeValue() { return lifetimeValue; }
    public void setLifetimeValue(BigDecimal lifetimeValue) { this.lifetimeValue = lifetimeValue; }

    public int getTotalOrders() { return totalOrders; }
    public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public List<AddressDto> getAddresses() { return addresses; }
    public void setAddresses(List<AddressDto> addresses) { this.addresses = addresses; }
}
