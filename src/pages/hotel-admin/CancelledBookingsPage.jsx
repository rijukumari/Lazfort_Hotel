import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal, Select, FormField, Input } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  FileText,
  RotateCcw,
  AlertCircle,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const CancelledBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, updateBooking } = useERP();
  const { showToast } = useToast();

  const [refundModalBooking, setRefundModalBooking] = useState(null);
  const [refundStatus, setRefundStatus] = useState('refunded');
  const [refundAmount, setRefundAmount] = useState(0);

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const openRefundModal = (booking) => {
    setRefundModalBooking(booking);
    setRefundAmount(booking.paidAmount || booking.totalAmount || 0);
    setRefundStatus(booking.paymentStatus === 'refunded' ? 'refunded' : 'refund_approved');
  };

  const handleSaveRefund = (e) => {
    e.preventDefault();
    if (!refundModalBooking) return;

    const res = updateBooking(refundModalBooking.id, {
      paymentStatus: refundStatus,
      refundAmount: Number(refundAmount),
      refundProcessedAt: new Date().toISOString(),
    });

    if (res?.success) {
      showToast('Refund Processed', `Refund status updated for ${refundModalBooking.bookingCode}.`, 'success');
      setRefundModalBooking(null);
    } else {
      showToast('Refund Failed', res?.message || 'Could not process refund', 'error');
    }
  };

  const handleReinstate = (booking) => {
    const res = updateBooking(booking.id, {
      status: 'confirmed',
      cancelledAt: null,
      cancellationReason: null,
    });
    if (res?.success) {
      showToast('Booking Reinstated', `Reservation ${booking.bookingCode} has been restored to Confirmed.`, 'success');
    }
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Booking Ref',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-rose-500">{item.bookingCode}</span>
          <p className="text-[10px] text-charcoal-muted mt-0.5">
            {item.cancelledAt ? new Date(item.cancelledAt).toLocaleDateString() : 'Cancelled'}
          </p>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Information',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white">{item.guestName}</p>
          <p className="text-xs text-charcoal-muted">{item.guestEmail}</p>
          <p className="text-[11px] text-charcoal-muted">{item.guestPhone}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Cancelled Suite',
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
      header: 'Original Schedule',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs">
            {item.checkIn} → {item.checkOut}
          </span>
          <p className="text-[11px] text-charcoal-muted">{item.nights} Nights</p>
        </div>
      ),
    },
    {
      key: 'cancellationReason',
      header: 'Reason',
      sortable: true,
      render: item => (
        <span className="text-xs italic text-charcoal-muted line-clamp-2 max-w-[200px]">
          "{item.cancellationReason || 'Guest cancellation request'}"
        </span>
      ),
    },
    {
      key: 'refundStatus',
      header: 'Refund Status',
      sortable: true,
      render: item => {
        const isRefunded = item.paymentStatus === 'refunded';
        return (
          <div>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isRefunded ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}>
              {item.paymentStatus || 'Pending Review'}
            </span>
            <p className="text-[11px] font-mono text-charcoal-muted mt-0.5">
              ${(item.refundAmount || item.totalAmount || 0).toLocaleString()} USD
            </p>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="View Void Folio"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => openRefundModal(item)}
            className="px-2.5 py-1.5 bg-accent/15 text-accent border border-accent/30 rounded-xl text-[11px] font-bold hover:bg-accent/25 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            title="Manage Refund"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Refund
          </button>
          <button
            onClick={() => handleReinstate(item)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-emerald-500 transition-colors"
            title="Reinstate Booking"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Cancelled Reservations & Refunds"
        description="Records of cancelled booking folios, escrow hold releases, guest refund statuses, and penalty audits."
        badge={`${cancelledBookings.length} Cancelled`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CalendarCheck}
              onClick={() => navigate('/hotel-admin/bookings/calendar')}
            >
              Calendar
            </Button>
            <Button
              variant="gold"
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Booking
            </Button>
          </div>
        }
      />

      <DataTable
        data={cancelledBookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Filter cancelled bookings by name, ref, or suite..."
        pageSize={8}
      />

      {/* Refund Management Modal */}
      {refundModalBooking && (
        <Modal
          isOpen={!!refundModalBooking}
          onClose={() => setRefundModalBooking(null)}
          title={`Manage Refund: ${refundModalBooking.bookingCode}`}
        >
          <form onSubmit={handleSaveRefund} className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
              <p className="font-bold text-amber-600 dark:text-amber-400">
                Guest: {refundModalBooking.guestName}
              </p>
              <p className="text-charcoal-muted">
                Original Total: ${refundModalBooking.totalAmount?.toLocaleString()} • Suite {refundModalBooking.roomNumber}
              </p>
            </div>

            <FormField label="Refund Status">
              <Select
                value={refundStatus}
                onChange={e => setRefundStatus(e.target.value)}
                options={[
                  { value: 'refunded', label: 'Refund Completed (100% Full Refund)' },
                  { value: 'partial_refund', label: 'Partial Refund (Cancellation Fee Deducted)' },
                  { value: 'forfeited', label: 'Forfeited Deposit (Non-refundable Guarantee)' },
                  { value: 'credit_issued', label: 'Hotel Credit / Future Stay Voucher' },
                ]}
              />
            </FormField>

            <FormField label="Refund Amount ($ USD)">
              <Input
                type="number"
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
                required
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setRefundModalBooking(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Save & Update Refund
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CancelledBookingsPage;

