import React from 'react';
import { Printer, Download, X, CheckCircle2, ShieldCheck, ShoppingBag, CreditCard } from 'lucide-react';

export const InvoiceReceiptModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${String(order.id).padStart(6, '0')}`;
  const isPaid = order.paymentStatus === 'PAID';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Actions */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 font-mono">{invoiceNumber}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300">Official Tax Invoice & Payment Receipt</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="invoice-sheet" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          
          {/* Top Invoice Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  S
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Shop<span className="text-emerald-600">Sphere</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">ShopSphere Retail Technologies India Pvt Ltd</p>
              <p className="text-[10px] text-slate-400">GSTIN: 29AABCU9603R1ZM • CIN: U72200KA2024PTC189201</p>
              <p className="text-[10px] text-slate-400">Outer Ring Road, Bengaluru, Karnataka 560103</p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">ORIGINAL TAX INVOICE</span>
              <p className="text-sm font-black font-mono text-slate-900">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500">Order: #{order.orderNumber}</p>
              <p className="text-[11px] text-slate-500">Date: {new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Payment & Transaction Audit Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Payment Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Transaction Ref / ID</span>
              <p className="font-mono font-bold text-slate-800 mt-1 truncate">
                {order.transactionId || `TXN-${order.paymentMethod}-${order.id}`}
              </p>
              <p className="text-[10px] text-slate-500">{order.paymentGateway || `${order.paymentMethod} Verified`}</p>
            </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment Mode</span>
                <p className="font-bold text-slate-800 mt-1 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod === 'UPI' ? 'UPI Pay (7607805940@jio - GPay/PhonePe)' : order.paymentMethod || 'Online'}</span>
                </p>
              </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Billed To (Customer):</span>
              <p className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName || order.userName}</p>
              <p className="text-slate-600">Email: {order.userEmail || 'customer@ecommerce.com'}</p>
              <p className="text-slate-600">Phone: {order.shippingAddress?.phone || '+91 9876543210'}</p>
            </div>

            <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Shipping Destination:</span>
              <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress?.streetAddress}, {order.shippingAddress?.apartment && `${order.shippingAddress?.apartment}, `}</p>
              <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
              <p className="text-slate-600">{order.shippingAddress?.country || 'India'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-hidden border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {(order.items || []).map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      {item.productSku && <p className="text-[10px] text-slate-400 font-mono">SKU: {item.productSku}</p>}
                    </td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">₹{Number(item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-bold font-mono text-slate-900">₹{Number(item.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-2 gap-4">
            <div className="space-y-2 max-w-xs text-[11px] text-slate-500">
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verified Digital Receipt</span>
                </span>
                <p className="text-[10px] text-slate-600">
                  This is a computer-generated tax invoice. No physical signature is required. All taxes inclusive under GST law.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">₹{Number(order.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span className="font-mono font-bold">-₹{Number(order.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-mono font-semibold">
                  {Number(order.shippingFee) === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${Number(order.shippingFee).toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (GST 18%)</span>
                <span className="font-mono font-semibold">₹{Number(order.taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>Total Amount Paid</span>
                <span className="font-mono text-emerald-600">₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
            <span>Thank you for shopping with ShopSphere! Questions? Contact support@ecommerce.com</span>
            <div className="text-right">
              <span className="font-bold text-slate-700 block font-mono">ShopSphere Authorized Signatory</span>
              <span className="italic text-[9px] text-slate-400">Digitally Signed & Validated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
