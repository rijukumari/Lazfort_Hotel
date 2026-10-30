import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import {
  AlertTriangle,
  RotateCw,
  Eye,
  Sliders,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const SubscriptionTable = ({
  subscriptions,
  type,
  onViewDetails,
  onRenew,
  onManage,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="card-luxury p-12 text-center rounded-2xl border border-dashed border-border dark:border-border-dark">
        <Building2 className="w-12 h-12 text-accent/60 mx-auto mb-3" />
        <h4 className="font-serif font-bold text-lg text-primary dark:text-white">
          No {type === 'active' ? 'Active' : 'Expired'} Subscriptions Found
        </h4>
        <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
          {type === 'active'
            ? 'There are currently no active property subscriptions matching your filter criteria.'
            : 'No property subscriptions are currently in lapsed or terminated status.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-luxury-3d overflow-hidden rounded-2xl border border-border/80 dark:border-accent/25">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 dark:border-border-dark/80 bg-ivory/60 dark:bg-primary-900/60 text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
                <th className="py-3.5 px-4">Subscription ID</th>
                <th className="py-3.5 px-4">Hotel Property</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Term Dates</th>
                <th className="py-3.5 px-4">Billing & Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {subscriptions.map(sub => {
                const isExpiringSoon = sub.status === 'expiring_soon';
                const isExpired = sub.status === 'expired';

                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-ivory/40 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Subscription ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-accent">
                        {sub.subscriptionId}
                      </div>
                      <span className="text-[10px] text-charcoal-muted">
                        {sub.autoRenew ? 'Auto-Renew: ON' : 'Auto-Renew: OFF'}
                      </span>
                    </td>

                    {/* Hotel Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <img
                          src={sub.hotelImage}
                          alt={sub.hotelName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-border/80 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-primary dark:text-white font-serif line-clamp-1">
                            {sub.hotelName}
                          </p>
                          <p className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-accent shrink-0" />
                            <span className="truncate max-w-[150px]">{sub.hotelLocation}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan Name */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={sub.planName} size="sm" />
                      <span className="text-[10px] text-charcoal-muted block mt-1 font-mono">
                        Cycle: {sub.billingCycle}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <p className="text-charcoal dark:text-gray-300">
                          <span className="text-charcoal-muted">Start: </span>{sub.startDate}
                        </p>
                        <p className={`font-semibold ${isExpiringSoon ? 'text-amber-600 dark:text-amber-400' : isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-charcoal dark:text-gray-300'}`}>
                          <span className="text-charcoal-muted">Expiry: </span>{sub.expiryDate}
                        </p>
                        {isExpired && sub.lapsedDays && (
                          <span className="inline-block text-[10px] text-rose-500 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                            Lapsed {sub.lapsedDays} days ago
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Billing Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-serif font-bold text-accent text-sm">
                        ${sub.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block font-mono">
                        {sub.billingCycle === 'Annually' ? 'Per Annum' : 'Monthly Recurring'}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={sub.paymentStatus} size="sm" />
                    </td>

                    {/* Subscription Status & Warning */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge status={sub.status} size="sm" />
                        {isExpiringSoon && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-lg animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            Expiring Soon
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => onViewDetails(sub)}
                          className="p-1.5 rounded-xl border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
                          title="View Subscription Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {onRenew && (
                          <button
                            onClick={() => onRenew(sub)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl gold-gradient-bg text-primary-950 text-[11px] font-bold shadow-sm"
                            title="Renew Subscription"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Renew</span>
                          </button>
                        )}

                        {onManage && (
                          <button
                            onClick={() => onManage(sub)}
                            className="p-1.5 rounded-xl border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
                            title="Manage Plan Tier / Billing"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-charcoal-muted dark:text-gray-400">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-xl border border-border dark:border-border-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-xl border border-border dark:border-border-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTable;

