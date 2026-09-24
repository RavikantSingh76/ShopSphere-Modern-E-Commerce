package com.ecommerce.service;

import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.dto.ReviewResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    public PagedResponse<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByProductOrderByCreatedAtDesc(product, pageable);

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::mapToResponse).collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                reviewPage.getNumber(),
                reviewPage.getSize(),
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages(),
                reviewPage.isLast()
        );
    }

    public List<ReviewResponse> getAllProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        return reviewRepository.findByProductOrderByCreatedAtDesc(product).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getUserReviews(User user) {
        return reviewRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse addReview(User user, ReviewRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Review review = reviewRepository.findByUserAndProduct(user, product)
                .orElse(new Review());

        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setVerifiedPurchase(true); // Default verified for demo/purchase flow

        Review saved = reviewRepository.save(review);

        // Recalculate product rating statistics
        List<Object[]> stats = reviewRepository.getAverageRatingAndCount(product.getId());
        if (stats != null && !stats.isEmpty()) {
            Object[] row = stats.get(0);
            Double avgRating = (Double) row[0];
            Long count = (Long) row[1];
            product.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            product.setReviewCount(count != null ? count.intValue() : 0);
            productRepository.save(product);
        }

        return mapToResponse(saved);
    }

    @Transactional
    public void deleteReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        boolean isOwner = review.getUser() != null && review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == com.ecommerce.entity.Role.ROLE_ADMIN || user.getRole() == com.ecommerce.entity.Role.ROLE_MANAGER;

        if (!isOwner && !isAdmin) {
            throw new com.ecommerce.exception.UnauthorizedException("You do not have permission to delete this review");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);

        if (product != null) {
            List<Object[]> stats = reviewRepository.getAverageRatingAndCount(product.getId());
            if (stats != null && !stats.isEmpty()) {
                Object[] row = stats.get(0);
                Double avgRating = (Double) row[0];
                Long count = (Long) row[1];
                product.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
                product.setReviewCount(count != null ? count.intValue() : 0);
            } else {
                product.setAverageRating(0.0);
                product.setReviewCount(0);
            }
            productRepository.save(product);
        }
    }

    public ReviewResponse mapToResponse(Review review) {
        if (review == null) return null;
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        if (review.getUser() != null) {
            res.setUserId(review.getUser().getId());
            res.setUserName(review.getUser().getName());
            res.setUserAvatar(review.getUser().getAvatarUrl());
        }
        if (review.getProduct() != null) {
            res.setProductId(review.getProduct().getId());
        }
        res.setRating(review.getRating());
        res.setTitle(review.getTitle());
        res.setComment(review.getComment());
        res.setVerifiedPurchase(review.isVerifiedPurchase());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}
