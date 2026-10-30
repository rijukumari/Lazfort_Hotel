import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  ArrowRightLeft,
  Sparkles,
  BedDouble,
  CheckCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const SuiteTransferPage = () => {
  const navigate = useNavigate();
  const { rooms, bookings, transferSuite } = useERP();
  const { showToast } = useToast();

  const checkedInBookings = (bookings || []).filter(b => b.status === 'checked_in');
  const availableRooms = (rooms || []).filter(r => r.status === 'available');

  const [selectedBookingId, setSelectedBookingId] = useState(checkedInBookings[0]?.id || '');
  const [targetRoomId, setTargetRoomId] = useState(availableRooms[0]?.id || '');
  const [transferReason, setTransferReason] = useState('VIP Guest requested panoramic sea view upgrade');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSelectedBooking = bookings.find(b => b.id === selectedBookingId);
  const destinationRoom = rooms.find(r => r.id === targetRoomId);

  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    if (!selectedBookingId || !targetRoomId) {
      showToast('Validation Error', 'Please select both an active guest and an available destination suite.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const res = transferSuite(selectedBookingId, targetRoomId, transferReason);
      if (res?.success) {
        showToast('Suite Transfer Executed', res.message, 'success');
        navigate('/hotel-admin/front-desk');
      } else {
        showToast('Transfer Failed', res?.message || 'Transfer failed', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80 dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link
            to="/hotel-admin/front-desk"
            className="w-10 h-10 rounded-2xl border border-border dark:border-white/10 flex items-center justify-center text-charcoal hover:text-accent dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-900/50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary dark:text-white tracking-tight">
                Execute VIP Suite Transfer
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/40 shadow-sm">
                <Sparkles className="w-3 h-3 text-accent" />
                Live Room Migration
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400 mt-1">
              Relocate an in-house guest to an upgraded suite, update folios, and dispatch an immediate turnover task.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transfer Form Card */}
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8 space-y-6">
            {checkedInBookings.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <h3 className="font-bold text-sm">No Active Checked-In Guests</h3>
                <p className="text-xs mt-1">There are currently no in-house guests eligible for suite relocation.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/hotel-admin/front-desk')}
                >
                  Return to Front Desk
                </Button>
              </div>
            ) : availableRooms.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <h3 className="font-bold text-sm">No Vacant Ready Suites</h3>
                <p className="text-xs mt-1">All suites are currently occupied or awaiting housekeeping turnover.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/hotel-admin/front-desk')}
                >
                  Return to Front Desk
                </Button>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-6">
                <FormField label="Active In-House Guest / Current Suite" required>
                  <Select
                    value={selectedBookingId}
                    onChange={e => setSelectedBookingId(e.target.value)}
                  >
                    {checkedInBookings.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.guestName} — Suite {b.roomNumber} ({b.roomType})
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Destination Available Suite" required>
                  <Select
                    value={targetRoomId}
                    onChange={e => setTargetRoomId(e.target.value)}
                  >
                    {availableRooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Suite {r.roomNumber} — {r.type} (${r.pricePerNight?.toLocaleString()}/night, Floor {r.floor})
                      </option>
                    ))}
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
                  <div className="p-5 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border dark:border-white/10 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-primary dark:text-white flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-accent" />
                      Transfer Operational Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                      <div className="p-3 rounded-xl bg-white/70 dark:bg-black/20 border border-border/60 dark:border-white/5">
                        <span className="text-charcoal-muted block text-[10px] uppercase font-bold tracking-wider">Origin Suite (Vacating)</span>
                        <p className="font-bold text-primary dark:text-white mt-1">Suite {activeSelectedBooking.roomNumber}</p>
                        <span className="text-[11px] text-accent font-medium">{activeSelectedBooking.roomType}</span>
                        <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          ↳ Transitions to Housekeeping Cleaning
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/70 dark:bg-black/20 border border-border/60 dark:border-white/5">
                        <span className="text-charcoal-muted block text-[10px] uppercase font-bold tracking-wider">Destination Suite (Occupying)</span>
                        <p className="font-bold text-primary dark:text-white mt-1">Suite {destinationRoom.roomNumber}</p>
                        <span className="text-[11px] text-accent font-medium">{destinationRoom.type}</span>
                        <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          ↳ Instantly Assigned & Key Card Activated
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate('/hotel-admin/front-desk')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    type="submit"
                    loading={isSubmitting}
                    icon={CheckCircle}
                  >
                    Authorize & Transfer Suite
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Sidebar Info Card */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-accent" />
              Transfer Protocol
            </h3>
            <ul className="text-xs text-charcoal-muted dark:text-gray-300 space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span>The guest's active master folio and incidental charges remain preserved and seamlessly attach to the new suite.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span>The origin suite is marked for priority turnover cleaning and queued in the housekeeping console.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                <span>Concierge & luggage porters will receive an automated dispatch notification.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuiteTransferPage;

