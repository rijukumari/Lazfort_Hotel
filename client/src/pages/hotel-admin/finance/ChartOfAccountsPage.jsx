import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowLeft,
  Save,
  Tag,
  DollarSign
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FinanceNavTabs,
  AccountTypeBadge,
  DeleteConfirmationDialog
} from '../../../components/finance';

const ACCOUNT_TYPES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

const CATEGORY_MAP = {
  Asset: ['Current Assets', 'Cash & Cash Equivalents', 'Receivables', 'Inventories', 'Fixed Capital Assets', 'Prepaid Expenses'],
  Liability: ['Current Liabilities', 'Accounts Payable', 'Guest Security Deposits', 'Accrued Taxes Payable', 'Long-term Debt'],
  Equity: ['Retained Earnings', 'Shareholder Capital', 'Partner Equity', 'Treasury Reserves'],
  Revenue: ['Operating Revenue', 'Room Accommodation Revenue', 'Food & Beverage Sales', 'Spa & Wellness Revenue', 'Concierge & Marina Services'],
  Expense: ['Operating Expenses', 'Direct Operating Costs (COGS)', 'Payroll & Executive Compensation', 'Utilities & Thermal Power', 'Maintenance & Repairs', 'Marketing & Representation'],
};

export const ChartOfAccountsPage = () => {
  const { chartOfAccounts = [], addChartOfAccount, updateChartOfAccount, deleteChartOfAccount, toggleAccountStatus } = useERP();
  const { showToast } = useToast();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Dedicated Page State: 'list' | 'create' | 'edit' | 'details'
  const [pageView, setPageView] = useState('list');
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Asset',
    category: 'Current Assets',
    parentAccount: '',
    openingBalance: '0',
    debitBalance: '0',
    creditBalance: '0',
    currency: 'USD',
    description: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const startCreate = () => {
    setAccountToEdit(null);
    setFormData({
      code: '',
      name: '',
      type: 'Asset',
      category: 'Current Assets',
      parentAccount: '',
      openingBalance: '0',
      debitBalance: '0',
      creditBalance: '0',
      currency: 'USD',
      description: '',
      isActive: true,
    });
    setFormErrors({});
    setPageView('create');
  };

  const startEdit = (acc) => {
    setAccountToEdit(acc);
    setFormData({
      code: acc.code || '',
      name: acc.name || '',
      type: acc.type || 'Asset',
      category: acc.category || CATEGORY_MAP[acc.type || 'Asset'][0],
      parentAccount: acc.parentAccount || '',
      openingBalance: (acc.openingBalance || 0).toString(),
      debitBalance: (acc.debitBalance || 0).toString(),
      creditBalance: (acc.creditBalance || 0).toString(),
      currency: acc.currency || 'USD',
      description: acc.description || '',
      isActive: acc.isActive !== undefined ? acc.isActive : true,
    });
    setFormErrors({});
    setPageView('edit');
  };

  const startDetails = (acc) => {
    setSelectedAccount(acc);
    setPageView('details');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Account Code is required';
    if (!formData.name.trim()) errs.name = 'Account Name is required';
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const opening = Number(formData.openingBalance) || 0;
    const debit = Number(formData.debitBalance) || 0;
    const credit = Number(formData.creditBalance) || 0;

    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      type: formData.type,
      category: formData.category,
      parentAccount: formData.parentAccount.trim(),
      openingBalance: opening,
      debitBalance: debit,
      creditBalance: credit,
      balance: opening + debit - credit,
      currency: formData.currency,
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    if (accountToEdit) {
      updateChartOfAccount(accountToEdit.id, payload);
      showToast('Account Updated', `Account ${formData.code} - ${formData.name} updated.`, 'success');
    } else {
      addChartOfAccount(payload);
      showToast('Account Created', `Account ${formData.code} - ${formData.name} registered.`, 'success');
    }
    setPageView('list');
  };

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return chartOfAccounts.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        a.code?.toLowerCase().includes(q) ||
        a.name?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q);

      const matchesType = typeFilter === 'all' || a.type === typeFilter;
      return matchesSearch && matchesType;
    }).sort((a, b) => (a.code || '').localeCompare(b.code || ''));
  }, [chartOfAccounts, searchQuery, typeFilter]);

  // Financial Balances Summary
  const totals = useMemo(() => {
    return chartOfAccounts.reduce(
      (acc, a) => {
        const bal = Number(a.balance) || 0;
        if (a.type === 'Asset') acc.assets += bal;
        if (a.type === 'Liability') acc.liabilities += bal;
        if (a.type === 'Equity') acc.equity += bal;
        if (a.type === 'Revenue') acc.revenue += bal;
        if (a.type === 'Expense') acc.expenses += bal;
        return acc;
      },
      { assets: 0, liabilities: 0, equity: 0, revenue: 0, expenses: 0 }
    );
  }, [chartOfAccounts]);

  const handleToggle = (account) => {
    toggleAccountStatus(account.id);
    showToast(
      'Account Status Changed',
      `Account ${account.code} is now ${account.isActive ? 'Inactive' : 'Active'}.`,
      'info'
    );
  };

  const handleDeleteConfirm = () => {
    if (accountToDelete) {
      deleteChartOfAccount(accountToDelete.id);
      showToast('Account Decommissioned', `Account ${accountToDelete.code} removed.`, 'info');
      setAccountToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Dedicated View: Create & Edit Form
  if (pageView === 'create' || pageView === 'edit') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Chart of Accounts</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                {pageView === 'edit' ? `Configure Account: ${accountToEdit?.code}` : 'Register General Ledger Account'}
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                IFRS luxury hotel chart of accounts taxonomy and audit ledger parameters.
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Account Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. 1010-01"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono font-bold"
                />
                {formErrors.code && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Account Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Treasury Operating Vault Account (UBS Zurich)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Classification Type
                </label>
                <select
                  value={formData.type}
                  onChange={e => {
                    const newType = e.target.value;
                    setFormData({
                      ...formData,
                      type: newType,
                      category: CATEGORY_MAP[newType]?.[0] || 'Current Assets'
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {ACCOUNT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Sub-Category / Division
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {(CATEGORY_MAP[formData.type] || []).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Currency Standard
                </label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CHF">CHF (₣)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Opening Balance
                </label>
                <input
                  type="number"
                  value={formData.openingBalance}
                  onChange={e => setFormData({ ...formData, openingBalance: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Fiscal Debit Balance
                </label>
                <input
                  type="number"
                  value={formData.debitBalance}
                  onChange={e => setFormData({ ...formData, debitBalance: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Fiscal Credit Balance
                </label>
                <input
                  type="number"
                  value={formData.creditBalance}
                  onChange={e => setFormData({ ...formData, creditBalance: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Account Audit & Purpose Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Audit notes, statutory compliance notes, or banking partner specifications..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary dark:text-white">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Active Account in General Ledger</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{pageView === 'edit' ? 'Update Account' : 'Save Account'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dedicated View: Account Details Dossier
  if (pageView === 'details' && selectedAccount) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Chart of Accounts</span>
          </button>
          <button
            onClick={() => startEdit(selectedAccount)}
            className="px-4 py-2 rounded-xl bg-accent text-primary-950 text-xs font-bold shadow-gold flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Account</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-lg">
                    {selectedAccount.code}
                  </span>
                  <AccountTypeBadge type={selectedAccount.type} size="sm" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                  {selectedAccount.name}
                </h2>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Division: {selectedAccount.category} • Base: {selectedAccount.currency || 'USD'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">Current Ledger Balance</p>
              <p className="font-serif font-bold text-3xl text-accent mt-0.5">
                ${(Number(selectedAccount.balance) || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-ivory/50 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 text-xs">
            <div>
              <p className="text-charcoal-muted dark:text-gray-400 font-medium">Opening Balance</p>
              <p className="font-mono font-bold text-primary dark:text-white text-base mt-1">
                ${(Number(selectedAccount.openingBalance) || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-charcoal-muted dark:text-gray-400 font-medium">Total Debits</p>
              <p className="font-mono font-bold text-blue-500 text-base mt-1">
                ${(Number(selectedAccount.debitBalance) || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-charcoal-muted dark:text-gray-400 font-medium">Total Credits</p>
              <p className="font-mono font-bold text-emerald-500 text-base mt-1">
                ${(Number(selectedAccount.creditBalance) || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {selectedAccount.description && (
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-xs space-y-1">
              <span className="font-bold text-accent font-mono uppercase tracking-wider text-[11px]">
                Statutory & Accounting Notes:
              </span>
              <p className="text-primary dark:text-gray-300 leading-relaxed">
                {selectedAccount.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Chart of Accounts (COA)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              IFRS / USALI Ledger
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Hotel general ledger classification: Assets, Liabilities, Equity, Revenue, and Operating Expenses.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add G/L Account</span>
        </button>
      </div>



      {/* Account Type Balances Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-charcoal-muted dark:text-gray-400 uppercase">Total Assets</p>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="font-serif font-bold text-lg text-primary dark:text-white mt-1">
            ${totals.assets.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-charcoal-muted dark:text-gray-400 uppercase">Liabilities</p>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="font-serif font-bold text-lg text-primary dark:text-white mt-1">
            ${totals.liabilities.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-charcoal-muted dark:text-gray-400 uppercase">Equity</p>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <p className="font-serif font-bold text-lg text-primary dark:text-white mt-1">
            ${totals.equity.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-emerald-500 uppercase">Operating Rev</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="font-serif font-bold text-lg text-emerald-500 mt-1">
            ${totals.revenue.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-rose-500 uppercase">Expenses</p>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <p className="font-serif font-bold text-lg text-rose-500 mt-1">
            ${totals.expenses.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code, account title, or category..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
            {['all', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  typeFilter === type
                    ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                    : 'bg-ivory/80 dark:bg-primary-950/40 border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent/40'
                }`}
              >
                {type === 'all' ? 'All Classes' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredAccounts.length}</span> of {chartOfAccounts.length} Accounts
          </p>
          {(typeFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredAccounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-950/80 text-[11px] uppercase tracking-wider text-charcoal dark:text-gray-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Account Code</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Account Title</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Type</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Category</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Debit ($)</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Credit ($)</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Net Balance ($)</th>
                  <th className="py-3.5 px-4 text-center text-charcoal dark:text-gray-200">Status</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {account.code}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                      {account.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <AccountTypeBadge type={account.type} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted dark:text-gray-400 text-[11px]">
                      {account.category}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-charcoal dark:text-gray-300">
                      ${(Number(account.debitBalance) || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-charcoal dark:text-gray-300">
                      ${(Number(account.creditBalance) || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-accent">
                      ${(Number(account.balance) || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggle(account)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                          account.isActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${account.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span>{account.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startDetails(account)}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
                          title="View Account Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => startEdit(account)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/15 transition-colors"
                          title="Edit Account Specification"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setAccountToDelete(account);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                          title="Purge Account"
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
            <Landmark className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No G/L Accounts Found
            </p>
            <p className="text-xs mt-1">Register new chart of accounts or adjust classification filter.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAccountToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Decommission G/L Account"
        itemName={accountToDelete ? `${accountToDelete.code} - ${accountToDelete.name}` : ''}
        message="Are you certain you wish to purge this account from the Chart of Accounts? Historical transactions may be affected."
      />
    </div>
  );
};

export default ChartOfAccountsPage;
