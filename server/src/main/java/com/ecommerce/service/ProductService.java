package com.ecommerce.service;

import com.ecommerce.dto.CategoryDto;
import com.ecommerce.dto.BrandDto;
import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Brand;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductImage;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductImageRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public PagedResponse<ProductResponse> getProducts(
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            boolean inStockOnly,
            Integer minDiscount,
            String query,
            String sortBy,
            String sortDir,
            int page,
            int size) {

        Sort sort;
        if ("price".equalsIgnoreCase(sortBy)) {
            sort = "desc".equalsIgnoreCase(sortDir) ? Sort.by("price").descending() : Sort.by("price").ascending();
        } else if ("stock".equalsIgnoreCase(sortBy) || "stockQuantity".equalsIgnoreCase(sortBy)) {
            sort = "desc".equalsIgnoreCase(sortDir) ? Sort.by("stockQuantity").descending() : Sort.by("stockQuantity").ascending();
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("averageRating").descending();
        } else if ("popularity".equalsIgnoreCase(sortBy) || "reviews".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("reviewCount").descending();
        } else if ("name".equalsIgnoreCase(sortBy)) {
            sort = "desc".equalsIgnoreCase(sortDir) ? Sort.by("name").descending() : Sort.by("name").ascending();
        } else {
            // Default newest
            sort = Sort.by("createdAt").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        // Normalize common category aliases
        String normalizedCategory = (categorySlug != null && !categorySlug.isBlank()) ? categorySlug.trim() : null;
        if (normalizedCategory != null) {
            String lower = normalizedCategory.toLowerCase();
            if ("beauty".equals(lower) || "personal-care".equals(lower)) {
                normalizedCategory = "beauty-personal-care";
            } else if ("sports".equals(lower) || "fitness".equals(lower) || "sports-fitness".equals(lower)) {
                normalizedCategory = "sports-outdoors";
            } else if ("books".equals(lower) || "stationery".equals(lower) || "books-and-stationery".equals(lower)) {
                normalizedCategory = "books-stationery";
            } else if ("home".equals(lower) || "living".equals(lower) || "home-and-living".equals(lower)) {
                normalizedCategory = "home-living";
            }
        }

        Page<Product> productPage = productRepository.findFilteredProducts(
                normalizedCategory,
                (brandSlug != null && !brandSlug.isBlank()) ? brandSlug.trim() : null,
                minPrice,
                maxPrice,
                minRating,
                inStockOnly,
                minDiscount,
                (query != null && !query.isBlank()) ? query.trim() : null,
                pageable
        );

        List<ProductResponse> responses = productPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                responses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return mapToResponse(product);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getTrendingProducts() {
        return productRepository.findByIsTrendingTrueAndActiveTrue().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrueAndActiveTrue().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getBestSellers() {
        return productRepository.findByIsBestSellerTrueAndActiveTrue().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getRelatedProducts(String categorySlug, Long currentProductId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findByCategorySlugAndIdNotAndActiveTrue(categorySlug, currentProductId, pageable).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getSearchSuggestions(String keyword, int limit) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.searchLiveSuggestions(keyword.trim(), pageable).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("-$", "")
                    + "-" + System.currentTimeMillis() % 10000;
        }

        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + (System.currentTimeMillis() % 100000) + (int)(Math.random() * 900 + 100);
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(slug);

        String shortDesc = request.getShortDescription() != null ? request.getShortDescription() : request.getName();
        if (shortDesc.length() > 450) {
            shortDesc = shortDesc.substring(0, 450);
        }
        product.setShortDescription(shortDesc);

        product.setDescription(request.getDescription() != null ? request.getDescription() : request.getName());
        product.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.valueOf(999));
        product.setDiscountPercent(request.getDiscountPercent());
        product.setStockQuantity(request.getStockQuantity() > 0 ? request.getStockQuantity() : 25);
        product.setSku(request.getSku() != null && !request.getSku().isBlank() ? request.getSku() : "SKU-" + System.currentTimeMillis() % 100000 + "-" + (int)(Math.random() * 1000));
        product.setFeatured(request.isFeatured());
        product.setNewArrival(request.isNewArrival());
        product.setBestSeller(request.isBestSeller());
        product.setTrending(request.isTrending());
        product.setSpecifications(request.getSpecifications());
        product.setActive(request.isActive());

        // Category Resolution: ID -> Slug -> Name -> Default
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }
        if (category == null && request.getCategorySlug() != null && !request.getCategorySlug().isBlank()) {
            category = categoryRepository.findBySlug(request.getCategorySlug().trim().toLowerCase()).orElse(null);
        }
        if (category == null && request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            category = categoryRepository.findByNameIgnoreCase(request.getCategoryName().trim()).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findBySlug("electronics").orElseGet(() -> categoryRepository.findAll().stream().findFirst().orElse(null));
        }
        product.setCategory(category);

        // Brand Resolution: ID -> Name -> Slug (Auto-Create Brand if non-existent)
        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId()).orElse(null);
        }
        if (brand == null && request.getBrandName() != null && !request.getBrandName().isBlank()) {
            String bName = request.getBrandName().trim();
            String bSlug = bName.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("-$", "");
            brand = brandRepository.findByNameIgnoreCase(bName)
                    .or(() -> brandRepository.findBySlug(bSlug))
                    .orElseGet(() -> {
                        Brand newB = new Brand();
                        newB.setName(bName);
                        newB.setSlug(bSlug);
                        newB.setDescription(bName + " Catalog Brand");
                        newB.setActive(true);
                        return brandRepository.save(newB);
                    });
        }
        product.setBrand(brand);

        List<String> validUrls = new ArrayList<>();
        if (request.getImageUrls() != null) {
            for (String u : request.getImageUrls()) {
                if (u != null && !u.isBlank() && !validUrls.contains(u.trim())) {
                    validUrls.add(u.trim());
                }
            }
        }

        String primary = (request.getPrimaryImageUrl() != null && !request.getPrimaryImageUrl().isBlank())
                ? request.getPrimaryImageUrl().trim()
                : (!validUrls.isEmpty() ? validUrls.get(0) : null);

        product.setPrimaryImageUrl(primary);

        Product savedProduct = productRepository.save(product);

        // Save images
        if (!validUrls.isEmpty()) {
            List<ProductImage> imageEntities = new ArrayList<>();
            for (int i = 0; i < validUrls.size(); i++) {
                String imgUrl = validUrls.get(i);
                boolean isPrimary = (primary != null && primary.equalsIgnoreCase(imgUrl)) || (primary == null && i == 0);
                imageEntities.add(new ProductImage(imgUrl, isPrimary, i, savedProduct));
            }
            savedProduct.getImages().clear();
            savedProduct.getImages().addAll(imageEntities);
            savedProduct = productRepository.save(savedProduct);
        } else if (primary != null) {
            savedProduct.getImages().clear();
            savedProduct.getImages().add(new ProductImage(primary, true, 0, savedProduct));
            savedProduct = productRepository.save(savedProduct);
        }

        return mapToResponse(savedProduct);
    }

    public Map<String, Object> bulkImportProducts(List<ProductRequest> requests) {
        int imported = 0;
        int skipped = 0;
        List<String> importedNames = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (ProductRequest req : requests) {
            try {
                if (req.getName() == null || req.getName().isBlank()) {
                    skipped++;
                    continue;
                }
                ProductResponse created = createProduct(req);
                imported++;
                importedNames.add(created.getName());
            } catch (Exception e) {
                skipped++;
                errors.add("Failed to import '" + req.getName() + "': " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalRequested", requests.size());
        response.put("importedCount", imported);
        response.put("skippedCount", skipped);
        response.put("importedNames", importedNames);
        response.put("errors", errors);
        return response;
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(request.getName());
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            product.setSlug(request.getSlug());
        }
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPercent(request.getDiscountPercent());
        product.setStockQuantity(request.getStockQuantity());
        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        product.setFeatured(request.isFeatured());
        product.setNewArrival(request.isNewArrival());
        product.setBestSeller(request.isBestSeller());
        product.setTrending(request.isTrending());
        product.setSpecifications(request.getSpecifications());
        product.setActive(request.isActive());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getBrandId()));
            product.setBrand(brand);
        }

        if (request.getImageUrls() != null) {
            List<String> validUrls = new ArrayList<>();
            for (String u : request.getImageUrls()) {
                if (u != null && !u.isBlank() && !validUrls.contains(u.trim())) {
                    validUrls.add(u.trim());
                }
            }

            String primary = (request.getPrimaryImageUrl() != null && !request.getPrimaryImageUrl().isBlank())
                    ? request.getPrimaryImageUrl().trim()
                    : (!validUrls.isEmpty() ? validUrls.get(0) : null);

            product.setPrimaryImageUrl(primary);

            // Cleanly clear and rebuild collection
            product.getImages().clear();
            for (int i = 0; i < validUrls.size(); i++) {
                String imgUrl = validUrls.get(i);
                boolean isPrimary = (primary != null && primary.equalsIgnoreCase(imgUrl)) || (primary == null && i == 0);
                product.getImages().add(new ProductImage(imgUrl, isPrimary, i, product));
            }

            if (primary != null && !validUrls.contains(primary)) {
                product.getImages().add(0, new ProductImage(primary, true, 0, product));
            }
        } else if (request.getPrimaryImageUrl() != null && !request.getPrimaryImageUrl().isBlank()) {
            String primary = request.getPrimaryImageUrl().trim();
            product.setPrimaryImageUrl(primary);
            if (product.getImages().isEmpty()) {
                product.getImages().add(new ProductImage(primary, true, 0, product));
            }
        }

        Product updatedProduct = productRepository.saveAndFlush(product);
        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        try {
            // 1. Detach from historical order items (preserves order receipts, removes FK lock)
            jdbcTemplate.update("UPDATE order_items SET product_id = NULL WHERE product_id = ?", id);

            // 2. Remove inventory transactions and inventories
            jdbcTemplate.update("DELETE FROM inventory_transactions WHERE product_id = ?", id);
            jdbcTemplate.update("DELETE FROM inventory WHERE product_id = ?", id);
            jdbcTemplate.update("DELETE FROM inventories WHERE product_id = ?", id);

            // 3. Remove reviews, cart items, wishlist items
            jdbcTemplate.update("DELETE FROM reviews WHERE product_id = ?", id);
            jdbcTemplate.update("DELETE FROM cart_items WHERE product_id = ?", id);
            jdbcTemplate.update("DELETE FROM wishlist_items WHERE product_id = ?", id);

            // 4. Remove product images
            jdbcTemplate.update("DELETE FROM product_images WHERE product_id = ?", id);
        } catch (Exception e) {
            System.err.println("Notice during related entities cleanup before product deletion: " + e.getMessage());
        }

        // 5. Delete product permanently
        productRepository.delete(product);
        System.out.println(">>> Product permanently deleted from database: ID " + id);
    }

    public ProductResponse mapToResponse(Product product) {
        if (product == null) return null;
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setSlug(product.getSlug());
        res.setShortDescription(product.getShortDescription());
        res.setDescription(product.getDescription());
        res.setPrice(product.getPrice());
        res.setDiscountPercent(product.getDiscountPercent());
        res.setDiscountedPrice(product.getDiscountedPrice());
        res.setStockQuantity(product.getStockQuantity());
        res.setSku(product.getSku());
        res.setCategory(categoryService.mapToDto(product.getCategory()));
        res.setBrand(brandService.mapToDto(product.getBrand()));

        // Resolve product images: prioritize saved primary image and product gallery images
        List<String> imgUrls = new ArrayList<>();
        String rawPrimary = product.getPrimaryImageUrl();

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            String primaryFromImages = null;
            for (ProductImage pi : product.getImages()) {
                if (pi != null && pi.isPrimary() && pi.getImageUrl() != null && !pi.getImageUrl().isBlank()) {
                    primaryFromImages = pi.getImageUrl().trim();
                    break;
                }
            }

            String activePrimary = (rawPrimary != null && !rawPrimary.isBlank())
                    ? rawPrimary.trim()
                    : primaryFromImages;

            if (activePrimary != null) {
                imgUrls.add(activePrimary);
            }

            for (ProductImage pi : product.getImages()) {
                if (pi != null && pi.getImageUrl() != null && !pi.getImageUrl().isBlank()) {
                    String u = pi.getImageUrl().trim();
                    if (!imgUrls.contains(u)) {
                        imgUrls.add(u);
                    }
                }
            }
        } else if (rawPrimary != null && !rawPrimary.isBlank()) {
            imgUrls.add(rawPrimary.trim());
        }

        // Only fallback to complementary archetype images if database has ZERO images for this product
        if (imgUrls.isEmpty()) {
            List<String> authenticModelImages = getComplementaryGalleryImages(product);
            for (String auth : authenticModelImages) {
                if (auth != null && !auth.isBlank() && !imgUrls.contains(auth.trim())) {
                    imgUrls.add(auth.trim());
                }
            }
        }

        if (imgUrls.isEmpty()) {
            imgUrls.add("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80");
        }

        res.setImages(imgUrls);
        res.setPrimaryImageUrl(rawPrimary != null && !rawPrimary.isBlank() ? rawPrimary.trim() : imgUrls.get(0));

        res.setFeatured(product.isFeatured());
        res.setNewArrival(product.isNewArrival());
        res.setBestSeller(product.isBestSeller());
        res.setTrending(product.isTrending());
        res.setAverageRating(product.getAverageRating());
        res.setReviewCount(product.getReviewCount());
        res.setSpecifications(product.getSpecifications());
        res.setActive(product.isActive());
        res.setCreatedAt(product.getCreatedAt());
        return res;
    }

    private List<String> getComplementaryGalleryImages(Product product) {
        List<String> extra = new ArrayList<>();
        String name = product.getName() != null ? product.getName().toLowerCase() : "";
        String cat = (product.getCategory() != null && product.getCategory().getSlug() != null)
                ? product.getCategory().getSlug().toLowerCase() : "";

        // 1. Smartwatches / Watches
        if (name.contains("watch") || name.contains("smartwatch")) {
            extra.add("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80");
        }
        // 2. Hoodies & Clothing Apparel (check before gym weights to avoid 'heavyweight' conflict)
        else if (name.contains("hoodie") || name.contains("pullover") || name.contains("sweatshirt") || name.contains("jacket") || name.contains("shirt") || name.contains("terry") || name.contains("apparel")) {
            extra.add("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1578768079052-aa76e520036c?w=800&auto=format&fit=crop&q=80");
        }
        // 3. Shoes & Footwear
        else if (name.contains("shoe") || name.contains("sneaker") || name.contains("running") || name.contains("air max") || name.contains("ultraboost") || name.contains("footwear")) {
            extra.add("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80");
        }
        // 4. Headphones & Audio
        else if (name.contains("headphone") || name.contains("earbud") || name.contains("audio") || name.contains("sony wh") || name.contains("xm5") || name.contains("airpod") || name.contains("sound")) {
            extra.add("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80");
        }
        // 5. Laptops & Computers
        else if (name.contains("laptop") || name.contains("xps") || name.contains("macbook") || name.contains("computer") || (name.contains("notebook") && !cat.contains("books") && !name.contains("classmate") && !name.contains("spiral") && !name.contains("soft cover") && !name.contains("ruled"))) {
            extra.add("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80");
        }
        // 6. Smartphones
        else if (name.contains("iphone") || name.contains("galaxy") || name.contains("pixel") || name.contains("phone") || name.contains("smartphone") || name.contains("s24")) {
            if (name.contains("iphone")) {
                extra.add("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80");
                extra.add("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80");
                extra.add("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80");
            } else {
                extra.add("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80");
                extra.add("https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80");
                extra.add("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80");
            }
        }
        // 7. Cricket Bats
        else if (name.contains("cricket") || name.contains("willow") || name.contains("bat") || (product.getBrand() != null && ("sg".equalsIgnoreCase(product.getBrand().getName()) || "ss".equalsIgnoreCase(product.getBrand().getName())))) {
            extra.add("https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80");
        }
        // 7a. Football & Basketball
        else if (name.contains("football") || name.contains("soccer")) {
            extra.add("https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("basketball")) {
            extra.add("https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop&q=80");
        }
        // 7b. Badminton & Tennis Rackets
        else if (name.contains("badminton") || name.contains("racket") || name.contains("tennis")) {
            extra.add("https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80");
        }
        // 7c. Boxing Gloves & Swim Goggles
        else if (name.contains("boxing")) {
            extra.add("https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("swim") || name.contains("goggles")) {
            extra.add("https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80");
        }
        // 7d. Skates, Jump Rope & Sports Gear
        else if (name.contains("skates") || name.contains("skate") || name.contains("skipping") || name.contains("jump rope")) {
            extra.add("https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("exercise ball") || name.contains("swiss") || name.contains("resistance") || name.contains("pull up") || name.contains("pull-up") || name.contains("treadmill") || name.contains("backpack") || name.contains("tent") || name.contains("boots") || name.contains("hiking")) {
            extra.add("https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=80");
        }
        // 7e. Yoga & Fitness Exercise Mats
        else if (name.contains("yoga mat") || name.contains("exercise mat") || name.contains("pilates mat") || (name.contains("yoga") && name.contains("mat"))) {
            extra.add("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80");
        }
        // 8. Dumbbells & Gym Strength Weights
        else if (name.contains("dumbbell") || name.contains("barbell") || name.contains("kettlebell") || name.contains("gym weight") || name.contains("cast iron dumbbell") || name.contains("weight set")) {
            extra.add("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80");
        }
        // 9. Pressure Cooker & Cookware
        else if (name.contains("cooker") || name.contains("kadhai") || name.contains("pan") || name.contains("gas stove") || name.contains("induction")) {
            extra.add("https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80");
        }
        // 9a. Mixer Grinder & Blenders
        else if (name.contains("mixer") || name.contains("grinder") || name.contains("blender") || name.contains("nutri-blend")) {
            extra.add("https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80");
        }
        // 9b. Fans & Home Appliances
        else if (name.contains("fan") || name.contains("purifier") || name.contains("heater") || name.contains("geyser") || name.contains("vacuum") || name.contains("refrigerator") || name.contains("sewing") || name.contains("safe")) {
            extra.add("https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80");
        }
        // 9c. Bedding, Mattresses & Water Bottles
        else if (name.contains("bedsheet") || name.contains("bed sheet") || name.contains("mattress") || name.contains("pillow") || name.contains("bombay dyeing")) {
            extra.add("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("bottle") || name.contains("flask") || name.contains("thermosteel")) {
            extra.add("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80");
        }
        // 9d. Airfryers & Kitchen Appliances
        else if (name.contains("airfryer") || name.contains("air fryer") || name.contains("fryer") || name.contains("coffee")) {
            extra.add("https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80");
        }
        // 10. Chairs & Armchairs Furniture
        else if (name.contains("chair") || name.contains("armchair") || name.contains("sofa") || name.contains("lounge")) {
            extra.add("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1580481077198-c847864599e7?w=800&auto=format&fit=crop&q=80");
        }
        // 11. Candles & Home Fragrance
        else if (name.contains("candle") || name.contains("scented") || name.contains("aromatherapy")) {
            extra.add("https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1602874801007-bd458bb1b8b8?w=800&auto=format&fit=crop&q=80");
        }
        // 12. Trimmers & Groomers
        else if (name.contains("trimmer") || name.contains("groom") || name.contains("shaver") || name.contains("beard")) {
            extra.add("https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80");
        }
        // 13. Shampoos & Hair Oils
        else if (name.contains("shampoo") || name.contains("hair oil") || name.contains("beard oil") || name.contains("rosemary") || name.contains("bhringraj")) {
            extra.add("https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80");
        }
        // 13a. Face Wash, Cleanser & Body Wash
        else if (name.contains("face wash") || name.contains("cleanser") || name.contains("body wash") || name.contains("body scrub")) {
            extra.add("https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80");
        }
        // 13b. Makeup Cosmetics
        else if (name.contains("lipstick") || name.contains("kajal") || name.contains("mascara") || name.contains("foundation")) {
            extra.add("https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80");
        }
        // 13c. Skincare Serums, Creams & Cosmetics
        else if (name.contains("serum") || name.contains("brightening") || name.contains("skincare") || name.contains("glow") || name.contains("face") || name.contains("moisturizer")) {
            extra.add("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80");
        }
        // 14. Pens
        else if (name.contains("pen") || name.contains("butterflow") || name.contains("ballpoint")) {
            extra.add("https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80");
        }
        // 15. Pencils & Drawing
        else if (name.contains("pencil") || name.contains("apsara") || name.contains("graphite") || name.contains("lumograph")) {
            extra.add("https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80");
        }
        // 16. Erasers, Staplers & Art Colors
        else if (name.contains("eraser") || name.contains("natraj")) {
            extra.add("https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("stapler") || name.contains("dictionary")) {
            extra.add("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("acrylic") || name.contains("color") || name.contains("paint")) {
            extra.add("https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80");
        }
        // 17. Specific Exam Books & Classmate Notebooks
        else if (name.contains("rakesh yadav") || (name.contains("advanced") && name.contains("math"))) {
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("quantitative aptitude") || (name.contains("aggarwal") && name.contains("aptitude"))) {
            extra.add("https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("reasoning") || (name.contains("aggarwal") && name.contains("verbal"))) {
            extra.add("https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("spiral") || name.contains("planner") || name.contains("productivity journal")) {
            extra.add("https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80");
        }
        else if (name.contains("classmate") || name.contains("notebook") || name.contains("soft cover") || name.contains("unruled") || name.contains("ruled")) {
            extra.add("https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1585336261026-4180415392cf?w=800&auto=format&fit=crop&q=80");
        }
        // 18. General Books & Journals
        else if (name.contains("book") || name.contains("habits")) {
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80");
        }
        // 18. Category Fallbacks
        else if (cat.contains("fashion")) {
            extra.add("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80");
        } else if (cat.contains("home")) {
            extra.add("https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80");
        } else if (cat.contains("beauty")) {
            extra.add("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80");
        } else if (cat.contains("sports")) {
            extra.add("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80");
        } else if (cat.contains("books")) {
            extra.add("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80");
        } else {
            extra.add("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80");
            extra.add("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80");
        }
        return extra;
    }
}
