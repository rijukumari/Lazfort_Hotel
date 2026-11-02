import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Wifi,
  FileText,
  Plus,
  History,
  Timer,
  ChevronRight,
  TrendingUp,
  Fingerprint,
  CalendarCheck,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffAttendancePage = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: 'list' | 'regularize'
  const isRegularizeRoute = location.pathname.includes('/regularize') || location.pathname.includes('/clock');
  const [viewMode, setViewMode] = useState(isRegularizeRoute ? 'regularize' : 'list');

  useEffect(() => {
    if (location.pathname.includes('/regularize')) {
      setViewMode('regularize');
    } else {
      setViewMode('list');
    }
  }, [location.pathname]);

  // Clock status state
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('07:02 AM');
  const [shiftNote, setShiftNote] = useState('');

  // Attendance history records
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 'ATT-2026-10-31',
      date: '2026-10-31',
      day: 'Today',
      shift: 'Morning Concierge (07:00 - 15:30)',
      clockIn: '07:02 AM',
      clockOut: '— Pending —',
      totalHours: '7.5 hrs (Active)',
      overtime: '—',
      verification: 'RFID Keycard & Geofence',
      status: 'On Duty',
      regularized: false,
    },
    {
      id: 'ATT-2026-10-30',
      date: '2026-10-30',
      day: 'Friday',
      shift: 'Morning Concierge (07:00 - 15:30)',
      clockIn: '06:58 AM',
      clockOut: '16:00 PM',
      totalHours: '8.5 hrs',
      overtime: '+1.0 hr (Approved)',
      verification: 'Biometric Touch',
      status: 'Present',
      regularized: false,
    },
    {
      id: 'ATT-2026-10-29',
      date: '2026-10-29',
      day: 'Thursday',
      shift: 'Morning Concierge (07:00 - 15:30)',
      clockIn: '07:14 AM',
      clockOut: '15:35 PM',
      totalHours: '8.0 hrs',
      overtime: '—',
      verification: 'Biometric Touch',
      status: 'Late (14m)',
      regularized: true,
      note: 'Monaco GP road closure delay; supervisor pre-notified.',
    },
    {
      id: 'ATT-2026-10-28',
      date: '2026-10-28',
      day: 'Wednesday',
      shift: 'Evening Concierge (15:00 - 23:30)',
      clockIn: '14:55 PM',
      clockOut: '00:15 AM',
      totalHours: '9.3 hrs',
      overtime: '+1.5 hrs (Approved)',
      verification: 'Mobile PIN & Beacon',
      status: 'Overtime',
      regularized: false,
    },
    {
      id: 'ATT-2026-10-27',
      date: '2026-10-27',
      day: 'Tuesday',
      shift: 'Scheduled Rest Day',
      clockIn: '—',
      clockOut: '—',
      totalHours: '0.0 hrs',
      overtime: '—',
      verification: 'PMS Roster',
      status: 'Rest Day',
      regularized: false,
    },
    {
      id: 'ATT-2026-10-26',
      date: '2026-10-26',
      day: 'Monday',
      shift: 'Morning Concierge (07:00 - 15:30)',
      clockIn: '07:01 AM',
      clockOut: '15:30 PM',
      totalHours: '8.0 hrs',
      overtime: '—',
      verification: 'Biometric Touch',
      status: 'Present',
      regularized: false,
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [regularizeForm, setRegularizeForm] = useState({
    date: new Date().toISOString().split('T')[0],
    correctedIn: '07:00',
    correctedOut: '15:30',
    reason: 'Biometric Terminal Sync Delay',
    explanation: '',
  });

  const handleToggleClock = () => {
    if (isClockedIn) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(false);
      setAttendanceRecords(prev =>
        prev.map((rec, i) =>
          i === 0
            ? {
              ...rec,
              clockOut: timeStr,
              totalHours: '8.2 hrs',
              status: 'Present',
            }
            : rec
        )
      );
      showToast(
        'Clocked Out Successfully',
        `Duty shift finalized at ${timeStr}. Attendance log submitted.`,
        'info'
      );
    } else {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(true);
      setClockInTime(timeStr);
      showToast(
        'Clocked In — Duty Begun',
        `Biometric attendance registered at ${timeStr}. Active in Concierge Services.`,
        'success'
      );
    }
  };

  const handleOpenRegularize = (record) => {
    setSelectedRecord(record);
    setRegularizeForm({
      date: record?.date || new Date().toISOString().split('T')[0],
      correctedIn: record?.clockIn && record.clockIn !== '—' ? record.clockIn.replace(/[^0-9:]/g, '') : '07:00',
      correctedOut: record?.clockOut && record.clockOut !== '— Pending —' ? record.clockOut.replace(/[^0-9:]/g, '') : '15:30',
      reason: 'Biometric Terminal Sync Delay',
      explanation: record?.note || '',
    });
    setViewMode('regularize');
  };

  const handleSaveRegularize = (e) => {
    e.preventDefault();
    if (selectedRecord) {
      setAttendanceRecords(prev =>
        prev.map(r =>
          r.id === selectedRecord.id
            ? {
              ...r,
              status: 'Regularized',
              regularized: true,
              note: regularizeForm.explanation,
            }
            : r
        )
      );
    }
    setViewMode('list');
    showToast(
      'Regularization Submitted',
      'Attendance correction request forwarded to HR Supervisor for approval.',
      'success'
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'On Duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            On Duty (Active)
          </span>
        );
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Present
          </span>
        );
      case 'Overtime':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-500 border border-purple-500/30 whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5" />
            Overtime
          </span>
        );
      case 'Late (14m)':
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5" />
            Late Arrival
          </span>
        );
      case 'Regularized':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-500 border border-teal-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Regularized
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-charcoal/20 text-charcoal-muted border border-charcoal/30 whitespace-nowrap">
            Rest Day
          </span>
        );
    }
  };

  // FULL PAGE VIEW: REGULARIZATION REQUEST
  if (viewMode === 'regularize') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title="Attendance Regularization & Correction Terminal"
          description="Submit an official timesheet adjustment request to HR Operations and Shift Supervisor."
          badge="Audit Correction"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Attendance Log
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Adjustment Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                All regularizations are audited and subject to biometric review.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveRegularize} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Duty Date
                </label>
                <input
                  type="date"
                  value={regularizeForm.date}
                  onChange={e => setRegularizeForm({ ...regularizeForm, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Actual Check-In Time
                </label>
                <input
                  type="time"
                  value={regularizeForm.correctedIn}
                  onChange={e => setRegularizeForm({ ...regularizeForm, correctedIn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Actual Check-Out Time
                </label>
                <input
                  type="time"
                  value={regularizeForm.correctedOut}
                  onChange={e => setRegularizeForm({ ...regularizeForm, correctedOut: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Reason for Adjustment
              </label>
              <select
                value={regularizeForm.reason}
                onChange={e => setRegularizeForm({ ...regularizeForm, reason: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
              >
                <option value="Biometric Terminal Sync Delay">Biometric Terminal Sync Delay</option>
                <option value="Off-Site VIP Guest Service">Off-Site VIP Guest Chauffeur Service</option>
                <option value="Supervisor Direct Authorization">Supervisor Direct Authorization</option>
                <option value="Helipad Transit Escort Duty">Helipad Transit Escort Duty</option>
                <option value="Emergency Shift Extension">Emergency Shift Extension</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Detailed Context & Authorizing Supervisor
              </label>
              <textarea
                value={regularizeForm.explanation}
                onChange={e => setRegularizeForm({ ...regularizeForm, explanation: e.target.value })}
                rows={5}
                placeholder="Describe why check-in/out was missing or modified and reference authorizing supervisor..."
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80 dark:border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Forwarded to Monaco Resort Human Capital Registry
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
                  Submit for Approval
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: ATTENDANCE TERMINAL
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Staff Attendance & Biometric Duty Terminal"
        description="Sebastian Laurent • Head Concierge & Les Clefs d'Or • Active on Morning Roster"
        badge="Biometric Verified"
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenRegularize(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              Request Regularization
            </button>
            <button
              type="button"
              onClick={handleToggleClock}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider btn-3d shadow-gold transition-all whitespace-nowrap shrink-0 ${isClockedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                  : 'gold-gradient-bg text-primary-900'
                }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{isClockedIn ? 'Clock Out (Finish Shift)' : 'Clock In (Begin Shift)'}</span>
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <StatsGrid columns={4}>
        <StatCard
          title="Current Duty Status"
          value={isClockedIn ? 'On Duty' : 'Off Duty'}
          change={isClockedIn ? `Clocked in at ${clockInTime}` : 'Shift concluded'}
          isPositive={isClockedIn}
          iconName="Clock"
          subtitle="Palace Concierge Desk"
        />
        <StatCard
          title="Monthly Attendance"
          value="22 / 24 Days"
          change="91.6% Adherence"
          isPositive={true}
          iconName="CalendarCheck"
          subtitle="October 2026 Cycle"
        />
        <StatCard
          title="Approved Overtime"
          value="14.5 Hours"
          change="+€362.50 Compensation"
          isPositive={true}
          iconName="TrendingUp"
          subtitle="UBS Payroll Included"
        />
        <StatCard
          title="Leave Entitlement"
          value="16 Days"
          change="12 Annual • 4 Personal"
          isPositive={true}
          iconName="CheckCircle"
          subtitle="Accrued Paid Leave"
        />
      </StatsGrid>

      {/* Real-Time Punch Terminal Card */}
      <div className="card-luxury-3d p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Monaco Palace Time Terminal (PMS v2.5)
              </h3>
            </div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-xl leading-relaxed">
              Biometric check-in station equipped with automatic geofence triangulation and timestamp encryption. Current shift: <strong>Morning Concierge (07:00 - 15:30)</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                Geofence: Inside Lobby Station A
              </span>
              <span className="flex items-center gap-1.5 text-accent font-semibold">
                <Wifi className="w-3.5 h-3.5" />
                Network: LAZFORT-STAFF-SECURE
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Shift handover note..."
              value={shiftNote}
              onChange={e => setShiftNote(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent min-w-[220px]"
            />
            <button
              type="button"
              onClick={handleToggleClock}
              className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider btn-3d shadow-gold whitespace-nowrap shrink-0 inline-flex items-center justify-center min-w-[130px] ${isClockedIn
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'gold-gradient-bg text-primary-900'
                }`}
            >
              <span>{isClockedIn ? 'Punch Out' : 'Punch In'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="card-luxury-3d overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/70 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Shift Attendance & Punch Records
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Verified electronic timesheets for the current billing cycle
            </p>
          </div>
          <span className="text-xs font-mono text-accent">
            {attendanceRecords.length} Shifts Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Date & Day</th>
                <th className="py-3.5 px-4">Shift Title</th>
                <th className="py-3.5 px-4">Clock In</th>
                <th className="py-3.5 px-4">Clock Out</th>
                <th className="py-3.5 px-4">Total Hours</th>
                <th className="py-3.5 px-4">Overtime</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {attendanceRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-primary dark:text-white block font-mono">
                      {rec.date}
                    </span>
                    <span className="text-[11px] text-charcoal-muted">{rec.day}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-primary dark:text-gray-200">
                    {rec.shift}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {rec.clockIn}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-charcoal-muted">
                    {rec.clockOut}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    {rec.totalHours}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-accent font-medium">
                    {rec.overtime}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-charcoal-muted font-mono">
                    {rec.verification}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(rec.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenRegularize(rec)}
                      className="px-2.5 py-1 rounded-lg border border-accent/40 text-xs text-accent hover:bg-accent/15 font-semibold transition-all shadow-sm whitespace-nowrap shrink-0"
                      title="Request Regularization / Correction"
                    >
                      Adjust
                    </button>
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

export default StaffAttendancePage;
