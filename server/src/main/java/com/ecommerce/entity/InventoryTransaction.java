package com.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryTransactionType transactionType;

    @Column(nullable = false)
    private int quantity;

    private int previousOnHand;
    private int newOnHand;

    private int previousReserved;
    private int newReserved;

    private String referenceNumber;
    private String performedBy;

    @Column(length = 1000)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public InventoryTransaction() {}

    public InventoryTransaction(Inventory inventory, Product product, Location location, Order order,
                              InventoryTransactionType transactionType, int quantity,
                              int previousOnHand, int newOnHand, int previousReserved, int newReserved,
                              String referenceNumber, String performedBy, String notes) {
        this.inventory = inventory;
        this.product = product;
        this.location = location;
        this.order = order;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.previousOnHand = previousOnHand;
        this.newOnHand = newOnHand;
        this.previousReserved = previousReserved;
        this.newReserved = newReserved;
        this.referenceNumber = referenceNumber;
        this.performedBy = performedBy;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Inventory getInventory() { return inventory; }
    public void setInventory(Inventory inventory) { this.inventory = inventory; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public InventoryTransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(InventoryTransactionType transactionType) { this.transactionType = transactionType; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getPreviousOnHand() { return previousOnHand; }
    public void setPreviousOnHand(int previousOnHand) { this.previousOnHand = previousOnHand; }

    public int getNewOnHand() { return newOnHand; }
    public void setNewOnHand(int newOnHand) { this.newOnHand = newOnHand; }

    public int getPreviousReserved() { return previousReserved; }
    public void setPreviousReserved(int previousReserved) { this.previousReserved = previousReserved; }

    public int getNewReserved() { return newReserved; }
    public void setNewReserved(int newReserved) { this.newReserved = newReserved; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
