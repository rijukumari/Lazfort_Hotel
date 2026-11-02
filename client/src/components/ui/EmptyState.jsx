import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Records Found',
  description = 'No items match your active filters or query. Try adjusting your parameters or add a new record.',
  action,
  className = '',
}) => {
  return (
    <div className={`card-luxury p-12 text-center rounded-3xl border border-dashed border-border dark:border-white/10 space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
        {title}
      </h3>
      <p className="text-xs text-charcoal-muted max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  const s = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className={`${s} border-2 border-accent/20 border-t-accent rounded-full animate-spin`} />
      {text && <span className="text-xs text-charcoal-muted font-mono">{text}</span>}
    </div>
  );
};

export default EmptyState;

