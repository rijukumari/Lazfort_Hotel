import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockPlanFeatures } from '../../data/mockSubscriptions';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  ShieldCheck,
  Save,
  Check,
} from 'lucide-react';
import { FormField, Input, Select, Textarea } from '../../components/forms/FormField';

const ALL_CATEGORIES = [
  'Hotel Management',
  'Room Management',
  'Reservations and Booking',
  'Front Desk',
  'Customer Panel',
  'Housekeeping',
  'Restaurant & POS',
  'Inventory & Procurement',
  'Staff & HR',
  'Reports & Analytics',
  'Platform Settings',
];

const PLAN_OPTIONS = ['Palace Enterprise', 'Grand Luxury', 'Boutique Elite'];

export const AddPlanFeaturePage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { planFeatures = mockPlanFeatures, addPlanFeature, updatePlanFeature } = useERP();

  const existing = id
    ? planFeatures.find(f => f.id === id) || mockPlanFeatures.find(f => f.id === id)
    : null;

  const [formName, setFormName] = useState(existing?.name || '');
  const [formCode, setFormCode] = useState(existing?.code || '');
  const [formCategory, setFormCategory] = useState(
    existing?.category || 'Hotel Management'
  );
  const [formDescription, setFormDescription] = useState(existing?.description || '');
  const [formLimits, setFormLimits] = useState(existing?.configuredLimits || '');
  const [formPlans, setFormPlans] = useState(
    existing?.applicablePlans || ['Palace Enterprise', 'Grand Luxury']
  );
  const [formStatus, setFormStatus] = useState(
    existing?.status || 'enabled'
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existing) {
      setFormName(existing.name || '');
      setFormCode(existing.code || '');
      setFormCategory(existing.category || 'Hotel Management');
      setFormDescription(existing.description || '');
      setFormLimits(existing.configuredLimits || '');
      if (existing.applicablePlans) {
        setFormPlans(existing.applicablePlans);
      }
      setFormStatus(existing.status || 'enabled');
    }
  }, [existing]);

  const togglePlanSelection = (plan) => {
    setFormPlans(prev =>
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  const validate = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Feature name is required';
    if (!formCode.trim()) errs.code = 'Feature code is required';
    if (!formDescription.trim()) errs.description = 'Description is required';
    if (formPlans.length === 0) errs.plans = 'Select at least one applicable subscription tier';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const featurePayload = {
        name: formName.trim(),
        code: formCode.trim(),
        category: formCategory,
        description: formDescription.trim(),
        configuredLimits: formLimits.trim(),
        applicablePlans: formPlans,
        status: formStatus,
      };

      if (isEditMode && existing) {
        if (updatePlanFeature) {
          updatePlanFeature(existing.id, featurePayload);
        }
      } else {
        if (addPlanFeature) {
          addPlanFeature(featurePayload);
        }
      }

      showToast(
        isEditMode ? 'Feature Updated' : 'Feature Registered',
        `Feature "${formName}" (${formCode}) has been updated in the platform registry.`,
        'success'
      );
      navigate('/super-admin/subscriptions/features');
    } catch {
      showToast('Error', 'Failed to register feature.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/subscriptions/features"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Feature Matrix</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {isEditMode ? `Edit Feature: ${formName}` : 'Add New Functional Feature'}
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Configure system module privileges, limits, and plan tier allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/super-admin/subscriptions/features')}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Feature' : 'Register Feature'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Feature Name" required error={errors.name}>
                <Input
                  required
                  placeholder="e.g. Sovereign Valet Fleet Dispatch"
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                />
              </FormField>

              <FormField label="Feature Code" required error={errors.code} hint="Uppercase unique key">
                <Input
                  required
                  placeholder="e.g. FEAT-VALET-DISPATCH"
                  value={formCode}
                  onChange={e => {
                    setFormCode(e.target.value.toUpperCase());
                    if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                  }}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Module Category" required>
                <Select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                >
                  {ALL_CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Deployment Status">
                <Select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value)}
                >
                  <option value="enabled">Enabled (Production Active)</option>
                  <option value="disabled">Disabled (Deactivated)</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Functional Description" required error={errors.description}>
              <Textarea
                rows={3}
                placeholder="Explain the capability, privileges, and operational impact..."
                value={formDescription}
                onChange={e => {
                  setFormDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
              />
            </FormField>

            <FormField label="Resource Quota / Limits" hint="e.g. Unlimited or 500 requests / day">
              <Input
                placeholder="e.g. Unlimited luxury valet bookings"
                value={formLimits}
                onChange={e => setFormLimits(e.target.value)}
              />
            </FormField>

            {/* Applicable Tiers Selection */}
            <div className="space-y-3 pt-4 border-t border-border dark:border-white/10">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200">
                  Applicable Subscription Tiers <span className="text-rose-500">*</span>
                </label>
                {errors.plans && <span className="text-xs text-rose-500">{errors.plans}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLAN_OPTIONS.map(plan => {
                  const isSelected = formPlans.includes(plan);
                  return (
                    <button
                      type="button"
                      key={plan}
                      onClick={() => togglePlanSelection(plan)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-accent bg-accent/10 text-primary dark:text-white font-semibold shadow-sm'
                          : 'border-border/80 dark:border-white/10 text-charcoal-muted hover:border-accent/40'
                      }`}
                    >
                      <span>{plan}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isSelected ? 'gold-gradient-bg text-primary-950 font-bold' : 'border border-border'
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
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-accent block">
              Feature Card Preview
            </span>

            <div>
              <h4 className="font-serif font-bold text-lg text-primary dark:text-white">
                {formName || 'Untitled Feature'}
              </h4>
              <p className="font-mono text-xs text-accent mt-0.5">{formCode || 'FEAT-CODE'}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/25">
                {formCategory}
              </span>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              {formDescription || 'Feature specification will be rendered here.'}
            </p>

            <div className="space-y-2 text-xs border-t border-border/80 dark:border-white/10 pt-4">
              <span className="text-charcoal-muted block font-medium">Eligible Tiers:</span>
              <div className="flex flex-wrap gap-1.5">
                {formPlans.map(p => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-ivory dark:bg-primary-900/50 border border-border text-charcoal dark:text-gray-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Feature' : 'Register Feature'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlanFeaturePage;

