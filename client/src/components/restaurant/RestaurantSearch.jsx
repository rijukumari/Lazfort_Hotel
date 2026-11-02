import React from 'react';
import { Search, X } from 'lucide-react';

export const RestaurantSearch = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
}) => {
  return (
    <div className={`relative flex-1 min-w-[240px] ${className}`}>
      <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal-muted hover:text-accent transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default RestaurantSearch;
