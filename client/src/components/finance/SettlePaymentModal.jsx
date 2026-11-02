import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const PAYMENT_METHODS = [
  'Centurion Black Card',
  'Visa Infinite Luxury',
  'Mastercard World Elite',
  'International Wire Transfer (UBS)',
  'Cash Settlement (Treasury Safe)',
  'Direct Corporate Ledger Billing',
];

export const SettlePaymentModal = ({ isOpen, onClose, folio, onSuccess }) => {
  const { settleFolioPayment } = useERP();

  const [formData, setFormData] = useState({
    amount: folio?.balanceDue?.toString() || '',
    paymentMethod: PAYMENT_METHODS[0],
    transactionReference: `TX-FOL-${Math.floor(10000 + Math.random() * 90000)}`,
    notes: 'Folio balance settlement',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !folio) return null;

  const validate = () => {
    const errs = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid settlement amount is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    settleFolioPayment(folio.id, {
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      transactionReference: formData.transactionReference,
      notes: formData.notes.trim(),
      date: new Date().toISOString().split('T')[0],
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-primary-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Record Folio Payment
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Folio {folio.bookingCode} • Suite {folio.roomNumber} ({folio.guestName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-ivory/40 dark:bg-primary-950/40 border border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">Current Outstanding Balance</p>
              <p className="text-xl font-serif font-bold text-rose-600 dark:text-rose-400">
                ${(folio.balanceDue || 0).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, amount: folio.balanceDue?.toString() || '0' })}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
            >
              Pay Full Balance
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Payment Settlement Amount ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.amount ? 'border-rose-500' : 'border-border dark:border-white/10'
              } bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono font-bold text-emerald-600 dark:text-emerald-400`}
            />
            {errors.amount && <p className="text-[10px] text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Payment Method / Clearance Channel
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/40 dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Authorization / Terminal Reference
            </label>
            <input
              type="text"
              value={formData.transactionReference}
              onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Notes
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Card swiped at concierge desk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-emerald-600 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettlePaymentModal;

