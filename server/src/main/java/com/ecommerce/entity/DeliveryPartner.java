package com.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_partners")
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phone;

    private String email;

    @Column(nullable = false)
    private String vehicleNumber;

    private String vehicleType = "Two Wheeler (Bike)";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.AVAILABLE;

    private String currentArea = "Bengaluru Central";

    private double rating = 4.9;

    private int totalDeliveries = 0;

    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DeliveryStatus {
        AVAILABLE,
        ON_DELIVERY,
        OFFLINE
    }

    public DeliveryPartner() {}

    public DeliveryPartner(String name, String phone, String email, String vehicleNumber, String vehicleType, String currentArea) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.currentArea = currentArea;
        this.status = DeliveryStatus.AVAILABLE;
        this.rating = 4.8;
        this.totalDeliveries = 0;
        this.active = true;
    }

    // Getters and Setters
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
