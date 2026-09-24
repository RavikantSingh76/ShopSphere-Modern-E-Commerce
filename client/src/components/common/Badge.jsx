import React from 'react';

export const Badge = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const variants = {
    primary: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    secondary: 'bg-slate-800 text-slate-300 border-slate-700',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    picked: 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-semibold',
    packed: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-semibold',
    readyToShip: 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold',
    discount: 'bg-red-500 text-white font-bold',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  const statusMap = {
    PENDING: { label: 'Pending', variant: 'warning' },
    CONFIRMED: { label: 'Confirmed', variant: 'info' },
    PROCESSING: { label: 'Processing', variant: 'info' },
    PICKED: { label: '📦 Picked (Items Binned)', variant: 'picked' },
    PACKED: { label: '🎁 Packed (Box Sealed)', variant: 'packed' },
    READY_TO_SHIP: { label: '🏷️ Ready To Ship', variant: 'readyToShip' },
    SHIPPED: { label: '🚚 In Transit / Shipped', variant: 'primary' },
    OUT_FOR_DELIVERY: { label: '🛵 Out for Delivery', variant: 'primary' },
    DELIVERED: { label: '✅ Delivered', variant: 'success' },
    CANCELLED: { label: '❌ Cancelled', variant: 'danger' },
  };

  const item = statusMap[status] || { label: status, variant: 'secondary' };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};
