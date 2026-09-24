import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilterSidebar } from '../components/product/ProductFilterSidebar';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { productApi, categoryApi, brandApi } from '../services/api';

export const ProductList = () => {
  const { openQuickView } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filter params
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const query = searchParams.get('query') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null;
  const inStockOnly = searchParams.get('inStockOnly') === 'true';
  const minDiscount = searchParams.get('discount') ? Number(searchParams.get('discount')) : null;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'desc';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const pageSize = parseInt(searchParams.get('limit') || searchParams.get('size') || searchParams.get('pageSize') || '12', 10);

  useEffect(() => {
    categoryApi.getActive().then((catRes) => {
      if (catRes.success) setCategories(catRes.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    brandApi.getActive(category ? { category } : {}).then((brandRes) => {
      if (brandRes.success) setBrands(brandRes.data || []);
    }).catch(console.error);
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProducts({
          category,
          brand,
          query,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          minRating: minRating || undefined,
          inStockOnly,
          minDiscount: minDiscount || undefined,
          sortBy,
          sortDir,
          page,
          size: pageSize,
        });

        if (res.success && res.data) {
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brand, query, minPrice, maxPrice, minRating, inStockOnly, minDiscount, sortBy, sortDir, page, pageSize]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // Reset to page 0
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Shop', link: '/products' },
          ...(category ? [{ label: categories.find((c) => c.slug === category)?.name || category }] : []),
          ...(brand ? [{ label: brands.find((b) => b.slug === brand)?.name || brand }] : []),
          ...(query ? [{ label: `Search: "${query}"` }] : []),
        ]}
      />

      {/* Title & Active Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {query ? `Search Results for "${query}"` : category ? categories.find((c) => c.slug === category)?.name || 'Category' : 'All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{totalElements}</strong> items found
          </p>
        </div>

        {/* Right Controls: Sort Dropdown & Items Per Page */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>

          {/* Items Per Page Dropdown */}
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => updateParam('limit', e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="12">12 / page</option>
              <option value="24">24 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
              <option value="150">150 / page</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                const newParams = new URLSearchParams(searchParams);
                newParams.set('sortBy', sb);
                newParams.set('sortDir', sd);
                setSearchParams(newParams);
              }}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="createdAt-desc">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="popularity-desc">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <ProductFilterSidebar
            categories={categories}
            brands={brands}
            selectedCategory={category}
            selectedBrand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minRating={minRating}
            inStockOnly={inStockOnly}
            minDiscount={minDiscount}
            onCategoryChange={(cat) => updateParam('category', cat)}
            onBrandChange={(b) => updateParam('brand', b)}
            onPriceChange={(min, max) => {
              const newParams = new URLSearchParams(searchParams);
              if (min) newParams.set('minPrice', min); else newParams.delete('minPrice');
              if (max) newParams.set('maxPrice', max); else newParams.delete('maxPrice');
              newParams.set('page', '0');
              setSearchParams(newParams);
            }}
            onRatingChange={(rating) => updateParam('minRating', rating)}
            onStockChange={(inStock) => updateParam('inStockOnly', inStock ? 'true' : '')}
            onDiscountChange={(disc) => updateParam('discount', disc)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex justify-end">
            <div className="bg-white w-full max-w-xs rounded-2xl p-5 overflow-y-auto max-h-full">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <ProductFilterSidebar
                categories={categories}
                brands={brands}
                selectedCategory={category}
                selectedBrand={brand}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                inStockOnly={inStockOnly}
                minDiscount={minDiscount}
                onCategoryChange={(cat) => { updateParam('category', cat); setMobileFilterOpen(false); }}
                onBrandChange={(b) => { updateParam('brand', b); setMobileFilterOpen(false); }}
                onPriceChange={(min, max) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (min) newParams.set('minPrice', min); else newParams.delete('minPrice');
                  if (max) newParams.set('maxPrice', max); else newParams.delete('maxPrice');
                  newParams.set('page', '0');
                  setSearchParams(newParams);
                }}
                onRatingChange={(rating) => updateParam('minRating', rating)}
                onStockChange={(inStock) => updateParam('inStockOnly', inStock ? 'true' : '')}
                onDiscountChange={(disc) => updateParam('discount', disc)}
                onResetFilters={() => { handleResetFilters(); setMobileFilterOpen(false); }}
              />
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              description="Try clearing some of your filters or searching with different keywords."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={openQuickView}
                />
              ))}
            </div>
          )}

          {/* Bottom Pagination & Display Limit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-200/80 mt-10">
            {/* Items Range Summary */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{products.length > 0 ? page * pageSize + 1 : 0}</span> to{' '}
              <span className="font-bold text-slate-800">{Math.min((page + 1) * pageSize, totalElements)}</span> of{' '}
              <span className="font-bold text-slate-800">{totalElements}</span> products
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => updateParam('page', Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx)
                  .filter((idx) => {
                    // Show first, last, current, and adjacent pages
                    return idx === 0 || idx === totalPages - 1 || Math.abs(idx - page) <= 1;
                  })
                  .map((idx, i, arr) => {
                    const showEllipsis = i > 0 && idx - arr[i - 1] > 1;
                    return (
                      <React.Fragment key={idx}>
                        {showEllipsis && (
                          <span className="px-1 text-slate-400 text-xs font-bold">...</span>
                        )}
                        <button
                          onClick={() => updateParam('page', idx)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                            page === idx
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  onClick={() => updateParam('page', Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom Items Per Page Selector */}
            <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => updateParam('limit', e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
