import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Card, Select } from '../../components/ui';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  LogOut,
  XCircle,
  Eye,
  FileText
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const BookingCalendarPage = () => {
  const navigate = useNavigate();
  const { rooms, bookings } = useERP();

  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 30)); // 30 Oct 2026 default
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Status Color Mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'checked_in':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'checked_out':
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'cancelled':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (viewMode === 'week') {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 7);
      setCurrentDate(prev);
    } else {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      setCurrentDate(prev);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (viewMode === 'week') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 7);
      setCurrentDate(next);
    } else {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 30));
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && b.roomType !== categoryFilter) return false;
    return true;
  });

  // Calculate days for the month view
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  // Pad previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ dayNumber: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayBookings = filteredBookings.filter(b => {
      return (b.checkIn <= dateStr && b.checkOut >= dateStr);
    });
    calendarDays.push({
      dayNumber: i,
      dateStr,
      isToday: currentYear === 2026 && currentMonth === 9 && i === 30,
      bookings: dayBookings,
    });
  }

  // Room categories
  const roomCategories = Array.from(new Set(rooms.map(r => r.type)));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Interactive Booking Calendar"
        description="Comprehensive schedule of room occupancy, expected arrivals, stay durations, and departure schedules."
        badge="Multi-View Scheduler"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Booking
            </Button>
          </div>
        }
      />

      {/* Control Bar: View Toggle, Filters, and Navigation */}
      <div className="card-luxury-3d p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl btn-secondary-3d hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-serif font-bold text-lg min-w-[180px] text-center text-primary dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl btn-secondary-3d hover:text-accent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl btn-secondary-3d hover:text-accent transition-colors"
          >
            Today (30 Oct)
          </button>
        </div>

        {/* View Modes */}
        <div className="flex items-center p-1 bg-charcoal-light/10 dark:bg-white/5 rounded-xl border border-border/80 dark:border-white/10">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'month' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'week' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Timeline Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'day' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Daily Agenda
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="pending">Pending</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Room Types</option>
            {roomCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold px-2">
        <span className="text-charcoal-muted">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Checked In</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span>Checked Out</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Cancelled</span>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="card-luxury-3d overflow-hidden p-4">
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-charcoal-muted uppercase tracking-wider py-2 border-b border-border/80 dark:border-white/10">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (!day.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[110px] rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-transparent"
                  />
                );
              }

              return (
                <div
                  key={day.dateStr}
                  className={`min-h-[110px] p-2 rounded-xl border transition-all flex flex-col ${
                    day.isToday
                      ? 'bg-accent/10 border-accent/40 shadow-sm'
                      : 'bg-white/50 dark:bg-primary-900/30 border-border/60 dark:border-white/5 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        day.isToday
                          ? 'w-5 h-5 rounded-full bg-accent text-primary dark:text-white flex items-center justify-center font-mono'
                          : 'text-charcoal-muted'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {day.bookings && day.bookings.length > 0 && (
                      <span className="text-[10px] font-mono text-charcoal-muted">
                        {day.bookings.length} {day.bookings.length === 1 ? 'Stay' : 'Stays'}
                      </span>
                    )}
                  </div>

                  {/* Day Bookings */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px] pr-0.5 custom-scrollbar flex-1">
                    {day.bookings?.slice(0, 3).map(b => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border cursor-pointer truncate transition-transform hover:scale-[1.02] active:scale-95 ${getStatusColor(
                          b.status
                        )}`}
                        title={`Suite ${b.roomNumber} - ${b.guestName} (${b.status})`}
                      >
                        {b.roomNumber}: {b.guestName.split(' ')[0]}
                      </div>
                    ))}
                    {day.bookings?.length > 3 && (
                      <div
                        onClick={() => setViewMode('day')}
                        className="text-[9px] text-accent font-bold cursor-pointer hover:underline text-center"
                      >
                        +{day.bookings.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK TIMELINE VIEW */}
      {viewMode === 'week' && (
        <div className="card-luxury-3d p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-xs font-bold text-charcoal-muted">
                <th className="p-3 w-40">Room</th>
                {['Sun 25', 'Mon 26', 'Tue 27', 'Wed 28', 'Thu 29', 'Fri 30 (Today)', 'Sat 31'].map((d, i) => (
                  <th key={i} className="p-3 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5 text-xs">
              {rooms.map(room => {
                const roomBookings = filteredBookings.filter(b => b.roomId === room.id);
                return (
                  <tr key={room.id} className="hover:bg-white/40 dark:hover:bg-white/[0.02]">
                    <td className="p-3 font-semibold">
                      <span className="font-mono text-accent">Suite {room.roomNumber}</span>
                      <p className="text-[10px] text-charcoal-muted">{room.type}</p>
                    </td>
                    <td colSpan={7} className="p-2">
                      <div className="flex gap-2">
                        {roomBookings.length > 0 ? (
                          roomBookings.map(b => (
                            <div
                              key={b.id}
                              onClick={() => setSelectedBooking(b)}
                              className={`p-2 rounded-xl border flex-1 cursor-pointer transition-transform hover:scale-[1.01] ${getStatusColor(
                                b.status
                              )}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs">{b.guestName}</span>
                                <span className="font-mono text-[10px]">${b.totalAmount}</span>
                              </div>
                              <p className="text-[10px] opacity-80">{b.checkIn} → {b.checkOut} ({b.status})</p>
                            </div>
                          ))
                        ) : (
                          <div className="w-full py-2 text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/5 rounded-xl border border-dashed border-emerald-500/20">
                            Available for Walk-in Booking
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DAILY AGENDA VIEW */}
      {viewMode === 'day' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Arrivals */}
          <div className="card-luxury-3d p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Scheduled Arrivals
            </h3>
            <div className="space-y-3">
              {filteredBookings.filter(b => b.status === 'confirmed').map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-xs text-primary dark:text-white">{b.guestName}</p>
                    <span className="font-mono text-xs text-accent">Suite {b.roomNumber}</span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted mt-1">{b.roomType} • {b.nights} nights</p>
                </div>
              ))}
            </div>
          </div>

          {/* In-House Guests */}
          <div className="card-luxury-3d p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Currently In-House
            </h3>
            <div className="space-y-3">
              {filteredBookings.filter(b => b.status === 'checked_in').map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-xs text-primary dark:text-white">{b.guestName}</p>
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">Suite {b.roomNumber}</span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted mt-1">Departs: {b.checkOut}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Departures */}
          <div className="card-luxury-3d p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <LogOut className="w-4 h-4 text-indigo-500" />
              Departures & Finalized
            </h3>
            <div className="space-y-3">
              {filteredBookings.filter(b => b.status === 'checked_out').map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-xs text-primary dark:text-white">{b.guestName}</p>
                    <span className="font-mono text-xs text-accent">Suite {b.roomNumber}</span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted mt-1">Folio Settled: ${b.totalAmount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Quick Detail Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury-3d w-full max-w-lg p-6 space-y-5 bg-white dark:bg-primary-950 border border-accent/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-mono text-accent font-bold uppercase tracking-wider">
                  {selectedBooking.bookingCode}
                </span>
                <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
                  {selectedBooking.guestName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-xl text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-charcoal-light/10 dark:bg-white/5 space-y-1">
                <span className="text-charcoal-muted block">Suite</span>
                <span className="font-mono font-bold text-sm">Suite {selectedBooking.roomNumber}</span>
                <p className="text-[11px] text-charcoal-muted">{selectedBooking.roomType}</p>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-light/10 dark:bg-white/5 space-y-1">
                <span className="text-charcoal-muted block">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
                <p className="text-[11px] text-accent font-serif font-bold">${selectedBooking.totalAmount?.toLocaleString()} USD</p>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-light/10 dark:bg-white/5 space-y-1">
                <span className="text-charcoal-muted block">Check-In</span>
                <span className="font-semibold">{selectedBooking.checkIn}</span>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-light/10 dark:bg-white/5 space-y-1">
                <span className="text-charcoal-muted block">Check-Out</span>
                <span className="font-semibold">{selectedBooking.checkOut}</span>
              </div>
            </div>

            <div className="text-xs text-charcoal-muted">
              <p>Email: <span className="font-medium text-primary dark:text-white">{selectedBooking.guestEmail}</span></p>
              <p className="mt-1">Phone: <span className="font-mono text-primary dark:text-white">{selectedBooking.guestPhone || '+377 98 00 12 34'}</span></p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button
                variant="outline"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
              <Button
                variant="gold"
                icon={FileText}
                onClick={() => {
                  navigate(`/hotel-admin/bookings/folio/${selectedBooking.id}`);
                  setSelectedBooking(null);
                }}
              >
                Open Full Folio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendarPage;

