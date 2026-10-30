import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  LogOut,
  FileText,
  ArrowRightLeft,
  UtensilsCrossed,
  KeyRound,
  Eye,
  CalendarCheck,
  UserCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const CheckedInBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, folios = [], checkOutGuest } = useERP();
  const { showToast } = useToast();

  const checkedInBookings = bookings.filter(b => b.status === 'checked_in');

  const handleCheckOut = (bookingId) => {
    const res = checkOutGuest(bookingId);
    if (res?.success) {
      showToast('Checkout Complete', res.message, 'success');
    } else {
      showToast('Checkout Failed', res?.message || 'Could not complete checkout', 'error');
    }
  };

  const getFolioBalance = (booking) => {
    const f = folios.find(folio => folio.bookingId === booking.id || folio.bookingCode === booking.bookingCode);
    if (f) return f.balanceDue || 0;
    return 0;
  };

  const columns = [
    {
      key: 'roomNumber',
      header: 'Assigned Suite',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-sm text-primary dark:text-white">Suite {item.roomNumber}</span>
            <p className="text-[11px] text-charcoal-muted">{item.roomType}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'In-House Guest',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white flex items-center gap-1.5">
            {item.guestName}
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent/15 text-accent font-bold">In-House</span>
          </p>
          <p className="text-xs text-charcoal-muted">{item.guestEmail}</p>
          <p className="text-[11px] text-charcoal-muted font-mono">{item.guestPhone}</p>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: 'Arrival Date',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs font-semibold">{item.checkIn}</span>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Checked In</p>
        </div>
      ),
    },
    {
      key: 'checkOut',
      header: 'Scheduled Departure',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs font-semibold">{item.checkOut}</span>
          <p className="text-[11px] text-charcoal-muted">{item.nights} Nights Total</p>
        </div>
      ),
    },
    {
      key: 'folioBalance',
      header: 'Folio Balance',
      sortable: true,
      render: item => {
        const balance = getFolioBalance(item);
        return (
          <div>
            <span className={`font-serif font-bold text-sm ${balance > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              ${balance.toLocaleString()}
            </span>
            <p className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              {balance > 0 ? 'Outstanding' : 'Settled'}
            </p>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Front Desk Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleCheckOut(item.id)}
            className="px-2.5 py-1.5 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl text-[11px] font-bold hover:bg-rose-500/25 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            title="Complete Checkout & Settle Folio"
          >
            <LogOut className="w-3.5 h-3.5" />
            Check Out
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="View Real-Time Folio"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/rooms/transfer?bookingId=${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="Suite Transfer"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/restaurant/order?room=${item.roomNumber}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="Post Room Service Order"
          >
            <UtensilsCrossed className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Checked-In Bookings (In-House Guests)"
        description="Active resident guests currently occupying suites across Lazfort Palace. Manage keys, post charges, initiate room transfers, and settle checkout folios."
        badge={`${checkedInBookings.length} Currently In-House`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CalendarCheck}
              onClick={() => navigate('/hotel-admin/bookings/calendar')}
            >
              Room Calendar
            </Button>
            <Button
              variant="outline"
              icon={ArrowRightLeft}
              onClick={() => navigate('/hotel-admin/rooms/transfer')}
            >
              Suite Transfer
            </Button>
          </div>
        }
      />

      <DataTable
        data={checkedInBookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search in-house guests by name, suite number, or ref..."
        pageSize={8}
      />
    </div>
  );
};

export default CheckedInBookingsPage;

