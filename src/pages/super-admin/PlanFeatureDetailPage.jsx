import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockPlanFeatures } from '../../data/mockSubscriptions';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ArrowLeft,
  ShieldCheck,
  Edit,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const PlanFeatureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const feature = mockPlanFeatures.find(f => f.id === id) || mockPlanFeatures[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/subscriptions/features"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Feature Matrix</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <span className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  {feature.name}
                </h1>
                <StatusBadge status={feature.status} size="sm" />
              </div>
              <p className="font-mono text-xs text-accent mt-0.5">{feature.code}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/super-admin/subscriptions/features')}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Back to Matrix
          </button>
          <button
            type="button"
            onClick={() => navigate(`/super-admin/subscriptions/features/edit/${feature.id}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer"
          >
            <Edit className="w-4 h-4 stroke-[2.5]" />
            <span>Edit Feature</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
                {feature.category}
              </span>
              <span className="font-mono text-xs text-charcoal-muted">ID: {feature.id}</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Detailed Functional Specification
              </h3>
              <p className="text-sm text-charcoal dark:text-gray-300 leading-relaxed bg-ivory/60 dark:bg-primary-900/30 p-5 rounded-2xl border border-border/80">
                {feature.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Configured Quotas & Resource Boundaries
              </h3>
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/30 border border-border/80 font-mono text-sm font-semibold text-accent">
                {feature.configuredLimits}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Authorized Subscription Tiers ({feature.applicablePlans.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {feature.applicablePlans.map(plan => (
                  <div
                    key={plan}
                    className="p-3.5 rounded-2xl bg-accent/10 border border-accent/30 text-xs font-bold text-primary dark:text-white flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{plan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Operational Meta</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">System Code</span>
                <span className="font-mono font-bold text-accent">{feature.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Target Module</span>
                <span className="font-medium text-primary dark:text-white">{feature.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Registry Status</span>
                <StatusBadge status={feature.status} size="sm" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/super-admin/subscriptions/features/edit/${feature.id}`)}
              className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4 stroke-[2.5]" />
              <span>Modify Feature</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanFeatureDetailPage;

