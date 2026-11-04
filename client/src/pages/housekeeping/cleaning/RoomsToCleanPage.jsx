import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  Play,
  BedDouble,
  AlertTriangle,
  User,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RoomsToCleanPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [], updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Rooms waiting for cleaning (pending status)
  const todoTasks = useMemo(() => {
    return tasks.filter(task => {
      const isTodo = task.status === 'pending' || !task.status;
      if (!isTodo) return false;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        task.roomNumber?.toLowerCase().includes(q) ||
        task.roomType?.toLowerCase().includes(q) ||
        task.assignedStaffName?.toLowerCase().includes(q);

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const urgentCount = useMemo(() => {
    return todoTasks.filter(t => t.priority === 'urgent').length;
  }, [todoTasks]);

  const handleStartTask = (task) => {
    updateCleaningTaskStatus(task.id, 'in_progress');
    showToast('Turnover In Progress', `Started sanitizing Suite ${task.roomNumber}.`, 'info');
  };

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
              {t.roomType || 'Deluxe Chamber'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Urgency Level',
      render: (t) => (
        <StatusBadge
          status={t.priority === 'urgent' ? 'cancelled' : t.priority === 'high' ? 'pending' : 'completed'}
          label={t.priority ? t.priority.toUpperCase() : 'STANDARD'}
        />
      ),
    },
    {
      key: 'cleaningType',
      header: 'Service Required',
      render: (t) => (
        <span className="text-xs font-medium text-primary dark:text-white">
          {t.cleaningType || 'Standard Turnover'}
        </span>
      ),
    },
    {
      key: 'assignedStaffName',
      header: 'Designated Valet',
      render: (t) => (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-charcoal dark:text-gray-300">
            {t.assignedStaffName || 'Available for Grab'}
          </span>
        </div>
      ),
    },
    {
      key: 'estimatedMinutes',
      header: 'Estimated Time',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted dark:text-gray-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{t.estimatedMinutes || 45} mins</span>
        </div>
      ),
    },
    {
      key: 'notes',
      header: 'Guest / House Notes',
      render: (t) => (
        <span className="text-xs italic text-charcoal-muted dark:text-gray-400 max-w-xs truncate block">
          {t.notes || 'Standard turnover protocol.'}
        </span>
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
          onClick={() => handleStartTask(t)}
        >
          Begin Cleaning
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooms to Clean (Backlog)"
        subtitle="Unserviced suites awaiting turnover, hygiene sterilization, and luxury amenity setup."
        icon={Sparkles}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Clock}
              onClick={() => navigate('/housekeeping/cleaning/in-progress')}
            >
              In Progress Work
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/housekeeping/schedule')}
            >
              Schedule Chamber
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Chambers to Clean"
          value={todoTasks.length}
          subtitle="Waiting in turnover queue"
          icon={BedDouble}
        />
        <StatCard
          title="Urgent VIP Priority"
          value={urgentCount}
          subtitle="Immediate guest arrival expected"
          icon={AlertTriangle}
        />
        <StatCard
          title="Estimated Workload"
          value={`${todoTasks.reduce((s, t) => s + (t.estimatedMinutes || 45), 0)} mins`}
          subtitle="Cumulative cleaning time"
          icon={Clock}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by suite, room type, or valet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent VIP Only</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={todoTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No pending chambers to clean! All suites are currently serviced or active."
        />
      </div>
    </div>
  );
};

export default RoomsToCleanPage;

