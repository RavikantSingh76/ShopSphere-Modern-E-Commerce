package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "false") boolean inStockOnly,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        PagedResponse<ProductResponse> products = productService.getProducts(
                category, brand, minPrice, maxPrice, minRating, inStockOnly, minDiscount, query, sortBy, sortDir, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductBySlug(@PathVariable String slug) {
        ProductResponse product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTrendingProducts() {
        return ResponseEntity.ok(ApiResponse.success(productService.getTrendingProducts()));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.success(productService.getNewArrivals()));
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestSellers() {
        return ResponseEntity.ok(ApiResponse.success(productService.getBestSellers()));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getSearchSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(ApiResponse.success(productService.getSearchSuggestions(query, limit)));
    }

    @GetMapping("/related")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getRelatedProducts(
            @RequestParam String category,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(ApiResponse.success(productService.getRelatedProducts(category, productId, limit)));
    }
}
