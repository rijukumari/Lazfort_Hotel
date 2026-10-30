import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  FileText,
  Printer,
  CreditCard,
  Building,
  User,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const FolioStatementPage = () => {
  const { id, folioId } = useParams();
  const effectiveId = folioId || id;
  const navigate = useNavigate();
  const { folios = [], bookings = [] } = useERP();

  const folio = folios.find(f => f.id === effectiveId || f.bookingCode === effectiveId || f.bookingId === effectiveId) ||
    bookings.find(b => b.id === effectiveId || b.bookingCode === effectiveId) ||
    folios[0];

  if (!folio) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/billing" className="inline-flex items-center gap-2 text-xs text-charcoal-muted hover:text-accent">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing</span>
        </Link>
        <p className="text-sm">Folio statement record not found.</p>
      </div>
    );
  }

  const charges = folio.charges || [
    {
      id: 'chg-1',
      date: '2026-10-25',
      category: 'Room_charge',
      description: `${folio.roomType || 'Presidential Suite'} — Accommodation (Night 1 to 5)`,
      amount: (folio.grandTotal || 5049) * 0.7,
      tax: ((folio.grandTotal || 5049) * 0.7) * 0.1,
      totalAmount: ((folio.grandTotal || 5049) * 0.7) * 1.1,
    },
    {
      id: 'chg-2',
      date: '2026-10-26',
      category: 'Restaurant',
      description: 'Le Grand Colbert Dining — Imperial Beluga & Krug Champagne',
      amount: 840,
      tax: 84,
      totalAmount: 924,
    },
    {
      id: 'chg-3',
      date: '2026-10-27',
      category: 'Spa_wellness',
      description: 'Royal Caviar Rejuvenation & Diamond Hydrotherapy',
      amount: 900,
      tax: 90,
      totalAmount: 990,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Billing & Ledger</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Official Guest Folio Statement — {folio.bookingCode || 'AUR-8941'}
            </h1>
            <StatusBadge status={folio.status || 'open'} size="sm" />
          </div>
          <p className="text-xs text-charcoal-muted">
            Resident: <strong className="text-primary dark:text-white">{folio.guestName}</strong> • Suite <span className="font-mono font-bold text-accent">{folio.roomNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Statement
          </Button>
          <Button
            variant="gold"
            onClick={() => navigate('/super-admin/billing')}
          >
            Close Statement
          </Button>
        </div>
      </div>

      {/* Summary Stat Banner matching screenshot */}
      <div className="p-6 rounded-3xl bg-ivory/80 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-charcoal-muted block mb-1.5 font-semibold">STATUS</span>
          <StatusBadge status={folio.status || 'open'} size="sm" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-charcoal-muted block mb-1 font-semibold">GROSS CHARGES</span>
          <span className="font-serif font-bold text-xl text-primary dark:text-white">
            ${(folio.grandTotal || folio.totalAmount || 5049).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-charcoal-muted block mb-1 font-semibold">AMOUNT SETTLED</span>
          <span className="font-serif font-bold text-xl text-emerald-600 dark:text-emerald-400">
            ${(folio.totalPaid || folio.paidAmount || 5000).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-charcoal-muted block mb-1 font-semibold">BALANCE OUTSTANDING</span>
          <span className="font-serif font-bold text-xl text-rose-600 dark:text-rose-400">
            ${(folio.balanceDue !== undefined ? folio.balanceDue : 49).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Itemized Ledger Postings Table */}
      <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/25 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/15 text-accent">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Itemized Ledger Postings
              </h3>
              <p className="text-xs text-charcoal-muted">
                Official audit trail of accommodation, dining, spa and concierge charges.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-accent font-bold">
            {charges.length} Postings Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory dark:bg-primary-900/50 border-b border-border/80 dark:border-white/10 text-charcoal-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Tax (10%)</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {charges.map((c, i) => (
                <tr key={c.id || i} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-charcoal-muted">{c.date || '2026-10-25'}</td>
                  <td className="py-3.5 px-4 font-semibold text-accent capitalize">{c.category || 'General'}</td>
                  <td className="py-3.5 px-4 text-charcoal dark:text-gray-200">{c.description}</td>
                  <td className="py-3.5 px-4 font-mono text-right text-charcoal-muted">
                    ${(c.tax || c.taxAmount || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-right text-primary dark:text-white text-sm">
                    ${(c.totalAmount || c.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-border/80 dark:border-white/10 font-bold bg-ivory/40 dark:bg-primary-900/30">
              <tr>
                <td colSpan={4} className="py-4 px-4 text-right font-serif text-sm">
                  Grand Total Folio Value:
                </td>
                <td className="py-4 px-4 text-right font-serif text-base text-accent">
                  ${(folio.grandTotal || folio.totalAmount || 5049).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FolioStatementPage;

