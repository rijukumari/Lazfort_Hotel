import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { SimpleAreaChart } from '../../components/data-display/SimpleChart';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { monthlyRevenueData } from '../../data/mockAnalytics';
import {
  BarChart3,
  Download,
  Calendar,
  BedDouble,
  UtensilsCrossed,
  Sparkles,
  PieChart,
} from 'lucide-react';

export const ReportsPage = () => {
  const {
    rooms = [],
    restaurantOrders = [],
    getOccupancyRate,
    getADR,
    getRevPAR,
  } = useERP();
  const { showToast } = useToast();

  const [dateRange] = useState('This Month (October 2026)');

  const occupancy = getOccupancyRate ? getOccupancyRate() : 88;
  const adr = getADR ? getADR() : 1850;
  const revpar = getRevPAR ? getRevPAR() : 1628;

  const roomRev = rooms.filter(r => r.status === 'occupied').reduce((sum, r) => sum + (r.pricePerNight || 0) * 28, 0) || 1200000;
  const diningRev = restaurantOrders.reduce((sum, o) => sum + (o.totalAmount || 0) * 15, 0) || 180000;
  const spaRev = Math.round(roomRev * 0.15);
  const totalRevenue = roomRev + diningRev + spaRev;

  // Cost estimates
  const cogs = Math.round(diningRev * 0.32);
  const payrollCost = 184500;
  const utilitiesAndOps = 74000;
  const totalOperatingCosts = cogs + payrollCost + utilitiesAndOps;
  const netOperatingProfit = totalRevenue - totalOperatingCosts;
  const profitMargin = Math.round((netOperatingProfit / Math.max(1, totalRevenue)) * 100);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Period\n"
      + `Occupancy Rate,${occupancy}%,${dateRange}\n`
      + `Average Daily Rate (ADR),€${adr},${dateRange}\n`
      + `Revenue Per Available Room (RevPAR),€${revpar},${dateRange}\n`
      + `Room Accommodation Revenue,€${roomRev},${dateRange}\n`
      + `Food & Beverage Revenue,€${diningRev},${dateRange}\n`
      + `Spa & Wellness Revenue,€${spaRev},${dateRange}\n`
      + `Total Gross Revenue,€${totalRevenue},${dateRange}\n`
      + `Net Operating Profit,€${netOperatingProfit},${dateRange}\n`
      + `Operating Profit Margin,${profitMargin}%,${dateRange}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lazfort_ERP_Financial_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'Financial & Operational CSV report generated successfully.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Executive Reports & Business Intelligence"
        description="Lazfort ERP — High-yield performance analytics, ADR & RevPAR benchmarks, department-wise margins, and statutory P&L reconciliations."
        badge="Module M: Business Intelligence"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-primary-900 border border-border dark:border-white/10 rounded-2xl text-xs font-semibold shadow-sm">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{dateRange}</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d"
            >
              <Download className="w-4 h-4" />
              Export Financial CSV
            </button>
          </div>
        }
      />

      {/* Primary KPI Grid */}
      <StatsGrid columns={4}>
        <StatCard
          title="Occupancy Yield"
          value={`${occupancy}%`}
          change="Monaco Portfolio"
          isPositive={occupancy >= 70}
          iconName="Percent"
          subtitle={`${rooms.filter(r => r.status === 'occupied').length} of ${rooms.length} Suites`}
        />
        <StatCard
          title="Average Daily Rate (ADR)"
          value={`€${adr.toLocaleString()}`}
          change="Sovereign Luxury Tier"
          isPositive={true}
          iconName="BedDouble"
          subtitle="Per Occupied Suite/Night"
        />
        <StatCard
          title="Yield Index (RevPAR)"
          value={`€${revpar.toLocaleString()}`}
          change="Top 1% Global Resort"
          isPositive={true}
          iconName="TrendingUp"
          subtitle="Per Available Room Unit"
        />
        <StatCard
          title="Net Operating Margin"
          value={`${profitMargin}%`}
          change={`€${netOperatingProfit.toLocaleString()} EBIT`}
          isPositive={profitMargin >= 35}
          iconName="DollarSign"
          subtitle="Net Departmental Yield"
        />
      </StatsGrid>

      {/* Revenue Performance Chart */}
      <div className="card-luxury-3d p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              Revenue Growth Trajectory (Trailing 12 Months)
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
              Consolidated room nights, Michelin 3-star dining, and private royal spa revenue
            </p>
          </div>
          <span className="font-mono text-sm font-bold text-accent px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30">
            €{totalRevenue.toLocaleString()} Total Revenue
          </span>
        </div>

        <SimpleAreaChart data={monthlyRevenueData} valuePrefix="€" height={280} />
      </div>

      {/* Department Breakdown & P&L Statement Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Revenue Breakdown */}
        <div className="card-luxury-3d p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent" />
              Departmental Revenue Shares
            </h3>
            <span className="text-xs font-mono text-accent">100% Reconciled</span>
          </div>

          <div className="space-y-4">
            {/* Rooms */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-primary dark:text-gray-200">
                  <BedDouble className="w-4 h-4 text-accent" />
                  Luxury Suite Accommodation
                </span>
                <span className="font-mono">€{roomRev.toLocaleString()} ({Math.round((roomRev / totalRevenue) * 100)}%)</span>
              </div>
              <div className="h-2 w-full bg-ivory dark:bg-black/40 rounded-full overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(roomRev / totalRevenue) * 100}%` }} />
              </div>
            </div>

            {/* Dining */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-primary dark:text-gray-200">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-500" />
                  Food, Beverage & Fine Wine
                </span>
                <span className="font-mono">€{diningRev.toLocaleString()} ({Math.round((diningRev / totalRevenue) * 100)}%)</span>
              </div>
              <div className="h-2 w-full bg-ivory dark:bg-black/40 rounded-full overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(diningRev / totalRevenue) * 100}%` }} />
              </div>
            </div>

            {/* Spa */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-primary dark:text-gray-200">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Royal Spa & Wellness Rejuvenation
                </span>
                <span className="font-mono">€{spaRev.toLocaleString()} ({Math.round((spaRev / totalRevenue) * 100)}%)</span>
              </div>
              <div className="h-2 w-full bg-ivory dark:bg-black/40 rounded-full overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${(spaRev / totalRevenue) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Profit & Loss Statement */}
        <div className="card-luxury-3d p-6 sm:p-7 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Executive Profit & Loss Statement (P&L)
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50 text-charcoal/80 dark:text-gray-300">
              <span>Gross Hospitality Operating Revenues:</span>
              <span className="font-mono font-bold text-primary dark:text-white">€{totalRevenue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/50 text-rose-600 dark:text-rose-400">
              <span>Cost of Goods Sold (F&B Provisions & Amenities):</span>
              <span className="font-mono">-€{cogs.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/50 text-rose-600 dark:text-rose-400">
              <span>Staff Salaries & Executive Compensation:</span>
              <span className="font-mono">-€{payrollCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/50 text-rose-600 dark:text-rose-400">
              <span>Utilities, Thermal Climate & Maintenance:</span>
              <span className="font-mono">-€{utilitiesAndOps.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-2 border-t-2 border-accent/40 font-bold text-sm text-emerald-600 dark:text-emerald-400">
              <span>Net Operating Income (EBITDA):</span>
              <span className="font-mono">€{netOperatingProfit.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 text-xs text-charcoal-muted">
              <span>Audited Return on Capital (ROC):</span>
              <span className="font-mono font-semibold text-accent">34.8% Annualized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

