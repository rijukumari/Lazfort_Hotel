import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image, DollarSign, Clock, Tag } from 'lucide-react';
import { Button } from '../ui/Button';

export const AddEditMenuModal = ({
  isOpen,
  onClose,
  type = 'item', // 'item' or 'category'
  initialData = null,
  categories = [],
  onSave,
}) => {
  const isCategory = type === 'category';

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catStatus, setCatStatus] = useState('Active');

  // Item form state
  const [itemName, setItemName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [itemPrice, setItemPrice] = useState(150);
  const [itemDescription, setItemDescription] = useState('');
  const [prepTime, setPrepTime] = useState('15 mins');
  const [foodType, setFoodType] = useState('Non-Vegetarian');
  const [isAvailable, setIsAvailable] = useState(true);
  const [ingredients, setIngredients] = useState('');
  const [itemImage, setItemImage] = useState('');

  useEffect(() => {
    if (initialData) {
      if (isCategory) {
        setCatName(initialData.name || '');
        setCatDescription(initialData.description || '');
        setCatImage(initialData.image || '');
        setCatStatus(initialData.status || 'Active');
      } else {
        setItemName(initialData.name || '');
        setCategoryId(initialData.categoryId || (categories[0]?.id || ''));
        setItemPrice(initialData.price || 150);
        setItemDescription(initialData.description || '');
        setPrepTime(initialData.preparationTime || '15 mins');
        setFoodType(initialData.foodType || 'Non-Vegetarian');
        setIsAvailable(initialData.isAvailable !== false);
        setIngredients(initialData.ingredients || '');
        setItemImage(initialData.image || '');
      }
    } else {
      if (isCategory) {
        setCatName('');
        setCatDescription('');
        setCatImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
        setCatStatus('Active');
      } else {
        setItemName('');
        setCategoryId(categories[0]?.id || '');
        setItemPrice(150);
        setItemDescription('');
        setPrepTime('15 mins');
        setFoodType('Non-Vegetarian');
        setIsAvailable(true);
        setIngredients('');
        setItemImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
      }
    }
  }, [initialData, isCategory, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = e => {
    e.preventDefault();
    if (isCategory) {
      onSave({
        name: catName,
        description: catDescription,
        image: catImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        status: catStatus,
      });
    } else {
      const selectedCat = categories.find(c => c.id === categoryId);
      onSave({
        name: itemName,
        categoryId: categoryId || categories[0]?.id || 'cat-01',
        categoryName: selectedCat ? selectedCat.name : (categories[0]?.name || 'Starters'),
        price: Number(itemPrice),
        description: itemDescription,
        preparationTime: prepTime,
        foodType,
        isAvailable,
        ingredients,
        image: itemImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury w-full max-w-xl p-6 sm:p-7 rounded-3xl border border-accent/40 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                {initialData
                  ? `Edit ${isCategory ? 'Category' : 'Menu Item'}: ${initialData.name}`
                  : `Add New ${isCategory ? 'Menu Category' : 'Menu Item'}`}
              </h3>
              <p className="text-xs text-charcoal-muted">
                {isCategory ? 'Configure dining domain and luxury catalog grouping.' : 'Add recipe details, pricing, and dietary classifications.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-primary dark:hover:text-white hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isCategory ? (
            // CATEGORY FIELDS
            <>
              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                  Category Nomenclature *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Cuisine, Continental, Starters"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                  Gastronomic Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the cuisine characteristics, ingredients heritage, or course pairing..."
                  value={catDescription}
                  onChange={e => setCatDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Category Status
                  </label>
                  <select
                    value={catStatus}
                    onChange={e => setCatStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Showcase Photographic URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={catImage}
                    onChange={e => setCatImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            // MENU ITEM FIELDS
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imperial Beluga Caviar & Blinis"
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Assigned Menu Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none font-semibold text-accent"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={itemPrice}
                    onChange={e => setItemPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs font-mono font-bold text-accent focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 mins"
                    value={prepTime}
                    onChange={e => setPrepTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Food Type
                  </label>
                  <select
                    value={foodType}
                    onChange={e => setFoodType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                  >
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                  Culinary Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail cooking method, accompaniments, garnishes, and wine pairing..."
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                  Ingredients & Sommelier Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Japanese A5 Wagyu, Périgord Black Truffle, Pomme Purée"
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                    Photographic Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={itemImage}
                    onChange={e => setItemImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={e => setIsAvailable(e.target.checked)}
                      className="rounded border-accent text-accent focus:ring-accent h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-primary dark:text-white">
                      Active In Kitchen & In-Suite Ordering
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gold" type="submit" icon={Sparkles}>
              {initialData ? 'Save Changes' : `Create ${isCategory ? 'Category' : 'Item'}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditMenuModal;

