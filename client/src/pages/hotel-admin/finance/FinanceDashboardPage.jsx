import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  FileText,
  Landmark,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  Plus
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FinanceStatCard,
  FinanceNavTabs,
  PaymentStatusBadge,
  CreateFolioModal,
  CreateInvoiceModal,
  CreateJournalModal,
  PaymentDetailsModal
} from '../../../components/finance';

export const FinanceDashboardPage = () => {
  const navigate = useNavigate();
  const {
    folios = [],
    invoices = [],
    chartOfAccounts = [],
    journalEntries = [],
    payments = [],
    getTodayRevenue,
    getMonthlyRevenue,
  } = useERP();
  const { showToast } = useToast();

  const [isFolioModalOpen, setIsFolioModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);

  // Financial Computations
  const totalSettledPayments = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalPendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalRefundedPayments = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalFolioReceivables = folios.reduce((sum, f) => sum + (Number(f.balanceDue) || 0), 0);
  const totalRevenue = getMonthlyRevenue();

  // Channel breakdown
  const channelBreakdown = [
    {
      name: 'Centurion & Luxury Cards',
      volume: payments.filter(p => p.paymentMethod?.includes('Card') && p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      count: payments.filter(p => p.paymentMethod?.includes('Card')).length,
      pct: 58,
      color: 'bg-accent',
    },
    {
      name: 'International Wire (UBS/Credit Suisse)',
      volume: payments.filter(p => p.paymentMethod?.includes('Wire') && p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      count: payments.filter(p => p.paymentMethod?.includes('Wire')).length,
      pct: 28,
      color: 'bg-emerald-500',
    },
    {
      name: 'Treasury Cash & Sovereign Vault',
      volume: payments.filter(p => (p.paymentMethod?.includes('Cash') || p.paymentMethod?.includes('Crypto')) && p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      count: payments.filter(p => p.paymentMethod?.includes('Cash') || p.paymentMethod?.includes('Crypto')).length,
      pct: 14,
      color: 'bg-blue-500',
    },
  ];

  const recentTransactions = payments.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary dark:text-white">
              Finance & General Ledger Command
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Lazfort Palace Treasury, Guest Folio Statements, VAT Invoicing & Double-Entry Accounting
            </p>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/hotel-admin/finance/folios/create')}
            className="px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/15 text-xs font-semibold text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-accent shrink-0" />
            <span className="whitespace-nowrap">New Folio</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/hotel-admin/finance/invoices/create')}
            className="px-4 py-2.5 rounded-xl border border-accent/40 text-xs font-semibold text-accent hover:bg-accent/15 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Generate Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/hotel-admin/finance/journals/create')}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Post Journal</span>
          </button>
        </div>
      </div>



      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <FinanceStatCard
          title="Consolidated Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle={`ADR Adjusted: $${getTodayRevenue().toLocaleString()} today`}
          trend="+18.4% vs Last Month"
          trendPositive={true}
          icon={TrendingUp}
          color="gold"
          onClick={() => navigate('/hotel-admin/finance/accounts')}
        />
        <FinanceStatCard
          title="Settled Payment Volume"
          value={`$${totalSettledPayments.toLocaleString()}`}
          subtitle={`${payments.filter(p => p.status === 'paid').length} Cleared Transactions`}
          trend="Treasury Verified"
          trendPositive={true}
          icon={CreditCard}
          color="emerald"
          onClick={() => navigate('/hotel-admin/finance/payments')}
        />
        <FinanceStatCard
          title="Outstanding Folio Balance"
          value={`$${totalFolioReceivables.toLocaleString()}`}
          subtitle={`${folios.filter(f => (f.balanceDue || 0) > 0).length} Open Folios`}
          trend="Receivables Due"
          trendPositive={false}
          icon={Receipt}
          color={totalFolioReceivables > 0 ? 'rose' : 'emerald'}
          onClick={() => navigate('/hotel-admin/finance/folios')}
        />
        <FinanceStatCard
          title="General Ledger Accounts"
          value={chartOfAccounts.length}
          subtitle={`${journalEntries.length} Posted Journal Vouchers`}
          trend="Balanced Ledger"
          trendPositive={true}
          icon={Landmark}
          color="blue"
          onClick={() => navigate('/hotel-admin/finance/journals')}
        />
      </div>

      {/* Analytics & Channel Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Channels Breakdown */}
        <div className="p-5 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Settlement Channel Distribution</span>
            </h3>
            <span className="text-xs text-charcoal-muted font-mono">{payments.length} Tx</span>
          </div>

          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Real-time merchant terminal volume across Centurion cardholders, private banking wires and cash deposits.
          </p>

          <div className="space-y-3 pt-2">
            {channelBreakdown.map((ch, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-charcoal dark:text-gray-300">{ch.name}</span>
                  <span className="font-mono font-bold text-primary dark:text-white">
                    ${ch.volume.toLocaleString()} ({ch.pct}%)
                  </span>
                </div>
                <div className="w-full bg-ivory-dark/60 dark:bg-primary-950/80 rounded-full h-2 overflow-hidden border border-border/40 dark:border-white/10">
                  <div className={`h-2 rounded-full ${ch.color}`} style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/hotel-admin/finance/payments')}
            className="w-full mt-2 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Payment Operations Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Monthly Revenue Trend Visual */}
        <div className="p-5 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Yield & Revenue Performance</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
              +18.4% YoY
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-ivory/40 dark:bg-primary-950/40 border border-border/60 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-charcoal-muted text-[11px]">Room Suite Revenue</p>
                <p className="font-serif font-bold text-primary dark:text-white text-base">
                  ${Math.round(totalRevenue * 0.72).toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-accent">72% of Total</span>
            </div>

            <div className="p-3 rounded-2xl bg-ivory/40 dark:bg-primary-950/40 border border-border/60 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-charcoal-muted text-[11px]">Gastronomy & Haute Dining</p>
                <p className="font-serif font-bold text-primary dark:text-white text-base">
                  ${Math.round(totalRevenue * 0.21).toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-500">21% of Total</span>
            </div>

            <div className="p-3 rounded-2xl bg-ivory/40 dark:bg-primary-950/40 border border-border/60 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-charcoal-muted text-[11px]">Royal Spa & Marina</p>
                <p className="font-serif font-bold text-primary dark:text-white text-base">
                  ${Math.round(totalRevenue * 0.07).toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-500">7% of Total</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/hotel-admin/finance/accounts')}
            className="w-full mt-2 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Review Revenue Ledgers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Operations & Navigation Shortcuts */}
        <div className="p-5 rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-transparent shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>Accounting Operations</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-accent/20 text-accent font-bold">
              Active
            </span>
          </div>

          <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed">
            Manage guest statement ledgers, invoice issuance with statutory VAT computation, and verified double-entry General Ledger vouchers.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div
              onClick={() => navigate('/hotel-admin/finance/folios')}
              className="p-3 rounded-2xl bg-white/70 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 cursor-pointer hover:border-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-accent" />
                <span className="font-medium text-primary dark:text-white">Guest Folios & Statements</span>
              </div>
              <span className="font-mono text-accent font-bold">{folios.length}</span>
            </div>

            <div
              onClick={() => navigate('/hotel-admin/finance/invoices')}
              className="p-3 rounded-2xl bg-white/70 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 cursor-pointer hover:border-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-accent" />
                <span className="font-medium text-primary dark:text-white">Tax Invoices Register</span>
              </div>
              <span className="font-mono text-accent font-bold">{invoices.length}</span>
            </div>

            <div
              onClick={() => navigate('/hotel-admin/finance/journals')}
              className="p-3 rounded-2xl bg-white/70 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 cursor-pointer hover:border-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="font-medium text-primary dark:text-white">Journal Entries Queue</span>
              </div>
              <span className="font-mono text-accent font-bold">{journalEntries.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Data Table */}
      <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Recent Financial Transactions
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Live settlement stream from front desk terminals and merchant gateway
            </p>
          </div>

          <button
            onClick={() => navigate('/hotel-admin/finance/payments')}
            className="px-3.5 py-1.5 rounded-xl border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/15 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Transactions ({payments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Guest / Entity</th>
                <th className="py-3 px-4">Folio / Code</th>
                <th className="py-3 px-4">Channel / Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-accent">{tx.transactionRef || tx.id}</td>
                  <td className="py-3 px-4 font-semibold text-primary dark:text-white">{tx.guestName}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-charcoal-muted">{tx.bookingCode || 'CONCIERGE'}</td>
                  <td className="py-3 px-4 text-charcoal dark:text-gray-300">{tx.paymentMethod}</td>
                  <td className="py-3 px-4 font-mono font-bold text-primary dark:text-white">
                    ${(tx.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-charcoal-muted">{tx.date}</td>
                  <td className="py-3 px-4">
                    <PaymentStatusBadge status={tx.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/hotel-admin/finance/payments/receipt/${tx.id || tx.transactionRef}`)}
                      className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-semibold hover:bg-accent/25 transition-colors cursor-pointer"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateFolioModal
        isOpen={isFolioModalOpen}
        onClose={() => setIsFolioModalOpen(false)}
        onSuccess={() => {
          showToast('Folio Created', 'Guest master folio initialized successfully.', 'success');
        }}
      />

      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={() => {
          showToast('Invoice Issued', 'Tax invoice generated with statutory VAT rate.', 'success');
        }}
      />

      <CreateJournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        onSuccess={() => {
          showToast('Journal Voucher Committed', 'Balanced double-entry journal entry recorded.', 'success');
        }}
      />

      <PaymentDetailsModal
        isOpen={isPaymentDetailsOpen}
        onClose={() => setIsPaymentDetailsOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
};

export default FinanceDashboardPage;

