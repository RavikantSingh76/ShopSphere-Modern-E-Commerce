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

// Lazy-Loaded Compliance & Policy Pages (Code Splitting)
const PrivacyPolicy = React.lazy(() => import('./pages/policies/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsAndConditions = React.lazy(() => import('./pages/policies/TermsAndConditions').then(m => ({ default: m.TermsAndConditions })));
const RefundPolicy = React.lazy(() => import('./pages/policies/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const ShippingPolicy = React.lazy(() => import('./pages/policies/ShippingPolicy').then(m => ({ default: m.ShippingPolicy })));
const ContactUs = React.lazy(() => import('./pages/policies/ContactUs').then(m => ({ default: m.ContactUs })));

// Lazy-Loaded Vendor Portal
const VendorDashboard = React.lazy(() => import('./pages/vendor/VendorDashboard').then(m => ({ default: m.VendorDashboard })));

// Lazy-Loaded Admin Suite (Significant reduction in initial customer bundle size)
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminBrands = React.lazy(() => import('./pages/admin/AdminBrands').then(m => ({ default: m.AdminBrands })));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminCoupons = React.lazy(() => import('./pages/admin/AdminCoupons').then(m => ({ default: m.AdminCoupons })));
const AdminDelivery = React.lazy(() => import('./pages/admin/AdminDelivery'));
const AdminAiInsights = React.lazy(() => import('./pages/admin/AdminAiInsights'));

import { ImpersonationBanner } from './components/common/ImpersonationBanner';

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <BrowserRouter>
                <ImpersonationBanner />
                <React.Suspense fallback={<RouteLoader />}>
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
                </React.Suspense>
              </BrowserRouter>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
