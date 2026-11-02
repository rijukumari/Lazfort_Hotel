import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  RotateCcw,
  Download,
  Calendar,
  Scale,
  FileText,
  AlertCircle,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FinanceNavTabs,
  JournalStatusBadge,
  DeleteConfirmationDialog
} from '../../../components/finance';

export const JournalEntriesPage = () => {
  const {
    journalEntries = [],
    chartOfAccounts = [],
    createJournalEntry,
    postJournalEntry,
    reverseJournalEntry,
    deleteJournalEntry
  } = useERP();
  const { showToast } = useToast();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dedicated Page State: 'list' | 'create' | 'details'
  const [pageView, setPageView] = useState('list');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Create Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [entryStatus, setEntryStatus] = useState('posted');
  const [lines, setLines] = useState([
    {
      id: 1,
      accountCode: chartOfAccounts[0]?.code || '1010',
      description: 'Debit Operating Account',
      debit: '1500',
      credit: '0',
    },
    {
      id: 2,
      accountCode: chartOfAccounts[1]?.code || '4010',
      description: 'Credit Room Revenue',
      debit: '0',
      credit: '1500',
    },
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;
  const difference = Math.abs(totalDebit - totalCredit);

  const startCreate = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setReference(`JV-MAN-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription('');
    setEntryStatus('posted');
    setLines([
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
    setErrorMsg('');
    setPageView('create');
  };

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
    if (lines.length <= 2) return;
    setLines(lines.filter(l => l.id !== id));
  };

  const handleLineChange = (id, field, value) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Voucher narration / description is required.');
      return;
    }
    if (!isBalanced) {
      setErrorMsg(`Journal entry is unbalanced. Debit/Credit difference is $${difference}.`);
      return;
    }

    createJournalEntry({
      date,
      reference: reference || `JV-MAN-${Date.now()}`,
      description: description.trim(),
      status: entryStatus,
      totalDebit,
      totalCredit,
      postedBy: 'Chief Financial Controller',
      lines: lines.map(l => ({
        accountCode: l.accountCode,
        accountName: chartOfAccounts.find(a => a.code === l.accountCode)?.name || 'General Ledger Account',
        description: l.description,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      })),
    });

    showToast('Journal Voucher Recorded', `Voucher recorded with $${totalDebit} volume.`, 'success');
    setPageView('list');
  };

  // Filtered Journal Entries
  const filteredEntries = useMemo(() => {
    return journalEntries.filter((je) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        je.entryNumber?.toLowerCase().includes(q) ||
        je.reference?.toLowerCase().includes(q) ||
        je.description?.toLowerCase().includes(q) ||
        je.postedBy?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || je.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [journalEntries, searchQuery, statusFilter]);

  // Statistics
  const totalVolume = journalEntries.reduce((s, j) => s + (Number(j.totalDebit) || 0), 0);
  const postedCount = journalEntries.filter((j) => j.status === 'posted').length;
  const draftCount = journalEntries.filter((j) => j.status === 'draft' || j.status === 'approved').length;
  const reversedCount = journalEntries.filter((j) => j.status === 'reversed').length;

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      deleteJournalEntry(entryToDelete.id);
      showToast('Entry Deleted', `Journal voucher ${entryToDelete.entryNumber} removed.`, 'info');
      setEntryToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handlePostEntry = (id) => {
    postJournalEntry(id);
    showToast('Journal Posted', 'Entry officially posted to General Ledger.', 'success');
  };

  const handleReverseEntry = (id) => {
    reverseJournalEntry(id, 'Reversal commanded by Financial Controller');
    showToast('Journal Reversed', 'Contra-entry posted to neutralize balances.', 'info');
  };

  // Dedicated View: Create Double-Entry Journal
  if (pageView === 'create') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Journal Entries</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 dark:border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                  Post Double-Entry Journal Voucher
                </h2>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Record dual-aspect audit transactions with strict debit/credit balance verification.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                isBalanced
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
              }`}>
                {isBalanced ? 'Balanced Voucher' : `Out of Balance: $${difference}`}
              </span>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Accounting Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Voucher / Batch Reference
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="e.g. JV-MAN-2026-10"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Voucher Status
                </label>
                <select
                  value={entryStatus}
                  onChange={e => setEntryStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="posted">Post Directly to General Ledger</option>
                  <option value="draft">Save as Unposted Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Voucher Narration / Audit Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Daily Michelin restaurant revenue transfer to Operating Treasury"
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                  Double-Entry Line Items
                </h4>
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="px-3 py-1.5 rounded-xl border border-accent/40 text-accent hover:bg-accent/10 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden divide-y divide-border/60 dark:divide-white/5">
                {lines.map((line, idx) => (
                  <div key={line.id} className="p-3.5 grid grid-cols-12 gap-3 items-center bg-white/40 dark:bg-primary-950/40 text-xs">
                    <div className="col-span-12 sm:col-span-4">
                      <select
                        value={line.accountCode}
                        onChange={e => handleLineChange(line.id, 'accountCode', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
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
                        placeholder="Line description"
                        className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-1.5">
                      <input
                        type="number"
                        value={line.debit}
                        onChange={e => handleLineChange(line.id, 'debit', e.target.value)}
                        placeholder="Debit"
                        className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono text-right"
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-1.5">
                      <input
                        type="number"
                        value={line.credit}
                        onChange={e => handleLineChange(line.id, 'credit', e.target.value)}
                        placeholder="Credit"
                        className="w-full px-3 py-2 rounded-xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono text-right"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1 text-right">
                      {lines.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/60 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-primary dark:text-white uppercase">Voucher Total</span>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-charcoal-muted mr-2">Total Debits:</span>
                    <span className="font-bold text-accent">${totalDebit.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted mr-2">Total Credits:</span>
                    <span className="font-bold text-accent">${totalCredit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
            )}

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
                disabled={!isBalanced}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-gold flex items-center gap-2 transition-all ${
                  isBalanced
                    ? 'bg-accent hover:opacity-95 text-primary-950 cursor-pointer'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-50'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save Journal Voucher</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dedicated View: Journal Details Dossier
  if (pageView === 'details' && selectedEntry) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Journal Entries</span>
          </button>

          <div className="flex items-center gap-2">
            {selectedEntry.status === 'draft' && (
              <button
                onClick={() => {
                  handlePostEntry(selectedEntry.id);
                  setPageView('list');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
              >
                Post to General Ledger
              </button>
            )}
            {selectedEntry.status === 'posted' && (
              <button
                onClick={() => {
                  handleReverseEntry(selectedEntry.id);
                  setPageView('list');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm"
              >
                Reverse Voucher
              </button>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-lg">
                    {selectedEntry.entryNumber}
                  </span>
                  <JournalStatusBadge status={selectedEntry.status} size="sm" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                  {selectedEntry.description}
                </h2>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Ref: {selectedEntry.reference || 'Manual Entry'} • Accounting Date: {selectedEntry.date} • Officer: {selectedEntry.postedBy}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">Voucher Balanced Total</p>
              <p className="font-serif font-bold text-3xl text-accent mt-0.5">
                ${(selectedEntry.totalDebit || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
              Ledger Postings Breakdown
            </h4>
            <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/60 dark:bg-primary-950/40 border-b border-border/80 dark:border-white/10 text-[11px] uppercase tracking-wider text-charcoal-muted">
                  <tr>
                    <th className="py-2.5 px-4">Account Code</th>
                    <th className="py-2.5 px-4">Account Title</th>
                    <th className="py-2.5 px-4">Line Description</th>
                    <th className="py-2.5 px-4 text-right">Debit ($)</th>
                    <th className="py-2.5 px-4 text-right">Credit ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {selectedEntry.lines?.map((line, idx) => (
                    <tr key={idx} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30">
                      <td className="py-2.5 px-4 font-mono font-bold text-accent">{line.accountCode}</td>
                      <td className="py-2.5 px-4 font-semibold text-primary dark:text-white">{line.accountName || 'G/L Account'}</td>
                      <td className="py-2.5 px-4 text-charcoal-muted">{line.description || selectedEntry.description}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-500">
                        {line.debit > 0 ? `$${line.debit.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-500">
                        {line.credit > 0 ? `$${line.credit.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
              Journal Entries & Dual-Aspect Vouchers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Audit Journal
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Double-entry bookkeeping vouchers, automated guest folio postings, and financial audits.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>



      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Total Volume</p>
            <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
              ${totalVolume.toLocaleString()}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">Dual-Sided Turnover</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Posted Vouchers</p>
            <p className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
              {postedCount}
            </p>
            <p className="text-[10px] text-emerald-600 font-mono mt-0.5">Finalized in Ledger</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Unposted Drafts</p>
            <p className="font-serif font-bold text-2xl text-amber-500 mt-1">
              {draftCount}
            </p>
            <p className="text-[10px] text-amber-500 font-mono mt-0.5">Pending Authorization</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Contra Reversals</p>
            <p className="font-serif font-bold text-2xl text-rose-500 mt-1">
              {reversedCount}
            </p>
            <p className="text-[10px] text-rose-500 font-mono mt-0.5">Nullified Accounting Entries</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
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
              placeholder="Search by voucher #, reference, or description..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
            {['all', 'posted', 'draft', 'reversed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                  statusFilter === st
                    ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                    : 'bg-ivory/80 dark:bg-primary-950/40 border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent/40'
                }`}
              >
                {st === 'all' ? 'All Vouchers' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredEntries.length}</span> of {journalEntries.length} Vouchers
          </p>
          {(statusFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-950/80 text-[11px] uppercase tracking-wider text-charcoal dark:text-gray-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Entry Ref</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Date</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Voucher Narration</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Officer</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Debit ($)</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Credit ($)</th>
                  <th className="py-3.5 px-4 text-center text-charcoal dark:text-gray-200">Status</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredEntries.map((je) => (
                  <tr
                    key={je.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {je.entryNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {je.date}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-primary dark:text-white truncate">
                        {je.description}
                      </p>
                      <p className="text-[10px] text-charcoal-muted font-mono truncate">
                        Ref: {je.reference || 'Automated'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted text-[11px]">
                      {je.postedBy || 'System Controller'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-blue-500">
                      ${(je.totalDebit || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-500">
                      ${(je.totalCredit || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <JournalStatusBadge status={je.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedEntry(je);
                            setPageView('details');
                          }}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
                          title="View Voucher Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {je.status === 'draft' && (
                          <button
                            onClick={() => handlePostEntry(je.id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/15 transition-colors"
                            title="Post Voucher to G/L"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {je.status === 'posted' && (
                          <button
                            onClick={() => handleReverseEntry(je.id)}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/15 transition-colors"
                            title="Reverse Voucher"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        {je.status !== 'posted' && (
                          <button
                            onClick={() => {
                              setEntryToDelete(je);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                            title="Purge Draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-muted dark:text-gray-400">
            <BookOpen className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No Journal Entries Found
            </p>
            <p className="text-xs mt-1">Record a new double-entry voucher or adjust filter options.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEntryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Purge Draft Journal Voucher"
        itemName={entryToDelete?.entryNumber || ''}
        message="Are you certain you wish to delete this draft journal entry? Unposted drafts can be deleted safely."
      />
    </div>
  );
};

export default JournalEntriesPage;
