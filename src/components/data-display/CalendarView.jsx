import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, CheckCircle, LogOut } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { BookingModal } from '../forms/BookingModal';

export const CalendarView = () => {
  const { rooms, bookings, checkInGuest, checkOutGuest, folios } = useERP();
  const { showToast } = useToast();

  const months = ['September 2026', 'October 2026', 'November 2026'];
  const [monthIndex, setMonthIndex] = useState(1); // Default to October 2026
  const selectedMonth = months[monthIndex];

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [prefilledRoomId, setPrefilledRoomId] = useState(undefined);

  // Generate 7 days for the demo calendar view based on selected month
  const daysByMonth = {
    'September 2026': [
      { dayNumber: 20, label: 'Sun', date: '2026-09-20' },
      { dayNumber: 21, label: 'Mon', date: '2026-09-21' },
      { dayNumber: 22, label: 'Tue', date: '2026-09-22' },
      { dayNumber: 23, label: 'Wed', date: '2026-09-23' },
      { dayNumber: 24, label: 'Thu', date: '2026-09-24' },
      { dayNumber: 25, label: 'Fri', date: '2026-09-25' },
      { dayNumber: 26, label: 'Sat', date: '2026-09-26' },
    ],
    'October 2026': [
      { dayNumber: 25, label: 'Sun', date: '2026-10-25' },
      { dayNumber: 26, label: 'Mon', date: '2026-10-26' },
      { dayNumber: 27, label: 'Tue', date: '2026-10-27', isToday: true },
      { dayNumber: 28, label: 'Wed', date: '2026-10-28' },
      { dayNumber: 29, label: 'Thu', date: '2026-10-29' },
      { dayNumber: 30, label: 'Fri', date: '2026-10-30' },
      { dayNumber: 31, label: 'Sat', date: '2026-10-31' },
    ],
    'November 2026': [
      { dayNumber: 1, label: 'Sun', date: '2026-11-01' },
      { dayNumber: 2, label: 'Mon', date: '2026-11-02' },
      { dayNumber: 3, label: 'Tue', date: '2026-11-03' },
      { dayNumber: 4, label: 'Wed', date: '2026-11-04' },
      { dayNumber: 5, label: 'Thu', date: '2026-11-05' },
      { dayNumber: 6, label: 'Fri', date: '2026-11-06' },
      { dayNumber: 7, label: 'Sat', date: '2026-11-07' },
    ],
  };

  const days = daysByMonth[selectedMonth] || daysByMonth['October 2026'];
  const activeBookingData = bookings.find(b => b.id === selectedBookingId);
  const activeFolio = activeBookingData ? folios.find(f => f.bookingId === activeBookingData.id) : null;

  const handlePrevMonth = () => {
    setMonthIndex(prev => (prev > 0 ? prev - 1 : months.length - 1));
  };

  const handleNextMonth = () => {
    setMonthIndex(prev => (prev < months.length - 1 ? prev + 1 : 0));
  };

  const handleCheckIn = (bookingId) => {
    const res = checkInGuest(bookingId);
    if (res.success) {
      showToast('Guest Checked In', res.message, 'success');
      setSelectedBookingId(null);
    } else {
      showToast('Check-In Failed', res.message, 'error');
    }
  };

  const handleCheckOut = (bookingId) => {
    const res = checkOutGuest(bookingId);
    if (res.success) {
      showToast('Guest Checked Out', res.message, 'success');
      setSelectedBookingId(null);
    } else {
      showToast('Check-Out Failed', res.message, 'error');
    }
  };

  const handleQuickBookRoom = (roomId) => {
    setPrefilledRoomId(roomId);
    setIsNewBookingOpen(true);
  };

  return (
    <div className="card-luxury-3d overflow-hidden">
      {/* Top golden shimmer border */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none" />

      {/* 3D Calendar Header */}
      <div className="p-6 border-b border-border/70 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-ivory/60 dark:bg-black/25">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/25 via-accent/10 to-transparent border border-accent/40 flex items-center justify-center text-accent shadow-sm">
            <CalendarIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white tracking-tight">
                Suite Occupancy & Allocation Timeline
              </h3>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/30 uppercase">
                <Sparkles className="w-3 h-3" />
                Live Matrix
              </span>
            </div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Interactive timeline view of room allocations, presidential suites & VIP stays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-primary-900/80 border border-border dark:border-white/15 rounded-2xl px-3.5 py-2 text-xs font-semibold shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-gray-400 hover:text-accent hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-serif font-bold text-primary dark:text-white text-sm">
              {selectedMonth}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-gray-400 hover:text-accent hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border/80 dark:border-white/10 bg-ivory/70 dark:bg-white/[0.03] text-charcoal-muted dark:text-gray-400 font-mono">
              <th className="p-4 w-56 font-semibold uppercase tracking-wider text-[11px]">
                Suites & Sovereign Villas
              </th>
              {days.map(d => (
                <th
                  key={d.dayNumber}
                  className={`p-3 text-center border-l border-border/60 dark:border-white/10 transition-colors ${
                    d.isToday ? 'bg-accent/15 text-accent font-bold' : ''
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider">{d.label}</div>
                  <div className="text-base font-serif font-bold mt-0.5 text-primary dark:text-white">
                    {d.dayNumber}
                  </div>
                  {d.isToday && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] gold-gradient-bg text-primary-900 font-bold rounded-full shadow-sm">
                      Today
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-white/[0.06]">
            {rooms.map(room => {
              const booking = bookings.find(
                b => b.roomId === room.id && (b.status === 'confirmed' || b.status === 'checked_in')
              );

              return (
                <tr
                  key={room.id}
                  className="hover:bg-accent/[0.03] dark:hover:bg-white/[0.02] transition-colors duration-150"
                >
                  <td className="p-4 bg-white/50 dark:bg-[#111823]/50">
                    <div className="font-serif font-bold text-sm text-primary dark:text-white truncate max-w-[190px]">
                      {room.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-accent text-xs font-semibold">
                        {room.roomNumber}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[11px] font-mono text-charcoal-muted dark:text-gray-400">
                        ${room.pricePerNight.toLocaleString()}/night
                      </span>
                    </div>
                  </td>

                  {/* Day cells */}
                  {days.map(d => {
                    const isOccupiedDay =
                      booking &&
                      d.date >= booking.checkIn &&
                      d.date <= booking.checkOut;

                    return (
                      <td
                        key={d.dayNumber}
                        className={`p-2 text-center border-l border-border/40 dark:border-white/10 align-middle ${
                          d.isToday ? 'bg-accent/[0.04]' : ''
                        }`}
                      >
                        {isOccupiedDay ? (
                          <button
                            type="button"
                            onClick={() => setSelectedBookingId(booking.id)}
                            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-accent/25 to-accent/15 hover:from-accent/35 hover:to-accent/25 border border-accent/40 text-accent-dark dark:text-accent-light text-left cursor-pointer transition-all duration-200 shadow-sm hover:shadow-gold hover:scale-[1.02] group"
                            title={`Reserved by ${booking.guestName}. Click to open details.`}
                          >
                            <p className="font-semibold truncate text-[11px] text-primary dark:text-white leading-tight">
                              {booking.guestName}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              <span className="font-mono text-accent font-bold">
                                {booking.bookingCode}
                              </span>
                              <span className="capitalize font-medium text-emerald-600 dark:text-emerald-400">
                                {booking.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickBookRoom(room.id)}
                            className="w-full h-12 rounded-xl border border-dashed border-border/70 dark:border-white/10 hover:border-accent/40 hover:bg-accent/5 flex items-center justify-center text-gray-400 dark:text-gray-600 transition-all cursor-pointer group"
                            title={`Book Suite ${room.roomNumber}`}
                          >
                            <span className="text-[10px] text-charcoal-muted/60 dark:text-gray-500 group-hover:text-accent font-medium transition-colors">
                              + Book
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reservation Details & Management Modal */}
      {activeBookingData && (
        <Modal
          isOpen={!!activeBookingData}
          onClose={() => setSelectedBookingId(null)}
          title="Reservation & Folio Detail"
          subtitle={`Folio #${activeBookingData.bookingCode} — ${activeBookingData.guestName}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-white/[0.04] border border-border dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-primary dark:text-white">
                    {activeBookingData.guestName}
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">
                    ID: {activeBookingData.id} • Suite Type: {activeBookingData.roomType}
                  </p>
                </div>
                <StatusBadge status={activeBookingData.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60 dark:border-white/10">
                <div>
                  <span className="text-charcoal-muted dark:text-gray-400">Stay Period:</span>
                  <p className="font-medium text-primary dark:text-white mt-0.5">
                    {activeBookingData.checkIn} → {activeBookingData.checkOut}
                  </p>
                </div>
                <div>
                  <span className="text-charcoal-muted dark:text-gray-400">Total Folio Charge:</span>
                  <p className="font-mono font-bold text-accent text-sm mt-0.5">
                    ${activeBookingData.totalAmount.toLocaleString()} USD
                  </p>
                </div>
                <div>
                  <span className="text-charcoal-muted dark:text-gray-400">Payment Status:</span>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 capitalize mt-0.5">
                    {activeBookingData.paymentStatus}
                  </p>
                </div>
                <div>
                  <span className="text-charcoal-muted dark:text-gray-400">Guest Count:</span>
                  <p className="font-medium text-primary dark:text-white mt-0.5">
                    {activeBookingData.guestCount ?? (activeBookingData.adults + (activeBookingData.children || 0))} VIPs
                  </p>
                </div>
              </div>

              {activeBookingData.specialRequests && (
                <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-xs">
                  <span className="font-semibold text-accent block">Special Requests:</span>
                  <p className="text-charcoal dark:text-gray-300 mt-0.5">
                    {activeBookingData.specialRequests}
                  </p>
                </div>
              )}

              {activeFolio && (
                <div className="pt-2 border-t border-border/60 dark:border-white/10 text-xs flex justify-between">
                  <span className="text-charcoal-muted dark:text-gray-400">Live Folio Balance:</span>
                  <span className="font-mono font-bold text-primary dark:text-white">
                    ${(activeFolio.balanceDue ?? activeFolio.balance ?? 0).toLocaleString()} USD (Paid: ${activeFolio.totalPaid.toLocaleString()})
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingId(null)}
                className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/20 text-xs font-semibold hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
              >
                Close Window
              </button>

              {activeBookingData.status === 'confirmed' && (
                <button
                  type="button"
                  onClick={() => handleCheckIn(activeBookingData.id)}
                  className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs flex items-center gap-2 btn-3d"
                >
                  <CheckCircle className="w-4 h-4" />
                  Execute Check-In
                </button>
              )}

              {activeBookingData.status === 'checked_in' && (
                <button
                  type="button"
                  onClick={() => handleCheckOut(activeBookingData.id)}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Settle & Check-Out
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Booking Modal for Quick Booking */}
      <BookingModal
        isOpen={isNewBookingOpen}
        onClose={() => {
          setIsNewBookingOpen(false);
          setPrefilledRoomId(undefined);
        }}
        initialRoomId={prefilledRoomId}
        initialData={prefilledRoomId ? { roomId: prefilledRoomId } : undefined}
      />
    </div>
  );
};

export default CalendarView;

