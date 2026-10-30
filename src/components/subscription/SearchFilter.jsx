import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchFilter = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  dropdowns = [],
  totalResults,
  onReset,
  className = '',
}) => {
  const hasActiveFilters = searchTerm.trim().length > 0 || dropdowns.some(d => d.value !== 'all' && d.value !== '');

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 text-xs bg-white dark:bg-primary-900 border border-border dark:border-accent/25 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white placeholder:text-charcoal-muted transition-colors shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal dark:hover:text-white p-0.5"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns and Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {dropdowns.map(dropdown => (
          <select
            key={dropdown.key}
            value={dropdown.value}
            onChange={e => dropdown.onChange(e.target.value)}
            className="px-3 py-2.5 text-xs bg-white dark:bg-primary-900 border border-border dark:border-accent/25 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent text-charcoal dark:text-white cursor-pointer shadow-sm transition-colors"
          >
            {dropdown.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {hasActiveFilters && onReset && (
          <button
            onClick={onReset}
            className="px-3 py-2 text-xs font-semibold rounded-2xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1"
            title="Reset all filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        <span className="text-[11px] font-mono text-charcoal-muted dark:text-gray-400 bg-ivory dark:bg-white/[0.04] px-3 py-2 rounded-2xl border border-border/80 dark:border-white/5 shadow-sm">
          {totalResults} {totalResults === 1 ? 'Record' : 'Records'}
        </span>
      </div>
    </div>
  );
};

export default SearchFilter;

