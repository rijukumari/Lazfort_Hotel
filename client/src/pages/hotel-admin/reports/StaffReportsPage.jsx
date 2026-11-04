import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Users,
  UserCheck,
  Clock,
  Award,
  Calendar,
  Briefcase,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const StaffReportsPage = () => {
  const [selectedDept, setSelectedDept] = useState('all');

  const stats = [
    { label: 'Active Palace Staff', value: '142', change: '+6 onboarded', trend: 'up', icon: Users },
    { label: 'Attendance Rate', value: '98.4%', change: 'Across all shifts', trend: 'up', icon: UserCheck },
    { label: 'Avg Productivity Score', value: '96.2%', change: '+3.1% vs last month', trend: 'up', icon: Award },
    { label: 'Overtime Hours Logged', value: '46 hrs', change: '-18% optimized', trend: 'up', icon: Clock },
  ];

  const departmentRoster = [
    { name: 'Front Desk & Royal Butler Service', count: 28, attendance: '99.1%', productivity: '98%', lead: 'Jean-Luc Moreau' },
    { name: 'Housekeeping & Turndown Sanctuary', count: 44, attendance: '97.8%', productivity: '96%', lead: 'Maria Santos' },
    { name: 'Michelin Culinary & Sommelier Team', count: 32, attendance: '98.6%', productivity: '97%', lead: 'Chef Laurent Vane' },
    { name: 'Facilities, Security & Engineering', count: 22, attendance: '99.0%', productivity: '95%', lead: 'Marco Bellini' },
    { name: 'Thalasso Spa & Wellness Specialists', count: 16, attendance: '98.0%', productivity: '95%', lead: 'Dr. Sarah Al-Mansoor' },
  ];

  const staffPerformanceRecords = [
    {
      id: 'EMP-104',
      name: 'Elena Rostova',
      dept: 'Front Desk',
      role: 'Head Concierge',
      attendance: '100%',
      tasksCompleted: 142,
      guestRating: '4.98',
      status: 'Exemplary',
    },
    {
      id: 'EMP-088',
      name: 'Marco Bellini',
      dept: 'Engineering',
      role: 'Chief Engineer',
      attendance: '98.5%',
      tasksCompleted: 89,
      guestRating: '4.95',
      status: 'Exemplary',
    },
    {
      id: 'EMP-112',
      name: 'David Chen',
      dept: 'Culinary',
      role: 'Pastry Sous Chef',
      attendance: '99.0%',
      tasksCompleted: 210,
      guestRating: '4.92',
      status: 'High Performer',
    },
    {
      id: 'EMP-067',
      name: 'Chloe Dubois',
      dept: 'Spa',
      role: 'Lead Aesthetician',
      attendance: '97.5%',
      tasksCompleted: 96,
      guestRating: '4.96',
      status: 'Exemplary',
    },
    {
      id: 'EMP-095',
      name: 'Viktor Jansen',
      dept: 'Housekeeping',
      role: 'Floor Supervisor',
      attendance: '96.0%',
      tasksCompleted: 178,
      guestRating: '4.88',
      status: 'On Target',
    },
  ];

  const filteredStaff = selectedDept === 'all'
    ? staffPerformanceRecords
    : staffPerformanceRecords.filter((s) => s.dept.toLowerCase().includes(selectedDept.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Staff & Workforce Productivity Reports"
        description="Departmental headcount allocation, operational attendance ratios, shift efficiency, and luxury service benchmarks."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Department Breakdown & Attendance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" />
                Department Headcount & Operational Efficiency
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Staff distribution and performance tracking per division
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
              142 Active Personnel
            </span>
          </div>

          <div className="space-y-4">
            {departmentRoster.map((dept, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-background/60 border border-border/80 hover:border-accent/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-medium text-foreground text-sm">{dept.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Lead: <span className="text-accent">{dept.lead}</span> • Staff: <span className="font-semibold text-foreground">{dept.count}</span>
                  </p>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Attendance</span>
                    <span className="font-semibold text-emerald-500">{dept.attendance}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Productivity</span>
                    <span className="font-semibold text-accent">{dept.productivity}</span>
                  </div>
                  <div className="w-24 bg-border/40 h-2 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="bg-accent h-full rounded-full"
                      style={{ width: dept.productivity }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shift Attendance Snapshot */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              Shift Fulfillment Ratio
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Coverage status across morning, evening, and overnight royal butler cycles.
            </p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-background/50 border border-border">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-foreground">Morning Shift (07:00 - 15:30)</span>
                  <span className="text-emerald-500 font-semibold">100% (62 Staff)</span>
                </div>
                <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-background/50 border border-border">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-foreground">Evening Shift (15:00 - 23:30)</span>
                  <span className="text-accent font-semibold">98.2% (54 Staff)</span>
                </div>
                <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[98.2%] rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-background/50 border border-border">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-foreground">Night Watch (23:00 - 07:30)</span>
                  <span className="text-blue-400 font-semibold">100% (26 Staff)</span>
                </div>
                <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Certified Palace Specialists</span>
              <span className="font-semibold text-accent">100% Cleared</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Performance & Evaluation Table */}
      <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Employee Productivity & Service Rating
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Individual staff performance benchmarks, guest feedback scores, and completion rate
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-accent"
            >
              <option value="all">All Departments</option>
              <option value="front desk">Front Desk</option>
              <option value="engineering">Engineering</option>
              <option value="culinary">Culinary</option>
              <option value="spa">Spa & Wellness</option>
              <option value="housekeeping">Housekeeping</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Staff ID & Name</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Role / Department</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Attendance</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Tasks Logged</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Guest Score</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Rating Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-accent/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-foreground block">{staff.name}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">{staff.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-foreground font-medium block">{staff.role}</span>
                    <span className="text-[11px] text-muted-foreground">{staff.dept}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-500 font-semibold">{staff.attendance}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {staff.tasksCompleted} requests
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-accent">
                      ★ {staff.guestRating}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        staff.status === 'Exemplary'
                          ? 'bg-accent/15 text-accent border-accent/30'
                          : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                      }`}
                    >
                      {staff.status}
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

export default StaffReportsPage;
