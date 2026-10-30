import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { mockActiveSubscriptions } from '../../data/mockSubscriptions';
import { SubscriptionTable } from '../../components/subscription/SubscriptionTable';
import { SearchFilter } from '../../components/subscription/SearchFilter';
import { SubscriptionNavTabs } from '../../components/subscription/SubscriptionNavTabs';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  AlertTriangle,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export const ActiveSubscriptionsPage = () => {
  const navigate = useNavigate();
  const [subscriptions] = useState(mockActiveSubscriptions);

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
    return subscriptions.filter(sub => {
      const matchesSearch =
        sub.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.hotelLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.planName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPlan = planFilter === 'all' || sub.planName === planFilter;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesCycle = cycleFilter === 'all' || sub.billingCycle === cycleFilter;

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

      {/* Navigation Sub-Tabs */}
      <SubscriptionNavTabs activeTab="active" />

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

      {/* Subscriptions Table */}
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
    </div>
  );
};

export default ActiveSubscriptionsPage;

