import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useToast } from '../../../context/ToastContext';
import {
  Sliders,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Edit,
  Filter,
  Search,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Shield,
  Zap,
} from 'lucide-react';

const initialPlatformFeatures = [
  {
    id: 'feat-01',
    code: 'HOTEL_MULTI_PROP',
    name: 'Multi-Property Global Switchboard',
    category: 'Hotel Management',
    description: 'Enables cross-property portfolio routing and consolidated ledger management.',
    targetTier: 'Royal Enterprise',
    isEnabled: true,
    maxAllocationLimit: 'Unlimited Properties',
  },
  {
    id: 'feat-02',
    code: 'ROOM_SMART_IOT',
    name: 'Smart Suite IoT Automation (Crestron / Lutron)',
    category: 'Room Management',
    description: 'Direct room control bridging for climate, lighting presets, and automated privacy curtains.',
    targetTier: 'Grand Deluxe & Above',
    isEnabled: true,
    maxAllocationLimit: '500 Connected Suites',
  },
  {
    id: 'feat-03',
    code: 'RES_AI_PRICING',
    name: 'Dynamic Yield & Algorithmic ADR Pricing',
    category: 'Reservations and Bookings',
    description: 'Autonomous occupancy forecasting and machine-learning rate adjustments.',
    targetTier: 'Royal Enterprise',
    isEnabled: true,
    maxAllocationLimit: 'Automated Realtime Cycles',
  },
  {
    id: 'feat-04',
    code: 'FD_PASSPORT_OCR',
    name: 'Passport & Diplomatic Visa OCR Scanner',
    category: 'Front Desk & Concierge',
    description: 'Sub-second optical guest identity scanning and automated police manifest dispatch.',
    targetTier: 'All Properties',
    isEnabled: true,
    maxAllocationLimit: 'Instant Hardware Bridge',
  },
  {
    id: 'feat-05',
    code: 'HK_RFID_LINEN',
    name: 'RFID Linen & Valet Tracking Mesh',
    category: 'Housekeeping',
    description: 'Continuous RFID laundry cycle auditing and uniform replenishment alerts.',
    targetTier: 'Grand Deluxe & Above',
    isEnabled: true,
    maxAllocationLimit: '50,000 RFID Tags',
  },
  {
    id: 'feat-06',
    code: 'FB_POS_INTEG',
    name: 'Michelin Star Dining & Sommelier POS',
    category: 'Restaurant & Dining',
    description: 'Bespoke vintage wine cellar provenance tracking and tableside iPad billing.',
    targetTier: 'All Properties',
    isEnabled: true,
    maxAllocationLimit: 'Unlimited Dining Outlets',
  },
  {
    id: 'feat-07',
    code: 'INV_AUTO_PURCHASE',
    name: 'Autonomous Purveyor PO Dispatch',
    category: 'Inventory & Store',
    description: 'Triggers supplier re-orders when caviar and vintage champagne breach safety thresholds.',
    targetTier: 'Grand Deluxe & Above',
    isEnabled: false,
    maxAllocationLimit: '100 Active Purveyors',
  },
  {
    id: 'feat-08',
    code: 'MNT_PREDICTIVE_HVAC',
    name: 'Predictive HVAC & Elevator Telemetry',
    category: 'Maintenance',
    description: 'Vibration analysis and automated maintenance ticketing prior to component failure.',
    targetTier: 'Royal Enterprise',
    isEnabled: true,
    maxAllocationLimit: '2,000 IoT Sensors',
  },
  {
    id: 'feat-09',
    code: 'HR_BIOMETRIC_TIME',
    name: 'Biometric Clocking & Tip Pool Reconciliation',
    category: 'Staff & HR',
    description: 'Facial recognition shift check-ins with automated gratuity distribution.',
    targetTier: 'All Properties',
    isEnabled: true,
    maxAllocationLimit: 'Unlimited Staff Clearances',
  },
  {
    id: 'feat-10',
    code: 'FIN_SWIFT_DIRECT',
    name: 'SWIFT Direct Bank Node & Crypto Escrow',
    category: 'Accounting & Finance',
    description: 'Instant multi-currency central bank wire reconciliation and crypto deposits.',
    targetTier: 'Royal Enterprise',
    isEnabled: true,
    maxAllocationLimit: 'Tier-1 Banking Gateway',
  },
  {
    id: 'feat-11',
    code: 'REP_BOARD_DECK',
    name: 'Automated Sovereign Board Deck Generator',
    category: 'Reports & Analytics',
    description: 'One-click executive board report synthesis with KaTeX metrics and PDF exports.',
    targetTier: 'All Properties',
    isEnabled: true,
    maxAllocationLimit: 'Instant Vector PDF',
  },
];

