import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, Card, Tabs } from '../../../components/ui';
import { SimpleAreaChart, SimpleBarChart } from '../../../components/data-display/SimpleChart';
import { weeklyOccupancyData, roomCategoryDistribution } from '../../../data/mockAnalytics';
import {
  BedDouble,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Percent,
  Download,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const OccupancyAnalyticsPage = () => {
  const navigate = useNavigate();
  const { rooms, bookings, getOccupancyRate } = useERP();
  const { showToast } = useToast();

  const [timeHorizon, setTimeHorizon] = useState('weekly'); // 'daily' | 'weekly' | 'monthly'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const reservedRooms = rooms.filter(r => r.status === 'reserved').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance' || r.status === 'cleaning').length;

  const currentOccupancy = getOccupancyRate();

  // Category breakdown calculation
  const categories = Array.from(new Set(rooms.map(r => r.type)));
  const categoryStats = categories.map(cat => {
    const catRooms = rooms.filter(r => r.type === cat);
    const catOccupied = catRooms.filter(r => r.status === 'occupied').length;
    const catAvailable = catRooms.filter(r => r.status === 'available').length;
    const catRate = catRooms.length > 0 ? Math.round((catOccupied / catRooms.length) * 100) : 0;
    return {
      name: cat,
      total: catRooms.length,
      occupied: catOccupied,
      available: catAvailable,
      rate: catRate,
    };
  });

  const dailyTrendData = [
    { label: '06:00', value: 72 },
    { label: '09:00', value: 78 },
    { label: '12:00', value: 65 },
    { label: '15:00', value: 84 },
    { label: '18:00', value: 91 },
    { label: '21:00', value: 94 },
    { label: '24:00', value: 94 },
  ];

  const monthlyTrendData = [
    { label: 'Jun', value: 82 },
    { label: 'Jul', value: 89 },
    { label: 'Aug', value: 96 },
    { label: 'Sep', value: 88 },
    { label: 'Oct', value: 92 },
    { label: 'Nov (F)', value: 86 },
  ];

  const handleExportData = () => {
    const csvContent = "Category,Total Rooms,Occupied,Available,Occupancy Rate\n" +
      categoryStats.map(c => `"${c.name}",${c.total},${c.occupied},${c.available},${c.rate}%`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Occupancy_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Report Exported', 'Occupancy report downloaded in CSV format.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Occupancy & Inventory Analytics"
        description="Live occupancy metrics, suite distribution trends, day-of-week demand velocity, and out-of-order room auditing."
        badge={`${currentOccupancy}% Portfolio Occupancy`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={handleExportData}
            >
              Export CSV Report
            </Button>
            <Button
              variant="gold"
              icon={BedDouble}
              onClick={() => navigate('/hotel-admin/rooms/availability')}
            >
              Room Availability Grid
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Current Occupancy"
          value={`${currentOccupancy}%`}
          change={`${occupiedRooms} of ${totalRooms} Suites`}
          isPositive={currentOccupancy >= 70}
          icon={Percent}
          subtitle="Real-time check-in ratio"
        />
        <StatCard
          title="Occupied Suites"
          value={occupiedRooms}
          change="Resident VIPs"
          isPositive={true}
          icon={BedDouble}
          subtitle="Folios actively running"
        />
        <StatCard
          title="Available Suites"
          value={availableRooms}
          change="Inspected & ready"
          isPositive={true}
          icon={CheckCircle}
          subtitle="Walk-in allocation open"
        />
        <StatCard
          title="Guaranteed Reserved"
          value={reservedRooms}
          change="Awaiting arrival"
          isPositive={true}
          icon={Clock}
          subtitle="Keys prepared at Front Desk"
        />
        <StatCard
          title="Out of Service"
          value={maintenanceRooms}
          change="Turnover / Repairs"
          isPositive={maintenanceRooms === 0}
          icon={XCircle}
          subtitle="Under engineering review"
        />
      </div>

      {/* Main Occupancy Trends & Horizon Controls */}
      <div className="card-luxury-3d p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
              Occupancy Velocity & Pace Trends
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Historical and forecasted demand telemetry across room categories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-charcoal-light/10 dark:bg-white/5 border border-border/80 dark:border-white/10 flex text-xs">
              <button
                onClick={() => setTimeHorizon('daily')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeHorizon === 'daily' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
                }`}
              >
                Intraday
              </button>
              <button
                onClick={() => setTimeHorizon('weekly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeHorizon === 'weekly' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
                }`}
              >
                Weekly Pace
              </button>
              <button
                onClick={() => setTimeHorizon('monthly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeHorizon === 'monthly' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
                }`}
              >
                Monthly Season
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Display based on Horizon */}
        <div className="pt-2">
          {timeHorizon === 'daily' && (
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-semibold text-primary dark:text-white">Intraday Occupancy Fluctuations (Turnover Impact)</span>
                <span className="font-mono text-accent">Peak: 94% at 22:00</span>
              </div>
              <SimpleBarChart data={dailyTrendData} height={240} valueSuffix="%" />
            </div>
          )}

          {timeHorizon === 'weekly' && (
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-semibold text-primary dark:text-white">Day-of-Week Occupancy Rate (Mon - Sun)</span>
                <span className="font-mono text-accent">Weekend Peak: 100% Full House</span>
              </div>
              <SimpleBarChart data={weeklyOccupancyData} height={240} valueSuffix="%" />
            </div>
          )}

          {timeHorizon === 'monthly' && (
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="font-semibold text-primary dark:text-white">6-Month Occupancy Trend & Forecast</span>
                <span className="font-mono text-accent">Summer Average: 92.3%</span>
              </div>
              <SimpleAreaChart data={monthlyTrendData} height={240} valueSuffix="%" />
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown & Suite Allocation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Occupancy Distribution Table */}
        <div className="card-luxury-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Occupancy by Suite Category
            </h3>
            <span className="text-xs text-charcoal-muted">Active Tiers</span>
          </div>

          <div className="space-y-4">
            {categoryStats.map(cat => (
              <div key={cat.name} className="space-y-1.5 p-3 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary dark:text-white">{cat.name}</span>
                  <span className="font-mono font-bold text-accent">{cat.rate}% Occupied</span>
                </div>
                <div className="h-2 w-full bg-ivory dark:bg-primary-950 rounded-full overflow-hidden border border-border/40 dark:border-white/5">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${cat.rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-charcoal-muted">
                  <span>{cat.occupied} of {cat.total} Suites Occupied</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{cat.available} Ready for Guests</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in vs Check-out Trends & Peak Flows */}
        <div className="card-luxury-3d p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Guest Flow Dynamics
              </h3>
              <span className="text-xs text-charcoal-muted">Front Desk Throughput</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <span className="text-[11px] text-charcoal-muted uppercase font-bold tracking-wider">Average Length of Stay</span>
                <p className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400">3.8 Nights</p>
                <p className="text-[10px] text-charcoal-muted">+0.4 nights vs last season</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
                <span className="text-[11px] text-charcoal-muted uppercase font-bold tracking-wider">Early Check-in Rate</span>
                <p className="font-serif font-bold text-2xl text-blue-600 dark:text-blue-400">28.4%</p>
                <p className="text-[10px] text-charcoal-muted">Handled by Butler Concierge</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-charcoal-light/10 dark:bg-white/5 text-xs text-charcoal-muted space-y-2">
              <div className="flex justify-between">
                <span>Peak Arrival Hour:</span>
                <strong className="text-primary dark:text-white">15:00 - 17:30</strong>
              </div>
              <div className="flex justify-between">
                <span>Peak Departure Hour:</span>
                <strong className="text-primary dark:text-white">10:30 - 12:00</strong>
              </div>
              <div className="flex justify-between">
                <span>Direct Booking Occupancy Share:</span>
                <strong className="text-accent">68.2% Direct Sovereign Channel</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/hotel-admin/front-desk')}
            >
              Go to Front Desk Board →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyAnalyticsPage;

