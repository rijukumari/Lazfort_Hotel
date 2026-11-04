import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  User,
  Coffee,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffWeeklySchedulePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeWeek, setActiveWeek] = useState('current');

  const [days] = useState([
    {
      dayName: 'Monday',
      date: 'Nov 02, 2026',
      shiftName: 'Morning Shift',
      hours: '07:00 AM - 03:30 PM',
      station: 'Palace Main Lobby Counter',
      role: 'Lead Concierge',
      status: 'Completed',
      notes: 'Monaco Harbor yacht arrivals coordination.',
      isToday: false,
    },
    {
      dayName: 'Tuesday',
      date: 'Nov 03, 2026',
      shiftName: 'Morning Shift',
      hours: '07:00 AM - 03:30 PM',
      station: 'Palace Main Lobby Counter',
      role: 'Lead Concierge',
      status: 'Completed',
      notes: 'VIP guest arrivals check-in escort.',
      isToday: false,
    },
    {
      dayName: 'Wednesday',
      date: 'Nov 04, 2026 (Today)',
      shiftName: 'Day Shift & VIP Operations',
      hours: '07:00 AM - 03:30 PM',
      station: 'VIP Arrival Rotunda',
      role: 'Head Concierge & Clefs d’Or Lead',
      status: 'Active Duty',
      notes: 'Presidential Penthouse suite check-ins.',
      isToday: true,
    },
    {
      dayName: 'Thursday',
      date: 'Nov 05, 2026',
      shiftName: 'Day Shift & VIP Operations',
      hours: '07:00 AM - 03:30 PM',
      station: 'VIP Arrival Rotunda',
      role: 'Head Concierge Lead',
      status: 'Upcoming',
      notes: 'Royal delegation limousine dispatch.',
      isToday: false,
    },
    {
      dayName: 'Friday',
      date: 'Nov 06, 2026',
      shiftName: 'Evening Shift',
      hours: '03:00 PM - 11:30 PM',
      station: 'Helipad VIP Lounge',
      role: 'Evening Concierge Lead',
      status: 'Upcoming',
      notes: 'Helipad transfers & Casino de Monte-Carlo bookings.',
      isToday: false,
    },
    {
      dayName: 'Saturday',
      date: 'Nov 07, 2026',
      shiftName: 'Scheduled Rest Day',
      hours: 'Off Duty',
      station: 'Weekly Rest Period',
      role: 'Off Duty',
      status: 'Rest Day',
      notes: 'Approved rostered rest period.',
      isToday: false,
    },
    {
      dayName: 'Sunday',
      date: 'Nov 08, 2026',
      shiftName: 'Scheduled Rest Day',
      hours: 'Off Duty',
      station: 'Weekly Rest Period',
      role: 'Off Duty',
      status: 'Rest Day',
      notes: 'Approved rostered rest period.',
      isToday: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Duty Schedule & Shift Calendar"
        subtitle="Monday to Sunday palace shift timings, station rosters, duty assignments, and rest periods."
        icon={CalendarDays}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Calendar}
              onClick={() => navigate('/staff/schedule')}
            >
              My Shifts Overview
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/staff/schedule/apply-leave')}
            >
              Apply for Leave
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Weekly Assigned Hours"
          value="40.0 Hours"
          subtitle="5 Scheduled Working Shifts"
          icon={CalendarDays}
        />
        <StatCard
          title="Active Duty Station"
          value="VIP Rotunda"
          subtitle="Station Lead Concierge"
          icon={User}
        />
        <StatCard
          title="Upcoming Rest Period"
          value="Saturday & Sunday"
          subtitle="Nov 07 - Nov 08"
          icon={Coffee}
        />
      </div>

      {/* Week Calendar Grid */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-primary/10 dark:border-white/5 pb-4">
          <div>
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Monday to Sunday Shift Roster
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Department: Concierge & Guest Services • Supervisor: Julian St. Clair (GM)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 pt-2">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all min-h-[220px] ${
                d.isToday
                  ? 'border-accent bg-accent/15 shadow-gold ring-1 ring-accent'
                  : d.status === 'Completed'
                  ? 'border-primary/10 dark:border-white/5 bg-charcoal-bg/60 dark:bg-[#080d19]/60 opacity-80'
                  : d.status === 'Rest Day'
                  ? 'border-primary/10 dark:border-white/5 bg-charcoal-bg/30 dark:bg-[#080d19]/30'
                  : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40'
              }`}
            >
              <div className="space-y-2">
                <div className="border-b border-primary/10 dark:border-white/5 pb-2">
                  <span className="font-serif font-bold text-xs text-primary dark:text-white block">
                    {d.dayName}
                  </span>
                  <span className="text-[10px] text-charcoal-muted dark:text-gray-400 block font-mono">
                    {d.date.split(',')[1]?.trim() || d.date}
                  </span>
                </div>

                <div>
                  <span className={`text-[11px] font-bold block ${d.isToday ? 'text-accent' : 'text-primary dark:text-white'}`}>
                    {d.shiftName}
                  </span>
                  <span className="font-mono text-[10px] text-charcoal dark:text-gray-300 block mt-0.5">
                    {d.hours}
                  </span>
                </div>

                <div className="text-[10px] text-charcoal-muted dark:text-gray-400 space-y-0.5 pt-1">
                  <p><strong className="text-primary dark:text-white">Station:</strong> {d.station}</p>
                  <p><strong className="text-primary dark:text-white">Role:</strong> {d.role}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-primary/10 dark:border-white/5 mt-2">
                <StatusBadge
                  status={d.status === 'Completed' ? 'completed' : d.isToday ? 'pending' : d.status === 'Rest Day' ? 'info' : 'pending'}
                  label={d.status}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffWeeklySchedulePage;

