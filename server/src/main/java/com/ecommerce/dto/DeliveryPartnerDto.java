package com.ecommerce.dto;

import com.ecommerce.entity.DeliveryPartner.DeliveryStatus;
import jakarta.validation.constraints.NotBlank;

public class DeliveryPartnerDto {
    private Long id;

    @NotBlank(message = "Delivery partner name is required")
    private String name;

    @NotBlank(message = "Contact phone is required")
    private String phone;

    private String email;

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    private String vehicleType;
    private DeliveryStatus status;
    private String currentArea;
    private double rating;
    private int totalDeliveries;
    private boolean active = true;

    public DeliveryPartnerDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public String getCurrentArea() { return currentArea; }
    public void setCurrentArea(String currentArea) { this.currentArea = currentArea; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getTotalDeliveries() { return totalDeliveries; }
    public void setTotalDeliveries(int totalDeliveries) { this.totalDeliveries = totalDeliveries; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    private long activeOrders = 0;
    public long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(long activeOrders) { this.activeOrders = activeOrders; }
}
