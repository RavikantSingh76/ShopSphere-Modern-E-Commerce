package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.BrandDto;
import com.ecommerce.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDto>>> getActiveBrands(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(brandService.getAllActiveBrands(category)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDto>> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(brandService.getBrandById(id)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BrandDto>> getBrandBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(brandService.getBrandBySlug(slug)));
    }
}
