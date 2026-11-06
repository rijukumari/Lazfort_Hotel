import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  ArrowRightLeft,
  Sparkles,
  BedDouble,
  CheckCircle2,
  Clock,
  User,
  Crown,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RoomTransfersPage = () => {
  const navigate = useNavigate();
  const { rooms = [], bookings = [], transferSuite } = useERP();
  const { showToast } = useToast();

  const checkedInBookings = bookings.filter((b) => b.status === 'checked_in');
  const availableRooms = rooms.filter((r) => r.status === 'available');

  const [selectedBookingId, setSelectedBookingId] = useState(checkedInBookings[0]?.id || '');
  const [targetRoomId, setTargetRoomId] = useState(availableRooms[0]?.id || '');
  const [transferReason, setTransferReason] = useState('Patron requested higher floor panoramic Monaco vista');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transfer history log
  const [transferHistory, setTransferHistory] = useState([
    {
      id: 'tr-01',
      guestName: 'Baroness Charlotte von Berg',
      fromRoom: '402',
      toRoom: '502',
      date: '2026-11-03 09:30',
      reason: 'Requested quiet wing overlooking palace courtyard',
      status: 'Completed',
    },
    {
      id: 'tr-02',
      guestName: 'Sir Arthur Sterling',
      fromRoom: '301',
      toRoom: '701',
      date: '2026-11-02 14:15',
      reason: 'Complimentary VIP Suite upgrade to Royal Penthouse',
      status: 'Completed',
    },
    {
      id: 'tr-03',
      guestName: 'Countess Elena Rostova',
      fromRoom: '204',
      toRoom: '404',
      date: '2026-11-01 11:20',
      reason: 'Hydrotherapy jet maintenance in previous chamber',
      status: 'Completed',
    },
  ]);

  const handleExecuteTransfer = (e) => {
    e.preventDefault();
    if (!selectedBookingId || !targetRoomId) {
      if (showToast) {
        showToast('Selection Required', 'Please choose an in-house resident and an available chamber.', 'error');
      }
      return;
    }

    const bkg = bookings.find((b) => b.id === selectedBookingId);
    const destination = rooms.find((r) => r.id === targetRoomId);
    if (!bkg || !destination) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (transferSuite) {
        transferSuite(selectedBookingId, targetRoomId, transferReason);
      }

      const newLog = {
        id: `tr-${Date.now()}`,
        guestName: bkg.guestName,
        fromRoom: String(bkg.roomNumber),
        toRoom: String(destination.roomNumber),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        reason: transferReason,
        status: 'Completed',
      };
      setTransferHistory((prev) => [newLog, ...prev]);

      setIsSubmitting(false);
      if (showToast) {
        showToast(
          'Room Transfer Executed',
          `${bkg.guestName} moved from Chamber ${bkg.roomNumber} to Suite ${destination.roomNumber}. Keycard re-encoded.`,
          'success'
        );
      }
    }, 500);
  };

  const columns = [
    {
      key: 'id',
      header: 'Transfer Ref',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.id}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Resident Patron',
      sortable: true,
      render: (item) => (
        <p className="font-semibold text-primary dark:text-white leading-tight font-serif">
          {item.guestName}
        </p>
      ),
    },
    {
      key: 'transfer',
      header: 'Chamber Transition',
      render: (item) => (
        <div className="flex items-center gap-2 font-mono font-bold text-xs">
          <span className="text-charcoal-muted">Suite {item.fromRoom}</span>
          <ArrowRightLeft className="w-3.5 h-3.5 text-accent" />
          <span className="text-emerald-500">Suite {item.toRoom}</span>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Transfer Reason & Protocol',
      render: (item) => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium">
          {item.reason}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Timestamp',
      sortable: true,
      render: (item) => (
        <span className="text-xs font-mono text-charcoal-muted">{item.date}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Room Transfers & Relocations"
        subtitle="Execute immediate chamber moves, upgrade patrons, and review historical room transfers"
        badge="Room Operations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transfer Action Card */}
        <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="border-b border-border/70 dark:border-white/10 pb-4">
            <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-accent" /> Execute Room Transfer
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Re-encode keycard and swap active reservation chamber
            </p>
          </div>

          <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                Current Resident Guest
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
              >
                {checkedInBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.guestName} (Suite {b.roomNumber} - {b.roomType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                Destination Chamber
              </label>
              <select
                value={targetRoomId}
                onChange={(e) => setTargetRoomId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Suite {r.roomNumber} - {r.type} (${r.price}/night)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                Transfer Reason / Operational Justification
              </label>
              <textarea
                rows={3}
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent resize-none"
                placeholder="Reason for room relocation..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold shadow-md active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isSubmitting ? 'Transferring...' : 'Confirm Room Transfer'}</span>
            </button>
          </form>
        </div>

        {/* Transfer History Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" /> Room Transfer History Log
            </h3>
            <span className="text-xs font-mono text-accent">Audited Moves</span>
          </div>

          <DataTable
            data={transferHistory}
            columns={columns}
            keyExtractor={(item) => item.id}
            pageSize={5}
            emptyMessage="No transfer history logged."
          />
        </div>
      </div>
    </div>
  );
};

export default RoomTransfersPage;

