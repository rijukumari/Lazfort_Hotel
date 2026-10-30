import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockSubscriptionPlans, mockActiveSubscriptions } from '../../data/mockSubscriptions';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ArrowLeft,
  Crown,
  Edit,
  Building2,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const PlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const plan = mockSubscriptionPlans.find(p => p.id === id) || mockSubscriptionPlans[0];
  const subscribedHotels = mockActiveSubscriptions.filter(s => s.planName === plan.name);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/subscriptions/plans"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Subscription Plans</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <span className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <Crown className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  {plan.name}
                </h1>
                <StatusBadge status={plan.status} size="sm" />
              </div>
              <p className="font-mono text-xs text-accent mt-0.5">{plan.tierCode}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/super-admin/subscriptions/plans')}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Back to Catalog
          </button>
          <button
            type="button"
            onClick={() => navigate(`/super-admin/subscriptions/plans/edit/${plan.id}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer"
          >
            <Edit className="w-4 h-4 stroke-[2.5]" />
            <span>Edit Plan Tier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Overview & Pricing */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Commercial Tier Profile</span>
            </h3>

            <p className="text-sm text-charcoal-muted leading-relaxed">
              {plan.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Monthly Tariff</span>
                <p className="font-serif font-bold text-2xl text-accent mt-1">
                  ${plan.monthlyPrice.toLocaleString()}
                </p>
                <span className="text-[11px] text-charcoal-muted">Billed monthly recurring</span>
              </div>
              <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Annual Tariff</span>
                <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                  ${plan.annualPrice.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  2 Months Free discount
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Free Trial</span>
                <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                  {plan.trialDays} Days
                </p>
                <span className="text-[11px] text-charcoal-muted">Sovereign evaluation</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/80 dark:border-white/10 pt-4 text-xs">
              <div>
                <span className="text-charcoal-muted block">Luxury Suite Keys Cap</span>
                <p className="font-mono font-bold text-primary dark:text-white text-sm mt-0.5">
                  {plan.roomLimit === 'Unlimited' ? 'Unlimited Keys' : `${plan.roomLimit} Suites`}
                </p>
              </div>
              <div>
                <span className="text-charcoal-muted block">Staff & Executive Seats Cap</span>
                <p className="font-mono font-bold text-primary dark:text-white text-sm mt-0.5">
                  {plan.userLimit === 'Unlimited' ? 'Unlimited Seats' : `${plan.userLimit} Users`}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Functional Modules Clearances */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-accent" />
              <span>Included Functional Clearances ({plan.includedModules.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plan.includedModules.map(mod => (
                <div
                  key={mod}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-ivory/70 dark:bg-primary-900/30 border border-border/80 text-xs font-semibold text-primary dark:text-white"
                >
                  <div className="w-5 h-5 rounded-md gold-gradient-bg text-primary-950 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Properties Subscribed */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-5">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-accent" />
              <span>Subscribed Sovereign Properties ({subscribedHotels.length})</span>
            </h3>

            {subscribedHotels.length === 0 ? (
              <p className="text-xs text-charcoal-muted italic">
                No active properties are currently assigned to this tier.
              </p>
            ) : (
              <div className="space-y-3">
                {subscribedHotels.map(sub => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 dark:border-white/10 hover:border-accent/40 transition-colors"
                  >
                    <div>
                      <p className="font-serif font-bold text-sm text-primary dark:text-white">{sub.hotelName}</p>
                      <p className="text-xs text-charcoal-muted mt-0.5">{sub.hotelLocation}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-accent">${sub.amount.toLocaleString()}</span>
                      <p className="text-[11px] text-charcoal-muted">Expires: {sub.expiryDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Plan Meta Information</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Plan ID</span>
                <span className="font-mono font-bold text-primary dark:text-white">{plan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Recommended For</span>
                <span className="font-medium text-right text-primary dark:text-white max-w-[180px]">
                  {plan.recommendedFor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Platform Status</span>
                <StatusBadge status={plan.status} size="sm" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate(`/super-admin/subscriptions/plans/edit/${plan.id}`)}
                className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4 stroke-[2.5]" />
                <span>Edit Configuration</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;

