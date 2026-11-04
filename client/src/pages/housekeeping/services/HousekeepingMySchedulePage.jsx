import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  BedDouble,
  User,
  Coffee,
  AlertCircle,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const HousekeepingMySchedulePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeWeek, setActiveWeek] = useState('current'); // 'current' | 'next'

  // Weekly shift roster for current logged-in Housekeeping employee / lead
  const [weeklyShifts] = useState([
    {
      id: 'SH-01',
      day: 'Monday, Nov 02',
      shiftType: 'Morning White-Glove Shift',
      hours: '07:00 AM - 03:30 PM',
      wing: 'Royal Penthouse Wings (Floors 10-18)',
      station: 'Chamber Team Lead Station 1',
      assignedSuites: 'PH-1001, PH-1002, PH-1105, PH-1201',
      status: 'Completed',
      breakTime: '11:30 AM - 12:15 PM',
      isToday: false,
    },
    {
      id: 'SH-02',
      day: 'Tuesday, Nov 03',
      shiftType: 'Morning White-Glove Shift',
      hours: '07:00 AM - 03:30 PM',
      wing: 'Royal Penthouse Wings (Floors 10-18)',
      station: 'Chamber Team Lead Station 1',
      assignedSuites: 'PH-1003, PH-1004, ST-801, ST-802',
      status: 'Completed',
      breakTime: '11:30 AM - 12:15 PM',
      isToday: false,
    },
    {
      id: 'SH-03',
      day: 'Wednesday, Nov 04 (Today)',
      shiftType: 'Day Shift & Turnarounds',
      hours: '07:00 AM - 03:30 PM',
      wing: 'Executive Suites (Floors 4-9)',
      station: 'Turnover Hub Central',
      assignedSuites: 'JN-401, JN-402, ST-501, ST-502',
      status: 'Active On Duty',
      breakTime: '12:00 PM - 12:45 PM',
      isToday: true,
    },
    {
      id: 'SH-04',
      day: 'Thursday, Nov 05',
      shiftType: 'Day Shift & Turnarounds',
      hours: '07:00 AM - 03:30 PM',
      wing: 'Executive Suites (Floors 4-9)',
      station: 'Turnover Hub Central',
      assignedSuites: 'JN-403, JN-404, ST-601, ST-602',
      status: 'Scheduled',
      breakTime: '12:00 PM - 12:45 PM',
      isToday: false,
    },
    {
      id: 'SH-05',
      day: 'Friday, Nov 06',
      shiftType: 'Evening VIP Turndown',
      hours: '03:00 PM - 11:30 PM',
      wing: 'All Presidential Penthouses',
      station: 'Evening Turndown Dispatch',
      assignedSuites: 'PH-1001 to PH-1202',
      status: 'Scheduled',
      breakTime: '07:00 PM - 07:45 PM',
      isToday: false,
    },
    {
      id: 'SH-06',
      day: 'Saturday, Nov 07',
      shiftType: 'Weekly Roster Rest Day',
      hours: 'Off Duty',
      wing: 'Rest Period',
      station: 'Off Duty',
      assignedSuites: 'None',
      status: 'Scheduled Rest Day',
      breakTime: '—',
      isToday: false,
    },
    {
      id: 'SH-07',
      day: 'Sunday, Nov 08',
      shiftType: 'Weekly Roster Rest Day',
      hours: 'Off Duty',
      wing: 'Rest Period',
      station: 'Off Duty',
      assignedSuites: 'None',
      status: 'Scheduled Rest Day',
      breakTime: '—',
      isToday: false,
    },
  ]);

  const handleRequestSwap = () => {
    showToast('Shift Swap Requested', 'Shift swap inquiry forwarded to Housekeeping Head Butler.', 'info');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Housekeeping Schedule"
        subtitle="Personal duty calendar, assigned chamber wings, shift hours, and weekly turnover allocations."
        icon={CalendarDays}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Clock}
              onClick={handleRequestSwap}
            >
              Request Shift Swap
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={BedDouble}
              onClick={() => navigate('/housekeeping/cleaning/assigned')}
            >
              My Assigned Rooms
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Current Weekly Roster"
          value="37.5 Hours"
          subtitle="5 Scheduled Working Shifts"
          icon={CalendarDays}
        />
        <StatCard
          title="Today's Shift Hours"
          value="07:00 - 15:30"
          subtitle="Active Day Shift"
          icon={Clock}
        />
        <StatCard
          title="Assigned Chambers Today"
          value="4 Suites"
          subtitle="Floors 4-9 Executive Wing"
          icon={BedDouble}
        />
        <StatCard
          title="Next Scheduled Rest Day"
          value="Saturday"
          subtitle="Nov 07 - Weekly Rest"
          icon={Coffee}
        />
      </div>

      {/* Week View Calendar Cards */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-primary/10 dark:border-white/5 pb-4">
          <div>
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Weekly Shift Calendar
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Assigned to: Svetlana Ivanova (Senior Lead Specialist)
            </p>
          </div>

          <div className="flex gap-1.5 p-1 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 text-xs">
            <button
              type="button"
              onClick={() => setActiveWeek('current')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeWeek === 'current'
                  ? 'bg-accent/20 text-accent font-bold'
                  : 'text-charcoal-muted dark:text-gray-400 hover:text-white'
              }`}
            >
              Current Week
            </button>
            <button
              type="button"
              onClick={() => setActiveWeek('next')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeWeek === 'next'
                  ? 'bg-accent/20 text-accent font-bold'
                  : 'text-charcoal-muted dark:text-gray-400 hover:text-white'
              }`}
            >
              Next Week (Draft)
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {weeklyShifts.map(s => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                s.isToday
                  ? 'border-accent bg-accent/10 shadow-gold'
                  : s.status === 'Completed'
                  ? 'border-primary/10 dark:border-white/5 bg-charcoal-bg/60 dark:bg-[#080d19]/60 opacity-80'
                  : s.status.includes('Rest')
                  ? 'border-primary/10 dark:border-white/5 bg-charcoal-bg/40 dark:bg-[#080d19]/40'
                  : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  s.isToday
                    ? 'bg-accent text-primary dark:text-[#080d19]'
                    : s.status.includes('Rest')
                    ? 'bg-gray-500/10 text-gray-400'
                    : 'bg-accent/10 text-accent'
                }`}>
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-primary dark:text-white">
                      {s.day}
                    </span>
                    {s.isToday && (
                      <span className="badge badge-gold font-mono text-[10px] px-2 py-0.5">
                        Today's Duty
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal dark:text-gray-300 font-medium mt-0.5">
                    {s.shiftType} • <span className="font-mono text-accent">{s.hours}</span>
                  </p>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1">
                    Station: {s.station} • {s.wing}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-1.5 border-t md:border-t-0 pt-2 md:pt-0 border-primary/10 dark:border-white/5">
                <StatusBadge
                  status={s.status === 'Completed' ? 'completed' : s.isToday ? 'pending' : s.status.includes('Rest') ? 'info' : 'pending'}
                  label={s.status}
                />
                <span className="text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">
                  Assigned: {s.assignedSuites}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HousekeepingMySchedulePage;

