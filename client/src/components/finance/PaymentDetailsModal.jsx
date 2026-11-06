import React from 'react';
import { X, CreditCard, DollarSign, Printer, CheckCircle2, RotateCcw, Calendar, User } from 'lucide-react';
import { PaymentStatusBadge } from './PaymentStatusBadge';

export const PaymentDetailsModal = ({ isOpen, onClose, payment = null, onRefund }) => {
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

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Payment Authorization
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/30 font-bold">
                  {payment.transactionRef || payment.id}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Lazfort Sovereign Merchant Terminal Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
          <div className="p-4 rounded-2xl bg-ivory/30 dark:bg-primary-950/40 border border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">Settled Amount</p>
              <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ${(payment.amount || 0).toLocaleString()}
              </p>
            </div>
            <PaymentStatusBadge status={payment.status} />
          </div>

          <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/30 dark:bg-primary-950/40 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted dark:text-gray-400">Cardholder / Guest:</span>
              <span className="font-semibold text-primary dark:text-white">{payment.guestName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted dark:text-gray-400">Folio / Reference:</span>
              <span className="font-mono text-accent font-semibold">{payment.bookingCode || 'CONCIERGE'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted dark:text-gray-400">Payment Channel:</span>
              <span className="font-medium text-primary dark:text-white">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted dark:text-gray-400">Transaction Timestamp:</span>
              <span className="font-mono text-primary dark:text-white">{payment.date}</span>
            </div>
            {payment.notes && (
              <div className="flex justify-between py-1">
                <span className="text-charcoal-muted dark:text-gray-400">Memorandum:</span>
                <span className="text-primary dark:text-white italic">{payment.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 shrink-0">
          <div>
            {onRefund && payment.status === 'paid' && (
              <button
                onClick={() => onRefund(payment)}
                className="px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Process Refund</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;

