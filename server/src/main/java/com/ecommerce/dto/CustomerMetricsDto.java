package com.ecommerce.dto;

import java.math.BigDecimal;

public class CustomerMetricsDto {
    private long totalCustomers;
    private long activeUsers;
    private long disabledUsers;
    private BigDecimal averageLifetimeValue = BigDecimal.ZERO;
    private long newSignupsThisMonth;
    private double activePercentage;
    private long vipCustomers;

    public CustomerMetricsDto() {}

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getDisabledUsers() { return disabledUsers; }
    public void setDisabledUsers(long disabledUsers) { this.disabledUsers = disabledUsers; }

    public BigDecimal getAverageLifetimeValue() { return averageLifetimeValue; }
    public void setAverageLifetimeValue(BigDecimal averageLifetimeValue) { this.averageLifetimeValue = averageLifetimeValue; }

    public long getNewSignupsThisMonth() { return newSignupsThisMonth; }
    public void setNewSignupsThisMonth(long newSignupsThisMonth) { this.newSignupsThisMonth = newSignupsThisMonth; }

    public double getActivePercentage() { return activePercentage; }
    public void setActivePercentage(double activePercentage) { this.activePercentage = activePercentage; }

    public long getVipCustomers() { return vipCustomers; }
    public void setVipCustomers(long vipCustomers) { this.vipCustomers = vipCustomers; }
}
