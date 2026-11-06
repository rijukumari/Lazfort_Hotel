import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Clock,
  CheckCircle2,
  Search,
  BedDouble,
  User,
  ShieldCheck,
  CheckSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const InProgressCleaningPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [], updateCleaningTaskStatus, toggleCleaningChecklist } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  // Ongoing cleaning tasks
  const inProgressTasks = useMemo(() => {
    return tasks.filter(task => {
      if (task.status !== 'in_progress') return false;

      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        task.roomNumber?.toLowerCase().includes(q) ||
        task.roomType?.toLowerCase().includes(q) ||
        task.assignedStaffName?.toLowerCase().includes(q)
      );
    });
  }, [tasks, searchQuery]);

  const handleFinishCleaning = (task) => {
    updateCleaningTaskStatus(task.id, 'completed');
    showToast(
      'Turnover Completed',
      `Suite ${task.roomNumber} sanitized & queued for supervisor inspection.`,
      'success'
    );
  };

  const columns = [
    {
      key: 'roomNumber',
      header: 'Chamber / Suite',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
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
      key: 'assignedStaffName',
      header: 'Active Specialist',
      render: (t) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center text-xs font-bold">
            {t.assignedStaffName ? t.assignedStaffName.split(' ').map(n => n[0]).join('') : 'MD'}
          </div>
          <span className="text-xs font-medium text-primary dark:text-white">
            {t.assignedStaffName || 'Lead Sanitizer'}
          </span>
        </div>
      ),
    },
    {
      key: 'checklistProgress',
      header: 'Sanitation Checklist Progress',
      render: (t) => {
        const total = t.checklist?.length || 4;
        const done = t.checklist?.filter(c => c.completed).length || 2;
        const pct = Math.round((done / total) * 100);

        return (
          <div className="space-y-1.5 w-48">
            <div className="flex justify-between text-[11px]">
              <span className="text-charcoal-muted dark:text-gray-400">{done} of {total} steps</span>
              <span className="font-mono font-bold text-accent">{pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-charcoal-bg dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-accent rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="badge badge-gold flex items-center gap-1.5 px-3 py-1 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Active Service
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="xs"
            icon={CheckSquare}
            onClick={() => navigate('/housekeeping/cleaning/checklist')}
          >
            Checklist
          </Button>
          <Button
            variant="primary"
            size="xs"
            icon={CheckCircle2}
            onClick={() => handleFinishCleaning(t)}
          >
            Mark Complete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="In-Progress Room Cleaning"
        subtitle="Currently active chamber sanitization, turnover operations, and live white-glove checklist progress."
        icon={Clock}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={CheckSquare}
              onClick={() => navigate('/housekeeping/cleaning/checklist')}
            >
              Live Checklist View
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={CheckCircle2}
              onClick={() => navigate('/housekeeping/cleaning/completed')}
            >
              Completed Records
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Cleaning Turnovers"
          value={inProgressTasks.length}
          subtitle="Suites currently being sanitized"
          icon={Clock}
        />
        <StatCard
          title="Specialists on Chamber Floor"
          value={new Set(inProgressTasks.map(t => t.assignedStaffName)).size}
          subtitle="Executing hygiene protocols"
          icon={User}
        />
        <StatCard
          title="Avg Turnover Velocity"
          value="38 mins"
          subtitle="Within 45-min luxury SLA"
          icon={Sparkles}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search ongoing room tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={inProgressTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No cleaning tasks currently in progress. Staff are awaiting new chamber assignments."
        />
      </div>
    </div>
  );
};

export default InProgressCleaningPage;

