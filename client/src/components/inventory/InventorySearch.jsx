import React from 'react';
import { Search, X } from 'lucide-react';

export const InventorySearch = ({
  value,
  onChange,
  placeholder = 'Search items, SKU, purveyor or department...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/10 focus:border-accent dark:focus:border-accent text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted/60 dark:placeholder:text-gray-500 focus:outline-none transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal-muted hover:text-accent rounded-lg"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default InventorySearch;

