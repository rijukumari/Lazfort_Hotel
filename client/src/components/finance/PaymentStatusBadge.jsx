import React from 'react';
import { CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';

export const PaymentStatusBadge = ({ status = 'pending', size = 'md' }) => {
  const norm = (status || '').toLowerCase().replace(/[\s-]/g, '_');

  const configs = {
    paid: {
      label: 'Settled / Paid',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    success: {
      label: 'Success',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    settled: {
      label: 'Settled',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    pending: {
      label: 'Pending Settlement',
      color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    partial: {
      label: 'Partially Paid',
      color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: AlertTriangle,
    },
    partially_paid: {
      label: 'Partially Paid',
      color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: AlertTriangle,
    },
    failed: {
      label: 'Declined / Failed',
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
    refunded: {
      label: 'Refunded',
      color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      icon: RotateCcw,
    },
    void: {
      label: 'Void / Cancelled',
      color: 'bg-charcoal/10 text-charcoal-muted border-border',
      icon: XCircle,
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
    open: {
      label: 'Open Folio',
      color: 'bg-accent/15 text-accent border-accent/30',
      icon: Clock,
    },
  };

  const current = configs[norm] || {
    label: status,
    color: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
    icon: Clock,
  };

  const Icon = current.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${current.color} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <Icon className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};

export default PaymentStatusBadge;

