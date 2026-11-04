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
  AlertCircle,
  ArrowLeft,
  Calendar,
  Save
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
  const { folios = [], invoices = [], cancelInvoice, deleteInvoice, recordInvoicePayment, createInvoice } = useERP();
  const { showToast } = useToast();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dedicated Page View: 'list' | 'create'
  const [pageView, setPageView] = useState('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Create Form State
  const [formData, setFormData] = useState({
    folioId: '',
    guestName: '',
    guestEmail: '',
    companyName: '',
    guestAddress: '',
    issuedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    description: 'Luxury Suite Accommodation & Gastronomy',
    subtotal: '3500',
    taxRate: '10',
    discountAmount: '0',
    amountPaid: '0',
    notes: 'Payment due within 7 days. Statutory VAT applies.',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleFolioSelect = (fId) => {
    const folio = folios.find(f => f.id === fId);
    if (folio) {
      setFormData({
        ...formData,
        folioId: folio.id,
        guestName: folio.guestName,
        guestEmail: folio.guestEmail || '',
        subtotal: (folio.subtotal || folio.grandTotal || 0).toString(),
        taxRate: '10',
        amountPaid: (folio.totalPaid || 0).toString(),
        description: `Full folio settlement for Suite ${folio.roomNumber} (${folio.bookingCode})`,
      });
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.guestName.trim()) errs.guestName = 'Client or guest name is required';
    if (!formData.subtotal || Number(formData.subtotal) <= 0) {
      errs.subtotal = 'Valid subtotal is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const sub = Number(formData.subtotal) || 0;
    const rate = Number(formData.taxRate) || 10;
    const discount = Number(formData.discountAmount) || 0;
    const taxAmount = Math.round((sub * rate) / 100);
    const totalAmount = Math.max(0, sub + taxAmount - discount);
    const amountPaid = Number(formData.amountPaid) || 0;
    const balance = Math.max(0, totalAmount - amountPaid);

    createInvoice({
      folioId: formData.folioId || null,
      guestName: formData.guestName.trim(),
      guestEmail: formData.guestEmail.trim(),
      companyName: formData.companyName.trim(),
      guestAddress: formData.guestAddress.trim(),
      issuedDate: formData.issuedDate,
      dueDate: formData.dueDate,
      items: [
        {
          id: `item-${Date.now()}`,
          description: formData.description.trim(),
          quantity: 1,
          unitPrice: sub,
          totalAmount: sub,
        }
      ],
      subtotal: sub,
      taxRate: rate,
      taxAmount,
      discountAmount: discount,
      totalAmount,
      amountPaid,
      balance,
      paymentStatus: balance === 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'issued',
      status: balance === 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'issued',
      notes: formData.notes.trim(),
    });

    showToast('Invoice Issued', 'New formal VAT tax invoice generated.', 'success');
    setPageView('list');
  };

  // Dedicated Page View: Generate New Tax Invoice on Same Page
  if (pageView === 'create') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Invoices Register</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-secondary/40 border border-transparent shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/40 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Generate Formal VAT Invoice
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Official statutory billing statement with corporate tax details, folio reconciliation & line items
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-5">
            {/* Quick Folio Link */}
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Auto-Populate From Guest Folio (Optional)
              </label>
              <select
                value={formData.folioId}
                onChange={(e) => handleFolioSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white shadow-sm"
              >
                <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">-- Manual Direct Tax Invoice --</option>
                {folios.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {f.bookingCode} - {f.guestName} (Suite {f.roomNumber}) — Balance: ${f.balanceDue || 0}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Client / Guest Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="e.g. Baroness Charlotte von Berg"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${formErrors.guestName ? 'border-rose-500' : 'border-border/60 dark:border-white/10'
                    } bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent shadow-inner`}
                />
                {formErrors.guestName && <p className="text-[10px] text-rose-500 mt-1">{formErrors.guestName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Billing Email
                </label>
                <input
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  placeholder="billing@sovereign-holdings.ch"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Company / Corporate Entity Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Sovereign Holdings International SA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Billing Address
                </label>
                <input
                  type="text"
                  value={formData.guestAddress}
                  onChange={(e) => setFormData({ ...formData, guestAddress: e.target.value })}
                  placeholder="e.g. Via Serlas 12, St. Moritz, Switzerland"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Service / Hospitality Line Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Subtotal ($) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${formErrors.subtotal ? 'border-rose-500' : 'border-border/60 dark:border-white/10'
                    } bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono shadow-inner`}
                />
                {formErrors.subtotal && <p className="text-[10px] text-rose-500 mt-1">{formErrors.subtotal}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  VAT Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Discount ($)
                </label>
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Initial Payment ($)
                </label>
                <input
                  type="number"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Invoice Terms & Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent shadow-inner"
              />
            </div>

            <div className="pt-4 border-t border-border/40 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Issue Tax Invoice</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
            onClick={() => {
              setFormData({
                folioId: '',
                guestName: '',
                guestEmail: '',
                companyName: '',
                guestAddress: '',
                issuedDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
                description: 'Luxury Suite Accommodation & Gastronomy',
                subtotal: '3500',
                taxRate: '10',
                discountAmount: '0',
                amountPaid: '0',
                notes: 'Payment due within 7 days. Statutory VAT applies.',
              });
              setFormErrors({});
              setPageView('create');
            }}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Invoice</span>
          </button>
        </div>
      </div>



      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">Total Invoiced Volume</p>
            <p className="text-2xl font-serif font-bold text-primary dark:text-white mt-0.5">
              ${totalInvoiced.toLocaleString()}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">{invoices.length} Invoices Issued</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Settled & Remitted</p>
            <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${totalPaid.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-500 font-mono mt-0.5">Cleared Collections</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pending Receivables</p>
            <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              ${totalBalance.toLocaleString()}
            </p>
            <p className="text-[10px] text-blue-500 font-mono mt-0.5">Awaiting Remittance</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Overdue Invoices</p>
            <p className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {overdueCount}
            </p>
            <p className="text-[10px] text-rose-500 font-mono mt-0.5">Action Required</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice number, guest name, company..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['all', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                  statusFilter === st
                    ? 'filter-btn-active'
                    : 'filter-btn-inactive'
                }`}
              >
                {st === 'all' ? 'All Invoices' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 dark:border-white/5 flex items-center justify-between bg-ivory/30 dark:bg-primary-950/30">
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
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-300 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Invoice No</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Client / Company</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Issue Date</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Due Date</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">Subtotal</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">VAT Tax</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">Total Amount</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">Paid</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">Balance</th>
                  <th className="py-3.5 px-4 text-center text-charcoal-muted dark:text-gray-300">Status</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">Actions</th>
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

