import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { initialBillingInvoices } from '../../../data/mockSuperAdminModules';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  ShieldCheck,
} from 'lucide-react';

export const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const invoice = initialBillingInvoices.find(inv => inv.id === id) || initialBillingInvoices[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/billing/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Billing Invoices</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <span className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  Invoice {invoice.invoiceNumber}
                </h1>
                <StatusBadge status={invoice.status} size="sm" />
              </div>
              <p className="font-mono text-xs text-charcoal-muted mt-0.5">
                Issued for {invoice.hotelName} ({invoice.clientName})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/super-admin/billing/invoices')}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Back to Invoices
          </button>
          <button
            type="button"
            onClick={() => {
              showToast('Print Invoice', `Generating printable print-sheet for ${invoice.invoiceNumber}`, 'info');
              window.print();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            <Printer className="w-4 h-4 text-accent" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={() => {
              showToast('Invoice Downloaded (Demo)', `Downloaded ${invoice.invoiceNumber}.pdf`, 'success');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Printable Sovereign Folio Invoice Sheet (8 Cols) */}
        <div className="lg:col-span-8 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-8 sm:p-10 shadow-2xl space-y-8">
          {/* Invoice Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-border/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg gold-gradient-bg flex items-center justify-center font-serif font-black text-primary-950 text-sm">
                  L
                </span>
                <span className="font-serif font-bold text-xl tracking-tight text-primary dark:text-white">
                  LAZFORT
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold pl-1">
                  ERP SOVEREIGN
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-2">
                Lazfort Global Hospitality Infrastructure Ltd.
                <br />
                Financial Clearing Vault, Geneva / Monte Carlo
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-accent uppercase block">Official Tax Invoice</span>
              <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                {invoice.invoiceNumber}
              </p>
              <div className="flex items-center gap-2 justify-end mt-2">
                <StatusBadge status={invoice.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Bill-To & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">
                Billed Estate & Client
              </span>
              <p className="font-serif font-bold text-base text-primary dark:text-white">{invoice.hotelName}</p>
              <p className="font-medium text-charcoal dark:text-gray-200">Attention: {invoice.clientName}</p>
              <p className="text-charcoal-muted">Sovereign Property Commercial Account</p>
            </div>

            <div className="space-y-2 sm:text-right">
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">
                  Invoice Issue Date
                </span>
                <span className="font-mono text-primary dark:text-white font-medium">{invoice.invoiceDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">
                  Settlement Due Date
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{invoice.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory/80 dark:bg-primary-900/60 border-b border-border/80 dark:border-white/10 font-mono uppercase text-[11px] text-charcoal-muted">
                  <th className="py-3 px-5">Description & Line Service</th>
                  <th className="py-3 px-5 text-right">Gross Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                <tr>
                  <td className="py-4 px-5">
                    <p className="font-bold text-primary dark:text-white text-sm">
                      Enterprise Platform Licensing & Hospitality Folio Settlement
                    </p>
                    <p className="text-xs text-charcoal-muted mt-0.5">
                      Sovereign recurring suite provisioning, multi-tenant PMS clearance, and POS dispatch engine.
                    </p>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-primary dark:text-white text-sm">
                    ${invoice.subtotal.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-charcoal-muted">
                    Government Luxury Hospitality Surcharge & VAT (10%)
                  </td>
                  <td className="py-3 px-5 text-right font-mono text-charcoal-muted">
                    ${invoice.tax.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-ivory/50 dark:bg-white/[0.02] border-t border-border/80 dark:border-white/10 font-medium">
                <tr>
                  <td className="py-2.5 px-5 text-right text-charcoal-muted">Total Gross Amount:</td>
                  <td className="py-2.5 px-5 text-right font-serif font-bold text-base text-primary dark:text-white">
                    ${invoice.totalAmount.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-5 text-right text-emerald-600 dark:text-emerald-400">Total Cleared & Paid:</td>
                  <td className="py-2 px-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    -${invoice.paidAmount.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-t border-border/80 dark:border-white/10 bg-accent/5">
                  <td className="py-3 px-5 text-right font-bold text-primary dark:text-white">
                    Net Balance Outstanding:
                  </td>
                  <td className="py-3 px-5 text-right font-serif font-bold text-lg text-accent">
                    ${invoice.balanceDue.toLocaleString()} USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Notes */}
          <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 text-xs text-charcoal-muted space-y-1">
            <span className="font-bold text-primary dark:text-white block">Settlement Instructions:</span>
            <p>
              Remittance cleared via SWIFT to Bank of International Settlements (BIS) Lazfort Escrow Account
              #CH93-0000-8821-4991. Please reference invoice number {invoice.invoiceNumber}.
            </p>
          </div>
        </div>

        {/* Sidebar Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Invoice Actions</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Status</span>
                <StatusBadge status={invoice.status} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Balance Due</span>
                <span className="font-mono font-bold text-accent">${invoice.balanceDue.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  showToast('Print Invoice', `Generating printable print-sheet for ${invoice.invoiceNumber}`, 'info');
                  window.print();
                }}
                className="w-full py-3 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-accent" />
                <span>Print Document</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast('Invoice Downloaded (Demo)', `Downloaded ${invoice.invoiceNumber}.pdf`, 'success');
                }}
                className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
