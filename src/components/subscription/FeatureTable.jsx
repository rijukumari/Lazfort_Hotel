import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Edit, Eye, Power, ShieldCheck, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export const FeatureTable = ({
  features,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (features.length === 0) {
    return (
      <div className="card-luxury p-12 text-center rounded-2xl border border-dashed border-border dark:border-border-dark">
        <ShieldCheck className="w-12 h-12 text-accent/60 mx-auto mb-3" />
        <h4 className="font-serif font-bold text-lg text-primary dark:text-white">
          No Plan Features Found
        </h4>
        <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
          No feature capabilities matched your search term or active category filters.
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
                <th className="py-3.5 px-4">Feature Code</th>
                <th className="py-3.5 px-4">Capability & Description</th>
                <th className="py-3.5 px-4">Module Category</th>
                <th className="py-3.5 px-4">Applicable Plans</th>
                <th className="py-3.5 px-4">Configured Limits</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {features.map(feat => {
                const isEnabled = feat.status === 'enabled';

                return (
                  <tr
                    key={feat.id}
                    className="hover:bg-ivory/40 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Code */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-accent">
                        {feat.code}
                      </span>
                      {feat.isCore && (
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          Core Pillar
                        </span>
                      )}
                    </td>

                    {/* Name & Description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-primary dark:text-white font-serif text-[13px]">
                        {feat.name}
                      </p>
                      <p className="text-[11px] text-charcoal-muted line-clamp-2 mt-0.5 leading-relaxed">
                        {feat.description}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-ivory dark:bg-white/5 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200">
                        {feat.category}
                      </span>
                    </td>

                    {/* Applicable Plans */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {feat.applicablePlans.map((plan, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-accent/10 border border-accent/30 text-accent font-semibold"
                          >
                            {plan}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Configured Limits */}
                    <td className="py-3.5 px-4 text-[11px] text-charcoal dark:text-gray-300 max-w-[180px]">
                      <span className="line-clamp-2 leading-relaxed">
                        {feat.configuredLimits}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={feat.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => onViewDetails(feat)}
                          className="p-1.5 rounded-xl border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
                          title="View Feature Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(feat)}
                          className="p-1.5 rounded-xl border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
                          title="Edit Feature"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onToggleStatus(feat)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            isEnabled
                              ? 'border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                              : 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                          }`}
                          title={isEnabled ? 'Disable Feature' : 'Enable Feature'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {onDelete && (
                          <button
                            onClick={() => onDelete(feat)}
                            className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Feature"
                          >
                            <Trash2 className="w-4 h-4" />
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

export default FeatureTable;

