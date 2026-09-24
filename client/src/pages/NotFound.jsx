import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ShoppingCart } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
        <Compass className="w-12 h-12 text-emerald-600 animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-5xl font-black text-slate-900 tracking-tight">404</span>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The page or product you are attempting to visit does not exist or has moved to another address.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </Link>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
};
