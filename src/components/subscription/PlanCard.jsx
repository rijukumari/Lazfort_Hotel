import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Check, Building2, Users, Clock, Sparkles, Edit, Eye, Power } from 'lucide-react';

export const PlanCard = ({
  plan,
  billingCycle,
  onViewDetails,
  onEdit,
  onToggleStatus,
}) => {
  const price = billingCycle === 'Monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12);
  const totalBilled = billingCycle === 'Annually' ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div
      className={`card-luxury-3d flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
        plan.isPopular ? 'border-accent/60 ring-1 ring-accent/30' : ''
      } ${plan.status === 'inactive' ? 'opacity-70 grayscale-[0.3]' : ''}`}
    >
      {/* Popular or Recommended Top Insignia Ribbon */}
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="gold-gradient-bg text-primary-950 font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold tracking-wider text-accent uppercase">
            {plan.tierCode}
          </span>
          <StatusBadge status={plan.status} size="sm" />
        </div>

        <div>
          <h3 className="text-xl font-serif font-bold text-primary dark:text-white">
            {plan.name}
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Pricing Header */}
        <div className="p-4 rounded-2xl bg-ivory/70 dark:bg-primary-900/40 border border-border/80 dark:border-accent/20">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-bold text-accent">
              ${price.toLocaleString()}
            </span>
            <span className="text-xs text-charcoal-muted dark:text-gray-400">
              / mo
            </span>
          </div>
          <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1 font-mono">
            {billingCycle === 'Annually'
              ? `Billed annually at $${totalBilled.toLocaleString()} / year (Save 17%)`
              : `Billed monthly at $${totalBilled.toLocaleString()}`}
          </p>
        </div>

        {/* Limits Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-ivory/50 dark:bg-white/[0.03] border border-border/60 dark:border-white/5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Keys Limit</span>
              <span className="font-semibold text-primary dark:text-white">
                {plan.roomLimit === 'Unlimited' ? 'Unlimited' : `${plan.roomLimit} Suites`}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-ivory/50 dark:bg-white/[0.03] border border-border/60 dark:border-white/5 flex items-center gap-2">
            <Users className="w-4 h-4 text-accent shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Staff Seats</span>
              <span className="font-semibold text-primary dark:text-white">
                {plan.userLimit === 'Unlimited' ? 'Unlimited' : `${plan.userLimit} Users`}
              </span>
            </div>
          </div>
        </div>

        {/* Trial Days & Recommendation */}
        <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 pt-1">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-accent" />
            {plan.trialDays}-Day Sovereign Trial
          </span>
          {plan.recommendedFor && (
            <span className="text-[10px] text-accent truncate max-w-[150px]" title={plan.recommendedFor}>
              {plan.recommendedFor}
            </span>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="pt-2 border-t border-border/70 dark:border-white/10 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-charcoal-muted dark:text-gray-400 block">
            Included Privileges ({plan.features.length})
          </span>
          <ul className="space-y-1.5">
            {plan.features.slice(0, 4).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-charcoal dark:text-gray-300">
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-3 bg-ivory/40 dark:bg-primary-950/40 border-t border-border/70 dark:border-white/10 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(plan)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl btn-secondary-3d text-charcoal dark:text-gray-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-accent" />
          <span>Details</span>
        </button>

        <button
          onClick={() => onEdit(plan)}
          className="p-2 text-xs rounded-xl border border-border dark:border-border-dark text-charcoal hover:text-accent dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
          title="Edit Subscription Plan"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onToggleStatus(plan)}
          className={`p-2 text-xs rounded-xl border transition-colors ${
            plan.status === 'active'
              ? 'border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              : 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
          }`}
          title={plan.status === 'active' ? 'Deactivate Plan' : 'Activate Plan'}
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PlanCard;

