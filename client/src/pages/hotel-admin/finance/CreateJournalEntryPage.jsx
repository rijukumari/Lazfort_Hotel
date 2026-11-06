import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Scale
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { PageHeader } from '../../../components/ui';

export const CreateJournalEntryPage = () => {
  const navigate = useNavigate();
  const { chartOfAccounts = [], createJournalEntry } = useERP();
  const { showToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft'); // 'draft' or 'posted'

  const [lines, setLines] = useState([
    {
      id: 1,
      accountCode: chartOfAccounts[0]?.code || '1010',
      description: 'Debit Line Item',
      debit: '1000',
      credit: '0',
    },
    {
      id: 2,
      accountCode: chartOfAccounts[1]?.code || '4010',
      description: 'Credit Balancing Line',
      debit: '0',
      credit: '1000',
    },
  ]);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;
  const difference = Math.abs(totalDebit - totalCredit);

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        id: Date.now(),
        accountCode: chartOfAccounts[0]?.code || '1010',
        description: '',
        debit: '0',
        credit: '0',
      },
    ]);
  };

  const handleRemoveLine = (id) => {
    if (lines.length <= 2) {
      showToast('Error', 'A double-entry voucher must have at least 2 ledger lines.', 'error');
      return;
    }
    setLines(lines.filter(l => l.id !== id));
  };

  const handleLineChange = (id, field, value) => {
    setLines(
      lines.map(l => {
        if (l.id !== id) return l;

        if (field === 'debit' && Number(value) > 0) {
          return { ...l, debit: value, credit: '0' };
        } else if (field === 'credit' && Number(value) > 0) {
          return { ...l, credit: value, debit: '0' };
        }
        return { ...l, [field]: value };
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!description.trim()) {
      setErrorMsg('Voucher description/purpose is required.');
      return;
    }

    if (!isBalanced) {
      setErrorMsg(`Voucher is out of balance by $${difference.toFixed(2)}. Debits must exactly equal Credits.`);
      return;
    }

    setIsSubmitting(true);

    const formattedLines = lines.map(l => {
      const matchedAcc = chartOfAccounts.find(a => a.code === l.accountCode);
      return {
        accountCode: l.accountCode,
        accountName: matchedAcc?.name || 'General Ledger Account',
        description: l.description || description,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      };
    });

    const res = createJournalEntry({
      date,
      reference: reference || `JV-MAN-${Date.now().toString().slice(-4)}`,
      description,
      status,
      lines: formattedLines,
    });

    setIsSubmitting(false);

    if (res?.success) {
      showToast('Voucher Created', `Journal voucher ${res.entry?.entryNumber || ''} saved successfully.`, 'success');
      navigate('/hotel-admin/finance/journals');
    } else {
      setErrorMsg(res?.message || 'Failed to save voucher.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Bar with Back Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-border/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => navigate('/hotel-admin/finance/journals')}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Journal Vouchers</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/25">
          <BookOpen className="w-3.5 h-3.5" />
          Double-Entry Accounting Protocol
        </span>
      </div>

      {/* Main Full-Page Card Form matching modal UI in the screenshot */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c121d] border border-accent/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl text-primary dark:text-white tracking-wide">
                Create Double-Entry Journal Voucher
              </h1>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                General Ledger Posting with Real-Time Debit & Credit Balance Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${
                isBalanced
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
              }`}
            >
              {isBalanced ? 'Balanced Voucher' : `Out of Balance: $${difference.toFixed(2)}`}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row: Date, Reference, Target Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Posting Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Reference / Voucher Ref
              </label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="e.g. JV-ADJ-2026-09"
                className="w-full px-4 py-2.5 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Target Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="draft">Save as Draft (Review Later)</option>
                <option value="posted">Post Directly to General Ledger</option>
              </select>
            </div>
          </div>

          {/* Narration / Purpose */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Entry Description / Purpose <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Reclassification of luxury banquet champagne surcharge to F&B ledger"
              className="w-full px-4 py-2.5 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              required
            />
          </div>

          {/* Accounting Debits & Credits Schedule */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-white font-serif">
                <Scale className="w-4 h-4 text-accent" />
                <span>Accounting Debits & Credits Schedule</span>
              </div>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1.5 rounded-xl border border-accent/40 text-accent hover:bg-accent/15 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ledger Line</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden divide-y divide-border/60 dark:divide-white/5 bg-white/40 dark:bg-primary-950/40">
              {/* Header */}
              <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-gray-400 bg-ivory/50 dark:bg-primary-900/40">
                <div className="col-span-12 sm:col-span-4">G/L Account</div>
                <div className="col-span-12 sm:col-span-4">Line Memo</div>
                <div className="col-span-5 sm:col-span-1.5 text-right">Debit ($)</div>
                <div className="col-span-5 sm:col-span-1.5 text-right">Credit ($)</div>
                <div className="col-span-2 sm:col-span-1 text-center">Action</div>
              </div>

              {/* Rows */}
              {lines.map((line) => (
                <div key={line.id} className="p-3 grid grid-cols-12 gap-3 items-center text-xs">
                  <div className="col-span-12 sm:col-span-4">
                    <select
                      value={line.accountCode}
                      onChange={e => handleLineChange(line.id, 'accountCode', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono cursor-pointer"
                    >
                      {chartOfAccounts.map(acc => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} - {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <input
                      type="text"
                      value={line.description}
                      onChange={e => handleLineChange(line.id, 'description', e.target.value)}
                      placeholder="Line memo"
                      className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="col-span-5 sm:col-span-1.5">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.debit}
                      onChange={e => handleLineChange(line.id, 'debit', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono text-right font-bold text-blue-500"
                    />
                  </div>

                  <div className="col-span-5 sm:col-span-1.5">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.credit}
                      onChange={e => handleLineChange(line.id, 'credit', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono text-right font-bold text-emerald-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 text-center">
                    {lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(line.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-500 transition-colors cursor-pointer"
                        title="Remove Line"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/60 dark:border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-primary dark:text-white uppercase tracking-wider">TOTALS:</span>
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-charcoal-muted mr-2">Total Debits:</span>
                  <span className="font-bold text-accent text-sm">${totalDebit.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted mr-2">Total Credits:</span>
                  <span className="font-bold text-accent text-sm">${totalCredit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Balance verification indicator banner matching screenshot */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                isBalanced
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span className="font-medium">
                  {isBalanced
                    ? 'Double-entry rule satisfied: Debits equal Credits in equilibrium.'
                    : `Out of balance: Debits and Credits must be equal before saving.`}
                </span>
              </div>
              <span className="font-mono font-bold">
                Δ ${difference.toFixed(2)}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate('/hotel-admin/finance/journals')}
              className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isBalanced || isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-gold flex items-center gap-2 transition-all ${
                isBalanced && !isSubmitting
                  ? 'bg-accent hover:opacity-95 text-primary-950 cursor-pointer'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Voucher...' : 'Save & Commit Journal Voucher'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournalEntryPage;

