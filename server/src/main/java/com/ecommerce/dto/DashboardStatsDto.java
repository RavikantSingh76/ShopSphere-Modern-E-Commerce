package com.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private long pendingOrders;
    private long deliveredOrders;
    private long processingOrders;
    private long cancelledOrders;
    private long lowStockProducts;

    private List<OrderResponse> recentOrders;
    private List<TopProductDto> topSellingProducts;
    private Map<String, BigDecimal> monthlySales;
    private Map<String, Long> ordersByStatus;

    public DashboardStatsDto() {}

    public static class TopProductDto {
        private String name;
        private long unitsSold;
        private BigDecimal revenue;

        public TopProductDto() {}

        public TopProductDto(String name, long unitsSold, BigDecimal revenue) {
            this.name = name;
            this.unitsSold = unitsSold;
            this.revenue = revenue;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public long getUnitsSold() { return unitsSold; }
        public void setUnitsSold(long unitsSold) { this.unitsSold = unitsSold; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }

    public long getProcessingOrders() { return processingOrders; }
    public void setProcessingOrders(long processingOrders) { this.processingOrders = processingOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public long getLowStockProducts() { return lowStockProducts; }
    public void setLowStockProducts(long lowStockProducts) { this.lowStockProducts = lowStockProducts; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }

    public List<TopProductDto> getTopSellingProducts() { return topSellingProducts; }
    public void setTopSellingProducts(List<TopProductDto> topSellingProducts) { this.topSellingProducts = topSellingProducts; }

    public Map<String, BigDecimal> getMonthlySales() { return monthlySales; }
    public void setMonthlySales(Map<String, BigDecimal> monthlySales) { this.monthlySales = monthlySales; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }
}
