import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockActiveSubscriptions, mockSubscriptionPlans } from '../../data/mockSubscriptions';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Sliders,
  Building2,
  Crown,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { FormField, Input, Select } from '../../components/forms/FormField';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const ManageSubscriptionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const subscription = mockActiveSubscriptions.find(s => s.id === id) || mockActiveSubscriptions[0];

  const [planName, setPlanName] = useState(subscription.planName);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);
  const [contactName, setContactName] = useState(subscription.contactName);
  const [contactEmail, setContactEmail] = useState(subscription.contactEmail);
  const [contactPhone, setContactPhone] = useState(subscription.contactPhone || '+1 (800) 555-0199');
  const [autoRenew, setAutoRenew] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Sovereign Amex Vault)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      showToast(
        'Subscription Updated',
        `Tier and settings for ${subscription.hotelName} have been persisted successfully.`,
        'success'
      );
      navigate('/super-admin/subscriptions');
    } catch {
      showToast('Error', 'Failed to update subscription parameters.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Page Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/subscriptions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Subscriptions</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <Sliders className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Manage Subscription
            </h1>
            <StatusBadge status={subscription.status} size="sm" />
          </div>
          <p className="text-xs text-charcoal-muted">
            Configure tier clearance, billing intervals, and executive access for <span className="font-semibold text-primary dark:text-white">{subscription.hotelName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/super-admin/subscriptions')}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          {/* Card 1: Tier & Billing Cycle */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-5 border-b border-border dark:border-white/10 mb-6">
              <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Tier Clearance & Billing Horizon
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Adjust active subscription plan package and renewal frequency.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="Assigned Plan Tier" required>
                <Select value={planName} onChange={e => setPlanName(e.target.value)}>
                  {mockSubscriptionPlans.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} (${p.monthlyPrice.toLocaleString()}/mo)
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Billing Horizon Cycle" required>
                <Select value={billingCycle} onChange={e => setBillingCycle(e.target.value)}>
                  <option value="Annually">Annual Renewal (Best Value)</option>
                  <option value="Monthly">Monthly Cycle</option>
                </Select>
              </FormField>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="autoRenew"
                checked={autoRenew}
                onChange={e => setAutoRenew(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="autoRenew" className="text-xs text-charcoal dark:text-gray-200 cursor-pointer">
                <span className="font-bold block text-primary dark:text-white">
                  Enable Sovereign Auto-Renewal
                </span>
                Automatically extend contract authorization on expiry using registered clearance depot.
              </label>
            </div>
          </div>

          {/* Card 2: Executive Point of Contact */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-5 border-b border-border dark:border-white/10 mb-6">
              <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Executive Billing Governance
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Official recipient for renewal notices, invoices, and SLA certificates.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <FormField label="Authorized Contact Full Name" required>
                <Input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Baroness Camille Beaumont"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Dispatch Email" required>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="gm@resort.com"
                  />
                </FormField>

                <FormField label="Direct Secure Phone">
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                  />
                </FormField>
              </div>

              <FormField label="Settlement Vault & Payment Gateway" required>
                <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="Credit Card (Sovereign Amex Vault)">Credit Card (Sovereign Amex Vault)</option>
                  <option value="SWIFT Wire Transfer (Monte Carlo Depot)">SWIFT Wire Transfer (Monte Carlo Depot)</option>
                  <option value="Direct Debit SEPA B2B">Direct Debit SEPA B2B</option>
                  <option value="Private Banker Escrow">Private Banker Escrow</option>
                </Select>
              </FormField>
            </div>
          </div>
        </form>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <span>Contract Snapshot</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Contract ID</span>
                <span className="font-mono font-bold text-primary dark:text-white">{subscription.subscriptionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Property</span>
                <span className="font-semibold text-primary dark:text-white">{subscription.hotelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Current Term</span>
                <span className="font-mono text-charcoal">{subscription.startDate} &rarr; {subscription.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Completed Renewals</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{subscription.totalRenewals} Terms</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Updating...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;

