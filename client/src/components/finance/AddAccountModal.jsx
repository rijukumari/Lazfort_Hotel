import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Landmark, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const ACCOUNT_TYPES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

const CATEGORY_MAP = {
  Asset: ['Current Assets', 'Cash & Cash Equivalents', 'Receivables', 'Inventories', 'Fixed Capital Assets', 'Prepaid Expenses'],
  Liability: ['Current Liabilities', 'Accounts Payable', 'Guest Security Deposits', 'Accrued Taxes Payable', 'Long-term Debt'],
  Equity: ['Retained Earnings', 'Shareholder Capital', 'Partner Equity', 'Treasury Reserves'],
  Revenue: ['Operating Revenue', 'Room Accommodation Revenue', 'Food & Beverage Sales', 'Spa & Wellness Revenue', 'Concierge & Marina Services'],
  Expense: ['Operating Expenses', 'Direct Operating Costs (COGS)', 'Payroll & Executive Compensation', 'Utilities & Thermal Power', 'Maintenance & Repairs', 'Marketing & Representation'],
};

export const AddAccountModal = ({ isOpen, onClose, accountToEdit = null, onSuccess }) => {
  const { addChartOfAccount, updateChartOfAccount } = useERP();
  const isEditing = Boolean(accountToEdit);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Asset',
    category: 'Current Assets',
    parentAccount: '',
    openingBalance: '0',
    debitBalance: '0',
    creditBalance: '0',
    currency: 'EUR',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (accountToEdit) {
      setFormData({
        code: accountToEdit.code || '',
        name: accountToEdit.name || '',
        type: accountToEdit.type || 'Asset',
        category: accountToEdit.category || 'Current Assets',
        parentAccount: accountToEdit.parentAccount || '',
        openingBalance: (accountToEdit.openingBalance || 0).toString(),
        debitBalance: (accountToEdit.debitBalance || 0).toString(),
        creditBalance: (accountToEdit.creditBalance || 0).toString(),
        currency: accountToEdit.currency || 'EUR',
        description: accountToEdit.description || '',
        isActive: accountToEdit.isActive !== undefined ? accountToEdit.isActive : true,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        type: 'Asset',
        category: 'Current Assets',
        parentAccount: '',
        openingBalance: '0',
        debitBalance: '0',
        creditBalance: '0',
        currency: 'EUR',
        description: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [accountToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Account Code is required (e.g. 1010)';
    if (!formData.name.trim()) errs.name = 'Account Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTypeChange = (newType) => {
    setFormData({
      ...formData,
      type: newType,
      category: CATEGORY_MAP[newType]?.[0] || 'General',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const openBal = Number(formData.openingBalance) || 0;
    const debitBal = Number(formData.debitBalance) || 0;
    const creditBal = Number(formData.creditBalance) || 0;
    const isDebitNormal = formData.type === 'Asset' || formData.type === 'Expense';
    const balance = isDebitNormal
      ? openBal + debitBal - creditBal
      : openBal + creditBal - debitBal;

    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      type: formData.type,
      category: formData.category,
      parentAccount: formData.parentAccount.trim() || null,
      openingBalance: openBal,
      debitBalance: debitBal,
      creditBalance: creditBal,
      balance,
      currency: formData.currency,
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    if (isEditing && accountToEdit?.id) {
      updateChartOfAccount(accountToEdit.id, payload);
    } else {
      addChartOfAccount(payload);
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                {isEditing ? 'Modify General Ledger Account' : 'Register New G/L Account'}
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Chart of Accounts Hierarchy & Financial Balance Sheet Structure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Account Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. 1010"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.code ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono font-bold`}
              />
              {errors.code && <p className="text-[10px] text-rose-500 mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Account Classification / Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/40 dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Account Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. UBS Sovereign Operating Vault"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.name ? 'border-rose-500' : 'border-border dark:border-white/10'
              } bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Parent Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/40 dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
              >
                {(CATEGORY_MAP[formData.type] || ['General']).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Opening Balance ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Account Description & Purpose
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Primary treasury account for guest folios and banquet settlements..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Commit Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;

