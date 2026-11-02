import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, StatCard, Tabs, Button } from '../../components/ui';
import { CleaningTaskCard } from '../../components/hotel/CleaningTaskCard';
import { CheckCircle, Plus, Sparkles, Clock, AlertTriangle, Award, Package, ShieldCheck, UserCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const HousekeepingAdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cleaningTasks: tasks, updateCleaningTaskStatus, toggleCleaningChecklist, rooms, staff } = useERP();
  const { showToast } = useToast();

  const getTabFromRoute = (pathname) => {
    if (pathname.includes('/cleaning')) return 'in_progress';
    if (pathname.includes('/inspection')) return 'completed';
    if (pathname.includes('/assignments')) return 'assignments';
    if (pathname.includes('/lost-found')) return 'lost_found';
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getTabFromRoute(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromRoute(location.pathname));
  }, [location.pathname]);

  const [lostFoundItems, setLostFoundItems] = useState([
    { id: 'LF-101', item: 'Cartier Gold Bracelet', suite: 'PH-1201', guest: 'Sir Alexander Kensington', foundBy: 'Marie Laurent', date: '2026-10-28', status: 'Secured in Vault' },
    { id: 'LF-102', item: 'Patek Philippe Watch Box', suite: 'ST-804', guest: 'Dr. Vivienne Moreau', foundBy: 'Margaux Dubois', date: '2026-10-29', status: 'Claimed by Guest' },
    { id: 'LF-103', item: 'Montblanc Meisterstück Pen', suite: 'VL-301', guest: 'Baron Mateo Rossi', foundBy: 'Jean-Luc Picard', date: '2026-10-30', status: 'Secured in Vault' },
  ]);

  const handleToggleChecklist = (taskId, index) => {
    toggleCleaningChecklist(taskId, index);
  };

  const handleCompleteTask = (task) => {
    updateCleaningTaskStatus(task.id, 'inspected');
    showToast(
      'Suite Inspected & Approved',
      `Suite ${task.roomNumber} has been verified and returned to Available inventory.`,
      'success'
    );
  };

  const handleAuditAllSuites = () => {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length === 0) {
      showToast('All Suites Audited', 'No pending turnovers require auditing.', 'info');
      return;
    }
    pendingTasks.forEach(t => updateCleaningTaskStatus(t.id, 'inspected'));
    showToast(
      'Hygiene Audit Complete',
      `${pendingTasks.length} pending suites inspected, approved, and returned to Available inventory.`,
      'success'
    );
  };

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: tasks.filter(t => t.status === 'in_progress').length,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: tasks.filter(t => t.status === 'pending').length,
    },
    {
      id: 'completed',
      label: 'Completed & Inspected',
      count: tasks.filter(t => t.status === 'completed' || t.status === 'inspected').length,
    },
  ];

  const displayedTasks =
    activeTab === 'all'
      ? tasks
      : activeTab === 'completed'
        ? tasks.filter(t => t.status === 'completed' || t.status === 'inspected')
        : tasks.filter(t => t.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Executive Housekeeping & Hygiene Operations"
        description="Room turnover tracking, deep sanitization checklist adherence, and white-glove inspection sign-offs."
        badge="Zero Compromise Hygiene"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CheckCircle}
              onClick={handleAuditAllSuites}
            >
              Audit All Suites
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/housekeeping/schedule')}
            >
              Schedule Turnover
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Turnovers Scheduled"
          value={`${tasks.length} Tasks`}
          change={`${tasks.filter(t => t.status === 'inspected' || t.status === 'completed').length} Cleaned`}
          isPositive={true}
          icon={Sparkles}
          subtitle="White-Glove Standard"
        />
        <StatCard
          title="Urgent VIP Turnovers"
          value={`${tasks.filter(t => t.priority === 'urgent' && t.status !== 'inspected').length} Urgent`}
          change="Expedited protocols"
          isPositive={tasks.filter(t => t.priority === 'urgent' && t.status !== 'inspected').length === 0}
          icon={AlertTriangle}
          subtitle="Arrivals in < 2 Hours"
        />
        <StatCard
          title="Avg Turnaround Time"
          value="48 Mins"
          change="Under 60m SLA"
          isPositive={true}
          icon={Clock}
          subtitle="Executive Floor Teams"
        />
        <StatCard
          title="Hygiene Audit Pass Rate"
          value="100%"
          change="5-Star Sovereign Rating"
          isPositive={true}
          icon={Award}
          subtitle="Medical Grade Sanitization"
        />
      </div>



      {activeTab === 'assignments' ? (
        <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            <span>Housekeeping Butler & Floor Crew Assignments</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasks.slice(0, 6).map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border/60 dark:border-white/5 bg-ivory/30 dark:bg-white/[0.02] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-accent">Suite {t.roomNumber}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent">{t.priority} priority</span>
                </div>
                <p className="text-xs font-semibold text-primary dark:text-white">{t.cleaningType || 'Turnover Sanitation'}</p>
                <div className="flex justify-between text-xs text-charcoal-muted pt-2 border-t border-border/40">
                  <span>Assigned:</span>
                  <span className="font-semibold text-primary dark:text-white">{t.assignedStaffName || 'Marie Laurent'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'lost_found' ? (
        <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <span>Registered Lost & Found Items</span>
            </h3>
            <span className="text-xs font-mono text-accent">3 Items Secured</span>
          </div>
          <div className="divide-y divide-border/60 dark:divide-white/5">
            {lostFoundItems.map(item => (
              <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-primary dark:text-white">{item.item}</p>
                  <p className="text-[11px] text-charcoal-muted">
                    Found in {item.suite} by {item.foundBy} • Guest: {item.guest}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-charcoal-muted">{item.date}</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/15 text-accent border border-accent/25">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTasks.map(task => (
            <CleaningTaskCard
              key={task.id}
              task={task}
              onToggleChecklist={handleToggleChecklist}
              onComplete={handleCompleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HousekeepingAdminPage;

