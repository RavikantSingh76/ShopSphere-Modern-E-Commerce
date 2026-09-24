package com.ecommerce.service;

import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.WishlistItemDto;
import com.ecommerce.dto.WishlistResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.entity.WishlistItem;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.WishlistItemRepository;
import com.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Transactional
    public Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> wishlistRepository.save(new Wishlist(user)));
    }

    @Transactional(readOnly = true)
    public WishlistResponse getWishlistDto(User user) {
        Wishlist wishlist = getOrCreateWishlist(user);
        return mapToWishlistResponse(wishlist);
    }

    @Transactional
    public boolean toggleWishlistItem(User user, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistAndProduct(wishlist, product);
        if (existing.isPresent()) {
            wishlist.getItems().remove(existing.get());
            wishlistItemRepository.delete(existing.get());
            return false; // Removed
        } else {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlist.getItems().add(item);
            wishlistItemRepository.save(item);
            return true; // Added
        }
    }

    @Transactional
    public void moveToCart(User user, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        // Add to cart
        cartService.addItem(user, new CartItemRequest(productId, 1));

        // Remove from wishlist
        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistAndProduct(wishlist, product);
        if (existing.isPresent()) {
            wishlist.getItems().remove(existing.get());
            wishlistItemRepository.delete(existing.get());
        }
    }

    public WishlistResponse mapToWishlistResponse(Wishlist wishlist) {
        WishlistResponse res = new WishlistResponse();
        res.setId(wishlist.getId());

        List<WishlistItemDto> items = new ArrayList<>();
        if (wishlist.getItems() != null) {
            for (WishlistItem item : wishlist.getItems()) {
                Product p = item.getProduct();
                WishlistItemDto dto = new WishlistItemDto();
                dto.setId(item.getId());
                dto.setProductId(p.getId());
                dto.setProductName(p.getName());
                dto.setProductSlug(p.getSlug());
                dto.setProductImage(p.getPrimaryImageUrl());
                dto.setPrice(p.getPrice());
                dto.setDiscountedPrice(p.getDiscountedPrice());
                dto.setDiscountPercent(p.getDiscountPercent());
                dto.setInStock(p.getStockQuantity() > 0 && p.isActive());
                dto.setAverageRating(p.getAverageRating());
                dto.setAddedAt(item.getAddedAt());
                items.add(dto);
            }
        }

        res.setItems(items);
        res.setTotalCount(items.size());
        return res;
    }
}
