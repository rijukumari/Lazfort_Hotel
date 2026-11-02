import React from 'react';
import { Calendar, Users, ShieldCheck, Sparkles, Eye, Info } from 'lucide-react';

export const BookingSummary = ({
  room,
  checkIn,
  checkOut,
  nights,
  adults,
  children,
  roomsCount = 1,
  discountRate = 0,
  className = '',
}) => {
  const effectiveNights = Math.max(1, nights);
  const baseRate = room.pricePerNight * effectiveNights * roomsCount;
  const discountAmount = Math.round(baseRate * discountRate);
  const taxableSubtotal = baseRate - discountAmount;
  const taxAmount = Math.round(taxableSubtotal * 0.1); // 10% Monaco Luxury Hospitality Tax
  const serviceFee = Math.round(taxableSubtotal * 0.05); // 5% Sovereign Concierge & Resort Fee
  const grandTotal = taxableSubtotal + taxAmount + serviceFee;

  return (
    <div
      className={`card-luxury-3d overflow-hidden p-6 sm:p-7 space-y-6 sticky top-24 ${className}`}
    >
      {/* Top golden shimmer border */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
            Reservation Itinerary
          </span>
          <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
            Booking Summary
          </h3>
        </div>
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
      </div>

      {/* Selected Suite Preview */}
      <div className="flex gap-4 items-center">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-20 h-20 rounded-2xl object-cover border border-accent/30 shadow-md flex-shrink-0"
        />
        <div className="min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block">
            {room.type}
          </span>
          <h4 className="font-serif font-bold text-base text-primary dark:text-white truncate">
            {room.name}
          </h4>
          <p className="text-xs text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5 mt-1">
            <Eye className="w-3.5 h-3.5 text-accent" />
            <span className="truncate">{room.view}</span>
          </p>
        </div>
      </div>

      {/* Dates & Guest Specs */}
      <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-charcoal-muted dark:text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            Dates
          </span>
          <span className="font-semibold text-primary dark:text-white font-mono">
            {checkIn} &rarr; {checkOut}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-charcoal-muted dark:text-gray-400">Duration</span>
          <span className="font-semibold text-primary dark:text-white font-mono">
            {effectiveNights} {effectiveNights === 1 ? 'Night' : 'Nights'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-charcoal-muted dark:text-gray-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-accent" />
            Occupants
          </span>
          <span className="font-semibold text-primary dark:text-white">
            {adults} {adults === 1 ? 'Adult' : 'Adults'}
            {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
          </span>
        </div>

        {roomsCount > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-charcoal-muted dark:text-gray-400">Number of Suites</span>
            <span className="font-semibold text-primary dark:text-white font-mono">
              {roomsCount} Suites
            </span>
          </div>
        )}
      </div>

      {/* Financial Line Items */}
      <div className="space-y-2.5 text-xs pt-1 border-t border-border/70 dark:border-white/10">
        <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
          <span>
            Suite Tariff (€{room.pricePerNight.toLocaleString()} &times; {effectiveNights} night
            {effectiveNights > 1 ? 's' : ''})
          </span>
          <span className="font-mono font-semibold text-primary dark:text-white">
            €{baseRate.toLocaleString()}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>Sovereign Tier Discount ({discountRate * 100}%)</span>
            <span className="font-mono font-semibold">-€{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
          <span className="flex items-center gap-1">
            Luxury Hospitality Tax (10%)
            <Info className="w-3 h-3 text-gray-400" />
          </span>
          <span className="font-mono font-semibold text-primary dark:text-white">
            €{taxAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
          <span className="flex items-center gap-1">
            Sovereign Concierge & Resort Fee (5%)
            <Info className="w-3 h-3 text-gray-400" />
          </span>
          <span className="font-mono font-semibold text-primary dark:text-white">
            €{serviceFee.toLocaleString()}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-dashed border-border/80 dark:border-white/15 flex items-baseline justify-between">
          <div>
            <span className="font-serif font-bold text-sm text-primary dark:text-white block">
              Total Amount
            </span>
            <span className="text-[10px] text-charcoal-muted dark:text-gray-400">
              Includes all taxes & service fees
            </span>
          </div>
          <div className="text-right">
            <span className="font-serif text-2xl font-bold text-accent">
              €{grandTotal.toLocaleString()}
            </span>
            <span className="block text-[10px] text-charcoal-muted font-mono">EUR</span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/25 space-y-1.5 text-[11px] text-charcoal dark:text-gray-200">
        <div className="flex items-center gap-2 font-semibold text-accent">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Sovereign Best Rate Guarantee</span>
        </div>
        <p className="text-[10px] text-charcoal-muted dark:text-gray-400 leading-normal">
          Complimentary cancellation up to 48 hours before check-in. Instant reservation folio recorded in Lazfort Central Reservation Engine.
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;

