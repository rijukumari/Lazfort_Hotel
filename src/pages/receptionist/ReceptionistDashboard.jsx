import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BookingModal } from '../../components/forms/BookingModal';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { LogOut, Plus, FileText, Key } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { bookings, rooms, checkInGuest, checkOutGuest } = useERP();
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { showToast } = useToast();

  const handleFastCheckIn = (bkg) => {
    const res = checkInGuest(bkg.id);
    if (res && res.success) {
      showToast(
        'Guest Checked In',
        `Room key card issued for ${bkg.guestName} in Suite ${bkg.roomNumber}. Welcome amenities dispatched.`,
        'success'
      );
    } else {
      showToast('Check-In Failed', res?.message || 'Error occurred', 'error');
    }
  };

  const handleFastCheckOut = (bkg) => {
    const res = checkOutGuest(bkg.id);
    if (res && res.success) {
      showToast(
        'Guest Checked Out',
        `Folio finalized for ${bkg.guestName}. Suite ${bkg.roomNumber} queued for housekeeping.`,
        'info'
      );
    } else {
      showToast('Checkout Failed', res?.message || 'Error occurred', 'error');
    }
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation Ref',
      sortable: true,
      render: item => <span className="font-mono text-xs font-bold text-accent">{item.bookingCode}</span>,
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.guestName}</p>
          <p className="text-[11px] text-charcoal-muted">{item.guestPhone}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Assigned Suite',
      sortable: true,
      render: item => (
        <span className="font-semibold text-primary dark:text-white">
          {item.roomNumber} ({item.roomType})
        </span>
      ),
    },
    {
      key: 'checkIn',
      header: 'Stay Window',
      sortable: true,
      render: item => (
        <span className="text-xs">
          {item.checkIn} to {item.checkOut}
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
      header: 'Front Desk Action',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedInvoice(item)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent"
            title="Folio Invoice"
          >
            <FileText className="w-4 h-4" />
          </button>
          {item.status === 'confirmed' && (
            <button
              onClick={() => handleFastCheckIn(item)}
              className="px-2.5 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Key className="w-3.5 h-3.5" />
              Check In
            </button>
          )}
          {item.status === 'checked_in' && (
            <button
              onClick={() => handleFastCheckOut(item)}
              className="px-2.5 py-1.5 bg-white/80 dark:bg-primary-900/80 border border-border/80 dark:border-white/15 text-charcoal dark:text-gray-200 rounded-xl text-[11px] font-bold hover:border-accent hover:text-accent transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-accent" />
              Check Out
            </button>
          )}
        </div>
      ),
    },
  ];

  const availableCount = (rooms || []).filter(r => r.status === 'available').length;
  const expectedArrivals = (bookings || []).filter(b => b.status === 'confirmed').length;
  const checkedInCount = (bookings || []).filter(b => b.status === 'checked_in').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Reception & Concierge Desk"
        description="Instant guest check-ins, room key issuance, daily arrivals, departures, and walk-in stays."
        badge="Active Front Desk"
        actions={
          <button
            onClick={() => navigate('/bookings/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Plus className="w-4 h-4" />
            New Walk-in Guest
          </button>
        }
      />

      <StatsGrid columns={4}>
        <StatCard
          title="Today's Expected Arrivals"
          value={`${expectedArrivals} Expected`}
          change={`${checkedInCount} Checked-In`}
          isPositive={true}
          iconName="CheckCircle"
        />
        <StatCard
          title="In-House Guests"
          value={`${checkedInCount} Active Stays`}
          change="Real-time occupancy"
          isPositive={true}
          iconName="LogOut"
        />
        <StatCard
          title="Available Vacant Suites"
          value={`${availableCount} Suites`}
          change="Cleaned & Sanitized"
          isPositive={true}
          iconName="BedDouble"
        />
        <StatCard
          title="VIP Butler Requests"
          value="5 Dispatched"
          change="Champagne & Chauffeur"
          isPositive={true}
          iconName="Sparkles"
        />
      </StatsGrid>

      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
          Today's Arrivals & Resident Guests
        </h3>
        <DataTable
          data={bookings || []}
          columns={columns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search by guest name, reservation code, or suite number..."
          pageSize={5}
        />
      </div>

      <BookingModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
      />

      <InvoiceModal
        isOpen={selectedInvoice !== null}
        onClose={() => setSelectedInvoice(null)}
        booking={selectedInvoice}
      />
    </div>
  );
};

export default ReceptionistDashboard;

