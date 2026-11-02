import React from 'react';

const STATUS_CONFIGS = {
  Pending: {
    bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
    label: 'Pending Approval',
  },
  New: {
    bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500 animate-pulse',
    label: 'New Order',
  },
  Accepted: {
    bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500',
    label: 'Accepted',
  },
  Preparing: {
    bg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    dot: 'bg-purple-500 animate-spin',
    label: 'Preparing in Kitchen',
  },
  Ready: {
    bg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-500',
    label: 'Ready for Service',
  },
  Served: {
    bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Served to Table',
  },
  Delivered: {
    bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Delivered',
  },
  Completed: {
    bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Completed & Closed',
  },
  Cancelled: {
    bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    dot: 'bg-rose-500',
    label: 'Cancelled',
  },
};

export const OrderStatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || 'Pending').trim();
  const config = STATUS_CONFIGS[normalized] || {
    bg: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
    dot: 'bg-gray-500',
    label: normalized,
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
