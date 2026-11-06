import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  UserCheck,
  User,
  Sparkles,
  Search,
  Filter,
  Clock,
  BedDouble,
  ShieldCheck,
  Plus,
  Play,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const AssignedRoomsPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [], rooms = [], updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState('all');

  const uniqueStaff = useMemo(() => {
    const list = new Set(tasks.map(t => t.assignedStaffName).filter(Boolean));
    return ['all', ...Array.from(list)];
  }, [tasks]);

  const assignedTasks = useMemo(() => {
    return tasks.filter(task => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        task.roomNumber?.toLowerCase().includes(q) ||
        task.roomType?.toLowerCase().includes(q) ||
        task.assignedStaffName?.toLowerCase().includes(q);

      const matchesStaff = staffFilter === 'all' || task.assignedStaffName === staffFilter;

      return matchesSearch && matchesStaff;
    });
  }, [tasks, searchQuery, staffFilter]);

  const staffWorkload = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      const name = t.assignedStaffName || 'Unassigned Valet';
      if (!map[name]) map[name] = { total: 0, pending: 0, completed: 0 };
      map[name].total += 1;
      if (t.status === 'completed' || t.status === 'inspected') {
        map[name].completed += 1;
      } else {
        map[name].pending += 1;
      }
    });
    return map;
  }, [tasks]);

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
      key: 'assignedStaffName',
      header: 'Assigned Specialist',
      render: (t) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center text-xs font-bold">
            {t.assignedStaffName ? t.assignedStaffName.split(' ').map(n => n[0]).join('') : 'UN'}
          </div>
          <div>
            <span className="text-xs font-medium text-primary dark:text-white block">
              {t.assignedStaffName || 'Unassigned'}
            </span>
            <span className="text-[10px] text-charcoal-muted dark:text-gray-400">
              Housekeeping Valet
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'cleaningType',
      header: 'Protocol Type',
      render: (t) => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium">
          {t.cleaningType || 'Standard Turnover'}
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
      key: 'estimatedMinutes',
      header: 'SLA Duration',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted dark:text-gray-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{t.estimatedMinutes || 45} mins</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Execution Status',
      render: (t) => (
        <StatusBadge
          status={t.status === 'completed' || t.status === 'inspected' ? 'completed' : t.status === 'in_progress' ? 'pending' : 'cancelled'}
          label={t.status === 'in_progress' ? 'In Progress' : t.status === 'inspected' ? 'Audit Verified' : t.status === 'completed' ? 'Cleaned' : 'Waiting'}
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
              variant="outline"
              size="xs"
              icon={Play}
              onClick={() => {
                updateCleaningTaskStatus(t.id, 'in_progress');
                showToast('Cleaning Started', `Specialist ${t.assignedStaffName} commenced Suite ${t.roomNumber}.`, 'info');
              }}
            >
              Start
            </Button>
          )}
          {t.status === 'in_progress' && (
            <Button
              variant="primary"
              size="xs"
              icon={CheckCircle2}
              onClick={() => {
                updateCleaningTaskStatus(t.id, 'completed');
                showToast('Turnover Finished', `Suite ${t.roomNumber} sanitized & prepped.`, 'success');
              }}
            >
              Mark Done
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Rooms & Staff Roster"
        subtitle="Live roster of chambers assigned to housekeeping specialists, valets, and butler teams."
        icon={UserCheck}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/housekeeping/cleaning/todo')}
            >
              Rooms to Clean
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/housekeeping/schedule')}
            >
              Assign New Suite
            </Button>
          </div>
        }
      />

      {/* Roster Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Chambers"
          value={assignedTasks.length}
          subtitle="Suites currently assigned"
          icon={BedDouble}
        />
        <StatCard
          title="Active Specialists"
          value={Object.keys(staffWorkload).length}
          subtitle="On duty across palace wings"
          icon={User}
        />
        <StatCard
          title="Ongoing Operations"
          value={assignedTasks.filter(t => t.status === 'in_progress').length}
          subtitle="Chambers being serviced"
          icon={Clock}
        />
        <StatCard
          title="Turnovers Cleared"
          value={assignedTasks.filter(t => t.status === 'completed' || t.status === 'inspected').length}
          subtitle="Sanitized and inspected"
          icon={ShieldCheck}
        />
      </div>

      {/* Staff Workload Cards */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-accent" />
          Specialist Workload Distribution
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(staffWorkload).map(([name, data]) => (
            <div
              key={name}
              onClick={() => setStaffFilter(staffFilter === name ? 'all' : name)}
              className={`p-4 rounded-xl cursor-pointer border transition-all text-xs ${staffFilter === name
                  ? 'border-accent bg-accent/10 shadow-gold'
                  : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/30'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-sm text-primary dark:text-white">
                  {name}
                </span>
                <span className="badge badge-gold font-mono text-[10px]">
                  {data.total} Suites
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-400 text-[11px]">
                <span>Active: <strong className="text-amber-400">{data.pending}</strong></span>
                <span>Done: <strong className="text-emerald-400">{data.completed}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Table */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by suite, room type, or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Assigned Staff</option>
              {uniqueStaff.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={assignedTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No assigned cleaning tasks match your filter criteria."
        />
      </div>
    </div>
  );
};

export default AssignedRoomsPage;

