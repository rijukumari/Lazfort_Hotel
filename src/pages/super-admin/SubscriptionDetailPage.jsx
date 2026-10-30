import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockExpiredSubscriptions, mockActiveSubscriptions } from '../../data/mockSubscriptions';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  CreditCard,
  ArrowLeft,
  User,
  RotateCw,
} from 'lucide-react';

export const SubscriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allSubs = [...mockExpiredSubscriptions, ...mockActiveSubscriptions];
  const sub = allSubs.find(s => s.id === id) || mockExpiredSubscriptions[0];

  if (!sub) {
    return (
      <div className="space-y-6">
        <Link to="/super-admin/subscriptions" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Subscriptions
        </Link>
        <p className="text-sm">Subscription record not found.</p>
      </div>
    );
  }

  const isExpired = sub.status === 'expired' || sub.status === 'suspended';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to={isExpired ? '/super-admin/subscriptions/expired' : '/super-admin/subscriptions/active'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Back to {isExpired ? 'Expired Subscriptions' : 'Active Subscriptions'}</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {sub.hotelName}
            </h1>
            <StatusBadge status={sub.status} size="md" />
          </div>
          <p className="text-xs text-charcoal-muted">
            Subscription Ref: <span className="font-mono text-accent font-bold">{sub.subscriptionId}</span> • {sub.hotelLocation}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isExpired && (
            <button
              onClick={() => navigate(`/super-admin/subscriptions/renew/${sub.id}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Renew Subscription</span>
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-3xl border border-border dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <span>Subscription Agreement Specifications</span>
            </h3>

            {sub.terminationReason && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-xs space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px]">
                  Lapse / Termination Note
                </span>
                <p className="text-charcoal dark:text-gray-200 leading-relaxed">
                  {sub.terminationReason}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.03] border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block font-bold">Tier Plan</span>
                <p className="font-serif font-bold text-sm text-accent mt-1">{sub.planName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.03] border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block font-bold">Tariff Rate</span>
                <p className="font-serif font-bold text-sm text-primary dark:text-white mt-1">
                  ${sub.amount.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.03] border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block font-bold">Cycle</span>
                <p className="font-semibold text-sm text-primary dark:text-white mt-1">{sub.billingCycle}</p>
              </div>
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.03] border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block font-bold">Expiry Date</span>
                <p className="font-serif font-bold text-sm text-rose-600 dark:text-rose-400 mt-1">{sub.expiryDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-3xl border border-border dark:border-white/10 p-6 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              <span>Executive Contact & Commenced Date</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">Commenced Date:</span>
                <span className="font-mono text-primary dark:text-white">{sub.startDate}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">General Manager:</span>
                <span className="font-semibold text-primary dark:text-white">{sub.contactName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">Executive Email:</span>
                <span className="font-mono text-primary dark:text-white">{sub.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailPage;

