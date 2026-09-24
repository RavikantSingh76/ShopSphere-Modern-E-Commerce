import React from 'react';
import { Printer, X, QrCode, Truck, Package, ShieldCheck, AlertCircle, Phone, MapPin } from 'lucide-react';

export const ShippingLabelModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCod = order.paymentMethod === 'COD' && order.paymentStatus !== 'PAID';
  const labelId = `LBL-${order.id}-${order.orderNumber?.slice(-6) || '918231'}`;
  const pinCode = order.shippingAddress?.postalCode || '560103';
  const routingHub = `${(order.shippingAddress?.city || 'BLR').slice(0, 3).toUpperCase()}-${pinCode.slice(0, 3)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Parcel Shipping Label / Package Sticker</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sticker (4x6 / A6)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable 4x6 / A6 Parcel Sticker Sheet */}
        <div id="shipping-sticker" className="p-6 sm:p-8 overflow-y-auto text-slate-900 bg-white">
          <div className="border-2 border-dashed border-slate-900 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
            
            {/* Header / Brand & Hub Code */}
            <div className="flex justify-between items-center pb-3 border-b-2 border-slate-900">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  S
                </div>
                <div>
                  <span className="text-base font-black tracking-tight">ShopSphere <span className="text-emerald-600">EXPRESS</span></span>
                  <p className="text-[9px] text-slate-500 font-semibold tracking-wider">STANDARD SURFACE / AIR LOGISTICS</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Routing Hub</span>
                <span className="text-sm font-black font-mono bg-slate-900 text-white px-2 py-0.5 rounded">
                  {routingHub}
                </span>
              </div>
            </div>

            {/* Visual Barcode & Tracking Number */}
            <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
              {/* Simulated High-Res Barcode */}
              <div className="flex justify-center items-center h-10 space-x-[2.5px] overflow-hidden px-4">
                {[4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 2, 6, 2, 4, 8, 3, 2, 5, 4, 2, 7, 2, 3, 6, 4, 2, 8, 3, 5, 2, 4, 6, 2, 7, 3, 2, 8, 4, 2, 5, 3, 6, 2, 4].map((h, idx) => (
                  <div key={idx} className="bg-slate-900 w-[2px] rounded-full" style={{ height: `${h * 4 + 10}px` }} />
                ))}
              </div>
              <p className="text-xs font-mono font-bold tracking-widest text-slate-800 mt-1">
                {order.trackingNumber || `SPH-${order.orderNumber}`}
              </p>
            </div>

            {/* Payment Collection Type: BOLD PREPAID or COD BANNER */}
            <div className={`p-3 rounded-xl border-2 text-center flex items-center justify-between ${
              isCod 
                ? 'bg-rose-50 border-rose-600 text-rose-900' 
                : 'bg-emerald-50 border-emerald-600 text-emerald-900'
            }`}>
              <div className="text-left">
                <span className="text-[9px] uppercase font-black tracking-wider block">Payment Type</span>
                <span className="text-sm font-black tracking-tight">
                  {isCod ? '⚠️ CASH ON DELIVERY (COD)' : '✅ PREPAID (NO CASH DUE)'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase font-bold block">{isCod ? 'Collect From Customer' : 'Total Paid'}</span>
                <span className="text-base font-black font-mono">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* SHIP TO (Customer Destination Details) */}
            <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>SHIP TO (CUSTOMER ADDRESS):</span>
                </span>
                <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  PIN: {pinCode}
                </span>
              </div>

              <p className="text-sm font-black text-slate-900">{order.shippingAddress?.fullName || order.userName}</p>
              <p className="text-slate-800 font-medium leading-relaxed">
                {order.shippingAddress?.streetAddress}, {order.shippingAddress?.apartment && `${order.shippingAddress?.apartment}, `}
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong className="text-slate-900 font-mono">{pinCode}</strong>
              </p>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1 pt-1">
                <Phone className="w-3 h-3 text-slate-600" />
                <span>Contact: {order.shippingAddress?.phone || '+91 9876543210'}</span>
              </p>
            </div>

            {/* Handshake OTP & Rider Dispatch Stamp */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950">
                <span className="text-[9px] font-black uppercase tracking-wider block">Customer Delivery OTP</span>
                <span className="text-sm font-black font-mono tracking-widest text-amber-900">
                  {order.deliveryOtp || '4821'}
                </span>
                <p className="text-[8px] text-amber-700 mt-0.5">Ask OTP before parcel handoff</p>
              </div>

              <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-800">
                <span className="text-[9px] font-bold uppercase text-slate-500 block">Assigned Delivery Rider</span>
                <span className="text-[11px] font-bold text-slate-900 truncate block">
                  {order.deliveryPartner ? order.deliveryPartner.name : 'ShopSphere Courier'}
                </span>
                <p className="text-[8px] text-slate-500 truncate">{order.deliveryPartner?.vehicleNumber || 'Exp-Surface'}</p>
              </div>
            </div>

            {/* Package Items Checklist (For Packing Verification) */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Package Contents ({order.items?.length || 1} Items):</span>
              <div className="space-y-1 text-[10px] text-slate-700 max-h-20 overflow-y-auto">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                    <span className="truncate max-w-[240px] font-sans font-semibold text-slate-900">{item.quantity}x {item.productName}</span>
                    <span className="text-slate-500 font-bold">{item.productSku || 'SKU-STD'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Return To (Ship From Warehouse) & Stamp */}
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-end text-[9px] text-slate-500">
              <div>
                <span className="font-bold text-slate-700 block uppercase">Return Address (Ship From):</span>
                <p>ShopSphere Central Fulfillment Hub #4</p>
                <p>Outer Ring Road, Bengaluru, Karnataka - 560103</p>
                <p>Support: 1800-SHOP-SPHERE</p>
              </div>

              <div className="text-right">
                <span className="font-mono text-[9px] font-bold text-slate-700 block">STICKER: {labelId}</span>
                <span className="text-[8px] text-slate-400 italic">Inspect package seal before opening</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
