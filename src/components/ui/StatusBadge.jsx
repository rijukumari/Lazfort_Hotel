import React from 'react';

const STATUS_CONFIGS = {
  // Operational Positive
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  available: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  checked_in: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  clean: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  inspected: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },

  // Attention / Progress
  occupied: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  pending_approval: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  trial: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  expiring_soon: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  partial: { bg: 'bg-amber-500/10', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500' },

  // Critical / Negative
  dirty: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  cancelled: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  suspended: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  expired: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  rejected: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-500' },

  // Subscription Tiers / Royal Accent
  palace_enterprise: { bg: 'bg-accent/15', text: 'text-accent font-bold', border: 'border-accent/40', dot: 'bg-accent' },
  grand_luxury: { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-500' },
  boutique_elite: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-500' },
};

export const StatusBadge = ({
  status = '',
  size = 'md',
  className = '',
}) => {
  if (!status) return null;
  const key = String(status).toLowerCase().replace(/[\s-]/g, '_');
  const style = STATUS_CONFIGS[key] || {
    bg: 'bg-charcoal/10 dark:bg-white/10',
    text: 'text-charcoal dark:text-gray-200',
    border: 'border-border/80 dark:border-white/10',
    dot: 'bg-charcoal-muted',
  };

  const isSmall = size === 'sm';
  const label = String(status).replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium tracking-wide uppercase ${
        isSmall ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5'
      } ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      <span className={`rounded-full shrink-0 ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${style.dot}`} />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;

