import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
  Sparkles,
  Bot,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleOpenAiBot = () => {
    window.dispatchEvent(new CustomEvent('toggle-ai-shopping-bot'));
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      isActive: location.pathname === '/',
    },
    {
      label: 'Explore',
      path: '/products',
      icon: LayoutGrid,
      isActive: location.pathname.startsWith('/products'),
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      icon: Heart,
      badge: wishlistCount,
      isActive: location.pathname === '/wishlist',
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingCart,
      badge: cartCount,
      isActive: location.pathname === '/cart',
    },
    {
      label: isAuthenticated ? 'Account' : 'Login',
      path: isAuthenticated ? '/profile' : '/login',
      icon: User,
      isActive: location.pathname === '/profile' || location.pathname === '/login' || location.pathname === '/register',
    },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-[60] px-3 pointer-events-none lg:hidden flex items-center justify-center gap-2 max-w-md mx-auto">
      {/* 1. Floating Pill (Capsule) Navigation Container */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="pointer-events-auto flex-1 bg-slate-950/90 backdrop-blur-xl border border-white/15 rounded-full px-2.5 py-1.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] flex items-center justify-around"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all duration-200 active:scale-90 ${
                active
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Ambient Pill Indicator */}
              {active && (
                <span className="absolute inset-0 bg-emerald-500/15 rounded-full scale-105 transition-transform" />
              )}

              {/* Icon Container with Badge Counter */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />

                {/* Badge Counter */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center shadow-sm border border-slate-950">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[9px] mt-0.5 tracking-tight line-clamp-1 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 2. Floating AI Assistant Circular Button (Right Side of Pill) */}
      <button
        type="button"
        onClick={handleOpenAiBot}
        aria-label="Open AI Shopping Assistant"
        className="pointer-events-auto relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] border border-white/30 transition-all duration-200 active:scale-90 hover:scale-105 flex-shrink-0 group"
      >
        {/* Pulsing Ambient Ring */}
        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400/40 pointer-events-none" />

        {/* AI Sparkle / Robot Icon */}
        <div className="relative flex items-center justify-center">
          <Bot className="w-5 h-5 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1.5 animate-pulse" />
        </div>

        {/* Online Status Dot */}
        <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
      </button>
    </div>
  );
};

export default MobileBottomNav;
