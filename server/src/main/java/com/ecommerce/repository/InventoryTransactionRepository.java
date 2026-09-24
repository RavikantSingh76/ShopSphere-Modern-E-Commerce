package com.ecommerce.repository;

import com.ecommerce.entity.InventoryTransaction;
import com.ecommerce.entity.InventoryTransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<InventoryTransaction> findByLocationIdOrderByCreatedAtDesc(Long locationId);
    List<InventoryTransaction> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    Page<InventoryTransaction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT it FROM InventoryTransaction it WHERE " +
           "(:productId IS NULL OR it.product.id = :productId) AND " +
           "(:locationId IS NULL OR it.location.id = :locationId) AND " +
           "(:type IS NULL OR it.transactionType = :type) " +
           "ORDER BY it.createdAt DESC")
    Page<InventoryTransaction> searchTransactions(@Param("productId") Long productId,
                                                 @Param("locationId") Long locationId,
                                                 @Param("type") InventoryTransactionType type,
                                                 Pageable pageable);
}
