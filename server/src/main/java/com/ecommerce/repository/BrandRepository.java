package com.ecommerce.repository;

import com.ecommerce.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findBySlug(String slug);
    Optional<Brand> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    boolean existsBySlug(String slug);
    List<Brand> findByActiveTrueOrderByNameAsc();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.brand FROM Product p WHERE p.active = true AND p.category.slug = :categorySlug AND p.brand IS NOT NULL ORDER BY p.brand.name ASC")
    List<Brand> findDistinctActiveBrandsByCategorySlug(@org.springframework.data.repository.query.Param("categorySlug") String categorySlug);
}
