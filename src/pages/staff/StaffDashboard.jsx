import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { Clock, MessageSquare, Briefcase, Calendar, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffDashboard = () => {
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime] = useState('07:02 AM Today');
  const { showToast } = useToast();

  const handleToggleClock = () => {
    setIsClockedIn(!isClockedIn);
    showToast(
      isClockedIn ? 'Clocked Out' : 'Clocked In',
      isClockedIn
        ? 'Shift ended. Great work today!'
        : 'Shift started. Active in Concierge Services.',
      isClockedIn ? 'info' : 'success'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Staff Operations & Duty Terminal"
        description="Sebastian Laurent • Head Concierge & Clefs d’Or • Active on Morning Shift."
        badge="Concierge Services"
        actions={
          <button
            onClick={handleToggleClock}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all btn-3d shadow-sm ${isClockedIn
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'gold-gradient-bg text-primary-900'
              }`}
          >
            <Clock className="w-4 h-4" />
            {isClockedIn ? 'Clock Out (End Shift)' : 'Clock In (Begin Shift)'}
          </button>
        }
      />

      <StatsGrid columns={4}>
        <StatCard
          title="Attendance Status"
          value={isClockedIn ? 'On Duty' : 'Off Duty'}
          change={isClockedIn ? `Since ${clockInTime}` : 'Not clocked in'}
          isPositive={isClockedIn}
          iconName="Clock"
        />
        <StatCard
          title="Scheduled Shift"
          value="07:00 - 15:30"
          change="Morning Shift"
          isPositive={true}
          iconName="Calendar"
        />
        <StatCard
          title="VIP Dispatches Today"
          value="8 Completed"
          change="100% Guest Satisfaction"
          isPositive={true}
          iconName="Sparkles"
        />
        <StatCard
          title="Upcoming Rest Days"
          value="Sat & Sun"
          change="Rotational Roster"
          isPositive={true}
          iconName="ShieldCheck"
        />
      </StatsGrid>

      {/* Assigned Tasks & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Duties */}
        <div className="card-luxury-3d p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Briefcase className="w-4 h-4" />
              </div>
              Assigned Concierge Missions
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-semibold font-mono">
              3 Active
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Greet Sir Alexander Kensington at Helipad (17:00)',
                desc: 'Escort to Suite PH-1201 and confirm Dom Pérignon 2008 chilling.',
                priority: 'High',
              },
              {
                title: 'Arrange Riva Yacht Charter for Baron Mateo Rossi',
                desc: 'Confirm captain departure from Port Hercule for 10:00 tomorrow.',
                priority: 'Medium',
              },
              {
                title: 'Private Opera Box Booking for Dr. Vivienne Moreau',
                desc: 'Opéra de Monte-Carlo gala evening tickets reservation.',
                priority: 'Low',
              },
            ].map((task, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/70 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 flex items-start justify-between gap-3 shadow-sm"
              >
                <div>
                  <h5 className="text-xs font-bold text-primary dark:text-white">
                    {task.title}
                  </h5>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1">{task.desc}</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent rounded-lg border border-accent/30 font-mono">
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements & Team Communication */}
        <div className="card-luxury-3d p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <MessageSquare className="w-4 h-4" />
              </div>
              General Management Notices
            </h3>
            <span className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">Lazfort ERP Intranet</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/25 text-xs">
              <span className="text-[10px] font-mono uppercase text-accent font-bold tracking-wider">
                From GM Lord Sterling
              </span>
              <p className="font-semibold text-primary dark:text-white mt-1 text-sm">
                Monaco Grand Prix VIP Delegation Arrival Protocol
              </p>
              <p className="text-charcoal-muted dark:text-gray-300 mt-1.5 leading-relaxed text-[11px]">
                All penthouse suites must adhere to double-sanitization and private security badge validation starting Friday morning.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 text-xs shadow-sm">
              <span className="text-[10px] font-mono uppercase text-charcoal-muted dark:text-gray-400 font-bold tracking-wider font-mono">
                F&B Sommelier Team
              </span>
              <p className="font-semibold text-primary dark:text-white mt-1 text-sm">
                New Burgundy Grand Cru Cellar Allocation
              </p>
              <p className="text-charcoal-muted dark:text-gray-300 mt-1.5 leading-relaxed text-[11px]">
                Limited vintage bottles from Domaine de la Romanée-Conti received for VIP cellar pairings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

