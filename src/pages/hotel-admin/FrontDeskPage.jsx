import React, { useState } from 'react';
import { PageHeader, StatCard, Modal, FormField, Input, Select, Button } from '../../components/ui';
import { CalendarView } from '../../components/data-display/CalendarView';
import { BookingModal } from '../../components/forms/BookingModal';
import { Plus, ArrowRightLeft, Sparkles, BedDouble, CheckCircle, LogOut } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const FrontDeskPage = () => {
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { rooms, bookings, transferSuite } = useERP();
  const { showToast } = useToast();

  const checkedInBookings = bookings.filter(b => b.status === 'checked_in');
  const availableRooms = rooms.filter(r => r.status === 'available');

  const [selectedBookingId, setSelectedBookingId] = useState(checkedInBookings[0]?.id || '');
  const [targetRoomId, setTargetRoomId] = useState(availableRooms[0]?.id || '');
  const [transferReason, setTransferReason] = useState('VIP Guest requested panoramic sea view upgrade');

  const handleOpenTransferModal = () => {
    if (checkedInBookings.length === 0) {
      showToast('No Active Guests', 'There are currently no checked-in guests eligible for suite transfer.', 'info');
      return;
    }
    if (availableRooms.length === 0) {
      showToast('No Available Suites', 'All suites are currently occupied or reserved. No transfer target available.', 'warning');
      return;
    }
    setSelectedBookingId(checkedInBookings[0].id);
    setTargetRoomId(availableRooms[0].id);
    setIsTransferModalOpen(true);
  };

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    if (!selectedBookingId || !targetRoomId) {
      showToast('Validation Error', 'Please select both an active guest and an available destination suite.', 'error');
      return;
    }

    const res = transferSuite(selectedBookingId, targetRoomId, transferReason);
    if (res?.success) {
      showToast('Suite Transfer Executed', res.message, 'success');
      setIsTransferModalOpen(false);
    } else {
      showToast('Transfer Failed', res?.message || 'Transfer failed', 'error');
    }
  };

  const activeSelectedBooking = bookings.find(b => b.id === selectedBookingId);
  const destinationRoom = rooms.find(r => r.id === targetRoomId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Concierge & Front Desk Operations"
        description="Lazfort Palace Monte-Carlo — Real-time guest arrivals, key allocations, walk-in reservations, and suite occupancy timeline."
        badge="Front Office Command"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={ArrowRightLeft}
              onClick={handleOpenTransferModal}
            >
              Suite Transfer
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => setIsWalkInOpen(true)}
            >
              New Walk-In Stay
            </Button>
          </div>
        }
      />

      {/* Front Desk Snapshot Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Arrivals"
          value={`${bookings.filter(b => b.status === 'confirmed').length} Expected`}
          change={`${bookings.filter(b => b.status === 'checked_in').length} Checked-In`}
          isPositive={true}
          icon={CheckCircle}
          subtitle="Helipad & Chauffeur"
        />
        <StatCard
          title="Scheduled Departures"
          value={`${bookings.filter(b => b.status === 'checked_in').length} Departures`}
          change="All folios live tracked"
          isPositive={true}
          icon={LogOut}
          subtitle="Luggage Porter Ready"
        />
        <StatCard
          title="Suites Ready For Allocation"
          value={`${rooms.filter(r => r.status === 'available').length} Clean`}
          change="Inspected by Housekeeping"
          isPositive={true}
          icon={Sparkles}
          subtitle="Sanitized 100%"
        />
        <StatCard
          title="Walk-in Inventory"
          value={`${rooms.filter(r => r.status === 'available').length} Suites`}
          change="Presidential & Penthouse open"
          isPositive={true}
          icon={BedDouble}
          subtitle="Instant Key Issuance"
        />
      </div>

      {/* Interactive Suite Availability Timeline Grid */}
      <CalendarView />

      {/* Walk-in Booking Modal */}
      <BookingModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
      />

      {/* Suite Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Execute VIP Suite Transfer"
        subtitle="Relocate in-house guest to an upgraded available suite and queue previous room for turnover"
        maxWidth="lg"
      >
        <form onSubmit={handleExecuteTransfer} className="space-y-4">
          <FormField label="Active In-House Guest / Current Suite" required>
            <Select
              value={selectedBookingId}
              onChange={e => setSelectedBookingId(e.target.value)}
            >
              {checkedInBookings.length > 0 ? (
                checkedInBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.guestName} — Suite {b.roomNumber} ({b.roomType})
                  </option>
                ))
              ) : (
                <option value="" disabled>No checked-in guests available</option>
              )}
            </Select>
          </FormField>

          <FormField label="Destination Available Suite" required>
            <Select
              value={targetRoomId}
              onChange={e => setTargetRoomId(e.target.value)}
            >
              {availableRooms.length > 0 ? (
                availableRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Suite {r.roomNumber} — {r.type} (${r.pricePerNight?.toLocaleString()}/night, Floor {r.floor})
                  </option>
                ))
              ) : (
                <option value="" disabled>No available suites for transfer</option>
              )}
            </Select>
          </FormField>

          <FormField label="Operational Transfer Reason" required>
            <Input
              type="text"
              required
              value={transferReason}
              onChange={e => setTransferReason(e.target.value)}
              placeholder="e.g. VIP Upgrade / Sea view terrace request / Maintenance"
            />
          </FormField>

          {activeSelectedBooking && destinationRoom && (
            <div className="p-3.5 rounded-2xl bg-ivory dark:bg-black/30 border border-border dark:border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-charcoal-muted">Current Suite:</span>
                <span className="text-primary dark:text-white">Suite {activeSelectedBooking.roomNumber} ({activeSelectedBooking.roomType})</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span className="text-charcoal-muted">New Suite:</span>
                <span className="text-accent font-bold">Suite {destinationRoom.roomNumber} ({destinationRoom.type})</span>
              </div>
              <div className="pt-2 border-t border-border/50 text-[11px] text-charcoal-muted">
                ⚠️ Suite {activeSelectedBooking.roomNumber} will automatically transition to <b className="text-amber-500">Cleaning</b> and a Housekeeping turnover task will be dispatched immediately.
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
            >
              Authorize & Transfer Suite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FrontDeskPage;

