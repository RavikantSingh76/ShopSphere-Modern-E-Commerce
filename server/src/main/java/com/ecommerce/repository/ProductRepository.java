package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);

    Page<Product> findByActiveTrue(Pageable pageable);

    List<Product> findByFeaturedTrueAndActiveTrue();
    List<Product> findByIsNewArrivalTrueAndActiveTrue();
    List<Product> findByIsBestSellerTrueAndActiveTrue();
    List<Product> findByIsTrendingTrueAndActiveTrue();

    @Query("SELECT p FROM Product p LEFT JOIN p.category c LEFT JOIN p.brand b WHERE p.active = true " +
           "AND (:categorySlug IS NULL OR (c IS NOT NULL AND LOWER(c.slug) = LOWER(:categorySlug))) " +
           "AND (:brandSlug IS NULL OR (b IS NOT NULL AND LOWER(b.slug) = LOWER(:brandSlug))) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:minRating IS NULL OR p.averageRating >= :minRating) " +
           "AND (:inStockOnly = false OR p.stockQuantity > 0) " +
           "AND (:minDiscount IS NULL OR p.discountPercent >= :minDiscount) " +
           "AND (:query IS NULL OR (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))))")
    Page<Product> findFilteredProducts(
            @Param("categorySlug") String categorySlug,
            @Param("brandSlug") String brandSlug,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            @Param("inStockOnly") boolean inStockOnly,
            @Param("minDiscount") Integer minDiscount,
            @Param("query") String query,
            Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN p.category c LEFT JOIN p.brand b WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " (c IS NOT NULL AND LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) OR " +
           " (b IS NOT NULL AND LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    List<Product> searchLiveSuggestions(@Param("keyword") String keyword, Pageable pageable);

    List<Product> findByCategorySlugAndIdNotAndActiveTrue(String categorySlug, Long productId, Pageable pageable);

    long countByStockQuantityLessThan(int threshold);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :quantity WHERE p.id = :productId AND p.stockQuantity >= :quantity")
    int decrementStockIfAvailable(@Param("productId") Long productId, @Param("quantity") int quantity);
}
