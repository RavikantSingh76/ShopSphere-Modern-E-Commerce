package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndUser(Long id, User user);
    Optional<Order> findByOrderNumberAndUser(String orderNumber, User user);

    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus orderStatus, Pageable pageable);

    long countByOrderStatus(OrderStatus orderStatus);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus <> 'CANCELLED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate ORDER BY o.createdAt ASC")
    List<Order> findOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT o FROM Order o WHERE LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.shippingFullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.user.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Order> searchOrders(@Param("query") String query, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.deliveryPartner.id = :partnerId AND o.orderStatus IN ('OUT_FOR_DELIVERY', 'READY_TO_SHIP')")
    long countActiveOrdersByPartnerId(@Param("partnerId") Long partnerId);
}
