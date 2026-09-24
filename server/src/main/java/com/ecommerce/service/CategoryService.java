package com.ecommerce.service;

import com.ecommerce.dto.CategoryDto;
import com.ecommerce.entity.Category;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDto> getAllActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToDto(category);
    }

    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists");
        }

        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("-$", "");
        }

        Category category = new Category();
        category.setName(dto.getName());
        category.setSlug(slug);
        category.setDescription(dto.getDescription());
        category.setImageUrl(dto.getImageUrl());
        category.setIconName(dto.getIconName());
        category.setActive(dto.isActive());
        category.setDisplayOrder(dto.getDisplayOrder());

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setName(dto.getName());
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) {
            category.setSlug(dto.getSlug());
        }
        category.setDescription(dto.getDescription());
        category.setImageUrl(dto.getImageUrl());
        category.setIconName(dto.getIconName());
        category.setActive(dto.isActive());
        category.setDisplayOrder(dto.getDisplayOrder());

        Category updated = categoryRepository.save(category);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
    }

    public CategoryDto mapToDto(Category category) {
        if (category == null) return null;
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        dto.setIconName(category.getIconName());
        dto.setActive(category.isActive());
        dto.setDisplayOrder(category.getDisplayOrder());
        return dto;
    }
}
