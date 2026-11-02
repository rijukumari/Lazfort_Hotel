import React from 'react';

export const FinanceStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  color = 'gold',
  onClick,
}) => {
  const colorMap = {
    gold: {
      border: 'border-accent/30 hover:border-accent/60',
      iconBg: 'bg-accent/15 text-accent',
      accentGlow: 'hover:shadow-[0_10px_25px_-5px_rgba(198,166,107,0.2)]',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-500/15 text-emerald-500',
      accentGlow: 'hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.2)]',
    },
    rose: {
      border: 'border-rose-500/30 hover:border-rose-500/60',
      iconBg: 'bg-rose-500/15 text-rose-500',
      accentGlow: 'hover:shadow-[0_10px_25px_-5px_rgba(244,63,94,0.2)]',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      iconBg: 'bg-amber-500/15 text-amber-500',
      accentGlow: 'hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.2)]',
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-500/60',
      iconBg: 'bg-blue-500/15 text-blue-500',
      accentGlow: 'hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.2)]',
    },
    purple: {
      border: 'border-purple-500/30 hover:border-purple-500/60',
      iconBg: 'bg-purple-500/15 text-purple-500',
      accentGlow: 'hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.2)]',
    },
  };

  const scheme = colorMap[color] || colorMap.gold;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-3xl border bg-white dark:bg-primary-900 transition-all duration-300 shadow-sm ${
        scheme.border
      } ${scheme.accentGlow} ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-charcoal-muted dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-primary dark:text-white tracking-tight">
            {value}
          </p>
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-border/60 dark:border-white/5 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-charcoal-muted dark:text-gray-400 font-mono text-[11px] truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={`font-semibold shrink-0 ${
                trendPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FinanceStatCard;

