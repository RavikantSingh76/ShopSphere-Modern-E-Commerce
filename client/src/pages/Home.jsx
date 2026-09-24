import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  ChevronLeft,
  Flame,
  Tag,
  CheckCircle2,
  Percent,
  Layers,
  Smartphone,
  Headphones,
  Laptop,
  Shirt,
  BookOpen,
  Home as HomeIcon,
  Dumbbell,
  Sparkle,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import { productApi, categoryApi, brandApi } from '../services/api';
import { getBrandLogo } from '../utils/imageHelper';

export const Home = () => {
  const { openQuickView } = useOutletContext() || {};

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active tab for product showcases
  const [activeTab, setActiveTab] = useState('trending');

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Flash Sale Countdown Timer State (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  const heroSlides = [
    {
      id: 1,
      badge: 'FESTIVAL SPECIAL MEGA SALE',
      title: 'Next-Gen Tech & Electronics',
      subtitle: 'Up to 50% Off on Premium Laptops, Smartphones & Audio',
      ctaText: 'Shop Electronics',
      ctaLink: '/products?category=electronics',
      gradient: 'from-blue-900 via-indigo-950 to-slate-950',
      accent: 'from-cyan-400 to-blue-500',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      tag: '50% OFF',
    },
    {
      id: 2,
      badge: 'AUTHENTIC FOOTWEAR & APPAREL',
      title: 'Top Lifestyle & Sportswear',
      subtitle: 'Official Nike, Puma & Premium Activewear with 7-Day Easy Returns',
      ctaText: 'Explore Fashion',
      ctaLink: '/products?category=fashion-apparel',
      gradient: 'from-emerald-950 via-slate-900 to-slate-950',
      accent: 'from-emerald-400 to-teal-300',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      tag: 'HOT DEALS',
    },
    {
      id: 3,
      badge: 'PRODUCTIVITY & STUDENT ESSENTIALS',
      title: 'Books & Premium Stationery Hub',
      subtitle: 'Best selling Classmate, Apsara, Journals & Global Bestsellers',
      ctaText: 'Shop Stationery',
      ctaLink: '/products?category=books-stationery',
      gradient: 'from-amber-950 via-slate-900 to-slate-950',
      accent: 'from-amber-400 to-orange-400',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      tag: 'MIN 30% OFF',
    },
  ];

  // Auto-slide hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Flash deal tick-down timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, trendRes, newRes, bestRes, catRes, brandRes] = await Promise.all([
          productApi.getFeatured(),
          productApi.getTrending(),
          productApi.getNewArrivals(),
          productApi.getBestSellers(),
          categoryApi.getActive(),
          brandApi.getActive(),
        ]);

        if (featRes.success) setFeaturedProducts(featRes.data || []);
        if (trendRes.success) setTrendingProducts(trendRes.data || []);
        if (newRes.success) setNewArrivals(newRes.data || []);
        if (bestRes.success) setBestSellers(bestRes.data || []);
        if (catRes.success) setCategories(catRes.data || []);
        if (brandRes.success) setBrands(brandRes.data || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const getActiveTabProducts = () => {
    switch (activeTab) {
      case 'trending':
        return trendingProducts.length > 0 ? trendingProducts : featuredProducts;
      case 'new':
        return newArrivals.length > 0 ? newArrivals : featuredProducts;
      case 'bestseller':
        return bestSellers.length > 0 ? bestSellers : featuredProducts;
      case 'featured':
      default:
        return featuredProducts;
    }
  };

  const getCategoryIcon = (slug) => {
    const s = (slug || '').toLowerCase();
    if (s.includes('elect') || s.includes('phone') || s.includes('mob')) return <Smartphone className="w-5 h-5 text-blue-500" />;
    if (s.includes('audio') || s.includes('head')) return <Headphones className="w-5 h-5 text-indigo-500" />;
    if (s.includes('lap') || s.includes('comp')) return <Laptop className="w-5 h-5 text-purple-500" />;
    if (s.includes('fash') || s.includes('app') || s.includes('cloth')) return <Shirt className="w-5 h-5 text-rose-500" />;
    if (s.includes('book') || s.includes('stat') || s.includes('pen')) return <BookOpen className="w-5 h-5 text-amber-500" />;
    if (s.includes('fit') || s.includes('sport') || s.includes('gym')) return <Dumbbell className="w-5 h-5 text-emerald-500" />;
    return <HomeIcon className="w-5 h-5 text-teal-500" />;
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* 1. TOP MOBILE FLIPKART/AMAZON CATEGORY STORIES HORIZONTAL STRIP */}
      <section className="bg-white border-b border-slate-200/80 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-none py-1">
            {/* All Products Story Circle */}
            <Link
              to="/products"
              className="flex flex-col items-center flex-shrink-0 group text-center w-16 sm:w-20"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xs group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-emerald-600">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-800 mt-1.5 line-clamp-1 group-hover:text-emerald-600">
                All Offers
              </span>
            </Link>

            {/* Dynamic Categories Story Circles */}
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center flex-shrink-0 group text-center w-16 sm:w-20"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 p-0.5 shadow-xs border border-slate-200/80 group-hover:border-emerald-500 group-hover:scale-105 transition-all overflow-hidden relative">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      {getCategoryIcon(cat.slug)}
                    </div>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1.5 line-clamp-1 group-hover:text-emerald-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HERO CAROUSEL BANNER (Flipkart Mega Offer Banner) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[220px] sm:min-h-[360px] bg-slate-950">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 flex items-center ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              } bg-gradient-to-r ${slide.gradient}`}
            >
              {/* Background ambient blur */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-12 gap-4 items-center w-full p-6 sm:p-12 relative z-10">
                {/* Text Content (7 cols on Desktop, 8 on Mobile) */}
                <div className="col-span-8 sm:col-span-7 space-y-2 sm:space-y-4">
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-xs font-black px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>{slide.badge}</span>
                  </span>

                  <h1 className="text-lg sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                    {slide.title}
                  </h1>

                  <p className="text-[11px] sm:text-base text-slate-300 line-clamp-2 max-w-md font-normal leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="pt-1 sm:pt-2">
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg active:scale-95 transition-all"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Image (4 cols on Desktop, 4 on Mobile) */}
                <div className="col-span-4 sm:col-span-5 flex justify-end">
                  <div className="relative w-28 h-28 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-md p-2">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain mix-blend-lighten scale-105"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[9px] sm:text-xs font-black bg-rose-500 text-white shadow-md">
                      {slide.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLIPKART/AMAZON 4-PILL TRUST & BENEFITS BAR */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center space-x-2.5 p-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Free Fast Delivery</p>
              <p className="text-[10px] text-slate-400">On all ₹500+ orders</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Easy 7-Day Returns</p>
              <p className="text-[10px] text-slate-400">100% Instant Refund</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">100% Authentic</p>
              <p className="text-[10px] text-slate-400">Direct Brand Warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">UPI & COD Available</p>
              <p className="text-[10px] text-slate-400">Instant Safe Checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLASH SALE & DEAL OF THE DAY (Timer Ticking Shelf) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-black tracking-tight text-white">
                    Flash Deals of the Day
                  </h2>
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-black rounded-md uppercase border border-rose-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400">Unbeatable prices on bestselling items</p>
              </div>
            </div>

            {/* Real-time Countdown Timer */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto">
              <span className="text-[11px] text-slate-400 font-bold mr-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Ends in:</span>
              </span>
              <div className="px-2 py-1 bg-white/10 rounded-lg text-xs font-mono font-black text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <span className="font-bold text-amber-400">:</span>
              <div className="px-2 py-1 bg-white/10 rounded-lg text-xs font-mono font-black text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <span className="font-bold text-amber-400">:</span>
              <div className="px-2 py-1 bg-white/10 rounded-lg text-xs font-mono font-black text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>

          {/* Flash Deal Horizontal Scroll / 2-Col Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(trendingProducts.length > 0 ? trendingProducts.slice(0, 4) : featuredProducts.slice(0, 4)).map((prod) => (
              <ProductCard key={prod.id} product={prod} onQuickView={openQuickView} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAIN TABBED PRODUCT SHOWCASE (Flipkart-Style 2-Col Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Curated Recommendations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Catalog
            </h2>
          </div>

          {/* Flipkart Showcase Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: 'trending', label: '🔥 Trending' },
              { id: 'bestseller', label: '⭐ Best Sellers' },
              { id: 'new', label: '🆕 New Arrivals' },
              { id: 'featured', label: '💎 Featured' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {getActiveTabProducts().slice(0, 12).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={openQuickView}
              />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 shadow-md active:scale-95 transition-all"
          >
            <span>View All {categories.length > 0 ? `${categories.length}+ Categories` : 'Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. TOP GLOBAL BRANDS SHOWCASE (Flipkart Brand Store) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
              100% Authentic Brands
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Top Global Brands
            </h2>
          </div>
          <button
            onClick={() => setShowAllBrands(prev => !prev)}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>{showAllBrands ? 'Show Top 24' : `View All (${brands.length})`}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllBrands ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>

        {(() => {
          const MARQUEE_SLUGS = [
            'apple', 'samsung', 'sony', 'nike', 'adidas', 'dell', 'puma', 'boat',
            'ikea', 'lenovo', 'hp', 'asus', 'levis', 'zara', 'philips', 'hm',
            'casio', 'ray-ban', 'maybelline', 'loreal', 'nivea', 'yonex', 'wilson-tennis', 'classmate'
          ];

          const sortedBrands = [...brands].sort((a, b) => {
            const aIdx = MARQUEE_SLUGS.indexOf(a.slug);
            const bIdx = MARQUEE_SLUGS.indexOf(b.slug);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return (a.name || '').localeCompare(b.name || '');
          });

          const displayed = showAllBrands ? sortedBrands : sortedBrands.slice(0, 24);

          return (
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
                {displayed.map((brand) => {
                  const logo = getBrandLogo(brand);
                  return (
                    <Link
                      key={brand.id}
                      to={`/products?brand=${brand.slug}`}
                      className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center group hover:-translate-y-0.5"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50/80 border border-slate-100 p-2 flex items-center justify-center mb-1.5 shadow-2xs group-hover:border-emerald-200 group-hover:bg-white group-hover:scale-105 transition-all overflow-hidden">
                        {logo ? (
                          <img
                            src={logo}
                            alt={`${brand.name} Logo`}
                            className="max-w-full max-h-full object-contain filter contrast-110"
                            loading="lazy"
                          />
                        ) : (
                          <span className="font-mono font-black text-slate-800 text-xs sm:text-sm">
                            {brand.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-700 group-hover:text-emerald-600 transition-colors truncate max-w-full">
                        {brand.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAllBrands(prev => !prev)}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-700 hover:text-emerald-600 shadow-2xs transition-all flex items-center gap-1.5"
                >
                  <span>{showAllBrands ? 'Show Top 24 Brands' : `Explore All ${brands.length} Verified Brands`}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllBrands ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </div>
            </div>
          );
        })()}

        {/* Legal Trademark Disclaimer for Brand Logos */}
        <p className="mt-3 text-[10px] sm:text-[11px] text-slate-400 text-center leading-relaxed">
          * <span className="font-semibold">Legal Notice:</span> All brand names, logos, and registered trademarks displayed are property of their respective owners. Their inclusion is solely for product identification under the doctrine of nominative fair use and does not imply direct affiliation or endorsement.
        </p>
      </section>
    </div>
  );
};

export default Home;
