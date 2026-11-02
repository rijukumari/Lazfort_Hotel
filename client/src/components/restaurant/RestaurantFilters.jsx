import React from 'react';
import { Filter } from 'lucide-react';

export const RestaurantFilters = ({
  options = [],
  activeFilter,
  onSelectFilter,
  label = 'Filter',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      <div className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-muted dark:text-gray-400 mr-1 uppercase tracking-wider">
        <Filter className="w-3 h-3 text-accent" />
        <span>{label}:</span>
      </div>

      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const count = typeof opt === 'object' && opt.count !== undefined ? opt.count : null;
        const isSelected = activeFilter === value;

        return (
          <button
            key={value}
            onClick={() => onSelectFilter(value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${isSelected
                ? 'bg-accent/15 border-accent text-accent shadow-sm font-semibold'
                : 'bg-white/60 dark:bg-[#121926] border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-primary dark:hover:text-white hover:border-accent/40'
              }`}
          >
            <span>{optLabel}</span>
            {count !== null && (
              <span
                className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected
                    ? 'bg-accent text-white dark:text-primary-950 font-bold'
                    : 'bg-gray-100 dark:bg-gray-800 text-charcoal-muted'
                  }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default RestaurantFilters;
