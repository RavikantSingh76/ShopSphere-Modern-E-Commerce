package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.Role;
import com.ecommerce.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private BulkProductService bulkProductService;

    @Autowired
    private com.ecommerce.config.CatalogDiverseBrandsSeeder catalogDiverseBrandsSeeder;

    @Autowired
    private com.ecommerce.service.storage.StorageService storageService;

    // --- Diverse Brands Catalog Seeder (20+ authentic brands per category) ---
    @PostMapping("/seed-diverse-catalog")
    public ResponseEntity<ApiResponse<Map<String, Object>>> seedDiverseCatalog() {
        int seeded = catalogDiverseBrandsSeeder.seedDiverseCatalogWith20BrandsPerCategory();
        return ResponseEntity.ok(ApiResponse.success("Successfully seeded 20+ authentic brands per category", Map.of("seededCount", seeded)));
    }

    // --- Bulk Product Generator (e.g. 50,000 products) ---
    @PostMapping("/seed-products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> seedBulkProducts(@RequestParam(defaultValue = "50000") int count) {
        int inserted = bulkProductService.seedBulkProducts(count);
        return ResponseEntity.ok(ApiResponse.success("Successfully generated and inserted " + inserted + " products into catalog", Map.of("insertedCount", inserted)));
    }

    @PostMapping("/reseed-accurate-products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reseedAccurateProducts(@RequestParam(defaultValue = "50000") int count) {
        int inserted = bulkProductService.resetAndReseedAccurateCatalog(count);
        return ResponseEntity.ok(ApiResponse.success("Successfully synchronized and re-seeded catalog with " + inserted + " 100% accurate products", Map.of("insertedCount", inserted)));
    }

    @PostMapping("/purge-random-products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> purgeRandomProducts() {
        int deleted = bulkProductService.purgeRandomProducts();
        return ResponseEntity.ok(ApiResponse.success("Successfully purged " + deleted + " random products from database", Map.of("deletedCount", deleted)));
    }

    @PostMapping("/clean-order-items")
    public ResponseEntity<ApiResponse<String>> cleanOrderItems() {
        bulkProductService.cleanOrderItemNames();
        return ResponseEntity.ok(ApiResponse.success("Successfully cleaned random names from order items"));
    }

    @PostMapping("/reset-orders")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resetOrders() {
        int deleted = bulkProductService.resetAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Successfully reset all orders and transaction history", Map.of("deletedCount", deleted)));
    }

    // --- Dashboard & Analytics ---
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    // --- Product Management ---
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return new ResponseEntity<>(ApiResponse.success("Product created successfully", product), HttpStatus.CREATED);
    }

    @PostMapping("/products/bulk-import")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkImportProducts(@RequestBody List<ProductRequest> requests) {
        Map<String, Object> result = productService.bulkImportProducts(requests);
        return ResponseEntity.ok(ApiResponse.success("Catalog bulk import processed successfully", result));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @PostMapping("/products/upload-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProductImage(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            String fileUrl = storageService.upload(file, "products");
            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", Map.of("imageUrl", fileUrl)));
        } catch (com.ecommerce.exception.BadRequestException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    // --- Category Management ---
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CategoryDto dto) {
        CategoryDto category = categoryService.createCategory(dto);
        return new ResponseEntity<>(ApiResponse.success("Category created successfully", category), HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDto dto) {
        CategoryDto category = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // --- Brand Management ---
    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<BrandDto>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.success(brandService.getAllBrands()));
    }

    @PostMapping("/brands")
    public ResponseEntity<ApiResponse<BrandDto>> createBrand(@Valid @RequestBody BrandDto dto) {
        BrandDto brand = brandService.createBrand(dto);
        return new ResponseEntity<>(ApiResponse.success("Brand created successfully", brand), HttpStatus.CREATED);
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<BrandDto>> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandDto dto) {
        BrandDto brand = brandService.updateBrand(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Brand updated successfully", brand));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success("Brand deleted successfully", null));
    }

    // --- Order Management ---
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(page, size, status, query)));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated", orderService.updateOrderStatus(id, request)));
    }

    // --- User Management ---
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody AdminUserCreateDto request) {
        UserDto user = adminService.createUser(request);
        return new ResponseEntity<>(ApiResponse.success("User account created successfully", user), HttpStatus.CREATED);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUserUpdateDto request) {
        UserDto user = adminService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User account updated successfully", user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account deleted successfully", null));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> getAllUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers(query, role, enabled, page, size)));
    }

    @GetMapping("/users/metrics")
    public ResponseEntity<ApiResponse<com.ecommerce.dto.CustomerMetricsDto>> getCustomerMetrics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getCustomerMetrics()));
    }

    @GetMapping("/users/{id}/details")
    public ResponseEntity<ApiResponse<com.ecommerce.dto.CustomerDetailDto>> getCustomerDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getCustomerDetails(id)));
    }

    @PutMapping("/users/{id}/notes-tags")
    public ResponseEntity<ApiResponse<UserDto>> updateNotesAndTags(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String notes = payload.get("notes");
        String tags = payload.get("tags");
        return ResponseEntity.ok(ApiResponse.success("Notes and tags updated", adminService.updateNotesAndTags(id, notes, tags)));
    }

    @PostMapping("/users/{id}/impersonate")
    public ResponseEntity<ApiResponse<com.ecommerce.dto.AuthResponse>> impersonateUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Impersonation session created", adminService.impersonateUser(id)));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        boolean enabled = payload.getOrDefault("enabled", true);
        return ResponseEntity.ok(ApiResponse.success("User status updated", adminService.toggleUserStatus(id, enabled)));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDto>> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        Role role = Role.valueOf(payload.get("role"));
        return ResponseEntity.ok(ApiResponse.success("User role updated", adminService.changeUserRole(id, role)));
    }

    // --- Coupon Management ---
    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<List<CouponDto>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @PostMapping("/coupons")
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(@Valid @RequestBody CouponDto dto) {
        return new ResponseEntity<>(ApiResponse.success("Coupon created successfully", couponService.createCoupon(dto)), HttpStatus.CREATED);
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<CouponDto>> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", couponService.updateCoupon(id, dto)));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }
}
