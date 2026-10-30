import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge, ConfirmDialog, EmptyState } from '../../components/ui';
import { PlanCard } from '../../components/subscription/PlanCard';
import { SearchFilter } from '../../components/subscription/SearchFilter';
import { SubscriptionNavTabs } from '../../components/subscription/SubscriptionNavTabs';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';
import {
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  Trash2,
} from 'lucide-react';

export const SubscriptionPlansPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { subscriptionPlans = [], updateSubscriptionPlan, deleteSubscriptionPlan } = useERP();
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [viewMode, setViewMode] = useState('grid');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [planToToggle, setPlanToToggle] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    return subscriptionPlans
      .filter(plan => {
        const matchesSearch =
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.tierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' || plan.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.monthlyPrice - b.monthlyPrice;
        if (sortBy === 'price-desc') return b.monthlyPrice - a.monthlyPrice;
        if (sortBy === 'rooms') {
          const aR = a.roomLimit === 'Unlimited' ? 99999 : Number(a.roomLimit);
          const bR = b.roomLimit === 'Unlimited' ? 99999 : Number(b.roomLimit);
          return bR - aR;
        }
        return 0;
      });
  }, [subscriptionPlans, searchTerm, statusFilter, sortBy]);

  const handleConfirmToggleStatus = () => {
    if (!planToToggle) return;
    const nextStatus = planToToggle.status === 'active' ? 'inactive' : 'active';
    updateSubscriptionPlan(planToToggle.id, { status: nextStatus });
    showToast(
      'Plan Status Updated',
      `Plan "${planToToggle.name}" has been marked as ${nextStatus}.`,
      'info'
    );
    setPlanToToggle(null);
  };

  const handleConfirmDelete = () => {
    if (!deletePlanId) return;
    deleteSubscriptionPlan(deletePlanId);
    setDeletePlanId(null);
    showToast('Plan Removed', 'Subscription tier removed successfully.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Subscription Plans & Commercial Tiers"
        description="Configure luxury hotel subscription plans, room thresholds, module clearances, and trial durations."
        badge={`${plans.length} Commercial Plans`}
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/90 dark:bg-primary-900/90 border border-border/80 dark:border-accent/25 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'grid'
                  ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                  : 'text-charcoal-muted hover:text-accent'
                  }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'table'
                  ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                  : 'text-charcoal-muted hover:text-accent'
                  }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/super-admin/subscriptions/plans/add')}
            >
              Add New Plan
            </Button>
          </div>
        }
      />

      {/* Navigation Sub-Tabs */}
      <SubscriptionNavTabs activeTab="plans" />

      {/* Filter Toolbar */}
      <div className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-accent/25 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/60 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Display Pricing Cycle:
            </span>
            <div className="flex items-center bg-ivory/60 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 rounded-xl p-1 whitespace-nowrap shrink-0">
              <button
                onClick={() => setBillingCycle('Monthly')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${billingCycle === 'Monthly'
                  ? 'gold-gradient-bg text-primary-950 font-bold shadow-sm'
                  : 'text-charcoal-muted hover:text-accent'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('Annually')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${billingCycle === 'Annually'
                  ? 'gold-gradient-bg text-primary-950 font-bold shadow-sm'
                  : 'text-charcoal-muted hover:text-accent'
                  }`}
              >
                <span>Annually</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500 text-white font-mono font-bold whitespace-nowrap">
                  SAVE 15%
                </span>
              </button>
            </div>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={val => setSearchTerm(val)}
          searchPlaceholder="Search plans by name, tier code, or features..."
          totalResults={filteredPlans.length}
          onReset={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setSortBy('default');
          }}
          dropdowns={[
            {
              key: 'status',
              label: 'Availability Status',
              value: statusFilter,
              onChange: val => setStatusFilter(val),
              options: [
                { label: 'All Statuses', value: 'all' },
                { label: 'Active Plans', value: 'active' },
                { label: 'Inactive / Sunset', value: 'inactive' },
              ],
            },
            {
              key: 'sort',
              label: 'Sort Hierarchy',
              value: sortBy,
              onChange: val => setSortBy(val),
              options: [
                { label: 'Recommended Tier Order', value: 'default' },
                { label: 'Price: Lowest to Highest', value: 'price-asc' },
                { label: 'Price: Highest to Lowest', value: 'price-desc' },
                { label: 'Room Limit: Largest First', value: 'rooms' },
              ],
            },
          ]}
        />
      </div>

      {/* Main Listing View */}
      {filteredPlans.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Subscription Plans Found"
          description="No commercial plans match your query. Adjust your filters or create a new plan."
          action={
            <Button variant="gold" onClick={() => navigate('/super-admin/subscriptions/plans/add')}>
              Create Commercial Plan
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onToggleStatus={() => setPlanToToggle(plan)}
              onEdit={() => navigate(`/super-admin/subscriptions/plans/edit/${plan.id}`)}
              onViewDetails={() => navigate(`/super-admin/subscriptions/plans/details/${plan.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="card-luxury rounded-2xl border border-border/80 dark:border-accent/25 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory/80 dark:bg-primary-900/60 border-b border-border/80 dark:border-white/10 uppercase font-mono text-[10px] text-charcoal-muted tracking-wider">
                <tr>
                  <th className="py-3 px-4">Commercial Plan</th>
                  <th className="py-3 px-4">Monthly Tariff</th>
                  <th className="py-3 px-4">Annual Tariff</th>
                  <th className="py-3 px-4">Room Threshold</th>
                  <th className="py-3 px-4">Seat Allocation</th>
                  <th className="py-3 px-4">Trial Period</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredPlans.map(plan => (
                  <tr key={plan.id} className="hover:bg-ivory/40 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-primary dark:text-white font-serif text-[13px]">
                        {plan.name}
                      </p>
                      <span className="font-mono text-[10px] text-accent font-bold uppercase">
                        {plan.tierCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-serif font-bold text-accent text-sm">
                      ${plan.monthlyPrice.toLocaleString()} / mo
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-serif font-bold text-primary dark:text-gray-200 text-sm">
                      ${plan.annualPrice.toLocaleString()} / yr
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {plan.roomLimit === 'Unlimited' ? 'Unlimited' : `${plan.roomLimit} Suites`}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {plan.userLimit === 'Unlimited' ? 'Unlimited' : `${plan.userLimit} Users`}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {plan.trialDays} Days
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={plan.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => navigate(`/super-admin/subscriptions/plans/details/${plan.id}`)}
                          className="px-2.5 py-1 text-xs rounded-xl btn-secondary-3d cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => navigate(`/super-admin/subscriptions/plans/edit/${plan.id}`)}
                          className="px-2.5 py-1 text-xs rounded-xl border border-border dark:border-border-dark hover:text-accent cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletePlanId(plan.id)}
                          className="p-1 text-xs rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      {planToToggle && (
        <ConfirmDialog
          isOpen={!!planToToggle}
          onCancel={() => setPlanToToggle(null)}
          onConfirm={handleConfirmToggleStatus}
          title={planToToggle.status === 'active' ? 'Deactivate Commercial Plan?' : 'Reactivate Commercial Plan?'}
          message={`Are you sure you want to ${planToToggle.status === 'active' ? 'deactivate' : 'reactivate'} the ${planToToggle.name} plan?`}
          confirmText={planToToggle.status === 'active' ? 'Deactivate Plan' : 'Activate Plan'}
          confirmVariant={planToToggle.status === 'active' ? 'danger' : 'gold'}
        />
      )}

      {deletePlanId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeletePlanId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Commercial Subscription Tier?"
          message="Are you sure you want to permanently delete this subscription plan? Existing hotels subscribed to this plan will maintain current billing terms until renewal."
          confirmText="Confirm Delete"
          variant="danger"
        />
      )}
    </div>
  );
};

export default SubscriptionPlansPage;

