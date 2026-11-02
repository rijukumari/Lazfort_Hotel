import React from 'react';
import {
  X,
  BookOpen,
  Printer,
  RotateCcw,
  CheckCircle2,
  Calendar,
  UserCheck,
  Scale
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const JournalDetailsModal = ({
  isOpen,
  onClose,
  entry = null,
  onPost,
  onReverse
}) => {
  const { approveJournalEntry, postJournalEntry, reverseJournalEntry } = useERP();
  const { showToast } = useToast();

  if (!isOpen || !entry) return null;

  const handleApprove = () => {
    approveJournalEntry(entry.id);
    showToast('Entry Approved', `Journal entry ${entry.entryNumber} verified for general ledger posting.`, 'success');
  };

  const handlePost = () => {
    postJournalEntry(entry.id);
    showToast('Entry Posted', `Journal entry ${entry.entryNumber} posted to General Ledger accounts.`, 'success');
  };

  const handleReverse = () => {
    reverseJournalEntry(entry.id, 'User initiated correction reversal');
    showToast('Entry Reversed', `Reversal journal entry created and account balances restored.`, 'info');
    onClose();
  };

  const statusConfigs = {
    posted: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    draft: 'bg-charcoal/10 text-charcoal-muted border-border',
    approved: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    rejected: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
    reversed: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
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
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                  Journal Entry Voucher
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/30 font-bold">
                  {entry.entryNumber}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Posted to General Ledger • Lazfort Accounting Protocol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-border dark:border-white/10 text-charcoal dark:text-gray-300 hover:text-accent hover:border-accent/40 transition-colors"
              title="Print Voucher"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Metadata Banner */}
          <div className="p-4 rounded-2xl bg-ivory/30 dark:bg-primary-950/40 border border-border/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-accent tracking-wider">Date of Posting</p>
              <p className="font-mono text-xs font-semibold text-primary dark:text-white mt-1">
                {entry.date}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-accent tracking-wider">Reference Code</p>
              <p className="font-mono text-xs font-semibold text-primary dark:text-white mt-1">
                {entry.reference || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-accent tracking-wider">Created By</p>
              <p className="text-xs font-semibold text-primary dark:text-white mt-1">
                {entry.postedBy || 'Accounting Controller'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-accent tracking-wider">Posting Status</p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                statusConfigs[entry.status] || statusConfigs.draft
              }`}>
                {entry.status || 'Posted'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-400 mb-1">
              General Ledger Description:
            </p>
            <p className="text-xs text-primary dark:text-white font-medium bg-ivory/20 dark:bg-primary-950/20 p-3 rounded-xl border border-border/60 dark:border-white/5">
              {entry.description}
            </p>
          </div>

          {/* Lines Table */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-primary dark:text-white flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-accent" />
              <span>Double-Entry Debit & Credit Lines</span>
            </h4>

            <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/60 dark:bg-primary-950/60 text-[10px] uppercase text-charcoal-muted dark:text-gray-400 border-b border-border/80 dark:border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">G/L Code</th>
                    <th className="py-2.5 px-3">Account Name</th>
                    <th className="py-2.5 px-3">Memo</th>
                    <th className="py-2.5 px-3 text-right">Debit ($)</th>
                    <th className="py-2.5 px-3 text-right">Credit ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 dark:divide-white/5">
                  {entry.lines?.map((line, idx) => (
                    <tr key={idx} className="hover:bg-ivory/30 dark:hover:bg-primary-800/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-accent">{line.accountCode}</td>
                      <td className="py-2.5 px-3 font-medium text-primary dark:text-white">{line.accountName}</td>
                      <td className="py-2.5 px-3 text-charcoal-muted">{line.description}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {line.debit > 0 ? `$${line.debit.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {line.credit > 0 ? `$${line.credit.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-ivory/60 dark:bg-primary-950/60 border-t border-border/80 dark:border-white/10 font-bold text-xs">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3 text-right text-primary dark:text-white uppercase tracking-wider text-[11px]">
                      Equilibrium Totals:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      ${(entry.totalDebit || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                      ${(entry.totalCredit || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-2">
            {entry.status === 'draft' && (
              <>
                <button
                  onClick={handleApprove}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  Approve Entry
                </button>
                <button
                  onClick={handlePost}
                  className="px-3.5 py-1.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
                >
                  Post to General Ledger
                </button>
              </>
            )}

            {entry.status === 'posted' && (
              <button
                onClick={handleReverse}
                className="px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reverse Posted Entry</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalDetailsModal;

