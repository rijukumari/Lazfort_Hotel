import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, ViewToggle } from '../../components/ui';
import { SubscriptionTable } from '../../components/subscription/SubscriptionTable';
import { SearchFilter } from '../../components/subscription/SearchFilter';
import { SubscriptionNavTabs } from '../../components/subscription/SubscriptionNavTabs';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { hotelApi } from '../../services/hotelApi';
import {
  AlertTriangle,
  DollarSign,
  Sparkles,
  Building2,
  Calendar,
  CreditCard,
  Eye,
  RotateCw,
  Sliders,
} from 'lucide-react';

export const ActiveSubscriptionsPage = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_active_subs') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_active_subs', mode);
    } catch {}
  };

  // Fetch active subscriptions from Laravel MySQL backend with caching
  useEffect(() => {
    let isMounted = true;
    const fetchActiveSubs = async () => {
      try {
        const subs = await hotelApi.getSubscriptions('active');
        if (isMounted && Array.isArray(subs) && subs.length > 0) {
          setSubscriptions(subs);
        }
      } catch (err) {
        console.warn('[ActiveSubscriptionsPage] Backend unavailable, using fallback', err);
      }
    };
    fetchActiveSubs();
    return () => { isMounted = false; };
  }, []);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Computed Metrics
  const totalActiveRevenue = subscriptions.reduce((sum, s) => {
    return sum + (s.billingCycle === 'Annually' ? s.amount : s.amount * 12);
  }, 0);
  const expiringSoonCount = subscriptions.filter(s => s.status === 'expiring_soon').length;
  const trialCount = subscriptions.filter(s => s.status === 'trial').length;

  // Filtered & Paginated List
  const filteredSubscriptions = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    return (subscriptions || []).filter(sub => {
      const subId = (sub.subscriptionId || sub.id || '').toLowerCase();
      const hotelName = (sub.hotelName || sub.hotel_name || '').toLowerCase();
      const hotelLoc = (sub.hotelLocation || sub.location || '').toLowerCase();
      const planName = (sub.planName || sub.plan_name || '').toLowerCase();

      const matchesSearch =
        !term ||
        subId.includes(term) ||
        hotelName.includes(term) ||
        hotelLoc.includes(term) ||
        planName.includes(term);

      const currentPlan = sub.planName || sub.plan_name;
      const currentStatus = sub.status;
      const currentCycle = sub.billingCycle || sub.billing_cycle;

      const matchesPlan = planFilter === 'all' || currentPlan === planFilter;
      const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
      const matchesCycle = cycleFilter === 'all' || currentCycle === cycleFilter;

      return matchesSearch && matchesPlan && matchesStatus && matchesCycle;
    });
  }, [subscriptions, searchTerm, planFilter, statusFilter, cycleFilter]);

  const totalPages = Math.ceil(filteredSubscriptions.length / pageSize) || 1;
  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, currentPage, pageSize]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Active Hotel Subscriptions"
        description="Monitor luxury properties with valid sovereign operational contracts and active platform clearance."
        badge={`${subscriptions.length} Subscriptions`}
      />

      {/* KPI Stats Grid */}
      <StatsGrid cols={3}>
        <StatCard
          title="Active Contract MRR"
          value={`$${Math.round(totalActiveRevenue / 12).toLocaleString()}`}
          change="+14.2%"
          trend="up"
          description="Annual recurring revenue run-rate"
          icon={<DollarSign className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Expiring Within 30 Days"
          value={expiringSoonCount}
          description="Immediate renewal intervention required"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Active Sovereign Trials"
          value={trialCount}
          description="Properties under pre-clearance period"
          icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Filter and Search Bar */}
      <div className="card-luxury p-4 rounded-2xl border border-border/80 dark:border-accent/25">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={val => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by hotel name, subscription ID, location, or tier..."
          filters={[
            {
              key: 'plan',
              label: 'Plan Tier',
              value: planFilter,
              onChange: val => {
                setPlanFilter(val);
                setCurrentPage(1);
              },
              options: [
                { label: 'All Plans', value: 'all' },
                { label: 'Palace Enterprise', value: 'Palace Enterprise' },
                { label: 'Grand Luxury', value: 'Grand Luxury' },
                { label: 'Boutique Elite', value: 'Boutique Elite' },
              ],
            },
            {
              key: 'status',
              label: 'Contract Status',
              value: statusFilter,
              onChange: val => {
                setStatusFilter(val);
                setCurrentPage(1);
              },
              options: [
                { label: 'All Statuses', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Expiring Soon', value: 'expiring_soon' },
                { label: 'Trial Period', value: 'trial' },
              ],
            },
            {
              key: 'cycle',
              label: 'Billing Cycle',
              value: cycleFilter,
              onChange: val => {
                setCycleFilter(val);
                setCurrentPage(1);
              },
              options: [
                { label: 'All Cycles', value: 'all' },
                { label: 'Annual Billing', value: 'Annually' },
                { label: 'Monthly Billing', value: 'Monthly' },
              ],
            },
          ]}
        />
      </div>

      {/* Subscriptions View: Table or Luxury Card Grid */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs text-charcoal-muted">
          Showing <strong className="text-primary dark:text-white">{filteredSubscriptions.length}</strong> active agreements
        </span>
        <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
      </div>

      {viewMode === 'list' ? (
        <SubscriptionTable
          subscriptions={paginatedSubscriptions}
          type="active"
          onViewDetails={sub => navigate(`/super-admin/subscriptions/details/${sub.id}`)}
          onRenew={sub => navigate(`/super-admin/subscriptions/renew/${sub.id}`)}
          onManage={sub => navigate(`/super-admin/subscriptions/manage/${sub.id}`)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSubscriptions.map(sub => (
            <div
              key={sub.id}
              className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">{sub.code || sub.id}</span>
                  <StatusBadge status={sub.status} />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-primary dark:text-white leading-tight">
                    {sub.hotelName}
                  </h4>
                  <p className="text-xs text-accent font-semibold mt-0.5">{sub.planName}</p>
                </div>

                <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Billing Interval:</span>
                    <span className="font-semibold text-primary dark:text-white">{sub.billingCycle}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Next Renewal:</span>
                    <span className="font-mono text-primary dark:text-white">{sub.renewalDate || sub.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Auto-Renew:</span>
                    <span className="font-mono text-emerald-500 font-bold">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block">Contract Value</span>
                  <span className="font-serif font-bold text-lg text-primary dark:text-accent">
                    ${Number(sub.amount || 0).toLocaleString()}
                    <span className="text-xs font-sans text-charcoal-muted font-normal"> / {sub.billingCycle === 'Annually' ? 'yr' : 'mo'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/super-admin/subscriptions/details/${sub.id}`)}
                    className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
                    title="View Agreement Dossier"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/super-admin/subscriptions/renew/${sub.id}`)}
                    className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors flex items-center gap-1 text-xs font-semibold px-2"
                    title="Renew Agreement"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Renew</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ActiveSubscriptionsPage;

