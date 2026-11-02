import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Receipt,
  BookOpen,
  FileText,
  Plus,
  CreditCard,
  Building,
  CheckCircle,
  Download,
  Scale,
  Eye,
  Edit,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

export const PlatformRevenuePage = () => {
  const {
    folios,
    invoices,
    chartOfAccounts,
    journalEntries,
    postFolioCharge,
    settleFolioPayment,
    getTodayRevenue,
    getMonthlyRevenue,
  } = useERP();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('folios');

  // Local state for Chart of Accounts to allow Add/Edit
  const [coaList, setCoaList] = useState(chartOfAccounts || []);

  const totalReceivables = (folios || []).reduce((sum, f) => sum + (f.balanceDue || 0), 0);
  const totalCollected = (folios || []).reduce((sum, f) => sum + (f.totalPaid || 0), 0);
  const totalGlBalance = (coaList || []).reduce((sum, a) => sum + (a.balance || 0), 0);
  const monthlyRev = getMonthlyRevenue ? getMonthlyRevenue() : 450000;
  const todayRev = getTodayRevenue ? getTodayRevenue() : 18500;

  const handleExportInvoicesCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Invoice Number,Client Name,Invoice Date,Due Date,Subtotal,Tax,Total,Paid,Balance,Status\n' +
      (invoices || [])
        .map(
          i =>
            `"${i.invoiceNumber}","${i.guestName}","${i.issueDate || i.issuedDate}","${i.dueDate}",${i.subtotal},${i.taxAmount},${i.totalAmount},${i.paidAmount ?? i.amountPaid ?? 0},${i.balanceDue ?? i.balance ?? 0},"${i.status || i.paymentStatus}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lazfort-invoices-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Issued invoices exported to CSV.', 'info');
  };

  // Folio Columns
  const folioColumns = [
    {
      key: 'bookingCode',
      header: 'Folio Ref',
      sortable: true,
      render: f => <span className="font-mono text-xs font-bold text-accent">{f.bookingCode}</span>,
    },
    {
      key: 'guestName',
      header: 'Guest / Suite',
      sortable: true,
      render: f => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight font-serif">{f.guestName}</p>
          <span className="text-[11px] text-charcoal-muted">Suite {f.roomNumber}</span>
        </div>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Gross Total',
      sortable: true,
      render: f => <span className="font-serif font-bold text-xs">${f.grandTotal?.toLocaleString()}</span>,
    },
    {
      key: 'totalTax',
      header: 'Tax (10%)',
      render: f => <span className="text-xs text-charcoal-muted">${f.totalTax?.toLocaleString()}</span>,
    },
    {
      key: 'totalPaid',
      header: 'Amount Paid',
      sortable: true,
      render: f => (
        <span className="font-serif text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
          ${f.totalPaid?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'balanceDue',
      header: 'Balance Due',
      sortable: true,
      render: f => (
        <span className={`font-serif font-bold text-xs ${f.balanceDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-charcoal-muted'}`}>
          ${f.balanceDue?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Folio Status',
      sortable: true,
      render: f => <StatusBadge status={f.status} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: f => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => navigate(`/super-admin/billing/folios/statement/${f.id}`)}
            className="w-8 h-8 rounded-xl border border-border dark:border-white/10 text-charcoal hover:text-accent dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-900/50 flex items-center justify-center transition-all shrink-0"
            title="View Folio Statement on Dedicated Page"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/billing/folios/charge/${f.id}`)}
            className="h-8 px-3 rounded-xl bg-accent/15 text-accent border border-accent/30 font-bold text-xs hover:bg-accent/25 transition-all flex items-center justify-center whitespace-nowrap shrink-0"
            title="Post Incidental Charge"
          >
            + Charge
          </button>
          {f.balanceDue > 0 && (
            <button
              onClick={() => navigate(`/super-admin/billing/folios/pay/${f.id}`)}
              className="h-8 px-3 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d shadow-sm flex items-center justify-center whitespace-nowrap shrink-0"
              title="Settle Outstanding Balance"
            >
              Pay
            </button>
          )}
        </div>
      ),
    },
  ];

  // Invoices Columns
  const invoiceColumns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      render: i => <span className="font-mono text-xs font-bold text-accent">{i.invoiceNumber}</span>,
    },
    {
      key: 'guestName',
      header: 'Billed Entity',
      sortable: true,
      render: i => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight font-serif">{i.guestName}</p>
          <span className="text-[11px] text-charcoal-muted">{i.billingAddress?.city || 'Monaco'}</span>
        </div>
      ),
    },
    {
      key: 'issuedDate',
      header: 'Dates',
      sortable: true,
      render: i => (
        <div className="text-xs">
          <span className="block text-primary dark:text-gray-200">{i.issueDate || i.issuedDate}</span>
          <span className="text-[10px] text-charcoal-muted">Due: {i.dueDate}</span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: true,
      render: i => <span className="font-serif font-bold text-xs">${i.totalAmount?.toLocaleString()}</span>,
    },
    {
      key: 'balanceDue',
      header: 'Balance',
      sortable: true,
      render: i => (
        <span className={`font-serif text-xs font-semibold ${i.balanceDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
          ${i.balanceDue?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: i => <StatusBadge status={i.status} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: i => (
        <button
          onClick={() => navigate(`/super-admin/billing/invoices/${i.id || i.invoiceNumber}`)}
          className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
          title="View Invoice Dossier on Dedicated Page"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  // Chart of Accounts Columns
  const coaColumns = [
    {
      key: 'code',
      header: 'GL Code',
      sortable: true,
      render: a => <span className="font-mono text-xs font-bold text-accent">{a.code}</span>,
    },
    {
      key: 'name',
      header: 'Account Description',
      sortable: true,
      render: a => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{a.name}</p>
          <span className="text-[11px] text-charcoal-muted">{a.category}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Account Classification',
      sortable: true,
      render: a => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/30">
          {a.type}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Current Balance',
      sortable: true,
      render: a => <span className="font-serif font-bold text-xs">${a.balance?.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'State',
      sortable: true,
      render: a => <StatusBadge status={a.status || (a.isActive ? 'active' : 'inactive')} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: a => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/billing/accounts/edit/${a.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
            title="Inspect Account Ledger on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/billing/accounts/edit/${a.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
            title="Edit GL Configuration on Dedicated Page"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Journal Columns
  const journalColumns = [
    {
      key: 'entryNumber',
      header: 'Journal Ref #',
      sortable: true,
      render: j => <span className="font-mono text-xs font-bold text-accent">{j.entryNumber}</span>,
    },
    {
      key: 'date',
      header: 'Posting Date',
      sortable: true,
      render: j => <span className="font-mono text-xs">{j.date}</span>,
    },
    {
      key: 'description',
      header: 'Narrative & Description',
      sortable: true,
      render: j => (
        <div>
          <p className="font-semibold text-primary dark:text-white text-xs">{j.description}</p>
          <span className="text-[10px] font-mono text-charcoal-muted">Posted by: {j.postedBy}</span>
        </div>
      ),
    },
    {
      key: 'totalDebit',
      header: 'Total Debit',
      sortable: true,
      render: j => <span className="font-serif text-xs font-bold text-primary dark:text-white">${j.totalDebit?.toLocaleString()}</span>,
    },
    {
      key: 'totalCredit',
      header: 'Total Credit',
      sortable: true,
      render: j => <span className="font-serif text-xs font-bold text-primary dark:text-white">${j.totalCredit?.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Approval',
      sortable: true,
      render: j => <StatusBadge status={j.status} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: j => (
        <button
          onClick={() => setSelectedJournal(j)}
          className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
          title="Inspect Journal Balance Entries"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Platform Revenue, Billing & General Ledger"
        description="Comprehensive sovereign billing ledger, resident folios, institutional accounts, and balanced journal entries."
        badge="Enterprise Accounting"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={handleExportInvoicesCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/super-admin/billing/accounts/add')}
            >
              Add GL Account
            </Button>
          </div>
        }
      />

      {/* Financial Health Metrics */}
      <StatsGrid columns={4}>
        <StatCard
          title="Monthly Gross Billing"
          value={`$${monthlyRev.toLocaleString()}`}
          change="Platform-wide recognized"
          isPositive={true}
          iconName="DollarSign"
        />
        <StatCard
          title="Settled Collections"
          value={`$${totalCollected.toLocaleString()}`}
          change="Instant settlement"
          isPositive={true}
          iconName="CheckCircle"
        />
        <StatCard
          title="Outstanding Receivables"
          value={`$${totalReceivables.toLocaleString()}`}
          change="Active resident folios"
          isPositive={totalReceivables === 0}
          iconName="Receipt"
        />
        <StatCard
          title="GL Balance Sheet Worth"
          value={`$${totalGlBalance.toLocaleString()}`}
          change="100% Balanced Ledger"
          isPositive={true}
          iconName="Building"
        />
      </StatsGrid>

      {/* Tabs Controller */}
      <div className="space-y-6">
        <Tabs
          tabs={[
            { id: 'folios', label: 'Guest & Resident Folios', count: folios?.length || 0 },
            { id: 'invoices', label: 'Institutional Invoices', count: invoices?.length || 0 },
            { id: 'coa', label: 'Chart of Accounts (GL)', count: coaList?.length || 0 },
            { id: 'journal', label: 'Journal Entries Audit', count: journalEntries?.length || 0 },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'folios' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">Active Guest Folios</h3>
                <p className="text-xs text-charcoal-muted">Track room rates, incidental postings, restaurant bills, and real-time checkout balance.</p>
              </div>
            </div>
            <DataTable
              data={folios || []}
              columns={folioColumns}
              keyExtractor={f => f.id}
              searchPlaceholder="Search by guest name, folio code or suite..."
              pageSize={8}
            />
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">Institutional B2B Invoices</h3>
                <p className="text-xs text-charcoal-muted">Corporate retreats, embassy delegacies, and direct partner invoices with terms.</p>
              </div>
            </div>
            <DataTable
              data={invoices || []}
              columns={invoiceColumns}
              keyExtractor={i => i.id}
              searchPlaceholder="Search by invoice number or billed client..."
              pageSize={8}
            />
          </div>
        )}

        {activeTab === 'coa' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">General Ledger Accounts</h3>
                <p className="text-xs text-charcoal-muted">Double-entry accounting architecture mapping Assets, Liabilities, Equity, Revenue, and Expenses.</p>
              </div>
            </div>
            <DataTable
              data={coaList || []}
              columns={coaColumns}
              keyExtractor={a => a.id}
              searchPlaceholder="Search by account name, code or classification..."
              pageSize={8}
            />
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">General Journal Entries</h3>
                <p className="text-xs text-charcoal-muted">Immutable audited debits and credits posted from automated PMS and ERP subsystems.</p>
              </div>
            </div>
            <DataTable
              data={journalEntries || []}
              columns={journalColumns}
              keyExtractor={j => j.id}
              searchPlaceholder="Search journal entry by reference or description..."
              pageSize={8}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformRevenuePage;

