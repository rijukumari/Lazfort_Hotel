import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, Card } from '../../../components/ui';
import { SimpleAreaChart, SimpleBarChart } from '../../../components/data-display/SimpleChart';
import { monthlyRevenueData } from '../../../data/mockAnalytics';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Calendar,
  UtensilsCrossed,
  Sparkles,
  PieChart,
  Percent,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RevenueAnalyticsPage = () => {
  const navigate = useNavigate();
  const {
    bookings,
    folios = [],
    restaurantOrders = [],
    getOccupancyRate,
    getRevPAR,
    getADR,
  } = useERP();
  const { showToast } = useToast();

  const [dateRange, setDateRange] = useState('mtd'); // 'today' | 'mtd' | 'ytd'

  const occupancyRate = getOccupancyRate();
  const revpar = getRevPAR();
  const adr = getADR ? getADR() : Math.round(revpar / Math.max(0.01, occupancyRate / 100));

  // Folio Revenue Calculations
  const roomRevenue = folios.reduce((sum, f) => {
    const roomCharges = (f.charges || []).filter(c => c.category === 'room_charge' || !c.category);
    return sum + roomCharges.reduce((chgSum, c) => chgSum + (c.totalAmount || c.amount || 0), 0);
  }, 0) || 1240000;

  const diningRevenue = folios.reduce((sum, f) => {
    const diningCharges = (f.charges || []).filter(c => c.category === 'dining' || c.category === 'restaurant');
    return sum + diningCharges.reduce((chgSum, c) => chgSum + (c.totalAmount || c.amount || 0), 0);
  }, 0) + (restaurantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)) || 185000;

  const ancillaryRevenue = folios.reduce((sum, f) => {
    const extraCharges = (f.charges || []).filter(c => c.category === 'spa' || c.category === 'transport' || c.category === 'concierge');
    return sum + extraCharges.reduce((chgSum, c) => chgSum + (c.totalAmount || c.amount || 0), 0);
  }, 0) || 65000;

  const totalConsolidatedRevenue = roomRevenue + diningRevenue + ancillaryRevenue;

  // Daily revenue data
  const dailyPaceData = [
    { label: '24 Oct', value: 46000 },
    { label: '25 Oct', value: 52000 },
    { label: '26 Oct', value: 49000 },
    { label: '27 Oct', value: 58000 },
    { label: '28 Oct', value: 61000 },
    { label: '29 Oct', value: 64000 },
    { label: '30 Oct (Today)', value: 54000 },
  ];

  // Payment method breakdown
  const paymentMethods = [
    { name: 'Centurion & Luxury Amex', amount: Math.round(totalConsolidatedRevenue * 0.54), percentage: 54, color: '#C6A66B' },
    { name: 'International Bank Wire', amount: Math.round(totalConsolidatedRevenue * 0.28), percentage: 28, color: '#1B2432' },
    { name: 'Visa Infinite / Mastercard World', amount: Math.round(totalConsolidatedRevenue * 0.15), percentage: 15, color: '#4F772D' },
    { name: 'Private Escrow / Crypto Deposit', amount: Math.round(totalConsolidatedRevenue * 0.03), percentage: 3, color: '#B5838D' },
  ];

  const handleExportCSV = () => {
    const csvRows = [
      ["Revenue Stream", "Amount (USD)", "Contribution"],
      ["Suite Accommodation Revenue", roomRevenue, `${Math.round((roomRevenue / totalConsolidatedRevenue) * 100)}%`],
      ["Michelin Dining & Room Service", diningRevenue, `${Math.round((diningRevenue / totalConsolidatedRevenue) * 100)}%`],
      ["Ancillary & Concierge Services", ancillaryRevenue, `${Math.round((ancillaryRevenue / totalConsolidatedRevenue) * 100)}%`],
      ["TOTAL CONSOLIDATED REVENUE", totalConsolidatedRevenue, "100%"],
      [],
      ["Metric", "Value"],
      ["Average Daily Rate (ADR)", `$${adr}`],
      ["Revenue Per Available Room (RevPAR)", `$${revpar}`],
      ["Occupancy Multiplier", `${occupancyRate}%`],
    ];
    const csvContent = csvRows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Revenue_Telemetry_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Report Downloaded', 'Consolidated financial report saved successfully.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Revenue & Yield Telemetry"
        description="Comprehensive accounting analysis — Net room yield, food & beverage billings, Average Daily Rate (ADR), RevPAR, and settlement channel distribution."
        badge={`$${(totalConsolidatedRevenue / 1000000).toFixed(2)}M Consolidated MTD`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export Financials
            </Button>
            <Button
              variant="gold"
              icon={Receipt}
              onClick={() => navigate('/hotel-admin/finance')}
            >
              General Ledger
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={`$${(totalConsolidatedRevenue / 1000000).toFixed(2)}M`}
          change="+18.4% vs Prior Month"
          isPositive={true}
          icon={DollarSign}
          subtitle="All property departments MTD"
        />
        <StatCard
          title="Suite Yield (ADR)"
          value={`$${adr.toLocaleString()}`}
          change="+$180 vs Season Base"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Average Nightly Realized Rate"
        />
        <StatCard
          title="RevPAR (Yield Index)"
          value={`$${revpar.toLocaleString()}`}
          change={`${occupancyRate}% Occupancy Factor`}
          isPositive={true}
          icon={Percent}
          subtitle="Revenue per Available Room"
        />
        <StatCard
          title="F&B & Ancillary Revenue"
          value={`$${(diningRevenue + ancillaryRevenue).toLocaleString()}`}
          change={`${Math.round(((diningRevenue + ancillaryRevenue) / totalConsolidatedRevenue) * 100)}% of Total Revenue`}
          isPositive={true}
          icon={UtensilsCrossed}
          subtitle="Dining, Spa & Yacht Charters"
        />
      </div>

      {/* Main Revenue Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue History Chart */}
        <div className="lg:col-span-2 card-luxury-3d p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
                Monthly Folio Billing Velocity
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Comparison of actual revenue against luxury hospitality industry benchmark
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-charcoal-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Actual
              </span>
              <span className="flex items-center gap-1.5 text-xs text-charcoal-muted ml-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-950 dark:bg-white/40" /> Target
              </span>
            </div>
          </div>

          <SimpleAreaChart
            data={monthlyRevenueData}
            valuePrefix="$"
            height={260}
            showSecondary={true}
          />
        </div>

        {/* 7-Day Revenue Pace */}
        <div className="card-luxury-3d p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                7-Day Daily Run Rate
              </h3>
              <span className="text-xs font-mono font-bold text-accent">Pace: High</span>
            </div>

            <div className="mt-4">
              <SimpleBarChart data={dailyPaceData} height={200} valueSuffix="k" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-xs text-charcoal-muted mt-4">
            <p className="font-bold text-primary dark:text-white">Weekend Surge Expected</p>
            <p className="mt-0.5">Saturday Grand Suite bookings forecast to deliver $85,000+ single-day revenue.</p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown by Stream & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Revenue Streams */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Revenue by Operating Department
            </h3>
            <span className="text-xs text-charcoal-muted">MTD Breakdown</span>
          </div>

          <div className="space-y-4">
            {/* Stream 1 */}
            <div className="p-3.5 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-primary dark:text-white">Suite & Villa Accommodations</span>
                <span className="font-mono font-bold text-accent">${roomRevenue.toLocaleString()} ({Math.round((roomRevenue / totalConsolidatedRevenue) * 100)}%)</span>
              </div>
              <div className="h-2 w-full bg-ivory dark:bg-primary-950 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${Math.round((roomRevenue / totalConsolidatedRevenue) * 100)}%` }} />
              </div>
            </div>

            {/* Stream 2 */}
            <div className="p-3.5 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-primary dark:text-white">Michelin Dining & Private Room Service</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${diningRevenue.toLocaleString()} ({Math.round((diningRevenue / totalConsolidatedRevenue) * 100)}%)</span>
              </div>
              <div className="h-2 w-full bg-ivory dark:bg-primary-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((diningRevenue / totalConsolidatedRevenue) * 100)}%` }} />
              </div>
            </div>

            {/* Stream 3 */}
            <div className="p-3.5 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-primary dark:text-white">Wellness Spa, Chauffeur & Helipad Concierge</span>
                <span className="font-mono font-bold text-indigo-500">${ancillaryRevenue.toLocaleString()} ({Math.round((ancillaryRevenue / totalConsolidatedRevenue) * 100)}%)</span>
              </div>
              <div className="h-2 w-full bg-ivory dark:bg-primary-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.round((ancillaryRevenue / totalConsolidatedRevenue) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Settlement & Payment Channel Breakdown */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Settlement & Payment Channels
            </h3>
            <span className="text-xs text-charcoal-muted">Cleared Funds</span>
          </div>

          <div className="space-y-4">
            {paymentMethods.map(pm => (
              <div key={pm.name} className="space-y-1.5 p-3 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-primary dark:text-white flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-accent" />
                    {pm.name}
                  </span>
                  <span className="font-mono font-bold text-accent">${pm.amount.toLocaleString()} ({pm.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-ivory dark:bg-primary-950 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pm.percentage}%`, backgroundColor: pm.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsPage;

