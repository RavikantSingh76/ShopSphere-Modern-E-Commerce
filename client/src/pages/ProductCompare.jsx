import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeftRight, ShoppingCart, Check, X } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StarRating } from '../components/common/StarRating';
import { EmptyState } from '../components/common/EmptyState';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

export const ProductCompare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Breadcrumb items={[{ label: 'Product Comparison' }]} />
        <EmptyState
          icon={ArrowLeftRight}
          title="No Products in Compare List"
          description="Click the compare icon on any product card or detail page to compare features side-by-side."
          actionText="Explore Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Product Comparison' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">Comparing {compareItems.length} products</p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-card">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="p-4 sm:p-6 w-44 font-bold text-slate-400 uppercase tracking-wider">Features</th>
              {compareItems.map((prod) => (
                <th key={prod.id} className="p-4 sm:p-6 min-w-[220px] max-w-[260px] align-top">
                  <div className="space-y-3 relative">
                    <button
                      onClick={() => removeFromCompare(prod.id)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                      <img
                        src={prod.primaryImageUrl || prod.images?.[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Link
                      to={`/products/${prod.slug || prod.id}`}
                      className="font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2"
                    >
                      {prod.name}
                    </Link>
                    <div className="text-sm font-extrabold text-slate-900">
                      ₹{Number(prod.discountedPrice || prod.price).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Category</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-4">{p.category?.name || 'N/A'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Brand</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-4">{p.brand?.name || 'Generic'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Rating</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-4">
                  <StarRating rating={p.averageRating || 0} reviewCount={p.reviewCount} size="xs" />
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Availability</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-4">
                  <span className={`font-bold ${p.inStock || p.stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {p.inStock || p.stockQuantity > 0 ? `In Stock (${p.stockQuantity})` : 'Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30">Discount</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-4">{p.discountPercent > 0 ? `${p.discountPercent}% Off` : 'None'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/30 align-top">Description</td>
              {compareItems.map((p) => (
                <td key={p.id} className="p-4 text-[11px] text-slate-500 leading-relaxed align-top">
                  {p.shortDescription || p.description}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
