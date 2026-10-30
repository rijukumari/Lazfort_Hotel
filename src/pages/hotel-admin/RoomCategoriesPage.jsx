import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Layers,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  BedDouble,
  CheckCircle,
  XCircle,
  Sparkles,
  X,
  Save,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

const initialCategories = [
  {
    id: 'cat-01',
    name: 'Presidential Suite',
    roomType: 'Penthouse',
    description: 'Bespoke top-floor suites featuring panoramic French Riviera vistas, private heated infinity pools, and 24/7 dedicated butler service.',
    basePrice: 4800,
    roomCount: 2,
    status: 'Active',
    amenities: ['Private Infinity Pool', '24/7 Butler', 'Chauffeur Rolls-Royce', 'Wine Cellar'],
  },
  {
    id: 'cat-02',
    name: 'Royal Penthouse',
    roomType: 'Penthouse',
    description: 'Refined oceanfront penthouse sanctuaries with Carrara marble fireplaces, private terrace gardens, and Bulgari bath amenities.',
    basePrice: 2950,
    roomCount: 3,
    status: 'Active',
    amenities: ['Private Terrace', 'Personal Concierge', 'Marble Bath', 'Complimentary Champagne'],
  },
  {
    id: 'cat-03',
    name: 'Deluxe Ocean Villa',
    roomType: 'Villa',
    description: 'Secluded beachfront villas offering direct yacht mooring clearance, private sun decks, and bespoke in-villa dining salons.',
    basePrice: 3600,
    roomCount: 2,
    status: 'Active',
    amenities: ['Direct Beach Access', 'Private Sun Deck', 'In-Villa Chef', 'Jacuzzi'],
  },
  {
    id: 'cat-04',
    name: 'Executive Suite',
    roomType: 'Suite',
    description: 'High-floor executive residences crafted for visiting dignitaries and sovereign travelers, featuring soundproof acoustic lounges.',
    basePrice: 1850,
    roomCount: 4,
    status: 'Active',
    amenities: ['Panoramic Balcony', 'Nespresso Atelier', 'Executive Lounge Access', 'High-Speed Wi-Fi'],
  },
  {
    id: 'cat-05',
    name: 'Sovereign Imperial Residence',
    roomType: 'Residence',
    description: 'The crowning luxury estate with 3 master bedrooms, private cinema room, helicopter landing protocol, and biometric vault.',
    basePrice: 5200,
    roomCount: 1,
    status: 'Active',
    amenities: ['Helipad Access', 'Private Cinema', 'Biometric Vault', 'Dedicated Chef & Butler'],
  },
];

