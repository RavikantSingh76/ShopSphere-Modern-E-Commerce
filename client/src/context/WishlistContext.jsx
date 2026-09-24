import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const { success, error: toastError } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist({ items: [], totalCount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistApi.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toastError('Please sign in to save items to your wishlist');
      return false;
    }
    try {
      const res = await wishlistApi.toggle(productId);
      if (res.success) {
        await fetchWishlist();
        success(res.data ? 'Added to your wishlist!' : 'Removed from wishlist');
        return res.data;
      }
    } catch (err) {
      toastError(err.message || 'Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.items.some((item) => item.productId === productId);
  };

  const moveToCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      await wishlistApi.moveToCart(productId);
      await fetchWishlist();
      await refreshCart();
      success('Moved item to shopping cart!');
    } catch (err) {
      toastError(err.message || 'Failed to move item to cart');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.totalCount || 0,
        loading,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
