import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/api';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    code: '',
    discountPercent: 10,
    maxDiscountAmount: '',
    minOrderAmount: '',
    expiryDate: '',
    usageLimit: 1000,
    active: true,
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllCoupons();
      if (res.success && res.data) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setForm({
      code: '',
      discountPercent: 10,
      maxDiscountAmount: '',
      minOrderAmount: '',
      expiryDate: '',
      usageLimit: 1000,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setForm({
      code: c.code,
      discountPercent: c.discountPercent,
      maxDiscountAmount: c.maxDiscountAmount || '',
      minOrderAmount: c.minOrderAmount || '',
      expiryDate: c.expiryDate || '',
      usageLimit: c.usageLimit || 1000,
      active: c.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        discountPercent: Number(form.discountPercent),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        usageLimit: Number(form.usageLimit),
      };

      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.id, payload);
        success('Coupon updated successfully!');
      } else {
        await adminApi.createCoupon(payload);
        success('Coupon created successfully!');
      }
      setModalOpen(false);
      loadCoupons();
    } catch (err) {
      toastError(err.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon code?')) return;
    try {
      await adminApi.deleteCoupon(id);
      success('Coupon deleted');
      loadCoupons();
    } catch (err) {
      toastError(err.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Discount Coupons</h1>
          <p className="text-xs text-slate-400 mt-1">Create and manage marketing promo discount codes.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-lg text-emerald-400 tracking-wider">
                  {c.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {c.discountPercent}% OFF
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <p>Min Order: <strong className="text-slate-200">₹{Number(c.minOrderAmount || 0).toLocaleString('en-IN')}</strong></p>
                {c.maxDiscountAmount && (
                  <p>Max Cap: <strong className="text-slate-200">₹{Number(c.maxDiscountAmount).toLocaleString('en-IN')}</strong></p>
                )}
                <p>Usage: <strong className="text-slate-200">{c.timesUsed} / {c.usageLimit}</strong> times</p>
                <p className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Expires: {c.expiryDate || 'No Expiry'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300'}`}>
                {c.active ? 'Active' : 'Disabled'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCoupon ? 'Edit Promo Coupon' : 'Create Promo Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. FLASH30"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none uppercase font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount % *</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                placeholder="1000"
                value={form.maxDiscountAmount}
                onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                placeholder="499"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expiration Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
