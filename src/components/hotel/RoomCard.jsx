import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Users, Bed, Eye, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const RoomCard = ({
  room,
  nights = 1,
  isAvailableForDates = true,
  showRoomNumber = false,
  onBookNow,
  onViewDetails,
}) => {
  const effectiveAvailable = isAvailableForDates && room.status !== 'maintenance';
  const totalPrice = room.pricePerNight * (nights > 0 ? nights : 1);

  return (
    <div className="card-luxury-3d overflow-hidden group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Top golden shimmer border */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none z-20 group-hover:via-accent transition-all duration-500" />

      {/* Image with Tag & Price */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        {/* Date Availability Status Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          {effectiveAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-md border border-emerald-400/40 shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Available
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-600/90 text-white backdrop-blur-md border border-rose-400/40 shadow-sm flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Booked for Dates
            </span>
          )}
        </div>

        {/* Room number shown only when security/business rules allow */}
        {showRoomNumber ? (
          <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-accent border border-accent/40 shadow-sm">
            {room.roomNumber}
          </div>
        ) : (
          <div className="absolute top-3.5 right-3.5 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-gray-300 border border-white/10">
            Floor {room.floor}
          </div>
        )}

        {/* Price & Name overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
          <div className="max-w-[65%]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-mono font-bold block">
              {room.type}
            </span>
            <h4 className="font-serif font-bold text-lg leading-snug line-clamp-1 text-white drop-shadow-sm">
              {room.name}
            </h4>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-serif font-bold text-accent">
              €{room.pricePerNight?.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-300 block font-mono">/ night</span>
          </div>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Short Description */}
        <p className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-2 leading-relaxed">
          {room.description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 text-xs py-2.5 border-y border-border/70 dark:border-white/10 text-charcoal-muted dark:text-gray-400">
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="truncate">Up to {room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Bed className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="truncate">{room.bedType}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Eye className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="truncate">{room.view}</span>
          </div>
        </div>

        {/* Amenities Highlights */}
        <div className="flex flex-wrap gap-1.5">
          {room.amenities?.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2.5 py-0.5 rounded-lg bg-ivory dark:bg-white/[0.05] text-charcoal-muted dark:text-gray-300 border border-border/50 dark:border-white/10 font-medium"
            >
              {amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 text-accent font-semibold font-mono">
              +{room.amenities.length - 3} luxury amenities
            </span>
          )}
        </div>

        {/* Total Price calculation based on selected dates */}
        {nights > 1 && (
          <div className="p-2.5 rounded-xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-charcoal-muted dark:text-gray-400">
              Total for <strong className="text-primary dark:text-white font-mono">{nights} nights</strong>:
            </span>
            <span className="font-serif font-bold text-accent text-sm">
              €{totalPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2.5">
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(room)}
              className="flex-1 py-2.5 text-xs font-semibold rounded-2xl btn-secondary-3d text-charcoal dark:text-gray-200 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3 text-accent" />
            </button>
          )}

          {onBookNow && (
            <button
              type="button"
              disabled={!effectiveAvailable}
              onClick={() => onBookNow(room)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-2xl btn-3d flex items-center justify-center gap-1.5 transition-all ${
                effectiveAvailable
                  ? 'gold-gradient-bg text-primary-900 shadow-gold hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-300 dark:border-gray-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{effectiveAvailable ? 'Book Suite' : 'Reserved'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

