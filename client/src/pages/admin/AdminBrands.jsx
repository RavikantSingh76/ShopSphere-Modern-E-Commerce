import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { adminApi, brandApi } from '../../services/api';
import { getBrandLogo } from '../../utils/brandLogos';

export const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    logoUrl: '',
    description: '',
    active: true,
  });

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllBrands();
      if (res.success && res.data) {
        setBrands(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setForm({ name: '', slug: '', logoUrl: '', description: '', active: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBrand(b);
    setForm({
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl || '',
      description: b.description || '',
      active: b.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingBrand) {
        await adminApi.updateBrand(editingBrand.id, form);
        success('Brand updated successfully!');
      } else {
        await adminApi.createBrand(form);
        success('Brand created successfully!');
      }
      setModalOpen(false);
      loadBrands();
    } catch (err) {
      toastError(err.message || 'Failed to save brand');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await adminApi.deleteBrand(id);
      success('Brand deleted');
      loadBrands();
    } catch (err) {
      toastError(err.message || 'Failed to delete brand');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Partner Brands</h1>
          <p className="text-xs text-slate-400 mt-1">Manage official brands and manufacturer tags.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {brands.map((brand) => {
          const logo = getBrandLogo(brand);
          return (
            <div
              key={brand.id}
              className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 border border-slate-700 shadow-sm overflow-hidden">
                    {logo ? (
                      <img src={logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="font-mono font-bold text-slate-800 text-xs">{brand.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{brand.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Slug: {brand.slug}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{brand.description || 'Verified manufacturer partner'}</p>
              </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Active
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

      {/* Brand Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Logitech"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Description</label>
            <textarea
              rows={2}
              placeholder="Brand biography"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
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
              {saving ? 'Saving...' : 'Save Brand'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
