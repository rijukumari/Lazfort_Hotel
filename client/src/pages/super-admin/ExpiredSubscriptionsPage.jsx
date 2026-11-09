import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, ViewToggle } from '../../components/ui';
import { SubscriptionTable } from '../../components/subscription/SubscriptionTable';
import { SearchFilter } from '../../components/subscription/SearchFilter';
import { SubscriptionNavTabs } from '../../components/subscription/SubscriptionNavTabs';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { useToast } from '../../context/ToastContext';
import { hotelApi } from '../../services/hotelApi';
import {
  Clock,
  RotateCw,
  AlertOctagon,
  TrendingDown,
  Info,
  Building2,
  Calendar,
  Eye,
} from 'lucide-react';

export const ExpiredSubscriptionsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [expiredSubs, setExpiredSubs] = useState([]);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_expired_subs') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_expired_subs', mode);
    } catch { }
  };

  // Fetch expired subscriptions from Laravel MySQL backend with caching
  useEffect(() => {
    let isMounted = true;
    const fetchExpiredSubs = async () => {
      try {
        const subs = await hotelApi.getSubscriptions('expired');
        if (isMounted && Array.isArray(subs) && subs.length > 0) {
          setExpiredSubs(subs);
        }
      } catch (err) {
        console.warn('[ExpiredSubscriptionsPage] Backend unavailable, using fallback', err);
      }
    };
    fetchExpiredSubs();
    return () => { isMounted = false; };
  }, []);

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
    const term = (searchTerm || '').toLowerCase().trim();
    return (expiredSubs || []).filter(sub => {
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
      const matchesPlan = planFilter === 'all' || currentPlan === planFilter;

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

      {/* Subscriptions View: Table or Luxury Card Grid */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs text-charcoal-muted">
          Showing <strong className="text-primary dark:text-white">{filteredSubs.length}</strong> lapsed subscriptions
        </span>
        <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
      </div>

      {viewMode === 'list' ? (
        <SubscriptionTable
          subscriptions={paginatedSubs}
          type="expired"
          onViewDetails={sub => navigate(`/super-admin/subscriptions/details/${sub.id}`)}
          onRenew={sub => navigate(`/super-admin/subscriptions/renew/${sub.id}`)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSubs.map(sub => (
            <div
              key={sub.id}
              className="card-luxury p-5 rounded-2xl border border-rose-500/20 dark:border-rose-500/10 space-y-4 hover:border-rose-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">{sub.code || sub.id}</span>
                  <StatusBadge status="expired" />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-primary dark:text-white leading-tight">
                    {sub.hotelName}
                  </h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">Previous Plan: {sub.planName}</p>
                </div>

                <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Lapsed Date:</span>
                    <span className="font-mono text-rose-500 font-semibold">{sub.expiryDate || sub.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Prior Tariff:</span>
                    <span className="font-mono font-semibold text-primary dark:text-white">${Number(sub.amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-rose-500 font-mono">Service Discontinued</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/super-admin/subscriptions/details/${sub.id}`)}
                    className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
                    title="View Dossier"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/super-admin/subscriptions/renew/${sub.id}`)}
                    className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors flex items-center gap-1 text-xs font-semibold px-2.5"
                    title="Renew Lapsed Agreement"
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

export default ExpiredSubscriptionsPage;

