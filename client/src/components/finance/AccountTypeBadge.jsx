import React from 'react';
import { Landmark, TrendingUp, TrendingDown, Scale, Shield } from 'lucide-react';

export const AccountTypeBadge = ({ type = 'Asset', size = 'md' }) => {
  const norm = (type || '').toLowerCase();

  const configs = {
    asset: {
      label: 'Asset',
      color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: Landmark,
    },
    liability: {
      label: 'Liability',
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: Scale,
    },
    equity: {
      label: 'Equity',
      color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      icon: Shield,
    },
    revenue: {
      label: 'Revenue',
      color: 'bg-accent/20 text-accent border-accent/40',
      icon: TrendingUp,
    },
    expense: {
      label: 'Expense',
      color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: TrendingDown,
    },
  };

  const current = configs[norm] || {
    label: type,
    color: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    icon: Landmark,
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

export default AccountTypeBadge;

