import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  Building,
  Save,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AddGLAccountPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { chartOfAccounts = [], addChartOfAccount, updateChartOfAccount } = useERP();

  const existingAccount = id ? chartOfAccounts.find(a => a.id === id || a.code === id) : null;

  const [accCode, setAccCode] = useState(existingAccount?.code || `10${Math.floor(100 + Math.random() * 900)}`);
  const [accName, setAccName] = useState(existingAccount?.name || '');
  const [accType, setAccType] = useState(existingAccount?.type || 'Asset');
  const [accCategory, setAccCategory] = useState(existingAccount?.category || 'Operating Accounts');
  const [accBalance, setAccBalance] = useState(existingAccount?.balance || 25000);
  const [accStatus, setAccStatus] = useState(existingAccount?.status || 'active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingAccount) {
      setAccCode(existingAccount.code || '');
      setAccName(existingAccount.name || '');
      setAccType(existingAccount.type || 'Asset');
      setAccCategory(existingAccount.category || 'Operating Accounts');
      setAccBalance(existingAccount.balance || 0);
      setAccStatus(existingAccount.status || 'active');
    }
  }, [existingAccount]);

  const validate = () => {
    const errs = {};
    if (!accCode.trim()) errs.code = 'Account code is required';
    if (!accName.trim()) errs.name = 'Account description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 450));

      const accountData = {
        code: accCode.trim(),
        name: accName.trim(),
        type: accType,
        category: accCategory,
        balance: Number(accBalance) || 0,
        currency: 'USD',
        status: accStatus,
        isActive: accStatus === 'active',
        isReconciled: true,
      };

      if (isEditMode && existingAccount) {
        updateChartOfAccount(existingAccount.id || existingAccount.code, accountData);
      } else {
        addChartOfAccount(accountData);
      }

      showToast(
        isEditMode ? 'GL Account Updated' : 'GL Account Registered',
        `Account ${accCode} (${accName}) saved to General Ledger.`,
        'success'
      );
      navigate('/super-admin/billing');
    } catch {
      showToast('Error', 'Failed to save GL account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Billing & General Ledger</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <Building className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {isEditMode ? `Edit GL Account: ${accCode}` : 'Register New General Ledger Account'}
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Configure institutional Chart of Accounts following standard Monaco luxury hospitality ledgers.
          </p>
        </div>
      </div>

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
              <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Account Classification & Details
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Official financial code, ledger category and normal balance side.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Account Code" required error={errors.code}>
                <Input
                  type="text"
                  placeholder="e.g. 10100"
                  value={accCode}
                  onChange={e => {
                    setAccCode(e.target.value);
                    if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                  }}
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

            <FormField label="Account Description" required error={errors.name}>
              <Input
                type="text"
                placeholder="e.g. Monaco Central Treasury Account"
                value={accName}
                onChange={e => {
                  setAccName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.03] border border-border/70 dark:border-white/10 text-xs space-y-1.5 text-charcoal-muted">
              <p className="font-semibold text-primary dark:text-white flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                Sovereign Accounting Compliance
              </p>
              <p>
                All registered accounts are continuously validated against standard double-entry ledger audits and currency exchange buffers.
              </p>
            </div>
          </div>
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Ledger Preview
            </span>

            <div>
              <span className="font-mono text-xs font-bold text-accent">{accCode || '10XXX'}</span>
              <h4 className="font-serif font-bold text-lg text-primary dark:text-white mt-0.5">
                {accName || 'Account Description'}
              </h4>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/25">
                {accType}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-center">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Book Balance</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">
                ${Number(accBalance || 0).toLocaleString()}
                <span className="text-xs font-sans text-charcoal-muted font-normal"> USD</span>
              </p>
              <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Status: {accStatus === 'active' ? 'Operational' : 'Suspended'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/super-admin/billing')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                type="submit"
                loading={isSubmitting}
                icon={Save}
                className="flex-1"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGLAccountPage;

