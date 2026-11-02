import React, { useState, useEffect } from 'react';
import { X, Utensils, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const MenuCategoryModal = ({
  isOpen,
  onClose,
  categoryToEdit = null,
  onSuccess,
}) => {
  const { addMenuCategory, updateMenuCategory } = useERP();
  const { showToast } = useToast();
  const isEditing = Boolean(categoryToEdit);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || '',
        description: categoryToEdit.description || '',
        image: categoryToEdit.image || '',
        status: categoryToEdit.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
      });
    }
    setErrors({});
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Category name is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      const res = updateMenuCategory(categoryToEdit.id, formData);
      if (res?.success) {
        showToast('Category Updated', `Menu category "${formData.name}" has been updated.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } else {
      const res = addMenuCategory(formData);
      if (res?.success) {
        showToast('Category Created', `Menu category "${formData.name}" has been added.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#101725] rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
          title="Close Modal"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              {isEditing ? 'Modify Culinary Category' : 'Create Menu Category'}
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Michelin Haute Cuisine Taxonomy
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Starters, Prime Steaks, Cellar Wines"
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Curated Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed culinary notes and tasting profile..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300 flex items-center justify-between">
              <span>Category Visual / Banner URL</span>
              <span className="text-[10px] text-accent normal-case font-mono">Unsplash / Cloudinary</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>
            {formData.image && (
              <div className="h-20 w-full rounded-xl overflow-hidden border border-border/80 dark:border-white/10 mt-1">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Operational Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Active', 'Inactive'].map(st => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setFormData({ ...formData, status: st })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    formData.status === st
                      ? 'bg-accent/20 border-accent text-accent shadow-sm'
                      : 'bg-ivory/50 dark:bg-[#121926] border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Category Updates' : 'Add Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuCategoryModal;

