import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  Clock,
  RotateCcw,
  Eye,
  Plus,
  Receipt,
  FileText,
  Printer
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const { payments = [] } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.guestName?.toLowerCase().includes(q) ||
        p.transactionRef?.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.roomNumber?.toString().includes(q);

      const matchesMethod =
        methodFilter === 'all' ||
        (p.paymentMethod && p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase()));

      return matchesSearch && matchesMethod;
    }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [payments, searchQuery, methodFilter]);

  const totalVolume = useMemo(() => {
    return filteredPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  }, [filteredPayments]);

  const settledCount = useMemo(() => {
    return filteredPayments.filter(p => p.status === 'paid' || p.status === 'settled' || !p.status).length;
  }, [filteredPayments]);

  const handleExportCSV = () => {
    const headers = ['Ref', 'Guest Name', 'Chamber', 'Method', 'Amount', 'Date', 'Status'];
    const rows = filteredPayments.map((p) => [
      `"${p.transactionRef || p.reference || p.id}"`,
      `"${p.guestName}"`,
      `"${p.roomNumber || ''}"`,
      `"${p.paymentMethod || ''}"`,
      p.amount || 0,
      `"${p.date || ''}"`,
      `"${p.status || 'settled'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `FrontDesk_Payment_History_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', 'Payment ledger downloaded.', 'success');
  };

  const columns = [
    {
      key: 'transactionRef',
      header: 'Reference',
      render: (p) => (
        <span className="font-mono text-xs font-bold text-accent">
          {p.transactionRef || p.reference || p.id}
        </span>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      render: (p) => (
        <div>
          <p className="font-serif font-bold text-sm text-primary dark:text-white">
            {p.guestName}
          </p>
          {p.roomNumber && (
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Suite {p.roomNumber}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (p) => (
        <span className="text-xs text-charcoal dark:text-gray-300">
          {p.paymentMethod || 'Credit Card'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p) => (
        <span className="font-mono font-bold text-sm text-emerald-400">
          ${Number(p.amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (p) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400">
          {p.date || 'Today'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <StatusBadge
          status={p.status === 'refunded' ? 'cancelled' : p.status === 'pending' ? 'pending' : 'completed'}
          label={p.status === 'refunded' ? 'Refunded' : p.status === 'pending' ? 'Pending' : 'Settled'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => {
              navigate('/receptionist/payments/receipt', {
                state: { selectedPayment: p }
              });
            }}
          >
            Details
          </Button>
          <Button
            variant="ghost"
            size="xs"
            icon={Printer}
            onClick={() => {
              navigate('/receptionist/payments/receipt', {
                state: { selectedPayment: p }
              });
            }}
          >
            Receipt
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reception Payment History"
        subtitle="Complete log of all settlements, transactions, and guest room folios settled at the front counter."
        icon={Receipt}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/receptionist/payments/collect')}
            >
              Collect New Payment
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Captured Volume"
          value={`$${totalVolume.toLocaleString()}`}
          subtitle={`${filteredPayments.length} recorded settlements`}
          icon={DollarSign}
        />
        <StatCard
          title="Settled Transactions"
          value={settledCount}
          subtitle="Front desk cleared charges"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Settlements"
          value={filteredPayments.filter(p => p.status === 'pending').length}
          subtitle="Awaiting bank confirmation"
          icon={Clock}
        />
      </div>

      {/* Table & Controls */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by guest, reference, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Channels</option>
              <option value="centurion">Centurion Black Card</option>
              <option value="visa">Visa Infinite</option>
              <option value="mastercard">Mastercard World Elite</option>
              <option value="wire">Wire Transfer</option>
              <option value="cash">Vault Cash</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredPayments}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No payment records found matching criteria."
        />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;

