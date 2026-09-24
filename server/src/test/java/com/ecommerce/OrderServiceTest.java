package com.ecommerce;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.CreateOrderRequest;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.dto.OrderStatusUpdateRequest;
import com.ecommerce.entity.*;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
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
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private User customer;
    private Product product;

    @BeforeEach
    void setUp() {
        String uid = java.util.UUID.randomUUID().toString().substring(0, 8);
        customer = userRepository.save(new User("Order Buyer", "buyer_" + uid + "@example.com", "pass123", Role.ROLE_CUSTOMER));
        Category cat = categoryRepository.findBySlug("gadgets").orElseGet(() ->
                categoryRepository.save(new Category("Gadgets", "gadgets", "Gadgets", "", "")));

        Product p = new Product();
        p.setName("Smart Watch " + uid);
        p.setSlug("smart-watch-order-test-" + uid);
        p.setPrice(BigDecimal.valueOf(3000));
        p.setStockQuantity(20);
        p.setActive(true);
        p.setCategory(cat);
        product = productRepository.save(p);
    }

    private AddressDto createTestAddress() {
        AddressDto addr = new AddressDto();
        addr.setFullName("Order Buyer");
        addr.setPhone("+91 9999988888");
        addr.setStreetAddress("123 Tech Street");
        addr.setCity("Bengaluru");
        addr.setState("Karnataka");
        addr.setPostalCode("560001");
        addr.setCountry("India");
        return addr;
    }

    @Test
    @DisplayName("Should create order from active cart and deduct stock from product catalog")
    void testCreateOrderDeductsStock() {
        // Add 3 items to cart
        cartService.addItem(customer, new CartItemRequest(product.getId(), 3));

        CreateOrderRequest req = new CreateOrderRequest();
        req.setShippingAddress(createTestAddress());
        req.setPaymentMethod(PaymentMethod.COD);

        OrderResponse orderRes = orderService.createOrder(customer, req);

        assertNotNull(orderRes);
        assertNotNull(orderRes.getOrderNumber());
        assertEquals(OrderStatus.CONFIRMED, orderRes.getOrderStatus());
        assertEquals(1, orderRes.getItems().size());

        // Verify product stock was reduced from 20 to 17
        Product updatedProduct = productRepository.findById(product.getId()).orElse(null);
        assertNotNull(updatedProduct);
        assertEquals(17, updatedProduct.getStockQuantity());
    }

    @Test
    @DisplayName("Should cancel order and restore stock to product catalog")
    void testCancelOrderRestoresStock() {
        cartService.addItem(customer, new CartItemRequest(product.getId(), 4));

        CreateOrderRequest req = new CreateOrderRequest();
        req.setShippingAddress(createTestAddress());
        req.setPaymentMethod(PaymentMethod.COD);

        OrderResponse orderRes = orderService.createOrder(customer, req);
        assertEquals(16, productRepository.findById(product.getId()).get().getStockQuantity());

        // Cancel order
        OrderResponse cancelled = orderService.cancelOrder(orderRes.getId(), customer);
        assertEquals(OrderStatus.CANCELLED, cancelled.getOrderStatus());

        // Verify stock restored back to 20
        assertEquals(20, productRepository.findById(product.getId()).get().getStockQuantity());
    }

    @Test
    @DisplayName("Admin updating order status to CANCELLED should also restore product stock")
    void testAdminCancelOrderStatusRestoresStock() {
        cartService.addItem(customer, new CartItemRequest(product.getId(), 5));

        CreateOrderRequest req = new CreateOrderRequest();
        req.setShippingAddress(createTestAddress());
        req.setPaymentMethod(PaymentMethod.COD);

        OrderResponse orderRes = orderService.createOrder(customer, req);
        assertEquals(15, productRepository.findById(product.getId()).get().getStockQuantity());

        // Admin updates status to CANCELLED
        OrderStatusUpdateRequest updateReq = new OrderStatusUpdateRequest();
        updateReq.setStatus(OrderStatus.CANCELLED);
        orderService.updateOrderStatus(orderRes.getId(), updateReq);

        // Verify stock is restored
        assertEquals(20, productRepository.findById(product.getId()).get().getStockQuantity());
    }
}
