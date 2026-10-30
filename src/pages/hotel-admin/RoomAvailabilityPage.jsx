import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../components/ui';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Wrench,
  Ban,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const RoomAvailabilityPage = () => {
  const navigate = useNavigate();
  const { rooms, bookings, updateRoomStatus } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected date simulation
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Counts
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const reservedCount = rooms.filter(r => r.status === 'reserved').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance' || r.status === 'cleaning').length;

  const categories = Array.from(new Set(rooms.map(r => r.type)));

  // Generate 7-day range for availability matrix
  const daysRange = useMemo(() => {
    const base = new Date(selectedDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        dateStr: iso,
        dayNumber: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: iso === new Date().toISOString().split('T')[0],
      };
    });
  }, [selectedDate]);

  const handleShiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleUpdateStatus = (roomId, newStatus) => {
    updateRoomStatus(roomId, newStatus);
    showToast('Availability Updated', `Suite status transitioned to ${newStatus}.`, 'success');
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesSearch =
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || r.type === categoryFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [rooms, searchQuery, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Room Availability Matrix & Occupancy Radar"
        description="Monitor multi-day availability grids, manage room lockouts, audit guest allocations, and override suite inventory states."
        badge={`${rooms.length} Suites Monitored`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CalendarIcon}
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            >
              Today
            </Button>
            <Button
              variant="gold"
              icon={BedDouble}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Reservation
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={5}>
        <StatCard
          title="Available Clean"
          value={availableCount}
          subtitle="ready for check-in"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Occupied Suites"
          value={occupiedCount}
          subtitle="resident guests"
          icon={<BedDouble className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Confirmed Reserved"
          value={reservedCount}
          subtitle="guaranteed deposits"
          icon={<Clock className="w-5 h-5 text-blue-500" />}
        />
        <StatCard
          title="Maintenance / Clean"
          value={maintenanceCount}
          subtitle="turnover or repairs"
          icon={<Wrench className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Occupancy Yield"
          value={`${Math.round((occupiedCount / Math.max(1, rooms.length)) * 100)}%`}
          subtitle="live occupancy index"
          icon={<Sparkles className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      {/* Timeline Controls & Filter Bar */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShiftDate(-7)}
              className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent"
              title="Previous 7 Days"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3.5 py-1.5 rounded-xl bg-ivory/80 dark:bg-primary-900/40 border border-border/80 text-xs font-mono font-semibold text-primary dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-accent" />
              <span>{daysRange[0].dateStr} &rarr; {daysRange[6].dateStr}</span>
            </div>
            <button
              onClick={() => handleShiftDate(7)}
              className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent"
              title="Next 7 Days"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search suite number..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-luxury pl-8 text-xs py-1.5 w-full"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Classifications</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All States</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* 7-Day Live Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-charcoal-muted font-mono uppercase text-[10px]">
                <th className="py-3 px-4 w-52">Suite & Tariff</th>
                <th className="py-3 px-3 w-32">Current State</th>
                {daysRange.map(d => (
                  <th
                    key={d.dateStr}
                    className={`py-3 px-2 text-center transition-colors ${
                      d.isToday ? 'bg-accent/15 text-accent font-bold rounded-t-lg' : ''
                    }`}
                  >
                    <span className="block text-[9px] uppercase tracking-wider">{d.dayName}</span>
                    <span className="font-serif font-bold text-sm text-primary dark:text-white">{d.dayNumber}</span>
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Quick Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {filteredRooms.map(room => {
                const booking = bookings.find(
                  b => b.roomId === room.id && (b.status === 'confirmed' || b.status === 'checked_in')
                );

                return (
                  <tr key={room.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-primary dark:text-white font-serif flex items-center gap-1.5">
                        <span className="font-mono text-accent font-bold">Suite {room.roomNumber}</span>
                        <span>•</span>
                        <span className="truncate max-w-[110px]">{room.name}</span>
                      </div>
                      <span className="text-[10px] text-charcoal-muted font-mono block">
                        ${room.pricePerNight?.toLocaleString()} / night
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={room.status} size="sm" />
                    </td>

                    {/* Daily Status Cells */}
                    {daysRange.map(d => {
                      const isBooked =
                        booking &&
                        d.dateStr >= booking.checkIn &&
                        d.dateStr <= booking.checkOut;

                      let cellColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
                      let cellLabel = 'Open';

                      if (isBooked) {
                        cellColor = 'bg-accent/25 text-accent-dark dark:text-accent-light border border-accent/40 font-bold';
                        cellLabel = booking.status === 'checked_in' ? 'In-House' : 'Booked';
                      } else if (room.status === 'maintenance') {
                        cellColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30';
                        cellLabel = 'Maint';
                      } else if (room.status === 'cleaning') {
                        cellColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
                        cellLabel = 'Clean';
                      }

                      return (
                        <td key={d.dateStr} className="p-1.5 text-center">
                          <div
                            className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-medium transition-all ${cellColor}`}
                            title={isBooked ? `Reserved by ${booking.guestName}` : `Suite ${room.roomNumber} is ${cellLabel}`}
                          >
                            {cellLabel}
                          </div>
                        </td>
                      );
                    })}

                    <td className="py-3 px-4 text-right">
                      <select
                        value={room.status}
                        onChange={e => handleUpdateStatus(room.id, e.target.value)}
                        className="input-luxury text-[11px] py-1 px-2 cursor-pointer font-medium"
                      >
                        <option value="available">Set: Available</option>
                        <option value="occupied">Set: Occupied</option>
                        <option value="reserved">Set: Reserved</option>
                        <option value="cleaning">Set: Cleaning</option>
                        <option value="maintenance">Set: Maintenance</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityPage;

