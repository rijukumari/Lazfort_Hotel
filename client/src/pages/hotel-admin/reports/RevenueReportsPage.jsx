import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { useERP } from '../../../context/ERPContext';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  BedDouble,
  UtensilsCrossed,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const RevenueReportsPage = () => {
  const { rooms = [], restaurantOrders = [], getADR, getRevPAR } = useERP();
  const [period, setPeriod] = useState('2026-YTD');

  const adr = getADR ? getADR() : 1850;
  const revpar = getRevPAR ? getRevPAR() : 1628;

  const roomRev = 1420000;
  const fnbRev = 385000;
  const spaRev = 195000;
  const eventsRev = 260000;
  const totalRevenue = roomRev + fnbRev + spaRev + eventsRev;

  const monthlyGrowth = [
    { month: 'Jun', revenue: 310000, growth: '+12%' },
    { month: 'Jul', revenue: 360000, growth: '+16%' },
    { month: 'Aug', revenue: 410000, growth: '+21%' },
    { month: 'Sep', revenue: 380000, growth: '+14%' },
    { month: 'Oct', revenue: 425000, growth: '+19%' },
    { month: 'Nov (Proj)', revenue: 375000, growth: '+15%' },
  ];

  const departmentStreams = [
    { name: 'Chamber & Penthouse Accommodation', amount: roomRev, pct: 63, color: 'bg-accent' },
    { name: 'Michelin Dining & Sommelier Cellar', amount: fnbRev, pct: 17, color: 'bg-emerald-500' },
    { name: 'Private Events & Yacht Charters', amount: eventsRev, pct: 11, color: 'bg-blue-500' },
    { name: 'Royal Thalasso Sanctuary & Spa', amount: spaRev, pct: 9, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Revenue & Financial Reports"
        description="Consolidated portfolio yield, department revenue distribution, and statutory ADR & RevPAR benchmarks."
        badge={`$${(totalRevenue).toLocaleString()} YTD`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={`$${(totalRevenue).toLocaleString()}`}
          change="+18.4% YoY"
          isPositive={true}
          icon={DollarSign}
          subtitle="All luxury departments"
        />
        <StatCard
          title="Average Daily Rate (ADR)"
          value={`$${adr}`}
          change="Premium Monaco tier"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Per occupied suite"
        />
        <StatCard
          title="RevPAR"
          value={`$${revpar}`}
          change="88% Portfolio Occupancy"
          isPositive={true}
          icon={ArrowUpRight}
          subtitle="Revenue per available room"
        />
        <StatCard
          title="Operating Margin"
          value="48.2%"
          change="IAS-16 Compliant"
          isPositive={true}
          icon={ShieldCheck}
          subtitle="Net EBITDA yield"
        />
      </div>

      {/* Monthly Trajectory and Department Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trajectory */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Monthly Revenue Growth & Trend
              </h3>
              <p className="text-xs text-charcoal-muted">Sovereign luxury performance curve (2026)</p>
            </div>
            <span className="font-mono text-xs font-bold text-accent">+18.4% Average Lift</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {monthlyGrowth.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-charcoal-muted">{m.month}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {m.growth}
                  </span>
                </div>
                <p className="font-serif font-bold text-lg text-primary dark:text-white">
                  ${m.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Department Revenue Share */}
        <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Revenue Streams
              </h3>
              <p className="text-xs text-charcoal-muted">Department split</p>
            </div>
            <PieChart className="w-4 h-4 text-accent" />
          </div>

          <div className="space-y-3.5 text-xs">
            {departmentStreams.map((dept, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-charcoal dark:text-gray-200">{dept.name}</span>
                  <span className="font-mono font-bold text-primary dark:text-white">
                    ${(dept.amount / 1000).toFixed(0)}k ({dept.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-border/60 dark:bg-primary-950/80 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                  <div
                    className={`h-full ${dept.color} rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${dept.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportsPage;
