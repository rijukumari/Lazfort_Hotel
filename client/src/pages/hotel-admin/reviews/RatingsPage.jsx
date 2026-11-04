import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Star,
  TrendingUp,
  Award,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const RatingsPage = () => {
  const [period, setPeriod] = useState('Quarter 4 (2026)');

  const ratingDistribution = [
    { stars: 5, count: 184, percent: 82, color: 'bg-emerald-500' },
    { stars: 4, count: 28, percent: 12, color: 'bg-accent' },
    { stars: 3, count: 9, percent: 4, color: 'bg-blue-500' },
    { stars: 2, count: 2, percent: 1, color: 'bg-amber-500' },
    { stars: 1, count: 1, percent: 1, color: 'bg-rose-500' },
  ];

  const departmentRatings = [
    { name: 'Concierge & Butler Valet', score: 4.95, reviews: 142, trend: '+0.2%' },
    { name: 'Suites & Chamber Cleanliness', score: 4.92, reviews: 204, trend: '+0.4%' },
    { name: 'Gastronomy & Haute Dining', score: 4.88, reviews: 168, trend: '+0.1%' },
    { name: 'Royal Thalasso Sanctuary & Spa', score: 4.96, reviews: 96, trend: '+0.5%' },
    { name: 'Front Desk & Reception Velocity', score: 4.84, reviews: 198, trend: '-0.1%' },
    { name: 'Chauffeur & Helipad Logistics', score: 4.98, reviews: 62, trend: '+0.2%' },
  ];

  const roomRatings = [
    { type: 'Presidential Suites & Penthouses', score: 4.98, count: 48 },
    { type: 'Deluxe Oceanfront Villas', score: 4.92, count: 64 },
    { type: 'Executive Panoramic Suites', score: 4.86, count: 52 },
    { type: 'Junior Palace Suites', score: 4.81, count: 60 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Ratings & Sentiment Analytics"
        description="Comprehensive score breakdowns, 5-star distribution curves, and department performance across Lazfort Palace."
        badge="4.92 Overall Rating"
      />

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Average Rating"
          value="4.92"
          change="+0.08 pts this quarter"
          isPositive={true}
          icon={Star}
          subtitle="Out of 5.0 Sovereign scale"
        />
        <StatCard
          title="5-Star Ratings Ratio"
          value="82.1%"
          change="184 of 224 reviews"
          isPositive={true}
          icon={Award}
          subtitle="Supreme guest approval"
        />
        <StatCard
          title="Net Promoter Score"
          value="+89"
          change="World-class benchmark"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Hospitality leader"
        />
        <StatCard
          title="Hygiene & Care Rating"
          value="4.96"
          change="Zero critical flags"
          isPositive={true}
          icon={ShieldCheck}
          subtitle="Audit compliance"
        />
      </div>

      {/* Star Distribution & Department Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Star Rating Distribution Card */}
        <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Rating Distribution
              </h3>
              <p className="text-xs text-charcoal-muted">224 Total Reviews verified</p>
            </div>
            <span className="font-mono text-xs font-bold text-accent">100% Verified</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {ratingDistribution.map((r) => (
              <div key={r.stars} className="space-y-1">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1 text-primary dark:text-white font-semibold">
                    <span>{r.stars}</span>
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-charcoal-muted font-mono">{r.count} stays</span>
                    <span className="font-mono font-bold text-primary dark:text-white">{r.percent}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-border/60 dark:bg-primary-950/80 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                  <div
                    className={`h-full ${r.color} rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/80 dark:border-white/10 text-center">
            <p className="text-xs text-charcoal-muted">
              94% of guests rate their Lazfort Palace stay at 4 or 5 stars.
            </p>
          </div>
        </div>

        {/* Department Ratings Card (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Department Performance Scores
              </h3>
              <p className="text-xs text-charcoal-muted">Benchmarked against Sovereign luxury hospitality SLAs</p>
            </div>
            <span className="text-xs font-mono font-semibold text-accent">{period}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departmentRatings.map((dept, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/5 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-primary dark:text-white">{dept.name}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {dept.trend}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-2xl text-accent">{dept.score}</span>
                    <div className="flex text-accent">
                      <Star className="w-3.5 h-3.5 fill-accent" />
                    </div>
                  </div>
                  <span className="text-[11px] text-charcoal-muted font-mono">{dept.reviews} reviews</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Category Breakdown Table */}
      <div className="p-6 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-primary dark:text-white">
          Chamber & Suite Tier Satisfaction
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              <tr>
                <th className="py-3 px-4">Suite Category</th>
                <th className="py-3 px-4">Satisfaction Score</th>
                <th className="py-3 px-4">Total Reviews</th>
                <th className="py-3 px-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {roomRatings.map((room, idx) => (
                <tr key={idx} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                    {room.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">
                    {room.score} / 5.0
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted font-mono">
                    {room.count} reviews
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      5-Star Exceeded
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
