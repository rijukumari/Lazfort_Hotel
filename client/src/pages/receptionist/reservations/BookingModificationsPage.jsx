import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Modal } from '../../../components/ui';
import { BookingStatusBadge } from '../../../components/booking/BookingStatusBadge';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Edit3,
  Calendar,
  BedDouble,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Save,
  Sparkles,
  ShieldAlert,
  ArrowLeftRight
} from 'lucide-react';

export const BookingModificationsPage = () => {
  const navigate = useNavigate();
  const { bookings = [], rooms = [], updateBooking } = useERP();
  const { showToast } = useToast();

  // Selected booking for modification
  const [editingBooking, setEditingBooking] = useState(null);

  // Form states for active modification
  const [newRoomId, setNewRoomId] = useState('');
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [newAdults, setNewAdults] = useState(2);
  const [newCustomRate, setNewCustomRate] = useState('');
  const [modificationReason, setModificationReason] = useState('VIP guest request for suite upgrade');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audit history log
  const [auditLog, setAuditLog] = useState([
    {
      id: 'mod-1',
      bookingCode: 'AUR-9921',
      guestName: 'Duke William Somerset',
      action: 'Suite Upgrade Approved',
      details: 'Transferred from Deluxe Villa to Royal Penthouse (PH-1201)',
      authorizedBy: 'Front Desk Lead Camilla Valente',
      timestamp: 'Today, 11:30 AM',
      status: 'approved',
    },
    {
      id: 'mod-2',
      bookingCode: 'AUR-9923',
      guestName: 'Baroness Charlotte von Berg',
      action: 'Stay Extended (+2 Nights)',
      details: 'New check-out date adjusted to 04 Nov 2026. Tariff recalculated.',
      authorizedBy: 'Concierge Julian St. Clair',
      timestamp: 'Yesterday, 16:45 PM',
      status: 'approved',
    },
  ]);

  // Open modification modal and populate current values
  const handleOpenModifyModal = (booking) => {
    setEditingBooking(booking);
    setNewRoomId(booking.roomId || rooms[0]?.id || '');
    setNewCheckIn(booking.checkIn);
    setNewCheckOut(booking.checkOut);
    setNewAdults(booking.adults || 2);
    setNewCustomRate('');
    setModificationReason('VIP guest request for suite upgrade / schedule extension');
  };

  // Compute recalculated values
  const currentRoom = useMemo(() => {
    if (!editingBooking) return null;
    return rooms.find(r => r.id === editingBooking.roomId) || { roomNumber: editingBooking.roomNumber, type: editingBooking.roomType, pricePerNight: 1200 };
  }, [editingBooking, rooms]);

  const targetRoom = useMemo(() => {
    if (!newRoomId) return currentRoom;
    return rooms.find(r => r.id === newRoomId) || currentRoom;
  }, [newRoomId, rooms, currentRoom]);

  const newNights = useMemo(() => {
    if (!newCheckIn || !newCheckOut) return 1;
    const diff = (new Date(newCheckOut) - new Date(newCheckIn)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) || 1);
  }, [newCheckIn, newCheckOut]);

  const nightlyRateToApply = newCustomRate !== '' ? Number(newCustomRate) : (targetRoom?.pricePerNight || 1200);
  const newBaseTariff = nightlyRateToApply * newNights;
  const newTax = Math.round(newBaseTariff * 0.10);
  const newService = Math.round(newBaseTariff * 0.05);
  const newTotalAmount = newBaseTariff + newTax + newService;
  const tariffDiff = editingBooking ? newTotalAmount - (editingBooking.totalAmount || 0) : 0;

  // Save changes handler
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    if (new Date(newCheckOut) <= new Date(newCheckIn)) {
      showToast('Date Error', 'Check-out date must be after check-in date.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // 1. Update booking in ERP context
      if (updateBooking) {
        updateBooking(editingBooking.id, {
          roomId: targetRoom.id,
          roomNumber: targetRoom.roomNumber,
          roomType: targetRoom.type,
          checkIn: newCheckIn,
          checkOut: newCheckOut,
          nights: newNights,
          adults: Number(newAdults),
          totalAmount: newTotalAmount,
          specialRequests: `${editingBooking.specialRequests || ''} [Modified: ${modificationReason}]`,
        });
      }

      // 2. Append to audit trail
      const newLog = {
        id: `mod-${Date.now()}`,
        bookingCode: editingBooking.bookingCode,
        guestName: editingBooking.guestName,
        action: targetRoom.roomNumber !== editingBooking.roomNumber ? 'Suite Transfer & Reschedule' : 'Itinerary Rescheduled',
        details: `Updated to Suite ${targetRoom.roomNumber} (${newNights} nights, €${newTotalAmount.toLocaleString()}). Reason: ${modificationReason}`,
        authorizedBy: 'Front Desk Lead / Concierge',
        timestamp: 'Just now',
        status: 'approved',
      };
      setAuditLog(prev => [newLog, ...prev]);

      setIsSubmitting(false);
      setEditingBooking(null);
      showToast(
        'Modification Approved & Applied',
        `Reservation ${editingBooking.bookingCode} successfully updated in primary PMS inventory.`,
        'success'
      );
    }, 450);
  };

  const handleRejectModification = (booking) => {
    const newLog = {
      id: `mod-${Date.now()}`,
      bookingCode: booking.bookingCode,
      guestName: booking.guestName,
      action: 'Modification Rejected',
      details: 'Requested chamber change declined due to VIP allocation rules.',
      authorizedBy: 'Front Desk Lead',
      timestamp: 'Just now',
      status: 'rejected',
    };
    setAuditLog(prev => [newLog, ...prev]);
    showToast('Modification Declined', `Request for ${booking.bookingCode} recorded as rejected.`, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Reservation Modification & Chamber Transfers"
        description="Authorized front desk console for room re-allocations, itinerary date extensions, party size revisions, and audit tracking."
        badge="Clearance Required"
      />

      {/* Active Modifiable Reservations Table / Cards */}
      <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider">
              Live Folios
            </span>
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white mt-0.5">
              Reservations Eligible for Modification ({bookings.length})
            </h3>
          </div>
          <span className="text-xs text-charcoal-muted dark:text-gray-400">
            Select a stay to modify dates, chambers, or tariffs
          </span>
        </div>

        <div className="space-y-4">
          {bookings.slice(0, 8).map(b => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:border-accent/50"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="font-mono text-xs font-bold text-accent px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 shrink-0">
                  {b.bookingCode}
                </span>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                      {b.guestName}
                    </h4>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Current: <strong className="text-primary dark:text-white">Suite {b.roomNumber}</strong> ({b.roomType}) •{' '}
                    <span className="font-mono">{b.checkIn} → {b.checkOut}</span> ({b.nights} Nights)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-3 text-xs pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60 dark:border-white/10">
                <div className="text-right mr-2">
                  <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Current Folio</span>
                  <span className="font-serif font-bold text-accent text-sm">€{b.totalAmount?.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRejectModification(b)}
                    className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold transition-colors"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModifyModal(b)}
                    className="px-4 py-1.5 rounded-xl gold-gradient-bg text-primary-950 font-bold flex items-center gap-1.5 btn-3d shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modify Itinerary</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit History Trail */}
      <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white">
              Sovereign Modification Audit Trail
            </h3>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold text-accent">
            Immutable History
          </span>
        </div>

        <div className="divide-y divide-border/60 dark:divide-white/10">
          {auditLog.map(log => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-accent">{log.bookingCode}</span>
                  <span className="text-primary dark:text-white font-semibold">{log.guestName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                      log.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {log.action}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-300">
                  {log.details}
                </p>
              </div>

              <div className="text-right text-[11px] text-charcoal-muted font-mono shrink-0">
                <span className="block text-accent font-semibold">{log.authorizedBy}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modification Modal with Before/After Diff */}
      <Modal
        isOpen={editingBooking !== null}
        onClose={() => setEditingBooking(null)}
        title="Modify Sovereign Reservation"
        subtitle={`Booking Ref: ${editingBooking?.bookingCode} — ${editingBooking?.guestName}`}
        maxWidth="xl"
      >
        {editingBooking && (
          <form onSubmit={handleSaveChanges} className="space-y-6 text-xs">
            {/* Before / After Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CURRENT (BEFORE) */}
              <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/60 border border-border/80 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-white/10">
                  <span className="font-mono text-[10px] uppercase font-bold text-charcoal-muted">
                    Current Record (Before)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-charcoal/10 dark:bg-white/10 text-charcoal-muted">
                    Locked
                  </span>
                </div>

                <div className="space-y-1.5 text-charcoal-muted dark:text-gray-400">
                  <p>
                    Chamber:{' '}
                    <strong className="text-primary dark:text-white font-serif">
                      Suite {editingBooking.roomNumber} ({editingBooking.roomType})
                    </strong>
                  </p>
                  <p>
                    Check-In: <strong className="font-mono text-primary dark:text-white">{editingBooking.checkIn}</strong>
                  </p>
                  <p>
                    Check-Out: <strong className="font-mono text-primary dark:text-white">{editingBooking.checkOut}</strong>
                  </p>
                  <p>
                    Duration: <strong className="text-primary dark:text-white">{editingBooking.nights} Nights</strong>
                  </p>
                  <p>
                    Total Folio:{' '}
                    <strong className="text-primary dark:text-white font-mono">
                      €{editingBooking.totalAmount?.toLocaleString()}
                    </strong>
                  </p>
                </div>
              </div>

              {/* UPDATED (AFTER) */}
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-accent/25">
                  <span className="font-mono text-[10px] uppercase font-bold text-accent">
                    New Proposed Record (After)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/20 text-accent font-bold">
                    Draft Changes
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-charcoal-muted dark:text-gray-300">
                    Chamber:{' '}
                    <strong className="text-primary dark:text-white font-serif">
                      Suite {targetRoom?.roomNumber} ({targetRoom?.type})
                    </strong>
                  </p>
                  <p className="text-charcoal-muted dark:text-gray-300">
                    Check-In: <strong className="font-mono text-primary dark:text-white">{newCheckIn}</strong>
                  </p>
                  <p className="text-charcoal-muted dark:text-gray-300">
                    Check-Out: <strong className="font-mono text-primary dark:text-white">{newCheckOut}</strong>
                  </p>
                  <p className="text-charcoal-muted dark:text-gray-300">
                    Duration: <strong className="text-primary dark:text-white">{newNights} Nights</strong>
                  </p>
                  <p className="text-charcoal-muted dark:text-gray-300">
                    Recalculated Folio:{' '}
                    <strong className="text-accent font-serif font-bold text-sm">
                      €{newTotalAmount.toLocaleString()}
                    </strong>{' '}
                    <span className={tariffDiff >= 0 ? 'text-emerald-500 font-mono text-[11px]' : 'text-amber-500 font-mono text-[11px]'}>
                      ({tariffDiff >= 0 ? `+€${tariffDiff.toLocaleString()}` : `-€${Math.abs(tariffDiff).toLocaleString()}`})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Editable Form Controls */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Re-Allocate Suite Chamber
                </label>
                <select
                  value={newRoomId}
                  onChange={e => setNewRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Suite {r.roomNumber} — {r.name} ({r.type}) — €{r.pricePerNight?.toLocaleString()}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    New Check-In Date
                  </label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={e => setNewCheckIn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    New Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={e => setNewCheckOut(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Occupants Count
                  </label>
                  <select
                    value={newAdults}
                    onChange={e => setNewAdults(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-medium text-primary dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} Guests</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Custom Nightly Rate Override (€) (Optional)
                  </label>
                  <input
                    type="number"
                    value={newCustomRate}
                    onChange={e => setNewCustomRate(e.target.value)}
                    placeholder={`Default: €${targetRoom?.pricePerNight?.toLocaleString()}`}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-mono text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Reason for Modification & Authority Clearance <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={modificationReason}
                  onChange={e => setModificationReason(e.target.value)}
                  placeholder="e.g. VIP guest upgrade, travel flight change, complimentary extension"
                  className="w-full px-4 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70 dark:border-white/10">
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="px-4 py-2.5 rounded-xl btn-secondary-3d font-semibold text-charcoal dark:text-gray-300"
              >
                Cancel Without Saving
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold hover:opacity-95 transition-all btn-3d shadow-gold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Changes...' : 'Approve & Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BookingModificationsPage;

