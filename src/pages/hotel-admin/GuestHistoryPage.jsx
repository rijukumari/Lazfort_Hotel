import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  History,
  FileText,
  Eye,
  Search,
  Filter,
  Calendar,
  BedDouble,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const GuestHistoryPage = () => {
  const navigate = useNavigate();
  const { bookings, guests } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Link bookings with guest profiles
  const stayHistory = useMemo(() => {
    return (bookings || []).map(b => {
      const guest = (guests || []).find(
        g => g.id === b.guestId || g.email?.toLowerCase() === b.guestEmail?.toLowerCase()
      );

      return {
        ...b,
        guestIdNumber: guest?.idNumber || b.guestId || '—',
        guestAvatar: guest?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        vipTier: guest?.vipTier || 'VIP Member',
        stayNights: b.nights || 1,
        totalFolio: b.totalAmount || 0,
        paidFolio: b.paidAmount || b.totalAmount || 0,
      };
    });
  }, [bookings, guests]);

  const filteredHistory = useMemo(() => {
    return stayHistory.filter(item => {
      const matchesSearch =
        item.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.guestIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stayHistory, searchQuery, statusFilter]);

  const totalSpentAllStays = stayHistory.reduce((sum, s) => sum + (s.totalFolio || 0), 0);
  const checkedOutCount = stayHistory.filter(s => s.status === 'checked_out').length;
  const inHouseCount = stayHistory.filter(s => s.status === 'checked_in').length;

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation Code',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{item.bookingCode}</span>
          <span className="text-[10px] text-charcoal-muted block">Created {item.createdAt || '2026-10-15'}</span>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Particulars',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.guestAvatar}
            alt={item.guestName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30 shadow-sm shrink-0"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white font-serif leading-tight">{item.guestName}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
              <span className="font-mono text-[11px] text-accent font-bold">{item.guestIdNumber}</span>
              <span>•</span>
              <StatusBadge status={item.vipTier} size="sm" />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Allocated Suite',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-xs text-primary dark:text-white flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-accent" />
            Suite {item.roomNumber}
          </span>
          <span className="text-[11px] text-charcoal-muted block">{item.roomType}</span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: 'Stay Window',
      sortable: true,
      render: item => (
        <div className="text-xs">
          <span className="font-mono text-primary dark:text-gray-200">
            {item.checkIn} &rarr; {item.checkOut}
          </span>
          <span className="text-[11px] text-charcoal-muted block font-medium">
            {item.stayNights} {item.stayNights === 1 ? 'Night' : 'Nights'}
          </span>
        </div>
      ),
    },
    {
      key: 'totalFolio',
      header: 'Total Folio Amount',
      sortable: true,
      render: item => (
        <div>
          <span className="font-serif font-bold text-accent text-sm">
            ${item.totalFolio?.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
            {item.paymentStatus === 'paid' ? 'Fully Settled' : 'Partial / Pending'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Stay Status',
      sortable: true,
      render: item => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors flex items-center gap-1 text-xs"
            title="View Official Invoice Folio"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Folio</span>
          </button>
          <button
            onClick={() => {
              const matchedGuest = guests.find(g => g.id === item.guestId || g.email === item.guestEmail);
              if (matchedGuest) {
                navigate(`/hotel-admin/guests/${matchedGuest.id}`);
              } else {
                navigate(`/hotel-admin/guests`);
              }
            }}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors flex items-center gap-1 text-xs"
            title="View Guest Profile"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dossier</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Guest Stay History & Audit Archive"
        description="Historical log of guest visits, suite allocations, ledger billing folios, and past checkout records."
        badge={`${stayHistory.length} Recorded Stays`}
        actions={
          <Button
            variant="outline"
            icon={History}
            onClick={() => navigate('/hotel-admin/bookings')}
          >
            All Bookings
          </Button>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Total Lifetime Stays"
          value={stayHistory.length}
          subtitle="recorded reservation stays"
          icon={<History className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Completed Stays"
          value={checkedOutCount}
          subtitle="archived departures"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Active In-House Stays"
          value={inHouseCount}
          subtitle="currently residing guests"
          icon={<BedDouble className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Historical Stay Billing"
          value={`$${(totalSpentAllStays / 1000).toFixed(0)}k`}
          subtitle="gross folio revenue"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Search & Filter */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by reservation code, guest name, ID, or suite..."
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
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Stay Statuses</option>
              <option value="checked_in">Checked In</option>
              <option value="confirmed">Confirmed (Upcoming)</option>
              <option value="checked_out">Checked Out (Completed)</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredHistory}
          keyExtractor={item => item.id}
          pageSize={8}
          emptyMessage="No guest stay history records match current filters."
        />
      </div>
    </div>
  );
};

export default GuestHistoryPage;

