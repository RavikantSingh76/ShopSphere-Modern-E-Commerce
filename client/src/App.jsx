import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Storefront Pages
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderTracking } from './pages/OrderTracking';
import { Wishlist } from './pages/Wishlist';
import { ProductCompare } from './pages/ProductCompare';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { NotFound } from './pages/NotFound';

// Compliance & Policy Pages for Razorpay Verification
import { PrivacyPolicy } from './pages/policies/PrivacyPolicy';
import { TermsAndConditions } from './pages/policies/TermsAndConditions';
import { RefundPolicy } from './pages/policies/RefundPolicy';
import { ShippingPolicy } from './pages/policies/ShippingPolicy';
import { ContactUs } from './pages/policies/ContactUs';

// Vendor Portal
import { VendorDashboard } from './pages/vendor/VendorDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBrands } from './pages/admin/AdminBrands';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminAiInsights from './pages/admin/AdminAiInsights';

import { ImpersonationBanner } from './components/common/ImpersonationBanner';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <BrowserRouter>
                <ImpersonationBanner />
                <Routes>
                  {/* Storefront Layout Routes */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/compare" element={<ProductCompare />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    
                    {/* Compliance & Policy Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/cancellation-refund" element={<RefundPolicy />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/contact" element={<ContactUs />} />

                    {/* Vendor Portal Route */}
                    <Route path="/vendor" element={<VendorDashboard />} />
                    <Route path="/vendor/dashboard" element={<VendorDashboard />} />

                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Admin Console Layout Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="ai-insights" element={<AdminAiInsights />} />
                    <Route path="warehousing" element={<AdminDelivery initialTab="inventory" />} />
                    <Route path="audit-trail" element={<AdminDelivery initialTab="transactions" />} />
                    <Route path="delivery" element={<AdminDelivery initialTab="fleet" />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="customers" element={<AdminUsers />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
