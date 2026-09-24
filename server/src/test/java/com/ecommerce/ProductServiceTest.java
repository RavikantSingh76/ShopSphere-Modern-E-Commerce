package com.ecommerce;

import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.Brand;
import com.ecommerce.entity.Category;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    private Category testCategory;
    private Brand testBrand;

    @BeforeEach
    void setUp() {
        testCategory = categoryRepository.findBySlug("electronics").orElseGet(() ->
                categoryRepository.save(new Category("Electronics", "electronics", "Electronics Description", "", "")));
        testBrand = brandRepository.findBySlug("sony").orElseGet(() ->
                brandRepository.save(new Brand("Sony", "sony", "", "")));
    }

    @Test
    @DisplayName("Should create product and retrieve by ID and slug")
    void testCreateAndGetProduct() {
        ProductRequest req = new ProductRequest();
        req.setName("Sony Wireless Headphones");
        req.setSlug("sony-wireless-headphones-test");
        req.setShortDescription("Premium noise cancelling headphones");
        req.setDescription("Full description of the headphones");
        req.setPrice(BigDecimal.valueOf(14999.00));
        req.setDiscountPercent(10);
        req.setStockQuantity(25);
        req.setSku("SONY-WH-001");
        req.setCategoryId(testCategory.getId());
        req.setBrandId(testBrand.getId());
        req.setImageUrls(List.of("https://example.com/sony.jpg"));

        ProductResponse created = productService.createProduct(req);
        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals("Sony Wireless Headphones", created.getName());
        assertEquals(25, created.getStockQuantity());

        ProductResponse bySlug = productService.getProductBySlug("sony-wireless-headphones-test");
        assertNotNull(bySlug);
        assertEquals(created.getId(), bySlug.getId());

        ProductResponse byId = productService.getProductById(created.getId());
        assertNotNull(byId);
        assertEquals("sony-wireless-headphones-test", byId.getSlug());
    }

    @Test
    @DisplayName("Should filter products by category, price range, and search query")
    void testFilterProducts() {
        ProductRequest req1 = new ProductRequest();
        req1.setName("Sony Bravia 4K TV");
        req1.setSlug("sony-bravia-4k-tv");
        req1.setPrice(BigDecimal.valueOf(45000));
        req1.setStockQuantity(10);
        req1.setCategoryId(testCategory.getId());
        req1.setBrandId(testBrand.getId());
        productService.createProduct(req1);

        ProductRequest req2 = new ProductRequest();
        req2.setName("Sony Bluetooth Speaker");
        req2.setSlug("sony-bluetooth-speaker");
        req2.setPrice(BigDecimal.valueOf(4999));
        req2.setStockQuantity(15);
        req2.setCategoryId(testCategory.getId());
        req2.setBrandId(testBrand.getId());
        productService.createProduct(req2);

        // Filter by minPrice 10000
        PagedResponse<ProductResponse> filtered = productService.getProducts(
                "electronics", "sony", BigDecimal.valueOf(10000), null, null, false, null, "TV", "createdAt", "desc", 0, 10
        );

        assertNotNull(filtered);
        assertEquals(1, filtered.getContent().size());
        assertEquals("Sony Bravia 4K TV", filtered.getContent().get(0).getName());
    }
}
