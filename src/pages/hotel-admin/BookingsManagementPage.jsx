import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Tabs, Button } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { Plus, FileText, CheckCircle, LogOut } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const BookingsManagementPage = () => {
  const navigate = useNavigate();
  const { bookings, checkInGuest, checkOutGuest } = useERP();
  const [activeTab, setActiveTab] = useState('all');
  const { showToast } = useToast();

  const handleStatusChange = (bookingId, newStatus) => {
    if (newStatus === 'checked_in') {
      const res = checkInGuest(bookingId);
      if (res?.success) {
        showToast('Guest Checked In', res.message, 'success');
      } else {
        showToast('Check-In Failed', res?.message || 'Check-in failed', 'error');
      }
    } else if (newStatus === 'checked_out') {
      const res = checkOutGuest(bookingId);
      if (res?.success) {
        showToast('Checkout Complete', res.message, 'success');
      } else {
        showToast('Checkout Failed', res?.message || 'Checkout failed', 'error');
      }
    } else {
      showToast('Status Updated', `Booking status changed to ${newStatus}.`, 'info');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    {
      id: 'confirmed',
      label: 'Confirmed',
      count: bookings.filter(b => b.status === 'confirmed').length,
    },
    {
      id: 'checked_in',
      label: 'Checked In',
      count: bookings.filter(b => b.status === 'checked_in').length,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: bookings.filter(b => b.status === 'pending').length,
    },
    {
      id: 'checked_out',
      label: 'Checked Out',
      count: bookings.filter(b => b.status === 'checked_out').length,
    },
  ];

  const displayedBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const columns = [
    {
      key: 'bookingCode',
      header: 'Booking Ref',
      sortable: true,
      render: item => <span className="font-mono font-bold text-accent">{item.bookingCode}</span>,
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
      key: 'checkIn',
      header: 'Dates',
      sortable: true,
      render: item => (
        <span className="text-xs">
          {item.checkIn} → {item.checkOut} ({item.nights}n)
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Stay Amount',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent text-xs">
          ${item.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="View Invoice Folio on Dedicated Page"
          >
            <FileText className="w-4 h-4" />
          </button>
          {item.status === 'confirmed' && (
            <button
              onClick={() => handleStatusChange(item.id, 'checked_in')}
              className="px-2.5 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              title="Check In Guest"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Check In
            </button>
          )}
          {item.status === 'checked_in' && (
            <button
              onClick={() => handleStatusChange(item.id, 'checked_out')}
              className="px-2.5 py-1.5 bg-white/80 dark:bg-primary-900/80 border border-border/80 dark:border-white/15 text-charcoal dark:text-gray-200 rounded-xl text-[11px] font-bold hover:border-accent hover:text-accent transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              title="Check Out Guest"
            >
              <LogOut className="w-3.5 h-3.5 text-accent" />
              Check Out
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Reservations & Folio Management"
        description="Oversee confirmed reservations, pending deposits, walk-in check-ins, and guest billings."
        badge={`${bookings.length} Bookings`}
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/hotel-admin/bookings/new')}
          >
            New Reservation
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Data Table */}
      <DataTable
        data={displayedBookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search by booking code, guest name, or room..."
        pageSize={6}
      />
    </div>
  );
};

export default BookingsManagementPage;

