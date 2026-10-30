import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { initialPaymentTransactions } from '../../../data/mockSuperAdminModules';
import { StatusBadge, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  Printer,
  DollarSign,
} from 'lucide-react';

export const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tx = (initialPaymentTransactions || []).find(t => t.id === id || t.transactionId === id) || initialPaymentTransactions[0];

  if (!tx) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/billing/transactions" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Transactions
        </Link>
        <p className="text-sm">Transaction record not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/billing/transactions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Transactions Audit</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Transaction Clearance: {tx.transactionId}
            </h1>
            <StatusBadge status={tx.status} />
          </div>
          <p className="text-xs text-charcoal-muted">
            Reference: <span className="font-mono font-bold text-accent">{tx.reference}</span> • Property: {tx.hotelName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Printer} onClick={() => window.print()}>
            Print Receipt
          </Button>
          <Button variant="gold" onClick={() => navigate('/super-admin/billing/transactions')}>
            Close Statement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
              <span className="text-xs font-mono font-bold text-accent">INSTITUTIONAL SETTLEMENT DETAILS</span>
              <span className="text-xs font-mono text-charcoal-muted">{tx.date}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 space-y-1">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Resident / Client Entity</span>
                <p className="font-serif font-bold text-sm text-primary dark:text-white">{tx.clientName}</p>
                <p className="text-charcoal-muted">{tx.clientEmail || 'client@sovereign-guest.mc'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 space-y-1">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Settlement Hotel Estate</span>
                <p className="font-serif font-bold text-sm text-primary dark:text-white">{tx.hotelName}</p>
                <p className="text-accent font-mono text-[11px] font-bold">Clearance Branch #01</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center py-2.5 border-b border-border/50 text-xs">
                <span className="text-charcoal-muted">Payment Instrument:</span>
                <span className="font-semibold text-primary dark:text-white">{tx.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-border/50 text-xs">
                <span className="text-charcoal-muted">Processor Authorization:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">AUTH-SWIFT-99201-OK</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-border/50 text-xs">
                <span className="text-charcoal-muted">Merchant Fee / Interchange:</span>
                <span className="font-mono text-charcoal-muted">$0.00 (Sovereign Zero Surcharge)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Settlement Value
            </span>

            <div className="p-5 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-center">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Net Transacted</span>
              <p className="font-serif font-bold text-3xl text-accent mt-1">
                ${tx.amount?.toLocaleString()}
                <span className="text-xs font-sans text-charcoal-muted font-normal"> {tx.currency}</span>
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                Remitted to Ledger
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs space-y-1">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Double-Entry Verified
              </p>
              <p className="text-charcoal-muted text-[11px]">
                Posted and matched in General Ledger Operating Treasury with instant reconciliations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;

