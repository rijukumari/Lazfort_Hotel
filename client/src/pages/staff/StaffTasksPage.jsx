import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  BedDouble,
  Plus,
  Play,
  Check,
  Search,
  Filter,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffTasksPage = () => {
  const { showToast } = useToast();

  // Mode: 'list' | 'create'
  const [viewMode, setViewMode] = useState('list');

  const [tasks, setTasks] = useState([
    {
      id: 'TSK-2026-881',
      title: 'Chilled Vintage Champagne & Caviar Service',
      suite: 'Suite 801 (Presidential Penthouse)',
      guestName: 'Lord Alistair Sterling',
      category: 'In-Suite VIP Dining',
      priority: 'Urgent VIP',
      assignedTime: '10:15 AM',
      dueTime: '11:00 AM',
      status: 'In Progress',
      notes: 'Prepare 2 crystal flutes, chilled Dom Pérignon 2012, and Beluga caviar on shaved ice.',
    },
    {
      id: 'TSK-2026-882',
      title: 'Private Chauffeur & Helipad Transit Coordination',
      suite: 'Suite 604 (Grand Mediterranean)',
      guestName: 'Princess Sophia of Monaco',
      category: 'Transportation & Transit',
      priority: 'High Priority',
      assignedTime: '09:30 AM',
      dueTime: '12:30 PM',
      status: 'Pending',
      notes: 'Rolls Royce Phantom arrival at Port Hercule helipad. Escort guest luggage securely.',
    },
    {
      id: 'TSK-2026-883',
      title: 'Michelin Gala Dinner Table Reservation',
      suite: 'Suite 402 (Riviera Suite)',
      guestName: 'Dr. Evelyn Vance',
      category: 'Concierge Booking',
      priority: 'Standard',
      assignedTime: '08:45 AM',
      dueTime: '13:00 PM',
      status: 'Completed',
      notes: 'Reserved Table #12 at Le Louis XV by Alain Ducasse. Dietary restrictions notified.',
    },
    {
      id: 'TSK-2026-884',
      title: 'Morning Duty Handover & Safety Briefing Log',
      suite: 'Main Lobby Concierge Desk',
      guestName: 'Internal Duty',
      category: 'Operations',
      priority: 'Standard',
      assignedTime: '07:00 AM',
      dueTime: '07:30 AM',
      status: 'Completed',
      notes: 'Shift keys, master fobs, and VIP guest schedules verified with outgoing night team.',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    suite: 'Suite 801 (Presidential Penthouse)',
    guestName: '',
    category: 'Concierge Request',
    priority: 'High Priority',
    notes: '',
  });

  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showToast(
      'Work Order Updated',
      `Task status changed to ${newStatus}.`,
      newStatus === 'Completed' ? 'success' : 'info'
    );
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: `TSK-2026-${Math.floor(800 + Math.random() * 200)}`,
      title: newTaskForm.title,
      suite: newTaskForm.suite,
      guestName: newTaskForm.guestName || 'VIP Guest',
      category: newTaskForm.category,
      priority: newTaskForm.priority,
      assignedTime: 'Just now',
      dueTime: 'In 1 hour',
      status: 'Pending',
      notes: newTaskForm.notes,
    };

    setTasks([newTask, ...tasks]);
    setViewMode('list');
    setNewTaskForm({
      title: '',
      suite: 'Suite 801 (Presidential Penthouse)',
      guestName: '',
      category: 'Concierge Request',
      priority: 'High Priority',
      notes: '',
    });
    showToast(
      'Task Dispatched',
      `New work order ${newTask.id} created and logged.`,
      'success'
    );
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'ALL') return true;
    return t.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent VIP':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30">
            ★ Urgent VIP
          </span>
        );
      case 'High Priority':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
            High Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-500 border border-blue-500/30">
            Standard
          </span>
        );
    }
  };

  // FULL PAGE VIEW: CREATE WORK ORDER
  if (viewMode === 'create') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title="Dispatch New Concierge Work Order"
          description="Log a direct guest assistance order, suite delivery, or operational task into the live terminal queue."
          badge="Order Dispatch Terminal"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Duties Queue
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Work Order Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Target turnaround expectation is under 20 minutes for luxury suites.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Duty / Order Title
              </label>
              <input
                type="text"
                placeholder="e.g. VIP Luggage Valet to Helipad"
                value={newTaskForm.title}
                onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Target Chamber / Suite
                </label>
                <input
                  type="text"
                  value={newTaskForm.suite}
                  onChange={e => setNewTaskForm({ ...newTaskForm, suite: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Registered Guest Name
                </label>
                <input
                  type="text"
                  placeholder="Guest surname..."
                  value={newTaskForm.guestName}
                  onChange={e => setNewTaskForm({ ...newTaskForm, guestName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Service Category
                </label>
                <select
                  value={newTaskForm.category}
                  onChange={e => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="In-Suite VIP Dining">In-Suite VIP Dining</option>
                  <option value="Transportation & Transit">Transportation & Transit</option>
                  <option value="Concierge Request">Concierge Request</option>
                  <option value="Luggage & Valet">Luggage & Valet</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Priority Rating
                </label>
                <select
                  value={newTaskForm.priority}
                  onChange={e => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Urgent VIP">Urgent VIP</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Instructions & Special Directives
              </label>
              <textarea
                value={newTaskForm.notes}
                onChange={e => setNewTaskForm({ ...newTaskForm, notes: e.target.value })}
                rows={5}
                placeholder="Enter exact guest preferences, items to procure, delivery timeline, or safety notes..."
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80 dark:border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Work order will immediately alert duty staff
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Work Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: TASKS QUEUE
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Assigned Duties & Work Order Terminal"
        description="Active guest assistance dispatches, room delivery requests, concierge errands, and completion milestones."
        badge="Active Dispatch Feed"
        actions={
          <button
            type="button"
            onClick={() => setViewMode('create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Plus className="w-4 h-4" />
            Dispatch New Task
          </button>
        }
      />

      {/* KPI Cards */}
      <StatsGrid columns={4}>
        <StatCard
          title="Assigned Work Orders"
          value={tasks.length}
          change="Across Current Shift"
          isPositive={true}
          iconName="Briefcase"
          subtitle="Morning Concierge Queue"
        />
        <StatCard
          title="Pending Execution"
          value={tasks.filter(t => t.status === 'Pending').length}
          change="Awaiting Staff Action"
          isPositive={false}
          iconName="Clock"
          subtitle="Target < 20 mins"
        />
        <StatCard
          title="In Active Progress"
          value={tasks.filter(t => t.status === 'In Progress').length}
          change="Live Delivery En Route"
          isPositive={true}
          iconName="Sparkles"
          subtitle="Staff En Route"
        />
        <StatCard
          title="Completed Today"
          value={tasks.filter(t => t.status === 'Completed').length}
          change="100% Verified Quality"
          isPositive={true}
          iconName="CheckCircle"
          subtitle="Guest Sign-Off Received"
        />
      </StatsGrid>

      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl glass-card border border-primary-500/15 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'Pending', 'In Progress', 'Completed'].map(filter => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === filter
                  ? 'gold-gradient-bg text-primary-900 shadow-gold'
                  : 'text-charcoal-muted hover:text-primary dark:hover:text-white hover:bg-white/5'
                }`}
            >
              {filter === 'ALL' ? 'All Duties' : filter}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-accent">
          {filteredTasks.length} Work Orders Displayed
        </span>
      </div>

      {/* Tasks Queue Cards */}
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="p-5 sm:p-6 rounded-2xl card-luxury-3d flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-accent">
                  {task.id}
                </span>
                <span className="text-charcoal-muted text-xs">•</span>
                <span className="text-xs font-semibold text-primary dark:text-gray-200">
                  {task.suite}
                </span>
                <span className="text-charcoal-muted text-xs">•</span>
                <span className="text-xs text-charcoal-muted">
                  Guest: <strong className="text-primary dark:text-white">{task.guestName}</strong>
                </span>
                {getPriorityBadge(task.priority)}
              </div>

              <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                {task.title}
              </h4>

              <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed max-w-3xl">
                {task.notes}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-charcoal-muted font-mono pt-1">
                <span>Assigned: {task.assignedTime}</span>
                <span>•</span>
                <span className="text-accent font-semibold">Target Completion: {task.dueTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              {task.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <Play className="w-3.5 h-3.5" />
                  Begin Duty
                </button>
              )}

              {task.status === 'In Progress' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(task.id, 'Completed')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark Complete
                </button>
              )}

              {task.status === 'Completed' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-500 font-bold text-xs border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Finished & Logged
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffTasksPage;
