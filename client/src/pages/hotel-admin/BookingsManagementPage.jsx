import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Tabs, Button } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { ViewToggle } from '../../components/ui/ViewToggle';
import { Plus, FileText, CheckCircle, LogOut, Calendar, User, BedDouble, DollarSign } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const BookingsManagementPage = () => {
  const navigate = useNavigate();
  const { bookings, checkInGuest, checkOutGuest } = useERP();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_bookings') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_bookings', mode);
    } catch {}
  };
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
      className: 'whitespace-nowrap',
      render: item => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'whitespace-nowrap',
      render: item => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors shrink-0"
            title="View Invoice Folio on Dedicated Page"
          >
            <FileText className="w-4 h-4" />
          </button>
          {item.status === 'confirmed' && (
            <button
              onClick={() => handleStatusChange(item.id, 'checked_in')}
              className="px-3 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold hover:bg-emerald-500/25 transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 shadow-sm"
              title="Check In Guest"
            >
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Check In</span>
            </button>
          )}
          {item.status === 'checked_in' && (
            <button
              onClick={() => handleStatusChange(item.id, 'checked_out')}
              className="px-3 py-1.5 bg-white/80 dark:bg-primary-900/80 border border-border/80 dark:border-white/15 text-charcoal dark:text-gray-200 rounded-xl text-[11px] font-bold hover:border-accent hover:text-accent transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 shadow-sm"
              title="Check Out Guest"
            >
              <LogOut className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Check Out</span>
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
          <div className="flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Reservation
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* View Switching: Data Table or Luxury Card Grid */}
      {viewMode === 'list' ? (
        <DataTable
          data={displayedBookings}
          columns={columns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search by booking code, guest name, or room..."
          pageSize={6}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBookings.map(b => (
            <div
              key={b.id}
              className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">{b.bookingCode}</span>
                  <StatusBadge status={b.status} />
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={b.guestAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={b.guestName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-accent/30"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-tight">
                      {b.guestName}
                    </h4>
                    <p className="text-xs text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                      <BedDouble className="w-3.5 h-3.5 text-accent" />
                      <span>Room {b.roomNumber} • {b.roomType}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Stay Dates:</span>
                    <span className="font-mono text-primary dark:text-white font-medium">{b.checkIn} → {b.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Payment Clearance:</span>
                    <StatusBadge status={b.paymentStatus || 'paid'} size="sm" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block">Total Folio</span>
                  <span className="font-serif font-bold text-lg text-primary dark:text-accent">
                    ${Number(b.totalAmount || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/hotel-admin/bookings/folio/${b.id}`)}
                    className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
                    title="View Folio Statement"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(b.id, 'checked_in')}
                      className="px-3 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/25 transition-all inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Check In</span>
                    </button>
                  )}
                  {b.status === 'checked_in' && (
                    <button
                      onClick={() => handleStatusChange(b.id, 'checked_out')}
                      className="px-3 py-1.5 bg-white/80 dark:bg-primary-900/80 border border-border/80 dark:border-white/15 text-charcoal dark:text-gray-200 rounded-xl text-xs font-bold hover:border-accent hover:text-accent transition-all inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <LogOut className="w-3.5 h-3.5 text-accent" />
                      <span>Check Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BookingsManagementPage;

