import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card } from '../../components/ui';
import {
  Sparkles,
  ArrowLeft,
  Users,
  Bed,
  Eye,
  Maximize2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Crown,
  Wine,
  Wifi,
  Clock,
  AlertCircle
} from 'lucide-react';

export const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, checkRoomAvailability } = useERP();
  const { showToast } = useToast();

  const room = rooms.find(r => r.id === roomId) || rooms[0];

  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date(defaultIn);
  defaultOut.setDate(defaultIn.getDate() + 2);
  const formatDate = (d) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(
    searchParams.get('checkIn') || formatDate(defaultIn)
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get('checkOut') || formatDate(defaultOut)
  );
  const [adults, setAdults] = useState(
    parseInt(searchParams.get('adults') || '2', 10)
  );
  const [children, setChildren] = useState(
    parseInt(searchParams.get('children') || '0', 10)
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nights = useMemo(() => {
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();
    if (isNaN(inTime) || isNaN(outTime) || outTime <= inTime) return 1;
    return Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const isAvailable = useMemo(() => {
    if (!room) return false;
    return checkRoomAvailability(room.id, checkIn, checkOut);
  }, [room, checkIn, checkOut, checkRoomAvailability]);

  const baseTariff = room ? (room.pricePerNight || 0) * nights : 0;
  const taxAmount = Math.round(baseTariff * 0.1);
  const serviceFee = Math.round(baseTariff * 0.05);
  const grandTotal = baseTariff + taxAmount + serviceFee;

  const handleProceedToBooking = () => {
    if (!isAvailable) {
      showToast('Suite Unavailable', 'This suite is already reserved for the selected dates. Please adjust your dates.', 'error');
      return;
    }

    const query = new URLSearchParams({
      roomId: room.id,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
    }).toString();

    navigate(`/customer/checkout?${query}`);
  };

  if (!room) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold">Suite Not Found</h2>
        <Button
          variant="gold"
          onClick={() => navigate('/customer/discover/rooms')}
        >
          Return to Suites
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent dark:text-gray-300 dark:hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Suites & Villas</span>
        </button>
      </div>

      {/* Main Suite Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent font-bold px-2 py-0.5 rounded-md bg-accent/15 border border-accent/30">
              {room.type}
            </span>
            <span className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">
              Floor {room.floor} • Monaco Coastline
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-white mt-2">
            {room.name}
          </h1>
        </div>

        <div className="text-left md:text-right flex-shrink-0">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-accent">
            ${room.pricePerNight?.toLocaleString()}
          </span>
          <span className="text-xs text-charcoal-muted dark:text-gray-400 block font-mono">
            per night (Tariff exclusive of taxes)
          </span>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden border border-border/80 dark:border-white/15 shadow-xl">
          <img
            src={room.images?.[selectedImageIndex] || room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'}
            alt={room.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Availability Pill */}
          <div className="absolute top-4 left-4">
            {isAvailable ? (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/95 text-white backdrop-blur-md border border-emerald-400/40 shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Available for Selected Dates
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-600/95 text-white backdrop-blur-md border border-rose-400/40 shadow-lg flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Booked for Selected Dates
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">
              Live Photo {selectedImageIndex + 1} of {room.images?.length || 1}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {room.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-accent shadow-gold scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2-Column Layout: Left Details / Right Sticky Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-mono">Area</span>
                <span className="font-semibold text-primary dark:text-white font-mono">
                  {room.sizeSqFt || 1200} sq ft
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Bed className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-mono">Bed</span>
                <span className="font-semibold text-primary dark:text-white">{room.bedType}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-mono">Capacity</span>
                <span className="font-semibold text-primary dark:text-white">Up to {room.capacity}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-mono">Panorama</span>
                <span className="font-semibold text-primary dark:text-white truncate">{room.view}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-2xl font-bold text-primary dark:text-white">
              The Suite Experience
            </h3>
            <p className="text-xs sm:text-sm text-charcoal dark:text-gray-300 leading-relaxed">
              {room.description}
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400 leading-relaxed">
              Hand-carved Italian woodwork, custom hand-tufted silk rugs, and floor-to-ceiling glass
              doors opening onto an expansive private balcony overlooking the Mediterranean coastline.
              Guests enjoy round-the-clock dedicated butler service, priority helipad transfers, and
              curated in-suite dining.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              <span>Sovereign Suite Inclusions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.amenities?.map((amenity, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border/80 dark:border-white/10 flex items-center gap-3 text-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-primary dark:text-white">{amenity}</span>
                </div>
              ))}
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border/80 dark:border-white/10 flex items-center gap-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                  <Wifi className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-primary dark:text-white">Ultra-High Speed Fiber Wi-Fi</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border/80 dark:border-white/10 flex items-center gap-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
                  <Wine className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-primary dark:text-white">Complimentary Vintage Welcome Champagne</span>
              </div>
            </div>
          </div>

          <Card variant="luxury" className="p-6 rounded-3xl space-y-4 text-xs">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Hotel Stay Policies</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-primary dark:text-white block">
                  Check-in / Check-out
                </span>
                <p className="text-charcoal-muted dark:text-gray-400 text-[11px] mt-0.5">
                  Arrival: 15:00 onwards • Departure: 12:00 noon. Early check-in subject to VIP availability.
                </p>
              </div>

              <div>
                <span className="font-semibold text-primary dark:text-white block">
                  Cancellation Terms
                </span>
                <p className="text-charcoal-muted dark:text-gray-400 text-[11px] mt-0.5">
                  Complimentary cancellation up to 48 hours prior to check-in. Instant cancellation supported via My Bookings.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Sticky Reservation Calculator Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-5">
          <Card variant="luxury" className="p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                  Live Tariff & Availability
                </span>
                <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
                  Reserve This Suite
                </h3>
              </div>
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-[10px] text-charcoal-muted dark:text-gray-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-accent" />
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-mono text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-[10px] text-charcoal-muted dark:text-gray-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-accent" />
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-mono text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Occupancy selectors */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-[10px] text-charcoal-muted dark:text-gray-300">
                  Adults
                </label>
                <select
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-semibold text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-[10px] text-charcoal-muted dark:text-gray-300">
                  Children
                </label>
                <select
                  value={children}
                  onChange={e => setChildren(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 font-semibold text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {[0, 1, 2, 3].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Child' : 'Children'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>
                  ${room.pricePerNight?.toLocaleString()} &times; {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="font-mono font-semibold text-primary dark:text-white">
                  ${baseTariff.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Hospitality Tax (10%)</span>
                <span className="font-mono font-semibold text-primary dark:text-white">
                  ${taxAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Concierge & Resort Fee (5%)</span>
                <span className="font-mono font-semibold text-primary dark:text-white">
                  ${serviceFee.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-border dark:border-white/10 flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-primary dark:text-white">
                  Total Payable
                </span>
                <span className="font-serif text-xl font-bold text-accent">
                  ${grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div>
              <Button
                variant={isAvailable ? 'gold' : 'secondary'}
                disabled={!isAvailable}
                onClick={handleProceedToBooking}
                className="w-full"
              >
                {isAvailable ? 'Proceed to Reservation' : 'Unavailable for Dates'}
              </Button>
            </div>

            {!isAvailable && (
              <p className="text-[11px] text-rose-500 text-center font-semibold flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Suite occupied on selected dates. Please choose different dates.</span>
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Instant Confirmation • No Booking Fees</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;

