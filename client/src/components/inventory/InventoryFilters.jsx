import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const InventoryFilters = ({
  filters = [],
  onReset,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-charcoal-muted dark:text-gray-400 mr-0.5 shrink-0">
        <Filter className="w-3.5 h-3.5 text-accent" />
        <span className="font-semibold text-[10px] uppercase tracking-wider hidden sm:inline">Filters:</span>
      </div>

      {filters.map((f, i) => (
        <select
          key={i}
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          className="px-2.5 py-2 rounded-xl text-xs bg-white/70 dark:bg-black/40 border border-border dark:border-white/10 focus:border-accent text-charcoal dark:text-gray-200 focus:outline-none transition-colors cursor-pointer shadow-sm shrink-0 font-medium"
        >
          {f.options.map((opt, optIdx) => (
            <option key={optIdx} value={opt.value} className="bg-white dark:bg-[#101725] text-charcoal dark:text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-accent border border-border/60 dark:border-white/10 hover:border-accent/40 bg-white/40 dark:bg-white/[0.03] hover:bg-accent/10 transition-all flex items-center gap-1.5 shrink-0"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium">Reset</span>
        </button>
      )}
    </div>
  );
};

export default InventoryFilters;

