import React from 'react';
import {
  X,
  Receipt,
  Printer,
  Download,
  Plus,
  CreditCard,
  Trash2,
  RotateCcw,
  Sparkles,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { PaymentStatusBadge } from './PaymentStatusBadge';

export const FolioDetailsModal = ({
  isOpen,
  onClose,
  folio = null,
  onAddCharge,
  onSettlePayment,
  onRefundPayment,
}) => {
  const { removeFolioCharge } = useERP();
  const { showToast } = useToast();

  if (!isOpen || !folio) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleRemoveCharge = (chgId) => {
    removeFolioCharge(folio.id, chgId);
    showToast('Charge Removed', 'Folio balance recalculated.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                  Guest Folio Statement
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/30 font-bold">
                  {folio.bookingCode}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Suite {folio.roomNumber} • {folio.guestName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-border dark:border-white/10 text-charcoal dark:text-gray-300 hover:text-accent hover:border-accent/40 transition-colors"
              title="Print Folio Statement"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-ivory/30 dark:bg-primary-950/40 border border-border/80 dark:border-white/10">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">Guest Name</p>
              <p className="font-serif font-bold text-primary dark:text-white mt-0.5">{folio.guestName}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">Stay Period</p>
              <p className="font-mono text-xs font-semibold text-primary dark:text-white mt-0.5">
                {folio.checkIn || '2026-10-25'} → {folio.checkOut || '2026-10-30'}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">Total Charges</p>
              <p className="font-serif font-bold text-accent text-lg mt-0.5">
                ${(folio.grandTotal || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">Balance Due</p>
              <p className={`font-serif font-bold text-lg mt-0.5 ${
                (folio.balanceDue || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                ${(folio.balanceDue || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-3">
            {onAddCharge && (
              <button
                onClick={() => onAddCharge(folio)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Charge</span>
              </button>
            )}
            {onSettlePayment && (folio.balanceDue || 0) > 0 && (
              <button
                onClick={() => onSettlePayment(folio)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:from-emerald-500 hover:to-emerald-600 transition-all flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Settle Payment (${(folio.balanceDue || 0).toLocaleString()})</span>
              </button>
            )}
            <div className="ml-auto">
              <PaymentStatusBadge status={folio.status} />
            </div>
          </div>

          {/* Charges Table */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-accent" />
              <span>Itemized Folio Charges</span>
            </h4>

            {folio.charges && folio.charges.length > 0 ? (
              <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory/50 dark:bg-primary-950/50 text-[10px] uppercase text-charcoal-muted dark:text-gray-400 border-b border-border/60 dark:border-white/5">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Tax</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 dark:divide-white/5">
                    {folio.charges.map((chg) => (
                      <tr key={chg.id} className="hover:bg-ivory/30 dark:hover:bg-primary-800/30">
                        <td className="py-2.5 px-3 font-mono text-[11px]">{chg.date}</td>
                        <td className="py-2.5 px-3 capitalize font-medium text-accent">
                          {(chg.category || 'room').replace(/_/g, ' ')}
                        </td>
                        <td className="py-2.5 px-3 text-primary dark:text-white">{chg.description}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{chg.quantity || 1}</td>
                        <td className="py-2.5 px-3 text-right font-mono">${(chg.unitPrice || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-charcoal-muted">${(chg.taxAmount || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-primary dark:text-white">
                          ${(chg.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleRemoveCharge(chg.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/15 transition-colors"
                            title="Remove Charge"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-ivory/40 dark:bg-primary-950/40 border-t border-border/80 dark:border-white/10 font-bold text-xs">
                    <tr>
                      <td colSpan={6} className="py-2.5 px-3 text-right text-primary dark:text-white">
                        Grand Total (Inc. VAT):
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-accent">
                        ${(folio.grandTotal || 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-xs text-charcoal-muted italic py-3 text-center">
                No charges posted to this folio yet.
              </p>
            )}
          </div>

          {/* Payments Received Table */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span>Settlement Payments & Credits</span>
            </h4>

            {folio.payments && folio.payments.length > 0 ? (
              <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory/50 dark:bg-primary-950/50 text-[10px] uppercase text-charcoal-muted dark:text-gray-400 border-b border-border/60 dark:border-white/5">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Method / Channel</th>
                      <th className="py-2.5 px-3">Auth Reference</th>
                      <th className="py-2.5 px-3 text-right">Amount Paid</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 dark:divide-white/5">
                    {folio.payments.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-ivory/30 dark:hover:bg-primary-800/30">
                        <td className="py-2.5 px-3 font-mono text-[11px]">{p.date || '2026-10-26'}</td>
                        <td className="py-2.5 px-3 font-medium text-primary dark:text-white">{p.paymentMethod}</td>
                        <td className="py-2.5 px-3 font-mono text-accent text-[11px]">{p.transactionReference || 'TX-AUTH-OK'}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ${(p.amount || 0).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'refunded'
                              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          }`}>
                            {p.status === 'refunded' ? 'Refunded' : 'Cleared'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-charcoal-muted italic py-3 text-center">
                No payments have been recorded for this folio yet.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <p className="text-xs text-charcoal-muted font-mono">
            Lazfort Grand Palace • Sovereign Guest Folio System
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolioDetailsModal;

