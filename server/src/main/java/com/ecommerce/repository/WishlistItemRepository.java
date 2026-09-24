package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByWishlistAndProduct(Wishlist wishlist, Product product);
    boolean existsByWishlistAndProduct(Wishlist wishlist, Product product);
    void deleteByWishlistAndProduct(Wishlist wishlist, Product product);
}
