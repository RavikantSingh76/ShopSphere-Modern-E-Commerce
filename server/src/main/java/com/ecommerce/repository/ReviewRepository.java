package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductOrderByCreatedAtDesc(Product product);
    Page<Review> findByProductOrderByCreatedAtDesc(Product product, Pageable pageable);
    List<Review> findByUserOrderByCreatedAtDesc(User user);

    boolean existsByUserAndProduct(User user, Product product);
    Optional<Review> findByUserAndProduct(User user, Product product);

    @Query("SELECT AVG(r.rating), COUNT(r) FROM Review r WHERE r.product.id = :productId")
    List<Object[]> getAverageRatingAndCount(@Param("productId") Long productId);
}
