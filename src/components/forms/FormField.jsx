import React from 'react';

export const FormField = ({
  label,
  error,
  hint,
  required,
  children,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-charcoal-muted dark:text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export const Input = ({
  className = '',
  ...props
}) => {
  return (
    <input
      className={`w-full px-3.5 py-2 text-sm bg-white dark:bg-primary-800 border border-border dark:border-border-dark rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white placeholder:text-charcoal-muted/60 transition-colors ${className}`}
      {...props}
    />
  );
};

export const Select = ({
  className = '',
  options,
  children,
  ...props
}) => {
  return (
    <select
      className={`w-full px-3.5 py-2 text-sm bg-white dark:bg-primary-800 border border-border dark:border-border-dark rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white cursor-pointer transition-colors ${className}`}
      {...props}
    >
      {options
        ? options.map(opt => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );
};

export const FormSelect = ({
  label,
  error,
  hint,
  required,
  ...selectProps
}) => {
  if (label) {
    return (
      <FormField label={label} error={error} hint={hint} required={required}>
        <Select {...selectProps} />
      </FormField>
    );
  }
  return <Select {...selectProps} />;
};

export const Textarea = ({
  className = '',
  ...props
}) => {
  return (
    <textarea
      className={`w-full px-3.5 py-2 text-sm bg-white dark:bg-primary-800 border border-border dark:border-border-dark rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white placeholder:text-charcoal-muted/60 transition-colors resize-none ${className}`}
      {...props}
    />
  );
};

export default FormField;

