import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { StarRating } from '../components/common/StarRating';
import { useWishlist } from '../context/WishlistContext';
import { getProductImage } from '../utils/imageHelper';

export const Wishlist = () => {
  const { wishlist, toggleWishlist, moveToCart } = useWishlist();

  if (!wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Breadcrumb items={[{ label: 'My Wishlist' }]} />
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favorite items here so you can easily find and buy them later."
          actionText="Discover Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'My Wishlist' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You have <strong className="text-slate-800">{wishlist.items.length}</strong> items saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Media */}
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <Link to={`/products/${item.productSlug || item.productId}`}>
                <img
                  src={getProductImage({ name: item.productName, primaryImageUrl: item.productImage })}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <button
                onClick={() => toggleWishlist(item.productId)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <Link
                  to={`/products/${item.productSlug || item.productId}`}
                  className="text-xs font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2"
                >
                  {item.productName}
                </Link>
                <div className="mt-2">
                  <StarRating rating={item.averageRating || 0} size="xs" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-3">
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    ₹{Number(item.discountedPrice || item.price).toLocaleString('en-IN')}
                  </span>
                  {item.discountPercent > 0 && (
                    <span className="text-[11px] text-slate-400 line-through ml-1.5">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => moveToCart(item.productId)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
