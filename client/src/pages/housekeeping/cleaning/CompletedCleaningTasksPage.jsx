import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  CheckCircle2,
  Search,
  Download,
  BedDouble,
  ShieldCheck,
  User,
  Clock,
  Award,
  Eye,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const CompletedCleaningTasksPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [] } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  // Finished cleaning records (completed or inspected)
  const completedTasks = useMemo(() => {
    return tasks.filter(task => {
      const isFinished = task.status === 'completed' || task.status === 'inspected';
      if (!isFinished) return false;

      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        task.roomNumber?.toLowerCase().includes(q) ||
        task.roomType?.toLowerCase().includes(q) ||
        task.assignedStaffName?.toLowerCase().includes(q)
      );
    });
  }, [tasks, searchQuery]);

  const handleExportHistory = () => {
    const headers = ['Suite', 'Room Type', 'Specialist', 'Protocol', 'Status', 'Timestamp'];
    const rows = completedTasks.map(t => [
      `"Suite ${t.roomNumber}"`,
      `"${t.roomType || ''}"`,
      `"${t.assignedStaffName || ''}"`,
      `"${t.cleaningType || 'Standard'}"`,
      `"${t.status}"`,
      `"${t.completedTime || 'Today'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Completed_Cleaning_Log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Log Exported', 'Chamber sanitation archive downloaded.', 'success');
  };

  const columns = [
    {
      key: 'roomNumber',
      header: 'Chamber / Suite',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
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
      header: 'Turnover Specialist',
      render: (t) => (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-primary dark:text-white">
            {t.assignedStaffName || 'Valet Team'}
          </span>
        </div>
      ),
    },
    {
      key: 'cleaningType',
      header: 'Sanitation Protocol',
      render: (t) => (
        <span className="text-xs text-charcoal dark:text-gray-300">
          {t.cleaningType || 'Full Turnover & Steam'}
        </span>
      ),
    },
    {
      key: 'auditStatus',
      header: 'Quality Inspection',
      render: (t) => (
        <span className={`badge ${t.status === 'inspected' ? 'badge-gold' : 'badge-neutral'} flex items-center gap-1.5 px-3 py-1 font-mono text-[11px]`}>
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          {t.status === 'inspected' ? 'Audited & Cleared' : 'Pending Audit'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge status="completed" label="Turnover Finished" />,
    },
    {
      key: 'actions',
      header: 'Inspection',
      align: 'right',
      render: (t) => (
        <Button
          variant="outline"
          size="xs"
          icon={Award}
          onClick={() => navigate('/housekeeping/cleaning/inspection')}
        >
          View Audit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Cleaning Tasks"
        subtitle="Historical archive of sanitized suites, finished room turnovers, and hygiene logs."
        icon={CheckCircle2}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportHistory}
            >
              Export Archive
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Award}
              onClick={() => navigate('/housekeeping/cleaning/inspection')}
            >
              Room Inspections
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Completed Turnovers"
          value={completedTasks.length}
          subtitle="Suites prepped and sanitized"
          icon={CheckCircle2}
        />
        <StatCard
          title="Audit Clearance Rate"
          value="100%"
          subtitle="Meets 5-star white glove standards"
          icon={ShieldCheck}
        />
        <StatCard
          title="Hygiene Audit Verified"
          value={completedTasks.filter(t => t.status === 'inspected').length}
          subtitle="Inspected by Senior Officers"
          icon={Award}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search completed chambers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={completedTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No completed turnovers recorded yet today."
        />
      </div>
    </div>
  );
};

export default CompletedCleaningTasksPage;

