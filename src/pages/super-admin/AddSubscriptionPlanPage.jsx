import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockSubscriptionPlans } from '../../data/mockSubscriptions';
import { useToast } from '../../context/ToastContext';
import { Button, Input, Select, FormField } from '../../components/ui';
import {
  ArrowLeft,
  Crown,
  Layers,
  Save,
  Check,
  DollarSign,
} from 'lucide-react';

const AVAILABLE_MODULES = [
  'Multi-Branch Management',
  'VIP Customer Panel',
  'Front Desk & Folios',
  'Fine Dining POS & In-Room Service',
  'Housekeeping Automation',
  'Inventory & Procurement',
  'Financial Ledger & Invoicing',
  'Payroll & Executive HR',
  'Fixed Asset & Engineering',
  'AI Concierge & Analytics',
];

export const AddSubscriptionPlanPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const existingPlan = id ? mockSubscriptionPlans.find(p => p.id === id) : null;

  const [formName, setFormName] = useState(existingPlan?.name || '');
  const [formTierCode, setFormTierCode] = useState(existingPlan?.tierCode || '');
  const [formDescription, setFormDescription] = useState(existingPlan?.description || '');
  const [formMonthlyPrice, setFormMonthlyPrice] = useState(existingPlan?.monthlyPrice || 2900);
  const [formAnnualPrice, setFormAnnualPrice] = useState(existingPlan?.annualPrice || 29000);
  const [formRoomLimitType, setFormRoomLimitType] = useState(
    existingPlan?.roomLimit === 'Unlimited' ? 'unlimited' : 'number'
  );
  const [formRoomLimitNum, setFormRoomLimitNum] = useState(
    existingPlan?.roomLimit !== 'Unlimited' && existingPlan?.roomLimit ? existingPlan.roomLimit : 100
  );
  const [formUserLimitType, setFormUserLimitType] = useState(
    existingPlan?.userLimit === 'Unlimited' ? 'unlimited' : 'number'
  );
  const [formUserLimitNum, setFormUserLimitNum] = useState(
    existingPlan?.userLimit !== 'Unlimited' && existingPlan?.userLimit ? existingPlan.userLimit : 50
  );
  const [formTrialDays, setFormTrialDays] = useState(existingPlan?.trialDays || 14);
  const [formRecommendedFor, setFormRecommendedFor] = useState(existingPlan?.recommendedFor || '');
  const [formStatus, setFormStatus] = useState(existingPlan?.status || 'active');
  const [formModules, setFormModules] = useState(
    existingPlan?.includedModules || [
      'Front Desk & Folios',
      'VIP Customer Panel',
      'Housekeeping Automation',
    ]
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModuleSelection = moduleName => {
    setFormModules(prev =>
      prev.includes(moduleName) ? prev.filter(m => m !== moduleName) : [...prev, moduleName]
    );
  };

  const validate = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Plan name is required';
    if (!formTierCode.trim()) errs.tierCode = 'Unique Tier code is required';
    if (!formMonthlyPrice || Number(formMonthlyPrice) <= 0) errs.monthlyPrice = 'Valid monthly tariff is required';
    if (!formAnnualPrice || Number(formAnnualPrice) <= 0) errs.annualPrice = 'Valid annual tariff is required';
    if (formRoomLimitType === 'number' && (!formRoomLimitNum || Number(formRoomLimitNum) <= 0)) {
      errs.roomLimit = 'Suite limit must be greater than 0';
    }
    if (formUserLimitType === 'number' && (!formUserLimitNum || Number(formUserLimitNum) <= 0)) {
      errs.userLimit = 'User seat count must be greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      showToast(
        isEditMode ? 'Plan Updated' : 'Subscription Plan Created',
        `Plan ${formName} (${formTierCode}) has been persisted to the platform catalog.`,
        'success'
      );
      navigate('/super-admin/subscriptions/plans');
    } catch {
      showToast('Error', 'Failed to save plan configuration.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <Crown className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {isEditMode ? `Edit Plan: ${formName}` : 'Provision New Subscription Plan'}
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Define pricing models, property quotas, trial durations, and ERP functional entitlements.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Identity & Description */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-accent/30 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border dark:border-white/10">
              <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Plan Identity & Nomenclature
                </h3>
                <p className="text-xs text-charcoal-muted">Official commercial title and unique platform tier slug.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Plan Name" required error={errors.name}>
                <Input
                  required
                  placeholder="e.g. Imperial Heritage Sovereign"
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                />
              </FormField>

              <FormField label="Tier Code" required error={errors.tierCode} hint="Unique uppercase slug">
                <Input
                  required
                  placeholder="e.g. IMPERIAL-SOV"
                  value={formTierCode}
                  onChange={e => {
                    setFormTierCode(e.target.value.toUpperCase());
                    if (errors.tierCode) setErrors(prev => ({ ...prev, tierCode: '' }));
                  }}
                />
              </FormField>
            </div>

            <FormField label="Plan Commercial Description">
              <textarea
                rows={3}
                placeholder="Detail target property archetype, prestige features, and hospitality scope..."
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-primary-900/60 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40 text-primary dark:text-white placeholder:text-charcoal-muted/60"
              />
            </FormField>
          </div>

          {/* Card 2: Tariffs & Limits */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-accent/30 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border dark:border-white/10">
              <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Tariff Schedule & Quotas
                </h3>
                <p className="text-xs text-charcoal-muted">Sovereign recurring rates and operational caps.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="Monthly Price ($ USD)" required error={errors.monthlyPrice}>
                <Input
                  type="number"
                  min="50"
                  required
                  value={formMonthlyPrice}
                  onChange={e => setFormMonthlyPrice(e.target.value)}
                />
              </FormField>

              <FormField label="Annual Price ($ USD)" required error={errors.annualPrice}>
                <Input
                  type="number"
                  min="500"
                  required
                  value={formAnnualPrice}
                  onChange={e => setFormAnnualPrice(e.target.value)}
                />
              </FormField>

              <FormField label="Trial Period (Days)">
                <Input
                  type="number"
                  min="0"
                  max="90"
                  value={formTrialDays}
                  onChange={e => setFormTrialDays(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200">
                  Luxury Suite Limits
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={formRoomLimitType}
                    onChange={e => setFormRoomLimitType(e.target.value)}
                  >
                    <option value="unlimited">Unlimited Keys</option>
                    <option value="number">Numeric Cap</option>
                  </Select>
                  {formRoomLimitType === 'number' && (
                    <Input
                      type="number"
                      min="1"
                      placeholder="e.g. 100"
                      value={formRoomLimitNum}
                      onChange={e => setFormRoomLimitNum(e.target.value)}
                    />
                  )}
                </div>
                {errors.roomLimit && <p className="text-xs text-rose-500">{errors.roomLimit}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200">
                  Staff / User Seats Limit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={formUserLimitType}
                    onChange={e => setFormUserLimitType(e.target.value)}
                  >
                    <option value="unlimited">Unlimited Seats</option>
                    <option value="number">Numeric Cap</option>
                  </Select>
                  {formUserLimitType === 'number' && (
                    <Input
                      type="number"
                      min="1"
                      placeholder="e.g. 50"
                      value={formUserLimitNum}
                      onChange={e => setFormUserLimitNum(e.target.value)}
                    />
                  )}
                </div>
                {errors.userLimit && <p className="text-xs text-rose-500">{errors.userLimit}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Recommended Property Archetype">
                <Input
                  placeholder="e.g. 5-Star Boutique Hotels (40-100 Suites)"
                  value={formRecommendedFor}
                  onChange={e => setFormRecommendedFor(e.target.value)}
                />
              </FormField>

              <FormField label="Commercial Plan Status">
                <Select value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                  <option value="active">Active (Available for Onboarding)</option>
                  <option value="inactive">Inactive / Deprecated</option>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Card 3: Included Functional Modules */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-accent/30 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border dark:border-white/10">
              <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Included Functional Modules ({formModules.length} Active)
                </h3>
                <p className="text-xs text-charcoal-muted">Clearances bundled into this sovereign tier license.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_MODULES.map(mod => {
                const isSelected = formModules.includes(mod);
                return (
                  <button
                    type="button"
                    key={mod}
                    onClick={() => toggleModuleSelection(mod)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${isSelected
                      ? 'border-accent bg-accent/10 text-primary dark:text-white font-semibold shadow-sm'
                      : 'border-border/80 dark:border-white/10 text-charcoal-muted hover:border-accent/40'
                      }`}
                  >
                    <span>{mod}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${isSelected ? 'gold-gradient-bg text-primary-950 font-bold' : 'border border-border'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-luxury p-6 rounded-3xl border border-accent/30 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-accent">
                Live Catalog Preview
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${formStatus === 'active'
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                  }`}
              >
                {formStatus}
              </span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-xl text-primary dark:text-white">
                {formName || 'Untitled Tier'}
              </h4>
              <p className="font-mono text-xs text-accent mt-0.5">{formTierCode || 'TIER-SLUG'}</p>
              <p className="text-xs text-charcoal-muted mt-2 line-clamp-3">
                {formDescription || 'No commercial description configured yet.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-center">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Contract Rate</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">
                ${Number(formMonthlyPrice || 0).toLocaleString()}
                <span className="text-xs font-sans text-charcoal-muted font-normal"> / month</span>
              </p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                or ${Number(formAnnualPrice || 0).toLocaleString()} billed annually
              </p>
            </div>

            <div className="space-y-2.5 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Suite Allotment</span>
                <span className="font-mono font-bold text-primary dark:text-white">
                  {formRoomLimitType === 'unlimited' ? 'Unlimited Keys' : `${formRoomLimitNum} Suites`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Staff Access Seats</span>
                <span className="font-mono font-bold text-primary dark:text-white">
                  {formUserLimitType === 'unlimited' ? 'Unlimited Seats' : `${formUserLimitNum} Users`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Trial Evaluation</span>
                <span className="font-mono font-bold text-primary dark:text-white">{formTrialDays} Days</span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Save}
              loading={isSubmitting}
              onClick={handleSubmit}
              className="w-full py-3.5"
            >
              {isSubmitting ? 'Saving Plan...' : isEditMode ? 'Update Plan' : 'Publish Plan'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSubscriptionPlanPage;

