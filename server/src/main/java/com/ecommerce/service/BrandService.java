package com.ecommerce.service;

import com.ecommerce.dto.BrandDto;
import com.ecommerce.entity.Brand;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<BrandDto> getAllActiveBrands(String categorySlug) {
        if (categorySlug != null && !categorySlug.isBlank()) {
            return brandRepository.findDistinctActiveBrandsByCategorySlug(categorySlug.trim())
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        }
        return brandRepository.findByActiveTrueOrderByNameAsc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<BrandDto> getAllActiveBrands() {
        return getAllActiveBrands(null);
    }

    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BrandDto getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));
        return mapToDto(brand);
    }

    public BrandDto getBrandBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "slug", slug));
        return mapToDto(brand);
    }

    @Transactional
    public BrandDto createBrand(BrandDto dto) {
        if (brandRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException("Brand with name '" + dto.getName() + "' already exists");
        }

        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("-$", "");
        }

        Brand brand = new Brand();
        brand.setName(dto.getName());
        brand.setSlug(slug);
        brand.setLogoUrl(dto.getLogoUrl());
        brand.setDescription(dto.getDescription());
        brand.setActive(dto.isActive());

        Brand saved = brandRepository.save(brand);
        return mapToDto(saved);
    }

    @Transactional
    public BrandDto updateBrand(Long id, BrandDto dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));

        brand.setName(dto.getName());
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) {
            brand.setSlug(dto.getSlug());
        }
        brand.setLogoUrl(dto.getLogoUrl());
        brand.setDescription(dto.getDescription());
        brand.setActive(dto.isActive());

        Brand updated = brandRepository.save(brand);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));
        brandRepository.delete(brand);
    }

    public BrandDto mapToDto(Brand brand) {
        if (brand == null) return null;
        BrandDto dto = new BrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setSlug(brand.getSlug());
        dto.setLogoUrl(brand.getLogoUrl());
        dto.setDescription(brand.getDescription());
        dto.setActive(brand.isActive());
        return dto;
    }
}
