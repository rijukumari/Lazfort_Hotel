import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { Modal } from '../../components/ui/Modal';
import {
  Calendar,
  Clock,
  Sparkles,
  Search,
  FileText,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  MapPin,
  BedDouble,
  CreditCard,
  Luggage,
  ShieldCheck,
  Compass,
  PhoneCall,
  Key
} from 'lucide-react';

export const UpcomingReservationsPage = () => {
  const navigate = useNavigate();
  const { bookings, rooms, cancelBooking } = useERP();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  // Cancellation modal states
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule change / Travel plans altered');
  const [isCancelling, setIsCancelling] = useState(false);

  // Filter bookings for this customer - ONLY confirmed and pending future reservations
  const upcomingReservations = useMemo(() => {
    return (bookings || [])
      .filter(b => {
        // Customer scoping
        if (isAuthenticated && user && user.role === 'customer') {
          const matchEmail = b.guestEmail?.toLowerCase() === user.email?.toLowerCase();
          const matchName = b.guestName?.toLowerCase() === user.name?.toLowerCase();
          const matchId = b.guestId === user.id;
          if (!matchEmail && !matchName && !matchId) return false;
        }

        // Only confirmed and pending status
        const isUpcomingStatus = b.status === 'confirmed' || b.status === 'pending';
        if (!isUpcomingStatus) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          return (
            b.bookingCode?.toLowerCase().includes(q) ||
            b.roomNumber?.toString().includes(q) ||
            b.roomType?.toLowerCase().includes(q) ||
            b.guestName?.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
  }, [bookings, user, isAuthenticated, searchQuery]);

  // Helper: Calculate days remaining until check-in
  const getDaysUntilArrival = (checkInDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const arrivalDate = new Date(checkInDateStr);
    arrivalDate.setHours(0, 0, 0, 0);
    const diffTime = arrivalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleOpenCancelModal = (booking) => {
    setCancellingBooking(booking);
    setCancelReason('Schedule change / Travel plans altered');
  };

  const handleExecuteCancel = (e) => {
    e.preventDefault();
    if (!cancellingBooking) return;

    setIsCancelling(true);
    setTimeout(() => {
      const res = cancelBooking(cancellingBooking.id, cancelReason);
      setIsCancelling(false);
      setCancellingBooking(null);

      if (res && res.success) {
        showToast('Reservation Cancelled', res.message, 'success');
      } else {
        showToast('Cancellation Failed', res?.message || 'Error occurred', 'error');
      }
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Upcoming Reservations"
        description="Exclusive itinerary of your upcoming stays, arrival countdowns, check-in instructions, and suite preparation status."
        badge={`${upcomingReservations.length} Upcoming`}
        actions={
          <button
            type="button"
            onClick={() => navigate('/customer/discover/rooms')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Another Stay</span>
          </button>
        }
      />

      {/* Highlights & Upcoming Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Luggage className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-accent tracking-wider">
              Confirmed Itineraries
            </p>
            <h4 className="text-xl font-serif font-bold text-primary dark:text-white mt-0.5">
              {upcomingReservations.length} Active {upcomingReservations.length === 1 ? 'Stay' : 'Stays'}
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Awaiting your arrival in Monaco
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              Express Digital Key
            </p>
            <h4 className="text-xl font-serif font-bold text-primary dark:text-white mt-0.5">
              Pre-Registration
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Valid clearance on arrival day
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-accent tracking-wider">
              Palace Butler Service
            </p>
            <h4 className="text-xl font-serif font-bold text-primary dark:text-white mt-0.5">
              Complimentary
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Assigned 24/7 dedicated retinue
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search upcoming by Ref (e.g. AUR-1001) or Suite..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-ivory dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
          />
        </div>

        <div className="text-xs text-charcoal-muted dark:text-gray-400">
          Viewing schedule for:{' '}
          <strong className="text-primary dark:text-white font-mono">
            {isAuthenticated && user ? user.name : 'VIP Customer'}
          </strong>
        </div>
      </div>

      {/* Upcoming Reservations List */}
      {upcomingReservations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-surface-dark/60 border border-dashed border-border dark:border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-accent/15 border border-accent/30 text-accent mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-primary dark:text-white">
            No Upcoming Reservations
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            You do not currently have any future confirmed or pending stays scheduled at Lazfort Grand Palace.
            Reserve your suite now to enjoy white-glove hospitality in Monaco.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/customer/discover/rooms')}
              className="px-6 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Available Suites</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/customer/bookings')}
              className="px-6 py-2.5 rounded-2xl border border-border dark:border-white/15 bg-white/40 dark:bg-white/5 text-charcoal dark:text-gray-200 font-semibold text-xs hover:border-accent transition-colors"
            >
              <span>View All Past Stays</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingReservations.map(b => {
            const room = (rooms || []).find(r => r.id === b.roomId);
            const daysLeft = getDaysUntilArrival(b.checkIn);
            const isPayDue = b.paymentStatus === 'pending';

            return (
              <div
                key={b.id}
                className="card-luxury-3d p-6 sm:p-7 rounded-3xl overflow-hidden transition-all duration-300 hover:border-accent/50 space-y-5 relative"
              >
                {/* Golden Corner Tag for Countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 dark:border-white/10 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-accent px-3 py-1 rounded-xl bg-accent/15 border border-accent/30">
                      {b.bookingCode}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-primary dark:text-white block">
                        Reserved for {b.guestName}
                      </span>
                      <span className="text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">
                        Booked on {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Countdown Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold font-mono ${daysLeft <= 0
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse'
                          : daysLeft === 1
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-accent/15 text-accent border border-accent/30'
                        }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {daysLeft < 0
                        ? 'Arrival date passed'
                        : daysLeft === 0
                          ? 'Arriving Today'
                          : daysLeft === 1
                            ? '1 Day Until Arrival'
                            : `${daysLeft} Days Until Arrival`}
                    </span>

                    <BookingStatusBadge status={b.status} />
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </div>
                </div>

                {/* Middle Grid: Room Image & Specs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {room && (
                    <div className="md:col-span-3 h-32 rounded-2xl overflow-hidden border border-accent/30 shadow-sm flex-shrink-0 relative group">
                      <img
                        src={
                          room.images?.[0] ||
                          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Floor {room.floor || 8}
                      </span>
                    </div>
                  )}

                  <div className="md:col-span-5 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                      Suite {b.roomNumber} • {b.roomType}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-primary dark:text-white">
                      {room ? room.name : b.roomType}
                    </h4>
                    <p className="text-xs text-charcoal-muted dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>Monte-Carlo Oceanfront • Sovereign East Wing</span>
                    </p>

                    {/* Check-In Instructions */}
                    <div className="p-2.5 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/80 dark:border-white/10 text-[11px] text-charcoal-muted dark:text-gray-300">
                      <span className="font-semibold text-primary dark:text-white block mb-0.5">
                        🛎 Check-in Instructions:
                      </span>
                      Guaranteed check-in from 15:00. Please present your passport or national ID at the
                      Private Concierge Vestibule on Level 1.
                    </div>
                  </div>

                  <div className="md:col-span-4 grid grid-cols-2 gap-3 text-xs p-3.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Check-In Date
                      </span>
                      <span className="font-semibold text-primary dark:text-white font-mono">
                        {b.checkIn}
                      </span>
                      <span className="text-[9px] text-charcoal-muted block">From 15:00</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Check-Out Date
                      </span>
                      <span className="font-semibold text-primary dark:text-white font-mono">
                        {b.checkOut}
                      </span>
                      <span className="text-[9px] text-charcoal-muted block">Until 12:00</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Duration
                      </span>
                      <span className="font-semibold text-primary dark:text-white">
                        {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Total Tariff
                      </span>
                      <span className="font-serif font-bold text-accent text-sm">
                        €{b.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Due Warning Banner if pending */}
                {isPayDue && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        Payment Settlement Pending (€{b.totalAmount?.toLocaleString()}). Settle upon
                        arrival or finalize online to expedite check-in.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/customer/payments')}
                      className="px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-[11px] hover:bg-amber-600 transition-colors shrink-0"
                    >
                      Pay Now
                    </button>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-border/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceBooking(b)}
                      className="px-4 py-2 rounded-xl btn-secondary-3d text-charcoal dark:text-gray-200 hover:text-accent flex items-center gap-1.5 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>View Folio / Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/customer/bookings/${b.id}`)}
                      className="px-4 py-2 rounded-xl btn-secondary-3d text-charcoal dark:text-gray-200 hover:text-accent flex items-center gap-1.5 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>Stay Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/customer/guest-services')}
                      className="px-4 py-2 rounded-xl btn-secondary-3d text-charcoal dark:text-gray-200 hover:text-accent flex items-center gap-1.5 font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span>Pre-Arrival Requests</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCancelModal(b)}
                    className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors font-semibold flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Reservation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={selectedInvoiceBooking !== null}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
      />

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancellingBooking !== null}
        onClose={() => setCancellingBooking(null)}
        title="Cancel Upcoming Sovereign Reservation"
        subtitle={`Booking Reference: ${cancellingBooking?.bookingCode} — Suite ${cancellingBooking?.roomNumber}`}
        maxWidth="md"
      >
        {cancellingBooking && (
          <form onSubmit={handleExecuteCancel} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Confirm Cancellation of Upcoming Stay</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Cancelling this upcoming reservation will immediately release Suite {cancellingBooking.roomNumber} back to available inventory.
                Any advance deposit will be processed for refund according to our complimentary 48-hour cancellation policy.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Schedule change / Travel plans altered">
                  Schedule change / Travel plans altered
                </option>
                <option value="Booking dates conflict">Booking dates conflict</option>
                <option value="Switching to a different suite collection">
                  Switching to a different suite collection
                </option>
                <option value="Emergency circumstances">Emergency circumstances</option>
                <option value="Other bespoke reason">Other bespoke reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-charcoal dark:text-gray-300"
              >
                Keep Reservation
              </button>
              <button
                type="submit"
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UpcomingReservationsPage;

