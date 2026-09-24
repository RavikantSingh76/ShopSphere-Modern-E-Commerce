import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { adminApi, categoryApi } from '../../services/api';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    iconName: '',
    active: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', slug: '', description: '', imageUrl: '', iconName: '', active: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      iconName: cat.iconName || '',
      active: cat.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, form);
        success('Category updated successfully!');
      } else {
        await adminApi.createCategory(form);
        success('Category created successfully!');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      toastError(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      success('Category deleted');
      loadCategories();
    } catch (err) {
      toastError(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Categories</h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog classifications and navigation taxonomy.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{cat.name}</h3>
                <p className="text-[10px] text-slate-500 font-mono">Slug: {cat.slug}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300'}`}>
                {cat.active ? 'Active' : 'Hidden'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gaming & VR"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image Banner URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Short category bio"
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
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
