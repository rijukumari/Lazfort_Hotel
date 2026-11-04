import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText } from 'lucide-react';

export const InvoiceStatusBadge = ({ status = 'issued', size = 'md' }) => {
  const norm = (status || '').toLowerCase().replace(/[\s-]/g, '_');

  const configs = {
    paid: {
      label: 'Settled in Full',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    partially_paid: {
      label: 'Partially Paid',
      color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: Clock,
    },
    partial: {
      label: 'Partially Paid',
      color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: Clock,
    },
    issued: {
      label: 'Dispatched / Issued',
      color: 'bg-accent/15 text-accent border-accent/30',
      icon: FileText,
    },
    draft: {
      label: 'Draft Invoice',
      color: 'bg-charcoal/10 text-charcoal dark:text-gray-300 border-border',
      icon: Clock,
    },
    overdue: {
      label: 'Past Due / Overdue',
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: AlertCircle,
    },
    cancelled: {
      label: 'Cancelled / Void',
      color: 'bg-charcoal/15 text-charcoal-muted border-border',
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
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${current.color} whitespace-nowrap text-center ${isSm ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1 text-xs'
        }`}
    >
      <Icon className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />
      <span className="whitespace-nowrap">{current.label}</span>
    </span>
  );
};

export default InvoiceStatusBadge;

