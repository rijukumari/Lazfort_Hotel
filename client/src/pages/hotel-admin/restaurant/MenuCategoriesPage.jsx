import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Utensils,
  Layers,
  ArrowLeft,
  Sparkles,
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

export const MenuCategoriesPage = () => {
  const {
    menuCategories = [],
    menuItems = [],
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    toggleMenuCategoryStatus,
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [displayMode, setDisplayMode] = useState('cards'); // 'cards' | 'table'

  // Dedicated Page Form View State ('list' | 'create' | 'edit')
  const [pageView, setPageView] = useState('list');
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});

  const startCreate = () => {
    setCategoryToEdit(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
    });
    setFormErrors({});
    setPageView('create');
  };

  const startEdit = (cat) => {
    setCategoryToEdit(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'Active',
    });
    setFormErrors({});
    setPageView('edit');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Category name is required.';
    if (!formData.description.trim()) errs.description = 'Description is required.';
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (categoryToEdit) {
      updateMenuCategory(categoryToEdit.id, formData);
      showToast('Category Updated', `Menu category "${formData.name}" has been updated successfully.`, 'success');
    } else {
      addMenuCategory(formData);
      showToast('Category Created', `Menu category "${formData.name}" has been added to dining catalog.`, 'success');
    }
    setPageView('list');
  };

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return menuCategories.filter(cat => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        cat.name?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && cat.status === 'Active') ||
        (statusFilter === 'inactive' && cat.status === 'Inactive');

      return matchesSearch && matchesStatus;
    });
  }, [menuCategories, searchQuery, statusFilter]);

  const handleToggleStatus = (cat) => {
    toggleMenuCategoryStatus(cat.id);
    showToast(
      'Category Status Changed',
      `Category "${cat.name}" is now ${cat.status === 'Active' ? 'Inactive' : 'Active'}.`,
      'info'
    );
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    deleteMenuCategory(categoryToDelete.id);
    showToast('Category Removed', `Menu category "${categoryToDelete.name}" deleted.`, 'success');
    setCategoryToDelete(null);
  };

  const totalCategories = menuCategories.length;
  const activeCategories = menuCategories.filter(c => c.status === 'Active').length;
  const totalDishes = menuItems.length;

  const tableColumns = [
    {
      key: 'name',
      header: 'Category & Visual',
      sortable: true,
      render: cat => (
        <div className="flex items-center gap-3">
          <img
            src={cat.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'}
            alt={cat.name}
            className="w-10 h-10 rounded-xl object-cover border border-border/80 dark:border-white/10 shrink-0"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white text-xs">{cat.name}</p>
            <p className="text-[11px] text-charcoal-muted line-clamp-1 max-w-xs">{cat.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'totalItems',
      header: 'Catalog Items',
      sortable: true,
      render: cat => {
        const count = menuItems.filter(i => i.categoryId === cat.id).length || cat.totalItems || 0;
        return <span className="font-mono text-xs font-semibold">{count} Items</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: cat => (
        <button
          onClick={() => handleToggleStatus(cat)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            cat.status === 'Active'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-gray-500/15 text-gray-500 border-gray-500/30'
          }`}
          title="Click to toggle status"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          <span>{cat.status}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: cat => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => startEdit(cat)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Category"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setCategoryToDelete(cat);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-charcoal-muted hover:text-rose-600 transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Full Page Form View for Create & Edit
  if (pageView === 'create' || pageView === 'edit') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        {/* Back Button & Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-[#101725] text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Categories</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#101725]/90 backdrop-blur-xl border border-accent/30 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                {pageView === 'edit' ? `Edit Culinary Category: ${categoryToEdit?.name}` : 'Create New Menu Category'}
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Configure taxonomy, catalog presentation, and visual banners for this dining division.
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Caviar & Cold Seafood Bar"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Operational Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="Active">Active in Dining Room</option>
                  <option value="Inactive">Inactive / Off-Season</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Image Banner URL
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
                <div className="mt-3 relative h-32 w-full max-w-sm rounded-xl overflow-hidden border border-border/80 dark:border-white/10">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded text-[10px] bg-black/60 text-white font-mono">
                    Preview Banner
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Gastronomic Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this category, culinary focus, wine pairings or dietary notes..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
              {formErrors.description && (
                <p className="mt-1 text-[11px] text-rose-500">{formErrors.description}</p>
              )}
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
                <span>{pageView === 'edit' ? 'Update Category' : 'Save Category'}</span>
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
              Menu Categories Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Gastronomic Sections
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Define culinary courses, champagne cellars, and seasonal banquet divisions.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>



      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RestaurantStatCard
          title="Total Menu Categories"
          value={totalCategories}
          subtitle="Haute cuisine sections"
          icon={FolderTree}
        />
        <RestaurantStatCard
          title="Active in Service"
          value={activeCategories}
          subtitle={`${totalCategories - activeCategories} dormant / seasonal`}
          icon={CheckCircle}
        />
        <RestaurantStatCard
          title="Total Menu Offerings"
          value={totalDishes}
          subtitle="Dishes mapped to categories"
          icon={Utensils}
        />
      </div>

      {/* Search, Filter & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          <RestaurantSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search categories by name, profile..."
          />
          <RestaurantFilters
            activeFilter={statusFilter}
            onSelectFilter={setStatusFilter}
            options={[
              { value: 'all', label: 'All', count: totalCategories },
              { value: 'active', label: 'Active', count: activeCategories },
              { value: 'inactive', label: 'Inactive', count: totalCategories - activeCategories },
            ]}
          />
        </div>

        <div className="flex items-center gap-1.5 self-end md:self-center p-1 rounded-xl bg-ivory dark:bg-white/5 border border-border/80 dark:border-white/10">
          <button
            onClick={() => setDisplayMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              displayMode === 'cards'
                ? 'bg-accent text-white dark:text-primary-950 shadow-sm'
                : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Cards Grid
          </button>
          <button
            onClick={() => setDisplayMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              displayMode === 'table'
                ? 'bg-accent text-white dark:text-primary-950 shadow-sm'
                : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Data Table
          </button>
        </div>
      </div>

      {/* Content View: Cards vs Table */}
      {displayMode === 'table' ? (
        <RestaurantDataTable
          columns={tableColumns}
          data={filteredCategories}
          emptyTitle="No menu categories match your criteria"
          emptyDescription="Try clearing filters or add a new culinary category."
          emptyActionLabel="Add Category"
          onEmptyAction={startCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-charcoal-muted">
              No categories found matching your query.
            </div>
          ) : (
            filteredCategories.map(cat => {
              const count = menuItems.filter(i => i.categoryId === cat.id).length || cat.totalItems || 0;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-gold hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  {/* Category Image Header */}
                  <div className="relative h-36 w-full overflow-hidden bg-primary-900">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={e => {
                        e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                          cat.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : 'bg-black/40 text-gray-400 border-white/20'
                        }`}
                      >
                        {cat.status}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-serif font-bold text-lg leading-tight truncate drop-shadow">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-accent font-mono font-semibold">
                        {count} Culinary Items
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-charcoal/80 dark:text-gray-300 line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="pt-3 border-t border-border/60 dark:border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className="text-[11px] font-semibold text-charcoal-muted hover:text-accent transition-colors"
                      >
                        {cat.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 rounded-lg bg-ivory dark:bg-white/5 hover:bg-accent/20 text-charcoal-muted hover:text-accent transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(cat);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-ivory dark:bg-white/5 hover:bg-rose-500/20 text-charcoal-muted hover:text-rose-500 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Category"
        message="Are you sure you want to delete this category? Associated menu items may need re-categorization."
        itemName={categoryToDelete?.name}
      />
    </div>
  );
};

export default MenuCategoriesPage;

