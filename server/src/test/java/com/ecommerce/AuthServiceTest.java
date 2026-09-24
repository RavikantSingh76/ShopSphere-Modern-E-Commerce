package com.ecommerce;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Clear any test users
    }

    @Test
    @DisplayName("Should successfully register a new customer")
    void testRegisterCustomerSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test User");
        req.setEmail("testuser@example.com");
        req.setPassword("Password123");
        req.setPhone("+91 9876543210");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertNotNull(res.getToken());
        assertEquals("testuser@example.com", res.getEmail());
        assertEquals("ROLE_CUSTOMER", res.getRole());

        User user = userRepository.findByEmail("testuser@example.com").orElse(null);
        assertNotNull(user);
        assertEquals(Role.ROLE_CUSTOMER, user.getRole());
    }

    @Test
    @DisplayName("Security: Public registration must NOT allow privilege escalation to ROLE_ADMIN")
    void testRegisterCannotEscalateToAdmin() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Attacker");
        req.setEmail("attacker@example.com");
        req.setPassword("Secret123");
        req.setRole(Role.ROLE_ADMIN); // Malicious attempt to self-assign admin

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        // Role MUST be forced to ROLE_CUSTOMER
        assertEquals("ROLE_CUSTOMER", res.getRole());

        User user = userRepository.findByEmail("attacker@example.com").orElse(null);
        assertNotNull(user);
        assertEquals(Role.ROLE_CUSTOMER, user.getRole(), "User should always receive ROLE_CUSTOMER upon public registration");
    }

    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegisterDuplicateEmailFails() {
        RegisterRequest req1 = new RegisterRequest();
        req1.setName("User One");
        req1.setEmail("duplicate@example.com");
        req1.setPassword("Password123");
        authService.register(req1);

        RegisterRequest req2 = new RegisterRequest();
        req2.setName("User Two");
        req2.setEmail("duplicate@example.com");
        req2.setPassword("Password456");

        assertThrows(BadRequestException.class, () -> authService.register(req2));
    }

    @Test
    @DisplayName("Should authenticate and log in with valid credentials")
    void testLoginSuccess() {
        RegisterRequest reg = new RegisterRequest();
        reg.setName("Login User");
        reg.setEmail("loginuser@example.com");
        reg.setPassword("CorrectPassword123");
        authService.register(reg);

        LoginRequest login = new LoginRequest();
        login.setEmail("loginuser@example.com");
        login.setPassword("CorrectPassword123");

        AuthResponse res = authService.login(login);
        assertNotNull(res);
        assertNotNull(res.getToken());
        assertEquals("loginuser@example.com", res.getEmail());
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void testLoginInvalidPasswordFails() {
        RegisterRequest reg = new RegisterRequest();
        reg.setName("Login User");
        reg.setEmail("loginfail@example.com");
        reg.setPassword("CorrectPassword123");
        authService.register(reg);

        LoginRequest login = new LoginRequest();
        login.setEmail("loginfail@example.com");
        login.setPassword("WrongPassword");

        assertThrows(BadCredentialsException.class, () -> authService.login(login));
    }
}
