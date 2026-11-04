import React from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { useERP } from '../../../context/ERPContext';
import {
  Users,
  Award,
  Crown,
  HeartHandshake,
  DollarSign,
  Compass,
} from 'lucide-react';

export const GuestReportsPage = () => {
  const { guests = [] } = useERP();

  const totalGuests = guests.length || 240;
  const vipCount = guests.filter(g => g.vip || g.isVip).length || 68;
  const repeatGuests = 142;
  const repeatRatio = Math.round((repeatGuests / Math.max(1, totalGuests)) * 100);

  const guestSegments = [
    { segment: 'Sovereign VIP & Royalty', count: 48, avgSpend: '$28,400', share: '38%' },
    { segment: 'Centurion High-Net-Worth', count: 86, avgSpend: '$14,200', share: '32%' },
    { segment: 'Corporate Executives & Tech Founders', count: 64, avgSpend: '$8,600', share: '18%' },
    { segment: 'Luxury Leisure Couples', count: 42, avgSpend: '$6,200', share: '12%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Guest Demographics & Spending Intelligence"
        description="Profile retention indices, average folio value per guest tier, and VIP repeat visitation pacing."
        badge={`${totalGuests} Registered Guests`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Guests"
          value={totalGuests}
          change="+22% YoY"
          isPositive={true}
          icon={Users}
          subtitle="Monaco register"
        />
        <StatCard
          title="Verified VIP Members"
          value={vipCount}
          change="Tier 1 Privileges"
          isPositive={true}
          icon={Crown}
          subtitle="Direct butler assigned"
        />
        <StatCard
          title="Repeat Guest Rate"
          value={`${repeatRatio}%`}
          change="High brand loyalty"
          isPositive={true}
          icon={HeartHandshake}
          subtitle="2+ stays this year"
        />
        <StatCard
          title="Average Folio Value"
          value="$12,850"
          change="Room + Spa + Dining"
          isPositive={true}
          icon={DollarSign}
          subtitle="Per guest stay"
        />
      </div>

      {/* Guest Demographic Segments */}
      <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-primary dark:text-white">
          Clientele Tier Segments & Lifetime Value
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Tier Segment</th>
                <th className="py-3 px-4">Guest Count</th>
                <th className="py-3 px-4">Avg Stay Expenditure</th>
                <th className="py-3 px-4">Portfolio Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {guestSegments.map((seg, idx) => (
                <tr key={idx} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">{seg.segment}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">{seg.count}</td>
                  <td className="py-3.5 px-4 font-mono text-primary dark:text-white">{seg.avgSpend}</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{seg.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestReportsPage;
