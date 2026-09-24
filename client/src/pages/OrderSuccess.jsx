import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { OrderStatusBadge } from '../components/common/Badge';
import { getProductImage } from '../utils/imageHelper';

export const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // Trigger celebratory confetti on screen
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl text-center space-y-4">
        <Package className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">No Recent Order Found</h2>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Celebration Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-white/10">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-emerald-100 mt-2 max-w-md mx-auto">
          Your order has been placed successfully. A confirmation summary has been registered to your account.
        </p>

        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono font-bold mt-6">
          <span>Order Number:</span>
          <span className="text-amber-300">{order.orderNumber}</span>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-medium">Order Status</span>
            <div className="mt-1 flex items-center gap-2">
              <OrderStatusBadge status={order.orderStatus} />
              <span className="text-xs text-slate-500 font-medium">
                Tracking: <strong className="text-slate-800">{order.trackingNumber}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <Link
              to={`/track-order?orderId=${order.orderNumber}`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Delivery</span>
            </Link>
          </div>
        </div>

        {/* 2-Col Grid: Shipping Info & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shipping Destination</span>
            </h4>
            <p className="text-xs font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-slate-600 mt-0.5">
              {order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-xs text-slate-500 mt-1">Contact: {order.shippingAddress?.phone}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment Details</span>
            </h4>
            <p className="text-xs font-bold text-slate-900">
              Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Status: <span className="font-semibold text-emerald-600">{order.paymentStatus}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estimated Delivery: <strong>{order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'Within 3-4 days'}</strong>
            </p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Ordered Items ({order.items?.length || 0})
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {order.items?.map((it) => (
              <div key={it.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={getProductImage({ name: it.productName, primaryImageUrl: it.productImage })}
                    alt={it.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{it.productName}</p>
                    <p className="text-[11px] text-slate-400">Qty: {it.quantity} × ₹{Number(it.unitPrice).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-slate-900">
                  ₹{Number(it.totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs max-w-xs ml-auto">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-rose-600 font-bold">
              <span>Discount</span>
              <span>-₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-bold text-slate-900">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Paid</span>
            <span className="text-emerald-700">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Return Home Button */}
      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
