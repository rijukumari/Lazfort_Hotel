import React from 'react';
import { NavIcon } from '../navigation/NavIcon';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  period,
  icon,
  iconName = 'Sparkles',
}) => {
  let changeText = null;
  let changePositive = isPositive;

  if (typeof change === 'string') {
    changeText = change;
  } else if (change && typeof change === 'object') {
    const val = change.value;
    if (val !== undefined && val !== null) {
      changeText = typeof val === 'number' ? `${val > 0 ? '+' : ''}${val}%` : String(val);
    }
    if (change.isPositive !== undefined) {
      changePositive = !!change.isPositive;
    }
  }

  const subText = subtitle || period;

  return (
    <div className="card-luxury-3d p-6 group transition-all duration-300">
      {/* Top subtle golden shimmer highlight */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/60 to-transparent pointer-events-none group-hover:via-accent transition-all duration-500" />
      
      {/* Ambient background gold glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-accent/5 rounded-full pointer-events-none group-hover:bg-accent/15 blur-2xl transition-all duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-charcoal-muted dark:text-gray-400 font-mono">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary dark:text-white mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        
        {/* 3D Embossed Gold Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/25 via-accent/10 to-transparent border border-accent/40 flex items-center justify-center text-accent shadow-sm group-hover:scale-110 group-hover:border-accent group-hover:shadow-gold transition-all duration-300 flex-shrink-0">
          {icon ? (
            icon
          ) : (
            <NavIcon name={iconName} className="w-5 h-5 text-accent group-hover:rotate-6 transition-transform" />
          )}
        </div>
      </div>

      {(changeText || subText) && (
        <div className="mt-5 pt-3.5 border-t border-border/70 dark:border-white/10 flex items-center justify-between text-xs relative z-10 gap-2">
          {changeText && (
            <span
              className={`inline-flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-lg text-[11px] flex-shrink-0 ${
                changePositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25'
              }`}
            >
              {changePositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {changeText}
            </span>
          )}
          {subText && (
            <span className="text-[11px] text-charcoal-muted dark:text-gray-400 ml-auto truncate font-medium">
              {subText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const StatsGrid = ({
  children,
  columns,
  cols = 4,
}) => {
  const count = columns || cols || 4;
  const gridCols =
    count === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : count === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : count === 5
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return <div className={`grid gap-5 sm:gap-6 ${gridCols}`}>{children}</div>;
};

export default StatCard;

