import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Zap,
  ArrowLeftRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquarePlus,
} from 'lucide-react';
import { StarRating } from '../components/common/StarRating';
import { Badge } from '../components/common/Badge';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/product/ProductCard';
import { Modal } from '../components/common/Modal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productApi, reviewApi } from '../services/api';
import { getProductGallery, getProductImage, getBrandLogo } from '../utils/imageHelper';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openQuickView } = useOutletContext() || {};
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center center' });

  useEffect(() => {
    let isMounted = true;

    const loadProductData = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        let prod = null;

        // Try slug lookup first
        try {
          const res = await productApi.getProductBySlug(slug);
          if (res?.success && res?.data) {
            prod = res.data;
          }
        } catch (slugErr) {
          // If slug lookup fails and parameter is numeric ID, try ID lookup
          if (!isNaN(slug) && Number(slug) > 0) {
            try {
              const idRes = await productApi.getProductById(slug);
              if (idRes?.success && idRes?.data) {
                prod = idRes.data;
              }
            } catch (idErr) {
              console.warn('ID lookup failed after slug lookup:', idErr);
            }
          }
        }

        // If still null and slug is a numeric string
        if (!prod && !isNaN(slug) && Number(slug) > 0) {
          try {
            const idRes = await productApi.getProductById(slug);
            if (idRes?.success && idRes?.data) {
              prod = idRes.data;
            }
          } catch (e) {
            console.warn('Fallback ID lookup error:', e);
          }
        }

        if (!isMounted) return;

        if (prod) {
          setProduct(prod);
          setSelectedImage(0);

          // Fetch reviews & related items safely
          try {
            const [revRes, relRes] = await Promise.all([
              prod.id ? reviewApi.getProductReviews(prod.id, { page: 0, size: 10 }).catch(() => null) : Promise.resolve(null),
              prod.category?.slug ? productApi.getRelated(prod.category.slug, prod.id, 8).catch(() => null) : Promise.resolve(null),
            ]);

            if (isMounted) {
              if (revRes?.success && revRes?.data) {
                setReviews(Array.isArray(revRes.data.content) ? revRes.data.content : (Array.isArray(revRes.data) ? revRes.data : []));
              }
              if (relRes?.success && Array.isArray(relRes?.data) && relRes.data.length > 0) {
                setRelatedProducts(relRes.data);
              } else if (prod.category?.slug) {
                // Fallback to fetch category products
                try {
                  const catRes = await productApi.getProducts({ category: prod.category.slug, page: 0, size: 8 });
                  if (catRes?.data?.content) {
                    setRelatedProducts(catRes.data.content.filter(p => p.id !== prod.id).slice(0, 8));
                  }
                } catch (e) {}
              }
            }
          } catch (auxErr) {
            console.warn('Auxiliary reviews/related data fetch notice:', auxErr);
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        if (isMounted) {
          setLoadError(err.message || 'Unable to load product details');
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadProductData();
    } else {
      setLoading(false);
      setProduct(null);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Connection Error</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{loadError}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Retry
          </button>
          <Link to="/products" className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">The item you are looking for might have been removed or renamed.</p>
        <div className="pt-2">
          <Link to="/products" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const gallery = getProductGallery(product);
  const images = (Array.isArray(gallery) && gallery.length > 0)
    ? gallery
    : (product.primaryImageUrl ? [product.primaryImageUrl] : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80']);

  // Ensure selectedImage index is always within valid bounds
  const activeImageIndex = (selectedImage >= 0 && selectedImage < images.length) ? selectedImage : 0;
  const currentImage = images[activeImageIndex] || images[0];

  // Parse specifications JSON
  let specsObj = {};
  if (product.specifications) {
    try {
      specsObj = JSON.parse(product.specifications);
    } catch (e) {
      // Plain text specs
    }
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' });
  };

  const getAngleLabel = (idx, total) => {
    if (total === 1) return 'Main View';
    if (idx === 0) return 'Front Profile';
    if (idx === 1) return 'Side / Angle View';
    if (idx === 2) return 'Rear / Detail View';
    if (idx === 3) return 'Perspective View';
    return `Angle ${idx + 1}`;
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    const added = await addToCart(product, quantity);
    if (added) navigate('/checkout');
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toastError('Please sign in to write a review');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await reviewApi.addReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
        success('Your review has been submitted successfully!');
        setReviewModalOpen(false);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Shop', link: '/products' },
          ...(product.category ? [{ label: product.category.name, link: `/products?category=${product.category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Flipkart Multi-Photo Image Gallery & Vertical Thumbnails (6 cols) */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-start">
          {/* Flipkart-Style Vertical Thumbnails Strip */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[520px] w-full sm:w-20 shrink-0 py-1 px-0.5 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  onMouseEnter={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all cursor-pointer p-1.5 ${
                    activeImageIndex === idx
                      ? 'border-[#2874f0] ring-2 ring-blue-200 shadow-md scale-105'
                      : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400'
                  }`}
                  title={`${getAngleLabel(idx, images.length)} - View angle ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {activeImageIndex === idx && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#2874f0]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Flipkart Main Large Preview Frame */}
          <div className="flex-1 w-full space-y-2">
            <div
              className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm relative flex items-center justify-center p-6 group cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={currentImage}
                alt={`${product.name} - ${getAngleLabel(activeImageIndex, images.length)}`}
                style={isZoomed ? zoomStyle : { transform: 'scale(1)' }}
                className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out"
              />

              {/* Angle View Badge */}
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{getAngleLabel(activeImageIndex, images.length)}</span>
              </span>

              {/* Discount Badge */}
              {product.discountPercent > 0 && (
                <span className="absolute top-4 right-16 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500 text-white shadow-sm flex items-center gap-1 uppercase tracking-tight">
                  -{product.discountPercent}% OFF
                </span>
              )}

              {/* Wishlist & Share Floating Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all ${
                    isLiked ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      success('Product link copied to clipboard!');
                    }
                  }}
                  title="Share Product"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-600 hover:bg-white hover:text-emerald-600 shadow-sm transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Arrow Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    title="Previous Angle"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    title="Next Angle"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Count Indicator */}
              {images.length > 1 && (
                <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/70 backdrop-blur-md text-white shadow-sm pointer-events-none">
                  {activeImageIndex + 1} / {images.length} Photos
                </span>
              )}
            </div>

            {/* Hover Zoom Hint */}
            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <span>🔍 Hover over image to zoom & inspect fine details</span>
            </p>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{product.category?.name || 'Category'}</Badge>
              {product.brand && (
                <Link
                  to={`/products?brand=${product.brand.slug}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-all shadow-2xs group"
                  title={`View all products from ${product.brand.name}`}
                >
                  {getBrandLogo(product.brand) && (
                    <img
                      src={getBrandLogo(product.brand)}
                      alt={product.brand.name}
                      className="w-4 h-4 object-contain rounded"
                    />
                  )}
                  <span>{product.brand.name}</span>
                </Link>
              )}
              <span className="text-xs text-slate-400 ml-auto font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Assured Badge */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow-xs">
                <span>{Number(product.averageRating || 4.2).toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              </div>
              <span className="text-xs text-slate-500 font-medium">({(product.reviewCount || 42).toLocaleString('en-IN')} Customer Ratings)</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>ShopZone Assured</span>
              </span>
              <span className={`text-xs font-bold ml-auto ${product.inStock || product.stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.inStock || product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} units left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Detailed Pricing Structure */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-4 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ₹{Number(product.discountedPrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {product.discountPercent}% Off • Save ₹{(Number(product.price) - Number(product.discountedPrice)).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quantity and Side-by-Side Flipkart Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold min-w-[36px] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Side-by-Side Vibrant Buttons: Add to Cart (Amber) & Buy Now (Orange) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock && product.stockQuantity <= 0}
                className="w-full py-3.5 rounded-2xl text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock && product.stockQuantity <= 0}
                className="w-full py-3.5 rounded-2xl text-xs font-black text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Buy Now with Instant Checkout"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Auxiliary actions: Wishlist, Compare */}
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-600">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-rose-600 transition-colors font-medium"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isLiked ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => addToCompare(product)}
                className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors font-medium"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Security Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Free Delivery</p>
              <p className="text-[10px] text-slate-400">On ₹500+ orders</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Genuine Product</p>
              <p className="text-[10px] text-slate-400">100% Guaranteed</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-emerald-100/80 bg-emerald-50/40">
              <RotateCcw className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-extrabold text-slate-900">Easy 7 Days Return</p>
              <p className="text-[10px] text-emerald-700 font-semibold">100% Replacement/Refund</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specifications / Customer Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex border-b border-slate-200 space-x-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'description' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Detailed Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'specs' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {product.description || product.shortDescription}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              {Object.keys(specsObj).length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {Object.entries(specsObj).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-3 p-3.5 text-xs">
                      <span className="font-bold text-slate-500">{key}</span>
                      <span className="col-span-2 text-slate-800 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-6 text-xs text-slate-500">Standard specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Header & Write Review Trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-slate-900">{product.averageRating?.toFixed(1) || '0.0'}</span>
                    <StarRating rating={product.averageRating || 0} size="md" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Based on {reviews.length} verified customer reviews</p>
                </div>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-2"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No reviews yet for this product. Be the first to share your thoughts!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                            <img
                              src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{rev.userName || 'Verified Customer'}</span>
                              {rev.verifiedPurchase && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                  <Check className="w-3 h-3 mr-0.5" /> Verified Purchase
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <StarRating rating={rev.rating} size="xs" />
                      </div>

                      {rev.title && <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>}
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid (Flipkart & Amazon Mobile 2-Col Shelf) */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 sm:pt-10 border-t border-slate-200 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Similar Items & Alternatives
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Related Products
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {relatedProducts.length} items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} onQuickView={openQuickView} />
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write a Product Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
            <StarRating rating={reviewRating} size="lg" interactive={true} onRatingChange={setReviewRating} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
            <input
              type="text"
              placeholder="e.g. Excellent build quality and fast delivery"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review *</label>
            <textarea
              rows={4}
              required
              placeholder="What did you like or dislike? What was your experience using this product?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
