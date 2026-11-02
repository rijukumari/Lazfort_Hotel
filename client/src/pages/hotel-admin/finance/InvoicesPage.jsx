import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  DollarSign,
  Download,
  Eye,
  CreditCard,
  XCircle,
  Mail,
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FinanceNavTabs,
  InvoiceStatusBadge,
  CreateInvoiceModal,
  InvoiceDetailsModal,
  DeleteConfirmationDialog
} from '../../../components/finance';

export const InvoicesPage = () => {
  const { invoices = [], cancelInvoice, deleteInvoice, recordInvoicePayment } = useERP();
  const { showToast } = useToast();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.guestName?.toLowerCase().includes(q) ||
        inv.companyName?.toLowerCase().includes(q) ||
        inv.bookingCode?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (inv.status || inv.paymentStatus) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Statistics
  const totalInvoiced = invoices.reduce((s, i) => s + (Number(i.totalAmount) || 0), 0);
  const totalPaid = invoices.reduce((s, i) => s + (Number(i.amountPaid) || 0), 0);
  const totalBalance = invoices.reduce((s, i) => s + (Number(i.balance) || 0), 0);
  const overdueCount = invoices.filter(i => (i.status === 'overdue' || (i.balance > 0 && new Date(i.dueDate) < new Date()))).length;

  const handleCancelConfirm = () => {
    if (invoiceToCancel) {
      cancelInvoice(invoiceToCancel.id, 'Cancelled via Invoice Console');
      showToast('Invoice Cancelled', `Invoice ${invoiceToCancel.invoiceNumber} has been marked as cancelled.`, 'info');
      setInvoiceToCancel(null);
    }
  };

  const handleQuickPay = (invoice) => {
    recordInvoicePayment(invoice.id, {
      amount: invoice.balance,
      paymentMethod: 'Centurion Black Card',
    });
    showToast('Payment Recorded', `Full remaining balance of $${invoice.balance.toLocaleString()} settled.`, 'success');
  };

  const handleExportCSV = () => {
    const headers = [
      'Invoice Number',
      'Client / Guest',
      'Company',
      'Issued Date',
      'Due Date',
      'Subtotal',
      'Tax Amount',
      'Total Amount',
      'Amount Paid',
      'Balance Due',
      'Status'
    ];

    const rows = filteredInvoices.map((i) => [
      `"${i.invoiceNumber}"`,
      `"${i.guestName}"`,
      `"${i.companyName || ''}"`,
      `"${i.issuedDate}"`,
      `"${i.dueDate}"`,
      i.subtotal || 0,
      i.taxAmount || 0,
      i.totalAmount || 0,
      i.amountPaid || 0,
      i.balance || 0,
      `"${i.status || i.paymentStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lazfort_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Invoices Exported', 'CSV register exported successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary dark:text-white">
              Tax Invoices & Billing Register
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              IAS-compliant statutory VAT tax invoices, billing statements and remittance tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>Export Register</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Invoice</span>
          </button>
        </div>
      </div>



      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">Total Invoiced Volume</p>
            <p className="text-2xl font-serif font-bold text-primary dark:text-white mt-0.5">
              ${totalInvoiced.toLocaleString()}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">{invoices.length} Invoices Issued</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Settled & Remitted</p>
            <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${totalPaid.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-500 font-mono mt-0.5">Cleared Collections</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pending Receivables</p>
            <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              ${totalBalance.toLocaleString()}
            </p>
            <p className="text-[10px] text-blue-500 font-mono mt-0.5">Awaiting Remittance</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Overdue Invoices</p>
            <p className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {overdueCount}
            </p>
            <p className="text-[10px] text-rose-500 font-mono mt-0.5">Action Required</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice number, guest name, company..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['all', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${statusFilter === st
                    ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                    : 'bg-ivory/80 dark:bg-primary-950/40 border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent/40'
                  }`}
              >
                {st === 'all' ? 'All Invoices' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredInvoices.length}</span> of {invoices.length} Invoices
          </p>
          {(statusFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-950/80 text-[11px] uppercase tracking-wider text-charcoal dark:text-gray-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Invoice No</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Client / Company</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Issue Date</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Due Date</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Subtotal</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">VAT Tax</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Total Amount</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Paid</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Balance</th>
                  <th className="py-3.5 px-4 text-center text-charcoal dark:text-gray-200">Status</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-primary dark:text-white truncate">
                        {inv.guestName}
                      </p>
                      {inv.companyName && (
                        <p className="text-[11px] text-charcoal-muted truncate">{inv.companyName}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {inv.issuedDate || '2026-10-27'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {inv.dueDate || '2026-10-30'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-charcoal dark:text-gray-300">
                      ${(inv.subtotal || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-charcoal-muted">
                      ${(inv.taxAmount || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-primary dark:text-white">
                      ${(inv.totalAmount || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      ${(inv.amountPaid || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={(inv.balance || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        ${(inv.balance || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <InvoiceStatusBadge status={inv.status || inv.paymentStatus} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
                          title="View Tax Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {(inv.balance || 0) > 0 && inv.status !== 'cancelled' && (
                          <button
                            onClick={() => handleQuickPay(inv)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/15 transition-colors"
                            title="Settle Full Remaining Balance"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}

                        {inv.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              setInvoiceToCancel(inv);
                              setIsCancelModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                            title="Cancel / Void Invoice"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-muted dark:text-gray-400">
            <FileText className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No Invoices Found
            </p>
            <p className="text-xs mt-1">Generate a new tax invoice or adjust search filters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          showToast('Invoice Issued', 'New VAT tax invoice generated.', 'success');
        }}
      />

      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onRecordPayment={(inv) => {
          handleQuickPay(inv);
          setIsDetailsModalOpen(false);
        }}
      />

      <DeleteConfirmationDialog
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setInvoiceToCancel(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Void / Cancel Tax Invoice"
        itemName={invoiceToCancel?.invoiceNumber || ''}
        message="Are you certain you wish to void this invoice? It will be marked as cancelled in the VAT tax register."
      />
    </div>
  );
};

export default InvoicesPage;

