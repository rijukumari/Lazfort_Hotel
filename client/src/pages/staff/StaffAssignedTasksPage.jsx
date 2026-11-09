import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge, Modal, ViewToggle } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import {
  Briefcase,
  Play,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  User,
  BedDouble,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffAssignedTasksPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_staff_assigned_tasks') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_staff_assigned_tasks', mode);
    } catch {}
  };

  const [tasks, setTasks] = useState([
    {
      id: 'TSK-2026-881',
      title: 'Chilled Vintage Champagne & Caviar Service',
      suite: 'Suite 801 (Presidential Penthouse)',
      roomNumber: '801',
      guestName: 'Lord Alistair Sterling',
      category: 'In-Suite VIP Dining',
      priority: 'Urgent VIP',
      assignedTime: '10:15 AM Today',
      dueTime: '11:00 AM Today',
      status: 'In Progress',
      instructions: 'Deliver 2 crystal Baccarat flutes, Dom Pérignon 2012, and Beluga caviar on shaved ice with silver mother-of-pearl spoons.',
    },
    {
      id: 'TSK-2026-882',
      title: 'Private Chauffeur & Helipad Transit Coordination',
      suite: 'Suite 604 (Grand Mediterranean)',
      roomNumber: '604',
      guestName: 'Princess Sophia of Monaco',
      category: 'Transportation & Transit',
      priority: 'High Priority',
      assignedTime: '09:30 AM Today',
      dueTime: '12:30 PM Today',
      status: 'Pending',
      instructions: 'Rolls Royce Phantom arrival at Port Hercule helipad. Escort royal luggage securely to suite private elevator.',
    },
    {
      id: 'TSK-2026-883',
      title: 'Monaco Opera Gala Ticket Verification & Courier Dispatch',
      suite: 'Suite 502 (Executive Marina Suite)',
      roomNumber: '502',
      guestName: 'Dr. Vivienne Moreau',
      category: 'Concierge Booking',
      priority: 'Normal',
      assignedTime: '08:45 AM Today',
      dueTime: '02:00 PM Today',
      status: 'Pending',
      instructions: 'Collect verified gold-tier Royal Box passes from concierge safe, place in wax-sealed envelope, and hand-deliver.',
    },
    {
      id: 'TSK-2026-884',
      title: 'Fresh White Orchid Floral Arrangement Placement',
      suite: 'Suite 703 (Diplomatic Suite)',
      roomNumber: '703',
      guestName: 'Hon. Arthur Pendelton',
      category: 'Floral & Amenities',
      priority: 'Normal',
      assignedTime: '08:00 AM Today',
      dueTime: '10:00 AM Today',
      status: 'Completed',
      instructions: 'Position fresh Phalaenopsis orchids on marble dining salon table and refresh room botanical scent.',
    },
  ]);

  const handleStartTask = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'In Progress' } : t))
    );
    showToast('Task In Progress', `Work order ${taskId} initiated.`, 'info');
  };

  const handleCompleteTask = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'Completed' } : t))
    );
    showToast('Mission Accomplished', `Task ${taskId} completed and logged.`, 'success');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.guestName.toLowerCase().includes(q) ||
        t.suite.toLowerCase().includes(q);

      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const columns = [
    {
      key: 'id',
      header: 'Task ID',
      render: (t) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{t.id}</span>
          <span className="block text-[10px] text-charcoal-muted dark:text-gray-400">{t.category}</span>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Duty / Order Title',
      render: (t) => (
        <div className="max-w-xs">
          <p className="font-serif font-bold text-sm text-primary dark:text-white truncate">
            {t.title}
          </p>
          <span className="text-xs text-charcoal-muted dark:text-gray-400 block truncate">
            {t.suite} • {t.guestName}
          </span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => (
        <StatusBadge
          status={t.priority.includes('Urgent') ? 'cancelled' : t.priority.includes('High') ? 'pending' : 'completed'}
          label={t.priority}
        />
      ),
    },
    {
      key: 'dueTime',
      header: 'Deadline SLA',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-xs font-mono text-charcoal dark:text-gray-300">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{t.dueTime}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <StatusBadge
          status={t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'pending' : 'cancelled'}
          label={t.status}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => navigate('/staff/work/details')}
          >
            Details
          </Button>
          {t.status === 'Pending' && (
            <Button
              variant="outline"
              size="xs"
              icon={Play}
              onClick={() => handleStartTask(t.id)}
            >
              Start
            </Button>
          )}
          {t.status === 'In Progress' && (
            <Button
              variant="primary"
              size="xs"
              icon={CheckCircle2}
              onClick={() => handleCompleteTask(t.id)}
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
        title="Assigned Concierge & Service Tasks"
        subtitle="Active work orders, VIP guest missions, and assigned operational duties for today's shift."
        icon={Briefcase}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Clock}
              onClick={() => navigate('/staff/work/history')}
            >
              Task History
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Eye}
              onClick={() => navigate('/staff/work/details')}
            >
              Task Briefing Details
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Tasks"
          value={tasks.length}
          subtitle="Orders for today's roster"
          icon={Briefcase}
        />
        <StatCard
          title="Urgent VIP Missions"
          value={tasks.filter(t => t.priority.includes('Urgent')).length}
          subtitle="Priority guest dispatch"
          icon={AlertTriangle}
        />
        <StatCard
          title="Currently in Progress"
          value={tasks.filter(t => t.status === 'In Progress').length}
          subtitle="Being fulfilled right now"
          icon={Clock}
        />
        <StatCard
          title="Completed Today"
          value={tasks.filter(t => t.status === 'Completed').length}
          subtitle="Successfully fulfilled"
          icon={CheckCircle2}
        />
      </div>

      {/* Table & Filters */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by task ref, title, suite, or guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent VIP">Urgent VIP</option>
              <option value="High Priority">High Priority</option>
              <option value="Normal">Normal</option>
            </select>

            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
          </div>
        </div>

        {viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={filteredTasks}
            keyField="id"
            pagination={true}
            pageSize={6}
            emptyMessage="No assigned tasks match your search filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-3 flex flex-col justify-between hover:border-accent/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">{t.id}</span>
                    <StatusBadge
                      status={
                        t.status === 'Completed'
                          ? 'active'
                          : t.status === 'In Progress'
                          ? 'pending'
                          : 'inactive'
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-primary dark:text-white">{t.title}</h4>
                    <p className="text-xs text-charcoal-muted flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-accent" />
                      <span>{t.suite}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted">Guest:</span>
                      <span className="font-semibold text-primary dark:text-white">{t.guestName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted">Priority:</span>
                      <span className={`font-semibold ${t.priority.includes('Urgent') ? 'text-rose-500' : 'text-accent'}`}>{t.priority}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal-muted">Due By:</span>
                      <span className="font-mono text-[11px] text-charcoal-muted">{t.dueTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-end gap-2">
                  {t.status === 'Pending' && (
                    <Button
                      variant="gold"
                      size="xs"
                      icon={Play}
                      onClick={() => handleStartTask(t.id)}
                    >
                      Start Task
                    </Button>
                  )}
                  {t.status === 'In Progress' && (
                    <Button
                      variant="outline"
                      size="xs"
                      icon={CheckCircle2}
                      onClick={() => handleCompleteTask(t.id)}
                    >
                      Finish Task
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAssignedTasksPage;

