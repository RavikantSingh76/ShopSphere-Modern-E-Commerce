import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  XCircle,
  Phone,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { OrderStatusBadge } from '../components/common/Badge';
import { orderApi } from '../services/api';

export const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOrderId = searchParams.get('orderId') || '';

  const [orderQuery, setOrderQuery] = useState(urlOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performLookup = async (queryToSearch) => {
    if (!queryToSearch.trim()) return;
    try {
      setLoading(true);
      setError('');
      const res = await orderApi.trackOrder(queryToSearch.trim());
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.message || 'No order found matching the provided order number');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlOrderId) {
      performLookup(urlOrderId);
    }
  }, [urlOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setSearchParams({ orderId: orderQuery.trim() });
    performLookup(orderQuery.trim());
  };

  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Order received & verified' },
    { key: 'PROCESSING', label: 'Processing', desc: 'Packed & ready at warehouse' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'In transit with courier partner' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Reaching your address today' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Handed over to customer' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return -1;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.orderStatus) : -1;
  const isCancelled = order?.orderStatus === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Order Tracking' }]} />

      {/* Header Search Box */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-4">
        <div className="max-w-xl mx-auto text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-xs text-slate-500">
            Enter your Order Number (e.g. <code>ORD-...</code>) to track real-time delivery status.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Order ID / Number"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="max-w-md mx-auto p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Reference</span>
              <h2 className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">{order.orderNumber}</h2>
            </div>
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.orderStatus} />
              <span className="text-xs text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Cancelled Banner if applicable */}
          {isCancelled ? (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
              <XCircle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="text-base font-bold text-rose-900">This order has been cancelled</h3>
              <p className="text-xs text-rose-700">Any payments made have been refunded to your original payment mode.</p>
            </div>
          ) : (
            /* Progress Stepper Timeline */
            <div className="py-4">
              <div className="relative">
                {/* Desktop Stepper */}
                <div className="hidden sm:grid grid-cols-5 gap-2 relative">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-[100px] leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="sm:hidden space-y-4">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    return (
                      <div key={step.key} className="flex items-start space-x-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-slate-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Assigned Delivery Rider Handshake Card */}
          {order.deliveryPartner && (
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-emerald-500/20">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                      Express Rider Assigned
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">{order.deliveryPartner.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{order.deliveryPartner.vehicleNumber} ({order.deliveryPartner.vehicleType})</span>
                      <span>•</span>
                      <span className="text-amber-600 flex items-center gap-0.5 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {order.deliveryPartner.rating}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {order.deliveryOtp && (
                    <div className="bg-white border border-emerald-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Delivery OTP</span>
                      <span className="text-sm font-black text-emerald-600 font-mono tracking-widest">{order.deliveryOtp}</span>
                    </div>
                  )}

                  <a
                    href={`tel:${order.deliveryPartner.phone}`}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Rider</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Courier Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 font-medium">Tracking Number</span>
              <p className="font-bold text-slate-800 font-mono mt-0.5">{order.trackingNumber || 'Pending Courier'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Courier Partner</span>
              <p className="font-bold text-slate-800 mt-0.5">{order.courierName || 'Standard Surface Express'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Expected Delivery</span>
              <p className="font-bold text-emerald-700 mt-0.5">
                {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : '3-4 Business Days'}
              </p>
            </div>
          </div>

          {/* Destination Address */}
          <div className="p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivering To</span>
            </h4>
            <p className="font-semibold text-slate-900">{order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</p>
            <p className="text-slate-600">
              {order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
