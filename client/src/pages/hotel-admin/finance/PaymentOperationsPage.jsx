import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  Download,
  Eye,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FinanceNavTabs,
  PaymentStatusBadge,
  ProcessPaymentModal,
  PaymentDetailsModal,
  RefundModal,
  DeleteConfirmationDialog
} from '../../../components/finance';

const CHANNELS = [
  'All Channels',
  'Centurion Black Card',
  'Visa Infinite Luxury',
  'Mastercard World Elite',
  'International Wire Transfer (UBS)',
  'Cash Settlement (Treasury Vault)',
  'Sovereign Crypto Vault',
];

export const PaymentOperationsPage = () => {
  const navigate = useNavigate();
  const { payments = [], deletePayment, processPayment } = useERP();
  const { showToast } = useToast();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('All Channels');

  // Dedicated Page View: 'list' | 'process'
  const [pageView, setPageView] = useState('list');
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [paymentToRefund, setPaymentToRefund] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State for Process Payment
  const [processForm, setProcessForm] = useState({
    guestName: '',
    roomNumber: '101',
    amount: '1500',
    method: 'Centurion Black Card',
    currency: 'USD',
    reference: '',
    notes: 'Direct Front Desk Luxury Counter Settlement',
  });

  const handleProcessSubmit = (e) => {
    e.preventDefault();
    if (!processForm.guestName.trim()) {
      showToast('Validation Error', 'Guest name is required.', 'error');
      return;
    }

    if (processPayment) {
      processPayment({
        guestName: processForm.guestName.trim(),
        roomNumber: processForm.roomNumber,
        amount: Number(processForm.amount) || 0,
        paymentMethod: processForm.method,
        currency: processForm.currency,
        reference: processForm.reference || `TX-HOTEL-${Date.now()}`,
        status: 'settled',
        date: new Date().toISOString().split('T')[0],
      });
    }

    showToast('Payment Settled', `Transaction for $${processForm.amount} authorized and settled.`, 'success');
    setPageView('list');
  };

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.transactionRef?.toLowerCase().includes(q) ||
        p.guestName?.toLowerCase().includes(q) ||
        p.bookingCode?.toLowerCase().includes(q) ||
        p.paymentMethod?.toLowerCase().includes(q) ||
        p.notes?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesChannel =
        channelFilter === 'All Channels' || p.paymentMethod === channelFilter;

      return matchesSearch && matchesStatus && matchesChannel;
    }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [payments, searchQuery, statusFilter, channelFilter]);

  // Statistics
  const totalVolume = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const settledTotal = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const pendingTotal = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const refundedTotal = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const handleDeleteConfirm = () => {
    if (paymentToDelete) {
      deletePayment(paymentToDelete.id || paymentToDelete.transactionRef);
      showToast('Payment Removed', `Transaction ${paymentToDelete.transactionRef || paymentToDelete.id} deleted.`, 'info');
      setPaymentToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Transaction Ref',
      'Guest Name',
      'Booking / Folio Code',
      'Payment Method',
      'Amount',
      'Date',
      'Status',
      'Notes'
    ];

    const rows = filteredPayments.map((p) => [
      `"${p.transactionRef || p.id}"`,
      `"${p.guestName}"`,
      `"${p.bookingCode || ''}"`,
      `"${p.paymentMethod}"`,
      p.amount || 0,
      `"${p.date}"`,
      `"${p.status}"`,
      `"${p.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lazfort_Merchant_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Transactions Exported', 'Merchant clearing export generated.', 'success');
  };

  // Dedicated Page View: Process Payment on Same Page
  if (pageView === 'process') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-accent rotate-180" />
            <span>Back to Payment Operations</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-secondary/40 border border-transparent shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/40 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Process Sovereign Payment
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Authorize direct gateway remittance, virtual terminal swipe or luxury bank wire
              </p>
            </div>
          </div>

          <form onSubmit={handleProcessSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Client / Guest Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Duke Alexander of Wellington"
                  value={processForm.guestName}
                  onChange={e => setProcessForm({ ...processForm, guestName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Chamber / Suite Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 501 (Royal Penthouse)"
                  value={processForm.roomNumber}
                  onChange={e => setProcessForm({ ...processForm, roomNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Authorized Settlement Amount ($ USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={processForm.amount}
                  onChange={e => setProcessForm({ ...processForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono font-bold shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Payment Method & Gateway
                </label>
                <select
                  value={processForm.method}
                  onChange={e => setProcessForm({ ...processForm, method: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer shadow-sm"
                >
                  {CHANNELS.filter(c => c !== 'All Channels').map(c => (
                    <option key={c} value={c} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Bank / Authorization Reference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. AUTH-UBS-98328-LUX"
                value={processForm.reference}
                onChange={e => setProcessForm({ ...processForm, reference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Transaction Audit Notes
              </label>
              <textarea
                rows={2}
                value={processForm.notes}
                onChange={e => setProcessForm({ ...processForm, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none shadow-inner resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold cursor-pointer"
              >
                Authorize & Settle Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary dark:text-white">
              Payment Operations & Merchant Terminal
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Point-of-sale authorizations, Centurion card capture, wire transfers & refund protocols
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 text-accent shrink-0" />
            <span className="whitespace-nowrap">Export Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => setPageView('process')}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Terminal className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Process Payment</span>
          </button>
        </div>
      </div>



      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">Total Volume Processed</p>
            <p className="text-2xl font-serif font-bold text-primary dark:text-white mt-0.5">
              ${totalVolume.toLocaleString()}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">{payments.length} Transactions</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Settled / Captured</p>
            <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${settledTotal.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-500 font-mono mt-0.5">Merchant Cleared</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending Authorizations</p>
            <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              ${pendingTotal.toLocaleString()}
            </p>
            <p className="text-[10px] text-amber-500 font-mono mt-0.5">Awaiting Clearing</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Refunded Volume</p>
            <p className="text-2xl font-serif font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              ${refundedTotal.toLocaleString()}
            </p>
            <p className="text-[10px] text-purple-500 font-mono mt-0.5">Reversed Credits</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-xl dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ref ID (e.g. TX-98421), cardholder, or booking code..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full md:w-64 px-3.5 py-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer shadow-sm"
          >
            {CHANNELS.map((ch) => (
              <option key={ch} value={ch} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40 dark:border-white/5 text-xs">
          <span className="text-charcoal-muted dark:text-gray-400 font-semibold mr-1">Status:</span>
          {['all', 'paid', 'pending', 'refunded', 'failed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                statusFilter === st
                  ? 'filter-btn-active'
                  : 'filter-btn-inactive'
              }`}
            >
              {st === 'all' ? 'All Payments' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="rounded-3xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 dark:border-white/5 flex items-center justify-between bg-ivory/30 dark:bg-primary-950/30">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredPayments.length}</span> of {payments.length} Transactions
          </p>
          {(statusFilter !== 'all' || channelFilter !== 'All Channels' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setChannelFilter('All Channels');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-300 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-charcoal-muted dark:text-gray-300">Transaction Ref</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal-muted dark:text-gray-300">Guest / Cardholder</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal-muted dark:text-gray-300">Folio / Code</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal-muted dark:text-gray-300">Payment Channel</th>
                  <th className="py-3.5 px-4 text-right font-semibold text-charcoal-muted dark:text-gray-300">Amount ($)</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal-muted dark:text-gray-300">Date</th>
                  <th className="py-3.5 px-4 text-center font-semibold text-charcoal-muted dark:text-gray-300">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold text-charcoal-muted dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {p.transactionRef || p.id}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                      {p.guestName}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {p.bookingCode || 'DIRECT'}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal dark:text-gray-300">
                      {p.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-primary dark:text-white">
                      ${(p.amount || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {p.date}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <PaymentStatusBadge status={p.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/hotel-admin/finance/payments/receipt/${p.id || p.transactionRef}`)}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors cursor-pointer"
                          title="View Authorization Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {p.status === 'paid' && (
                          <button
                            onClick={() => {
                              setPaymentToRefund(p);
                              setIsRefundModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-500/15 transition-colors"
                            title="Process Refund"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setPaymentToDelete(p);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                          title="Purge Transaction Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-muted dark:text-gray-400">
            <CreditCard className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No Payment Transactions Found
            </p>
            <p className="text-xs mt-1">Authorize a new transaction or reset search filters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProcessPaymentModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        onSuccess={() => {
          showToast('Payment Captured', 'Terminal payment cleared successfully.', 'success');
        }}
      />

      <PaymentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onRefund={(p) => {
          setIsDetailsModalOpen(false);
          setPaymentToRefund(p);
          setIsRefundModalOpen(true);
        }}
      />

      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setPaymentToRefund(null);
        }}
        payment={paymentToRefund}
        onSuccess={() => {
          showToast('Refund Processed', 'Payment authorization reversed and credited back.', 'success');
        }}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPaymentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Purge Transaction Record"
        itemName={paymentToDelete ? `${paymentToDelete.transactionRef || paymentToDelete.id} - ${paymentToDelete.guestName}` : ''}
        message="Are you certain you wish to delete this payment record from the terminal ledger?"
      />
    </div>
  );
};

export default PaymentOperationsPage;

