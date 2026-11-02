import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const RefundModal = ({ isOpen, onClose, payment, onSuccess }) => {
  const { refundPayment } = useERP();

  const [refundAmount, setRefundAmount] = useState(payment?.amount?.toString() || '');
  const [reason, setReason] = useState('Executive Concierge Courtesy');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !payment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(refundAmount);
    if (!amount || amount <= 0 || amount > Number(payment.amount)) {
      setErrorMsg(`Refund amount must be between $1 and $${payment.amount.toLocaleString()}.`);
      return;
    }

    refundPayment(payment.id || payment.transactionRef, reason.trim());
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-primary-900 border border-rose-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Authorize Transaction Refund
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Ref: {payment.transactionRef || payment.id} • {payment.guestName}
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
          <div className="p-3.5 rounded-2xl bg-ivory/40 dark:bg-primary-950/40 border border-border/80 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-charcoal-muted">Original Charged Amount:</span>
            <span className="font-mono font-bold text-primary dark:text-white">
              ${(payment.amount || 0).toLocaleString()}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Refund Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={(e) => {
                setRefundAmount(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-rose-500 font-mono font-bold text-rose-600 dark:text-rose-400 placeholder-charcoal-muted dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Refund Justification / Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              <option value="Executive Concierge Courtesy" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Executive Concierge Courtesy</option>
              <option value="Guest Reservation Cancellation" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Guest Reservation Cancellation</option>
              <option value="Overcharge / Rate Adjustment" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Overcharge / Rate Adjustment</option>
              <option value="Service Dissatisfaction Resolution" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Service Dissatisfaction Resolution</option>
              <option value="Direct Chargeback Compliance" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Direct Chargeback Compliance</option>
            </select>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
          )}

          <div className="pt-3 border-t border-border/80 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-rose-600 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Confirm & Reverse</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;

