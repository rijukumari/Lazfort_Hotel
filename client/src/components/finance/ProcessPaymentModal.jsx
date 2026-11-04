import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const PAYMENT_METHODS = [
  'Centurion Black Card',
  'Visa Infinite Luxury',
  'Mastercard World Elite',
  'International Wire Transfer (UBS)',
  'Cash Settlement (Treasury Vault)',
  'Sovereign Crypto Vault',
];

export const ProcessPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { folios = [], processPayment } = useERP();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const [formData, setFormData] = useState({
    guestName: '',
    bookingCode: '',
    folioId: '',
    amount: '',
    paymentMethod: PAYMENT_METHODS[0],
    notes: 'Direct terminal charge',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleFolioSelect = (fId) => {
    const f = folios.find(fol => fol.id === fId);
    if (f) {
      setFormData({
        ...formData,
        folioId: f.id,
        guestName: f.guestName,
        bookingCode: f.bookingCode,
        amount: (f.balanceDue || 0).toString(),
        notes: `Settlement for Suite ${f.roomNumber} (${f.bookingCode})`,
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.guestName.trim()) errs.guestName = 'Guest or cardholder name is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid transaction amount is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    processPayment({
      guestName: formData.guestName.trim(),
      bookingCode: formData.bookingCode.trim() || 'TERMINAL',
      folioId: formData.folioId || null,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      status: 'paid',
      notes: formData.notes.trim(),
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Process Terminal Transaction
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Direct point-of-sale clearance & merchant gateway authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {/* Link to Folio Optional */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Link to Guest Folio (Optional)
            </label>
            <select
              value={formData.folioId}
              onChange={(e) => handleFolioSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">-- Direct Terminal Checkout --</option>
              {folios.map((f) => (
                <option key={f.id} value={f.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                  {f.bookingCode} - {f.guestName} (Suite {f.roomNumber}) — Balance: ${f.balanceDue || 0}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Cardholder / Guest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Duke William Somerset"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.guestName ? 'border-rose-500' : 'border-border/80 dark:border-white/10'
                } bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500`}
              />
              {errors.guestName && <p className="text-[10px] text-rose-500 mt-1">{errors.guestName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Folio / Ref Code
              </label>
              <input
                type="text"
                value={formData.bookingCode}
                onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                placeholder="e.g. AUR-9921"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent font-mono text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Payment Method / Channel
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Transaction Amount ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="14400"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.amount ? 'border-rose-500' : 'border-border/80 dark:border-white/10'
                } bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent font-mono font-bold text-emerald-600 dark:text-emerald-400 placeholder-charcoal-muted dark:placeholder-gray-500`}
              />
              {errors.amount && <p className="text-[10px] text-rose-500 mt-1">{errors.amount}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Terminal Notes & Ledger Memorandum
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Concierge private terminal transaction"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500"
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
              className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize & Capture</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessPaymentModal;

