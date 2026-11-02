import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Calendar, User, CreditCard, FileText } from 'lucide-react';

export const BookingCard = ({
  booking,
  onViewInvoice,
  onCheckIn,
}) => {
  return (
    <div className="card-luxury-3d p-6 group">
      {/* Top golden shimmer border */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none group-hover:via-accent transition-all duration-500" />

      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs font-bold text-accent tracking-wider">
            FOLIO #{booking.bookingCode}
          </span>
          <h4 className="font-serif text-lg font-bold text-primary dark:text-white mt-1">
            {booking.guestName}
          </h4>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 space-y-2.5 text-xs text-charcoal-muted dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
          <span>
            {booking.checkIn} → {booking.checkOut} ({booking.nights} nights stay)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-accent flex-shrink-0" />
          <span>
            Suite {booking.roomNumber} • {booking.roomType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent flex-shrink-0" />
          <span>
            <strong className="font-serif text-accent text-sm">
              ${booking.totalAmount?.toLocaleString()} USD
            </strong>{' '}
            (
            <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
              {booking.paymentStatus}
            </span>
            )
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 dark:border-white/10 flex items-center justify-between gap-2">
        {onViewInvoice && (
          <button
            onClick={() => onViewInvoice(booking)}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-bold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Official Folio
          </button>
        )}
        {onCheckIn && booking.status === 'confirmed' && (
          <button
            onClick={() => onCheckIn(booking)}
            className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d"
          >
            Check In Guest
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

