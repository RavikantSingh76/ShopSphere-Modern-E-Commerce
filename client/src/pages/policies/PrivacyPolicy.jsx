import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Privacy Policy' }]} />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 sm:p-12 space-y-6">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: March 2026 • ShopSphere Retail</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>ShopSphere</strong>. We respect your privacy and are committed to protecting your personal data in accordance with the Information Technology Act, 2000 and RBI guidelines for digital transactions.
          </p>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" /> 1. Information We Collect
          </h3>
          <p>
            When you visit our store or place an order, we collect personal information you provide to us, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contact Information:</strong> Name, shipping address, billing address, phone number (+91), and email address.</li>
            <li><strong>Payment & Transaction Details:</strong> Order totals, transaction reference IDs, and payment method details processed securely via Razorpay and UPI. (We do not store your full credit/debit card numbers or CVVs on our servers).</li>
            <li><strong>Device & Usage Data:</strong> IP address, browser type, device information, and interaction history.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> 2. How We Use Your Information
          </h3>
          <p>
            We use the collected information for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fulfilling and processing your orders, logistics shipping, and rider dispatch.</li>
            <li>Sending order confirmations, tracking alerts, invoices, and customer support communications.</li>
            <li>Detecting fraud and ensuring safe transactions via Razorpay payment gateway.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> 3. Payment Security & Data Sharing
          </h3>
          <p>
            All online transactions are securely encrypted using 256-Bit SSL through <strong>Razorpay Payment Gateway</strong>, which is certified PCI-DSS Level 1 compliant. We never sell or rent your personal information to third parties.
          </p>

          <h3 className="text-base font-bold text-slate-900">4. Contacting Us</h3>
          <p>
            If you have questions regarding our Privacy Policy or data handling:
            <br />
            <strong>Merchant:</strong> ShopSphere Retail
            <br />
            <strong>Email:</strong> support@shopsphere-ecommerce.com
            <br />
            <strong>Phone / WhatsApp:</strong> +91 9696675081
          </p>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
