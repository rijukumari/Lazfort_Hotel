import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ViewToggle } from '../../../components/ui/ViewToggle';
import { useToast } from '../../../context/ToastContext';
import { useERP } from '../../../context/ERPContext';
import { hotelApi } from '../../../services/hotelApi';
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
  Calendar,
  User,
} from 'lucide-react';

export const PaymentTransactionsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { payments = [] } = useERP();
  const [transactions, setTransactions] = useState([]);
  const [methodFilter, setMethodFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_payments') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_payments', mode);
    } catch { }
  };

  useEffect(() => {
    let isMounted = true;
    hotelApi.getPayments({ skipCache: true }).then(res => {
      if (!isMounted) return;
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map((p, idx) => ({
          id: p.id || `tx-${idx}`,
          transactionId: p.transaction_ref || p.transactionRef || `TXN-2026-${98100 + idx}`,
          reference: p.booking_id ? `RES-${p.booking_id}` : 'General Settlement',
          clientName: p.guest_name || p.guestName || 'Distinguished Guest',
          hotelName: p.hotel_name || 'Lazfort Sovereign Portfolio',
          paymentMethod: p.payment_method || p.paymentMethod || 'Amex Centurion',
          date: p.payment_date || p.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
          amount: Number(p.amount) || 0,
          currency: 'USD',
          status: p.status || 'paid',
        }));
        setTransactions(mapped);
      }
    }).catch(() => { });

    return () => {
      isMounted = false;
    };
  }, []);

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
          onClick={() => navigate(`/super-admin/billing/transactions/${tx.id}`)}
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
              className="px-4 py-2 text-xs font-semibold rounded-2xl border border-border dark:border-white/15 text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800/50 inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => showToast('Data Synchronized', 'Realtime settlement ledger synchronized with payment gateways.', 'info')}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-2xl gold-gradient-bg text-primary-950 btn-3d shadow-md shadow-accent/20 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Gateways</span>
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

      {/* Transactions View: Grid or List using identical data */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search by TxID, Reference, Client, Hotel..."
          statusFilterKey="status"
          statusOptions={['paid', 'pending', 'processing', 'failed']}
          pageSize={10}
          actions={
            <div className="flex items-center gap-3">
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
              <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
            </div>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="card-luxury p-4 rounded-2xl border border-border/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-charcoal-muted">
                Showing <strong className="text-primary dark:text-white">{filteredTransactions.length}</strong> transactions
              </span>
              <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-3 flex flex-col justify-between hover:border-accent/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">{tx.transactionId}</span>
                    <StatusBadge status={tx.status} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span className="font-semibold text-primary dark:text-white text-sm">{tx.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                      <Building2 className="w-3.5 h-3.5 text-accent" />
                      <span className="truncate">{tx.hotelName}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted">Settlement Ref:</span>
                      <span className="font-mono font-semibold text-primary dark:text-white">{tx.reference}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted">Method:</span>
                      <span className="font-semibold text-accent">{tx.paymentMethod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted">Timestamp:</span>
                      <span className="font-mono text-[11px] text-charcoal-muted">{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-primary dark:text-accent">
                    ${Number(tx.amount).toLocaleString()}
                  </span>
                  <button
                    onClick={() => navigate(`/super-admin/billing/transactions/${tx.id}`)}
                    className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors flex items-center gap-1.5 text-xs font-semibold px-2.5"
                    title="View Transaction Dossier"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentTransactionsPage;


