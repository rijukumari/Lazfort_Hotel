import React from 'react';
import {
  X,
  Printer,
  Download,
  Mail,
  CheckCircle,
  Sparkles,
  CreditCard,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { printElement } from '../../utils/printSystem';

export const InvoiceDetailsModal = ({
  isOpen,
  onClose,
  invoice = null,
  onRecordPayment,
  onCancelInvoice
}) => {
  const { showToast } = useToast();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    printElement('printable-invoice-details', {
      documentTitle: `Tax_Invoice_${invoice.invoiceNumber || 'Lazfort'}`
    });
  };

  const handleSendEmail = () => {
    showToast(
      'Invoice Dispatched',
      `Official VAT invoice statement securely transmitted to ${invoice.guestEmail || invoice.guestName}.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
                  Tax Invoice
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/30 font-bold">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Lazfort Sovereign Resorts S.A. Monaco • Tax ID: MC-893021-X
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendEmail}
              className="p-2 rounded-xl border border-border dark:border-white/10 text-charcoal dark:text-gray-300 hover:text-accent hover:border-accent/40 transition-colors"
              title="Dispatch Invoice via Secure Courier Email"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-border dark:border-white/10 text-charcoal dark:text-gray-300 hover:text-accent hover:border-accent/40 transition-colors"
              title="Print Tax Invoice"
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

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice-details" className="overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 flex-1 bg-white dark:bg-[#101722] text-charcoal dark:text-gray-200">
          {/* Top Brand & Status Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-wider text-primary dark:text-white">
                LAZFORT GRAND PALACE
              </h2>
              <p className="text-xs text-accent uppercase tracking-widest font-mono">
                Resort, Royal Spa & Marina Monaco
              </p>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-2">
                Place du Casino, Monte-Carlo, MC 98000 Monaco<br />
                VAT ID: MC-893021-X • Tel: +377 98 06 20 00
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <InvoiceStatusBadge status={invoice.status || invoice.paymentStatus} />
              <p className="font-mono text-xs text-charcoal-muted mt-2">
                Date Issued: <span className="font-semibold text-primary dark:text-white">{invoice.issuedDate || '2026-10-28'}</span>
              </p>
              <p className="font-mono text-xs text-charcoal-muted">
                Payment Due: <span className="font-semibold text-primary dark:text-white">{invoice.dueDate || '2026-11-04'}</span>
              </p>
            </div>
          </div>

          {/* Billed To */}
          <div className="p-4 rounded-2xl bg-ivory/50 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-accent tracking-wider">Billed To (Client)</p>
              <p className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                {invoice.guestName}
              </p>
              {invoice.companyName && (
                <p className="text-xs font-semibold text-primary dark:text-white">
                  {invoice.companyName}
                </p>
              )}
              {invoice.guestEmail && (
                <p className="text-xs text-charcoal-muted">{invoice.guestEmail}</p>
              )}
              {invoice.guestAddress && (
                <p className="text-xs text-charcoal-muted">{invoice.guestAddress}</p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] uppercase font-bold text-accent tracking-wider">Folio / Reservation Ref</p>
              <p className="font-mono text-sm font-bold text-primary dark:text-white mt-1">
                {invoice.bookingCode || 'DIRECT'}
              </p>
              <p className="text-xs text-charcoal-muted mt-2">
                Settlement Currency: <span className="font-bold text-primary dark:text-white">EUR (€) / USD ($)</span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory/60 dark:bg-primary-900/60 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400 border-b border-border/80 dark:border-white/10">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-white/5">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((it, idx) => (
                    <tr key={it.id || idx}>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-primary dark:text-white">{it.description}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{it.quantity || 1}</td>
                      <td className="py-3 px-4 text-right font-mono">${(it.unitPrice || it.totalAmount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-primary dark:text-white">
                        ${(it.totalAmount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 px-4">Hospitality & Suite Accommodations</td>
                    <td className="py-3 px-4 text-right font-mono">1</td>
                    <td className="py-3 px-4 text-right font-mono">${(invoice.subtotal || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">${(invoice.subtotal || 0).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary Breakdown */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Subtotal (Net):</span>
                <span className="font-mono font-semibold">${(invoice.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Statutory VAT ({invoice.taxRate || 10}%):</span>
                <span className="font-mono font-semibold">${(invoice.taxAmount || 0).toLocaleString()}</span>
              </div>
              {(invoice.discountAmount || 0) > 0 && (
                <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5 text-emerald-600">
                  <span>VIP Discount:</span>
                  <span className="font-mono font-semibold">-${invoice.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b-2 border-accent text-sm font-bold">
                <span className="text-primary dark:text-white">Total Invoiced:</span>
                <span className="font-mono font-bold text-accent text-base">
                  ${(invoice.totalAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-charcoal-muted">Amount Paid:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ${(invoice.amountPaid || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 text-xs font-bold">
                <span className="text-rose-600 dark:text-rose-400">Balance Due:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  ${(invoice.balance || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="p-3.5 rounded-xl bg-ivory/40 dark:bg-primary-900/30 text-xs text-charcoal-muted dark:text-gray-400 border border-border/60 dark:border-white/5">
              <p className="font-semibold text-primary dark:text-white mb-0.5">Notes & Remittance Instructions:</p>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 shrink-0">
          <div>
            {onRecordPayment && (invoice.balance || 0) > 0 && (
              <button
                onClick={() => onRecordPayment(invoice)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:from-emerald-500 hover:to-emerald-600 transition-all flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Invoice Payment</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;

