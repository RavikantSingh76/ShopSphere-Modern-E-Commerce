package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.CustomUserDetails;
import com.ecommerce.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalOrders(orderRepository.count());

        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        stats.setPendingOrders(orderRepository.countByOrderStatus(OrderStatus.PENDING));
        stats.setProcessingOrders(orderRepository.countByOrderStatus(OrderStatus.PROCESSING) + orderRepository.countByOrderStatus(OrderStatus.CONFIRMED));
        stats.setDeliveredOrders(orderRepository.countByOrderStatus(OrderStatus.DELIVERED));
        stats.setCancelledOrders(orderRepository.countByOrderStatus(OrderStatus.CANCELLED));
        stats.setLowStockProducts(productRepository.countByStockQuantityLessThan(10));

        // Recent 5 orders
        Page<com.ecommerce.entity.Order> recentOrdersPage = orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5));
        stats.setRecentOrders(recentOrdersPage.getContent().stream().map(orderService::mapToOrderResponse).collect(Collectors.toList()));

        // Top selling products
        List<Object[]> topProductsData = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));
        List<DashboardStatsDto.TopProductDto> topProducts = new ArrayList<>();
        if (topProductsData != null) {
            for (Object[] row : topProductsData) {
                String name = (String) row[0];
                long units = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                BigDecimal rev = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;
                topProducts.add(new DashboardStatsDto.TopProductDto(name, units, rev));
            }
        }
        stats.setTopSellingProducts(topProducts);

        // Orders by Status map
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (OrderStatus st : OrderStatus.values()) {
            statusMap.put(st.name(), orderRepository.countByOrderStatus(st));
        }
        stats.setOrdersByStatus(statusMap);

        // Real aggregated monthly sales breakdown from actual orders
        Map<String, BigDecimal> monthlySales = new LinkedHashMap<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (String m : months) {
            monthlySales.put(m, BigDecimal.ZERO);
        }

        int currentYear = LocalDate.now().getYear();
        List<Object[]> salesData = orderRepository.findMonthlySalesByYear(currentYear);
        if (salesData != null) {
            for (Object[] row : salesData) {
                if (row != null && row.length >= 2 && row[0] != null && row[1] != null) {
                    int monthNumber = ((Number) row[0]).intValue();
                    BigDecimal monthTotal = (BigDecimal) row[1];
                    if (monthNumber >= 1 && monthNumber <= 12) {
                        String mKey = months[monthNumber - 1];
                        monthlySales.put(mKey, monthTotal.setScale(2, java.math.RoundingMode.HALF_UP));
                    }
                }
            }
        }
        stats.setMonthlySales(monthlySales);

        return stats;
    }

    public PagedResponse<UserDto> getAllUsers(String query, String role, Boolean enabled, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<User> list;

        if (query != null && !query.isBlank()) {
            list = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query.trim(), query.trim());
        } else {
            list = userRepository.findAll(Sort.by("createdAt").descending());
        }

        if (role != null && !role.isBlank() && !role.equalsIgnoreCase("ALL")) {
            list = list.stream().filter(u -> u.getRole() != null && u.getRole().name().equalsIgnoreCase(role.trim())).collect(Collectors.toList());
        }

        if (enabled != null) {
            list = list.stream().filter(u -> u.isEnabled() == enabled).collect(Collectors.toList());
        }

        int start = Math.min((int) pageable.getOffset(), list.size());
        int end = Math.min((start + pageable.getPageSize()), list.size());
        List<UserDto> subList = list.subList(start, end).stream().map(u -> {
            UserDto dto = userService.mapToUserDto(u);
            List<com.ecommerce.entity.Order> userOrders = orderRepository.findByUserOrderByCreatedAtDesc(u);
            BigDecimal ltv = BigDecimal.ZERO;
            for (com.ecommerce.entity.Order o : userOrders) {
                if (o.getOrderStatus() != OrderStatus.CANCELLED && o.getTotalAmount() != null) {
                    ltv = ltv.add(o.getTotalAmount());
                }
            }
            dto.setLifetimeValue(ltv);
            dto.setTotalOrders(userOrders.size());
            return dto;
        }).collect(Collectors.toList());
        return new PagedResponse<>(subList, page, size, list.size(), (int) Math.ceil((double) list.size() / size), end >= list.size());
    }

    @Transactional
    public UserDto createUser(AdminUserCreateDto dto) {
        String email = dto.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User with email " + email + " already exists.");
        }

        String rawPassword = (dto.getPassword() != null && !dto.getPassword().isBlank())
                ? dto.getPassword().trim()
                : "Customer@123";

        User user = new User();
        user.setName(dto.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhone(dto.getPhone() != null && !dto.getPhone().isBlank() ? dto.getPhone().trim() : null);
        user.setRole(dto.getRole() != null ? dto.getRole() : Role.ROLE_CUSTOMER);
        user.setEnabled(dto.isEnabled());
        user.setTags(dto.getTags() != null ? dto.getTags().trim() : null);
        user.setAdminNotes(dto.getAdminNotes() != null ? dto.getAdminNotes().trim() : null);

        User saved = userRepository.save(user);
        UserDto result = userService.mapToUserDto(saved);
        result.setLifetimeValue(BigDecimal.ZERO);
        result.setTotalOrders(0);
        return result;
    }

    @Transactional
    public UserDto updateUser(Long userId, AdminUserUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String email = dto.getEmail().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(email) && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Another user with email " + email + " already exists.");
        }

        user.setName(dto.getName().trim());
        user.setEmail(email);
        if (dto.getPhone() != null) user.setPhone(dto.getPhone().trim());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getEnabled() != null) user.setEnabled(dto.getEnabled());
        if (dto.getTags() != null) user.setTags(dto.getTags().trim());
        if (dto.getAdminNotes() != null) user.setAdminNotes(dto.getAdminNotes().trim());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        User saved = userRepository.save(user);
        UserDto result = userService.mapToUserDto(saved);
        List<com.ecommerce.entity.Order> userOrders = orderRepository.findByUserOrderByCreatedAtDesc(saved);
        BigDecimal ltv = BigDecimal.ZERO;
        for (com.ecommerce.entity.Order o : userOrders) {
            if (o.getOrderStatus() != OrderStatus.CANCELLED && o.getTotalAmount() != null) {
                ltv = ltv.add(o.getTotalAmount());
            }
        }
        result.setLifetimeValue(ltv);
        result.setTotalOrders(userOrders.size());
        return result;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if ("ravikantsinghravi366@gmail.com".equalsIgnoreCase(user.getEmail())) {
            throw new BadRequestException("Root Administrator account cannot be deleted.");
        }

        try {
            jdbcTemplate.execute("ALTER TABLE orders MODIFY user_id BIGINT NULL");
        } catch (Exception ignored) {}

        // Detach orders to preserve order history and sales financial records
        jdbcTemplate.update("UPDATE orders SET user_id = NULL WHERE user_id = ?", userId);
        // Clean cart and items
        jdbcTemplate.update("DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)", userId);
        jdbcTemplate.update("DELETE FROM carts WHERE user_id = ?", userId);
        // Clean wishlist and items
        jdbcTemplate.update("DELETE FROM wishlist_items WHERE wishlist_id IN (SELECT id FROM wishlists WHERE user_id = ?)", userId);
        jdbcTemplate.update("DELETE FROM wishlists WHERE user_id = ?", userId);
        // Clean reviews
        jdbcTemplate.update("DELETE FROM reviews WHERE user_id = ?", userId);
        // Clean addresses
        jdbcTemplate.update("DELETE FROM addresses WHERE user_id = ?", userId);
        // Delete user
        userRepository.delete(user);
    }

    public com.ecommerce.dto.CustomerDetailDto getCustomerDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        com.ecommerce.dto.CustomerDetailDto detail = new com.ecommerce.dto.CustomerDetailDto();
        detail.setUser(userService.mapToUserDto(user));

        List<com.ecommerce.entity.Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        List<OrderResponse> orderResponses = orders.stream()
                .map(orderService::mapToOrderResponse)
                .collect(Collectors.toList());
        detail.setOrders(orderResponses);
        detail.setTotalOrders(orders.size());

        BigDecimal ltv = BigDecimal.ZERO;
        int nonCancelledCount = 0;
        for (com.ecommerce.entity.Order o : orders) {
            if (o.getOrderStatus() != OrderStatus.CANCELLED && o.getTotalAmount() != null) {
                ltv = ltv.add(o.getTotalAmount());
                nonCancelledCount++;
            }
        }
        detail.setLifetimeValue(ltv);
        if (nonCancelledCount > 0) {
            detail.setAverageOrderValue(ltv.divide(BigDecimal.valueOf(nonCancelledCount), 2, java.math.RoundingMode.HALF_UP));
        }

        if (user.getAddresses() != null) {
            detail.setAddresses(user.getAddresses().stream()
                    .map(userService::mapToAddressDto)
                    .collect(Collectors.toList()));
        }

        return detail;
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setEnabled(enabled);
        User saved = userRepository.save(user);
        return userService.mapToUserDto(saved);
    }

    @Transactional
    public UserDto changeUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setRole(role);
        User saved = userRepository.save(user);
        return userService.mapToUserDto(saved);
    }

    public CustomerMetricsDto getCustomerMetrics() {
        CustomerMetricsDto metrics = new CustomerMetricsDto();
        List<User> users = userRepository.findAll();
        long total = users.size();
        long active = users.stream().filter(User::isEnabled).count();
        long disabled = total - active;
        long vip = users.stream().filter(u -> (u.getTags() != null && u.getTags().toLowerCase().contains("vip"))).count();

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        long newSignups = users.stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfMonth)).count();

        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        if (revenue == null) revenue = BigDecimal.ZERO;
        BigDecimal avgLtv = (total > 0) ? revenue.divide(BigDecimal.valueOf(total), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO;

        metrics.setTotalCustomers(total);
        metrics.setActiveUsers(active);
        metrics.setDisabledUsers(disabled);
        metrics.setVipCustomers(vip);
        metrics.setNewSignupsThisMonth(newSignups);
        metrics.setActivePercentage(total > 0 ? ((double) active / total) * 100.0 : 0.0);
        metrics.setAverageLifetimeValue(avgLtv);

        return metrics;
    }

    @Transactional
    public UserDto updateNotesAndTags(Long userId, String notes, String tags) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setAdminNotes(notes);
        user.setTags(tags);
        User saved = userRepository.save(user);
        return userService.mapToUserDto(saved);
    }

    public AuthResponse impersonateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getAvatarUrl()
        );
    }
}
