import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Crown,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Award,
  DollarSign,
  Compass,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const VIPGuestsPage = () => {
  const navigate = useNavigate();
  const { guests, deleteGuest } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [deleteGuestId, setDeleteGuestId] = useState(null);

  // VIP guests only (Diamond, Platinum, Gold, Silver, Sovereign)
  const vipGuests = useMemo(() => {
    return (guests || []).filter(g => {
      const tier = g.vipTier?.toLowerCase() || '';
      return tier !== 'standard' && tier !== 'none' && tier !== 'regular';
    });
  }, [guests]);

  const filteredVIPs = useMemo(() => {
    return vipGuests.filter(g => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.idNumber && g.idNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        g.nationality?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = selectedTier === 'all' || g.vipTier?.toLowerCase() === selectedTier.toLowerCase();

      return matchesSearch && matchesTier;
    });
  }, [vipGuests, searchQuery, selectedTier]);

  const diamondCount = vipGuests.filter(g => g.vipTier === 'Diamond').length;
  const platinumCount = vipGuests.filter(g => g.vipTier === 'Platinum').length;
  const goldCount = vipGuests.filter(g => g.vipTier === 'Gold').length;
  const totalVIPSpend = vipGuests.reduce((sum, g) => sum + (g.totalSpent || 0), 0);

  const handleConfirmDelete = () => {
    if (!deleteGuestId) return;
    deleteGuest(deleteGuestId);
    setDeleteGuestId(null);
    showToast('VIP Guest Removed', 'VIP dossier removed from privileged roster.', 'info');
  };

  const columns = [
    {
      key: 'name',
      header: 'VIP Patron & Passport',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={item.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-accent shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-accent shrink-0" />
              <p className="font-semibold text-primary dark:text-white font-serif leading-tight">{item.name}</p>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
              <span className="font-mono text-accent font-bold">{item.idNumber || item.id}</span>
              <span>•</span>
              <span>{item.nationality}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'vipTier',
      header: 'Sovereign VIP Tier',
      sortable: true,
      render: item => <StatusBadge status={item.vipTier} size="sm" />,
    },
    {
      key: 'loyaltyPoints',
      header: 'Loyalty Tokens',
      sortable: true,
      render: item => (
        <div className="text-xs">
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {item.loyaltyPoints?.toLocaleString()} pts
          </span>
          <span className="text-[10px] text-charcoal-muted block">Rewards Balance</span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Lifetime Spend',
      sortable: true,
      render: item => (
        <div>
          <span className="font-serif font-bold text-accent text-sm">
            ${item.totalSpent?.toLocaleString()}
          </span>
          <span className="text-[10px] text-charcoal-muted block">Direct Gross Folio</span>
        </div>
      ),
    },
    {
      key: 'totalStays',
      header: 'Completed Visits',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs text-primary dark:text-white font-semibold">
          {item.totalStays} Stays
        </span>
      ),
    },
    {
      key: 'preferences',
      header: 'Concierge Privileges',
      render: item => (
        <div className="max-w-[200px]">
          {item.preferences && item.preferences.length > 0 ? (
            <span className="text-xs text-charcoal dark:text-gray-300 line-clamp-1">
              {item.preferences.slice(0, 2).join(', ')}
            </span>
          ) : (
            <span className="text-xs text-charcoal-muted italic">Butler assigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/guests/${item.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors flex items-center gap-1 text-xs"
            title="View Full VIP Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dossier</span>
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/guests/edit/${item.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors flex items-center gap-1 text-xs"
            title="Edit VIP Membership & Privileges"
          >
            <Edit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => setDeleteGuestId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Remove from VIP Registry"
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
        title="VIP Sovereign Patron Roster"
        description="High-net-worth clientele, royal delegates, and distinguished loyalty members with bespoke white-glove concierge preferences."
        badge={`${vipGuests.length} VIP Patrons`}
        actions={
          <Button
            variant="gold"
            icon={UserPlus}
            onClick={() => navigate('/hotel-admin/guests/add')}
          >
            Enroll VIP Patron
          </Button>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Diamond Tier Patrons"
          value={diamondCount}
          subtitle="highest privilege level"
          icon={<Crown className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Platinum Tier Patrons"
          value={platinumCount}
          subtitle="frequent elite residents"
          icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Gold Tier Patrons"
          value={goldCount}
          subtitle="distinguished guests"
          icon={<Award className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Consolidated VIP Spending"
          value={`$${(totalVIPSpend / 1000).toFixed(0)}k`}
          subtitle="aggregate patron revenue"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Search & Tier Filter */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search VIP patron by name, nationality, or passport..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[150px]"
            >
              <option value="all">All VIP Tiers</option>
              <option value="Diamond">Diamond Tier Only</option>
              <option value="Platinum">Platinum Tier Only</option>
              <option value="Gold">Gold Tier Only</option>
              <option value="Silver">Silver Tier Only</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredVIPs}
          keyExtractor={item => item.id}
          pageSize={8}
          emptyMessage="No VIP patrons match the selected tier or search."
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteGuestId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteGuestId(null)}
          onConfirm={handleConfirmDelete}
          title="Remove VIP Patron Record?"
          message="Are you sure you wish to remove this guest from the VIP Sovereign roster? Their tier privileges and loyalty balances will be cleared."
          confirmText="Confirm Removal"
          variant="danger"
        />
      )}
    </div>
  );
};

export default VIPGuestsPage;

