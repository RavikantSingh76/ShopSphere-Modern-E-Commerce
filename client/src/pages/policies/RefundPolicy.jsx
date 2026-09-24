import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { RotateCcw, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Cancellation & Refund Policy' }]} />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 sm:p-12 space-y-6">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Cancellation & Refund Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Hassle-Free Returns & Instant Refunds • ShopSphere</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <p>
            At <strong>ShopSphere</strong>, customer satisfaction is our top priority. We provide a transparent <strong>7-Day Replacement/Return Guarantee</strong> on eligible products.
          </p>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" /> 1. Cancellation Policy
          </h3>
          <p>
            You can cancel your order anytime before it has been dispatched by our logistics rider. Once dispatched, you may refuse delivery or request a return upon receipt.
          </p>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" /> 2. Return & Replacement Eligibility
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Item is delivered in a damaged, defective, or incorrect condition.</li>
            <li>Item must be unused, in its original packaging with all tags, accessories, and user manuals intact.</li>
            <li>Return request must be raised within 7 calendar days of delivery.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Refund Process & Timelines (Razorpay)
          </h3>
          <p>
            Once your returned item is received and inspected at our warehouse:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Razorpay (Card/NetBanking/Wallets):</strong> Refunds are initiated automatically back to the original source account within <strong>5-7 working days</strong>.</li>
            <li><strong>UPI Payments:</strong> Refunds are credited directly to your linked UPI VPA ID within <strong>24-48 hours</strong>.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900">4. How to Request a Refund</h3>
          <p>
            To initiate a return or cancellation:
            <br />
            Email us at <strong>support@shopsphere-ecommerce.com</strong> or call/WhatsApp <strong>+91 9696675081</strong> with your Order ID.
          </p>
        </div>
      </div>
    </div>
  );
};
export default RefundPolicy;
