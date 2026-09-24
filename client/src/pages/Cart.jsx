import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  TicketPercent,
  ShoppingCart,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../utils/imageHelper';

export const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setApplyingCoupon(false);
  };

  const subtotal = Number(cart.subtotal) || 0;
  const isFreeShipping = cart.shipping === 0;
  const freeShippingThreshold = 500;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = isFreeShipping ? 100 : Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
        <EmptyState
          icon={ShoppingCart}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any products to your cart yet. Explore our top deals and start shopping now!"
          actionText="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Shopping Cart ({cart.totalItemCount} {cart.totalItemCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {isFreeShipping
                  ? (subtotal < 100
                      ? '🎉 Special Offer: FREE Shipping applied on orders under ₹100!'
                      : 'Congratulations! You unlocked FREE Standard Delivery!')
                  : `Add ₹${amountNeededForFreeShipping.toLocaleString('en-IN')} more for FREE Standard Delivery!`}
              </span>
              <span>{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card divide-y divide-slate-100 overflow-hidden">
            {cart.items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={getProductImage({ name: item.productName, primaryImageUrl: item.productImage })}
                    alt={item.productName}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <Link
                      to={`/products/${item.productSlug || item.productId}`}
                      className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-slate-900">
                        ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                      </span>
                      {item.discountPercent > 0 && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{Number(item.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal for Item */}
                  <span className="text-sm font-extrabold text-slate-900 min-w-[80px] text-right">
                    ₹{Number(item.itemTotal).toLocaleString('en-IN')}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cart.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {cart.shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${cart.shipping}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl text-emerald-700">₹{cart.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Coupon Code Box */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700">Have a Promo Coupon?</span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-900">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-emerald-700">{appliedCoupon.discountPercent}% discount applied</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 rounded-full text-slate-400 hover:text-rose-600"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono font-bold"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCodeInput.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex-shrink-0"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Badges */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Easy 7 Days Return & Instant Refund</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
