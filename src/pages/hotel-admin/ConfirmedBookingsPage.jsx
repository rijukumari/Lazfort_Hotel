import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal, Input, FormField } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Printer,
  CalendarCheck,
  Search,
  Filter,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const ConfirmedBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, checkInGuest, cancelBooking } = useERP();
  const { showToast } = useToast();

  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Guest requested cancellation');

  // Filter only confirmed bookings
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const handleCheckIn = (bookingId) => {
    const res = checkInGuest(bookingId);
    if (res?.success) {
      showToast('Guest Checked In', res.message, 'success');
    } else {
      showToast('Check-In Failed', res?.message || 'Check-in failed', 'error');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const res = cancelBooking(cancelModalBooking.id, cancelReason);
    if (res?.success) {
      showToast('Booking Cancelled', res.message, 'info');
      setCancelModalBooking(null);
    } else {
      showToast('Cancellation Failed', res?.message || 'Unable to cancel', 'error');
    }
  };

  const handlePrint = (booking) => {
    window.print();
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Booking Ref',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-accent">{item.bookingCode}</span>
          <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">Confirmed</p>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white">{item.guestName}</p>
          <p className="text-xs text-charcoal-muted">{item.guestEmail || item.guestPhone || 'No contact specified'}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Room',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-semibold">Suite {item.roomNumber}</span>
          <p className="text-xs text-charcoal-muted">{item.roomType}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Stay Schedule',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs font-medium">
            {item.checkIn} → {item.checkOut}
          </span>
          <p className="text-[11px] text-charcoal-muted font-mono">{item.nights} Nights • {item.adults || 1} Guests</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total & Payment',
      sortable: true,
      render: item => (
        <div>
          <div className="font-serif font-bold text-accent text-sm">
            ${item.totalAmount?.toLocaleString()}
          </div>
          <span className="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {item.paymentStatus || 'Guaranteed'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="View Folio Details"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCheckIn(item.id)}
            className="px-2.5 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Check In Guest"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Check In
          </button>
          <button
            onClick={() => handlePrint(item)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
            title="Print Reservation Voucher"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCancelModalBooking(item)}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Cancel Booking"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Confirmed Reservations"
        description="Active guaranteed bookings awaiting guest arrival. Manage check-in processing, folio generation, and schedule adjustments."
        badge={`${confirmedBookings.length} Confirmed`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CalendarCheck}
              onClick={() => navigate('/hotel-admin/bookings/calendar')}
            >
              Booking Calendar
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              Add New Booking
            </Button>
          </div>
        }
      />

      <DataTable
        data={confirmedBookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Filter confirmed stays by guest name, room, or booking ID..."
        pageSize={8}
      />

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <Modal
          isOpen={!!cancelModalBooking}
          onClose={() => setCancelModalBooking(null)}
          title="Cancel Reservation"
        >
          <div className="space-y-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-rose-600 dark:text-rose-400">
                  Are you sure you want to cancel reservation {cancelModalBooking.bookingCode}?
                </p>
                <p className="text-charcoal-muted mt-1">
                  Guest: {cancelModalBooking.guestName} • Suite {cancelModalBooking.roomNumber} will be released back to inventory immediately.
                </p>
              </div>
            </div>

            <FormField label="Cancellation Reason">
              <Input
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setCancelModalBooking(null)}>
                Keep Reservation
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConfirmedBookingsPage;

