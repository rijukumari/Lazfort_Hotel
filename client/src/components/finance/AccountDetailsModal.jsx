import React from 'react';
import { X, Landmark, TrendingUp, TrendingDown, DollarSign, Calendar, Edit2, ShieldCheck } from 'lucide-react';
import { AccountTypeBadge } from './AccountTypeBadge';

export const AccountDetailsModal = ({ isOpen, onClose, account = null, onEdit }) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  {account.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/30 font-bold">
                  {account.code}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                {account.category} • Standard Currency: {account.currency || 'EUR (€)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(account)}
                className="px-3 py-1.5 rounded-xl border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/15 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Balances Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/30 dark:bg-primary-950/40">
              <p className="text-xs text-charcoal-muted dark:text-gray-400">Opening Balance</p>
              <p className="text-xl font-serif font-bold text-primary dark:text-white mt-1">
                ${(account.openingBalance || 0).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-accent/40 bg-accent/10 dark:bg-accent/5">
              <p className="text-xs text-accent font-semibold">Current Book Balance</p>
              <p className="text-xl font-serif font-bold text-accent mt-1">
                ${(account.balance || 0).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/30 dark:bg-primary-950/40">
              <p className="text-xs text-charcoal-muted dark:text-gray-400">Classification</p>
              <div className="mt-2">
                <AccountTypeBadge type={account.type} />
              </div>
            </div>
          </div>

          {/* Account Details Specs */}
          <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-950/30 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted">Account Code:</span>
              <span className="font-mono font-bold text-primary dark:text-white">{account.code}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted">Account Category / Parent:</span>
              <span className="font-semibold text-primary dark:text-white">{account.category || 'General'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted">Debit Ledger Activity:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">+${(account.debitBalance || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
              <span className="text-charcoal-muted">Credit Ledger Activity:</span>
              <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">-${(account.creditBalance || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal-muted">Status:</span>
              <span className={`font-semibold ${account.isActive !== false ? 'text-emerald-500' : 'text-rose-500'}`}>
                {account.isActive !== false ? 'Active & Ready for Postings' : 'Deactivated'}
              </span>
            </div>
          </div>

          {account.description && (
            <div className="p-3.5 rounded-xl bg-ivory/40 dark:bg-primary-900/30 text-xs text-charcoal-muted dark:text-gray-400 border border-border/60 dark:border-white/5">
              <p className="font-semibold text-primary dark:text-white mb-0.5">Account Scope & Rules:</p>
              <p>{account.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <p className="text-xs text-charcoal-muted font-mono">
            Lazfort G/L Protocol • Chart of Accounts
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;

