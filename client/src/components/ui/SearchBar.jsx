import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-xs bg-ivory/60 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-primary dark:text-white placeholder:text-charcoal-muted"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-accent p-0.5 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

