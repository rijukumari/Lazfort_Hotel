import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const MaintenanceFilters = ({
  filters = [],
  onReset,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-charcoal-muted dark:text-gray-400 mr-1">
        <Filter className="w-3.5 h-3.5 text-accent" />
        <span className="font-medium text-[11px] uppercase tracking-wider hidden sm:inline">Filters:</span>
      </div>

      {filters.map((f, i) => (
        <select
          key={i}
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/10 focus:border-accent text-charcoal dark:text-gray-200 focus:outline-none transition-colors cursor-pointer shadow-sm"
        >
          {f.options.map((opt, optIdx) => (
            <option key={optIdx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {onReset && (
        <button
          onClick={onReset}
          className="px-2.5 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-accent border border-transparent hover:border-accent/30 hover:bg-white/40 dark:hover:bg-white/5 transition-all flex items-center gap-1.5"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden md:inline text-[11px]">Reset</span>
        </button>
      )}
    </div>
  );
};

export default MaintenanceFilters;

