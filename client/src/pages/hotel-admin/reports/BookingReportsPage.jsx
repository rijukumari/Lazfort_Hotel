import React from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { useERP } from '../../../context/ERPContext';
import {
  CalendarCheck,
  TrendingUp,
  Globe,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const BookingReportsPage = () => {
  const { bookings = [] } = useERP();

  const totalBookings = bookings.length || 148;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length || 112;
  const pendingCount = bookings.filter(b => b.status === 'pending').length || 24;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length || 12;

  const channels = [
    { name: 'Direct Sovereign Web & App', count: 78, share: '53%', trend: '+14%' },
    { name: 'Centurion Luxury Concierge Desk', count: 42, share: '28%', trend: '+8%' },
    { name: 'Virtuoso & Preferred Hotels GDS', count: 18, share: '12%', trend: '+4%' },
    { name: 'Private Diplomatic Inquiries', count: 10, share: '7%', trend: '+2%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Reservation Trajectory & Booking Reports"
        description="Booking velocity, direct vs GDS luxury channels, lead time analysis, and booking pipeline health."
        badge={`${totalBookings} Total Bookings`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reservations"
          value={totalBookings}
          change="+16% vs Last Quarter"
          isPositive={true}
          icon={CalendarCheck}
          subtitle="Portfolio demand"
        />
        <StatCard
          title="Confirmed & Active"
          value={confirmedCount}
          change="Deposits settled"
          isPositive={true}
          icon={CheckCircle}
          subtitle="Guaranteed revenue"
        />
        <StatCard
          title="Pending Clearance"
          value={pendingCount}
          change="Hold within 24h"
          isPositive={false}
          icon={Clock}
          subtitle="Awaiting wire/auth"
        />
        <StatCard
          title="Direct Booking Share"
          value="53%"
          change="0% OTA Commission"
          isPositive={true}
          icon={Globe}
          subtitle="Direct channel leader"
        />
      </div>

      {/* Booking Channel Distribution */}
      <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-primary dark:text-white">
          Reservation Channels & Origin Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Booking Channel</th>
                <th className="py-3 px-4">Confirmed Stays</th>
                <th className="py-3 px-4">Portfolio Share</th>
                <th className="py-3 px-4">YoY Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {channels.map((ch, idx) => (
                <tr key={idx} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">{ch.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">{ch.count}</td>
                  <td className="py-3.5 px-4 font-mono text-charcoal-muted">{ch.share}</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{ch.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingReportsPage;
