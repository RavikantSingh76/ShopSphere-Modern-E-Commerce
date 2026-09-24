import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductGallery, getProductImage } from '../../utils/imageHelper';

export const QuickViewModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  // Selected image index state for active preview
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Reset selected image index when product changes or modal is opened
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [product?.id, isOpen]);

  const isLiked = isInWishlist(product.id);
  const gallery = getProductGallery(product);
  const images = (Array.isArray(gallery) && gallery.length > 0)
    ? gallery
    : (product.primaryImageUrl ? [product.primaryImageUrl] : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80']);

  // Ensure selectedImage is always within valid array bounds
  const activeImageIndex = (selectedImage >= 0 && selectedImage < images.length) ? selectedImage : 0;
  const currentImage = images[activeImageIndex] || images[0];

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Preview" maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Images */}
        <div className="flex flex-col space-y-3">
          <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200 relative flex items-center justify-center p-4">
            <img
              src={currentImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500 text-white shadow-sm">
                -{product.discountPercent}% OFF
              </span>
            )}
            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/70 text-white shadow-sm">
                {activeImageIndex + 1} / {images.length}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all p-1 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#2874f0] ring-2 ring-blue-100 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{product.category?.name || 'Category'}</Badge>
              {product.brand && <Badge variant="secondary">{product.brand.name}</Badge>}
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.averageRating || 0} reviewCount={product.reviewCount} size="sm" />
              <span className="text-xs text-slate-300">|</span>
              <span className={`text-xs font-semibold ${product.inStock || product.stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.inStock || product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{Number(product.discountedPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.discountPercent > 0 && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-rose-500">
                    Save ₹{(Number(product.price) - Number(product.discountedPrice)).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-semibold min-w-[32px] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock && product.stockQuantity <= 0}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock && product.stockQuantity <= 0}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Easy 7 Days Return</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                <span>100% Genuine</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                <span>Fast Delivery</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="text-xs font-medium text-slate-600 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isLiked ? 'In Wishlist' : 'Add to Wishlist'}
              </button>

              <Link
                to={`/products/${product.slug || product.id}`}
                onClick={onClose}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
              >
                View Full Details
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
