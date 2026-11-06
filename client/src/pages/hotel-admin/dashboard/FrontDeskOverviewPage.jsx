import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  ConciergeBell,
  CheckCircle,
  LogOut,
  BedDouble,
  Clock,
  Sparkles,
  Crown,
  UserCheck,
  Plus,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const FrontDeskOverviewPage = () => {
  const navigate = useNavigate();
  const { bookings = [], rooms = [], guests = [], checkInGuest, checkOutGuest } = useERP();
  const { showToast } = useToast();

  // Metric Computations
  const expectedArrivals = bookings.filter(b => b.status === 'confirmed');
  const checkedInGuests = bookings.filter(b => b.status === 'checked_in');
  const checkedOutGuests = bookings.filter(b => b.status === 'checked_out');
  const availableRoomsList = rooms.filter(r => r.status === 'available');

  const pendingCheckInsCount = expectedArrivals.length;
  const pendingCheckOutsCount = checkedInGuests.length;

  // VIP guests active today
  const vipStays = bookings.filter(b => {
    const isVipGuest = guests.some(
      g => g.id === b.guestId && (g.vipTier === 'VIP' || g.vipTier === 'Diamond' || g.vipTier === 'Elite')
    );
    return (isVipGuest || b.vipStatus || (b.roomType && b.roomType.toLowerCase().includes('presidential'))) &&
      (b.status === 'confirmed' || b.status === 'checked_in');
  });

  const handleQuickCheckIn = (bkg) => {
    const res = checkInGuest(bkg.id);
    if (res?.success) {
      showToast(
        'Check-In Successful',
        `Suite ${bkg.roomNumber} keycard issued to ${bkg.guestName}. Butler dispatched.`,
        'success'
      );
    } else {
      showToast('Check-In Failed', res?.message || 'Unable to complete check-in', 'error');
    }
  };

  const handleQuickCheckOut = (bkg) => {
    const res = checkOutGuest(bkg.id);
    if (res?.success) {
      showToast(
        'Check-Out Complete',
        `Folio settled and Suite ${bkg.roomNumber} queued for express sanitization.`,
        'info'
      );
    } else {
      showToast('Check-Out Failed', res?.message || 'Unable to complete check-out', 'error');
    }
  };

  // Recent operational activity list
  const recentActivities = [
    {
      id: 'act-1',
      time: '10:24 AM',
      type: 'Check-In',
      description: 'Sir Arthur Sterling checked into Royal Penthouse Suite 801',
      badgeColor: 'emerald',
    },
    {
      id: 'act-2',
      time: '09:45 AM',
      type: 'Folio Settlement',
      description: 'Baroness Charlotte von Berg finalized express departure folio ($4,250)',
      badgeColor: 'amber',
    },
    {
      id: 'act-3',
      time: '09:12 AM',
      type: 'VIP Request',
      description: 'Chilled Krug Clos d’Ambonnay champagne dispatched to Suite 502',
      badgeColor: 'purple',
    },
    {
      id: 'act-4',
      time: '08:30 AM',
      type: 'Chamber Turnover',
      description: 'Suite 404 inspected & verified pristine by Housekeeping Directorate',
      badgeColor: 'blue',
    },
  ];

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation Ref',
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
            {item.vipStatus && <Crown className="w-3.5 h-3.5 text-accent" />}
          </p>
          <p className="text-[11px] text-charcoal-muted">{item.guestPhone || item.guestEmail}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Assigned Chamber',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-primary dark:text-white">
          Chamber {item.roomNumber} <span className="text-xs font-normal text-charcoal-muted">({item.roomType})</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Front Desk Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Operations',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.status === 'confirmed' && (
            <button
              onClick={() => handleQuickCheckIn(item)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Check-In
            </button>
          )}
          {item.status === 'checked_in' && (
            <button
              onClick={() => handleQuickCheckOut(item)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Check-Out
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Front Desk Overview"
        subtitle="Operational command center: live turnover status, pending chamber arrivals, departures & VIP concierge"
        badge="Front Desk Command"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CheckCircle}
              onClick={() => navigate('/hotel-admin/dashboard/arrivals')}
            >
              Today's Arrivals
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Walk-In Stay
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Expected Arrivals"
          value={String(expectedArrivals.length)}
          subtitle={`${pendingCheckInsCount} Pending Registration`}
          icon={CheckCircle}
          isPositive={true}
        />
        <StatCard
          title="Today's Departures"
          value={String(checkedInGuests.length)}
          subtitle={`${checkedOutGuests.length} Already Checked-Out`}
          icon={LogOut}
          isPositive={false}
        />
        <StatCard
          title="Available Chambers"
          value={String(availableRoomsList.length)}
          subtitle={`${rooms.length} Total Suites in Portfolio`}
          icon={BedDouble}
          isPositive={true}
        />
        <StatCard
          title="VIP Sovereign Patrons"
          value={String(vipStays.length)}
          subtitle="White-Glove Butler Retinue"
          icon={Crown}
          isPositive={true}
        />
      </div>

      {/* VIP Overview and Operational Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIP Stays Banner Card */}
        <div className="card-luxury-3d p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-accent" /> VIP Sovereign Patrons
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-bold">
                {vipStays.length} In-House / Expected
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mb-4">
              Priority patrons with active security clearance, special dietary protocols, and designated royal butler retinues.
            </p>

            <div className="space-y-3">
              {vipStays.slice(0, 3).map((vip) => (
                <div
                  key={vip.id}
                  className="p-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/50 dark:border-white/5 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-xs text-primary dark:text-white flex items-center gap-1.5">
                      {vip.guestName}
                      <Sparkles className="w-3 h-3 text-accent" />
                    </p>
                    <p className="text-[11px] text-charcoal-muted">Suite {vip.roomNumber} • {vip.roomType}</p>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-mono rounded-lg bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    {vip.status === 'checked_in' ? 'Resident' : 'Expected'}
                  </span>
                </div>
              ))}
              {vipStays.length === 0 && (
                <p className="text-xs text-charcoal-muted italic py-4 text-center">
                  No VIP arrivals currently scheduled for today.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/60 dark:border-white/10 flex justify-between items-center text-xs">
            <span className="text-charcoal-muted font-medium">Diplomatic Escort Ready</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2 card-luxury-3d p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" /> Recent Front Desk Operations
            </h3>
            <span className="text-[11px] text-accent font-mono">Live Timeline</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-ivory/40 dark:bg-primary-900/30 border border-border/40 dark:border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <div>
                    <p className="text-xs font-semibold text-primary dark:text-white">{act.description}</p>
                    <p className="text-[10px] text-charcoal-muted font-mono">{act.time} • {act.type}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-accent font-mono">Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Front Desk Active Reservations Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal dark:text-white flex items-center gap-2">
              <ConciergeBell className="w-5 h-5 text-accent" /> Active Front Desk Stays & Queue
            </h3>
            <p className="text-xs text-charcoal-muted">
              Live reservations requiring reception processing, guest check-in, or folio check-out.
            </p>
          </div>
        </div>

        <DataTable
          data={bookings.slice(0, 8)}
          columns={columns}
          keyExtractor={(item) => item.id}
          pageSize={6}
          emptyMessage="No pending front desk reservations found."
        />
      </div>
    </div>
  );
};

export default FrontDeskOverviewPage;

