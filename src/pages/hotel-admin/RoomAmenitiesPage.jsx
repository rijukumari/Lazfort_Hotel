import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Sparkles,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Wine,
  Waves,
  Wifi,
  Tv,
  Bath,
  Coffee,
  Shield,
  Car,
  Bell,
  X,
  Save,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const initialAmenities = [
  {
    id: 'amen-01',
    name: 'Private Heated Infinity Pool',
    category: 'Wellness & Spa',
    iconName: 'Waves',
    description: 'Cliffside seawater pool heated to 29°C with automated hydro-jets and underwater illumination.',
    status: 'Active',
    assignedRoomsCount: 3,
  },
  {
    id: 'amen-02',
    name: 'Dedicated 24/7 Sovereign Butler',
    category: 'Butler & Concierge',
    iconName: 'Bell',
    description: 'Clefs d’Or certified private butler providing bespoke packing, garment steaming, and in-suite dining service.',
    status: 'Active',
    assignedRoomsCount: 6,
  },
  {
    id: 'amen-03',
    name: 'Rolls-Royce Chauffeur Clearance',
    category: 'Mobility & Airport',
    iconName: 'Car',
    description: 'Complimentary chauffeured Phantom or Ghost transfers across Nice Airport, Monaco Heliport, and Port Hercule.',
    status: 'Active',
    assignedRoomsCount: 4,
  },
  {
    id: 'amen-04',
    name: 'Carrara Marble Jacuzzi Bath',
    category: 'Luxury Bath',
    iconName: 'Bath',
    description: 'Deep-soaking hand-carved Italian marble tub with hydrotherapy nozzles and organic botanical bath salts.',
    status: 'Active',
    assignedRoomsCount: 8,
  },
  {
    id: 'amen-05',
    name: 'Sommelier Curated Wine Cellar',
    category: 'Refreshment & Dining',
    iconName: 'Wine',
    description: 'Temperature-controlled dual-zone cellar stocked with Grand Cru vintages, rare champagnes, and crystal stemware.',
    status: 'Active',
    assignedRoomsCount: 5,
  },
  {
    id: 'amen-06',
    name: 'Bang & Olufsen Spatial Acoustics',
    category: 'Media & Technology',
    iconName: 'Tv',
    description: 'Integrated multi-room Beosound acoustics with wireless streaming and acoustic room compensation.',
    status: 'Active',
    assignedRoomsCount: 10,
  },
  {
    id: 'amen-07',
    name: 'Nespresso Atelier & Grand Cru Tea Bar',
    category: 'Refreshment & Dining',
    iconName: 'Coffee',
    description: 'Artisanal espresso creation station paired with rare Mariage Frères loose-leaf tea canisters.',
    status: 'Active',
    assignedRoomsCount: 12,
  },
  {
    id: 'amen-08',
    name: 'Ultra High-Speed Sovereign Wi-Fi 7',
    category: 'Media & Technology',
    iconName: 'Wifi',
    description: 'Dedicated encrypted Gigabit fiber connection with seamless property-wide roaming and private VPN.',
    status: 'Active',
    assignedRoomsCount: 15,
  },
];

