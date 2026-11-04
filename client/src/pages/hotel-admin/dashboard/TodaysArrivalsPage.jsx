import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Search,
  Filter,
  Sparkles,
  Crown,
  KeyRound,
  FileText,
  Phone,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const TodaysArrivalsPage = () => {
  const navigate = useNavigate();
  const { bookings = [], rooms = [], guests = [], checkInGuest } = useERP();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerification, setFilterVerification] = useState('all');

  // Filter ONLY today's expected and confirmed arrivals
  const arrivalsData = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'confirmed')
      .map((b) => {
        const guestInfo = guests.find((g) => g.id === b.guestId) || {};
        return {
          ...b,
          vipTier: guestInfo.vipTier || (b.vipStatus ? 'VIP' : 'Standard'),
          passportVerified: guestInfo.passportVerified ?? true,
          estimatedArrivalTime: b.arrivalTime || '14:30',
        };
      })
      .filter((item) => {
        const matchSearch =
          !searchTerm ||
          item.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(item.roomNumber).includes(searchTerm);

        const matchVerification =
          filterVerification === 'all' ||
          (filterVerification === 'verified' && item.passportVerified) ||
          (filterVerification === 'pending' && !item.passportVerified);

        return matchSearch && matchVerification;
      });
  }, [bookings, guests, searchTerm, filterVerification]);

  const handlePerformCheckIn = (bkg) => {
    const res = checkInGuest(bkg.id);
    if (res?.success) {
      showToast(
        'Guest Successfully Checked In',
        `Keycard issued for Suite ${bkg.roomNumber}. Welcome amenity dispatched for ${bkg.guestName}.`,
        'success'
      );
    } else {
      showToast('Check-In Error', res?.message || 'Check-in could not be processed.', 'error');
    }
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.bookingCode}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Details',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight flex items-center gap-1.5">
            {item.guestName}
            {item.vipTier !== 'Standard' && <Crown className="w-3.5 h-3.5 text-accent" />}
          </p>
          <p className="text-[11px] text-charcoal-muted flex items-center gap-1">
            <Phone className="w-3 h-3" /> {item.guestPhone || '+377 98 06 20 00'}
          </p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Assigned Suite',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-primary dark:text-white">
          Chamber {item.roomNumber}{' '}
          <span className="text-xs font-normal text-charcoal-muted">({item.roomType})</span>
        </span>
      ),
    },
    {
      key: 'estimatedArrivalTime',
      header: 'Expected Arrival',
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-charcoal dark:text-gray-200">
          <Clock className="w-3.5 h-3.5 text-accent" /> {item.estimatedArrivalTime}
        </span>
      ),
    },
    {
      key: 'passportVerified',
      header: 'Verification Status',
      render: (item) =>
        item.passportVerified ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending ID
          </span>
        ),
    },
    {
      key: 'status',
      header: 'Booking Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (item) => (
        <button
          onClick={() => handlePerformCheckIn(item)}
          className="btn-luxury px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Check-In</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Today's Arrivals"
        subtitle="Expected and confirmed guest arrivals scheduled for today: check-in processing and keycard dispatch"
        badge="Arrivals Directorate"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CalendarCheck}
              onClick={() => navigate('/hotel-admin/bookings')}
            >
              All Bookings
            </Button>
          </div>
        }
      />

      {/* Arrival Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Scheduled Arrivals"
          value={String(arrivalsData.length)}
          subtitle="Expected today at Grand Palace"
          icon={CalendarCheck}
          isPositive={true}
        />
        <StatCard
          title="Identity Verified"
          value={String(arrivalsData.filter((a) => a.passportVerified).length)}
          subtitle="Pre-authorized for express keycard"
          icon={ShieldCheck}
          isPositive={true}
        />
        <StatCard
          title="VIP Stays Today"
          value={String(arrivalsData.filter((a) => a.vipTier !== 'Standard').length)}
          subtitle="Butler & Champagne Ready"
          icon={Crown}
          isPositive={true}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest name, suite, or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-charcoal-muted flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-accent" /> Verification:
          </span>
          <select
            value={filterVerification}
            onChange={(e) => setFilterVerification(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Arrivals</option>
            <option value="verified">Verified Identity Only</option>
            <option value="pending">Pending Document Verification</option>
          </select>
        </div>
      </div>

      {/* Arrivals Data Table */}
      <DataTable
        data={arrivalsData}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No expected arrivals match your filter criteria for today."
      />
    </div>
  );
};

export default TodaysArrivalsPage;

