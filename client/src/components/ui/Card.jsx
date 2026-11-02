import React from 'react';

export const Card = ({
  children,
  variant = 'luxury',
  className = '',
  ...props
}) => {
  const baseClasses = {
    luxury: 'card-luxury p-6 rounded-3xl border border-border/80 dark:border-accent/25 shadow-sm',
    '3d': 'card-luxury-3d p-6 rounded-3xl border border-accent/30 shadow-md',
    glass: 'bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-border/80 dark:border-white/10 shadow-sm',
    subtle: 'bg-ivory/50 dark:bg-primary-900/40 p-5 rounded-2xl border border-border/60 dark:border-white/5',
  };

  const cardClass = baseClasses[variant] || baseClasses.luxury;

  return (
    <div className={`${cardClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up',
  color = 'gold',
  className = '',
}) => {
  const colorStyles = {
    gold: 'border-accent/30 bg-accent/[0.03] text-accent',
    emerald: 'border-emerald-500/30 bg-emerald-500/[0.03] text-emerald-600 dark:text-emerald-400',
    amber: 'border-amber-500/30 bg-amber-500/[0.03] text-amber-600 dark:text-amber-400',
    rose: 'border-rose-500/30 bg-rose-500/[0.03] text-rose-600 dark:text-rose-400',
    primary: 'border-border dark:border-white/10 text-primary dark:text-white',
  };

  const selectedColor = colorStyles[color] || colorStyles.gold;

  return (
    <div className={`card-luxury p-5 rounded-3xl border ${selectedColor} ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-current/10">
            <Icon className="w-5 h-5 text-current" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-3xl font-bold text-primary dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-mono font-bold ${
              trendType === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-charcoal-muted mt-1 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Card;