export const RoomAmenitiesPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [amenities, setAmenities] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_room_amenities');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse amenities', e);
    }
    return initialAmenities;
  });

  const persistAmenities = (list) => {
    setAmenities(list);
    try {
      localStorage.setItem('lazfort_room_amenities', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist amenities', e);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Wellness & Spa',
    iconName: 'Sparkles',
    description: '',
    status: 'Active',
  });

  const filteredAmenities = useMemo(() => {
    return amenities.filter(a => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [amenities, searchQuery, categoryFilter, statusFilter]);

  const activeCount = amenities.filter(a => a.status === 'Active').length;
  const categoriesList = Array.from(new Set(amenities.map(a => a.category)));

  const handleOpenAdd = () => {
    setEditingAmenity(null);
    setFormData({
      name: '',
      category: 'Wellness & Spa',
      iconName: 'Sparkles',
      description: '',
      status: 'Active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingAmenity(item);
    setFormData({
      name: item.name,
      category: item.category,
      iconName: item.iconName || 'Sparkles',
      description: item.description,
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleSaveAmenity = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Validation Error', 'Amenity name is required.', 'error');
      return;
    }

    if (editingAmenity) {
      const updated = amenities.map(a => {
        if (a.id === editingAmenity.id) {
          return {
            ...a,
            name: formData.name.trim(),
            category: formData.category,
            iconName: formData.iconName,
            description: formData.description.trim(),
            status: formData.status,
          };
        }
        return a;
      });
      persistAmenities(updated);
      showToast('Amenity Updated', `${formData.name} updated successfully.`, 'success');
    } else {
      const newAmenity = {
        id: `amen-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        iconName: formData.iconName,
        description: formData.description.trim(),
        status: formData.status,
        assignedRoomsCount: 0,
      };
      persistAmenities([...amenities, newAmenity]);
      showToast('Amenity Added', `${formData.name} registered in amenities master list.`, 'success');
    }

    setModalOpen(false);
  };

  const handleDeleteAmenity = () => {
    if (!deleteId) return;
    const updated = amenities.filter(a => a.id !== deleteId);
    persistAmenities(updated);
    setDeleteId(null);
    showToast('Amenity Removed', 'Amenity removed from catalog.', 'info');
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Waves': return <Waves className="w-4 h-4 text-accent" />;
      case 'Bell': return <Bell className="w-4 h-4 text-accent" />;
      case 'Car': return <Car className="w-4 h-4 text-accent" />;
      case 'Bath': return <Bath className="w-4 h-4 text-accent" />;
      case 'Wine': return <Wine className="w-4 h-4 text-accent" />;
      case 'Tv': return <Tv className="w-4 h-4 text-accent" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-accent" />;
      case 'Wifi': return <Wifi className="w-4 h-4 text-accent" />;
      default: return <Sparkles className="w-4 h-4 text-accent" />;
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Amenity Specification',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
            {renderIcon(item.iconName)}
          </div>
          <div>
            <span className="font-semibold text-primary dark:text-white font-serif text-sm">
              {item.name}
            </span>
            <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5 max-w-sm">
              {item.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category Classification',
      sortable: true,
      render: item => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-ivory dark:bg-white/5 border border-border/70 text-charcoal-muted">
          {item.category}
        </span>
      ),
    },
    {
      key: 'assignedRoomsCount',
      header: 'Suite Allocations',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs font-semibold text-accent">
          {item.assignedRoomsCount} Active Suites
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Catalog Status',
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
            title="Edit Amenity Details"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete Amenity"
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
        title="Room Amenities & Concierge Inclusions"
        description="Catalog of bespoke amenities, luxury toiletries, wellness features, and in-suite acoustics allocated to suites."
        badge={`${amenities.length} Registered Amenities`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Add New Amenity
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Active Amenities"
          value={activeCount}
          subtitle="available in catalog"
          icon={<Sparkles className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Amenity Categories"
          value={categoriesList.length}
          subtitle="service domains"
          icon={<Shield className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Most Requested"
          value="Private Butler"
          subtitle="100% VIP satisfaction"
          icon={<Bell className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Standard Inclusions"
          value="Wi-Fi 7 & Bar"
          subtitle="all suites equipped"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* DataTable Container */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search amenity by name, category, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[150px]"
            >
              <option value="all">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredAmenities}
          keyExtractor={item => item.id}
          pageSize={6}
          emptyMessage="No amenities match current search or filters."
        />
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury w-full max-w-lg p-6 sm:p-7 rounded-2xl border border-accent/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  {editingAmenity ? `Edit Amenity: ${editingAmenity.name}` : 'Register New Amenity'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAmenity} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Amenity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bang & Olufsen Spatial Acoustics"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-luxury text-xs w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Category Domain
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    <option value="Wellness & Spa">Wellness & Spa</option>
                    <option value="Butler & Concierge">Butler & Concierge</option>
                    <option value="Mobility & Airport">Mobility & Airport</option>
                    <option value="Luxury Bath">Luxury Bath</option>
                    <option value="Refreshment & Dining">Refreshment & Dining</option>
                    <option value="Media & Technology">Media & Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Visual Icon
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    <option value="Sparkles">Sparkles (General)</option>
                    <option value="Waves">Waves (Pool / Spa)</option>
                    <option value="Bell">Bell (Butler)</option>
                    <option value="Car">Car (Chauffeur)</option>
                    <option value="Bath">Bath (Jacuzzi)</option>
                    <option value="Wine">Wine (Cellar)</option>
                    <option value="Tv">Tv (Acoustics / Screen)</option>
                    <option value="Coffee">Coffee (Espresso Bar)</option>
                    <option value="Wifi">Wifi (High-Speed)</option>
                  </select>
                </div>
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

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Feature Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the specifications, brands, and guest experience..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury text-xs w-full resize-none"
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
                  {editingAmenity ? 'Save Changes' : 'Register Amenity'}
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
          onConfirm={handleDeleteAmenity}
          title="Remove Amenity?"
          message="Are you sure you wish to delete this amenity from the master catalog? Active suites will retain their historical record."
          confirmText="Confirm Deletion"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RoomAmenitiesPage;

