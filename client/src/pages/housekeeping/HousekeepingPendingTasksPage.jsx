import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import {
  Clock,
  AlertTriangle,
  Play,
  BedDouble,
  User,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const HousekeepingPendingTasksPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [], updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  // Pending, incomplete housekeeping tasks
  const pendingTasks = useMemo(() => {
    return tasks.filter(t => {
      const isPending = t.status === 'pending' || t.status === 'in_progress';
      if (!isPending) return false;

      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        t.roomNumber?.toLowerCase().includes(q) ||
        t.roomType?.toLowerCase().includes(q) ||
        t.assignedStaffName?.toLowerCase().includes(q)
      );
    });
  }, [tasks, searchQuery]);

  const columns = [
    {
      key: 'roomNumber',
      header: 'Chamber / Suite',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm text-primary dark:text-white">
              Suite {t.roomNumber}
            </span>
            <span className="block text-[11px] text-charcoal-muted dark:text-gray-400">
              {t.roomType || 'Royal Chamber'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'assignedStaffName',
      header: 'Assigned Valet',
      render: (t) => (
        <span className="text-xs font-medium text-primary dark:text-white">
          {t.assignedStaffName || 'Unassigned Valet'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Urgency',
      render: (t) => (
        <StatusBadge
          status={t.priority === 'urgent' ? 'cancelled' : t.priority === 'high' ? 'pending' : 'completed'}
          label={t.priority ? t.priority.toUpperCase() : 'NORMAL'}
        />
      ),
    },
    {
      key: 'status',
      header: 'Current Status',
      render: (t) => (
        <StatusBadge
          status={t.status === 'in_progress' ? 'pending' : 'cancelled'}
          label={t.status === 'in_progress' ? 'In Progress' : 'Pending Queue'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (t) => (
        <Button
          variant="primary"
          size="xs"
          icon={Play}
          onClick={() => {
            updateCleaningTaskStatus(t.id, 'in_progress');
            showToast('Turnover Active', `Sanitization commenced for Suite ${t.roomNumber}.`, 'info');
          }}
        >
          Expedite
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Housekeeping Tasks"
        subtitle="Unserviced suites, pending turnovers, and queues requiring white-glove team dispatch."
        icon={Clock}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/housekeeping/dashboard/today')}
            >
              Today's Schedule
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={() => navigate('/housekeeping/cleaning/todo')}
            >
              Rooms To Clean
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Pending Turnovers"
          value={pendingTasks.length}
          subtitle="Suites awaiting sanitation"
          icon={Clock}
        />
        <StatCard
          title="High / Urgent Priority"
          value={pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
          subtitle="Requires immediate turnover"
          icon={AlertTriangle}
        />
        <StatCard
          title="Awaiting Assignment"
          value={pendingTasks.filter(t => !t.assignedStaffName).length}
          subtitle="Ready for staff dispatch"
          icon={User}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search pending duties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pendingTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No pending tasks found. All chamber turns are cleared!"
        />
      </div>
    </div>
  );
};

export default HousekeepingPendingTasksPage;