export const RoomCategoriesPage = () => {
  const navigate = useNavigate();
  const { rooms } = useERP();
  const { showToast } = useToast();

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_room_categories');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse categories', e);
    }
    return initialCategories;
  });

  const persistCategories = (list) => {
    setCategories(list);
    try {
      localStorage.setItem('lazfort_room_categories', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist categories', e);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roomType: 'Suite',
    description: '',
    basePrice: 2000,
    status: 'Active',
    amenities: '',
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const totalSuitesCount = categories.reduce((sum, c) => sum + (c.roomCount || 0), 0);
  const avgBaseRate = Math.round(categories.reduce((sum, c) => sum + c.basePrice, 0) / Math.max(1, categories.length));

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      roomType: 'Suite',
      description: '',
      basePrice: 2000,
      status: 'Active',
      amenities: 'Panoramic Balcony, Private Butler, Nespresso Atelier, Marble Bath',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      roomType: cat.roomType,
      description: cat.description,
      basePrice: cat.basePrice,
      status: cat.status,
      amenities: cat.amenities ? cat.amenities.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Validation Error', 'Category name is required.', 'error');
      return;
    }

    const amenitiesList = formData.amenities
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingCategory) {
      const updated = categories.map(c => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name: formData.name.trim(),
            roomType: formData.roomType,
            description: formData.description.trim(),
            basePrice: Number(formData.basePrice),
            status: formData.status,
            amenities: amenitiesList,
          };
        }
        return c;
      });
      persistCategories(updated);
      showToast('Category Updated', `${formData.name} configuration updated successfully.`, 'success');
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: formData.name.trim(),
        roomType: formData.roomType,
        description: formData.description.trim(),
        basePrice: Number(formData.basePrice),
        roomCount: 1,
        status: formData.status,
        amenities: amenitiesList,
      };
      persistCategories([...categories, newCat]);
      showToast('Category Created', `${formData.name} added to room category registry.`, 'success');
    }

    setModalOpen(false);
  };

  const handleDeleteCategory = () => {
    if (!deleteId) return;
    const updated = categories.filter(c => c.id !== deleteId);
    persistCategories(updated);
    setDeleteId(null);
    showToast('Category Removed', 'Room category deleted successfully.', 'info');
  };

  const columns = [
    {
      key: 'name',
      header: 'Category & Classification',
      sortable: true,
      render: item => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary dark:text-white font-serif text-sm">
              {item.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-bold uppercase">
              {item.roomType}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5 max-w-md">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      key: 'basePrice',
      header: 'Base Tariff',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent text-sm">
          ${item.basePrice?.toLocaleString()}
          <span className="text-[10px] text-charcoal-muted font-mono font-normal"> / night</span>
        </span>
      ),
    },
    {
      key: 'roomCount',
      header: 'Inventory Size',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs font-semibold text-primary dark:text-gray-200">
          {item.roomCount} {item.roomCount === 1 ? 'Suite' : 'Suites'}
        </span>
      ),
    },
    {
      key: 'amenities',
      header: 'Featured Inclusions',
      render: item => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {item.amenities?.slice(0, 2).map((a, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded bg-ivory dark:bg-white/5 border border-border/60 text-charcoal-muted"
            >
              {a}
            </span>
          ))}
          {item.amenities?.length > 2 && (
            <span className="text-[10px] px-1 text-accent font-mono font-bold">
              +{item.amenities.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            item.status === 'Active'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-charcoal/10 text-charcoal-muted'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Category"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Room Categories & Suite Classifications"
        description="Configure luxury room categories, floor plans, standard nightly tariffs, and bespoke suite amenity templates."
        badge={`${categories.length} Categories`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={BedDouble}
              onClick={() => navigate('/hotel-admin/rooms')}
            >
              All Suites
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Add New Category
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Active Categories"
          value={categories.filter(c => c.status === 'Active').length}
          subtitle="live suite types"
          icon={<Layers className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Total Suite Inventory"
          value={totalSuitesCount || rooms.length}
          subtitle="allocated across categories"
          icon={<BedDouble className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Average Base Rate"
          value={`$${avgBaseRate.toLocaleString()}`}
          subtitle="standard nightly baseline"
          icon={<DollarSign className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Category Compliance"
          value="100% Configured"
          subtitle="amenities & pricing synced"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Table Container */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name, type, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredCategories}
          keyExtractor={item => item.id}
          pageSize={6}
          emptyMessage="No room categories match the current search or filters."
        />
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury w-full max-w-lg p-6 sm:p-7 rounded-2xl border border-accent/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Room Category'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Presidential Suite"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-luxury text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Room Classification
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={e => setFormData({ ...formData, roomType: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Suite">Suite</option>
                    <option value="Residence">Residence</option>
                    <option value="Deluxe">Deluxe Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Base Nightly Rate ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formData.basePrice}
                    onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                    className="input-luxury text-xs w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the layout, views, and unique architectural features..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury text-xs w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Default Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heated Infinity Pool, 24/7 Butler, Balcony, Wine Cellar"
                  value={formData.amenities}
                  onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                  className="input-luxury text-xs w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80 dark:border-white/10">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  icon={Save}
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteCategory}
          title="Delete Room Category?"
          message="Are you sure you wish to delete this category? Suites currently assigned to this category will need reallocation."
          confirmText="Confirm Deletion"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RoomCategoriesPage;

