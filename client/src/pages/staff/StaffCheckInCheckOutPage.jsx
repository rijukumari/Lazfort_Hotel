import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Fingerprint,
  MapPin,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffCheckInCheckOutPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('07:02 AM Today');
  const [shiftHoursCompleted, setShiftHoursCompleted] = useState('4 hrs 12 mins');

  const [shiftActivityRecords, setShiftActivityRecords] = useState([
    {
      id: 'ACT-01',
      action: 'Clocked In (Duty Commenced)',
      timestamp: '07:02 AM Today',
      terminal: 'Main Reception Concierge Kiosk #2',
      verification: 'Biometric Verified',
      status: 'success',
    },
    {
      id: 'ACT-02',
      action: 'Morning Briefing Acknowledged',
      timestamp: '07:15 AM Today',
      terminal: 'Staff Station Terminal',
      verification: 'Supervisor Signed',
      status: 'info',
    },
    {
      id: 'ACT-03',
      action: 'First VIP Dispatch Commenced',
      timestamp: '08:30 AM Today',
      terminal: 'Handheld Concierge Terminal',
      verification: 'RFID Tap',
      status: 'info',
    },
  ]);

  const handleToggleClock = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    if (isClockedIn) {
      setIsClockedIn(false);
      setShiftActivityRecords(prev => [
        {
          id: `ACT-${Date.now().toString().slice(-4)}`,
          action: 'Clocked Out (Shift Concluded)',
          timestamp: nowTime,
          terminal: 'Main Reception Concierge Kiosk #2',
          verification: 'Biometric Verified',
          status: 'warning',
        },
        ...prev,
      ]);
      showToast('Shift Concluded', 'Clock-out recorded. Great work today!', 'info');
    } else {
      setIsClockedIn(true);
      setClockInTime(nowTime);
      setShiftActivityRecords(prev => [
        {
          id: `ACT-${Date.now().toString().slice(-4)}`,
          action: 'Clocked In (Duty Commenced)',
          timestamp: nowTime,
          terminal: 'Main Reception Concierge Kiosk #2',
          verification: 'Biometric Verified',
          status: 'success',
        },
        ...prev,
      ]);
      showToast('Shift Commenced', 'Clock-in verified! Duty status active.', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Check-in / Check-out Terminal"
        subtitle="Live biometric punch terminal, shift timecard validation, and real-time station logging."
        icon={Clock}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Calendar}
              onClick={() => navigate('/staff/attendance')}
            >
              My Attendance Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Timer}
              onClick={() => navigate('/staff/attendance/history')}
            >
              Daily Attendance History
            </Button>
          </div>
        }
      />

      {/* Clock Terminal Action Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-charcoal-card via-charcoal-bg to-charcoal-card dark:from-[#0c1424] dark:via-[#080d19] dark:to-[#0c1424] border border-primary/20 dark:border-accent/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Fingerprint className="w-64 h-64 text-accent" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isClockedIn ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                {isClockedIn ? 'Active On Shift' : 'Off Duty / Clocked Out'}
              </span>
            </div>
            <h2 className="font-serif font-black text-3xl text-primary dark:text-white">
              {isClockedIn ? 'Sebastian Laurent • On Duty' : 'Sebastian Laurent • Off Duty'}
            </h2>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-xl">
              Shift Roster: <strong>Morning Concierge Lead (07:00 - 15:30)</strong> • Station: <strong>Main Palace Lobby Counter</strong> • Terminal ID: <strong>LZ-BIO-CONC02</strong>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleToggleClock}
              className={`px-8 py-4 rounded-2xl font-serif font-bold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center gap-3 ${
                isClockedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/30'
                  : 'gold-gradient-bg text-primary-900 hover:brightness-110 shadow-gold'
              }`}
            >
              <Fingerprint className="w-5 h-5" />
              <span>{isClockedIn ? 'Clock Out (Conclude Shift)' : 'Clock In (Begin Shift)'}</span>
            </button>
            <span className="font-mono text-[11px] text-charcoal-muted dark:text-gray-400">
              {isClockedIn ? `Checked in since ${clockInTime}` : 'Tap terminal to clock in'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Shift Status"
          value={isClockedIn ? 'Active' : 'Off Duty'}
          subtitle={isClockedIn ? `Since ${clockInTime}` : 'Not on shift'}
          icon={Clock}
        />
        <StatCard
          title="Elapsed Hours Today"
          value={isClockedIn ? shiftHoursCompleted : '0 hrs 00 mins'}
          subtitle="Counted toward daily 8h SLA"
          icon={Timer}
        />
        <StatCard
          title="Terminal Location"
          value="Palace Lobby"
          subtitle="Biometric station validated"
          icon={MapPin}
        />
        <StatCard
          title="Overtime Accrual"
          value="+0.5 hrs"
          subtitle="Approved pre-shift briefing"
          icon={CheckCircle2}
        />
      </div>

      {/* Real-Time Activity Log */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2 border-b border-primary/10 dark:border-white/5 pb-3">
          <Clock className="w-4 h-4 text-accent" />
          Today's Punch & Terminal Verification Log
        </h4>

        <div className="space-y-3">
          {shiftActivityRecords.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.status === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : item.status === 'warning'
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-accent/20 text-accent'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-primary dark:text-white block">{item.action}</span>
                  <span className="text-charcoal-muted dark:text-gray-400 text-[11px]">{item.terminal}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className="font-mono text-accent font-bold">{item.timestamp}</span>
                <span className="badge badge-gold font-mono text-[10px] px-2 py-0.5">{item.verification}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffCheckInCheckOutPage;

