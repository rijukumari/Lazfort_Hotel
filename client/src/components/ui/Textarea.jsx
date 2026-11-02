import React from 'react';

export const Textarea = ({
  className = '',
  rows = 4,
  ...props
}) => {
  return (
    <textarea
      rows={rows}
      className={`w-full px-3.5 py-2.5 text-xs bg-white dark:bg-primary-900 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white placeholder:text-charcoal-muted/60 transition-colors resize-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;

