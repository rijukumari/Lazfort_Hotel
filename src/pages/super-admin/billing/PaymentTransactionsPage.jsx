import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { initialPaymentTransactions } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  CreditCard,
  DollarSign,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const PaymentTransactionsPage = () => {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState(initialPaymentTransactions || []);
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);

  // Computed KPI Metrics
  const totalVolume = useMemo(
    () => transactions.reduce((acc, tx) => acc + (tx.status === 'paid' ? tx.amount : 0), 0),
    [transactions]
  );
  const paidCount = useMemo(() => transactions.filter(t => t.status === 'paid').length, [transactions]);
  const pendingCount = useMemo(() => transactions.filter(t => t.status === 'pending' || t.status === 'processing').length, [transactions]);
  const failedCount = useMemo(() => transactions.filter(t => t.status === 'failed').length, [transactions]);
  const settlementRate = useMemo(
    () => (transactions.length > 0 ? ((paidCount / transactions.length) * 100).toFixed(1) : '100'),
    [paidCount, transactions.length]
  );

  // Filtered by Method
  const filteredTransactions = useMemo(() => {
    if (methodFilter === 'all') return transactions;
    return transactions.filter(item => item.paymentMethod === methodFilter);
  }, [transactions, methodFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Reference', 'Client Name', 'Hotel', 'Payment Method', 'Date', 'Amount (USD)', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.transactionId,
      `"${t.reference}"`,
      `"${t.clientName}"`,
      `"${t.hotelName}"`,
      `"${t.paymentMethod}"`,
      t.date,
      t.amount,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payment_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Completed', `Exported ${filteredTransactions.length} transactions as CSV.`, 'success');
  };

  const columns = [
    {
      key: 'transactionId',
      header: 'Transaction ID & Ref',
      sortable: true,
      render: (tx) => (
        <div>
          <div className="font-mono text-xs font-bold text-accent">{tx.transactionId}</div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 font-mono line-clamp-1">
            {tx.reference}
          </div>
        </div>
      ),
    },
    {
      key: 'clientName',
      header: 'Client & Property',
      sortable: true,
      render: (tx) => (
        <div>
          <div className="font-medium text-xs text-primary dark:text-white">{tx.clientName}</div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/70" />
            <span className="line-clamp-1">{tx.hotelName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Channel',
      render: (tx) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal-muted/10 text-charcoal dark:text-gray-300 text-[11px] font-mono">
          <CreditCard className="w-3 h-3 text-accent" />
          {tx.paymentMethod}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Timestamp',
      sortable: true,
      render: (tx) => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-400">
          {tx.date}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (tx) => (
        <div className="font-serif font-bold text-xs text-primary dark:text-white">
          ${tx.amount?.toLocaleString()} <span className="text-[10px] text-accent font-mono">{tx.currency}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx) => <StatusBadge status={tx.status} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (tx) => (
        <button
          onClick={() => setSelectedTx(tx)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border dark:border-white/10 text-[11px] font-medium text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-white/5 hover:text-accent transition-colors"
        >
          <Eye className="w-3 h-3" />
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <PageHeader
        title="Payment Transactions"
        description="Sovereign settlement records, merchant transaction logs, and global clearance audits"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="btn-luxury-outline inline-flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={() => showToast('Data Synchronized', 'Realtime settlement ledger synchronized with payment gateways.', 'info')}
              className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync Gateways
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Settled Settlement Volume"
          value={`$${totalVolume.toLocaleString()}`}
          change="+14.2%"
          isPositive={true}
          subtitle="vs last 30 days"
          icon={<DollarSign className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Settlement Clearance Rate"
          value={`${settlementRate}%`}
          change="+1.8%"
          isPositive={true}
          subtitle="instant SLA fulfillment"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="In-Flight / Pending"
          value={pendingCount}
          subtitle="awaiting clearance"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Failed / Flagged"
          value={failedCount}
          subtitle="zero chargeback risk"
          icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
        />
      </StatsGrid>

      {/* Transactions Table via standard DataTable with status filtering */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by TxID, Reference, Client, Hotel..."
        statusFilterKey="status"
        statusOptions={['paid', 'pending', 'processing', 'failed']}
        pageSize={10}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-accent" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-xs bg-white dark:bg-primary-900/80 border border-border dark:border-white/15 rounded-2xl text-charcoal dark:text-white"
            >
              <option value="all">All Payment Channels</option>
              <option value="Amex Centurion">Amex Centurion</option>
              <option value="SWIFT Wire Transfer">SWIFT Wire Transfer</option>
              <option value="Visa Infinite">Visa Infinite</option>
              <option value="Mastercard World Elite">Mastercard World Elite</option>
              <option value="Crypto Ledger">Crypto Ledger</option>
            </select>
          </div>
        }
      />

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTx(null)}
          title="Transaction Settlement Voucher"
          size="lg"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-accent font-bold">
                  Sovereign Clearance Voucher
                </span>
                <h3 className="text-lg font-serif font-bold text-primary dark:text-white mt-0.5">
                  {selectedTx.transactionId}
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5 font-mono">{selectedTx.reference}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-accent">
                  ${selectedTx.amount?.toLocaleString()}
                </span>
                <span className="text-[11px] block font-mono text-charcoal-muted">{selectedTx.currency} Gross</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/70 dark:border-white/5 space-y-1">
                <span className="text-[11px] text-charcoal-muted block">Client Beneficiary</span>
                <span className="font-semibold text-primary dark:text-white block text-sm">
                  {selectedTx.clientName}
                </span>
                <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-accent" />
                  {selectedTx.hotelName}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/70 dark:border-white/5 space-y-1">
                <span className="text-[11px] text-charcoal-muted block">Payment Method & SLA</span>
                <span className="font-semibold text-primary dark:text-white block text-sm flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-accent" />
                  {selectedTx.paymentMethod}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Gateway Clear: 256-Bit SSL Enclave
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/70 dark:border-white/5 space-y-1">
                <span className="text-[11px] text-charcoal-muted block">Timestamp</span>
                <span className="font-mono text-charcoal dark:text-gray-200 block">
                  {selectedTx.date} UTC
                </span>
                <span className="text-[10px] text-charcoal-muted">Cleared in 340ms</span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/70 dark:border-white/5 space-y-1">
                <span className="text-[11px] text-charcoal-muted block">Current Status</span>
                <div className="pt-0.5">
                  <StatusBadge status={selectedTx.status} />
                </div>
                <span className="text-[10px] text-charcoal-muted block">Demo Ledger Record</span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-700 dark:text-amber-300">
              Note: This is an audited ledger record from the Lazfort ERP Central Billing Switch. Funds have been distributed into the destination property account in compliance with local hospitality tax regulations.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="btn-luxury-outline text-xs"
              >
                Close Voucher
              </button>
              <button
                onClick={() => {
                  showToast('Voucher Downloaded', `PDF Voucher for ${selectedTx.transactionId} generated.`, 'success');
                  setSelectedTx(null);
                }}
                className="btn-luxury-primary text-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF Voucher
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentTransactionsPage;

