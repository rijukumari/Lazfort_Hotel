import React, { useState } from 'react';
import { PageHeader, StatCard, Button } from '../../components/ui';
import { SimpleAreaChart } from '../../components/data-display/SimpleChart';
import { monthlyRevenueData, roomCategoryDistribution } from '../../data/mockAnalytics';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BookingModal } from '../../components/forms/BookingModal';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { CalendarCheck, Plus, Sparkles, Key, FileText, BedDouble, TrendingUp, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const HotelAdminDashboard = () => {
  const {
    rooms,
    bookings,
    getOccupancyRate,
    getRevPAR,
    getPendingCleaningCount,
    getActiveMaintenanceCount,
  } = useERP();
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const { showToast } = useToast();

  const bookingColumns = [
    {
      key: 'bookingCode',
      header: 'Folio Ref',
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
          <p className="text-[11px] text-charcoal-muted dark:text-gray-400">{item.guestEmail}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Suite',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-primary dark:text-white">{item.roomNumber}</span>
          <span className="text-[11px] text-charcoal-muted block">{item.roomType}</span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      header: 'Dates',
      sortable: true,
      render: item => (
        <span className="text-xs">
          {item.checkIn} → {item.checkOut}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
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
        <button
          onClick={() => setSelectedInvoiceBooking(item)}
          className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-primary-800 text-charcoal-muted hover:text-accent transition-colors"
          title="View Guest Folio Invoice"
        >
          <FileText className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="General Manager's Operations Console"
        description="Lazfort Grand Palace & Royal Spa — Live occupancy, guest folios, and hospitality telemetry."
        badge="Monte-Carlo Palace"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Key}
              onClick={() => {
                showToast('Concierge Dispatched', 'Butler team notified for VIP arrival.', 'success');
              }}
            >
              Concierge Dispatch
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => setIsNewBookingModalOpen(true)}
            >
              New VIP Booking
            </Button>
          </div>
        }
      />

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Suite Occupancy"
          value={`${getOccupancyRate()}%`}
          change={`${rooms.filter(r => r.status === 'occupied').length} Occupied`}
          isPositive={true}
          icon={BedDouble}
          subtitle={`${rooms.length} Total Suites in Portfolio`}
        />
        <StatCard
          title="RevPAR (Yield Index)"
          value={`$${getRevPAR().toLocaleString()}`}
          change="Yielding Premium"
          isPositive={true}
          icon={TrendingUp}
          subtitle={`ADR: $${Math.round(getRevPAR() / Math.max(0.01, getOccupancyRate() / 100)).toLocaleString()}`}
        />
        <StatCard
          title="Checked-In Guests"
          value={`${bookings.filter(b => b.status === 'checked_in').length} In-House`}
          change={`${bookings.filter(b => b.status === 'confirmed').length} Expected`}
          isPositive={true}
          icon={Award}
          subtitle="VIP Diamond Clearances"
        />
        <StatCard
          title="Housekeeping & Turnovers"
          value={`${getPendingCleaningCount()} Pending`}
          change={`${getActiveMaintenanceCount()} Maintenance`}
          isPositive={getPendingCleaningCount() === 0}
          icon={Sparkles}
          subtitle={`${rooms.filter(r => r.status === 'available').length} Suites Ready For Allocation`}
        />
      </div>

      {/* Analytics Charts & Suite Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 card-luxury-3d p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
                Monthly Net Folio Revenue
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Gross room revenue including private dining & wellness spa bookings
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-accent px-3 py-1 rounded-full bg-accent/15 border border-accent/30 shadow-sm">
              $1.49M MTD
            </span>
          </div>

          <SimpleAreaChart data={monthlyRevenueData} valuePrefix="$" height={260} />
        </div>

        {/* Suite Category Allocation Breakdown */}
        <div className="card-luxury-3d p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white mb-1">
              Suite Distribution
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mb-5">
              Inventory allocation by luxury tier
            </p>

            <div className="space-y-4">
              {roomCategoryDistribution.map(cat => (
                <div key={cat.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-primary dark:text-gray-200">{cat.label}</span>
                    <span className="text-accent font-mono font-bold">
                      {cat.count} Suites ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-ivory dark:bg-primary-950/80 rounded-full overflow-hidden p-0.5 border border-border/40 dark:border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${cat.percentage * 2}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-border/80 dark:border-white/10 flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 mt-6">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              100% Butler Coverage
            </span>
            <span className="font-semibold text-accent font-mono">Full Staffing</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Live Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              Recent Luxury Reservations & Folios
            </h3>
          </div>
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="text-xs text-accent font-semibold hover:underline"
          >
            + Create Walk-in Reservation
          </button>
        </div>

        <DataTable
          data={bookings}
          columns={bookingColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search by booking code, guest name, or suite number..."
          statusFilterKey="status"
          statusOptions={['confirmed', 'checked_in', 'checked_out', 'pending', 'cancelled']}
          pageSize={5}
        />
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
      />

      {/* Invoice Modal Preview */}
      <InvoiceModal
        isOpen={selectedInvoiceBooking !== null}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
      />
    </div>
  );
};

export default HotelAdminDashboard;

