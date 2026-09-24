package com.ecommerce.service;

import com.ecommerce.dto.CouponDto;
import com.ecommerce.entity.Coupon;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public CouponDto validateCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with code: " + code));

        if (!coupon.isActive()) {
            throw new BadRequestException("This coupon is no longer active");
        }

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(java.time.LocalDate.now())) {
            throw new BadRequestException("This coupon has expired");
        }

        if (coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new BadRequestException("This coupon has reached its maximum usage limit");
        }

        if (coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order amount of ₹" + coupon.getMinOrderAmount() + " required to use this coupon");
        }

        return mapToDto(coupon);
    }

    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public CouponDto createCoupon(CouponDto dto) {
        if (couponRepository.existsByCodeIgnoreCase(dto.getCode())) {
            throw new BadRequestException("Coupon code '" + dto.getCode() + "' already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(dto.getCode().toUpperCase().trim());
        coupon.setDiscountPercent(dto.getDiscountPercent());
        coupon.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        coupon.setMinOrderAmount(dto.getMinOrderAmount() != null ? dto.getMinOrderAmount() : BigDecimal.ZERO);
        coupon.setExpiryDate(dto.getExpiryDate());
        coupon.setActive(dto.isActive());
        coupon.setUsageLimit(dto.getUsageLimit() > 0 ? dto.getUsageLimit() : 1000);

        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Transactional
    public CouponDto updateCoupon(Long id, CouponDto dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));

        coupon.setCode(dto.getCode().toUpperCase().trim());
        coupon.setDiscountPercent(dto.getDiscountPercent());
        coupon.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        coupon.setMinOrderAmount(dto.getMinOrderAmount());
        coupon.setExpiryDate(dto.getExpiryDate());
        coupon.setActive(dto.isActive());
        coupon.setUsageLimit(dto.getUsageLimit());

        Coupon updated = couponRepository.save(coupon);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        couponRepository.delete(coupon);
    }

    public CouponDto mapToDto(Coupon coupon) {
        if (coupon == null) return null;
        CouponDto dto = new CouponDto();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setDiscountPercent(coupon.getDiscountPercent());
        dto.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        dto.setMinOrderAmount(coupon.getMinOrderAmount());
        dto.setExpiryDate(coupon.getExpiryDate());
        dto.setActive(coupon.isActive());
        dto.setUsageLimit(coupon.getUsageLimit());
        dto.setTimesUsed(coupon.getTimesUsed());
        return dto;
    }
}
