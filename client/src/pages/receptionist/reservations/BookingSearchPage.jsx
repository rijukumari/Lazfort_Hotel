import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button } from '../../../components/ui';
import { BookingStatusBadge, PaymentStatusBadge } from '../../../components/booking/BookingStatusBadge';
import { InvoiceModal } from '../../../components/data-display/InvoiceModal';
import { useERP } from '../../../context/ERPContext';
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  BedDouble,
  User,
  CreditCard,
  Eye,
  FileText,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const BookingSearchPage = () => {
  const navigate = useNavigate();
  const { bookings = [], rooms = [] } = useERP();

  // Search & Filter Criteria
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [checkInFrom, setCheckInFrom] = useState('');
  const [checkOutTo, setCheckOutTo] = useState('');

  // Selected booking for folio modal
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  // Extract unique room types
  const roomTypes = useMemo(() => {
    const types = new Set();
    bookings.forEach(b => {
      if (b.roomType) types.add(b.roomType);
    });
    return Array.from(types);
  }, [bookings]);

  // Filtering Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // 1. Text Search: Booking ID, Guest Name, Email, Phone, Room Number
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchCode = b.bookingCode?.toLowerCase().includes(q);
        const matchName = b.guestName?.toLowerCase().includes(q);
        const matchEmail = b.guestEmail?.toLowerCase().includes(q);
        const matchPhone = b.guestPhone?.toLowerCase().includes(q);
        const matchRoom = b.roomNumber?.toString().includes(q);
        if (!matchCode && !matchName && !matchEmail && !matchPhone && !matchRoom) {
          return false;
        }
      }

      // 2. Booking Status
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }

      // 3. Payment Status
      if (paymentFilter !== 'all' && b.paymentStatus !== paymentFilter) {
        return false;
      }

      // 4. Room Type
      if (roomTypeFilter !== 'all' && b.roomType !== roomTypeFilter) {
        return false;
      }

      // 5. Check-In Date From
      if (checkInFrom && new Date(b.checkIn) < new Date(checkInFrom)) {
        return false;
      }

      // 6. Check-Out Date To
      if (checkOutTo && new Date(b.checkOut) > new Date(checkOutTo)) {
        return false;
      }

      return true;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter, roomTypeFilter, checkInFrom, checkOutTo]);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setRoomTypeFilter('all');
    setCheckInFrom('');
    setCheckOutTo('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Universal Reservation Search & Lookup"
        description="Instant multi-parameter query engine across all active, archived, and confirmed guest booking folios."
        badge={`${filteredBookings.length} Matches Found`}
        actions={
          <Button
            variant="gold"
            onClick={() => navigate('/receptionist/reservations/new')}
            icon={Sparkles}
          >
            Create Reservation
          </Button>
        }
      />

      {/* Advanced Filter Panel */}
      <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Filter Parameters & Search Query
            </h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>

        {/* Global Text Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-accent absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Booking ID (e.g. AUR-9921), Guest Name, Email, Phone, or Suite Number..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-ivory dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs sm:text-sm font-medium text-primary dark:text-white focus:outline-none focus:border-accent transition-all shadow-sm"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Booking Status */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Booking Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In (In-House)</option>
              <option value="checked_out">Checked Out</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Payment States</option>
              <option value="paid">Settled / Paid</option>
              <option value="pending">Pending Settlement</option>
              <option value="partial">Partially Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Room Type */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Suite Collection
            </label>
            <select
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Collections</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Check-In Date From */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Check-In From
            </label>
            <input
              type="date"
              value={checkInFrom}
              onChange={e => setCheckInFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </div>

          {/* Check-Out Date To */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Check-Out To
            </label>
            <input
              type="date"
              value={checkOutTo}
              onChange={e => setCheckOutTo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {filteredBookings.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/60 dark:bg-surface-dark/60 border border-dashed border-border dark:border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-accent/15 border border-accent/30 text-accent mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-primary dark:text-white">
            No Reservations Found
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            No matching reservation records were found for the selected query and filters. Try adjusting your
            search criteria or reset parameters to view all bookings.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 px-1">
            <span>
              Displaying <strong className="text-primary dark:text-white font-mono">{filteredBookings.length}</strong> matching records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map(b => {
              const room = (rooms || []).find(r => r.id === b.roomId);

              return (
                <div
                  key={b.id}
                  className="card-luxury-3d p-5 sm:p-6 rounded-3xl overflow-hidden transition-all duration-300 hover:border-accent/50 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-accent px-3 py-1 rounded-xl bg-accent/15 border border-accent/30">
                        {b.bookingCode}
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-tight">
                          {b.guestName}
                        </h4>
                        <span className="text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">
                          {b.guestEmail} • {b.guestPhone || 'No Phone Recorded'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookingStatusBadge status={b.status} />
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </div>
                  </div>

                  {/* Middle Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Assigned Chamber
                      </span>
                      <span className="font-serif font-bold text-primary dark:text-white text-sm">
                        Suite {b.roomNumber}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block truncate">
                        {b.roomType}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Check-In Date
                      </span>
                      <span className="font-mono font-semibold text-primary dark:text-white">
                        {b.checkIn}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block">From 15:00</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Check-Out Date
                      </span>
                      <span className="font-mono font-semibold text-primary dark:text-white">
                        {b.checkOut}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block">
                        {b.nights} Night(s)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                        Total Tariff Folio
                      </span>
                      <span className="font-serif font-bold text-accent text-sm">
                        €{b.totalAmount?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
                        Paid: €{b.paidAmount?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-border/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                      Channel: <strong className="text-primary dark:text-white">{b.bookingSource || 'Direct Reservation'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="px-3.5 py-1.5 rounded-xl btn-secondary-3d font-semibold text-charcoal dark:text-gray-200 hover:text-accent flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        <span>View Folio / Invoice</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/hotel-admin/bookings/folio/${b.id}`)}
                        className="px-3.5 py-1.5 rounded-xl gold-gradient-bg text-primary-950 font-bold flex items-center gap-1.5 shadow-sm btn-3d"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage Folio Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Folio / Invoice Modal */}
      <InvoiceModal
        isOpen={selectedInvoiceBooking !== null}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
      />
    </div>
  );
};

export default BookingSearchPage;

