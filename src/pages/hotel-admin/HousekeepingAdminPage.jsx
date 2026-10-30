import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Tabs, Button } from '../../components/ui';
import { CleaningTaskCard } from '../../components/hotel/CleaningTaskCard';
import { CheckCircle, Plus, Sparkles, Clock, AlertTriangle, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const HousekeepingAdminPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks, updateCleaningTaskStatus, toggleCleaningChecklist, rooms } = useERP();
  const [activeTab, setActiveTab] = useState('all');
  const { showToast } = useToast();

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

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

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
    </div>
  );
};

export default HousekeepingAdminPage;

