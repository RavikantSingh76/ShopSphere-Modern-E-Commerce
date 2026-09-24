import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowLeftRight,
  ShieldAlert,
  LogOut,
  Package,
  MapPin,
  Sparkles,
  Zap,
  Phone,
  RotateCcw,
  Store,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { productApi, categoryApi } from '../../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load active categories for dropdown
  useEffect(() => {
    categoryApi
      .getActive()
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch(console.error);
  }, []);

  // Live search suggestions debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productApi.getSuggestions(searchQuery.trim(), 5);
        if (res.success && res.data) {
          setSuggestions(res.data);
          setShowSuggestions(true);
        }
      } catch (e) {
        console.error(e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Prevent background body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    let url = `/products?query=${encodeURIComponent(searchQuery.trim())}`;
    if (selectedCategory) {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    navigate(url);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">
              Summer Fest: 50% Off! Code <strong className="text-emerald-400 font-bold">FESTIVE50</strong> • Easy 7-Day Returns
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-slate-300 text-xs">
            <Link to="/track-order" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 96966 75081</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-nav border-b border-slate-200/80 shadow-xs transition-all bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            {/* Left: Mobile Menu Button & Brand Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Responsive Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 flex items-center justify-center active:scale-90 transition-all border border-slate-200/80 shadow-2xs touch-manipulation focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-rose-600 transition-transform duration-200 rotate-90" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 w-5 h-5">
                    <span className="w-4 h-0.5 bg-slate-800 rounded-full transition-all" />
                    <span className="w-4 h-0.5 bg-slate-800 rounded-full transition-all" />
                    <span className="w-3 h-0.5 bg-slate-800 rounded-full transition-all self-start ml-0.5" />
                  </div>
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 touch-manipulation">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-xl font-extrabold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent tracking-tight leading-none">
                    ShopSphere
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-emerald-600 leading-none mt-0.5">
                    STORE
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Search Bar with Category Filter */}
            <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl relative">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center rounded-xl bg-slate-100/90 border border-slate-200/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:bg-white transition-all overflow-hidden"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 pl-3 pr-2 py-2.5 border-r border-slate-200 focus:outline-none cursor-pointer max-w-[130px] truncate"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search products, brands, gadgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50 animate-slide-up">
                  <div className="p-2 divide-y divide-slate-50">
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/products/${item.slug || item.id}`}
                        onClick={() => setShowSuggestions(false)}
                        className="flex items-center p-2.5 hover:bg-slate-50 rounded-xl transition-colors space-x-3"
                      >
                        <img
                          src={item.primaryImageUrl || item.images?.[0]}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {item.category?.name} • ₹{Number(item.discountedPrice || item.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Icons: Compare, Wishlist, Cart, Profile */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Compare (Desktop) */}
              <Link
                to="/compare"
                title="Compare Products"
                className="hidden md:flex relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100/80 transition-colors"
              >
                <ArrowLeftRight className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                title="Wishlist"
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100/80 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                title="Shopping Cart"
                className="relative flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 transition-all font-semibold text-xs sm:text-sm"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-emerald-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-emerald-900">
                  ₹{Number(cart.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </Link>

              {/* User Account Menu (Desktop) */}
              <div ref={userMenuRef} className="relative hidden md:block">
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-emerald-500/30">
                      <img
                        src={
                          user?.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden lg:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Link
                      to="/login"
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all"
                    >
                      Join Free
                    </Link>
                  </div>
                )}

                {/* Dropdown Menu */}
                {userDropdownOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl p-2 z-50 animate-slide-up">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Administrator
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 text-xs font-medium text-slate-600">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 font-bold"
                        >
                          <ShieldAlert className="w-4 h-4 text-emerald-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Saved Addresses</span>
                      </Link>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Fast Search Bar Strip (Under Main Header) */}
          <div className="lg:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, brands, mobile, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
              />
            </form>
          </div>

          {/* Secondary Desktop Categories Navigation Strip */}
          <div className="hidden lg:flex items-center justify-between py-2 border-t border-slate-100/60 text-xs font-semibold text-slate-600 overflow-x-auto">
            <div className="flex items-center space-x-6">
              <Link to="/products" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <span>All Products</span>
              </Link>
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.slug}`}
                  className="hover:text-emerald-600 transition-colors whitespace-nowrap"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-slate-500">
              <Link to="/products?discount=20" className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Special Offers</span>
              </Link>
              <Link to="/track-order" className="hover:text-emerald-600 transition-colors">
                Order Tracking
              </Link>
            </div>
          </div>
        </div>

        {/* ----------------- FLIPKART/AMAZON SLIDE-OVER MOBILE DRAWER ----------------- */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] flex animate-in fade-in duration-200">
            {/* Backdrop Overlay */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-out Menu Panel */}
            <div className="relative w-[85vw] max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
              {/* Drawer Top Header (Flipkart/Amazon Profile Banner) */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight">
                      {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0] || 'User'}` : 'Hello, Sign In'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {isAuthenticated ? user?.email : 'Access your account & orders'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="p-4 space-y-5 flex-1 divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {/* 1. Quick Action Shortcuts */}
                <div className="space-y-1 pt-1">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Home</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>All Products & Catalog</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    to="/products?discount=20"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 text-rose-700 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 font-bold">
                      <Zap className="w-4 h-4 text-rose-600" />
                      <span>Special Offers & Deals</span>
                    </span>
                    <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded uppercase">HOT</span>
                  </Link>
                </div>

                {/* 2. Shop by Category */}
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
                    Shop by Categories
                  </p>
                  <div className="space-y-1">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/products?category=${c.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <span>{c.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 3. Account & Orders */}
                <div className="pt-4 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Account & Orders
                  </p>
                  <Link
                    to={isAuthenticated ? '/profile?tab=orders' : '/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>My Orders & Tracking</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Wishlist ({wishlistCount})</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
                      <span>Compare Products ({compareCount})</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-900 font-bold"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Admin Console</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </Link>
                  )}

                  <Link
                    to="/vendor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 text-[#2874f0]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Store className="w-4 h-4" />
                      <span>Vendor Portal</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 4. Support & Compliance */}
                <div className="pt-4 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Help & Customer Care
                  </p>
                  <Link
                    to="/refund-policy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <RotateCcw className="w-4 h-4 text-emerald-600" />
                      <span>Easy 7-Day Returns Policy</span>
                    </span>
                  </Link>

                  <Link
                    to="/contact-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>Contact Helpline (+91 9696675081)</span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Auth Action */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-3 bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl text-center shadow-2xs hover:bg-slate-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center shadow-xs"
                    >
                      Join Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
