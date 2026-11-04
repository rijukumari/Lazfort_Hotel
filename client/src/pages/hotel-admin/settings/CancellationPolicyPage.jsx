import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  FileText,
  Clock,
  Percent,
  AlertTriangle,
  Save,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const CancellationPolicyPage = () => {
  const { showToast } = useToast();

  const [policy, setPolicy] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_cancellation_policy');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      standardWindowHours: '48',
      standardRefundPercentage: '100',
      midTierWindowHours: '24',
      midTierRefundPercentage: '50',
      lastMinuteRefundPercentage: '0',
      nonRefundableDiscount: '15',
      allowVipException: true,
      forceMajeurePolicy:
        'In events of state-level airspace closures, sovereign diplomatic reassignments, or verified medical crises, the guest concierge reserve credit may be retained with 12 months validity.',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicy((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_cancellation_policy', JSON.stringify(policy));
      setIsSaved(true);
      if (showToast) {
        showToast('Policy Saved', 'Statutory cancellation rules and penalty tiers committed.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Unable to commit cancellation policy updates.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Cancellation Policy & Refund Framework"
        description="Statutory refund percentages, penalty windows, non-refundable tariff deductions, and diplomatic exceptions."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tiered Cancellation Window Matrix */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Percent className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Turnover Notice Windows & Refund Tiers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Refund Window */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-3">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider block">
                Tier 1: Full Refund (Standard)
              </span>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  Cancellation Prior To (Hours)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="standardWindowHours"
                    value={policy.standardWindowHours}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono"
                  />
                  <span className="text-xs text-muted-foreground">hrs</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  Refund Rate
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="standardRefundPercentage"
                    value={policy.standardRefundPercentage}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Partial Refund Window */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-3">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block">
                Tier 2: Late Cancellation
              </span>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  Notice Window (Hours)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="midTierWindowHours"
                    value={policy.midTierWindowHours}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono"
                  />
                  <span className="text-xs text-muted-foreground">hrs</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  Refund Rate
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="midTierRefundPercentage"
                    value={policy.midTierRefundPercentage}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* No-Show / Last Minute Window */}
            <div className="p-5 rounded-xl border border-border bg-background space-y-3">
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">
                Tier 3: Same-Day / No-Show
              </span>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  Notice Under 24 Hours
                </label>
                <div className="text-xs py-2.5 px-3 rounded-lg border border-border bg-background/50 text-muted-foreground">
                  Immediate 24h cycle
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  Forfeited Deposit Retention
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="lastMinuteRefundPercentage"
                    value={policy.lastMinuteRefundPercentage}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono"
                  />
                  <span className="text-xs text-muted-foreground">% (Full Retention)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Refundable Tariffs & Diplomatic Exceptions */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Non-Refundable Rate Discounts & Diplomatic Waivers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              <label className="text-xs font-semibold text-foreground block">
                Non-Refundable Promotional Tariff Discount
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="nonRefundableDiscount"
                  value={policy.nonRefundableDiscount}
                  onChange={handleChange}
                  className="w-24 text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono"
                />
                <span className="text-xs text-muted-foreground">% off standard chamber rate</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Guests opting for this rate pay in full upfront with zero cancellation refund rights.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Royal Ambassador / Sovereign Immunity Waiver
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Allow General Manager discretionary overrides for diplomatic patrons
                </span>
              </div>
              <input
                type="checkbox"
                name="allowVipException"
                checked={policy.allowVipException}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Force Majeure & Exceptional Retinue Clause
            </label>
            <textarea
              name="forceMajeurePolicy"
              rows={3}
              value={policy.forceMajeurePolicy}
              onChange={handleChange}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cancellation framework active across payment gateway and guest invoices.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Applied automatically during reservation cancellation refund calculations.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Cancellation Policy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancellationPolicyPage;

