package com.ecommerce.repository;

import com.ecommerce.entity.Inventory;
import com.ecommerce.entity.Location;
import com.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductAndLocation(Product product, Location location);
    Optional<Inventory> findByProductIdAndLocationId(Long productId, Long locationId);
    List<Inventory> findByProduct(Product product);
    List<Inventory> findByProductId(Long productId);
    List<Inventory> findByLocation(Location location);
    List<Inventory> findByLocationId(Long locationId);

    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.quantityAvailable >= :requiredQty ORDER BY i.location.type ASC, i.quantityAvailable DESC")
    List<Inventory> findAvailableInventoryForProduct(@Param("productId") Long productId, @Param("requiredQty") int requiredQty);

    @Query("SELECT i FROM Inventory i WHERE i.quantityAvailable <= i.minStockAlert")
    List<Inventory> findLowStockInventories();

    @Query("SELECT SUM(i.quantityAvailable) FROM Inventory i WHERE i.product.id = :productId")
    Integer getTotalAvailableQuantityForProduct(@Param("productId") Long productId);
}
