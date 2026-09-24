import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Value Propositions / Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Fast Delivery</h4>
              <p className="text-xs text-slate-400">On all orders above ₹500</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">256-Bit SSL Encrypted</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy 7-Day Returns</h4>
              <p className="text-xs text-slate-400">100% Replacement & Instant Refund</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Instant expert assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Bio */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              ShopSphere
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Experience modern online shopping with curated premium electronics, fashion, lifestyle products, and authentic goods delivered fast to your doorstep.
          </p>
          <div className="pt-2 text-xs text-slate-400 space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tech Park, Outer Ring Road, Bengaluru, India</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>+91 9696675081</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>support@shopsphere-ecommerce.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link to="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
            <li><Link to="/track-order" className="hover:text-emerald-400 transition-colors">Track Your Order</Link></li>
            <li><Link to="/contact-us" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-emerald-400 transition-colors">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-emerald-400 transition-colors">Refund & Returns</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop By Category</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link to="/products?category=electronics" className="hover:text-emerald-400 transition-colors">Electronics & Gadgets</Link></li>
            <li><Link to="/products?category=fashion" className="hover:text-emerald-400 transition-colors">Fashion & Apparel</Link></li>
            <li><Link to="/products?category=home-living" className="hover:text-emerald-400 transition-colors">Home & Living</Link></li>
            <li><Link to="/products?category=beauty-personal-care" className="hover:text-emerald-400 transition-colors">Beauty & Personal Care</Link></li>
            <li><Link to="/products?category=sports-outdoors" className="hover:text-emerald-400 transition-colors">Sports & Fitness</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Stay In The Loop</h4>
          <p className="text-xs text-slate-400 mb-3">
            Subscribe for exclusive discounts, new product drops and flash sales.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to newsletter successfully!'); }} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Trademark Legal Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800/80">
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          <span className="font-semibold text-slate-400">Trademark Disclaimer:</span> All product names, logos, brands, and registered trademarks displayed on ShopSphere are property of their respective owners. All company, product, and service names used on this platform are strictly for identification and descriptive purposes under nominative fair use. Use of these names, logos, and brands does not imply any endorsement, sponsorship, or official affiliation.
        </p>
      </div>

      {/* Copyright & Compliance Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 ShopSphere Retail. All Rights Reserved. (Razorpay Verified Merchant)</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
          <Link to="/refund-policy" className="hover:text-slate-300 transition-colors">Refund Policy</Link>
          <Link to="/shipping-policy" className="hover:text-slate-300 transition-colors">Shipping Policy</Link>
          <Link to="/contact-us" className="hover:text-slate-300 transition-colors">Contact Us</Link>
          <Link to="/vendor" className="text-blue-400 hover:underline font-semibold">Vendor Portal</Link>
          <Link to="/admin" className="text-emerald-500 hover:underline font-semibold">Admin Panel</Link>
        </div>
      </div>
    </footer>
  );
};
