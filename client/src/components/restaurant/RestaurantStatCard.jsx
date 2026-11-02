import React from 'react';

export const RestaurantStatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  variant = 'default',
  badgeText,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl border border-border/80 dark:border-white/10 p-5 shadow-sm hover:shadow-gold transition-all duration-300 group hover:-translate-y-0.5">
      {/* Top accent shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent group-hover:via-accent transition-all" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {value}
            </h3>
            {badgeText && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 flex items-center justify-center text-accent shadow-sm group-hover:scale-110 group-hover:border-accent transition-all shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-4 pt-3 border-t border-border/60 dark:border-white/5 flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400">
          <span className="truncate">{subtitle}</span>
          {change && (
            <span
              className={`font-mono text-[11px] font-semibold shrink-0 ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantStatCard;
