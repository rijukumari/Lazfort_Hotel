import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, SearchBar, Select, StatusBadge, ConfirmDialog, Button } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/data-display/DataTable';
import { hotelApi } from '../../services/hotelApi';
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MapPin,
  RefreshCw,
  History,
  Key,
} from 'lucide-react';

export const HotelStatusPage = () => {
  const { hotels, updateHotel } = useERP();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // Status Change Confirmation Dialog State
  const [pendingChange, setPendingChange] = useState(null);

  // Status Change Audit History (dynamic state)
  const [statusHistory, setStatusHistory] = useState([]);

  // Trigger dedicated Hotel Status API on mount
  useEffect(() => {
    let isMounted = true;
    hotelApi.getHotelStatuses().catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Filtered Hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter(h => {
      const matchSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || h.status === statusFilter;
      const matchTier = tierFilter === 'all' || h.subscriptionPlan === tierFilter;
      return matchSearch && matchStatus && matchTier;
    });
  }, [hotels, searchTerm, statusFilter, tierFilter]);

  // Status Counts
  const activeCount = hotels.filter(h => h.status === 'active').length;
  const pendingCount = hotels.filter(h => h.status === 'pending_approval').length;
  const suspendedCount = hotels.filter(h => h.status === 'suspended').length;
  const totalCount = hotels.length || 1;

  const activePct = Math.round((activeCount / totalCount) * 100);
  const pendingPct = Math.round((pendingCount / totalCount) * 100);
  const suspendedPct = Math.round((suspendedCount / totalCount) * 100);

  // Confirm Status Change
  const handleConfirmStatusChange = () => {
    if (!pendingChange) return;
    const { hotel, newStatus } = pendingChange;

    updateHotel(hotel.id, { status: newStatus });

    const newRecord = {
      id: `sh-${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      previousStatus: hotel.status,
      newStatus,
      changedBy: 'Super Admin Directorate',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason: `Operational state changed from ${hotel.status} to ${newStatus} via Control Desk.`,
    };

    setStatusHistory(prev => [newRecord, ...prev]);

    showToast(
      'Operational Status Updated',
      `${hotel.name} status updated to ${newStatus.toUpperCase()}. Telemetry dispatched.`,
      'success'
    );
    setPendingChange(null);
  };

  const columns = [
    {
      key: 'name',
      header: 'Hotel Property',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-2.5">
          <img
            src={item.image}
            alt={item.name}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-accent/30 shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-primary dark:text-white font-serif text-xs truncate max-w-[170px]">{item.name}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-charcoal-muted truncate">
              <span className="font-mono text-accent font-bold uppercase">{item.id}</span>
              <span>•</span>
              <span className="truncate">{item.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'subscriptionPlan',
      header: 'Plan Tier',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => (
        <div className="whitespace-nowrap">
          <StatusBadge status={item.subscriptionPlan} size="sm" />
          <span className="text-[10px] text-charcoal-muted block mt-0.5 font-mono">
            {item.totalRooms} Suites
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <StatusBadge status={item.status} size="sm" />
          <span className="text-[10px] font-mono text-charcoal-muted">
            {item.status === 'active' ? 'Online' : item.status === 'pending_approval' ? 'In Review' : 'Halted'}
          </span>
        </div>
      ),
    },
    {
      key: 'occupancyRate',
      header: 'Live Telemetry',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => {
        const health = item.status === 'active' ? 'Optimal (99.8%)' : item.status === 'pending_approval' ? 'Auditing' : 'Offline';
        const color = item.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : item.status === 'pending_approval' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
        return (
          <div className="whitespace-nowrap">
            <span className={`text-[11px] font-semibold ${color} flex items-center gap-1`}>
              <Activity className="w-3 h-3 animate-pulse" />
              {health}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono block">
              Occ: {item.occupancyRate}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Last Audit',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => (
        <span className="font-mono text-[11px] text-charcoal-muted whitespace-nowrap">
          {item.createdAt || '2026-10-28'}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Action / Status',
      className: 'whitespace-nowrap text-right',
      render: item => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <div className="relative">
            <select
              value={item.status}
              onChange={e => {
                const val = e.target.value;
                if (val !== item.status) {
                  setPendingChange({ hotel: item, newStatus: val });
                }
              }}
              className={`pl-2.5 pr-6 py-1 text-[11px] rounded-lg font-bold border transition-all cursor-pointer appearance-none shadow-sm focus:outline-none focus:ring-1 focus:ring-accent ${
                item.status === 'active'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                  : item.status === 'pending_approval'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25'
              }`}
            >
              <option value="active" className="bg-white dark:bg-[#101722] text-emerald-600 dark:text-emerald-400 font-semibold">Active</option>
              <option value="pending_approval" className="bg-white dark:bg-[#101722] text-amber-600 dark:text-amber-400 font-semibold">Pending</option>
              <option value="suspended" className="bg-white dark:bg-[#101722] text-rose-600 dark:text-rose-400 font-semibold">Suspended</option>
            </select>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => navigate(`/super-admin/hotels/details?id=${item.id}`)}
            className="p-1 rounded-lg border border-border/80 dark:border-white/10 text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-primary-800 transition-colors shrink-0"
            title="Inspect Hotel Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Hotel Operational Status & Telemetry"
        description="Monitor real-time operational health, platform clearance states, and compliance status across all registered resorts."
        badge={`${hotels.length} Estates Monitored`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={() => showToast('Telemetry Refreshed', 'Real-time telemetry pulse synchronized across all properties.', 'info')}
            >
              Sync Telemetry
            </Button>
            <Button
              variant="gold"
              onClick={() => navigate('/super-admin/hotels/add')}
            >
              Onboard Property
            </Button>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Estates"
          value={activeCount}
          trend={`${activePct}%`}
          subtitle="Full commercial platform clearance"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Review"
          value={pendingCount}
          trend={`${pendingPct}%`}
          subtitle="Pre-commissioning documents audit"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Suspended Estates"
          value={suspendedCount}
          trend={`${suspendedPct}%`}
          trendType="down"
          subtitle="Halted due to compliance audit"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Total Luxury Keys"
          value={hotels.reduce((acc, h) => acc + (h.totalRooms || 0), 0)}
          subtitle={`Across ${hotels.length} sovereign properties`}
          icon={Key}
          color="gold"
        />
      </div>

      {/* Distribution Progress Bar */}
      <div className="card-luxury p-5 rounded-3xl border border-border/80 dark:border-accent/25 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-serif font-bold text-primary dark:text-white">
            Operational Clearance Distribution
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active ({activePct}%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending ({pendingPct}%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Suspended ({suspendedPct}%)
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200 dark:bg-white/10 p-0.5">
          <div
            style={{ width: `${activePct}%` }}
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
          />
          <div
            style={{ width: `${pendingPct}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
          />
          <div
            style={{ width: `${suspendedPct}%` }}
            className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card-luxury p-5 rounded-3xl border border-border/80 dark:border-accent/25 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <SearchBar
              placeholder="Search by hotel name, location, or Property ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>

          <div className="md:col-span-3">
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Operational Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending_approval">Pending Approval Only</option>
              <option value="suspended">Suspended Only</option>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
            >
              <option value="all">All Subscription Tiers</option>
              <option value="Palace Enterprise">Palace Enterprise</option>
              <option value="Grand Luxury">Grand Luxury</option>
              <option value="Boutique Elite">Boutique Elite</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredHotels}
        columns={columns}
        keyExtractor={item => item.id}
        showSearch={false}
        pageSize={8}
      />

      {/* Audit History */}
      <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Status Telemetry & Change Audit History
            </h3>
          </div>
          <span className="font-mono text-xs text-charcoal-muted">
            {statusHistory.length} Audit Entries
          </span>
        </div>

        <div className="divide-y divide-border/60 dark:divide-white/5">
          {statusHistory.map(rec => (
            <div key={rec.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-primary dark:text-white">{rec.hotelName}</span>
                  <span className="font-mono text-[10px] text-accent uppercase">({rec.hotelId})</span>
                  <span className="text-charcoal-muted text-[11px]">→</span>
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    {rec.newStatus}
                  </span>
                </div>
                <p className="text-charcoal-muted text-[11px]">{rec.reason}</p>
              </div>

              <div className="flex items-center gap-4 text-charcoal-muted text-[11px] shrink-0 font-mono">
                <span>{rec.changedBy}</span>
                <span>{rec.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {pendingChange && (
        <ConfirmDialog
          isOpen={true}
          title="Confirm Operational Status Modification"
          message={`Are you sure you want to transition ${pendingChange.hotel.name} to "${pendingChange.newStatus.toUpperCase()}" status? This triggers live platform telemetry updates.`}
          confirmText={`Transition to ${pendingChange.newStatus.toUpperCase()}`}
          confirmVariant={pendingChange.newStatus === 'active' ? 'gold' : pendingChange.newStatus === 'suspended' ? 'danger' : 'outline'}
          onConfirm={handleConfirmStatusChange}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  );
};

export default HotelStatusPage;

