import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button } from '../../../components/ui';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  Award,
  CheckCircle2,
  CalendarCheck,
  BedDouble,
  ShieldCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

export const HousekeepingOverviewPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks, rooms, staff, updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [filterPriority, setFilterPriority] = useState('all');

  // KPI Computations
  const totalScheduled = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'inspected');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const urgentVIPCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'inspected').length;

  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;
  const cleaningRoomsCount = rooms.filter(r => r.status === 'cleaning' || r.cleaningStatus === 'dirty').length;
  const occupiedRoomsCount = rooms.filter(r => r.status === 'occupied').length;

  const handleAuditAllSuites = () => {
    const uninspected = tasks.filter(t => t.status !== 'inspected');
    if (uninspected.length === 0) {
      showToast('All Suites Inspected', 'All scheduled chambers already meet verified white-glove criteria.', 'info');
      return;
    }
    uninspected.forEach(t => updateCleaningTaskStatus(t.id, 'inspected'));
    showToast(
      'Hygiene Clearance Verified',
      `${uninspected.length} suites passed executive sanitation audit and released to available inventory.`,
      'success'
    );
  };

  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Housekeeping & Turnover Command"
        description="Master operational intelligence for palace turnovers, VIP sanitation velocity, and hygiene clearance SLAs."
        badge="Sanitation Operations"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              icon={CheckCircle2}
              onClick={handleAuditAllSuites}
            >
              Verify All Audits
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/housekeeping/schedule')}
            >
              Schedule Chamber Turnover
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Scheduled Turnovers"
          value={`${totalScheduled} Chambers`}
          change={`${completedTasks.length} Cleaned`}
          isPositive={true}
          icon={Sparkles}
          subtitle="White-Glove Standard"
        />
        <StatCard
          title="Urgent VIP Turnovers"
          value={`${urgentVIPCount} Urgent`}
          change="Expedited protocols"
          isPositive={urgentVIPCount === 0}
          icon={AlertTriangle}
          subtitle="Arrivals in < 2 Hours"
        />
        <StatCard
          title="Avg Turnaround Time"
          value="46 Mins"
          change="Under 60m SLA"
          isPositive={true}
          icon={Clock}
          subtitle="Executive Floor Teams"
        />
        <StatCard
          title="Hygiene Audit Pass Rate"
          value="99.6%"
          change="5-Star Sovereign Rating"
          isPositive={true}
          icon={Award}
          subtitle="Medical Grade Sanitization"
        />
      </div>

      {/* Executive Suite Turnover Readiness & Live Wing Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chamber Allocation Readiness */}
        <div className="card-luxury-3d p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-accent" />
                <span>Chamber Readiness Distribution</span>
              </h3>
              <p className="text-xs text-charcoal-muted">Real-time status across 20 Monaco suites</p>
            </div>
            <span className="font-mono text-xs font-bold text-accent">{rooms.length} Suites</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Available & Inspected */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available & Inspected
                </span>
                <span className="font-mono font-bold text-primary dark:text-white">
                  {availableRoomsCount} Suites ({Math.round((availableRoomsCount / Math.max(1, rooms.length)) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-border/60 dark:bg-black/50 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(availableRoomsCount / Math.max(1, rooms.length)) * 100}%` }}
                />
              </div>
            </div>

            {/* Active Cleaning in Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Sanitization in Progress
                </span>
                <span className="font-mono font-bold text-primary dark:text-white">
                  {inProgressTasks.length + cleaningRoomsCount} Suites
                </span>
              </div>
              <div className="h-2 w-full bg-border/60 dark:bg-black/50 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${((inProgressTasks.length + cleaningRoomsCount) / Math.max(1, rooms.length)) * 100}%` }}
                />
              </div>
            </div>

            {/* In-House Resident Stays */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-primary dark:text-gray-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Occupied (Stayover Service)
                </span>
                <span className="font-mono font-bold text-accent">
                  {occupiedRoomsCount} Suites
                </span>
              </div>
              <div className="h-2 w-full bg-border/60 dark:bg-black/50 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(occupiedRoomsCount / Math.max(1, rooms.length)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 dark:border-white/10 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/5">
              <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block">Turnover Queue</span>
              <span className="font-serif font-bold text-lg text-primary dark:text-white">{pendingTasks.length} Pending</span>
            </div>
            <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/5">
              <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block">Verified Cleared</span>
              <span className="font-serif font-bold text-lg text-emerald-600 dark:text-emerald-400">{completedTasks.length} Approved</span>
            </div>
          </div>
        </div>

        {/* Live Shift Housekeeping Team Telemetry */}
        <div className="card-luxury-3d p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-accent" />
                <span>On-Duty Chamber Crews</span>
              </h3>
              <p className="text-xs text-charcoal-muted">Active floor staff and assignment counts</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-600 font-bold">
              Shift Active
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Margaux Dubois', role: 'Head Butler & Lead Sanitizer', assigned: tasks.filter(t => t.assignedStaffName === 'Margaux Dubois').length || 2, status: 'Active on Floor 12' },
              { name: 'Elena Rostova', role: 'Chamber Specialist', assigned: tasks.filter(t => t.assignedStaffName === 'Elena Rostova').length || 2, status: 'Active on Floor 5' },
              { name: 'Marie Laurent', role: 'Executive Valet & Linen Attendant', assigned: tasks.filter(t => t.assignedStaffName === 'Marie Laurent').length || 1, status: 'Active on Penthouse' },
              { name: 'Jean-Luc Picard', role: 'Supervisor Inspector', assigned: 3, status: 'Inspection Rounds' },
            ].map((member, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-ivory/40 dark:bg-white/[0.03] border border-border/60 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary dark:text-white block">{member.name}</span>
                  <span className="text-[11px] text-charcoal-muted">{member.role}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-accent block">{member.assigned} Tasks</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{member.status}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/hotel-admin/housekeeping/assignments')}
            className="w-full py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Manage Chamber Assignments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quality Audit Protocol Metrics */}
        <div className="card-luxury-3d p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Sovereign Hygiene Standard</span>
              </h3>
              <span className="text-xs font-mono text-accent">5-Star Protocol</span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/25 space-y-1">
                <div className="flex justify-between font-bold text-accent">
                  <span>Hospital-Grade Sterilization</span>
                  <span>100% Passed</span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  Hospitality ultraviolet sanitization lamps deployed across all vacated suites prior to fresh linen setting.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Frette Linen & Bulgari Restock</span>
                  <span>Zero Shortage</span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  1,000-thread count pure Egyptian cotton sets and Bulgari au Thé Blanc amenity reserves confirmed in stores.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 dark:border-white/10">
            <button
              onClick={() => navigate('/hotel-admin/housekeeping/inspection')}
              className="w-full py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2"
            >
              <span>Launch White-Glove Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Turnover Schedule Ledger */}
      <div className="card-luxury-3d p-6 rounded-3xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-accent" />
              <span>Chamber Turnover Schedule Ledger</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Live status across room turnovers, assigned specialists, and completion velocity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-accent" />
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="bg-transparent text-primary dark:text-white text-xs font-medium focus:outline-none"
              >
                <option value="all" className="dark:bg-primary-900">All Priorities</option>
                <option value="urgent" className="dark:bg-primary-900">Urgent VIP</option>
                <option value="high" className="dark:bg-primary-900">High Priority</option>
                <option value="medium" className="dark:bg-primary-900">Medium Routine</option>
              </select>
            </div>

            <button
              onClick={() => navigate('/hotel-admin/housekeeping/cleaning')}
              className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>View All Cleaning Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Turnover Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-[11px] font-mono uppercase text-charcoal-muted">
                <th className="pb-3 px-3">Chamber Ref</th>
                <th className="pb-3 px-3">Suite Tier</th>
                <th className="pb-3 px-3">Cleaning Type</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Assigned Specialist</th>
                <th className="pb-3 px-3">Est. Duration</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-charcoal-muted">
                    No scheduled turnovers match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-accent">
                      Suite {task.roomNumber}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-primary dark:text-white">
                      {task.roomType || 'Presidential Tier'}
                    </td>
                    <td className="py-3.5 px-3 text-charcoal dark:text-gray-300">
                      {task.cleaningType}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-accent/15 text-accent border border-accent/30'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-primary dark:text-gray-200">
                      {task.assignedStaffName || 'Marie Laurent'}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-charcoal-muted">
                      {task.estimatedMinutes} mins
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={task.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {task.status !== 'inspected' ? (
                        <button
                          onClick={() => {
                            updateCleaningTaskStatus(task.id, 'inspected');
                            showToast('Chamber Cleared', `Suite ${task.roomNumber} approved and marked available.`, 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-accent/40 text-accent hover:bg-accent hover:text-primary-900 text-[11px] font-semibold transition-all"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingOverviewPage;
