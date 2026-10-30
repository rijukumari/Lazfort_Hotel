import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, Star, Building2, TrendingUp, ArrowUpRight, Edit } from 'lucide-react';

export const HotelCard = ({ hotel, onSelect, onEdit }) => {
  return (
    <div className="card-luxury-3d overflow-hidden group flex flex-col">
      {/* Top golden shimmer border */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none z-20 group-hover:via-accent transition-all duration-500" />

      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute top-3.5 left-3.5">
          <StatusBadge status={hotel.status} />
        </div>
        <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1.5 border border-accent/30 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span>{hotel.stars || 5} Stars Palace</span>
        </div>
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <p className="text-xs text-accent font-medium flex items-center gap-1 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            {hotel.location}
          </p>
          <h4 className="font-serif font-bold text-lg leading-snug line-clamp-1 text-white">
            {hotel.name}
          </h4>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs bg-ivory/60 dark:bg-white/[0.04] p-3.5 rounded-2xl border border-border/70 dark:border-white/10">
          <div>
            <span className="text-charcoal-muted dark:text-gray-400 block text-[10px] uppercase font-mono tracking-wider font-semibold">
              Inventory
            </span>
            <span className="font-semibold text-primary dark:text-white flex items-center gap-1 mt-1">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              {hotel.totalRooms} Luxury Keys
            </span>
          </div>
          <div>
            <span className="text-charcoal-muted dark:text-gray-400 block text-[10px] uppercase font-mono tracking-wider font-semibold">
              Occupancy
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {hotel.occupancyRate}% Live
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400">
          <span>General Manager:</span>
          <span className="font-medium text-primary dark:text-white font-serif">{hotel.adminName}</span>
        </div>

        <div className="pt-3 border-t border-border/60 dark:border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-mono block">Monthly Run Rate</span>
            <span className="text-base font-serif font-bold text-accent">
              ${(hotel.revenueThisMonth / 1000).toFixed(0)}k / month
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(hotel)}
                className="p-2 rounded-xl border border-border/80 dark:border-white/15 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent transition-all bg-ivory/60 dark:bg-white/[0.04]"
                title="Edit Property"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onSelect && (
              <button
                type="button"
                onClick={() => onSelect(hotel)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl gold-gradient-bg text-primary-900 btn-3d flex items-center gap-1.5"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

