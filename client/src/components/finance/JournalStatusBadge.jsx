import React from 'react';
import { CheckCircle2, Clock, RotateCcw, XCircle, FileText, Check } from 'lucide-react';

export const JournalStatusBadge = ({ status = 'draft', size = 'md' }) => {
  const norm = (status || '').toLowerCase().replace(/[\s-]/g, '_');

  const configs = {
    posted: {
      label: 'Posted to Ledger',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    draft: {
      label: 'Draft Voucher',
      color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    approved: {
      label: 'Audit Approved',
      color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: Check,
    },
    reversed: {
      label: 'Contra Reversed',
      color: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
      icon: RotateCcw,
    },
    rejected: {
      label: 'Rejected / Disallowed',
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
  };

  const current = configs[norm] || {
    label: status,
    color: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    icon: FileText,
  };

  const Icon = current.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${current.color} whitespace-nowrap text-center ${
        isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1 text-xs'
      }`}
    >
      <Icon className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />
      <span className="whitespace-nowrap">{current.label}</span>
    </span>
  );
};

