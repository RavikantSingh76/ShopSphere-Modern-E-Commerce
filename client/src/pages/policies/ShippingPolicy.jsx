import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Shipping & Delivery Policy' }]} />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 sm:p-12 space-y-6">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shipping & Delivery Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Fast & Reliable Pan-India Delivery • ShopSphere</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <p>
            <strong>ShopSphere</strong> partners with top tier logistics couriers and dedicated delivery riders to deliver your orders quickly and securely across India.
          </p>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" /> 1. Processing & Delivery Timelines
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Order Dispatch:</strong> All in-stock orders are packed and dispatched within 24 to 48 hours of order confirmation.</li>
            <li><strong>Standard Delivery:</strong> 3 to 5 business days for major metro cities.</li>
            <li><strong>Regional / Rest of India:</strong> 5 to 7 business days depending on the PIN code accessibility.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Shipping Charges
          </h3>
          <p>
            We offer <strong>Free Delivery</strong> on qualifying orders. Standard flat shipping rates apply to express orders and are clearly displayed at checkout before payment.
          </p>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> 3. Live Order Tracking
          </h3>
          <p>
            As soon as your order is dispatched, you will receive a tracking link. You can also track your live rider location and order status directly from our <a href="/track-order" className="text-emerald-600 font-bold underline">Order Tracking Page</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
export default ShippingPolicy;
