import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { FileCheck, AlertCircle, Scale, Shield } from 'lucide-react';

export const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Terms & Conditions' }]} />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 sm:p-12 space-y-6">
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Terms and Conditions</h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: March 2026 • ShopSphere Retail</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>ShopSphere</strong>. By accessing our platform, browsing products, or completing an order via Razorpay / UPI, you agree to be bound by the following Terms & Conditions.
          </p>

          <h3 className="text-base font-bold text-slate-900">1. Account & Eligibility</h3>
          <p>
            You must be at least 18 years of age or using the site under the supervision of a parent/guardian. You agree to provide accurate and complete information during checkout.
          </p>

          <h3 className="text-base font-bold text-slate-900">2. Pricing & Payments</h3>
          <p>
            All prices listed on ShopSphere are in Indian Rupees (INR) and inclusive of applicable GST unless specified otherwise. We accept payments via <strong>Razorpay Payment Gateway</strong> (Debit/Credit Cards, NetBanking, Wallets) and instant NPCI UPI.
          </p>

          <h3 className="text-base font-bold text-slate-900">3. Orders & Order Acceptance</h3>
          <p>
            Upon placing an order, you will receive an instant order confirmation with a unique Order ID. We reserve the right to cancel or limit quantities on any order in cases of pricing inaccuracies or stock unavailability.
          </p>

          <h3 className="text-base font-bold text-slate-900">4. Limitation of Liability & Governing Law</h3>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of your purchase will be subject to the jurisdiction of courts in India.
          </p>

          <h3 className="text-base font-bold text-slate-900">5. Intellectual Property & Third-Party Trademarks</h3>
          <p>
            All third-party brand names, logos, trademarks, and service marks (including but not limited to Apple, Samsung, Sony, Nike, Adidas, Puma, Dell, boAt, and others) displayed on ShopSphere are the intellectual property of their respective trademark holders.
          </p>
          <p>
            Their presence on this website is solely for the purpose of identifying and describing genuine, authentic goods under the legal principles of <strong>Nominative Fair Use</strong> and the <strong>First Sale Doctrine</strong> (Trade Marks Act, 1999). ShopSphere operates as an independent retail platform and does not claim any exclusive ownership, sponsorship, or official affiliation with these trademark owners unless expressly stated.
          </p>

          <h3 className="text-base font-bold text-slate-900">6. Contact Information</h3>
          <p>
            ShopSphere Retail
            <br />
            Email: support@shopsphere-ecommerce.com | Phone: +91 9696675081
          </p>
        </div>
      </div>
    </div>
  );
};
export default TermsAndConditions;
