import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRightLeft,
  Calendar,
  User,
  Sparkles,
  ArrowLeft,
  Send,
  FileCheck2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffSchedulePage = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: 'list' | 'leave' | 'swap'
  const isLeaveRoute = location.pathname.includes('/apply') || location.pathname.includes('/leave');
  const [viewMode, setViewMode] = useState(isLeaveRoute ? 'leave' : 'list');

  useEffect(() => {
    if (location.pathname.includes('/apply')) {
      setViewMode('leave');
    } else if (location.pathname.includes('/swap')) {
      setViewMode('swap');
    } else {
      setViewMode('list');
    }
  }, [location.pathname]);

  // Weekly Schedule Data
  const [weeklyShifts] = useState([
    { day: 'Mon, Oct 26', shift: 'Morning Shift', hours: '07:00 - 15:30', role: 'Main Concierge Station', status: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5' },
    { day: 'Tue, Oct 27', shift: 'Scheduled Rest Day', hours: 'Off Duty', role: 'Weekly Rest', status: 'Off', color: 'border-white/10 bg-white/5' },
    { day: 'Wed, Oct 28', shift: 'Evening Shift', hours: '15:00 - 23:30', role: 'VIP Arrival Desk', status: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5' },
    { day: 'Thu, Oct 29', shift: 'Morning Shift', hours: '07:00 - 15:30', role: 'Main Concierge Station', status: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5' },
    { day: 'Fri, Oct 30', shift: 'Morning Shift', hours: '07:00 - 15:30', role: 'Helipad Lounge Escort', status: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5' },
    { day: 'Sat, Oct 31 (Today)', shift: 'Morning Shift', hours: '07:00 - 15:30', role: 'Head Concierge Lead', status: 'Active Today', color: 'border-accent bg-accent/10 shadow-gold' },
    { day: 'Sun, Nov 01', shift: 'Evening Shift', hours: '15:00 - 23:30', role: 'Sovereign Penthouse Floor', status: 'Upcoming', color: 'border-blue-500/30 bg-blue-500/5' },
  ]);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'LVE-2026-091',
      type: 'Paid Annual Leave',
      dates: '2026-11-12 to 2026-11-15 (4 Days)',
      reason: 'Family wedding event in Nice',
      coverage: 'Jean-Luc Moreau covering Saturday shift',
      status: 'Approved',
      submittedDate: '2026-10-24',
    },
    {
      id: 'LVE-2026-074',
      type: 'Compensatory Off',
      dates: '2026-10-15 (1 Day)',
      reason: 'Overtime worked during Monaco Yacht Show',
      coverage: 'Supervisor Approved',
      status: 'Approved',
      submittedDate: '2026-10-10',
    },
  ]);

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({
    type: 'Paid Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
    coverageStaff: 'Julian St. Clair (Duty Manager)',
  });

  // Swap Form
  const [swapForm, setSwapForm] = useState({
    targetDate: '2026-11-01',
    colleagueName: 'Elena Rostova',
    proposedShift: 'Exchange Evening Shift for Morning Shift',
    reason: '',
  });

  const handleApplyLeave = (e) => {
    e.preventDefault();
    const newLeave = {
      id: `LVE-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: leaveForm.type,
      dates: `${leaveForm.startDate} to ${leaveForm.endDate}`,
      reason: leaveForm.reason,
      coverage: leaveForm.coverageStaff,
      status: 'Pending HR Review',
      submittedDate: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests([newLeave, ...leaveRequests]);
    setViewMode('list');
    showToast(
      'Leave Application Submitted',
      `Request for ${leaveForm.type} sent to Department Head and HR for authorization.`,
      'success'
    );
  };

  const handleApplySwap = (e) => {
    e.preventDefault();
    setViewMode('list');
    showToast(
      'Shift Swap Requested',
      `Swap request dispatched to ${swapForm.colleagueName} and Shift Supervisor.`,
      'success'
    );
  };

  // FULL PAGE VIEW: APPLY FOR LEAVE
  if (viewMode === 'leave') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title="Apply for Paid Leave & Time-Off"
          description="Formal request submission routed directly to your Department Head and HR Operations."
          badge="Leave Authorization Terminal"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Roster & Shifts
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Leave Request Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Ensure colleague shift coverage is pre-arranged for shifts exceeding 24 hours.
              </p>
            </div>
            <span className="font-mono text-xs text-accent font-semibold px-3 py-1 rounded-xl bg-accent/15 border border-accent/30">
              Annual Quota: 12 Days Remaining
            </span>
          </div>

          <form onSubmit={handleApplyLeave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Leave Category
                </label>
                <select
                  value={leaveForm.type}
                  onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Paid Annual Leave">Paid Annual Leave (12 Days Remaining)</option>
                  <option value="Compensatory Off">Compensatory Off (Accrued Overtime)</option>
                  <option value="Medical / Sick Leave">Medical / Sick Leave</option>
                  <option value="Emergency Family Leave">Emergency Family Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Colleague Shift Handover / Coverage
                </label>
                <input
                  type="text"
                  value={leaveForm.coverageStaff}
                  onChange={e => setLeaveForm({ ...leaveForm, coverageStaff: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  placeholder="Staff member agreeing to cover shift..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Leave Start Date
                </label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Leave End Date
                </label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Reason for Application & Context
              </label>
              <textarea
                value={leaveForm.reason}
                onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                rows={5}
                placeholder="Provide operational details for your leave request..."
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80 dark:border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Submissions are governed by Monaco Labor Code & Resort Charter
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <Send className="w-4 h-4" />
                  Submit Leave Application
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // FULL PAGE VIEW: SWAP SHIFT
  if (viewMode === 'swap') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title="Peer Shift Swap & Schedule Trade"
          description="Initiate an authorized schedule exchange with an active team member."
          badge="Roster Exchange"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Roster & Shifts
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Shift Trade Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Both parties will receive notification and supervisor sign-off is required.
              </p>
            </div>
          </div>

          <form onSubmit={handleApplySwap} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Shift Date to Exchange
                </label>
                <input
                  type="date"
                  value={swapForm.targetDate}
                  onChange={e => setSwapForm({ ...swapForm, targetDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Trade with Colleague
                </label>
                <select
                  value={swapForm.colleagueName}
                  onChange={e => setSwapForm({ ...swapForm, colleagueName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Elena Rostova">Elena Rostova (Concierge Specialist)</option>
                  <option value="Marco Bellini">Marco Bellini (Chief Facilities)</option>
                  <option value="Jean-Luc Moreau">Jean-Luc Moreau (Gastronomy Host)</option>
                  <option value="Svetlana Ivanova">Svetlana Ivanova (Floor Housekeeper)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Proposed Shift Assignment
              </label>
              <input
                type="text"
                value={swapForm.proposedShift}
                onChange={e => setSwapForm({ ...swapForm, proposedShift: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                placeholder="e.g. Exchange Evening Shift for Morning Shift"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Reason for Trade
              </label>
              <textarea
                value={swapForm.reason}
                onChange={e => setSwapForm({ ...swapForm, reason: e.target.value })}
                rows={4}
                placeholder="State the reason for requesting this shift exchange..."
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Dispatch Swap Request
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: SCHEDULE ROSTER
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Shift Scheduling & Leave Management"
        description="Weekly concierge duty roster, upcoming shift assignments, peer shift trades, and official leave records."
        badge="Roster Published"
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('swap')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-accent" />
              Swap Shift
            </button>
            <button
              type="button"
              onClick={() => setViewMode('leave')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <Plus className="w-4 h-4" />
              Apply for Leave
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid columns={4}>
        <StatCard
          title="Current Shift Today"
          value="07:00 - 15:30"
          change="Head Concierge Station"
          isPositive={true}
          iconName="Clock"
          subtitle="Morning Rotation"
        />
        <StatCard
          title="Weekly Total Hours"
          value="40.0 Hours"
          change="5 Shifts • 2 Rest Days"
          isPositive={true}
          iconName="Calendar"
          subtitle="Roster Compliance 100%"
        />
        <StatCard
          title="Approved Leave Days"
          value="12 Days Remaining"
          change="Annual Leave Quota"
          isPositive={true}
          iconName="CalendarDays"
          subtitle="Cycle 2026"
        />
        <StatCard
          title="Pending Requests"
          value={`${leaveRequests.filter(l => l.status.includes('Pending')).length} In Review`}
          change="HR Turnaround < 24h"
          isPositive={false}
          iconName="AlertCircle"
          subtitle="Supervisor Routing"
        />
      </StatsGrid>

      {/* Weekly Schedule Timeline Grid */}
      <div className="card-luxury-3d p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70 dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
              Weekly Concierge Duty Roster (Oct 26 – Nov 01)
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Verified schedule approved by General Operations
            </p>
          </div>
          <span className="text-xs font-mono text-accent font-semibold px-3 py-1 rounded-xl bg-accent/15 border border-accent/30 self-start sm:self-auto">
            Shift Rotation: Week 44
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 pt-2">
          {weeklyShifts.map((shift, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${shift.color}`}
            >
              <div>
                <span className="text-[11px] font-mono font-bold text-accent block">
                  {shift.day}
                </span>
                <p className="font-serif font-bold text-xs text-primary dark:text-white mt-1">
                  {shift.shift}
                </p>
                <p className="text-xs font-mono text-charcoal-muted dark:text-gray-300 mt-0.5">
                  {shift.hours}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px]">
                <span className="text-charcoal-muted block truncate">
                  {shift.role}
                </span>
                <span
                  className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    shift.status === 'Active Today'
                      ? 'bg-accent text-primary-900'
                      : shift.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/10 text-charcoal-muted'
                  }`}
                >
                  {shift.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Requests & Applications Table */}
      <div className="card-luxury-3d overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/70 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              My Leave Applications & Time-Off History
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Official status of submitted leave requests and compensatory time off
            </p>
          </div>
          <button
            type="button"
            onClick={() => setViewMode('leave')}
            className="px-3.5 py-1.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold btn-3d shadow-gold"
          >
            + Apply for Leave
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Scheduled Dates</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
                <th className="py-3.5 px-4">Colleague Coverage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Filed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {leaveRequests.map(lve => (
                <tr key={lve.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">
                    {lve.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                    {lve.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {lve.dates}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted max-w-xs truncate">
                    {lve.reason}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-primary dark:text-gray-300">
                    {lve.coverage}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        lve.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {lve.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {lve.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right text-charcoal-muted">
                    {lve.submittedDate}
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

export default StaffSchedulePage;
