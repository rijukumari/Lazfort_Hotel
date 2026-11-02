import React, { useState, useMemo } from 'react';
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
  const { payments = [], deletePayment } = useERP();
  const { showToast } = useToast();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('All Channels');

  // Modals
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [paymentToRefund, setPaymentToRefund] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>Export Transactions</span>
          </button>

          <button
            onClick={() => setIsProcessModalOpen(true)}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>Process Payment</span>
          </button>
        </div>
      </div>



      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
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

        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm flex items-center justify-between">
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

        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-sm flex items-center justify-between">
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

        <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 shadow-sm flex items-center justify-between">
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
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ref ID (e.g. TX-98421), cardholder, or booking code..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full md:w-64 px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
          >
            {CHANNELS.map((ch) => (
              <option key={ch} value={ch} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                {ch}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60 dark:border-white/5 text-xs">
          <span className="text-charcoal-muted dark:text-gray-400 font-semibold mr-1">Status:</span>
          {['all', 'paid', 'pending', 'refunded', 'failed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${statusFilter === st
                  ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                  : 'bg-ivory/80 dark:bg-primary-950/40 border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent/50'
                }`}
            >
              {st === 'all' ? 'All Payments' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
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
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-950/80 text-[11px] uppercase tracking-wider text-charcoal dark:text-gray-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-charcoal dark:text-gray-200">Transaction Ref</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal dark:text-gray-200">Guest / Cardholder</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal dark:text-gray-200">Folio / Code</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal dark:text-gray-200">Payment Channel</th>
                  <th className="py-3.5 px-4 text-right font-semibold text-charcoal dark:text-gray-200">Amount ($)</th>
                  <th className="py-3.5 px-4 font-semibold text-charcoal dark:text-gray-200">Date</th>
                  <th className="py-3.5 px-4 text-center font-semibold text-charcoal dark:text-gray-200">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold text-charcoal dark:text-gray-200">Actions</th>
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
                          onClick={() => {
                            setSelectedPayment(p);
                            setIsDetailsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
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

