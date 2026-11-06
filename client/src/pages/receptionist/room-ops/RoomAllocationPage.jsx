import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Key,
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Crown,
  Eye,
  RefreshCw,
  X,
  BedDouble,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RoomAllocationPage = () => {
  const navigate = useNavigate();
  const { bookings = [], rooms = [], updateBookingRoom } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [allocationFilter, setAllocationFilter] = useState('all');
  const [allocatingBooking, setAllocatingBooking] = useState(null);
  const [selectedChamberId, setSelectedChamberId] = useState('');
  const [viewingDetailsBooking, setViewingDetailsBooking] = useState(null);

  // Available rooms for assigning
  const availableRooms = useMemo(() => {
    return rooms.filter((r) => r.status === 'available');
  }, [rooms]);

  // Target reservations (confirmed or pending)
  const allocationReservations = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'pending')
      .map((b) => {
        const hasRoom = Boolean(b.roomNumber && b.roomNumber !== '—' && b.roomNumber !== 'Unassigned');
        return {
          ...b,
          isAllocated: hasRoom,
          allocationStatus: hasRoom ? 'Allocated' : 'Unallocated',
        };
      })
      .filter((b) => {
        const matchSearch =
          !searchQuery ||
          b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(b.roomNumber).includes(searchQuery);

        const matchAllocation =
          allocationFilter === 'all' ||
          (allocationFilter === 'allocated' && b.isAllocated) ||
          (allocationFilter === 'unallocated' && !b.isAllocated);

        return matchSearch && matchAllocation;
      });
  }, [bookings, searchQuery, allocationFilter]);

  const handleOpenAllocationModal = (bkg) => {
    setAllocatingBooking(bkg);
    setSelectedChamberId(availableRooms[0]?.id || '');
  };

  const handleConfirmAllocation = () => {
    if (!allocatingBooking || !selectedChamberId) return;

    const chosenRoom = rooms.find((r) => r.id === selectedChamberId);
    if (!chosenRoom) return;

    if (updateBookingRoom) {
      updateBookingRoom(allocatingBooking.id, chosenRoom.roomNumber, chosenRoom.type);
    }

    if (showToast) {
      showToast(
        'Chamber Allocated',
        `Suite ${chosenRoom.roomNumber} (${chosenRoom.type}) assigned to ${allocatingBooking.guestName}.`,
        'success'
      );
    }
    setAllocatingBooking(null);
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation Ref',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.bookingCode}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Details',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight flex items-center gap-1.5 font-serif">
            {item.guestName}
            {item.vipStatus && <Crown className="w-3.5 h-3.5 text-accent" />}
          </p>
          <p className="text-[11px] text-charcoal-muted">{item.guestPhone || item.guestEmail}</p>
        </div>
      ),
    },
    {
      key: 'roomType',
      header: 'Requested Class',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium">
          {item.roomType || 'Deluxe Chamber'}
        </span>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Assigned Chamber',
      sortable: true,
      render: (item) => (
        item.isAllocated ? (
          <span className="font-mono font-bold text-xs text-emerald-500">
            Suite {item.roomNumber}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Pending Chamber
          </span>
        )
      ),
    },
    {
      key: 'checkIn',
      header: 'Stay Window',
      render: (item) => (
        <span className="text-xs text-charcoal-muted font-mono">
          {item.checkIn} → {item.checkOut}
        </span>
      ),
    },
    {
      key: 'allocationStatus',
      header: 'Status',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
            item.isAllocated
              ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
              : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
          }`}
        >
          {item.isAllocated ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {item.allocationStatus}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Allocation Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAllocationModal(item)}
            className="px-2.5 py-1 text-xs rounded-lg bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 font-semibold transition-all flex items-center gap-1 shadow-sm"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{item.isAllocated ? 'Change Suite' : 'Assign Suite'}</span>
          </button>
          <button
            onClick={() => setViewingDetailsBooking(item)}
            className="p-1 rounded-lg hover:bg-ivory dark:hover:bg-primary-800 text-charcoal-muted hover:text-accent transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Chamber Allocation & Key Assignment"
        subtitle="Manage suite allotments for incoming bookings, reassign chamber allocations & verify readiness"
        badge="Room Operations"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Active Reservations"
          value={String(allocationReservations.length)}
          subtitle="Confirmed & pending arrivals"
          icon={CalendarCheck}
          isPositive={true}
        />
        <StatCard
          title="Fully Allocated"
          value={String(allocationReservations.filter((b) => b.isAllocated).length)}
          subtitle="Chamber designated and key-coded"
          icon={CheckCircle2}
          isPositive={true}
        />
        <StatCard
          title="Pending Suite Assignment"
          value={String(allocationReservations.filter((b) => !b.isAllocated).length)}
          subtitle="Awaiting front desk chamber lock"
          icon={Clock}
          isPositive={false}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest, suite or booking ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-muted">Filter:</span>
          <select
            value={allocationFilter}
            onChange={(e) => setAllocationFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Bookings</option>
            <option value="allocated">Allocated Only</option>
            <option value="unallocated">Unallocated Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={allocationReservations}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No reservations match the allocation criteria."
      />

      {/* Allocation Modal */}
      {allocatingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md card-luxury-3d bg-white dark:bg-[#0c121c] border border-accent/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/70 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-accent" /> Assign Chamber Suite
                </h3>
                <p className="text-xs text-charcoal-muted mt-1">
                  Allocate an available room for patron <strong>{allocatingBooking.guestName}</strong> ({allocatingBooking.bookingCode})
                </p>
              </div>
              <button
                onClick={() => setAllocatingBooking(null)}
                className="p-1.5 rounded-full hover:bg-ivory dark:hover:bg-primary-900/40 text-charcoal-muted hover:text-accent transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto no-scrollbar flex-1">
              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Select Available Chamber
                </label>
                <select
                  value={selectedChamberId}
                  onChange={(e) => setSelectedChamberId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
                >
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Suite {r.roomNumber} - {r.type} (${r.price}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5 space-y-1">
                <p className="font-semibold text-primary dark:text-white">Stay Parameters</p>
                <p className="text-charcoal-muted font-mono">
                  {allocatingBooking.checkIn} to {allocatingBooking.checkOut} ({allocatingBooking.nights || 2} Nights)
                </p>
              </div>
            </div>

            <div className="p-4 sm:px-6 border-t border-border/70 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setAllocatingBooking(null)}
                className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAllocation}
                className="btn-luxury px-5 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Chamber Allocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewingDetailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md card-luxury-3d p-6 sm:p-8 space-y-5 bg-white dark:bg-[#0c121c] border border-accent/30 shadow-2xl rounded-3xl">
            <button
              onClick={() => setViewingDetailsBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-ivory dark:hover:bg-primary-900/40 text-charcoal-muted hover:text-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white">
                Reservation Dossier
              </h3>
              <p className="font-mono text-xs text-accent mt-0.5">{viewingDetailsBooking.bookingCode}</p>
            </div>

            <div className="space-y-2.5 text-xs border-t border-border/60 dark:border-white/10 pt-3">
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Guest Name</span>
                <span className="font-semibold text-primary dark:text-white">{viewingDetailsBooking.guestName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Email / Phone</span>
                <span className="font-mono text-primary dark:text-white">{viewingDetailsBooking.guestPhone || viewingDetailsBooking.guestEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Stay Dates</span>
                <span className="font-mono text-primary dark:text-white">{viewingDetailsBooking.checkIn} → {viewingDetailsBooking.checkOut}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Current Assigned Chamber</span>
                <span className="font-bold text-accent">Suite {viewingDetailsBooking.roomNumber || 'Pending'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="gold" onClick={() => setViewingDetailsBooking(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllocationPage;

