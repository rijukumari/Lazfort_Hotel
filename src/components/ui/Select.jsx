import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  options,
  children,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      <select
        className={`w-full appearance-none px-3.5 py-2.5 pr-9 text-xs bg-white dark:bg-primary-900/60 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-primary dark:text-white cursor-pointer transition-all ${
          error
            ? 'border-rose-500 focus:border-rose-500'
            : 'border-border/80 dark:border-white/10 focus:border-accent'
        } ${className}`}
        {...props}
      >
        {options
          ? options.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-accent absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default Select;

