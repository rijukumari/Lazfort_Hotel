import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import { Button, Card } from '../../components/ui';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Printer,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';

export const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings, rooms } = useERP();

  const stateData = location.state;
  const booking = bookings.find(b => b.id === bookingId) || stateData?.booking || bookings[0];
  const room = rooms.find(r => r.id === booking?.roomId) || stateData?.room || rooms[0];

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold">Booking Record Not Found</h2>
        <Button
          variant="gold"
          onClick={() => navigate('/customer/bookings')}
        >
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 py-4 pb-20">
      {/* 3D Success Celebration Card */}
      <Card variant="luxury" className="p-8 sm:p-10 text-center space-y-4 overflow-hidden relative">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-accent/30 via-accent/15 to-transparent border border-accent/60 flex items-center justify-center text-accent shadow-gold">
          <Sparkles className="w-8 h-8 text-accent animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Sovereign Reservation Confirmed & Verified</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary dark:text-white">
          We Look Forward to Welcoming You,{' '}
          <span className="gold-gradient-text">{booking.guestName}</span>
        </h1>

        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
          Your reservation has been synchronized into the Lazfort ERP Central Booking System. A
          confirmation dossier has been dispatched to{' '}
          <strong className="text-primary dark:text-white font-mono">{booking.guestEmail}</strong>.
        </p>

        {/* Booking Reference Code Highlight */}
        <div className="pt-2">
          <div className="inline-block p-4 sm:px-8 rounded-2xl bg-ivory dark:bg-black/40 border border-accent/40 shadow-inner">
            <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal-muted dark:text-gray-400 block">
              Central Booking Reference Code
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-accent tracking-wider">
              {booking.bookingCode}
            </span>
          </div>
        </div>
      </Card>

      {/* Complete Itinerary Dossier Card */}
      <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 dark:border-white/10 gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
              Official Stay Dossier
            </span>
            <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
              Reservation Specifics & Folio Details
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
        </div>

        {/* Suite Details Preview */}
        {room && (
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10">
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
              alt={room.name}
              className="w-full sm:w-32 h-24 rounded-2xl object-cover border border-accent/30 shadow-md flex-shrink-0"
            />
            <div className="space-y-1 w-full">
              <span className="text-[10px] font-mono uppercase font-bold text-accent">
                Suite {booking.roomNumber} • {booking.roomType}
              </span>
              <h4 className="font-serif text-lg font-bold text-primary dark:text-white">
                {room.name}
              </h4>
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

        {/* Schedule & Guest Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/30 border border-border/60 dark:border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Check-In Date
            </span>
            <span className="font-semibold text-primary dark:text-white text-sm font-mono mt-0.5 block">
              {booking.checkIn}
            </span>
            <span className="text-[10px] text-charcoal-muted">From 15:00 CET</span>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Check-Out Date
            </span>
            <span className="font-semibold text-primary dark:text-white text-sm font-mono mt-0.5 block">
              {booking.checkOut}
            </span>
            <span className="text-[10px] text-charcoal-muted">Until 12:00 CET</span>
          </div>

          <div>
            <span className="text-[10px] text-charcoal-muted uppercase font-mono block">
              Stay Duration
            </span>
            <span className="font-semibold text-primary dark:text-white text-sm font-mono mt-0.5 block">
              {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
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
              ${booking.totalAmount?.toLocaleString()}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono">
              {booking.paymentStatus === 'paid' ? 'Paid in Full' : 'Pay at Check-In'}
            </span>
          </div>
        </div>

        {/* Contact & Special Requests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="space-y-1">
            <span className="font-semibold text-primary dark:text-white block">
              Guest Contact Clearance
            </span>
            <p className="text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent" />
              {booking.guestEmail}
            </p>
            <p className="text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent" />
              {booking.guestPhone}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-primary dark:text-white block">
              Special Requests Recorded
            </span>
            <p className="text-charcoal-muted dark:text-gray-300 italic text-[11px] leading-relaxed">
              {booking.specialRequests || 'No bespoke requests recorded.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-border/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            icon={Printer}
            onClick={handlePrint}
          >
            Print / Save Confirmation Dossier
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/customer/discover/rooms')}
            >
              Browse More Suites
            </Button>
            <Button
              variant="gold"
              icon={ArrowRight}
              onClick={() => navigate('/customer/bookings')}
            >
              Go to My Bookings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmationPage;

