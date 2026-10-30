import React from 'react';

export const FormField = ({
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {hint && (
            <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default FormField;

