import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { SimpleAreaChart } from '../../../components/data-display/SimpleChart';
import { monthlyRevenueData, roomCategoryDistribution } from '../../../data/mockAnalytics';
import { useToast } from '../../../context/ToastContext';
import {
  Building2,
  Users,
  Crown,
  DollarSign,
  Calendar,
  Download,
  TrendingUp,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const PlatformReportsPage = () => {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState('30d');

  const handleExportCSV = () => {
    const headers = ['Property', 'Region', 'Suites', 'Occupancy (%)', 'Gross Revenue (USD)', 'ADR'];
    const rows = [
      ['"Lazfort Grand Palace Monaco"', '"Monaco / Côte d\'Azur"', 120, '94.2%', '$1,840,000', '$2,450'],
      ['"The Ritz-Crest Alpine Sanctuary"', '"St. Moritz / Swiss Alps"', 84, '88.5%', '$1,290,000', '$1,850'],
      ['"Seraphina Azure Lagoon Resort"', '"Bora Bora / French Polynesia"', 45, '96.8%', '$980,000', '$3,100'],
      ['"The Golden Pavilion Heritage Manor"', '"Kyoto / Japan"', 52, '91.0%', '$740,000', '$1,620'],
      ['"Villa Bellissima Bellagio"', '"Lake Como / Italy"', 38, '89.4%', '$620,000', '$1,950'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `platform_performance_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', `Generated platform performance ledger for ${dateRange.toUpperCase()}.`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Executive Platform Reports"
        subtitle="Global portfolio performance metrics, aggregate ADR yields, room distribution, and consolidated revenue trends"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'Platform Reports', path: '/super-admin/reports' },
          { label: 'Overview' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-ivory dark:bg-white/5 border border-border dark:border-white/10 rounded-xl p-1 text-xs">
              {['7d', '30d', '90d', 'ytd'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold transition-colors ${dateRange === range
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white'
                    }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Portfolio CSV
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={5}>
        <StatCard
          title="Connected Hotels"
          value="18"
          change="+16.6%"
          isPositive={true}
          period="portfolio resorts"
          icon={<Building2 className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Active Operator Users"
          value="184"
          change="+8.2%"
          isPositive={true}
          period="staff credentials"
          icon={<Users className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Active Subscriptions"
          value="16"
          change="+100%"
          isPositive={true}
          period="enterprise billing"
          icon={<Crown className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Portfolio Gross Rev"
          value="$5,470,000"
          change="+18.4%"
          isPositive={true}
          period="30-day realized"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Active Global Bookings"
          value="3,842"
          change="+12.6%"
          isPositive={true}
          period="across all properties"
          icon={<Calendar className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 card-luxury p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Consolidated Portfolio Gross Revenue
              </h3>
              <p className="text-xs text-charcoal-muted">
                Trailing 6 months cross-property revenue in USD ($)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-primary dark:text-white font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                2026 Actual
              </span>
              <span className="flex items-center gap-1.5 text-charcoal-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B2432] dark:bg-white/30" />
                2025 Target
              </span>
            </div>
          </div>

          <div className="py-2">
            <SimpleAreaChart
              data={monthlyRevenueData}
              height={260}
              valuePrefix="$"
              color="#C6A66B"
              secondaryColor="#1B2432"
              showSecondary={true}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border dark:border-white/10 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Peak Month</span>
              <span className="text-base font-serif font-bold text-accent">August 2026</span>
              <span className="text-[11px] text-emerald-600 block font-mono">$1,680,000 USD</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Average Monthly ADR</span>
              <span className="text-base font-serif font-bold text-primary dark:text-white">$1,890 / night</span>
              <span className="text-[11px] text-charcoal-muted block font-mono">+6.2% YoY yield</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Portfolio RevPAR</span>
              <span className="text-base font-serif font-bold text-emerald-600">$1,720</span>
              <span className="text-[11px] text-charcoal-muted block font-mono">91.8% portfolio occupancy</span>
            </div>
          </div>
        </div>

        {/* Right Card: Suite Breakdown */}
        <div className="card-luxury p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Inventory Tier Allocation
            </h3>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>

          <div className="space-y-4">
            {roomCategoryDistribution.map(cat => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-charcoal dark:text-gray-300">{cat.label}</span>
                  <span className="font-mono text-accent font-bold">{cat.percentage}% ({cat.count})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-ivory dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 text-xs space-y-1">
            <span className="font-semibold text-primary dark:text-white block">
              78 Dedicated Luxury Suites
            </span>
            <p className="text-charcoal-muted text-[11px] leading-relaxed">
              Consolidated across 5 premier sovereign flagship properties. 98.4% uptime on smart IoT amenities.
            </p>
          </div>
        </div>
      </div>

      {/* Regional Performance Table */}
      <div className="card-luxury p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white">
            Flagship Properties Performance Matrix
          </h3>
          <span className="text-xs text-charcoal-muted font-mono">Audited Central Ledger Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory dark:bg-white/5 border-b border-border dark:border-white/10 text-[10px] font-mono text-charcoal-muted uppercase">
              <tr>
                <th className="py-3 px-4">Property Name</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4 text-center">Total Suites</th>
                <th className="py-3 px-4 text-center">Occupancy Rate</th>
                <th className="py-3 px-4 text-right">Trailing Revenue</th>
                <th className="py-3 px-4 text-right">ADR</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                  Lazfort Grand Palace Monaco
                </td>
                <td className="py-3.5 px-4 text-charcoal-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" />
                  Monaco, French Riviera
                </td>
                <td className="py-3.5 px-4 text-center font-mono">120</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">94.2%</td>
                <td className="py-3.5 px-4 text-right font-serif font-bold text-primary dark:text-white">$1,840,000</td>
                <td className="py-3.5 px-4 text-right font-mono text-accent">$2,450</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    OPTIMAL
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                  The Ritz-Crest Alpine Sanctuary
                </td>
                <td className="py-3.5 px-4 text-charcoal-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" />
                  St. Moritz, Switzerland
                </td>
                <td className="py-3.5 px-4 text-center font-mono">84</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">88.5%</td>
                <td className="py-3.5 px-4 text-right font-serif font-bold text-primary dark:text-white">$1,290,000</td>
                <td className="py-3.5 px-4 text-right font-mono text-accent">$1,850</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    OPTIMAL
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                  Seraphina Azure Lagoon Resort
                </td>
                <td className="py-3.5 px-4 text-charcoal-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" />
                  Bora Bora, French Polynesia
                </td>
                <td className="py-3.5 px-4 text-center font-mono">45</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">96.8%</td>
                <td className="py-3.5 px-4 text-right font-serif font-bold text-primary dark:text-white">$980,000</td>
                <td className="py-3.5 px-4 text-right font-mono text-accent">$3,100</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    OPTIMAL
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                  The Golden Pavilion Heritage Manor
                </td>
                <td className="py-3.5 px-4 text-charcoal-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent" />
                  Kyoto, Japan
                </td>
                <td className="py-3.5 px-4 text-center font-mono">52</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">91.0%</td>
                <td className="py-3.5 px-4 text-right font-serif font-bold text-primary dark:text-white">$740,000</td>
                <td className="py-3.5 px-4 text-right font-mono text-accent">$1,620</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    OPTIMAL
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlatformReportsPage;

