import React, { useState, useEffect } from 'react';
import { X, UtensilsCrossed, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

const DIETARY_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];

export const MenuItemModal = ({
  isOpen,
  onClose,
  itemToEdit = null,
  onSuccess,
}) => {
  const { menuCategories = [], addMenuItem, updateMenuItem } = useERP();
  const { showToast } = useToast();
  const isEditing = Boolean(itemToEdit);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    description: '',
    price: '',
    preparationTime: '15 mins',
    foodType: 'Non-Vegetarian',
    isAvailable: true,
    ingredients: '',
    image: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        categoryId: itemToEdit.categoryId || (menuCategories[0]?.id || 'cat-01'),
        categoryName: itemToEdit.categoryName || (menuCategories[0]?.name || 'Starters'),
        description: itemToEdit.description || '',
        price: (itemToEdit.price || '').toString(),
        preparationTime: itemToEdit.preparationTime || '15 mins',
        foodType: itemToEdit.foodType || 'Non-Vegetarian',
        isAvailable: itemToEdit.isAvailable !== undefined ? itemToEdit.isAvailable : true,
        ingredients: itemToEdit.ingredients || '',
        image: itemToEdit.image || '',
      });
    } else {
      const defaultCat = menuCategories[0] || { id: 'cat-01', name: 'Starters' };
      setFormData({
        name: '',
        categoryId: defaultCat.id,
        categoryName: defaultCat.name,
        description: '',
        price: '',
        preparationTime: '15 mins',
        foodType: 'Non-Vegetarian',
        isAvailable: true,
        ingredients: '',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      });
    }
    setErrors({});
  }, [itemToEdit, isOpen, menuCategories]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Item title is required.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errs.price = 'Valid price is required.';
    }
    if (!formData.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCategoryChange = (catId) => {
    const selected = menuCategories.find(c => c.id === catId);
    setFormData({
      ...formData,
      categoryId: catId,
      categoryName: selected ? selected.name : 'Fine Dining',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    if (isEditing) {
      const res = updateMenuItem(itemToEdit.id, payload);
      if (res?.success) {
        showToast('Menu Item Updated', `Dish "${formData.name}" has been updated.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } else {
      const res = addMenuItem(payload);
      if (res?.success) {
        showToast('Menu Item Added', `Dish "${formData.name}" added to menu catalog.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#101725] rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
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
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              {isEditing ? 'Modify Gastronomic Item' : 'Add New Menu Creation'}
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Michelin Haute Cuisine Culinary Specifications
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dish Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Dish Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Imperial Beluga Caviar & Blinis, A5 Miyazaki Wagyu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Category & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Menu Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent cursor-pointer"
              >
                {menuCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Tariff / Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 180"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>
              {errors.price && <p className="text-[11px] text-rose-500 font-medium">{errors.price}</p>}
            </div>
          </div>

          {/* Prep Time & Dietary Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Preparation Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.preparationTime}
                  onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                  placeholder="e.g. 15 mins"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Dietary Specification
              </label>
              <select
                value={formData.foodType}
                onChange={e => setFormData({ ...formData, foodType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent cursor-pointer"
              >
                {DIETARY_TYPES.map(dt => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Gastronomic Composition & Notes *
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Culinary background, preparation nuances, tasting notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Ingredients */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Key Ingredients & Allergens
            </label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="e.g. Beluga Caviar, Buckwheat Flour, Quail Egg (Contains Dairy)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </div>

          {/* Visual Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Presentation Imagery URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </div>

          {/* Availability Status Toggle */}
          <div className="p-3.5 rounded-2xl bg-ivory/40 dark:bg-white/[0.02] border border-border/70 dark:border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-primary dark:text-white">
                Live Kitchen Availability
              </p>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Allow guests & concierges to order this creation
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
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
              <span>{isEditing ? 'Save Culinary Specs' : 'Add Menu Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;

