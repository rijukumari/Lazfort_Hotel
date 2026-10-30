import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { ModalFooter } from '../../../components/ui/ModalFooter';
import { FormField, Input, Select, Textarea } from '../../../components/forms/FormField';
import { StatusBadge } from '../../../components/ui/StatusBadge';
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

  // Modals state
  const [selectedFolio, setSelectedFolio] = useState(null);
  const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charge Form
  const [chargeCategory, setChargeCategory] = useState('restaurant');
  const [chargeDescription, setChargeDescription] = useState('');
  const [chargeAmount, setChargeAmount] = useState(150);

  // Payment Form
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Account Form
  const [accCode, setAccCode] = useState('');
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState('Asset');
  const [accCategory, setAccCategory] = useState('Operating Accounts');
  const [accBalance, setAccBalance] = useState(50000);
  const [accStatus, setAccStatus] = useState('active');

  const totalReceivables = (folios || []).reduce((sum, f) => sum + (f.balanceDue || 0), 0);
  const totalCollected = (folios || []).reduce((sum, f) => sum + (f.totalPaid || 0), 0);
  const totalGlBalance = (coaList || []).reduce((sum, a) => sum + (a.balance || 0), 0);
  const monthlyRev = getMonthlyRevenue ? getMonthlyRevenue() : 450000;
  const todayRev = getTodayRevenue ? getTodayRevenue() : 18500;

  // Handlers
  const handleOpenAddCharge = (folio) => {
    setSelectedFolio(folio);
    setChargeDescription('');
    setChargeAmount(150);
    setIsAddChargeModalOpen(true);
  };

  const handleOpenPayment = (folio) => {
    setSelectedFolio(folio);
    setPaymentAmount(folio.balanceDue);
    setIsPaymentModalOpen(true);
  };

  const handleExecuteAddCharge = async (e) => {
    e.preventDefault();
    if (!selectedFolio || chargeAmount <= 0) return;
    setIsSubmitting(true);
    try {
      if (postFolioCharge) {
        postFolioCharge(selectedFolio.id, {
          date: new Date().toISOString().split('T')[0],
          category: chargeCategory,
          description: chargeDescription || `${chargeCategory.toUpperCase()} Service Charge`,
          quantity: 1,
          unitPrice: Number(chargeAmount),
          taxAmount: Number(chargeAmount) * 0.1,
          totalAmount: Number(chargeAmount) * 1.1,
          postedBy: 'Platform Admin',
        });
      }
      showToast('Charge Posted', `$${chargeAmount} posted to Folio #${selectedFolio.bookingCode}`, 'success');
      setIsAddChargeModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    if (!selectedFolio || paymentAmount <= 0) return;
    setIsSubmitting(true);
    try {
      if (settleFolioPayment) {
        settleFolioPayment(selectedFolio.id, {
          date: new Date().toISOString().split('T')[0],
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: `PAY-${Date.now().toString().slice(-6)}`,
          receivedBy: 'Platform Super Admin',
        });
      }
      showToast('Payment Settled', `$${paymentAmount} settled for Folio #${selectedFolio.bookingCode}`, 'success');
      setIsPaymentModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAccountModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setAccCode(account.code);
      setAccName(account.name);
      setAccType(account.type);
      setAccCategory(account.category || 'Operating Accounts');
      setAccBalance(account.balance);
      setAccStatus(account.status || 'active');
    } else {
      setEditingAccount(null);
      setAccCode(`10${Math.floor(100 + Math.random() * 900)}`);
      setAccName('');
      setAccType('Asset');
      setAccCategory('Operating Accounts');
      setAccBalance(25000);
      setAccStatus('active');
    }
    setIsAddAccountModalOpen(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAccount) {
        setCoaList(prev =>
          prev.map(a =>
            a.id === editingAccount.id
              ? {
                  ...a,
                  code: accCode.trim(),
                  name: accName.trim(),
                  type: accType,
                  category: accCategory,
                  balance: Number(accBalance),
                  status: accStatus,
                  isActive: accStatus === 'active',
                }
              : a
          )
        );
        showToast('GL Account Updated', `Account ${accCode} updated successfully.`, 'success');
      } else {
        const newAcc = {
          id: `acc-${Date.now()}`,
          code: accCode.trim(),
          name: accName.trim(),
          type: accType,
          category: accCategory,
          balance: Number(accBalance),
          currency: 'USD',
          isActive: accStatus === 'active',
          status: accStatus,
          isReconciled: true,
          subLedger: 'General',
        };
        setCoaList(prev => [newAcc, ...prev]);
        showToast('Account Created (Demo)', `GL Account ${newAcc.code} registered into general ledger.`, 'success');
      }
      setIsAddAccountModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedFolio(f)}
            className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
            title="View Folio Statement"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenAddCharge(f)}
            className="px-2 py-1 rounded-lg bg-accent/15 text-accent font-bold text-[11px] hover:bg-accent/25"
            title="Post Incidental Charge"
          >
            + Charge
          </button>
          {f.balanceDue > 0 && (
            <button
              onClick={() => handleOpenPayment(f)}
              className="px-2 py-1 rounded-lg gold-gradient-bg text-primary-950 font-bold text-[11px]"
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
          onClick={() => setSelectedInvoice(i)}
          className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
          title="View Invoice Dossier"
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
            onClick={() => setSelectedAccount(a)}
            className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
            title="Inspect Account Ledger"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenAccountModal(a)}
            className="p-1.5 rounded-lg border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-200"
            title="Edit GL Configuration"
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportInvoicesCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleOpenAccountModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <Plus className="w-4 h-4" />
              <span>Add GL Account</span>
            </button>
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

      {/* Post Folio Charge Modal */}
      <Modal
        isOpen={isAddChargeModalOpen}
        onClose={() => setIsAddChargeModalOpen(false)}
        title="Post Charge to Guest Folio"
        subtitle={`Suite ${selectedFolio?.roomNumber} • ${selectedFolio?.guestName} (${selectedFolio?.bookingCode})`}
        maxWidth="md"
      >
        <form onSubmit={handleExecuteAddCharge} className="space-y-4 text-xs">
          <FormField label="Charge Department Category" required>
            <Select
              value={chargeCategory}
              onChange={e => setChargeCategory(e.target.value)}
            >
              <option value="restaurant">Haute Gastronomy Restaurant</option>
              <option value="room_service">24/7 In-Suite Dining</option>
              <option value="spa">Thalasso Spa & Wellness</option>
              <option value="laundry">Dry Cleaning & Valet</option>
              <option value="transport">Helicopter / Chauffeur Service</option>
              <option value="minibar">Presidential Minibar</option>
              <option value="miscellaneous">Concierge Incidentals</option>
            </Select>
          </FormField>

          <FormField label="Description / Bill Narrative" required>
            <Input
              type="text"
              placeholder="e.g., Grand Cru Chateau Latour 2012 or Caviar Tasting"
              value={chargeDescription}
              onChange={e => setChargeDescription(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Charge Amount ($ USD)" required>
            <Input
              type="number"
              min="1"
              value={chargeAmount}
              onChange={e => setChargeAmount(Number(e.target.value))}
              required
            />
          </FormField>

          <div className="p-3 rounded-xl bg-ivory dark:bg-primary-950/60 border border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-400">
            <span>Applicable Monaco VAT 10%: </span>
            <strong className="text-primary dark:text-white font-mono">${(chargeAmount * 0.1).toFixed(2)}</strong>
            <span className="block mt-1">Total added to balance: <strong className="text-accent font-serif">${(chargeAmount * 1.1).toFixed(2)}</strong></span>
          </div>

          <ModalFooter
            onCancel={() => setIsAddChargeModalOpen(false)}
            confirmText="Post Charge to Folio"
            confirmVariant="primary"
            isLoading={isSubmitting}
          />
        </form>
      </Modal>

      {/* Settle Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Settle Folio Outstanding Balance"
        subtitle={`Total Due: $${selectedFolio?.balanceDue?.toLocaleString()} for ${selectedFolio?.guestName}`}
        maxWidth="md"
      >
        <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
          <FormField label="Payment Tender Method" required>
            <Select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="Credit Card">Encrypted Credit Card (Stripe Terminal)</option>
              <option value="Wire Transfer">SWIFT Direct Bank Transfer</option>
              <option value="Cash">Front Desk Cash Settlement</option>
              <option value="Crypto">Sovereign Crypto Vault</option>
            </Select>
          </FormField>

          <FormField label="Settlement Amount ($ USD)" required>
            <Input
              type="number"
              min="1"
              max={selectedFolio?.balanceDue || 999999}
              value={paymentAmount}
              onChange={e => setPaymentAmount(Number(e.target.value))}
              required
            />
          </FormField>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <span>Remaining balance after settlement: </span>
            <strong className="font-serif">${Math.max(0, (selectedFolio?.balanceDue || 0) - paymentAmount).toLocaleString()}</strong>
          </div>

          <ModalFooter
            onCancel={() => setIsPaymentModalOpen(false)}
            confirmText="Process Payment"
            confirmVariant="primary"
            isLoading={isSubmitting}
          />
        </form>
      </Modal>

      {/* Add / Edit GL Account Modal */}
      <Modal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        title={editingAccount ? `Edit GL Account ${editingAccount.code}` : 'Register New General Ledger Account'}
        subtitle="Chart of Accounts configuration according to standard Monaco luxury hospitality ledger."
        maxWidth="md"
      >
        <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Account Code" required>
              <Input
                type="text"
                value={accCode}
                onChange={e => setAccCode(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Classification" required>
              <Select
                value={accType}
                onChange={e => setAccType(e.target.value)}
              >
                <option value="Asset">Asset (Debit Normal)</option>
                <option value="Liability">Liability (Credit Normal)</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue (Credit Normal)</option>
                <option value="Expense">Expense (Debit Normal)</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Account Description" required>
            <Input
              type="text"
              placeholder="e.g. Monaco Central Treasury Account"
              value={accName}
              onChange={e => setAccName(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Initial Balance ($ USD)" required>
              <Input
                type="number"
                value={accBalance}
                onChange={e => setAccBalance(Number(e.target.value))}
                required
              />
            </FormField>

            <FormField label="Account Status" required>
              <Select
                value={accStatus}
                onChange={e => setAccStatus(e.target.value)}
              >
                <option value="active">Active Operational</option>
                <option value="inactive">Suspended / Inactive</option>
              </Select>
            </FormField>
          </div>

          <ModalFooter
            onCancel={() => setIsAddAccountModalOpen(false)}
            confirmText={editingAccount ? 'Save Changes' : 'Register Account'}
            confirmVariant="primary"
            isLoading={isSubmitting}
          />
        </form>
      </Modal>

      {/* Folio View Statement Modal */}
      <Modal
        isOpen={selectedFolio !== null}
        onClose={() => setSelectedFolio(null)}
        title={`Official Guest Folio Statement — ${selectedFolio?.bookingCode}`}
        subtitle={`Resident: ${selectedFolio?.guestName} • Suite ${selectedFolio?.roomNumber}`}
        maxWidth="lg"
      >
        {selectedFolio && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-950/60 border border-border/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Status</span>
                <StatusBadge status={selectedFolio.status} size="sm" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Gross Charges</span>
                <span className="font-serif font-bold text-primary dark:text-white">${selectedFolio.grandTotal?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Amount Settled</span>
                <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400">${selectedFolio.totalPaid?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Balance Outstanding</span>
                <span className="font-serif font-bold text-rose-600 dark:text-rose-400">${selectedFolio.balanceDue?.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h5 className="font-serif font-bold text-sm text-primary dark:text-white mb-2">Itemized Ledger Postings</h5>
              <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory/80 dark:bg-primary-900/40 text-[10px] font-mono uppercase text-charcoal-muted">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Tax (10%)</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 dark:divide-white/5">
                    {selectedFolio.charges?.map((c, i) => (
                      <tr key={i} className="hover:bg-white/40 dark:hover:bg-primary-900/20">
                        <td className="py-2.5 px-3 font-mono">{c.date}</td>
                        <td className="py-2.5 px-3 capitalize font-semibold text-accent">{c.category}</td>
                        <td className="py-2.5 px-3 text-primary dark:text-gray-200">{c.description}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-charcoal-muted">${c.taxAmount?.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-serif font-bold text-primary dark:text-white">${c.totalAmount?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setSelectedFolio(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Close Statement
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={selectedInvoice !== null}
        onClose={() => setSelectedInvoice(null)}
        title={`Institutional Invoice #${selectedInvoice?.invoiceNumber}`}
        subtitle={`Issued to: ${selectedInvoice?.guestName} • Due: ${selectedInvoice?.dueDate}`}
        maxWidth="md"
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Invoice Date:</span>
                <span className="font-mono">{selectedInvoice.issueDate || selectedInvoice.issuedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Subtotal:</span>
                <span className="font-serif">${selectedInvoice.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Monaco VAT (10%):</span>
                <span className="font-serif">${selectedInvoice.taxAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-border/60 dark:border-white/10 pt-2">
                <span>Grand Total:</span>
                <span className="font-serif text-accent">${selectedInvoice.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl btn-secondary-3d text-xs font-semibold"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlatformRevenuePage;

