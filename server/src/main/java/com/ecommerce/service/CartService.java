package com.ecommerce.service;

import com.ecommerce.dto.CartItemDto;
import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    @Transactional(readOnly = true)
    public CartResponse getCartDto(User user) {
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(User user, CartItemRequest request) {
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("This product is currently unavailable");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getStockQuantity() + ")");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            int newQuantity = existing.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new BadRequestException("Cannot add more items than available in stock (" + product.getStockQuantity() + ")");
            }
            existing.setQuantity(newQuantity);
            existing.setUnitPrice(product.getDiscountedPrice());
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = new CartItem(cart, product, request.getQuantity(), product.getDiscountedPrice());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(User user, Long itemId, int quantity) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getProduct().getStockQuantity()) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + item.getProduct().getStockQuantity() + ")");
            }
            item.setQuantity(quantity);
            item.setUnitPrice(item.getProduct().getDiscountedPrice());
            cartItemRepository.save(item);
        }

        return mapToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user's cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return mapToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cartItemRepository.deleteByCart(cart);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartResponse mapToCartResponse(Cart cart) {
        CartResponse res = new CartResponse();
        res.setId(cart.getId());

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                Product p = item.getProduct();
                CartItemDto dto = new CartItemDto();
                dto.setId(item.getId());
                dto.setProductId(p.getId());
                dto.setProductName(p.getName());
                dto.setProductSlug(p.getSlug());
                dto.setProductImage(p.getPrimaryImageUrl());
                dto.setSku(p.getSku());
                dto.setUnitPrice(p.getDiscountedPrice());
                dto.setOriginalPrice(p.getPrice());
                dto.setDiscountPercent(p.getDiscountPercent());
                dto.setQuantity(item.getQuantity());
                dto.setItemTotal(item.getItemTotal());
                dto.setInStock(p.getStockQuantity() >= item.getQuantity() && p.isActive());
                dto.setAvailableStock(p.getStockQuantity());

                itemDtos.add(dto);
                subtotal = subtotal.add(item.getItemTotal());
                totalItems += item.getQuantity();
            }
        }

        res.setItems(itemDtos);
        res.setTotalItemCount(totalItems);
        res.setSubtotal(subtotal);

        // Free shipping if order < 100 or >= 500, else 50
        BigDecimal shipping = (subtotal.compareTo(BigDecimal.valueOf(100)) < 0 || subtotal.compareTo(BigDecimal.valueOf(500)) >= 0 || subtotal.compareTo(BigDecimal.ZERO) == 0)
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(50);
        res.setShipping(shipping);
        res.setDiscount(BigDecimal.ZERO);
        res.setTotalAmount(subtotal.add(shipping));

        return res;
    }
}
