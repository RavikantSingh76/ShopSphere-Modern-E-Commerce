package com.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "location_id"})
})
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int quantityOnHand = 0;

    @Column(nullable = false)
    private int quantityReserved = 0;

    @Column(nullable = false)
    private int quantityAvailable = 0;

    @Column(nullable = false)
    private int minStockAlert = 10;

    private String binRackNumber;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.quantityAvailable = Math.max(0, this.quantityOnHand - this.quantityReserved);
        this.updatedAt = LocalDateTime.now();
    }

    public Inventory() {}

    public Inventory(Product product, Location location, int quantityOnHand, int minStockAlert, String binRackNumber) {
        this.product = product;
        this.location = location;
        this.quantityOnHand = quantityOnHand;
        this.quantityReserved = 0;
        this.quantityAvailable = quantityOnHand;
        this.minStockAlert = minStockAlert;
        this.binRackNumber = binRackNumber;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public int getQuantityOnHand() { return quantityOnHand; }
    public void setQuantityOnHand(int quantityOnHand) {
        this.quantityOnHand = quantityOnHand;
        this.quantityAvailable = Math.max(0, this.quantityOnHand - this.quantityReserved);
    }

    public int getQuantityReserved() { return quantityReserved; }
    public void setQuantityReserved(int quantityReserved) {
        this.quantityReserved = quantityReserved;
        this.quantityAvailable = Math.max(0, this.quantityOnHand - this.quantityReserved);
    }

    public int getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(int quantityAvailable) { this.quantityAvailable = quantityAvailable; }

    public int getMinStockAlert() { return minStockAlert; }
    public void setMinStockAlert(int minStockAlert) { this.minStockAlert = minStockAlert; }

    public String getBinRackNumber() { return binRackNumber; }
    public void setBinRackNumber(String binRackNumber) { this.binRackNumber = binRackNumber; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
