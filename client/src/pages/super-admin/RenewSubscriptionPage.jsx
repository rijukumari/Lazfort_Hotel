import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { FormField, Select } from '../../components/forms/FormField';
import { mockExpiredSubscriptions, mockActiveSubscriptions } from '../../data/mockSubscriptions';
import { useToast } from '../../context/ToastContext';
import {
  RotateCw,
  ArrowLeft,
  Sparkles,
  Building2,
} from 'lucide-react';

export const RenewSubscriptionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const allSubs = [...mockExpiredSubscriptions, ...mockActiveSubscriptions];
  const sub = allSubs.find(s => s.id === id) || mockExpiredSubscriptions[0];

  const [renewPlan, setRenewPlan] = useState(sub ? sub.planName : 'Palace Enterprise');
  const [renewCycle, setRenewCycle] = useState('Annually');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!sub) {
    return (
      <div className="space-y-6">
        <Link to="/super-admin/subscriptions/expired" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Expired Subscriptions
        </Link>
        <p className="text-sm">Subscription not found.</p>
      </div>
    );
  }

  const handleExecuteRenew = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      showToast(
        'Subscription Restored',
        `Property ${sub.hotelName} successfully reinstated into active portfolio under ${renewPlan} (${renewCycle}).`,
        'success'
      );
      navigate('/super-admin/subscriptions/active');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedFee = renewCycle === 'Annually' ? '$49,000 USD' : '$4,900 USD';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="space-y-4">
        <Link
          to="/super-admin/subscriptions/expired"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
          <span>Back to Expired Subscriptions</span>
        </Link>

        <PageHeader
          title={`Reactivate & Renew: ${sub.hotelName}`}
          description="Re-enlist property into sovereign portfolio clearances with renewal agreement."
          badge={`Sub ID: ${sub.subscriptionId}`}
          actions={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/super-admin/subscriptions/expired')}
                className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="renew-subscription-form"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Re-enlistment'}</span>
              </button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7">
          <form id="renew-subscription-form" onSubmit={handleExecuteRenew} className="space-y-6">
            <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl relative">
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

              <div className="flex items-center gap-3 pb-6 border-b border-border dark:border-white/10 mb-6">
                <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                  <RotateCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                    Re-enlistment Terms & Tariff Agreement
                  </h3>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                    Select enterprise subscription level and billing frequency for {sub.hotelName}.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <FormField label="Assigned Re-enlistment Tier" required>
                  <Select
                    value={renewPlan}
                    onChange={e => setRenewPlan(e.target.value)}
                  >
                    <option value="Palace Enterprise">Palace Enterprise ($4,900/mo - Unlimited Suites)</option>
                    <option value="Grand Luxury">Grand Luxury ($2,900/mo - Up to 250 Suites)</option>
                    <option value="Boutique Elite">Boutique Elite ($1,400/mo - Up to 80 Suites)</option>
                  </Select>
                </FormField>

                <FormField label="Term Agreement Cycle" required>
                  <Select
                    value={renewCycle}
                    onChange={e => setRenewCycle(e.target.value)}
                  >
                    <option value="Annually">Annual Sovereign Contract (Pre-Paid with 17% Preferred Discount)</option>
                    <option value="Monthly">Monthly Recurring Settlement</option>
                  </Select>
                </FormField>

                <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted font-medium">Re-enlistment Fee Due:</span>
                    <span className="text-xl font-serif font-bold text-accent">{calculatedFee}</span>
                  </div>
                  <p className="text-charcoal-muted dark:text-gray-300 text-[11px] leading-relaxed">
                    Immediate clearance upon confirmation will restore GM administrative dashboard access, live guest booking engine, sommelier ledger, and VIP customer portal.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => navigate('/super-admin/subscriptions/expired')}
                    className="px-6 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Re-enlistment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl rounded-3xl border border-border dark:border-white/10 p-6 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <span>Historical Property Record</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">Hotel Property:</span>
                <span className="font-semibold text-primary dark:text-white">{sub.hotelName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">Territory:</span>
                <span className="font-medium text-primary dark:text-white">{sub.hotelLocation}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">Previous Tier:</span>
                <span className="font-mono text-accent font-bold">{sub.planName}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/70 dark:border-white/5">
                <span className="text-charcoal-muted">Lapsed Inactive:</span>
                <span className="font-serif font-bold text-rose-600 dark:text-rose-400">{sub.lapsedDays || 0} Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewSubscriptionPage;

