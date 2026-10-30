import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { mockExpiredSubscriptions } from '../../data/mockSubscriptions';
import { SubscriptionTable } from '../../components/subscription/SubscriptionTable';
import { SearchFilter } from '../../components/subscription/SearchFilter';
import { SubscriptionNavTabs } from '../../components/subscription/SubscriptionNavTabs';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  RotateCw,
  AlertOctagon,
  TrendingDown,
  Info,
} from 'lucide-react';

export const ExpiredSubscriptionsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [expiredSubs, setExpiredSubs] = useState(mockExpiredSubscriptions);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Computed Metrics
  const totalLapsedRevenue = expiredSubs.reduce((sum, s) => {
    return sum + (s.billingCycle === 'Annually' ? s.amount : s.amount * 12);
  }, 0);
  const averageLapsedDays = Math.round(
    expiredSubs.reduce((sum, s) => sum + (s.lapsedDays || 0), 0) / (expiredSubs.length || 1)
  );

  const filteredSubs = useMemo(() => {
    return expiredSubs.filter(sub => {
      const matchesSearch =
        sub.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.hotelLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.planName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPlan = planFilter === 'all' || sub.planName === planFilter;

      return matchesSearch && matchesPlan;
    });
  }, [expiredSubs, searchTerm, planFilter]);

  const totalPages = Math.ceil(filteredSubs.length / pageSize) || 1;
  const paginatedSubs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubs.slice(start, start + pageSize);
  }, [filteredSubs, currentPage, pageSize]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Expired & Lapsed Subscriptions"
        description="Historical log of ended terms, seasonal suspensions, renewal negotiation records, and past property clearances."
        badge={`${expiredSubs.length} Lapsed Properties`}
      />

      {/* Subscription Management Sub-Navigation Tabs */}
      <SubscriptionNavTabs activeTab="expired" expiredCount={expiredSubs.length} />

      {/* Top Stats Overview */}
      <StatsGrid columns={4}>
        <StatCard
          title="Total Lapsed Properties"
          value={expiredSubs.length}
          change="Seasonal / Off-Market"
          isPositive={false}
          iconName="AlertOctagon"
          subtitle="Non-Active Clearances"
        />
        <StatCard
          title="Unrealized Pipeline Run-Rate"
          value={`$${(totalLapsedRevenue / 1000).toFixed(0)}k`}
          change="Reactivation Opportunity"
          isPositive={false}
          iconName="TrendingDown"
          subtitle="Annualized Tariff Lapsed"
        />
        <StatCard
          title="Average Days Since Expiry"
          value={`${averageLapsedDays} Days`}
          change="Follow-Up Window Active"
          isPositive={true}
          iconName="Clock"
          subtitle="Mean Lapse Tenure"
        />
        <StatCard
          title="Direct Reactivation Rate"
          value="75%"
          change="Seasonal Return Standard"
          isPositive={true}
          iconName="RotateCw"
          subtitle="Historic Re-enlistment"
        />
      </StatsGrid>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-primary dark:text-white">
              Sovereign Clearance Paused for Lapsed Accounts
            </p>
            <p className="text-charcoal-muted dark:text-gray-300 mt-0.5">
              These luxury properties cannot allocate reservations or access customer modules until an authorized renewal term is ratified.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-accent/25">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={val => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search expired subscriptions by ID, hotel property, or territory..."
          totalResults={filteredSubs.length}
          onReset={() => {
            setSearchTerm('');
            setPlanFilter('all');
            setCurrentPage(1);
          }}
          dropdowns={[
            {
              key: 'plan',
              label: 'Previous Plan Tier',
              value: planFilter,
              onChange: val => {
                setPlanFilter(val);
                setCurrentPage(1);
              },
              options: [
                { label: 'All Plan Tiers', value: 'all' },
                { label: 'Palace Enterprise', value: 'Palace Enterprise' },
                { label: 'Grand Luxury', value: 'Grand Luxury' },
                { label: 'Boutique Elite', value: 'Boutique Elite' },
              ],
            },
          ]}
        />
      </div>

      {/* Expired Subscriptions Table */}
      <SubscriptionTable
        subscriptions={paginatedSubs}
        type="expired"
        onViewDetails={sub => navigate(`/super-admin/subscriptions/details/${sub.id}`)}
        onRenew={sub => navigate(`/super-admin/subscriptions/renew/${sub.id}`)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ExpiredSubscriptionsPage;

