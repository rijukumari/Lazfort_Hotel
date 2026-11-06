import React from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import {
  XCircle,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export const CancellationReportsPage = () => {
  const cancelledBookings = [
    {
      code: 'AUR-8812',
      guestName: 'Baroness Caroline Vance',
      suite: 'Presidential Suite 1201',
      date: '2026-10-24',
      reason: 'Yacht Charter Schedule Shift',
      refundAmount: '$4,200',
      feeRetained: '$800',
    },
    {
      code: 'AUR-8815',
      guestName: 'Henri Dupond',
      suite: 'Oceanfront Villa 302',
      date: '2026-10-18',
      reason: 'Flight Disruption (Geneva)',
      refundAmount: '$2,800',
      feeRetained: '$600',
    },
    {
      code: 'AUR-8819',
      guestName: 'Lord George Hamilton',
      suite: 'Executive Penthouse 804',
      date: '2026-10-12',
      reason: 'Medical Emergency',
      refundAmount: '$6,500',
      feeRetained: '$0 (Full Waiver)',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Cancellation & Refund Analytics"
        description="Cancellation rates, reason distributions, retained cancellation charges, and statutory refund tracking."
        badge="4.2% Cancellation Rate"
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cancellation Rate"
          value="4.2%"
          change="Industry benchmark 12%"
          isPositive={true}
          icon={XCircle}
          subtitle="Low portfolio churn"
        />
        <StatCard
          title="Cancelled Bookings"
          value="12 Stays"
          change="Last 90 Days"
          isPositive={true}
          icon={TrendingDown}
          subtitle="Strict 48h policy"
        />
        <StatCard
          title="Retained Forfeiture"
          value="$18,400"
          change="Non-refundable deposits"
          isPositive={true}
          icon={DollarSign}
          subtitle="Protection yield"
        />
        <StatCard
          title="Processed Refunds"
          value="$34,200"
          change="Cleared via merchant"
          isPositive={true}
          icon={RotateCcw}
          subtitle="Sovereign banking"
        />
      </div>

      {/* Table of Recent Cancellations */}
      <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-primary dark:text-white">
          Recent Cancellation Logs & Retention Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Reservation Code</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Chamber</th>
                <th className="py-3 px-4">Cancellation Reason</th>
                <th className="py-3 px-4">Refund Issued</th>
                <th className="py-3 px-4">Fee Retained</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {cancelledBookings.map((c, idx) => (
                <tr key={idx} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">{c.code}</td>
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">{c.guestName}</td>
                  <td className="py-3.5 px-4 text-charcoal-muted">{c.suite}</td>
                  <td className="py-3.5 px-4 text-rose-500 font-medium">{c.reason}</td>
                  <td className="py-3.5 px-4 font-mono text-primary dark:text-white">{c.refundAmount}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{c.feeRetained}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CancellationReportsPage;
