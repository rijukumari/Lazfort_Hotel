import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  FileText,
  Printer,
  Download,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Receipt
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const CheckedOutBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, invoices = [], folios = [] } = useERP();
  const { showToast } = useToast();

  const [receiptModal, setReceiptModal] = useState(null);

  const checkedOutBookings = bookings.filter(b => b.status === 'checked_out');

  const handlePrint = (booking) => {
    window.print();
  };

  const handleDownloadReceipt = (booking) => {
    const inv = invoices.find(i => i.bookingCode === booking.bookingCode) || {
      invoiceNumber: `INV-${booking.bookingCode}`,
      totalAmount: booking.totalAmount,
    };

    const receiptContent = `
LAZFORT HOTEL & RESIDENCES
RECEIPT FOR COMPLETED STAY
----------------------------------------
Invoice #: ${inv.invoiceNumber}
Booking Ref: ${booking.bookingCode}
Guest: ${booking.guestName}
Email: ${booking.guestEmail}
Suite: ${booking.roomNumber} (${booking.roomType})
Stay Dates: ${booking.checkIn} to ${booking.checkOut} (${booking.nights} nights)
Total Settled: $${(booking.totalAmount || inv.totalAmount || 0).toLocaleString()} USD
Status: FULLY SETTLED & PAID
Date: ${new Date().toLocaleDateString()}
----------------------------------------
Thank you for staying at Lazfort Palace Monte-Carlo.
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${booking.bookingCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Receipt Downloaded', `Settlement receipt for ${booking.bookingCode} saved.`, 'success');
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Booking Ref',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-accent">{item.bookingCode}</span>
          <div className="flex items-center gap-1 text-[10px] text-charcoal-muted mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Settled
          </div>
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
          <p className="text-xs text-charcoal-muted">{item.guestEmail}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Suite Occupied',
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
      header: 'Stay Completed',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs font-medium">
            {item.checkIn} → {item.checkOut}
          </span>
          <p className="text-[11px] text-charcoal-muted">{item.nights} Nights</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Final Bill Settled',
      sortable: true,
      render: item => (
        <div>
          <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            ${item.totalAmount?.toLocaleString()}
          </span>
          <span className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
            Paid in Full
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Folio & Records',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="View Final Folio"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePrint(item)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
            title="Print Folio Statement"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDownloadReceipt(item)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-emerald-500 transition-colors"
            title="Download Tax Receipt"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Checked-Out Reservations (Past Stays)"
        description="Historical log of concluded guest stays, finalized folios, settlement invoices, and departure records."
        badge={`${checkedOutBookings.length} Completed Stays`}
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
              variant="outline"
              icon={Receipt}
              onClick={() => navigate('/hotel-admin/finance')}
            >
              Financial Ledger
            </Button>
          </div>
        }
      />

      <DataTable
        data={checkedOutBookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search past stays by guest name, suite, or booking ref..."
        pageSize={8}
      />
    </div>
  );
};

export default CheckedOutBookingsPage;

