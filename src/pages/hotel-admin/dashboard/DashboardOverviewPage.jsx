import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge } from '../../../components/ui';
import { SimpleAreaChart } from '../../../components/data-display/SimpleChart';
import { monthlyRevenueData, roomCategoryDistribution } from '../../../data/mockAnalytics';
import {
  BedDouble,
  TrendingUp,
  Award,
  Sparkles,
  Key,
  Plus,
  Activity,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Percent,
  DollarSign
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useERP } from '../../../context/ERPContext';

export const DashboardOverviewPage = () => {
  const navigate = useNavigate();
  const {
    rooms,
    bookings,
    folios = [],
    auditLogs = [],
    getOccupancyRate,
    getRevPAR,
    getADR,
    getPendingCleaningCount,
    getActiveMaintenanceCount,
  } = useERP();
  const { showToast } = useToast();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance' || r.status === 'cleaning').length;
  const checkedInCount = bookings.filter(b => b.status === 'checked_in').length;
  const checkedOutCount = bookings.filter(b => b.status === 'checked_out').length;
  const confirmedArrivals = bookings.filter(b => b.status === 'confirmed').length;

  const occupancyRate = getOccupancyRate();
  const revpar = getRevPAR();
  const adr = getADR ? getADR() : Math.round(revpar / Math.max(0.01, occupancyRate / 100));

  // Calculate total revenue from settled folios and invoices
  const totalFolioRevenue = folios.reduce((acc, f) => acc + (f.totalPaid || f.grandTotal || 0), 0);
  const displayRevenue = totalFolioRevenue > 0 ? totalFolioRevenue : 1490000;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Executive Overview Console"
        description="Lazfort Palace Monte-Carlo — Real-time operational intelligence, occupancy metrics, yield telemetry, and housekeeping readiness."
        badge="General Manager Console"
        actions={
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Button
              variant="outline"
              icon={Key}
              onClick={() => {
                showToast('Concierge Dispatched', 'Head Butler and Chauffeur team notified for arrivals.', 'success');
              }}
            >
              Concierge Dispatch
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New VIP Booking
            </Button>
          </div>
        }
      />

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Occupancy"
          value={`${occupancyRate}%`}
          change={`${occupiedRooms} of ${totalRooms} Suites Active`}
          isPositive={occupancyRate >= 70}
          icon={BedDouble}
          subtitle={`${availableRooms} Suites Ready for Check-in`}
        />
        <StatCard
          title="RevPAR & ADR"
          value={`$${revpar.toLocaleString()}`}
          change={`ADR: $${adr.toLocaleString()}`}
          isPositive={true}
          icon={TrendingUp}
          subtitle="Yielding High Seasonal Premium"
        />
        <StatCard
          title="In-House Guests"
          value={`${checkedInCount} Resident`}
          change={`${confirmedArrivals} Expected Today`}
          isPositive={true}
          icon={Award}
          subtitle={`${checkedOutCount} Check-outs Concluded`}
        />
        <StatCard
          title="Housekeeping Status"
          value={`${getPendingCleaningCount()} In Turnover`}
          change={`${maintenanceRooms} Off-Market`}
          isPositive={getPendingCleaningCount() === 0}
          icon={Sparkles}
          subtitle={`${availableRooms} Inspected & Sanitized`}
        />
      </div>

      {/* Revenue & Suite Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 card-luxury-3d p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
                  Revenue Performance & Yield
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                  Gross suite revenue, Michelin dining folios & wellness club admissions
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-accent px-3 py-1 rounded-full bg-accent/15 border border-accent/30 shadow-sm w-fit">
                ${(displayRevenue / 1000000).toFixed(2)}M MTD
              </span>
            </div>

            <SimpleAreaChart data={monthlyRevenueData} valuePrefix="$" height={260} />
          </div>

          <div className="pt-4 mt-4 border-t border-border/80 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-charcoal-muted">Forecasted Month-End Revenue:</span>
            <span className="font-serif font-bold text-accent text-sm">$1,850,000 USD</span>
          </div>
        </div>

        {/* Room Category Allocation Breakdown */}
        <div className="card-luxury-3d p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white mb-1">
              Suite Distribution
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mb-5">
              Portfolio inventory breakdown by luxury category
            </p>

            <div className="space-y-4">
              {roomCategoryDistribution.map(cat => (
                <div key={cat.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-primary dark:text-gray-200">{cat.label}</span>
                    <span className="text-accent font-mono font-bold">
                      {cat.count} Suites ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-ivory dark:bg-primary-950/80 rounded-full overflow-hidden p-0.5 border border-border/40 dark:border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${cat.percentage * 2}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-border/80 dark:border-white/10 flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 mt-6">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              100% Butler Coverage
            </span>
            <span className="font-semibold text-accent font-mono">38 Staff On Shift</span>
          </div>
        </div>
      </div>

      {/* Housekeeping Telemetry & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Housekeeping & Suite Health Status */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Housekeeping & Suite Readiness
              </h3>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/housekeeping')}
              className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              Manage Turnovers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="font-mono font-bold text-2xl text-emerald-600 dark:text-emerald-400">{availableRooms}</p>
              <p className="text-xs font-semibold text-charcoal-muted mt-1">Available & Clean</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="font-mono font-bold text-2xl text-amber-600 dark:text-amber-400">{getPendingCleaningCount()}</p>
              <p className="text-xs font-semibold text-charcoal-muted mt-1">Cleaning In-Progress</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <p className="font-mono font-bold text-2xl text-rose-600 dark:text-rose-400">{getActiveMaintenanceCount()}</p>
              <p className="text-xs font-semibold text-charcoal-muted mt-1">Maintenance Held</p>
            </div>
          </div>

          <div className="pt-3 text-xs text-charcoal-muted flex items-center justify-between border-t border-border/80 dark:border-white/10">
            <span>Room Inspection Standard: <strong className="text-primary dark:text-white">Forbes 5-Star Protocol</strong></span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Inspected 100%</span>
          </div>
        </div>

        {/* Real-Time Operational Activity Logs */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Live Operations Feed
              </h3>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/bookings')}
              className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              View All Folios <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.slice(0, 5).map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent">
                        {log.action}
                      </span>
                      <span className="font-semibold text-primary dark:text-white">{log.module}</span>
                    </div>
                    <p className="text-charcoal-muted text-[11px] line-clamp-1">{log.description}</p>
                  </div>
                  <span className="font-mono text-[10px] text-charcoal-muted shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-charcoal-muted">
                No recent activity records logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;

