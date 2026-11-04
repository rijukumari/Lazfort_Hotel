import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Scale
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const CreateJournalModal = ({ isOpen, onClose, onSuccess }) => {
  const { chartOfAccounts = [], createJournalEntry } = useERP();

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

  if (!isOpen) return null;

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
      setErrorMsg('A journal entry requires at least two lines (double-entry accounting).');
      return;
    }
    setLines(lines.filter((l) => l.id !== id));
    setErrorMsg('');
  };

  const handleLineChange = (id, field, value) => {
    setLines(
      lines.map((l) => {
        if (l.id === id) {
          const updated = { ...l, [field]: value };
          if (field === 'debit' && Number(value) > 0) updated.credit = '0';
          if (field === 'credit' && Number(value) > 0) updated.debit = '0';
          return updated;
        }
        return l;
      })
    );
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please provide an entry description.');
      return;
    }
    if (!isBalanced) {
      setErrorMsg(`Total Debit ($${totalDebit.toFixed(2)}) must equal Total Credit ($${totalCredit.toFixed(2)}). Variance: $${difference.toFixed(2)}.`);
      return;
    }

    const formattedLines = lines.map((l) => {
      const acc = chartOfAccounts.find((a) => a.code === l.accountCode);
      return {
        accountId: acc?.id || `coa-${l.accountCode}`,
        accountCode: l.accountCode,
        accountName: acc?.name || 'General Ledger Account',
        description: l.description.trim() || description.trim(),
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      };
    });

    const res = createJournalEntry({
      date,
      reference: reference.trim() || `Manual Journal Voucher`,
      description: description.trim(),
      lines: formattedLines,
      status, // 'draft' or 'posted'
    });

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Create Double-Entry Journal Voucher
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                General Ledger Posting with Real-Time Debit & Credit Balance Verification
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
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Header Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Posting Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Reference / Voucher Ref
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. JV-ADJ-2026-09"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Target Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
              >
                <option value="draft" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Save as Draft (Review Later)</option>
                <option value="posted" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Post Immediately to General Ledger</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Entry Description / Purpose <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Reclassification of luxury banquet champagne surcharge to F&B ledger"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Dynamic Multi-Line Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-primary dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-accent" />
                <span>Accounting Debits & Credits Schedule</span>
              </h4>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-accent/15 text-accent hover:bg-accent/25 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ledger Line</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/80 dark:bg-primary-800/40 text-[10px] uppercase font-semibold text-charcoal-muted dark:text-gray-300 border-b border-border/60 dark:border-white/10">
                  <tr>
                    <th className="py-2.5 px-3 text-charcoal-muted dark:text-gray-300">G/L Account</th>
                    <th className="py-2.5 px-3 text-charcoal-muted dark:text-gray-300">Line Memo</th>
                    <th className="py-2.5 px-3 text-right text-charcoal-muted dark:text-gray-300">Debit ($)</th>
                    <th className="py-2.5 px-3 text-right text-charcoal-muted dark:text-gray-300">Credit ($)</th>
                    <th className="py-2.5 px-3 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 dark:divide-white/5">
                  {lines.map((line) => (
                    <tr key={line.id} className="hover:bg-ivory/30 dark:hover:bg-primary-800/30">
                      <td className="py-2.5 px-3 w-56">
                        <select
                          value={line.accountCode}
                          onChange={(e) => handleLineChange(line.id, 'accountCode', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                        >
                          {chartOfAccounts.map((a) => (
                            <option key={a.id || a.code} value={a.code} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                              {a.code} - {a.name} ({a.type})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => handleLineChange(line.id, 'description', e.target.value)}
                          placeholder="Optional line memo"
                          className="w-full px-2 py-1.5 rounded-lg border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
                        />
                      </td>

                      <td className="py-2.5 px-3 w-28 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={line.debit}
                          onChange={(e) => handleLineChange(line.id, 'debit', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs text-right font-mono text-primary dark:text-white focus:outline-none focus:border-accent font-semibold"
                        />
                      </td>

                      <td className="py-2.5 px-3 w-28 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={line.credit}
                          onChange={(e) => handleLineChange(line.id, 'credit', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs text-right font-mono text-primary dark:text-white focus:outline-none focus:border-accent font-semibold"
                        />
                      </td>

                      <td className="py-2.5 px-3 w-10 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-500/15 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-ivory/60 dark:bg-primary-950/80 font-bold border-t border-border/80 dark:border-white/10">
                  <tr>
                    <td colSpan={2} className="py-3 px-3 text-right text-primary dark:text-white uppercase tracking-wider text-[11px]">
                      Totals:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      ${totalDebit.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                      ${totalCredit.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Real-time Balanced State Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
              isBalanced
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              )}
              <span className="font-semibold">
                {isBalanced
                  ? 'Double-entry rule satisfied: Debits equal Credits in equilibrium.'
                  : `Out of balance! Debit and Credit variance: $${difference.toFixed(2)}`}
              </span>
            </div>
            <span className="font-mono font-bold">
              Δ ${difference.toFixed(2)}
            </span>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 font-semibold text-center">{errorMsg}</p>
          )}

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
              disabled={!isBalanced}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs btn-3d shadow-gold flex items-center gap-2 ${
                isBalanced
                  ? 'gold-gradient-bg text-primary-900 cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{status === 'posted' ? 'Post Journal Entry' : 'Save Draft Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournalModal;

