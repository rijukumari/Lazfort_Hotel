import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Download } from 'lucide-react';

export const FinancePage = () => {
  const navigate = useNavigate();
  const {
    folios = [],
    invoices = [],
    chartOfAccounts = [],
    journalEntries = [],
    postFolioCharge,
    settleFolioPayment,
    getTodayRevenue,
  } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('folios');

  const totalReceivables = folios.reduce((sum, f) => sum + (f.balanceDue || 0), 0);
  const totalCollected = folios.reduce((sum, f) => sum + (f.totalPaid || 0), 0);

  // Columns for Guest Folios
  const folioColumns = [
    {
      key: 'bookingCode',
      header: 'Folio Ref',
      sortable: true,
      render: f => <span className="font-mono text-xs font-bold text-accent">{f.bookingCode}</span>,
    },
    {
      key: 'guestName',
      header: 'Guest & Suite',
      sortable: true,
      render: f => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{f.guestName}</p>
          <span className="text-[11px] text-accent font-medium">Suite {f.roomNumber}</span>
        </div>
      ),
    },
    {
      key: 'subtotal',
      header: 'Gross Charges',
      sortable: true,
      render: f => <span className="text-xs font-mono font-medium">€{(f.subtotal || 0).toLocaleString()}</span>,
    },
    {
      key: 'grandTotal',
      header: 'Total (Inc. VAT)',
      sortable: true,
      render: f => <span className="text-xs font-mono font-bold text-primary dark:text-white">€{(f.grandTotal || 0).toLocaleString()}</span>,
    },
    {
      key: 'totalPaid',
      header: 'Paid',
      sortable: true,
      render: f => <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">€{(f.totalPaid || 0).toLocaleString()}</span>,
    },
    {
      key: 'balanceDue',
      header: 'Balance Due',
      sortable: true,
      render: f => (
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${(f.balanceDue || 0) > 0
          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}>
          €{(f.balanceDue || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Folio Status',
      render: f => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl ${f.status === 'open'
          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}>
          {f.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: f => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => navigate(`/super-admin/billing/folios/statement/${f.id}`)}
            className="w-8 h-8 rounded-xl border border-border dark:border-white/10 text-charcoal hover:text-accent dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-900/50 flex items-center justify-center transition-all shrink-0"
            title="View Folio Statement on Dedicated Page"
          >
            <Download className="w-4 h-4 text-accent" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/billing/folios/charge/${f.id}`)}
            className="h-8 px-3 rounded-xl bg-accent/15 text-accent border border-accent/30 text-xs font-bold hover:bg-accent/25 transition-all flex items-center justify-center whitespace-nowrap shrink-0"
            title="Post Charge to Folio"
          >
            + Charge
          </button>
          {(f.balanceDue || 0) > 0 && (
            <button
              onClick={() => navigate(`/super-admin/billing/folios/pay/${f.id}`)}
              className="h-8 px-3 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all flex items-center justify-center whitespace-nowrap shrink-0"
              title="Record Payment"
            >
              Pay
            </button>
          )}
        </div>
      ),
    },
  ];

  // Columns for Invoices
  const invoiceColumns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      render: inv => <span className="font-mono text-xs font-bold text-accent">{inv.invoiceNumber}</span>,
    },
    {
      key: 'guestName',
      header: 'Billed To',
      sortable: true,
      render: inv => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{inv.guestName}</p>
          <span className="text-[11px] text-charcoal-muted dark:text-gray-400">{inv.guestEmail}</span>
        </div>
      ),
    },
    {
      key: 'issuedDate',
      header: 'Date Issued',
      sortable: true,
      render: inv => <span className="text-xs font-mono">{inv.issuedDate}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      sortable: true,
      render: inv => <span className="font-mono text-xs font-bold text-primary dark:text-white">€{(inv.totalAmount || 0).toLocaleString()}</span>,
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: inv => (
        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          {inv.paymentStatus}
        </span>
      ),
    },
  ];

  // Columns for Chart of Accounts
  const coaColumns = [
    {
      key: 'code',
      header: 'Account Code',
      sortable: true,
      render: a => <span className="font-mono text-xs font-bold text-accent">{a.code}</span>,
    },
    {
      key: 'name',
      header: 'Account Name',
      sortable: true,
      render: a => <span className="font-semibold text-primary dark:text-white text-xs">{a.name}</span>,
    },
    {
      key: 'type',
      header: 'Category / Type',
      render: a => (
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${a.type === 'Asset' ? 'bg-blue-500/15 text-blue-500' :
          a.type === 'Liability' ? 'bg-amber-500/15 text-amber-500' :
            a.type === 'Revenue' ? 'bg-emerald-500/15 text-emerald-500' :
              'bg-rose-500/15 text-rose-500'
          }`}>
          {a.type} • {a.category}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Current Ledger Balance',
      sortable: true,
      render: a => <span className="font-mono text-xs font-bold text-primary dark:text-white">€{(a.balance || 0).toLocaleString()}</span>,
    },
  ];

  // Columns for Journal Entries
  const journalColumns = [
    {
      key: 'entryNumber',
      header: 'Journal Ref',
      render: je => <span className="font-mono text-xs font-bold text-accent">{je.entryNumber}</span>,
    },
    {
      key: 'date',
      header: 'Posting Date',
      render: je => <span className="text-xs font-mono">{je.date}</span>,
    },
    {
      key: 'description',
      header: 'Audit Description',
      render: je => (
        <div>
          <p className="text-xs font-semibold text-primary dark:text-white leading-tight">{je.description}</p>
          <span className="text-[10px] text-charcoal-muted">Ref: {je.reference} • Posted by: {je.postedBy}</span>
        </div>
      ),
    },
    {
      key: 'totalDebit',
      header: 'Debit (€)',
      render: je => <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">€{(je.totalDebit || 0).toLocaleString()}</span>,
    },
    {
      key: 'totalCredit',
      header: 'Credit (€)',
      render: je => <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">€{(je.totalCredit || 0).toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Ledger Status',
      render: je => (
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          {je.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Finance & General Ledger Command"
        description="Lazfort ERP — Real-time guest folios, settlement reconciliations, formal VAT invoicing, and double-entry general ledger."
        badge="Module H: Enterprise Finance"
        actions={
          <button
            onClick={() => showToast('Financial Export', 'General Ledger & Trial Balance exported to CSV/Excel.', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 text-accent shrink-0" />
            <span className="whitespace-nowrap">Export Ledger</span>
          </button>
        }
      />

      {/* Financial KPIs */}
      <StatsGrid columns={4}>
        <StatCard
          title="Daily Projected Revenue"
          value={`€${(getTodayRevenue ? getTodayRevenue() : 45000).toLocaleString()}`}
          change="Rooms & Dining Combined"
          isPositive={true}
          iconName="DollarSign"
          subtitle="Monaco 5★ Yield"
        />
        <StatCard
          title="Accounts Receivable"
          value={`€${totalReceivables.toLocaleString()}`}
          change={`${folios.filter(f => (f.balanceDue || 0) > 0).length} Outstanding Folios`}
          isPositive={totalReceivables < 10000}
          iconName="Receipt"
          subtitle="Guest Ledgers"
        />
        <StatCard
          title="Total Cash & Settlement"
          value={`€${totalCollected.toLocaleString()}`}
          change="Pre-auth & Wire transfers"
          isPositive={true}
          iconName="CreditCard"
          subtitle="Settled into UBS Account"
        />
        <StatCard
          title="General Ledger Balance"
          value={`€${chartOfAccounts.find(c => c.code === '1020')?.balance?.toLocaleString() || '2,480,000'}`}
          change="Double-Entry Validated"
          isPositive={true}
          iconName="Scale"
          subtitle="Sovereign Operating Reserve"
        />
      </StatsGrid>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'folios', label: 'Guest Folios & Room Ledgers', count: folios.length },
          { id: 'invoices', label: 'Issued Invoices', count: invoices.length },
          { id: 'coa', label: 'Chart of Accounts', count: chartOfAccounts.length },
          { id: 'journal', label: 'Journal Entries Audit', count: journalEntries.length },
        ]}
        activeTab={activeTab}
        onChange={tabId => setActiveTab(tabId)}
      />

      {/* Main Content by Tab */}
      {activeTab === 'folios' && (
        <div className="space-y-4">
          <DataTable
            data={folios}
            columns={folioColumns}
            keyExtractor={f => f.id}
            searchPlaceholder="Search folios by booking code, guest name, or suite number..."
          />
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <DataTable
            data={invoices}
            columns={invoiceColumns}
            keyExtractor={inv => inv.id}
            searchPlaceholder="Search invoices by invoice number or guest..."
          />
        </div>
      )}

      {activeTab === 'coa' && (
        <div className="space-y-4">
          <DataTable
            data={chartOfAccounts}
            columns={coaColumns}
            keyExtractor={a => a.id}
            searchPlaceholder="Search accounts by code or name..."
          />
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="space-y-4">
          <DataTable
            data={journalEntries}
            columns={journalColumns}
            keyExtractor={je => je.id}
            searchPlaceholder="Search journal entries by reference or description..."
          />
        </div>
      )}

    </div>
  );
};

export default FinancePage;

