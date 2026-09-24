package com.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String productName;

    private String productImage;

    private String productSku;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Fulfillment & Multi-Warehouse Routing
    private Long allocatedLocationId;
    private String allocatedLocationName;
    private String binRackNumber;
    private String itemStatus = "PENDING"; // PENDING, PICKED, PACKED, SHIPPED

    public OrderItem() {}

    public OrderItem(Order order, Product product, String productName, String productImage, String productSku, int quantity, BigDecimal unitPrice) {
        this.order = order;
        this.product = product;
        this.productName = productName;
        this.productImage = productImage;
        this.productSku = productSku;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        this.itemStatus = "PENDING";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public Long getAllocatedLocationId() { return allocatedLocationId; }
    public void setAllocatedLocationId(Long allocatedLocationId) { this.allocatedLocationId = allocatedLocationId; }

    public String getAllocatedLocationName() { return allocatedLocationName; }
    public void setAllocatedLocationName(String allocatedLocationName) { this.allocatedLocationName = allocatedLocationName; }

    public String getBinRackNumber() { return binRackNumber; }
    public void setBinRackNumber(String binRackNumber) { this.binRackNumber = binRackNumber; }

    public String getItemStatus() { return itemStatus; }
    public void setItemStatus(String itemStatus) { this.itemStatus = itemStatus; }
}
