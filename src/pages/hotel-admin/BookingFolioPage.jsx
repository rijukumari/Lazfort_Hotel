import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  CalendarCheck,
  Printer,
  CheckCircle,
  LogOut,
  FileText,
} from 'lucide-react';

export const BookingFolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, checkInGuest, checkOutGuest } = useERP();
  const { showToast } = useToast();

  const booking = bookings.find(b => b.id === id) || bookings[0];

  if (!booking) {
    return (
      <div className="space-y-6">
        <Link to="/hotel-admin/bookings" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Reservations
        </Link>
        <p className="text-sm">Reservation record not found.</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'checked_in') {
      const res = checkInGuest(booking.id);
      if (res?.success) {
        showToast('Guest Checked In', res.message, 'success');
      } else {
        showToast('Check-In Failed', res?.message || 'Check-in failed', 'error');
      }
    } else if (newStatus === 'checked_out') {
      const res = checkOutGuest(booking.id);
      if (res?.success) {
        showToast('Checkout Complete', res.message, 'success');
      } else {
        showToast('Checkout Failed', res?.message || 'Checkout failed', 'error');
      }
    }
  };

  const subtotal = (booking.totalAmount || 0) * 0.9;
  const tax = (booking.totalAmount || 0) * 0.1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Reservations</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <span className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  Reservation Folio {booking.bookingCode}
                </h1>
                <StatusBadge status={booking.status} size="sm" />
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Guest: <span className="font-semibold text-primary dark:text-white">{booking.guestName}</span> • Suite {booking.roomNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/hotel-admin/bookings')}
          >
            Back
          </Button>
          <Button
            variant="outline"
            icon={Printer}
            onClick={() => {
              showToast('Print Folio', `Printing folio dossier for ${booking.bookingCode}`, 'info');
              window.print();
            }}
          >
            Print Folio
          </Button>
          {booking.status === 'confirmed' && (
            <Button
              variant="gold"
              icon={CheckCircle}
              onClick={() => handleStatusChange('checked_in')}
            >
              Check In Guest
            </Button>
          )}
          {booking.status === 'checked_in' && (
            <Button
              variant="outline"
              icon={LogOut}
              onClick={() => handleStatusChange('checked_out')}
            >
              Process Check Out
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Folio Sheet (8 Cols) */}
        <Card variant="luxury" className="lg:col-span-8 p-8 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-border/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg gold-gradient-bg flex items-center justify-center font-serif font-black text-primary-950 text-sm">
                  L
                </span>
                <span className="font-serif font-bold text-xl tracking-tight text-primary dark:text-white">
                  LAZFORT
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold pl-1">
                  GUEST FOLIO
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-2">
                Palace Enterprise PMS Engine
                <br />
                Monaco Sovereign Enclave
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-accent uppercase block">Folio Reference</span>
              <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                {booking.bookingCode}
              </p>
              <div className="flex items-center gap-2 justify-end mt-2">
                <StatusBadge status={booking.status} size="sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">
                Primary Sovereign Guest
              </span>
              <p className="font-serif font-bold text-base text-primary dark:text-white">{booking.guestName}</p>
              <p className="font-medium text-charcoal dark:text-gray-200">{booking.guestEmail}</p>
              <p className="text-charcoal-muted font-mono">{booking.guestPhone}</p>
            </div>

            <div className="space-y-2 sm:text-right">
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">
                  Stay Horizon
                </span>
                <span className="font-mono text-primary dark:text-white font-medium">
                  {booking.checkIn} &rarr; {booking.checkOut}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">
                  Inventory Allocation
                </span>
                <span className="font-mono font-bold text-accent">
                  Suite {booking.roomNumber} ({booking.roomType})
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory/80 dark:bg-primary-900/60 border-b border-border/80 dark:border-white/10 font-mono uppercase text-[11px] text-charcoal-muted">
                  <th className="py-3 px-5">Charge Description</th>
                  <th className="py-3 px-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                <tr>
                  <td className="py-4 px-5">
                    <p className="font-bold text-primary dark:text-white text-sm">
                      Luxury Suite Nightly Tariff ({booking.nights} Nights)
                    </p>
                    <p className="text-xs text-charcoal-muted mt-0.5">
                      Suite {booking.roomNumber} accommodation clearance with private concierge.
                    </p>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-primary dark:text-white text-sm">
                    ${Math.round(subtotal).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-charcoal-muted">
                    Sovereign Luxury Territory Surcharge & VAT (10%)
                  </td>
                  <td className="py-3 px-5 text-right font-mono text-charcoal-muted">
                    ${Math.round(tax).toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-ivory/50 dark:bg-white/[0.02] border-t border-border/80 dark:border-white/10 font-medium">
                <tr>
                  <td className="py-2.5 px-5 text-right text-charcoal-muted">Total Folio Charge:</td>
                  <td className="py-2.5 px-5 text-right font-serif font-bold text-base text-primary dark:text-white">
                    ${booking.totalAmount?.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-5 text-right text-emerald-600 dark:text-emerald-400">Total Cleared Deposit:</td>
                  <td className="py-2 px-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    -${booking.paidAmount?.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-t border-border/80 dark:border-white/10 bg-accent/5">
                  <td className="py-3 px-5 text-right font-bold text-primary dark:text-white">
                    Net Outstanding:
                  </td>
                  <td className="py-3 px-5 text-right font-serif font-bold text-lg text-accent">
                    ${((booking.totalAmount || 0) - (booking.paidAmount || 0)).toLocaleString()} USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Sidebar Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-accent" />
              <span>Folio Operations</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Reservation Status</span>
                <StatusBadge status={booking.status} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Payment Clearance</span>
                <StatusBadge status={booking.paymentStatus} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Occupancy</span>
                <span className="font-mono text-primary dark:text-white">{booking.adults} Adults, {booking.children} Children</span>
              </div>
            </div>

            <Button
              variant="outline"
              icon={Printer}
              onClick={() => {
                showToast('Print Folio', `Printing folio dossier for ${booking.bookingCode}`, 'info');
                window.print();
              }}
              className="w-full"
            >
              Print Official Folio
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingFolioPage;

