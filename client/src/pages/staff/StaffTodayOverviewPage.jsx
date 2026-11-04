import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  User,
  BedDouble,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffTodayOverviewPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [todayTasks, setTodayTasks] = useState([
    {
      id: 'TSK-881',
      title: 'Chilled Vintage Champagne & Caviar Service',
      suite: 'Suite 801 (Presidential Penthouse)',
      guestName: 'Lord Alistair Sterling',
      time: '11:00 AM',
      priority: 'Urgent VIP',
      status: 'In Progress',
    },
    {
      id: 'TSK-882',
      title: 'Private Chauffeur & Helipad Transit Coordination',
      suite: 'Suite 604 (Grand Mediterranean)',
      guestName: 'Princess Sophia of Monaco',
      time: '12:30 PM',
      priority: 'High Priority',
      status: 'Pending',
    },
    {
      id: 'TSK-883',
      title: 'Monaco Opera Gala Ticket Verification & Courier',
      suite: 'Suite 502 (Executive Marina Suite)',
      guestName: 'Dr. Vivienne Moreau',
      time: '02:00 PM',
      priority: 'Normal',
      status: 'Pending',
    },
    {
      id: 'TSK-884',
      title: 'Fresh White Orchid Floral Placement',
      suite: 'Suite 703 (Diplomatic Suite)',
      guestName: 'Hon. Arthur Pendelton',
      time: '09:15 AM',
      priority: 'Normal',
      status: 'Completed',
    },
  ]);

  const [shiftTimeline] = useState([
    { time: '07:02 AM', title: 'Biometric Check-in Completed', desc: 'Clocked in at Main Palace Lobby Counter Station #2.' },
    { time: '07:15 AM', title: 'Morning Duty Briefing', desc: 'Reviewed VIP arrivals ledger with GM Julian St. Clair.' },
    { time: '09:15 AM', title: 'Mission TSK-884 Completed', desc: 'White orchid floral arrangement delivered to Suite 703.' },
    { time: '10:15 AM', title: 'Task TSK-881 Dispatched', desc: 'Dom Pérignon 2012 champagne & caviar ordered from cellar.' },
    { time: '12:00 PM', title: 'Scheduled Midday Rest Period', desc: '45-minute staff meal & hydration break.' },
    { time: '03:30 PM', title: 'Scheduled Shift Handover', desc: 'Handover rotation with evening concierge lead.' },
  ]);

  const handleQuickComplete = (taskId) => {
    setTodayTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'Completed' } : t))
    );
    showToast('Task Completed', `Task ${taskId} marked as completed for today.`, 'success');
  };

  const completedCount = todayTasks.filter(t => t.status === 'Completed').length;
  const pendingCount = todayTasks.filter(t => t.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's Operational Duty Overview"
        subtitle="Real-time shift summary, today's task velocity, VIP guest dispatches, and active duty schedule."
        icon={CalendarDays}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Briefcase}
              onClick={() => navigate('/staff/work')}
            >
              My Work Orders
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Clock}
              onClick={() => navigate('/staff/attendance/check-in')}
            >
              Check-in / Check-out
            </Button>
          </div>
        }
      />

      {/* Real-Time Shift Tracker Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-accent/15 via-charcoal-card to-charcoal-bg dark:from-accent/20 dark:via-[#0c1424] dark:to-[#080d19] border border-accent/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold text-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-bold uppercase text-accent tracking-wider">
                Active Morning Shift • In Progress
              </span>
            </div>
            <h3 className="font-serif font-black text-xl text-primary dark:text-white mt-0.5">
              Wednesday Shift: 07:00 AM — 03:30 PM (8.5h Allocated)
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Station: <strong>Palace Main Lobby Counter</strong> • Specialist: <strong>Sebastian Laurent (Lead Concierge)</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-mono text-xs text-charcoal-muted dark:text-gray-400 block">Today's Progress</span>
            <span className="font-mono font-bold text-lg text-emerald-400">
              {Math.round((completedCount / todayTasks.length) * 100)}% Tasks Cleared
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/staff/dashboard')}
          >
            My Dashboard
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Today"
          value={`${todayTasks.length} Missions`}
          subtitle="Total shift duties allocated"
          icon={Briefcase}
        />
        <StatCard
          title="Completed Today"
          value={`${completedCount} Cleared`}
          subtitle="Fulfilled to 5-star standard"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending / In-Progress"
          value={`${pendingCount} Remaining`}
          subtitle="Active on floor now"
          icon={Clock}
        />
        <StatCard
          title="Hours Completed"
          value="4h 12m"
          subtitle="Overtime tracking enabled"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Today's Assigned Duties & Priorities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
            <div className="flex items-center justify-between border-b border-primary/10 dark:border-white/5 pb-3">
              <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-accent" />
                Today's Duties & VIP Priorities
              </h4>
              <span className="badge badge-gold font-mono text-[10px]">
                {pendingCount} Pending Action
              </span>
            </div>

            <div className="space-y-3">
              {todayTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    t.status === 'Completed'
                      ? 'border-primary/10 dark:border-white/5 bg-charcoal-bg/50 dark:bg-[#080d19]/50 opacity-70'
                      : t.priority.includes('Urgent')
                      ? 'border-accent/40 bg-accent/10 shadow-gold'
                      : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent">{t.id}</span>
                      <StatusBadge
                        status={t.priority.includes('Urgent') ? 'cancelled' : 'pending'}
                        label={t.priority}
                      />
                    </div>
                    <p className="font-serif font-bold text-sm text-primary dark:text-white">
                      {t.title}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-charcoal-muted dark:text-gray-400">
                      <span>{t.suite}</span>
                      <span>•</span>
                      <span>{t.guestName}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="font-mono text-xs font-bold text-charcoal dark:text-gray-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {t.time}
                    </span>
                    {t.status !== 'Completed' ? (
                      <Button
                        variant="primary"
                        size="xs"
                        icon={CheckCircle2}
                        onClick={() => handleQuickComplete(t.id)}
                      >
                        Complete
                      </Button>
                    ) : (
                      <span className="badge badge-gold text-[10px] font-mono">Done</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Shift Schedule Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2 border-b border-primary/10 dark:border-white/5 pb-3">
              <Clock className="w-4 h-4 text-accent" />
              Today's Shift Timeline
            </h4>

            <div className="relative pl-6 space-y-4 border-l border-accent/30 text-xs">
              {shiftTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-accent shadow-gold" />
                  <span className="font-mono text-[10px] text-accent block font-bold">{item.time}</span>
                  <span className="font-bold text-primary dark:text-white block mt-0.5">{item.title}</span>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTodayOverviewPage;

