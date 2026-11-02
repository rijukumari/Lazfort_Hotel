import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export const PriorityBadge = ({ priority, className = '' }) => {
  const norm = String(priority || '').toLowerCase().trim();

  let label = 'Medium';
  let badgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
  let Icon = ArrowUp;

  if (norm === 'critical') {
    label = 'Critical (Room Blocked)';
    badgeStyle = 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40 font-bold';
    Icon = AlertCircle;
  } else if (norm === 'high') {
    label = 'High Priority';
    badgeStyle = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    Icon = ArrowUp;
  } else if (norm === 'low') {
    label = 'Low Priority';
    badgeStyle = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    Icon = ArrowDown;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeStyle} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
};

export default PriorityBadge;

