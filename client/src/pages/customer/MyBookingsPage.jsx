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
  SlidersHorizontal
} from 'lucide-react';

export const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, rooms, cancelBooking } = useERP();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [searchRef, setSearchRef] = useState('');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  // Cancellation modal states
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Personal schedule change');
  const [isCancelling, setIsCancelling] = useState(false);

  // Filter bookings for this customer
  const customerBookings = useMemo(() => {
    return (bookings || []).filter(b => {
      if (searchRef.trim()) {
        const query = searchRef.toLowerCase().trim();
        return (
          b.bookingCode?.toLowerCase().includes(query) ||
          b.guestEmail?.toLowerCase().includes(query) ||
          b.guestName?.toLowerCase().includes(query)
        );
      }

      if (isAuthenticated && user) {
        if (user.role === 'customer') {
          return (
            b.guestEmail?.toLowerCase() === user.email?.toLowerCase() ||
            b.guestName?.toLowerCase() === user.name?.toLowerCase() ||
            b.guestId === user.id
          );
        }
      }

      return true;
    });
  }, [bookings, user, isAuthenticated, searchRef]);

  // Tab filtering
  const tabFilteredBookings = useMemo(() => {
    return customerBookings.filter(b => {
      if (activeTab === 'all') return true;
      if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
      if (activeTab === 'checked_in') return b.status === 'checked_in';
      if (activeTab === 'completed') return b.status === 'checked_out';
      if (activeTab === 'cancelled') return b.status === 'cancelled';
      return true;
    });
  }, [customerBookings, activeTab]);

  const handleOpenCancelModal = (booking) => {
    if (booking.status === 'checked_in') {
      showToast('Action Not Permitted', 'In-house guests cannot cancel online. Please contact the Concierge Desk.', 'error');
      return;
    }
    if (booking.status === 'checked_out' || booking.status === 'cancelled') {
      showToast('Cannot Cancel', 'This booking has already concluded or been cancelled.', 'info');
      return;
    }
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

  const tabs = [
    { id: 'all', label: 'All Stays', count: customerBookings.length },
    {
      id: 'upcoming',
      label: 'Upcoming Stays',
      count: customerBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
    },
    {
      id: 'checked_in',
      label: 'Active Resident',
      count: customerBookings.filter(b => b.status === 'checked_in').length,
    },
    {
      id: 'completed',
      label: 'Completed Stays',
      count: customerBookings.filter(b => b.status === 'checked_out').length,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: customerBookings.filter(b => b.status === 'cancelled').length,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="My Reservations & Stay Folios"
        description="Monitor upcoming palace arrivals, active suites, digital concierge folios, and manage reservation modifications."
        badge={`${customerBookings.length} Total Bookings`}
        actions={
          <button
            onClick={() => navigate('/customer/discover/rooms')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Another Suite</span>
          </button>
        }
      />

      {/* Search by Reference bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchRef}
            onChange={e => setSearchRef(e.target.value)}
            placeholder="Search by Booking Code (e.g. AUR-1001) or Guest Email..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-ivory dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
          />
        </div>

        <div className="text-xs text-charcoal-muted dark:text-gray-400">
          Showing bookings for:{' '}
          <strong className="text-primary dark:text-white font-mono">
            {isAuthenticated && user ? user.email : 'All Stays'}
          </strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'gold-gradient-bg text-primary-900 font-bold shadow-gold'
                : 'btn-secondary-3d text-charcoal-muted dark:text-gray-300 hover:text-accent'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id
                  ? 'bg-primary-900/20 text-primary-900'
                  : 'bg-black/10 dark:bg-white/10 text-charcoal-muted dark:text-gray-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {tabFilteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-surface-dark/60 border border-dashed border-border dark:border-white/10 space-y-4">
          <BedDouble className="w-12 h-12 text-accent/50 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
            No Reservations in this Category
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-sm mx-auto">
            You do not currently have any bookings categorized as "{activeTab}". Discover our royal
            penthouses and oceanfront villas.
          </p>
          <button
            onClick={() => navigate('/customer/discover/rooms')}
            className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
          >
            Explore Royal Suites
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {tabFilteredBookings.map(b => {
            const room = (rooms || []).find(r => r.id === b.roomId);
            const isCancellable = b.status === 'confirmed' || b.status === 'pending';

            return (
              <div
                key={b.id}
                className="card-luxury-3d p-6 sm:p-7 rounded-3xl overflow-hidden transition-all duration-300 hover:border-accent/50 space-y-5"
              >
                {/* Top Bar: Code, Dates & Statuses */}
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

                  <div className="flex items-center gap-2">
                    <BookingStatusBadge status={b.status} />
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </div>
                </div>

                {/* Middle Grid: Room Image & Specs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {room && (
                    <div className="md:col-span-3 h-28 rounded-2xl overflow-hidden border border-accent/30 shadow-sm flex-shrink-0">
                      <img
                        src={room.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="md:col-span-5 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                      Suite {b.roomNumber} • {b.roomType}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-primary dark:text-white">
                      {room ? room.name : b.roomType}
                    </h4>
                    <p className="text-xs text-charcoal-muted dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>Monte-Carlo Oceanfront • Floor {room?.floor || 8}</span>
                    </p>
                  </div>

                  <div className="md:col-span-4 grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Check-In
                      </span>
                      <span className="font-semibold text-primary dark:text-white font-mono">
                        {b.checkIn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Check-Out
                      </span>
                      <span className="font-semibold text-primary dark:text-white font-mono">
                        {b.checkOut}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Stay Duration
                      </span>
                      <span className="font-semibold text-primary dark:text-white">
                        {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Tariff Total
                      </span>
                      <span className="font-serif font-bold text-accent text-sm">
                        €{b.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Requests or Cancellation Notice */}
                {b.cancellationReason && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Cancelled on {new Date(b.cancelledAt || '').toLocaleDateString()}. Reason:{' '}
                      <b>{b.cancellationReason}</b>. Room released back to inventory.
                    </span>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-border/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceBooking(b)}
                      className="px-4 py-2 rounded-xl btn-secondary-3d text-charcoal dark:text-gray-200 hover:text-accent flex items-center gap-1.5 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>View Official Folio / Invoice</span>
                    </button>

                    <button
                      onClick={() => navigate(`/customer/bookings/${b.id}`)}
                      className="px-4 py-2 rounded-xl btn-secondary-3d text-charcoal dark:text-gray-200 hover:text-accent flex items-center gap-1.5 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>Stay Details</span>
                    </button>
                  </div>

                  {isCancellable && (
                    <button
                      onClick={() => handleOpenCancelModal(b)}
                      className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors font-semibold flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Reservation</span>
                    </button>
                  )}
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
        title="Cancel Sovereign Reservation"
        subtitle={`Booking Reference: ${cancellingBooking?.bookingCode} — Suite ${cancellingBooking?.roomNumber}`}
        maxWidth="md"
      >
        {cancellingBooking && (
          <form onSubmit={handleExecuteCancel} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Confirm Reservation Cancellation</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Cancelling this reservation will immediately release Suite {cancellingBooking.roomNumber} back to available inventory.
                Any advance deposit will be marked for refund according to the 48-hour complimentary cancellation policy.
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
                <option value="Other bespoke reason">Other reason</option>
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

export default MyBookingsPage;

