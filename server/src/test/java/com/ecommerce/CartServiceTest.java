package com.ecommerce;

import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.entity.Brand;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.BrandRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CartServiceTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        String uid = java.util.UUID.randomUUID().toString().substring(0, 8);
        testUser = userRepository.save(new User("Cart Tester", "carttester_" + uid + "@example.com", "pass123", Role.ROLE_CUSTOMER));
        Category cat = categoryRepository.findBySlug("fashion").orElseGet(() ->
                categoryRepository.save(new Category("Fashion", "fashion", "Fashion items", "", "")));
        Brand brand = brandRepository.findBySlug("nike").orElseGet(() ->
                brandRepository.save(new Brand("Nike", "nike", "", "")));

        Product p = new Product();
        p.setName("Nike Running Shoes " + uid);
        p.setSlug("nike-running-shoes-cart-test-" + uid);
        p.setPrice(BigDecimal.valueOf(2500));
        p.setStockQuantity(5);
        p.setActive(true);
        p.setCategory(cat);
        p.setBrand(brand);
        testProduct = productRepository.save(p);
    }

    @Test
    @DisplayName("Should add item to cart and calculate correct subtotal")
    void testAddToCartSuccess() {
        CartItemRequest req = new CartItemRequest(testProduct.getId(), 2);
        CartResponse cartRes = cartService.addItem(testUser, req);

        assertNotNull(cartRes);
        assertEquals(1, cartRes.getItems().size());
        assertEquals(2, cartRes.getTotalItemCount());
        assertEquals(BigDecimal.valueOf(5000.00).setScale(2), cartRes.getSubtotal().setScale(2));
    }

    @Test
    @DisplayName("Should reject adding quantity exceeding available stock")
    void testAddToCartExceedsStockFails() {
        CartItemRequest req = new CartItemRequest(testProduct.getId(), 10); // Available stock is 5
        assertThrows(BadRequestException.class, () -> cartService.addItem(testUser, req));
    }

    @Test
    @DisplayName("Should update item quantity and remove item when quantity is 0")
    void testUpdateAndRemoveCartItem() {
        CartItemRequest req = new CartItemRequest(testProduct.getId(), 2);
        CartResponse cart = cartService.addItem(testUser, req);
        Long itemId = cart.getItems().get(0).getId();

        // Update quantity to 4
        CartResponse updated = cartService.updateItemQuantity(testUser, itemId, 4);
        assertEquals(4, updated.getTotalItemCount());

        // Update quantity to 0 removes item
        CartResponse removed = cartService.updateItemQuantity(testUser, itemId, 0);
        assertEquals(0, removed.getTotalItemCount());
    }
}