export const FeatureManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [features, setFeatures] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_platform_features');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load platform features', e);
    }
    return initialPlatformFeatures;
  });

  const persistFeatures = (updated) => {
    setFeatures(updated);
    try {
      localStorage.setItem('lazfort_platform_features', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist features', e);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New feature form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Hotel Management');
  const [newDescription, setNewDescription] = useState('');
  const [newLimit, setNewLimit] = useState('Standard Unlimited');

  // Metrics
  const totalFeatures = features.length;
  const activeFeatures = useMemo(() => features.filter(f => f.isEnabled).length, [features]);
  const categoriesCount = useMemo(() => new Set(features.map(f => f.category)).size, [features]);

  // Filtering
  const filteredFeatures = useMemo(() => {
    return features.filter(f => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || f.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [features, searchQuery, categoryFilter]);

  const toggleFeature = (id) => {
    const updated = features.map(f => {
      if (f.id === id) {
        const nextState = !f.isEnabled;
        showToast(
          nextState ? 'Feature Activated' : 'Feature Deactivated',
          `Module ${f.name} is now ${nextState ? 'active' : 'disabled'} platform-wide.`,
          nextState ? 'success' : 'warning'
        );
        return { ...f, isEnabled: nextState };
      }
      return f;
    });
    persistFeatures(updated);
  };

  const handleCreateFeature = (e) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newFeat = {
      id: `feat-${Date.now()}`,
      code: newCode.toUpperCase().replace(/\s+/g, '_'),
      name: newName,
      category: newCategory,
      description: newDescription || 'Enterprise feature module.',
      targetTier: 'Royal Enterprise',
      isEnabled: true,
      maxAllocationLimit: newLimit,
    };

    persistFeatures([newFeat, ...features]);
    setIsAddModalOpen(false);
    setNewCode('');
    setNewName('');
    setNewDescription('');
    showToast('Feature Module Provisioned', `Module ${newFeat.code} registered to catalog.`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingFeature) return;

    const updated = features.map(f => (f.id === editingFeature.id ? editingFeature : f));
    persistFeatures(updated);
    setEditingFeature(null);
    showToast('Feature Updated', `Configuration updated for ${editingFeature.name}.`, 'success');
  };

  const columns = [
    {
      key: 'name',
      header: 'Feature Module & Code',
      render: (f) => (
        <div>
          <div className="font-semibold text-xs text-primary dark:text-white flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>{f.name}</span>
          </div>
          <span className="font-mono text-[10px] text-accent font-bold mt-0.5 block">
            {f.code}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'ERP Department',
      render: (f) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-[11px]">
          {f.category}
        </span>
      ),
    },
    {
      key: 'targetTier',
      header: 'Subscription Tier Clearance',
      render: (f) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-300 font-medium">
          {f.targetTier}
        </span>
      ),
    },
    {
      key: 'maxAllocationLimit',
      header: 'Quota Limit',
      render: (f) => (
        <span className="text-xs font-mono text-charcoal-muted dark:text-gray-400">
          {f.maxAllocationLimit}
        </span>
      ),
    },
    {
      key: 'isEnabled',
      header: 'Global Switch',
      render: (f) => (
        <button
          onClick={() => toggleFeature(f.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
            f.isEnabled
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}
        >
          {f.isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          <span>{f.isEnabled ? 'Enabled' : 'Disabled'}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (f) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/subscriptions/features/details/${f.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Module Details on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/subscriptions/features/edit/${f.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Configure Allocation on Dedicated Page"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="ERP Feature Flags & Module Entitlements"
        description="Central feature management switchboard controlling all PMS, ERP, POS, and IoT capabilities"
        actions={
          <button
            onClick={() => navigate('/super-admin/subscriptions/features/add')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Module</span>
          </button>
        }
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Total Registered Modules"
          value={totalFeatures}
          subtitle="across 11 core subsystems"
          icon={<Layers className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Active Live Features"
          value={activeFeatures}
          subtitle={`${((activeFeatures / totalFeatures) * 100).toFixed(0)}% runtime allocation`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Protected Subsystems"
          value={categoriesCount}
          subtitle="cross-tenant isolated"
          icon={<Shield className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by module name, code, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[160px]"
            >
              <option value="all">All Departments</option>
              <option value="Hotel Management">Hotel Management</option>
              <option value="Room Management">Room Management</option>
              <option value="Reservations and Bookings">Reservations</option>
              <option value="Front Desk & Concierge">Front Desk</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Restaurant & Dining">Restaurant</option>
              <option value="Inventory & Store">Inventory</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Staff & HR">Staff & HR</option>
              <option value="Accounting & Finance">Finance</option>
              <option value="Reports & Analytics">Reports</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredFeatures}
          keyExtractor={(f) => f.id}
          pageSize={10}
          emptyMessage="No feature flags match current query."
        />
      </div>

      {/* Add Feature Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New Feature Flag"
        maxWidth="md"
      >
        <form onSubmit={handleCreateFeature} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase mb-1">Feature Code (Unique ID)</label>
            <input
              type="text"
              required
              placeholder="e.g. VIP_YACHT_CHARTER_DISPATCH"
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              className="input-luxury w-full font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase mb-1">Feature Display Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sovereign Yacht Charter Module"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="input-luxury w-full text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Department Subsystem</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="input-luxury w-full text-xs py-2"
              >
                <option value="Hotel Management">Hotel Management</option>
                <option value="Room Management">Room Management</option>
                <option value="Reservations and Bookings">Reservations</option>
                <option value="Front Desk & Concierge">Front Desk</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Restaurant & Dining">Restaurant</option>
                <option value="Inventory & Store">Inventory</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Staff & HR">Staff & HR</option>
                <option value="Accounting & Finance">Finance</option>
                <option value="Reports & Analytics">Reports</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Allocation Limit</label>
              <input
                type="text"
                placeholder="e.g. 50 Active Charters"
                value={newLimit}
                onChange={e => setNewLimit(e.target.value)}
                className="input-luxury w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase mb-1">Description & Operational Scope</label>
            <textarea
              rows={2}
              placeholder="Describe what this feature enables for hotel managers..."
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="input-luxury w-full text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
            >
              Register Flag
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {selectedFeature && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFeature(null)}
          title={`Feature Specification: ${selectedFeature.name}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border/80">
              <span className="font-mono text-[10px] text-accent font-bold uppercase">{selectedFeature.code}</span>
              <h4 className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                {selectedFeature.name}
              </h4>
              <p className="text-charcoal-muted mt-2 leading-relaxed">{selectedFeature.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Department</span>
                <span className="font-semibold text-primary dark:text-white">{selectedFeature.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Subscription Tier</span>
                <span className="font-semibold text-primary dark:text-white">{selectedFeature.targetTier}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d shadow-gold"
              >
                Close Specification
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingFeature && (
        <Modal
          isOpen={true}
          onClose={() => setEditingFeature(null)}
          title={`Edit Allocation: ${editingFeature.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Feature Name</label>
              <input
                type="text"
                value={editingFeature.name}
                onChange={e => setEditingFeature({ ...editingFeature, name: e.target.value })}
                className="input-luxury w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Max Allocation Limit</label>
              <input
                type="text"
                value={editingFeature.maxAllocationLimit}
                onChange={e => setEditingFeature({ ...editingFeature, maxAllocationLimit: e.target.value })}
                className="input-luxury w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Description</label>
              <textarea
                rows={2}
                value={editingFeature.description}
                onChange={e => setEditingFeature({ ...editingFeature, description: e.target.value })}
                className="input-luxury w-full text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setEditingFeature(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeatureManagementPage;

