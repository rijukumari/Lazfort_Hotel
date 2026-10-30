import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Tabs, Card, FormField, Input, Select } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
  Edit,
  Save,
  CheckCircle,
  Clock,
  History,
  X,
  BedDouble,
  ShieldAlert,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const RoomPricingPage = () => {
  const navigate = useNavigate();
  const { rooms, updateRoom } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('rooms');
  const [editingPricing, setEditingPricing] = useState(null);

  // Global pricing configuration
  const [pricingPolicy, setPricingPolicy] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_pricing_policy');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse pricing policy', e);
    }
    return {
      weekendMultiplier: 15, // +15%
      highSeasonMultiplier: 25, // +25%
      extraGuestCharge: 250, // $250 / night
      vatTaxRate: 10, // 10%
      cityTaxPerNight: 15, // $15 / night
      longStayDiscountDays: 7,
      longStayDiscountPercent: 12, // 12% off for 7+ days
      effectiveDate: '2026-10-01',
    };
  });

  const [priceHistory, setPriceHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_price_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse price history', e);
    }
    return [
      { id: 'ph-1', date: '2026-10-15', roomNumber: 'PH-1201', oldRate: 4500, newRate: 4800, changedBy: 'General Manager' },
      { id: 'ph-2', date: '2026-10-10', roomNumber: 'ST-804', oldRate: 2800, newRate: 2950, changedBy: 'Revenue Director' },
      { id: 'ph-3', date: '2026-10-05', roomNumber: 'VL-301', oldRate: 3400, newRate: 3600, changedBy: 'Yield Controller' },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Editing form state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    roomNumber: '',
    roomName: '',
    pricePerNight: 2000,
    weekendRate: 2300,
    highSeasonRate: 2500,
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  const filteredRooms = useMemo(() => {
    return (rooms || []).filter(r => {
      return (
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [rooms, searchQuery]);

  // Derived Category-wise pricing
  const categoryPricing = useMemo(() => {
    const cats = {};
    (rooms || []).forEach(r => {
      if (!cats[r.type]) {
        cats[r.type] = {
          category: r.type,
          count: 0,
          totalPrice: 0,
          minPrice: Infinity,
          maxPrice: -Infinity,
        };
      }
      cats[r.type].count += 1;
      cats[r.type].totalPrice += r.pricePerNight;
      cats[r.type].minPrice = Math.min(cats[r.type].minPrice, r.pricePerNight);
      cats[r.type].maxPrice = Math.max(cats[r.type].maxPrice, r.pricePerNight);
    });

    return Object.values(cats).map(c => ({
      category: c.category,
      count: c.count,
      avgRate: Math.round(c.totalPrice / c.count),
      weekendRate: Math.round((c.totalPrice / c.count) * (1 + pricingPolicy.weekendMultiplier / 100)),
      peakRate: Math.round((c.totalPrice / c.count) * (1 + pricingPolicy.highSeasonMultiplier / 100)),
      range: `$${c.minPrice.toLocaleString()} - $${c.maxPrice.toLocaleString()}`,
    }));
  }, [rooms, pricingPolicy]);

  const handleOpenEdit = (room) => {
    setEditingPricing(room);
    const standard = room.pricePerNight;
    const weekend = Math.round(standard * (1 + pricingPolicy.weekendMultiplier / 100));
    const peak = Math.round(standard * (1 + pricingPolicy.highSeasonMultiplier / 100));

    setFormData({
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomName: room.name,
      pricePerNight: standard,
      weekendRate: weekend,
      highSeasonRate: peak,
      effectiveDate: new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleSavePricing = (e) => {
    e.preventDefault();
    if (!editingPricing) return;

    const newRate = Number(formData.pricePerNight);
    const oldRate = editingPricing.pricePerNight;

    updateRoom(editingPricing.id, {
      pricePerNight: newRate,
    });

    // Record price history
    const historyEntry = {
      id: `ph-${Date.now()}`,
      date: formData.effectiveDate,
      roomNumber: editingPricing.roomNumber,
      oldRate,
      newRate,
      changedBy: 'Revenue Controller',
    };
    const updatedHistory = [historyEntry, ...priceHistory];
    setPriceHistory(updatedHistory);
    try {
      localStorage.setItem('lazfort_price_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Failed to save price history', e);
    }

    setModalOpen(false);
    showToast(
      'Nightly Tariff Enforced',
      `Suite ${editingPricing.roomNumber} base rate updated to $${newRate.toLocaleString()} effective ${formData.effectiveDate}.`,
      'success'
    );
  };

  const handleSaveGlobalPolicies = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_pricing_policy', JSON.stringify(pricingPolicy));
      showToast('Pricing Strategy Applied', 'Weekend multipliers, seasonal surcharges, and tax rates updated.', 'success');
    } catch {
      showToast('Error', 'Failed to save policies.', 'error');
    }
  };

  const roomColumns = [
    {
      key: 'roomNumber',
      header: 'Suite No.',
      sortable: true,
      render: r => <span className="font-mono font-bold text-accent">{r.roomNumber}</span>,
    },
    {
      key: 'name',
      header: 'Suite Particulars & Tier',
      sortable: true,
      render: r => (
        <div>
          <span className="font-semibold text-primary dark:text-white font-serif">{r.name}</span>
          <span className="text-[11px] text-charcoal-muted block">{r.type} • Floor {r.floor}</span>
        </div>
      ),
    },
    {
      key: 'pricePerNight',
      header: 'Standard Nightly',
      sortable: true,
      render: r => (
        <span className="font-serif font-bold text-accent text-sm">
          ${r.pricePerNight?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'weekend',
      header: 'Weekend Rate (+15%)',
      render: r => (
        <span className="font-mono text-xs text-primary dark:text-gray-200">
          ${Math.round(r.pricePerNight * (1 + pricingPolicy.weekendMultiplier / 100)).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'seasonal',
      header: 'High Season (+25%)',
      render: r => (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          ${Math.round(r.pricePerNight * (1 + pricingPolicy.highSeasonMultiplier / 100)).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Inventory State',
      sortable: true,
      render: r => <StatusBadge status={r.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Tariff Action',
      render: r => (
        <button
          onClick={() => handleOpenEdit(r)}
          className="px-3 py-1.5 rounded-xl border border-border dark:border-white/10 hover:border-accent text-accent font-semibold text-xs flex items-center gap-1 transition-all"
          title="Edit Pricing"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Rate</span>
        </button>
      ),
    },
  ];

  const categoryColumns = [
    {
      key: 'category',
      header: 'Category Tier',
      sortable: true,
      render: c => (
        <div>
          <span className="font-serif font-bold text-primary dark:text-white">{c.category}</span>
          <span className="text-[11px] text-charcoal-muted block">{c.count} Allocated Suites</span>
        </div>
      ),
    },
    {
      key: 'avgRate',
      header: 'Average Base Rate',
      sortable: true,
      render: c => (
        <span className="font-serif font-bold text-accent text-sm">
          ${c.avgRate.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'weekendRate',
      header: 'Weekend Baseline',
      sortable: true,
      render: c => (
        <span className="font-mono text-xs text-primary dark:text-gray-200">
          ${c.weekendRate.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'peakRate',
      header: 'Peak Season Baseline',
      sortable: true,
      render: c => (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          ${c.peakRate.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'range',
      header: 'Price Spread',
      render: c => (
        <span className="font-mono text-xs text-charcoal-muted">
          {c.range}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Room Pricing & Revenue Yield Architecture"
        description="Fine-tune standard nightly tariffs, weekend surcharges, seasonal yield multipliers, statutory VAT, and discount policies."
        badge={`${rooms.length} Configured Tariffs`}
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Portfolio RevPAR Target"
          value="$2,450"
          subtitle="+8.4% vs benchmark"
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Weekend Surge Rule"
          value={`+${pricingPolicy.weekendMultiplier}%`}
          subtitle="Fri & Sat auto-surge"
          icon={<Percent className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="High-Season Surcharge"
          value={`+${pricingPolicy.highSeasonMultiplier}%`}
          subtitle="Monaco Grand Prix & Summer"
          icon={<Sparkles className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Statutory Tax & VAT"
          value={`${pricingPolicy.vatTaxRate}% + $${pricingPolicy.cityTaxPerNight}`}
          subtitle="auto-computed in folios"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'rooms'
              ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold'
              : 'btn-secondary-3d text-charcoal-muted hover:text-accent'
          }`}
        >
          Room-wise Pricing
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'categories'
              ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold'
              : 'btn-secondary-3d text-charcoal-muted hover:text-accent'
          }`}
        >
          Category-wise Pricing
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'policies'
              ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold'
              : 'btn-secondary-3d text-charcoal-muted hover:text-accent'
          }`}
        >
          Seasonal & Tax Policies
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold'
              : 'btn-secondary-3d text-charcoal-muted hover:text-accent'
          }`}
        >
          Price History Log
        </button>
      </div>

      {/* Tab: Room-wise Pricing */}
      {activeTab === 'rooms' && (
        <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by suite number, name, or classification..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury text-xs w-full"
            />
          </div>

          <DataTable
            columns={roomColumns}
            data={filteredRooms}
            keyExtractor={r => r.id}
            pageSize={6}
            emptyMessage="No rooms found matching search criteria."
          />
        </div>
      )}

      {/* Tab: Category-wise Pricing */}
      {activeTab === 'categories' && (
        <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
          <DataTable
            columns={categoryColumns}
            data={categoryPricing}
            keyExtractor={c => c.category}
            pageSize={6}
          />
        </div>
      )}

      {/* Tab: Policies Configuration */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSaveGlobalPolicies} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="luxury" className="p-6 space-y-5">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-accent" />
              <span>Yield & Dynamic Multipliers</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Weekend Surcharge (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={pricingPolicy.weekendMultiplier}
                  onChange={e => setPricingPolicy({ ...pricingPolicy, weekendMultiplier: Number(e.target.value) })}
                  className="input-luxury text-xs w-full font-mono"
                />
                <span className="text-[10px] text-charcoal-muted block mt-0.5">Applied automatically to Friday & Saturday bookings.</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Peak & High Season Multiplier (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={pricingPolicy.highSeasonMultiplier}
                  onChange={e => setPricingPolicy({ ...pricingPolicy, highSeasonMultiplier: Number(e.target.value) })}
                  className="input-luxury text-xs w-full font-mono"
                />
                <span className="text-[10px] text-charcoal-muted block mt-0.5">Enforced during Grand Prix, Monaco Yacht Show & summer weeks.</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Extra Guest Charge ($ USD / night)
                </label>
                <input
                  type="number"
                  min={0}
                  value={pricingPolicy.extraGuestCharge}
                  onChange={e => setPricingPolicy({ ...pricingPolicy, extraGuestCharge: Number(e.target.value) })}
                  className="input-luxury text-xs w-full font-mono"
                />
                <span className="text-[10px] text-charcoal-muted block mt-0.5">Incurred for occupancy beyond standard suite baseline.</span>
              </div>
            </div>
          </Card>

          <Card variant="luxury" className="p-6 space-y-5">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>Taxes, VAT & Long-Stay Discounts</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Statutory VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={pricingPolicy.vatTaxRate}
                    onChange={e => setPricingPolicy({ ...pricingPolicy, vatTaxRate: Number(e.target.value) })}
                    className="input-luxury text-xs w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    City Tourism Tax ($ / night)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={pricingPolicy.cityTaxPerNight}
                    onChange={e => setPricingPolicy({ ...pricingPolicy, cityTaxPerNight: Number(e.target.value) })}
                    className="input-luxury text-xs w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Long Stay Minimum Nights
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={pricingPolicy.longStayDiscountDays}
                    onChange={e => setPricingPolicy({ ...pricingPolicy, longStayDiscountDays: Number(e.target.value) })}
                    className="input-luxury text-xs w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Long Stay Discount (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={pricingPolicy.longStayDiscountPercent}
                    onChange={e => setPricingPolicy({ ...pricingPolicy, longStayDiscountPercent: Number(e.target.value) })}
                    className="input-luxury text-xs w-full font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="gold"
                  type="submit"
                  icon={Save}
                  className="w-full"
                >
                  Save Global Pricing Policies
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* Tab: Price History */}
      {activeTab === 'history' && (
        <Card variant="luxury" className="p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <span>Audited Price History & Tariff Adjustments</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 dark:border-white/10 text-charcoal-muted font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Suite Number</th>
                  <th className="py-3 px-4">Previous Tariff</th>
                  <th className="py-3 px-4">New Tariff</th>
                  <th className="py-3 px-4">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {priceHistory.map(entry => (
                  <tr key={entry.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono">{entry.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-accent">Suite {entry.roomNumber}</td>
                    <td className="py-3 px-4 font-serif text-charcoal-muted line-through">${entry.oldRate?.toLocaleString()}</td>
                    <td className="py-3 px-4 font-serif font-bold text-emerald-600 dark:text-emerald-400">${entry.newRate?.toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium">{entry.changedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Room Pricing Modal */}
      {modalOpen && editingPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury w-full max-w-lg p-6 sm:p-7 rounded-2xl border border-accent/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Update Tariff: Suite {editingPricing.roomNumber}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePricing} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-primary dark:text-white block">{editingPricing.name}</span>
                  <span className="text-[11px] text-charcoal-muted font-mono">{editingPricing.type} • Floor {editingPricing.floor}</span>
                </div>
                <StatusBadge status={editingPricing.status} size="sm" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Standard Nightly Rate ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={formData.pricePerNight}
                  onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })}
                  className="input-luxury text-sm font-bold font-mono text-accent w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <span className="text-[10px] text-charcoal-muted uppercase font-mono block">Computed Weekend (+15%)</span>
                  <span className="font-serif font-bold text-accent text-sm">
                    ${Math.round(Number(formData.pricePerNight) * (1 + pricingPolicy.weekendMultiplier / 100)).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <span className="text-[10px] text-charcoal-muted uppercase font-mono block">Computed Peak (+25%)</span>
                  <span className="font-serif font-bold text-emerald-500 text-sm">
                    ${Math.round(Number(formData.pricePerNight) * (1 + pricingPolicy.highSeasonMultiplier / 100)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Effective From Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.effectiveDate}
                  onChange={e => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="input-luxury text-xs w-full font-mono"
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
                  Enforce Rate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPricingPage;

