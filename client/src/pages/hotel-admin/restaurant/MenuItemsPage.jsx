import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  Leaf,
  ArrowLeft,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  RestaurantStatCard,
  RestaurantNavTabs,
  RestaurantSearch,
  RestaurantFilters,
  RestaurantDataTable,
  DeleteConfirmationDialog,
} from '../../../components/restaurant';

const DIETARY_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];

export const MenuItemsPage = () => {
  const {
    menuItems = [],
    menuCategories = [],
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Dedicated Page State: 'list' | 'create' | 'edit' | 'detail'
  const [pageView, setPageView] = useState('list');
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);

  // Form State
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
  const [formErrors, setFormErrors] = useState({});

  const startCreate = () => {
    setItemToEdit(null);
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
    setFormErrors({});
    setPageView('create');
  };

  const startEdit = (item) => {
    setItemToEdit(item);
    setFormData({
      name: item.name || '',
      categoryId: item.categoryId || (menuCategories[0]?.id || 'cat-01'),
      categoryName: item.categoryName || (menuCategories[0]?.name || 'Starters'),
      description: item.description || '',
      price: (item.price || '').toString(),
      preparationTime: item.preparationTime || '15 mins',
      foodType: item.foodType || 'Non-Vegetarian',
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      ingredients: item.ingredients || '',
      image: item.image || '',
    });
    setFormErrors({});
    setPageView('edit');
  };

  const startView = (item) => {
    setViewingItem(item);
    setPageView('detail');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Item title is required.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errs.price = 'Valid price is required.';
    }
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price)
    };

    if (itemToEdit) {
      updateMenuItem(itemToEdit.id, payload);
      showToast('Dish Updated', `Menu item "${formData.name}" updated successfully.`, 'success');
    } else {
      addMenuItem(payload);
      showToast('Dish Created', `"${formData.name}" added to culinary catalog.`, 'success');
    }
    setPageView('list');
  };

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.ingredients?.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesDiet = selectedDietary === 'all' || item.foodType === selectedDietary;
      const matchesAvail =
        selectedAvailability === 'all' ||
        (selectedAvailability === 'available' && item.isAvailable) ||
        (selectedAvailability === 'unavailable' && !item.isAvailable);

      return matchesSearch && matchesCat && matchesDiet && matchesAvail;
    });
  }, [menuItems, searchQuery, selectedCategory, selectedDietary, selectedAvailability]);

  const handleToggleAvail = (item) => {
    toggleMenuItemAvailability(item.id);
    showToast(
      'Availability Updated',
      `"${item.name}" marked as ${!item.isAvailable ? 'Available' : 'Sold Out'}.`,
      'info'
    );
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteMenuItem(itemToDelete.id);
    showToast('Menu Item Deleted', `"${itemToDelete.name}" removed from catalog.`, 'success');
    setItemToDelete(null);
  };

  const totalDishes = menuItems.length;
  const availableCount = menuItems.filter(i => i.isAvailable).length;
  const averagePrice = totalDishes > 0 ? Math.round(menuItems.reduce((acc, i) => acc + (i.price || 0), 0) / totalDishes) : 0;

  const columns = [
    {
      key: 'name',
      header: 'Dish Selection',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'}
            alt={item.name}
            className="w-11 h-11 rounded-xl object-cover border border-border/80 dark:border-white/10 shrink-0"
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <div>
            <p className="font-semibold text-primary dark:text-white text-xs">{item.name}</p>
            <p className="text-[11px] text-charcoal-muted line-clamp-1 max-w-xs">{item.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'categoryName',
      header: 'Category',
      sortable: true,
      render: item => (
        <span className="text-xs font-medium text-primary dark:text-gray-300">
          {item.categoryName || 'Chef Specialties'}
        </span>
      ),
    },
    {
      key: 'foodType',
      header: 'Dietary',
      sortable: true,
      render: item => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            item.foodType === 'Vegetarian' || item.foodType === 'Vegan'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
          }`}
        >
          {item.foodType === 'Vegetarian' && <Leaf className="w-2.5 h-2.5" />}
          <span>{item.foodType || 'Standard'}</span>
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Tariff',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent text-sm">
          ${item.price}
        </span>
      ),
    },
    {
      key: 'preparationTime',
      header: 'Prep Time',
      render: item => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-accent" />
          <span>{item.preparationTime || '15 mins'}</span>
        </span>
      ),
    },
    {
      key: 'isAvailable',
      header: 'Kitchen Live',
      render: item => (
        <button
          onClick={() => handleToggleAvail(item)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
            item.isAvailable
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}
        >
          {item.isAvailable ? 'Available' : 'Sold Out'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: item => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => startView(item)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Dish Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => startEdit(item)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Dish"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setItemToDelete(item);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-charcoal-muted hover:text-rose-600 transition-colors"
            title="Delete Dish"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Dedicated Detail Page View
  if (pageView === 'detail' && viewingItem) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-[#101725] text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Dishes Catalog</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => startEdit(viewingItem)}
              className="px-4 py-2 rounded-xl bg-accent text-white dark:text-primary-950 text-xs font-bold shadow-gold flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Dish</span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white/90 dark:bg-[#101725]/90 backdrop-blur-xl border border-accent/30 shadow-xl overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-primary-950">
            <img
              src={viewingItem.image}
              alt={viewingItem.name}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                viewingItem.isAvailable ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}>
                {viewingItem.isAvailable ? 'Available Live' : 'Sold Out'}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                {viewingItem.categoryName || 'Chef Specialties'}
              </span>
              <h2 className="font-serif font-bold text-3xl drop-shadow">
                {viewingItem.name}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 dark:border-white/10 pb-5">
              <div className="flex items-center gap-4">
                <span className="font-serif font-bold text-3xl text-accent">
                  ${viewingItem.price}
                </span>
                <span className="text-xs text-charcoal-muted dark:text-gray-400">per serving / portion</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory dark:bg-white/5 border border-border/60 text-xs font-mono text-primary dark:text-white">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>{viewingItem.preparationTime || '15 mins'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>{viewingItem.foodType || 'Standard'}</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                Culinary Description
              </h4>
              <p className="text-sm text-primary dark:text-gray-200 leading-relaxed">
                {viewingItem.description}
              </p>
            </div>

            {viewingItem.ingredients && (
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                  Ingredients & Flavor Profile
                </h4>
                <p className="text-xs text-primary dark:text-gray-300">
                  {viewingItem.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dedicated Form Page View for Create & Edit
  if (pageView === 'create' || pageView === 'edit') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-[#101725] text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Catalog</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#101725]/90 backdrop-blur-xl border border-accent/30 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                {pageView === 'edit' ? `Modify Dish: ${itemToEdit?.name}` : 'Create Menu Item'}
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Michelin Star Dining & In-Suite Gastronomy Offering
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Dish Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wagyu Ribeye A5 Medallion"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Culinary Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={e => {
                    const cat = menuCategories.find(c => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      categoryId: e.target.value,
                      categoryName: cat?.name || ''
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {menuCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Price ($ USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 145"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
                {formErrors.price && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Prep Time
                </label>
                <input
                  type="text"
                  value={formData.preparationTime}
                  onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                  placeholder="e.g. 25 mins"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Dietary Classification
                </label>
                <select
                  value={formData.foodType}
                  onChange={e => setFormData({ ...formData, foodType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {DIETARY_TYPES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Photo URL
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
              {formData.image && (
                <div className="mt-2.5 relative h-28 w-44 rounded-xl overflow-hidden border border-border/80">
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

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Gastronomic Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed tasting description for luxury guest presentation..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
              {formErrors.description && (
                <p className="mt-1 text-[11px] text-rose-500">{formErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Ingredients & Allergens
              </label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="e.g. Truffle reduction, sea salt fleur de sel, dairy, organic butter"
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary dark:text-white">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Available for Immediate Dining Service</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{pageView === 'edit' ? 'Update Dish' : 'Save Dish to Menu'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Menu Items Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Gastronomic Inventory
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            A la Carte creations, Grand Cru cellar reserves, and in-suite dining master list.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>



      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RestaurantStatCard
          title="Catalog Offerings"
          value={totalDishes}
          subtitle="Curated gastronomic items"
          icon={UtensilsCrossed}
        />
        <RestaurantStatCard
          title="Kitchen Live"
          value={availableCount}
          subtitle={`${totalDishes - availableCount} out of inventory`}
          icon={CheckCircle}
        />
        <RestaurantStatCard
          title="Average Dish Price"
          value={`$${averagePrice}`}
          subtitle="Haute cuisine price index"
          icon={DollarSign}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <RestaurantSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search items by name, ingredients, profile..."
        />

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Courses</option>
            {menuCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDietary}
            onChange={e => setSelectedDietary(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Dietary</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
          </select>

          <select
            value={selectedAvailability}
            onChange={e => setSelectedAvailability(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <RestaurantDataTable
        columns={columns}
        data={filteredItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        emptyTitle="No dishes match your filter"
        emptyDescription="Try clearing filters or add a new menu item to your catalog."
        emptyActionLabel="Add Dish"
        onEmptyAction={startCreate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Menu Item"
        message="Are you sure you want to delete this dish from the active catalog?"
        itemName={itemToDelete?.name}
      />
    </div>
  );
};

export default MenuItemsPage;
