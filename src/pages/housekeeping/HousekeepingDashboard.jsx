import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { mockHousekeepingTasks } from '../../data/mockHousekeeping';
import { CleaningTaskCard } from '../../components/hotel/CleaningTaskCard';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { Sparkles, Wrench, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HousekeepingDashboard = () => {
  const [tasks, setTasks] = useState(mockHousekeepingTasks || []);
  const { showToast } = useToast();

  const handleToggleChecklist = (taskId, index) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedChecklist = [...t.checklist];
          updatedChecklist[index].completed = !updatedChecklist[index].completed;
          return { ...t, checklist: updatedChecklist };
        }
        return t;
      })
    );
  };

  const handleCompleteTask = (task) => {
    setTasks(prev =>
      prev.map(t => (t.id === task.id ? { ...t, status: 'completed' } : t))
    );
    showToast(
      'Turnover Finished',
      `Suite ${task.roomNumber} sanitized & prepped for guest arrival.`,
      'success'
    );
  };

  const handleReportIssue = () => {
    showToast(
      'Issue Reported',
      'Engineering and Maintenance dispatched to suite.',
      'warning'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Housekeeping Lead & Suite Turnovers"
        description="Assigned turnover duties, white-glove hygiene protocols, and sanitation inspections."
        badge="Lead Specialist"
        actions={
          <button
            onClick={handleReportIssue}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-all btn-3d shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5" />
            Report Suite Issue
          </button>
        }
      />

      <StatsGrid columns={3}>
        <StatCard
          title="Assigned Suites Today"
          value="4 Turnovers"
          change="2 In-Progress"
          isPositive={true}
          iconName="Sparkles"
        />
        <StatCard
          title="Hygiene Checklist Score"
          value="100%"
          change="Sovereign Standard"
          isPositive={true}
          iconName="CheckCircle"
        />
        <StatCard
          title="Estimated Completion"
          value="15:45 Today"
          change="Before VIP check-in"
          isPositive={true}
          iconName="Clock"
        />
      </StatsGrid>

      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
          Active Room Turnover Assignments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map(task => (
            <CleaningTaskCard
              key={task.id}
              task={task}
              onToggleChecklist={handleToggleChecklist}
              onComplete={handleCompleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;

