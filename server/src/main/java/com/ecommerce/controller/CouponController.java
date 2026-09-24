package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.CouponDto;
import com.ecommerce.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<CouponDto>> validateCoupon(
            @RequestParam String code,
            @RequestParam(defaultValue = "0") BigDecimal amount) {
        CouponDto coupon = couponService.validateCoupon(code, amount);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied successfully", coupon));
    }
}
