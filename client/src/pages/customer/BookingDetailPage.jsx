import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  MapPin,
  Users,
  FileText,
  Printer,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Bed,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, rooms, cancelBooking } = useERP();
  const { showToast } = useToast();

  const booking = (bookings || []).find(b => b.id === bookingId);
  const room = (rooms || []).find(r => r.id === booking?.roomId);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Personal schedule change');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-primary dark:text-white">Booking Not Found</h2>
        <button
          onClick={() => navigate('/customer/bookings')}
          className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs"
        >
          Return to My Bookings
        </button>
      </div>
    );
  }

  const isCancellable = booking.status === 'confirmed' || booking.status === 'pending';

  const handleCancelBooking = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const res = cancelBooking(booking.id, cancelReason);
      setIsProcessing(false);
      setIsCancelModalOpen(false);

      if (res && res.success) {
        showToast('Reservation Cancelled', res.message, 'success');
      } else {
        showToast('Cancellation Failed', res?.message || 'Error occurred', 'error');
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 py-4 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/customer/bookings')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent dark:text-gray-300 dark:hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Bookings</span>
        </button>
      </div>

      {/* Top Dossier Card */}
      <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border dark:border-white/10 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 dark:border-white/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-accent px-3 py-1 rounded-xl bg-accent/15 border border-accent/30">
                {booking.bookingCode}
              </span>
              <span className="text-[10px] text-charcoal-muted uppercase font-mono">
                Booking ID: {booking.id}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary dark:text-white mt-1.5">
              Stay Particulars & Concierge Dossier
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
        </div>

        {/* Room Overview */}
        {room && (
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10">
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'}
              alt={room.name}
              className="w-full sm:w-36 h-28 rounded-2xl object-cover border border-accent/30 shadow-md flex-shrink-0"
            />
            <div className="space-y-1 w-full">
              <span className="text-[10px] font-mono uppercase font-bold text-accent">
                Suite {booking.roomNumber} • {booking.roomType}
              </span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
                {room.name}
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-300 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  Floor {room.floor}
                </span>
                <span>•</span>
                <span>{room.view}</span>
                <span>•</span>
                <span>{room.bedType} Bed</span>
              </p>
            </div>
          </div>
        )}

        {/* Schedule & Financial Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/30 border border-border/60 dark:border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Check-In
            </span>
            <span className="font-semibold text-primary dark:text-white text-sm font-mono mt-0.5 block">
              {booking.checkIn}
            </span>
            <span className="text-[10px] text-charcoal-muted">From 15:00 CET</span>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Check-Out
            </span>
            <span className="font-semibold text-primary dark:text-white text-sm font-mono mt-0.5 block">
              {booking.checkOut}
            </span>
            <span className="text-[10px] text-charcoal-muted">Until 12:00 CET</span>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Nights / Occupants
            </span>
            <span className="font-semibold text-primary dark:text-white text-sm font-mono mt-0.5 block">
              {booking.nights} Nights
            </span>
            <span className="text-[10px] text-charcoal-muted">
              {booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Total Amount
            </span>
            <span className="font-serif text-lg font-bold text-accent block mt-0.5">
              €{booking.totalAmount?.toLocaleString()}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono">
              {booking.paymentStatus === 'paid' ? 'Paid in Full' : 'Pending Payment at Check-In'}
            </span>
          </div>
        </div>

        {/* Guest Contact & Special Requests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="space-y-1.5 p-4 rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border dark:border-white/10">
            <span className="font-semibold text-primary dark:text-white block font-serif">
              Guest Clearance & Contact
            </span>
            <p className="text-charcoal-muted dark:text-gray-300">
              <strong>Name:</strong> {booking.guestName}
            </p>
            <p className="text-charcoal-muted dark:text-gray-300">
              <strong>Email:</strong> {booking.guestEmail}
            </p>
            <p className="text-charcoal-muted dark:text-gray-300">
              <strong>Phone:</strong> {booking.guestPhone}
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border dark:border-white/10">
            <span className="font-semibold text-primary dark:text-white block font-serif">
              Concierge Requests & Instructions
            </span>
            <p className="text-charcoal-muted dark:text-gray-300 italic text-[11px] leading-relaxed">
              {booking.specialRequests || 'No bespoke requests recorded.'}
            </p>
          </div>
        </div>

        {/* Cancellation Notice if cancelled */}
        {booking.status === 'cancelled' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>This reservation was cancelled</span>
            </div>
            <p className="text-[11px]">
              Reason: <b>{booking.cancellationReason || 'Cancelled upon guest request'}</b>.
              The suite has been freed in the ERP calendar and is available for other guests.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-border/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <FileText className="w-4 h-4 text-accent" />
              <span>Official Invoice & Folio</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <Printer className="w-4 h-4 text-accent" />
              <span>Print Dossier</span>
            </button>
          </div>

          {isCancellable && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Reservation</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={booking}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Reservation"
        subtitle={`Booking Reference: ${booking.bookingCode}`}
        maxWidth="md"
      >
        <form onSubmit={handleCancelBooking} className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Release Suite {booking.roomNumber}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Confirming cancellation will instantly update the hotel's central ERP database.
              Your suite will become available to other guests immediately.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold uppercase text-charcoal-muted dark:text-gray-300">
              Reason for Cancellation
            </label>
            <select
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="Personal schedule change">Personal schedule change</option>
              <option value="Dates conflict">Dates conflict</option>
              <option value="Travel restrictions">Travel restrictions</option>
              <option value="Other bespoke reason">Other bespoke reason</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-charcoal dark:text-gray-300"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingDetailPage;

