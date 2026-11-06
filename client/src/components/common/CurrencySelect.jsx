import React, { useState } from 'react';
import { Plus, X, Globe, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const CurrencySelect = ({
  value = 'USD',
  onChange,
  label = 'PROPERTY CURRENCY',
  required = true,
  className = '',
  helperText = 'Selected currency applies dynamically across all pricing',
}) => {
  const { currencies = [], addCurrency } = useERP();
  const { showToast } = useToast();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === '__ADD_CUSTOM__') {
      setIsCustomModalOpen(true);
    } else {
      onChange(selected);
    }
  };

  const validateCustom = () => {
    const errs = {};
    if (!customName.trim()) errs.name = 'Currency name is required';
    if (!customCode.trim()) errs.code = '3-letter ISO code is required';
    else if (customCode.trim().length !== 3) errs.code = 'Code must be exactly 3 characters (e.g. JPY, CHF)';
    if (!customSymbol.trim()) errs.symbol = 'Currency symbol is required';

    const normalizedCode = customCode.trim().toUpperCase();
    if (currencies.some(c => c.currency_code?.toUpperCase() === normalizedCode)) {
      errs.code = `Currency code "${normalizedCode}" already exists`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveCustom = async (e) => {
    e.preventDefault();
    if (!validateCustom()) return;

    setIsSaving(true);
    try {
      const code = customCode.trim().toUpperCase();
      const symbol = customSymbol.trim();
      const name = customName.trim();

      await addCurrency({
        currency_name: name,
        currency_code: code,
        currency_symbol: symbol,
      });

      showToast('Currency Added', `${name} (${code} - ${symbol}) added successfully.`, 'success');
      onChange(code);
      setIsCustomModalOpen(false);
      setCustomName('');
      setCustomCode('');
      setCustomSymbol('');
      setErrors({});
    } catch (err) {
      showToast('Error', err.message || 'Failed to register currency.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {helperText && (
          <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
            {helperText}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={handleSelectChange}
          className="w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all appearance-none cursor-pointer pr-10"
        >
          {currencies.map(c => (
            <option key={c.currency_code} value={c.currency_code} className="bg-white dark:bg-primary-900 text-charcoal dark:text-white">
              {c.currency_code} – {c.currency_name} ({c.currency_symbol})
            </option>
          ))}
          <option disabled className="text-gray-400">──────────</option>
          <option value="__ADD_CUSTOM__" className="bg-accent/10 text-accent font-bold">
            + Add Custom Currency...
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent">
          <Globe className="w-4 h-4" />
        </div>
      </div>

      {/* Add Custom Currency Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-surface-light dark:bg-[#101722] border border-accent/40 shadow-2xl space-y-6">
            {/* Header shimmer bar */}
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary dark:text-white">
                    Add Custom Currency
                  </h3>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Register a new monetary standard for luxury operations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                  Currency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Yen, Swiss Franc"
                  value={customName}
                  onChange={e => {
                    setCustomName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-primary-900/60 border ${errors.name ? 'border-rose-500' : 'border-border dark:border-white/10'} rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-charcoal dark:text-white`}
                />
                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                    ISO Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="e.g. JPY"
                    value={customCode}
                    onChange={e => {
                      setCustomCode(e.target.value.toUpperCase());
                      if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                    }}
                    className={`w-full px-4 py-2.5 text-sm uppercase bg-white dark:bg-primary-900/60 border ${errors.code ? 'border-rose-500' : 'border-border dark:border-white/10'} rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-charcoal dark:text-white`}
                  />
                  {errors.code && <p className="text-xs text-rose-500">{errors.code}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="e.g. ¥, ₣, ฿"
                    value={customSymbol}
                    onChange={e => {
                      setCustomSymbol(e.target.value);
                      if (errors.symbol) setErrors(prev => ({ ...prev, symbol: '' }));
                    }}
                    className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-primary-900/60 border ${errors.symbol ? 'border-rose-500' : 'border-border dark:border-white/10'} rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-charcoal dark:text-white`}
                  />
                  {errors.symbol && <p className="text-xs text-rose-500">{errors.symbol}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-border dark:border-white/10 hover:bg-white/5 transition-colors text-charcoal dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl gold-gradient-bg text-primary-900 btn-3d flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Currency</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelect;

