import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  gold: 'gold-gradient-bg text-primary-950 font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 hover:opacity-95',
  primary: 'bg-primary-900 text-white dark:bg-accent dark:text-primary-950 font-semibold hover:bg-primary-800 dark:hover:bg-accent/90',
  secondary: 'bg-charcoal/10 dark:bg-white/10 text-charcoal dark:text-gray-200 hover:bg-charcoal/15 dark:hover:bg-white/15',
  outline: 'border border-border dark:border-white/15 text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800/50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  ghost: 'text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-primary-800/40',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2 text-xs rounded-2xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-2xl gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;

