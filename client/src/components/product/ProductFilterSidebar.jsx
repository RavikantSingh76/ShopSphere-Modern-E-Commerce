import React, { useState } from 'react';
import { Filter, RotateCcw, Check, Star, Search } from 'lucide-react';

export const ProductFilterSidebar = ({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
  minRating,
  inStockOnly,
  minDiscount,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onStockChange,
  onDiscountChange,
  onResetFilters,
}) => {
  const [brandSearch, setBrandSearch] = useState('');

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.trim().toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={() => {
            setBrandSearch('');
            onResetFilters();
          }}
          className="text-xs font-semibold text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Categories</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              !selectedCategory ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brands</h4>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {brands.length} available
          </span>
        </div>

        {brands.length > 7 && (
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
            />
          </div>
        )}

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onBrandChange('')}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              !selectedBrand ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Brands
          </button>
          {filteredBrands.map((b) => (
            <button
              key={b.id}
              onClick={() => onBrandChange(b.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                selectedBrand === b.slug
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{b.name}</span>
            </button>
          ))}
          {filteredBrands.length === 0 && (
            <div className="text-center py-2 text-xs text-slate-400 italic">
              No matching brands
            </div>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Price Range (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(minRating === stars ? null : stars)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                minRating === stars ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>& above</span>
              </div>
              {minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Discount</h4>
        <div className="space-y-1">
          {[10, 20, 30, 50].map((disc) => (
            <button
              key={disc}
              onClick={() => onDiscountChange(minDiscount === disc ? null : disc)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                minDiscount === disc ? 'bg-rose-50 text-rose-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{disc}% and above</span>
              {minDiscount === disc && <Check className="w-3.5 h-3.5 text-rose-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>In Stock Items Only</span>
        </label>
      </div>
    </div>
  );
};
