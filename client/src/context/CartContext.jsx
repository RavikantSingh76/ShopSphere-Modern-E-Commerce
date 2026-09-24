import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, couponApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItemCount: 0,
    subtotal: 0,
    shipping: 0,
    discount: 0,
    totalAmount: 0,
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Local storage guest cart fallback
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          setCart(parsed);
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toastError('Please sign in to add items to your cart');
      return false;
    }

    try {
      const res = await cartApi.addItem({
        productId: product.id,
        quantity,
      });
      if (res.success && res.data) {
        setCart(res.data);
        success(`Added "${product.name}" to cart!`);
        return true;
      }
    } catch (err) {
      toastError(err.message || 'Failed to add item to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartApi.updateItem(itemId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartApi.removeItem(itemId);
      if (res.success && res.data) {
        setCart(res.data);
        success('Item removed from cart');
      }
    } catch (err) {
      toastError(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await cartApi.clearCart();
      setCart({
        items: [],
        totalItemCount: 0,
        subtotal: 0,
        shipping: 0,
        discount: 0,
        totalAmount: 0,
      });
      setAppliedCoupon(null);
    } catch (err) {
      toastError(err.message || 'Failed to clear cart');
    }
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      toastError('Please enter a coupon code');
      return false;
    }
    try {
      const res = await couponApi.validate(code.trim(), cart.subtotal);
      if (res.success && res.data) {
        const coupon = res.data;
        let discount = (cart.subtotal * coupon.discountPercent) / 100;
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount;
        }
        setAppliedCoupon({
          ...coupon,
          calculatedDiscount: discount,
        });
        success(`Coupon "${coupon.code}" applied! Saved ₹${discount.toFixed(2)}`);
        return true;
      }
    } catch (err) {
      toastError(err.message || 'Invalid or expired coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    success('Coupon removed');
  };

  // Compute final breakdown with coupon
  const subtotal = Number(cart.subtotal) || 0;
  const shipping = subtotal < 100 || subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const couponDiscount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount + shipping);

  return (
    <CartContext.Provider
      value={{
        cart: {
          ...cart,
          shipping,
          discount: couponDiscount,
          totalAmount: finalTotal,
        },
        cartCount: cart.totalItemCount || 0,
        appliedCoupon,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
