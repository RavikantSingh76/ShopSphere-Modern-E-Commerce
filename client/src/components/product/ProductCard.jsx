import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, ArrowLeftRight, Star, Zap, ShieldCheck, Check, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { getProductImage } from '../../utils/imageHelper';

export const ProductCard = ({ product, onQuickView }) => {
  if (!product || typeof product !== 'object') return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();

  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock && product.stockQuantity <= 0) return;
    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock && product.stockQuantity <= 0) return;
    setBuying(true);
    await addToCart(product, 1);
    setBuying(false);
    navigate('/checkout');
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const ratingValue = Number(product.averageRating || 4.2).toFixed(1);
  const reviewCount = product.reviewCount || 38;
  const isOutOfStock = !product.inStock && product.stockQuantity <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* 1. Top Image Frame with Flipkart-Style Badges & Quick Action Controls */}
      <div className="relative aspect-square overflow-hidden bg-slate-50/40 p-2 sm:p-3.5 flex items-center justify-center">
        <Link to={`/products/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top-Left: Flipkart/Amazon style Discount & Special Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.discountPercent > 0 && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black bg-[#388e3c] text-white shadow-xs tracking-tight uppercase">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-[#2874f0] text-white shadow-xs uppercase tracking-tight">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-amber-500 text-white shadow-xs uppercase tracking-tight">
              New
            </span>
          )}
        </div>

        {/* Top-Right: Floating Wishlist & Quick Controls */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleToggleWishlist}
            aria-label={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-xs transition-all duration-200 active:scale-90 ${
              isLiked
                ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                : 'bg-white/90 text-slate-500 hover:bg-white hover:text-rose-500 hover:shadow-sm'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            aria-label="Quick View"
            title="Quick View"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/90 text-slate-600 hover:bg-white hover:text-[#2874f0] shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 hidden sm:flex"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] sm:text-xs font-black rounded-lg uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Details & Flipkart/Amazon Typography Hierarchy */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand & Category Strip */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span className="text-slate-500 truncate max-w-[90px] sm:max-w-[120px]">
              {product.brand?.name || product.category?.name || 'ShopSphere'}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 truncate max-w-[80px]">
              {product.category?.name}
            </span>
          </div>

          {/* Product Title (2-Line Clamp for Mobile) */}
          <Link
            to={`/products/${product.slug || product.id}`}
            className="block font-semibold text-slate-900 text-xs sm:text-sm hover:text-[#2874f0] transition-colors line-clamp-2 leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating Pill (Flipkart Green Pill) & ShopZone Assured Tag */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white font-extrabold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded shadow-2xs">
              <span>{ratingValue}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">({reviewCount.toLocaleString('en-IN')})</span>

            <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[9px] font-black text-[#2874f0] bg-blue-50 px-1 py-0.5 rounded border border-blue-100 ml-auto whitespace-nowrap">
              <ShieldCheck className="w-2.5 h-2.5 text-[#2874f0]" />
              <span>Assured</span>
            </span>
          </div>
        </div>

        {/* 3. Pricing & Delivery Perks */}
        <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
              ₹{Number(product.discountedPrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#388e3c]">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Flipkart Free Delivery / 7-Day Return Guarantee Micro-text */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 pb-0.5">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5 text-emerald-600" />
              <span>Free Delivery</span>
            </span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-0.5">
              <RotateCcw className="w-2.5 h-2.5 text-slate-400" />
              <span>7 Days Return</span>
            </span>
          </div>

          {/* 4. Flipkart-Style Dual Action Buttons (Add to Cart & Buy Now) */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`py-1.5 sm:py-2 px-1 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950 hover:shadow-xs'
              }`}
              title="Add to Cart"
            >
              <ShoppingCart className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{adding ? 'Adding...' : 'Add'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || buying}
              className={`py-1.5 sm:py-2 px-1 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#fb641b] hover:bg-orange-600 text-white hover:shadow-xs'
              }`}
              title="Buy Now"
            >
              <Zap className="w-3 h-3 fill-white flex-shrink-0" />
              <span className="truncate">{buying ? '...' : 'Buy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
