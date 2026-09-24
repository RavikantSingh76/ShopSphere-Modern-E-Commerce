package com.ecommerce;

import com.ecommerce.dto.CouponDto;
import com.ecommerce.entity.Coupon;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.service.CouponService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CouponServiceTest {

    @Autowired
    private CouponService couponService;

    @Autowired
    private CouponRepository couponRepository;

    @BeforeEach
    void setUp() {
        Coupon c = new Coupon();
        c.setCode("SAVE20");
        c.setDiscountPercent(20);
        c.setMaxDiscountAmount(BigDecimal.valueOf(500));
        c.setMinOrderAmount(BigDecimal.valueOf(1000));
        c.setExpiryDate(LocalDate.now().plusMonths(1));
        c.setActive(true);
        c.setUsageLimit(50);
        c.setTimesUsed(0);
        couponRepository.save(c);

        Coupon expired = new Coupon();
        expired.setCode("EXPIRED10");
        expired.setDiscountPercent(10);
        expired.setExpiryDate(LocalDate.now().minusDays(2));
        expired.setActive(true);
        couponRepository.save(expired);
    }

    @Test
    @DisplayName("Should validate coupon successfully when criteria met")
    void testValidateCouponSuccess() {
        CouponDto dto = couponService.validateCoupon("SAVE20", BigDecimal.valueOf(1500));
        assertNotNull(dto);
        assertEquals("SAVE20", dto.getCode());
        assertEquals(20, dto.getDiscountPercent());
    }

    @Test
    @DisplayName("Should reject coupon when order amount is less than minOrderAmount")
    void testValidateCouponBelowMinOrder() {
        assertThrows(BadRequestException.class, () ->
                couponService.validateCoupon("SAVE20", BigDecimal.valueOf(500))
        );
    }

    @Test
    @DisplayName("Should reject expired coupon")
    void testValidateExpiredCouponFails() {
        assertThrows(BadRequestException.class, () ->
                couponService.validateCoupon("EXPIRED10", BigDecimal.valueOf(2000))
        );
    }
}
