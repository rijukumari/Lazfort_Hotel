import React from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { useERP } from '../../../context/ERPContext';
import {
  BedDouble,
  Percent,
  CalendarCheck,
  CheckCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const OccupancyReportsPage = () => {
  const { rooms = [] } = useERP();

  const totalRooms = rooms.length || 20;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length || 15;
  const availableCount = rooms.filter(r => r.status === 'available').length || 4;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length || 1;
  const occupancyRate = Math.round((occupiedCount / Math.max(1, totalRooms)) * 100);

  const roomTypeOccupancy = [
    { type: 'Presidential Suites & Penthouses', total: 4, occupied: 4, rate: 100 },
    { type: 'Deluxe Oceanfront Villas', total: 6, occupied: 5, rate: 83 },
    { type: 'Executive Panoramic Suites', total: 6, occupied: 4, rate: 67 },
    { type: 'Junior Palace Suites', total: 4, occupied: 2, rate: 50 },
  ];

  const weeklyPacing = [
    { day: 'Mon', rate: 78 },
    { day: 'Tue', rate: 82 },
    { day: 'Wed', rate: 85 },
    { day: 'Thu', rate: 90 },
    { day: 'Fri', rate: 95 },
    { day: 'Sat', rate: 100 },
    { day: 'Sun', rate: 88 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Chamber & Suite Occupancy Intelligence"
        description="Daily occupancy pacing, suite-tier yield saturation, and real-time inventory allocation."
        badge={`${occupancyRate}% Current Capacity`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Portfolio Occupancy"
          value={`${occupancyRate}%`}
          change="Monaco Portfolio"
          isPositive={occupancyRate >= 75}
          icon={Percent}
          subtitle="Real-time check-in status"
        />
        <StatCard
          title="Occupied Chambers"
          value={occupiedCount}
          change="Checked-in VIPs"
          isPositive={true}
          icon={BedDouble}
          subtitle={`Out of ${totalRooms} Total Suites`}
        />
        <StatCard
          title="Available & Inspected"
          value={availableCount}
          change="Ready for walk-in"
          isPositive={true}
          icon={CheckCircle}
          subtitle="White-glove certified"
        />
        <StatCard
          title="Out of Order"
          value={maintenanceCount}
          change="Scheduled maintenance"
          isPositive={maintenanceCount === 0}
          icon={AlertTriangle}
          subtitle="Engineering tickets"
        />
      </div>

      {/* Grid: Tier Breakdown & Weekly Pacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Type Breakdown */}
        <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white">
            Suite Category Saturation
          </h3>
          <div className="space-y-3.5 text-xs">
            {roomTypeOccupancy.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-primary dark:text-white font-semibold">{cat.type}</span>
                  <span className="font-mono text-charcoal-muted">
                    {cat.occupied} of {cat.total} occupied ({cat.rate}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-border/60 dark:bg-primary-950/80 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                  <div
                    className="h-full gold-gradient-bg rounded-full transition-all duration-500"
                    style={{ width: `${cat.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Pacing Curve */}
        <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white">
            Weekly Occupancy Velocity
          </h3>
          <div className="grid grid-cols-7 gap-2 pt-4">
            {weeklyPacing.map((w, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="h-32 w-full bg-ivory/80 dark:bg-primary-950/60 rounded-xl relative flex items-end p-1 border border-border/40 dark:border-white/5">
                  <div
                    className="w-full bg-accent rounded-lg transition-all duration-500"
                    style={{ height: `${w.rate}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-charcoal-muted">{w.day}</span>
                <span className="text-[10px] font-mono font-bold text-primary dark:text-white">{w.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyReportsPage;
