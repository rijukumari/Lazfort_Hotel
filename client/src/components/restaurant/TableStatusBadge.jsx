import React from 'react';

const TABLE_STATUS_CONFIG = {
  Available: {
    bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Available',
  },
  Occupied: {
    bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    dot: 'bg-rose-500',
    label: 'Occupied',
  },
  Reserved: {
    bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
    label: 'Reserved',
  },
  Cleaning: {
    bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500 animate-pulse',
    label: 'Cleaning',
  },
  Maintenance: {
    bg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    dot: 'bg-purple-500',
    label: 'Maintenance',
  },
};

export const TableStatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || 'Available').trim();
  const config = TABLE_STATUS_CONFIG[normalized] || {
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

export default TableStatusBadge;
