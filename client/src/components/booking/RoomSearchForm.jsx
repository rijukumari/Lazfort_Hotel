import React, { useState } from 'react';
import { Calendar, Users, Building, Search, Filter } from 'lucide-react';

const ROOM_TYPES = [
  { value: 'all', label: 'All Collections' },
  { value: 'Presidential Suite', label: 'Presidential Suites' },
  { value: 'Royal Penthouse', label: 'Royal Penthouses' },
  { value: 'Executive Suite', label: 'Executive Suites' },
  { value: 'Deluxe Ocean Villa', label: 'Deluxe Ocean Villas' },
  { value: 'Grand Heritage Room', label: 'Grand Heritage Rooms' },
  { value: 'Junior Suite', label: 'Junior Suites' },
];

export const RoomSearchForm = ({
  initialCriteria,
  onSearch,
  isHeroLayout = false,
  className = '',
}) => {
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckIn.getDate() + 2);

  const formatDate = d => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(
    initialCriteria?.checkIn || formatDate(defaultCheckIn)
  );
  const [checkOut, setCheckOut] = useState(
    initialCriteria?.checkOut || formatDate(defaultCheckOut)
  );
  const [adults, setAdults] = useState(initialCriteria?.adults || 2);
  const [children, setChildren] = useState(initialCriteria?.children || 0);
  const [roomsCount, setRoomsCount] = useState(initialCriteria?.roomsCount || 1);
  const [roomType, setRoomType] = useState(initialCriteria?.roomType || 'all');
  const [dateError, setDateError] = useState(null);

  const handleCheckInChange = newCheckIn => {
    setCheckIn(newCheckIn);
    if (new Date(checkOut) <= new Date(newCheckIn)) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(formatDate(nextDay));
      setDateError(null);
    }
  };

  const handleCheckOutChange = newCheckOut => {
    if (new Date(newCheckOut) <= new Date(checkIn)) {
      setDateError('Check-out date must be after check-in date.');
      return;
    }
    setDateError(null);
    setCheckOut(newCheckOut);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) {
      setDateError('Check-out date must be at least 1 day after check-in.');
      return;
    }
    setDateError(null);

    const criteria = {
      checkIn,
      checkOut,
      adults: Number(adults),
      children: Number(children),
      roomsCount: Number(roomsCount),
      roomType,
    };

    if (onSearch) {
      onSearch(criteria);
    }
  };

  const minCheckIn = formatDate(today);

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative z-20 transition-all ${isHeroLayout
        ? 'bg-white/95 dark:bg-[#101724]/90 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl border border-accent/40 shadow-2xl shadow-black/20'
        : 'bg-white/80 dark:bg-surface-dark/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-border dark:border-border-dark shadow-lg'
        } ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
        {/* Check-In Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            Check-In
          </label>
          <div className="relative">
            <input
              type="date"
              min={minCheckIn}
              value={checkIn}
              onChange={e => handleCheckInChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Check-Out Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            Check-Out
          </label>
          <div className="relative">
            <input
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={e => handleCheckOutChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-accent" />
            Guests
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={adults}
              onChange={e => setAdults(Number(e.target.value))}
              className="px-2.5 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent transition-all"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num} className="dark:bg-primary-900">
                  {num} {num === 1 ? 'Adult' : 'Adults'}
                </option>
              ))}
            </select>
            <select
              value={children}
              onChange={e => setChildren(Number(e.target.value))}
              className="px-2.5 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent transition-all"
            >
              {[0, 1, 2, 3, 4].map(num => (
                <option key={num} value={num} className="dark:bg-primary-900">
                  {num} {num === 1 ? 'Child' : 'Children'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rooms Count */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-accent" />
            Rooms
          </label>
          <select
            value={roomsCount}
            onChange={e => setRoomsCount(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent transition-all"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num} className="dark:bg-primary-900">
                {num} {num === 1 ? 'Room' : 'Rooms'}
              </option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-accent" />
            Suite Collection
          </label>
          <select
            value={roomType}
            onChange={e => setRoomType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent transition-all"
          >
            {ROOM_TYPES.map(type => (
              <option key={type.value} value={type.value} className="dark:bg-primary-900">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search CTA Button */}
        <div>
          <button
            type="submit"
            className="w-full h-[42px] inline-flex items-center justify-center gap-2 px-5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search Suites</span>
          </button>
        </div>
      </div>

      {dateError && (
        <div className="mt-2.5 text-xs text-rose-500 dark:text-rose-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
          <span>⚠️ {dateError}</span>
        </div>
      )}
    </form>
  );
};

export default RoomSearchForm;


