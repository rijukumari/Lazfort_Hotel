import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { SimpleAreaChart } from '../../../components/data-display/SimpleChart';
import { monthlyRevenueData } from '../../../data/mockAnalytics';
import { useToast } from '../../../context/ToastContext';
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  Utensils,
  BedDouble,
  RotateCcw,
  Clock,
} from 'lucide-react';

export const RevenueReportsPage = () => {
  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('Annual');

  const handleExportCSV = () => {
    const headers = ['Revenue Stream', 'Category', 'Fiscal Period', 'Gross Invoiced', 'Realized Settlements', 'Variance (%)'];
    const rows = [
      ['"Sovereign Enterprise Subscriptions"', '"Platform ARR"', '"FY2026"', '$784,000', '$784,000', '+100%'],
      ['"Guest Room Folios & Suites"', '"Hospitality Operations"', '"FY2026"', '$3,820,000', '$3,690,000', '+18.2%'],
      ['"Michelin Dining & Sommelier Cellar"', '"F&B Services"', '"FY2026"', '$580,000', '$574,000', '+14.5%'],
      ['"Spa & Yacht Charter Concierge"', '"Ancillary Services"', '"FY2026"', '$286,000', '$281,000', '+22.1%'],
      ['"Refund Authorizations & Reversals"', '"Adjustments"', '"FY2026"', '-$12,500', '-$12,500', '-1.2%'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sovereign_revenue_report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Financial Statement Exported', `Generated CSV ledger audit for ${selectedPeriod}.`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Revenue & Fiscal Reports"
        subtitle="Audited financial summaries, platform subscription earnings, ancillary folio streams, and receivables"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'Platform Reports', path: '/super-admin/reports' },
          { label: 'Revenue Reports' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-ivory dark:bg-white/5 border border-border dark:border-white/10 rounded-xl p-1 text-xs">
              {['Q1', 'Q2', 'Q3', 'Q4', 'Annual'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 rounded-lg font-mono font-bold transition-colors ${
                    selectedPeriod === p
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Fiscal CSV
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Gross Portfolio Turnover"
          value="$5,470,000"
          change="+18.4%"
          isPositive={true}
          period="consolidated billing"
          icon={<DollarSign className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Net Settled Revenue"
          value="$5,316,500"
          change="+16.9%"
          isPositive={true}
          period="net of VAT & tax escrows"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Enterprise Subscriptions"
          value="$784,000"
          change="+24.5%"
          isPositive={true}
          period="software ARR"
          icon={<CreditCard className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Disputes & Arrears"
          value="$153,500"
          period="pending settlement clearance"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
      </StatsGrid>

      {/* Main Revenue Chart */}
      <div className="card-luxury p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Sovereign Revenue Run-Rate Trend
            </h3>
            <p className="text-xs text-charcoal-muted">Monthly trajectory across all hotel properties</p>
          </div>
          <span className="font-mono text-xs font-bold text-accent">
            May 2026 – Oct 2026
          </span>
        </div>

        <SimpleAreaChart
          data={monthlyRevenueData}
          height={260}
          valuePrefix="$"
          color="#C6A66B"
        />
      </div>

      {/* Stream Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-luxury p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
            <BedDouble className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted block">
            Suite Folios (69.8%)
          </span>
          <span className="text-xl font-serif font-bold text-primary dark:text-white block">
            $3,820,000
          </span>
          <span className="text-[11px] text-emerald-600 font-mono">+18.2% vs last year</span>
        </div>

        <div className="card-luxury p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted block">
            SaaS Licenses (14.3%)
          </span>
          <span className="text-xl font-serif font-bold text-primary dark:text-white block">
            $784,000
          </span>
          <span className="text-[11px] text-emerald-600 font-mono">100% renewal retention</span>
        </div>

        <div className="card-luxury p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted block">
            Fine Dining (10.6%)
          </span>
          <span className="text-xl font-serif font-bold text-primary dark:text-white block">
            $580,000
          </span>
          <span className="text-[11px] text-emerald-600 font-mono">Michelin cellars</span>
        </div>

        <div className="card-luxury p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-charcoal-muted block">
            Refunds & Escrows
          </span>
          <span className="text-xl font-serif font-bold text-rose-600 block">
            -$12,500
          </span>
          <span className="text-[11px] text-charcoal-muted font-mono">0.2% reversal rate</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportsPage;

