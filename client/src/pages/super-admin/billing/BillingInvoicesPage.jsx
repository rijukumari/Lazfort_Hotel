import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ViewToggle } from '../../../components/ui/ViewToggle';
import { useToast } from '../../../context/ToastContext';
import { useERP } from '../../../context/ERPContext';
import { hotelApi } from '../../../services/hotelApi';
import {
  FileText,
  DollarSign,
  Download,
  Printer,
  Eye,
  Filter,
  Search,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

export const BillingInvoicesPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { invoices: erpInvoices = [] } = useERP();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_invoices') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_invoices', mode);
    } catch {}
  };

  useEffect(() => {
    let isMounted = true;
    hotelApi.getInvoices({ skipCache: true }).then(data => {
      if (!isMounted) return;
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((inv, idx) => ({
          id: inv.id || `inv-${idx}`,
          invoiceNumber: inv.invoice_number || inv.invoiceNumber || `INV-2026-${1000 + idx}`,
          clientName: inv.guest_name || inv.guestName || 'Distinguished Guest',
          hotelName: inv.hotel_name || 'Lazfort Grand Palace Monaco',
          invoiceDate: inv.issue_date || inv.invoiceDate || new Date().toISOString().split('T')[0],
          dueDate: inv.due_date || inv.dueDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
          subtotal: Number(inv.subtotal) || Number(inv.total_amount) || 0,
          tax: Number(inv.tax_amount) || Math.round((Number(inv.total_amount) || 0) * 0.1),
          totalAmount: Number(inv.total_amount) || Number(inv.totalAmount) || 0,
          paidAmount: Number(inv.amount_paid) || Number(inv.paidAmount) || 0,
          balanceDue: Math.max(0, (Number(inv.total_amount) || 0) - (Number(inv.amount_paid) || 0)),
          status: inv.status || 'paid',
        }));
        setInvoices(mapped);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Metrics
  const totalBilled = useMemo(() => invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0), [invoices]);
  const totalPaid = useMemo(() => invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0), [invoices]);
  const totalOutstanding = useMemo(() => invoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0), [invoices]);
  const overdueCount = useMemo(() => invoices.filter(inv => inv.status === 'overdue').length, [invoices]);

  // Filtering
  const filteredInvoices = useMemo(() => {
    return invoices.filter(item => {
      const matchesSearch =
        item.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hotelName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Invoice #', 'Client Name', 'Hotel', 'Invoice Date', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Paid', 'Balance Due', 'Status'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      `"${inv.clientName}"`,
      `"${inv.hotelName}"`,
      inv.invoiceDate,
      inv.dueDate,
      inv.subtotal,
      inv.tax,
      inv.totalAmount,
      inv.paidAmount,
      inv.balanceDue,
      inv.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sovereign_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Successful', 'Billing invoices exported to CSV format.', 'success');
  };

  const handlePrintInvoice = (inv) => {
    navigate(`/super-admin/billing/invoices/${inv.id}`);
  };

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      render: (inv) => (
        <span className="font-mono text-xs font-bold text-accent">
          {inv.invoiceNumber}
        </span>
      ),
    },
    {
      key: 'hotelName',
      header: 'Property & Client',
      sortable: true,
      render: (inv) => (
        <div>
          <span className="font-serif font-semibold text-primary dark:text-white block">
            {inv.hotelName}
          </span>
          <span className="text-[11px] text-charcoal-muted font-sans">
            Attn: {inv.clientName}
          </span>
        </div>
      ),
    },
    {
      key: 'invoiceDate',
      header: 'Issued Date',
      sortable: true,
      render: (inv) => (
        <span className="text-xs font-mono text-charcoal dark:text-gray-300">
          {inv.invoiceDate}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (inv) => (
        <span className={`text-xs font-mono ${inv.status === 'overdue' ? 'text-rose-500 font-bold' : 'text-charcoal-muted'}`}>
          {inv.dueDate}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: true,
      render: (inv) => (
        <span className="font-serif font-bold text-xs text-primary dark:text-white">
          ${inv.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Amount Paid',
      sortable: true,
      render: (inv) => (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
          ${inv.paidAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'balanceDue',
      header: 'Balance Outstanding',
      sortable: true,
      render: (inv) => (
        <span className={`font-mono text-xs font-bold ${inv.balanceDue > 0 ? 'text-accent' : 'text-charcoal-muted'}`}>
          ${inv.balanceDue?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (inv) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/billing/invoices/${inv.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Invoice on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              showToast('Print Started', `Preparing tax invoice ${inv.invoiceNumber} for printing.`, 'info');
              window.print();
            }}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Print Invoice"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Billing & Tax Invoices"
        subtitle="Manage official sovereign VAT statements, enterprise subscriptions, and recurring ledger statements"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin' },
          { label: 'Billing & Payments', path: '/super-admin/billing/revenue' },
          { label: 'Invoices' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-semibold rounded-2xl border border-border dark:border-white/15 text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800/50 inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Export Ledger CSV</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Total Invoiced"
          value={`$${totalBilled.toLocaleString()}`}
          period="fiscal year gross"
          icon={<DollarSign className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Total Settled"
          value={`$${totalPaid.toLocaleString()}`}
          period="cleared remittances"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Net Receivable"
          value={`$${totalOutstanding.toLocaleString()}`}
          period="pending balance"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Overdue Accounts"
          value={overdueCount}
          period="immediate demand"
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        />
      </StatsGrid>

      {/* Table & Filtering */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Invoice #, Hotel name, or Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <span className="text-charcoal-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial Payment</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} className="ml-2" />
          </div>
        </div>

        {viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={filteredInvoices}
            keyExtractor={(inv) => inv.id}
            showSearch={false}
            pageSize={10}
            emptyMessage="No billing invoice records found."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">{inv.invoiceNumber}</span>
                    <StatusBadge status={inv.status} />
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-tight">
                      {inv.clientName}
                    </h4>
                    <p className="text-xs text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-accent" />
                      <span>{inv.hotelName}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Issued:</span>
                      <span className="font-mono">{inv.invoiceDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Due Date:</span>
                      <span className="font-mono font-semibold text-rose-500">{inv.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/40 dark:border-white/5">
                      <span>Balance Due:</span>
                      <span className="font-mono font-bold text-primary dark:text-white">${inv.balanceDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal-muted uppercase block">Total Amount</span>
                    <span className="font-serif font-bold text-lg text-primary dark:text-accent">
                      ${inv.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/super-admin/billing/invoices/${inv.id}`)}
                      className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors flex items-center gap-1 text-xs font-semibold px-2.5"
                      title="View Invoice"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(inv)}
                      className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal dark:text-gray-300 transition-colors"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BillingInvoicesPage;

