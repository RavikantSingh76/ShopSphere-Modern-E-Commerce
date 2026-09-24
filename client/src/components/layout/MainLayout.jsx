import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { CompareDrawer } from '../common/CompareDrawer';
import { QuickViewModal } from '../product/QuickViewModal';
import AiShoppingBot from '../common/AiShoppingBot';

export const MainLayout = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
      <Navbar />
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet context={{ openQuickView: (product) => setQuickViewProduct(product) }} />
      </main>
      <Footer />
      <CompareDrawer />
      <AiShoppingBot />
      <MobileBottomNav />
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
};
