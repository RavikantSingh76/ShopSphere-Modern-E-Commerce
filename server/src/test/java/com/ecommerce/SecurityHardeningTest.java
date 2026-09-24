package com.ecommerce;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.TooManyRequestsException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.CustomAccessDeniedHandler;
import com.ecommerce.security.LoginRateLimiterService;
import com.ecommerce.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class SecurityHardeningTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LoginRateLimiterService rateLimiterService;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Test
    @DisplayName("Security: Brute-force lockout triggers TooManyRequestsException after repeated failures")
    void testRateLimiterLockoutOnRepeatedFailures() {
        String testEmail = "brute_force_target@example.com";

        // Register the target user
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Target User");
        registerReq.setEmail(testEmail);
        registerReq.setPassword("CorrectPassword123");
        registerReq.setPhone("+91 9999900000");
        authService.register(registerReq);

        LoginRequest badLogin = new LoginRequest();
        badLogin.setEmail(testEmail);
        badLogin.setPassword("WrongPassword!");

        // 5 consecutive failed login attempts
        for (int i = 0; i < 5; i++) {
            assertThrows(BadCredentialsException.class, () -> authService.login(badLogin));
        }

        // 6th attempt must be blocked by rate limiter and throw TooManyRequestsException
        TooManyRequestsException ex = assertThrows(TooManyRequestsException.class, () -> authService.login(badLogin));
        assertTrue(ex.getMessage().contains("Too many failed login attempts"));
        assertTrue(ex.getRetryAfterSeconds() > 0);

        // Reset rate limiter for test cleanliness
        rateLimiterService.recordSuccess(testEmail);
    }

    @Test
    @DisplayName("Security: User passwords must be BCrypt hashed and never stored in plaintext")
    void testPasswordBCryptHashing() {
        String rawPassword = "SecurePassword@2026";
        RegisterRequest req = new RegisterRequest();
        req.setName("BCrypt User");
        req.setEmail("bcrypt_user@example.com");
        req.setPassword(rawPassword);
        req.setPhone("+91 9876500000");

        authService.register(req);

        User savedUser = userRepository.findByEmail("bcrypt_user@example.com").orElse(null);
        assertNotNull(savedUser);
        assertNotEquals(rawPassword, savedUser.getPassword());
        assertTrue(savedUser.getPassword().startsWith("$2a$") || savedUser.getPassword().startsWith("$2b$"));
        assertTrue(passwordEncoder.matches(rawPassword, savedUser.getPassword()));
    }

    @Test
    @DisplayName("Security: CustomAccessDeniedHandler returns HTTP 403 Forbidden with structured JSON")
    void testAccessDeniedHandlerReturns403() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/admin/products");
        request.setServletPath("/api/admin/products");
        MockHttpServletResponse response = new MockHttpServletResponse();

        AccessDeniedException exception = new AccessDeniedException("Access is denied");
        accessDeniedHandler.handle(request, response, exception);

        assertEquals(403, response.getStatus());
        assertTrue(response.getContentType().startsWith("application/json"));
        assertTrue(response.getContentAsString().contains("\"status\":403"));
        assertTrue(response.getContentAsString().contains("Forbidden"));
        assertTrue(response.getContentAsString().contains("/api/admin/products"));
    }

    @Test
    @DisplayName("Data Integrity: Atomic stock decrement prevents overselling when requested > available")
    void testAtomicStockDecrementBoundary() {
        // Query an existing product from Flyway seed
        var products = productRepository.findAll();
        assertFalse(products.isEmpty());
        var product = products.get(0);
        int currentStock = product.getStockQuantity();

        // Attempting to decrement more stock than available must return 0 updated rows
        int rowsUpdated = productRepository.decrementStockIfAvailable(product.getId(), currentStock + 50);
        assertEquals(0, rowsUpdated);

        // Attempting to decrement valid stock must return 1 updated row
        if (currentStock > 0) {
            int validUpdate = productRepository.decrementStockIfAvailable(product.getId(), 1);
            assertEquals(1, validUpdate);
        }
    }
}
