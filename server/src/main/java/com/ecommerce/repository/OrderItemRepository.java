package com.ecommerce.repository;

import com.ecommerce.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.productName, SUM(oi.quantity), SUM(oi.totalPrice) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.orderStatus <> 'CANCELLED' " +
           "GROUP BY oi.productName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);
}
