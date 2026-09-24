package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.WishlistResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getWishlistDto(user)));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> toggleWishlist(@PathVariable Long productId) {
        User user = authService.getCurrentAuthenticatedUser();
        boolean added = wishlistService.toggleWishlistItem(user, productId);
        String message = added ? "Added to wishlist" : "Removed from wishlist";
        return ResponseEntity.ok(ApiResponse.success(message, added));
    }

    @PostMapping("/move-to-cart/{productId}")
    public ResponseEntity<ApiResponse<Void>> moveToCart(@PathVariable Long productId) {
        User user = authService.getCurrentAuthenticatedUser();
        wishlistService.moveToCart(user, productId);
        return ResponseEntity.ok(ApiResponse.success("Item moved to cart", null));
    }
}
