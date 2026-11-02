import React from 'react';
import { CheckCircle2, Clock, CheckCheck, XCircle, AlertCircle } from 'lucide-react';

export const BookingStatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  const config = {
    confirmed: {
      label: 'Confirmed',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/30',
    },
    checked_in: {
      label: 'Checked In',
      icon: <CheckCheck className="w-3.5 h-3.5" />,
      bg: 'bg-accent/15 dark:bg-accent/25',
      text: 'text-accent dark:text-accent font-bold',
      border: 'border-accent/40',
    },
    checked_out: {
      label: 'Checked Out',
      icon: <Clock className="w-3.5 h-3.5" />,
      bg: 'bg-slate-500/10 dark:bg-slate-400/20',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-500/30',
    },
    cancelled: {
      label: 'Cancelled',
      icon: <XCircle className="w-3.5 h-3.5" />,
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-500/30',
    },
    pending: {
      label: 'Pending',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/30',
    },
  };

  const badgeConfig = config[normalized] || {
    label: (status || '').replace(/_/g, ' '),
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-md transition-all ${
        badgeConfig.bg
      } ${badgeConfig.text} ${badgeConfig.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {badgeConfig.icon}
      <span className="capitalize tracking-wide">{badgeConfig.label}</span>
    </span>
  );
};

export const PaymentStatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();
  const styles = {
    paid: {
      label: 'Paid in Full',
      bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/30',
    },
    partial: {
      label: 'Deposit Paid',
      bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/30',
    },
    pending: {
      label: 'Pay at Check-In',
      bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/30',
    },
    refunded: {
      label: 'Refunded',
      bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500/30',
    },
  };

  const current = styles[normalized] || {
    label: status,
    bg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-md border ${
        current.bg
      } ${current.border} ${size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[11px]'}`}
    >
      {current.label}
    </span>
  );
};

export default BookingStatusBadge;

