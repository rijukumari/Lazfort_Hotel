import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge, Modal } from '../../../components/ui';
import {
  Calendar,
  CheckCircle,
  LogOut,
  Clock,
  DollarSign,
  AlertCircle,
  Sparkles,
  Crown,
  Users,
  KeyRound,
  FileText,
  ArrowRight,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const TodaysSummaryPage = () => {
  const navigate = useNavigate();
  const {
    bookings,
    rooms,
    folios = [],
    guests = [],
    cleaningTasks = [],
    checkInGuest,
    checkOutGuest,
    getTodayRevenue,
  } = useERP();
  const { showToast } = useToast();

  const todayStr = '2026-10-30';

  // 1. Arrivals (confirmed bookings scheduled for today or upcoming)
  const arrivals = bookings.filter(b => b.status === 'confirmed');

  // 2. Departures (checked_in bookings scheduled to depart today or active)
  const departures = bookings.filter(b => b.status === 'checked_in');

  // 3. Completed Check-ins
  const completedCheckIns = bookings.filter(b => b.status === 'checked_in');

  // 4. Completed Check-outs
  const completedCheckOuts = bookings.filter(b => b.status === 'checked_out');

  // 5. Pending reservations
  const pendingReservations = bookings.filter(b => b.status === 'pending');

  // 6. Revenue & Payments
  const todayRevenue = getTodayRevenue ? getTodayRevenue() : 48500;
  const pendingFolios = folios.filter(f => f.balanceDue > 0);
  const totalPendingPayments = pendingFolios.reduce((sum, f) => sum + f.balanceDue, 0);

  // 7. Today's VIPs
  const vipGuestsToday = guests.filter(g => {
    const isVip = g.vipTier && g.vipTier !== 'Standard' && g.vipTier !== 'None';
    const hasStay = bookings.some(b => b.guestId === g.id && (b.status === 'confirmed' || b.status === 'checked_in'));
    return isVip && hasStay;
  });

  // 8. Housekeeping
  const activeCleaning = cleaningTasks.filter(t => t.status === 'in_progress' || t.status === 'pending');

  const handleCheckIn = (id) => {
    const res = checkInGuest(id);
    if (res?.success) showToast('Arrival Processed', res.message, 'success');
  };

  const handleCheckOut = (id) => {
    const res = checkOutGuest(id);
    if (res?.success) showToast('Departure Processed', res.message, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Today's Operational Summary"
        description="Comprehensive daily briefing for 30 October 2026 — Expected arrivals, departures, VIP rosters, housekeeping queues, and cash collection ledger."
        badge="Daily Dispatch Briefing"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print Briefing
            </Button>
            <Button
              variant="gold"
              icon={Calendar}
              onClick={() => navigate('/hotel-admin/bookings/calendar')}
            >
              Master Calendar
            </Button>
          </div>
        }
      />

      {/* Today's High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Arrivals"
          value={`${arrivals.length} Expected`}
          change={`${completedCheckIns.length} Checked In`}
          isPositive={true}
          icon={CheckCircle}
          subtitle="Helipad & Chauffeur Greeting Ready"
        />
        <StatCard
          title="Today's Departures"
          value={`${departures.length} Scheduled`}
          change={`${completedCheckOuts.length} Settled & Departed`}
          isPositive={true}
          icon={LogOut}
          subtitle="Luggage Porter Standby"
        />
        <StatCard
          title="Today's Generated Revenue"
          value={`$${todayRevenue.toLocaleString()}`}
          change={`+$12.4k vs Daily Target`}
          isPositive={true}
          icon={DollarSign}
          subtitle="Accommodation & Michelin Dining"
        />
        <StatCard
          title="Pending Payments"
          value={`$${totalPendingPayments.toLocaleString()}`}
          change={`${pendingFolios.length} Open Guest Folios`}
          isPositive={totalPendingPayments === 0}
          icon={AlertCircle}
          subtitle="Pending Checkout Settlement"
        />
      </div>

      {/* Main Split: Arrivals / Departures & VIP Patrons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Arrivals Queue */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Arrivals Roster ({arrivals.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/bookings/confirmed')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              View Confirmed
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {arrivals.length > 0 ? (
              arrivals.map(b => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-border/70 dark:border-white/10 bg-white/60 dark:bg-primary-900/40 hover:border-accent/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-primary dark:text-white">{b.guestName}</span>
                      <span className="font-mono text-[10px] text-accent font-bold">Suite {b.roomNumber}</span>
                    </div>
                    <p className="text-[11px] text-charcoal-muted">{b.roomType} • {b.nights} Nights</p>
                    <p className="text-[10px] text-charcoal-muted font-mono">ETA: 14:00 • Ref: {b.bookingCode}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCheckIn(b.id)}
                    className="text-[11px] h-8 px-2.5 shrink-0"
                  >
                    Check In
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-charcoal-muted">All arrivals for today completed.</p>
            )}
          </div>
        </div>

        {/* Today's Departures Queue */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-indigo-500" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Departures Queue ({departures.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/bookings/checked-in')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              View In-House
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {departures.length > 0 ? (
              departures.map(b => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-border/70 dark:border-white/10 bg-white/60 dark:bg-primary-900/40 hover:border-accent/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-primary dark:text-white">{b.guestName}</span>
                      <span className="font-mono text-[10px] text-indigo-500 font-bold">Suite {b.roomNumber}</span>
                    </div>
                    <p className="text-[11px] text-charcoal-muted">{b.nights} Nights Stayed • Total: ${b.totalAmount}</p>
                    <p className="text-[10px] text-charcoal-muted font-mono">Folio: Open • Departure 12:00</p>
                  </div>
                  <Button
                    size="sm"
                    variant="gold"
                    onClick={() => handleCheckOut(b.id)}
                    className="text-[11px] h-8 px-2.5 shrink-0"
                  >
                    Check Out
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-charcoal-muted">No pending departures remaining.</p>
            )}
          </div>
        </div>

        {/* Today's VIP Sovereign Patrons */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                VIP Patrons On-Site
              </h3>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/guests/vip')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              VIP Registry
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {vipGuestsToday.length > 0 ? (
              vipGuestsToday.map(g => (
                <div
                  key={g.id}
                  onClick={() => navigate(`/hotel-admin/guests/${g.id}`)}
                  className="p-3.5 rounded-xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-serif font-bold text-xs text-primary dark:text-white">{g.name}</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-accent text-primary dark:text-white">
                      {g.vipTier}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">{g.nationality} • {g.totalStays || 12} Stays Lifetime</p>
                  <p className="text-[10px] text-accent font-mono">Concierge: Dom Pérignon on ice, late checkout</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-center space-y-1">
                <Crown className="w-6 h-6 text-accent mx-auto" />
                <p className="font-semibold text-xs text-primary dark:text-white">Diamond & Platinum Patrons</p>
                <p className="text-[11px] text-charcoal-muted">Private transfers assigned for evening arrivals.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Housekeeping Tasks & Daily Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Housekeeping Shifts & Tasks */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Housekeeping Turnover Board
              </h3>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/housekeeping')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              Turnover Queue
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/60 dark:bg-primary-900/40 border border-border/60 dark:border-white/10">
              <span className="font-mono text-xl font-bold text-accent">{rooms.filter(r => r.status === 'available').length}</span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Clean Suites</p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-primary-900/40 border border-border/60 dark:border-white/10">
              <span className="font-mono text-xl font-bold text-amber-500">{rooms.filter(r => r.status === 'cleaning').length || 2}</span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">In Progress</p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-primary-900/40 border border-border/60 dark:border-white/10">
              <span className="font-mono text-xl font-bold text-rose-500">{rooms.filter(r => r.status === 'maintenance').length || 1}</span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Maintenance</p>
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-primary-900/40 border border-border/60 dark:border-white/10">
              <span className="font-mono text-xl font-bold text-emerald-500">100%</span>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Inspected</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-charcoal-light/10 dark:bg-white/5 text-xs text-charcoal-muted space-y-1">
            <p className="font-bold text-primary dark:text-white">Morning Shift Lead: Monique De La Tour</p>
            <p>14 Floor Attendants on Duty • Presidential Suites pre-allocated with white orchid arrangements.</p>
          </div>
        </div>

        {/* Daily Operations Briefing Notes */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Daily Operations Directives
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-accent">Shift: Morning & Afternoon</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
              <p className="font-bold text-primary dark:text-white">1. Monaco Yacht Show Delegations</p>
              <p className="text-charcoal-muted mt-0.5">Four yachts arriving at Port Hercule; private shuttle runs on schedule every 15 minutes.</p>
            </div>
            <div className="p-3 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
              <p className="font-bold text-primary dark:text-white">2. Le Louis XV Gala Dinner</p>
              <p className="text-charcoal-muted mt-0.5">Fully reserved at 19:30. 42 guest folios cross-verified with Front Desk ledger.</p>
            </div>
            <div className="p-3 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
              <p className="font-bold text-primary dark:text-white">3. Pending Reservation Approvals</p>
              <p className="text-charcoal-muted mt-0.5">{pendingReservations.length} pending online booking requests awaiting General Manager confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysSummaryPage;

