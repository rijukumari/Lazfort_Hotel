import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  BedDouble,
  User,
  Sparkles,
  Search,
  Plus,
  Play
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const HousekeepingTodayTasksPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [], updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  // Today's scheduled cleaning tasks
  const todayTasks = useMemo(() => {
    return tasks.filter(t => {
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
      header: 'Specialist Assigned',
      render: (t) => (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-primary dark:text-white">
            {t.assignedStaffName || 'Lead Housekeeper'}
          </span>
        </div>
      ),
    },
    {
      key: 'cleaningType',
      header: 'Assigned Turnover Protocol',
      render: (t) => (
        <span className="text-xs text-charcoal dark:text-gray-300">
          {t.cleaningType || 'Full Turnover & Steam'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => (
        <StatusBadge
          status={t.priority === 'urgent' ? 'cancelled' : t.priority === 'high' ? 'pending' : 'completed'}
          label={t.priority ? t.priority.toUpperCase() : 'NORMAL'}
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <StatusBadge
          status={t.status === 'completed' || t.status === 'inspected' ? 'completed' : t.status === 'in_progress' ? 'pending' : 'cancelled'}
          label={t.status === 'in_progress' ? 'In Progress' : t.status === 'inspected' ? 'Audit Passed' : t.status === 'completed' ? 'Done' : 'Scheduled Today'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          {t.status === 'pending' && (
            <Button
              variant="primary"
              size="xs"
              icon={Play}
              onClick={() => {
                updateCleaningTaskStatus(t.id, 'in_progress');
                showToast('Shift Started', `Cleaning started on Suite ${t.roomNumber}.`, 'info');
              }}
            >
              Start
            </Button>
          )}
          {t.status === 'in_progress' && (
            <Button
              variant="outline"
              size="xs"
              icon={CheckCircle2}
              onClick={() => {
                updateCleaningTaskStatus(t.id, 'completed');
                showToast('Chamber Completed', `Suite ${t.roomNumber} ready for inspection.`, 'success');
              }}
            >
              Finish
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's Housekeeping Tasks"
        subtitle="Operational shift turnovers, sanitization assignments, and white-glove tasks for today."
        icon={CalendarDays}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Clock}
              onClick={() => navigate('/housekeeping/dashboard/pending')}
            >
              View Pending Backlog
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/housekeeping/schedule')}
            >
              Schedule Turnover
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Scheduled for Today"
          value={todayTasks.length}
          subtitle="Total planned suite turnarounds"
          icon={CalendarDays}
        />
        <StatCard
          title="Turnovers Cleared Today"
          value={todayTasks.filter(t => t.status === 'completed' || t.status === 'inspected').length}
          subtitle="Suites ready for check-in"
          icon={CheckCircle2}
        />
        <StatCard
          title="Active On-Floor Staff"
          value={new Set(todayTasks.map(t => t.assignedStaffName)).size}
          subtitle="Specialists deployed today"
          icon={User}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search today's duties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={todayTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No housekeeping tasks scheduled for today."
        />
      </div>
    </div>
  );
};

export default HousekeepingTodayTasksPage;

