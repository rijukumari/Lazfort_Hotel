import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog, Modal } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard } from '../../components/ui/StatCard';
import {
  Users,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Crown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Sparkles,
  CreditCard,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const GuestDirectoryPage = () => {
  const navigate = useNavigate();
  const { guests = [], deleteGuest } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [deleteGuestId, setDeleteGuestId] = useState(null);
  const [selectedGuestProfile, setSelectedGuestProfile] = useState(null);

  // Extract unique nationalities for dropdown
  const nationalities = useMemo(() => {
    const set = new Set();
    guests.forEach((g) => {
      if (g.nationality) set.add(g.nationality);
    });
    return Array.from(set);
  }, [guests]);

  // Filtered guest directory
  const filteredGuests = useMemo(() => {
    return (guests || []).filter((guest) => {
      const matchSearch =
        !searchQuery ||
        guest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone?.includes(searchQuery) ||
        guest.idNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchNationality =
        nationalityFilter === 'all' ||
        guest.nationality?.toLowerCase() === nationalityFilter.toLowerCase();

      const matchTier =
        tierFilter === 'all' ||
        guest.vipTier?.toLowerCase() === tierFilter.toLowerCase();

      return matchSearch && matchNationality && matchTier;
    });
  }, [guests, searchQuery, nationalityFilter, tierFilter]);

  const handleConfirmDelete = () => {
    if (!deleteGuestId) return;
    deleteGuest(deleteGuestId);
    setDeleteGuestId(null);
    showToast('Patron Profile Removed', 'Guest record has been archived from directory.', 'success');
  };

  const columns = [
    {
      key: 'name',
      header: 'Patron Identity',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={
              item.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            }
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30 shrink-0"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight font-serif flex items-center gap-1.5">
              {item.name}
              {item.vipTier !== 'Standard' && <Crown className="w-3.5 h-3.5 text-accent" />}
            </p>
            <p className="text-[11px] text-charcoal-muted font-mono">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Mobile',
      sortable: true,
      render: (item) => (
        <span className="text-xs font-mono text-charcoal dark:text-gray-300 flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-accent" /> {item.phone || '+377 98 06 20 00'}
        </span>
      ),
    },
    {
      key: 'nationality',
      header: 'Nationality',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-charcoal dark:text-gray-300 flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-accent" /> {item.nationality || 'Monaco'}
        </span>
      ),
    },
    {
      key: 'vipTier',
      header: 'Sovereign Category',
      sortable: true,
      render: (item) => <StatusBadge status={item.vipTier || 'Standard'} size="sm" />,
    },
    {
      key: 'registrationDate',
      header: 'Enrolled Date',
      sortable: true,
      render: (item) => (
        <span className="text-xs font-mono text-charcoal-muted">
          {item.registrationDate || item.registeredAt || '2026-08-14'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Directory Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedGuestProfile(item)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-primary-800 text-charcoal-muted hover:text-accent transition-colors"
            title="View Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/guests/edit/${item.id}`)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-primary-800 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Guest Profile"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteGuestId(item.id)}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-charcoal-muted hover:text-rose-500 transition-colors"
            title="Delete Guest Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Guest Directory"
        subtitle="Centralized guest ledger: master patron profiles, contact dossiers, sovereign VIP tiers, and stay analytics"
        badge="Guest Directory"
        actions={
          <Button
            variant="gold"
            icon={UserPlus}
            onClick={() => navigate('/receptionist/guest-services/registration')}
          >
            Register New Guest
          </Button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Registered Patrons"
          value={String(guests.length)}
          subtitle="Enrolled in Lazfort Grand Palace ledger"
          icon={Users}
          isPositive={true}
        />
        <StatCard
          title="VIP Sovereign Members"
          value={String(guests.filter((g) => g.vipTier && g.vipTier !== 'Standard').length)}
          subtitle="Diplomatic, Diamond & Elite guests"
          icon={Crown}
          isPositive={true}
        />
        <StatCard
          title="Global Jurisdictions"
          value={String(nationalities.length)}
          subtitle="Distinct national origins represented"
          icon={Globe}
          isPositive={true}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Nationality Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-charcoal-muted flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-accent" /> Nationality:
            </span>
            <select
              value={nationalityFilter}
              onChange={(e) => setNationalityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Nationalities</option>
              {nationalities.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-charcoal-muted flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-accent" /> Category:
            </span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Categories</option>
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
              <option value="Elite">Elite</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guest Directory Data Table */}
      <DataTable
        data={filteredGuests}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No guest profiles found matching your filters."
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteGuestId)}
        title="Archive Guest Profile"
        message="Are you certain you wish to archive this guest record? Historical billing folios will be preserved in the general ledger."
        confirmText="Archive Guest"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteGuestId(null)}
      />

      {/* View Profile Details Modal */}
      {selectedGuestProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg card-luxury-3d p-6 sm:p-8 space-y-6 bg-white dark:bg-[#0c121c] border border-accent/30 shadow-2xl rounded-3xl">
            <button
              onClick={() => setSelectedGuestProfile(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-ivory dark:hover:bg-primary-900/40 text-charcoal-muted hover:text-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={
                  selectedGuestProfile.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                }
                alt={selectedGuestProfile.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-accent/40 shadow-gold"
              />
              <div>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                  {selectedGuestProfile.name}
                  {selectedGuestProfile.vipTier !== 'Standard' && (
                    <Crown className="w-4 h-4 text-accent" />
                  )}
                </h3>
                <p className="text-xs text-charcoal-muted">{selectedGuestProfile.email}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedGuestProfile.vipTier || 'Standard'} size="sm" />
                </div>
              </div>
            </div>

            <div className="border-t border-border/70 dark:border-white/10 pt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                    <Phone className="w-3 h-3 text-accent" /> Phone
                  </span>
                  <p className="font-mono font-semibold text-primary dark:text-gray-200 mt-0.5">
                    {selectedGuestProfile.phone || '+377 98 06 20 00'}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                    <Globe className="w-3 h-3 text-accent" /> Nationality
                  </span>
                  <p className="font-semibold text-primary dark:text-gray-200 mt-0.5">
                    {selectedGuestProfile.nationality || 'Monaco'}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-accent" /> Document ID
                  </span>
                  <p className="font-mono font-semibold text-primary dark:text-gray-200 mt-0.5">
                    {selectedGuestProfile.idNumber || 'MC-88190'}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent" /> Registered
                  </span>
                  <p className="font-mono font-semibold text-primary dark:text-gray-200 mt-0.5">
                    {selectedGuestProfile.registrationDate || '2026-08-14'}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" /> Residential Address
                </span>
                <p className="font-medium text-primary dark:text-gray-200 mt-0.5">
                  {selectedGuestProfile.address || 'Place du Casino, Monte-Carlo 98000, Monaco'}
                </p>
              </div>

              {selectedGuestProfile.preferences && (
                <div className="p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" /> Special Preferences
                  </span>
                  <p className="font-medium text-primary dark:text-gray-200 mt-0.5">
                    {Array.isArray(selectedGuestProfile.preferences)
                      ? selectedGuestProfile.preferences.join(' • ')
                      : String(selectedGuestProfile.preferences)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="gold" onClick={() => setSelectedGuestProfile(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDirectoryPage;

