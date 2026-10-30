import React from 'react';

export const Input = ({
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      )}
      <input
        className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-primary-900/60 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-primary dark:text-white placeholder:text-charcoal-muted/60 transition-all ${
          Icon ? 'pl-10' : ''
        } ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-border/80 dark:border-white/10 focus:border-accent'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;

