import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Users,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  BedDouble,
  CreditCard,
  Crown,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const GuestDetailsListingPage = () => {
  const navigate = useNavigate();
  const { guests, bookings, deleteGuest } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [stayFilter, setStayFilter] = useState('all');
  const [deleteGuestId, setDeleteGuestId] = useState(null);

  // Map guests to their active/current booking details
  const guestsWithStayDetails = useMemo(() => {
    return (guests || []).map(guest => {
      // Find active or recent booking for this guest
      const activeBooking = (bookings || []).find(
        b =>
          (b.guestId === guest.id || b.guestEmail?.toLowerCase() === guest.email?.toLowerCase()) &&
          (b.status === 'checked_in' || b.status === 'confirmed')
      );

      const pastBooking = (bookings || []).find(
        b => b.guestId === guest.id || b.guestEmail?.toLowerCase() === guest.email?.toLowerCase()
      );

      const booking = activeBooking || pastBooking;

      let stayStatus = 'No Active Stay';
      if (activeBooking) {
        stayStatus = activeBooking.status === 'checked_in' ? 'In-House' : 'Confirmed Arrival';
      } else if (pastBooking) {
        stayStatus = 'Past Resident';
      }

      return {
        ...guest,
        assignedRoom: booking ? `Suite ${booking.roomNumber}` : 'Unassigned',
        roomType: booking?.roomType || 'N/A',
        stayStatus,
        bookingRef: booking?.bookingCode || '—',
        paymentStatus: booking?.paymentStatus || (guest.totalSpent > 0 ? 'paid' : 'unpaid'),
        totalStayAmount: booking?.totalAmount || guest.totalSpent,
      };
    });
  }, [guests, bookings]);

  // Filtering
  const filteredGuests = useMemo(() => {
    return guestsWithStayDetails.filter(g => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.idNumber && g.idNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        g.assignedRoom.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === 'all' || g.vipTier?.toLowerCase() === tierFilter.toLowerCase();
      const matchesStay = stayFilter === 'all' || g.stayStatus.toLowerCase() === stayFilter.toLowerCase();

      return matchesSearch && matchesTier && matchesStay;
    });
  }, [guestsWithStayDetails, searchQuery, tierFilter, stayFilter]);

  const inHouseCount = guestsWithStayDetails.filter(g => g.stayStatus === 'In-House').length;
  const diamondCount = guestsWithStayDetails.filter(g => g.vipTier === 'Diamond').length;
  const activeFoliosCount = guestsWithStayDetails.filter(g => g.stayStatus === 'In-House' || g.stayStatus === 'Confirmed Arrival').length;

  const handleConfirmDelete = () => {
    if (!deleteGuestId) return;
    deleteGuest(deleteGuestId);
    setDeleteGuestId(null);
    showToast('Guest Dossier Removed', 'Guest record successfully removed from hotel database.', 'success');
  };

  const columns = [
    {
      key: 'idNumber',
      header: 'Guest ID & Passport',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{item.idNumber || item.id}</span>
          <span className="text-[11px] text-charcoal-muted block">{item.nationality}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Guest Particulars',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30 shadow-sm shrink-0"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white font-serif leading-tight">{item.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-accent" />
                {item.email}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: item => (
        <span className="text-xs font-mono text-charcoal dark:text-gray-300 flex items-center gap-1">
          <Phone className="w-3 h-3 text-accent" />
          {item.phone || '—'}
        </span>
      ),
    },
    {
      key: 'assignedRoom',
      header: 'Room Allocation',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-xs text-primary dark:text-white flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-accent" />
            {item.assignedRoom}
          </span>
          <span className="text-[11px] text-charcoal-muted block">{item.roomType}</span>
        </div>
      ),
    },
    {
      key: 'stayStatus',
      header: 'Stay Status',
      sortable: true,
      render: item => {
        let badgeStyle = 'bg-charcoal/10 text-charcoal-muted';
        if (item.stayStatus === 'In-House') {
          badgeStyle = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
        } else if (item.stayStatus === 'Confirmed Arrival') {
          badgeStyle = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30';
        } else if (item.stayStatus === 'Past Resident') {
          badgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle}`}>
            {item.stayStatus}
          </span>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Folio Settlement',
      sortable: true,
      render: item => <StatusBadge status={item.paymentStatus} size="sm" />,
    },
    {
      key: 'vipTier',
      header: 'Tier',
      sortable: true,
      render: item => <StatusBadge status={item.vipTier} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/guests/${item.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Complete Guest Dossier"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/guests/edit/${item.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Guest Profile"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteGuestId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Remove Guest Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Guest Details & Resident Registry"
        description="Comprehensive guest registry with live room allocations, folio settlements, contact records, and VIP dossiers."
        badge={`${guests.length} Registered Guests`}
        actions={
          <Button
            variant="gold"
            icon={UserPlus}
            onClick={() => navigate('/hotel-admin/guests/add')}
          >
            Enroll New Guest
          </Button>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Total Registered Guests"
          value={guests.length}
          subtitle="lifetime hotel records"
          icon={<Users className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Currently In-House"
          value={inHouseCount}
          subtitle="resident in hotel suites"
          icon={<BedDouble className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Diamond Sovereign VIPs"
          value={diamondCount}
          subtitle="highest tier clientele"
          icon={<Crown className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Active Stay Folios"
          value={activeFoliosCount}
          subtitle="live billing ledgers"
          icon={<CreditCard className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Search & Filters */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, passport ID, or room..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All VIP Tiers</option>
              <option value="Diamond">Diamond Tier</option>
              <option value="Platinum">Platinum Tier</option>
              <option value="Gold">Gold Tier</option>
              <option value="Silver">Silver Tier</option>
            </select>

            <select
              value={stayFilter}
              onChange={e => setStayFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Stay States</option>
              <option value="In-House">In-House Only</option>
              <option value="Confirmed Arrival">Confirmed Arrivals</option>
              <option value="Past Resident">Past Residents</option>
              <option value="No Active Stay">No Active Stay</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredGuests}
          keyExtractor={item => item.id}
          pageSize={8}
          emptyMessage="No guest records match the current search or filters."
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteGuestId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteGuestId(null)}
          onConfirm={handleConfirmDelete}
          title="Remove Guest Profile?"
          message="Are you sure you wish to delete this guest record from the registry? Historical stay records and accounting references will be archived."
          confirmText="Confirm Removal"
          variant="danger"
        />
      )}
    </div>
  );
};

export default GuestDetailsListingPage;

