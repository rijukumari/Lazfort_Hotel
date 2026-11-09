import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader, Button, ViewToggle } from '../../components/ui';
import { RoomCard } from '../../components/hotel/RoomCard';
import { RoomSearchForm } from '../../components/booking/RoomSearchForm';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  SlidersHorizontal,
  BedDouble,
  Calendar,
  ArrowUpDown,
  Filter,
  Users,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CustomerBrowseRoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, checkRoomAvailability } = useERP();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_customer_rooms') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_customer_rooms', mode);
    } catch {}
  };

  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date(defaultIn);
  defaultOut.setDate(defaultIn.getDate() + 2);
  const formatDate = (d) => d.toISOString().split('T')[0];

  const checkIn = searchParams.get('checkIn') || formatDate(defaultIn);
  const checkOut = searchParams.get('checkOut') || formatDate(defaultOut);
  const adults = parseInt(searchParams.get('adults') || '2', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const roomsCount = parseInt(searchParams.get('roomsCount') || '1', 10);
  const initialType = searchParams.get('roomType') || 'all';

  const [selectedType, setSelectedType] = useState(initialType);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);

  const nights = useMemo(() => {
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();
    if (isNaN(inTime) || isNaN(outTime) || outTime <= inTime) return 1;
    return Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const handleSearchSubmit = (criteria) => {
    setSearchParams({
      checkIn: criteria.checkIn,
      checkOut: criteria.checkOut,
      adults: criteria.adults.toString(),
      children: criteria.children.toString(),
      roomsCount: criteria.roomsCount.toString(),
      roomType: criteria.roomType,
    });
    setSelectedType(criteria.roomType);
    showToast(
      'Availability Checked',
      `Updated live availability for ${criteria.checkIn} to ${criteria.checkOut}.`,
      'info'
    );
  };

  const evaluatedRooms = useMemo(() => {
    return rooms.map(room => {
      const isFreeForDates = checkRoomAvailability(room.id, checkIn, checkOut);
      return {
        ...room,
        isFreeForDates,
      };
    });
  }, [rooms, checkIn, checkOut, checkRoomAvailability]);

  const filteredRooms = useMemo(() => {
    let result = evaluatedRooms;

    if (selectedType !== 'all') {
      result = result.filter(r =>
        r.type?.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    const totalGuests = adults + children;
    result = result.filter(r => (r.capacity || 2) >= totalGuests);

    if (onlyAvailable) {
      result = result.filter(r => r.isFreeForDates);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'price_asc') return (a.pricePerNight || 0) - (b.pricePerNight || 0);
      if (sortBy === 'price_desc') return (b.pricePerNight || 0) - (a.pricePerNight || 0);
      return (b.rating || 0) - (a.rating || 0);
    });

    return result;
  }, [evaluatedRooms, selectedType, adults, children, onlyAvailable, sortBy]);

  const availableCount = evaluatedRooms.filter(r => r.isFreeForDates).length;

  const handleBookNow = (room) => {
    const params = new URLSearchParams({
      roomId: room.id,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
      roomsCount: roomsCount.toString(),
    }).toString();

    navigate(`/customer/checkout?${params}`);
  };

  const handleViewDetails = (room) => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
    }).toString();

    navigate(`/customer/rooms/${room.id}?${params}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Royal Suites & Sovereign Residences"
        description="Explore Monaco's finest oceanfront suites with live date-based ERP inventory availability and private butler inclusions."
        badge={`${availableCount} Available for Selected Dates`}
        actions={
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          >
            {isSearchExpanded ? 'Hide Search Dates' : 'Modify Dates & Guests'}
          </Button>
        }
      />

      {isSearchExpanded && (
        <div className="animate-in fade-in duration-200">
          <RoomSearchForm
            initialCriteria={{
              checkIn,
              checkOut,
              adults,
              children,
              roomsCount,
              roomType: selectedType,
            }}
            onSearch={handleSearchSubmit}
          />
        </div>
      )}

      {/* Date Banner & Live Inventory Snapshot */}
      <div className="p-4 rounded-3xl bg-accent/10 border border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-primary dark:text-white">
              Selected Stay: {checkIn} &rarr; {checkOut} ({nights} {nights === 1 ? 'Night' : 'Nights'})
            </span>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              {adults} {adults === 1 ? 'Adult' : 'Adults'}
              {children > 0 && `, ${children} Children`} • {roomsCount} Suite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal dark:text-gray-200">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-accent focus:ring-accent border-gray-300"
            />
            <span>Show Available Only ({availableCount})</span>
          </label>
        </div>
      </div>

      {/* Filter Category Pills & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-charcoal-muted dark:text-gray-400 flex items-center gap-1.5 mr-2 font-mono font-semibold whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
            Collection:
          </span>
          {[
            { id: 'all', label: 'All Collections' },
            { id: 'presidential', label: 'Presidential Suites' },
            { id: 'penthouse', label: 'Royal Penthouses' },
            { id: 'villa', label: 'Ocean Villas' },
            { id: 'executive', label: 'Executive Suites' },
          ].map(cat => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                selectedType === cat.id
                  ? 'filter-btn-active'
                  : 'filter-btn-inactive'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown & View Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-muted dark:text-gray-400 flex items-center gap-1 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="rating">Rating (Highest First)</option>
              <option value="price_asc">Tariff (Low to High)</option>
              <option value="price_desc">Tariff (High to Low)</option>
            </select>
          </div>
          <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* Available Suites Display: Grid or List */}
      {filteredRooms.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-surface-dark/60 border border-dashed border-border dark:border-white/10 space-y-4">
          <BedDouble className="w-12 h-12 text-accent/50 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
            No Suites Found For Selected Criteria
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-md mx-auto">
            Try choosing alternative dates, adjusting guest count, or unchecking "Show Available Only" to view other dates.
          </p>
          <Button
            variant="gold"
            onClick={() => {
              setSelectedType('all');
              setOnlyAvailable(false);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              nights={nights}
              isAvailableForDates={room.isFreeForDates}
              showRoomNumber={false}
              onBookNow={handleBookNow}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className="card-luxury p-5 rounded-3xl border border-border/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 hover:border-accent/40 transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <img
                  src={room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400'}
                  alt={room.name || room.type}
                  className="w-full sm:w-44 h-28 rounded-2xl object-cover ring-1 ring-accent/20 group-hover:scale-102 transition-transform"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                      {room.category || room.type}
                    </span>
                    <span className="text-xs text-amber-500 font-semibold flex items-center gap-0.5">
                      ★ {room.rating || '4.95'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    {room.name || `${room.type} Suite`}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-charcoal-muted dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      Up to {room.capacity || 2} VIPs
                    </span>
                    <span>•</span>
                    <span>{room.bedType || 'Imperial King'}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {room.isFreeForDates ? 'Available Instant' : 'Reserved Dates'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/70 dark:border-white/10 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-charcoal-muted block">Tariff per night:</span>
                  <span className="font-serif font-bold text-lg text-primary dark:text-accent">
                    ${Number(room.pricePerNight || 850).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(room)}
                    className="text-xs px-3 py-1.5 border-accent/30 text-accent hover:bg-accent/10"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="gold"
                    onClick={() => handleBookNow(room)}
                    disabled={!room.isFreeForDates}
                    className="text-xs px-4 py-1.5"
                  >
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBrowseRoomsPage;

