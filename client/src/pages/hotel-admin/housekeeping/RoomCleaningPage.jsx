import React, { useState, useMemo } from 'react';
import { PageHeader, Button } from '../../../components/ui';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  User,
  BedDouble,
  CheckSquare,
  RotateCcw,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoomCleaningPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: initialTasks, updateCleaningTaskStatus, toggleCleaningChecklist, rooms } = useERP();
  const { showToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');

  // Timestamps tracking for start & completion times
  const [taskTimes, setTaskTimes] = useState({
    'tsk-201': { startTime: '13:30 Today', completedTime: null },
    'tsk-202': { startTime: null, completedTime: null },
    'tsk-203': { startTime: '10:30 Today', completedTime: '11:30 Today' },
    'tsk-204': { startTime: '08:45 Today', completedTime: '09:15 Today' },
  });

  const handleStartCleaning = (taskId, roomNumber) => {
    updateCleaningTaskStatus(taskId, 'in_progress');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    setTaskTimes(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        startTime: currentTime,
      }
    }));
    showToast(
      'Turnover Started',
      `Sanitization & turnover commenced for Suite ${roomNumber}.`,
      'info'
    );
  };

  const handleCompleteCleaning = (taskId, roomNumber) => {
    updateCleaningTaskStatus(taskId, 'completed');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    setTaskTimes(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        completedTime: currentTime,
      }
    }));
    showToast(
      'Turnover Completed',
      `Suite ${roomNumber} has been cleaned and is ready for executive inspection.`,
      'success'
    );
  };

  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        task.roomNumber?.toLowerCase().includes(q) ||
        task.roomType?.toLowerCase().includes(q) ||
        task.assignedStaffName?.toLowerCase().includes(q) ||
        task.cleaningType?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' ? (task.status === 'completed' || task.status === 'inspected') : task.status === statusFilter);

      const matchesType =
        roomTypeFilter === 'all' || task.roomType === roomTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [initialTasks, searchQuery, statusFilter, roomTypeFilter]);

  const uniqueRoomTypes = useMemo(() => {
    const types = new Set(initialTasks.map(t => t.roomType).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [initialTasks]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Room-Wise Chamber Cleaning"
        description="Live suite turnover tracking, assigned staff dispatch, checklist execution, and recorded operational timestamps."
        badge="Room Turnover Registry"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/housekeeping/schedule')}
            >
              Schedule New Cleaning
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search by Suite #, Room Type, or Specialist..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs">
            {['all', 'pending', 'in_progress', 'completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'gold-gradient-bg text-primary-900 shadow-sm'
                    : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Room Type Dropdown */}
          <div className="flex items-center gap-2 bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-accent shrink-0" />
            <select
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value)}
              className="bg-transparent text-primary dark:text-white text-xs font-medium focus:outline-none"
            >
              <option value="all" className="dark:bg-primary-900">All Suite Tiers</option>
              {uniqueRoomTypes.filter(t => t !== 'all').map(tier => (
                <option key={tier} value={tier} className="dark:bg-primary-900">{tier}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room Cleaning Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-16 text-center card-luxury-3d rounded-3xl p-8 space-y-3">
            <Sparkles className="w-10 h-10 text-accent/40 mx-auto" />
            <h4 className="font-serif font-bold text-lg text-primary dark:text-white">No Matching Turnover Records</h4>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">
              No chamber cleaning logs found with current search or status filter. Try resetting filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setRoomTypeFilter('all'); }}
              className="px-4 py-2 rounded-xl border border-accent text-accent text-xs font-semibold hover:bg-accent/10"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const completedCount = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
            const totalCount = task.checklist?.length || 1;
            const progressPct = Math.round((completedCount / totalCount) * 100);
            const times = taskTimes[task.id] || { startTime: null, completedTime: null };

            return (
              <div key={task.id} className="card-luxury-3d p-6 rounded-3xl flex flex-col justify-between space-y-4">
                {/* Header: Room Number and Badges */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-accent tracking-wide">
                        Suite {task.roomNumber}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-primary dark:text-white mt-0.5">
                        {task.roomType || 'Presidential Tier'}
                      </h4>
                      <span className="text-[11px] text-charcoal-muted font-medium block">
                        {task.cleaningType || 'Turnover Sanitation'}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge status={task.status} size="sm" />
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-accent/15 text-accent border border-accent/30'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Specialist & Estimated Duration */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2.5 my-3 border-y border-border/80 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-charcoal-muted block font-mono">Assigned Staff</span>
                        <span className="font-semibold text-primary dark:text-white truncate block">
                          {task.assignedStaffName || 'Marie Laurent'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-muted block font-mono">Est. Duration</span>
                        <span className="font-mono font-bold text-accent">
                          {task.estimatedMinutes || 60} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start & Completion Time Telemetry */}
                  <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.03] border border-border/60 dark:border-white/5 space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal-muted">Start Time:</span>
                      <span className="font-semibold text-primary dark:text-gray-200">
                        {times.startTime || (task.status !== 'pending' ? '12:15 Today' : 'Not Started')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal-muted">Completion Time:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {times.completedTime || (task.status === 'completed' || task.status === 'inspected' ? '13:05 Today' : 'In Progress / Pending')}
                      </span>
                    </div>
                  </div>

                  {/* Checklist Progress */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-charcoal-muted">Sanitization Checklist</span>
                      <span className="text-accent font-bold">
                        {completedCount}/{totalCount} ({progressPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-border/60 dark:bg-black/50 rounded-full overflow-hidden border border-border/40 dark:border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Checklist Items */}
                  <div className="space-y-1.5 pt-3 mt-3 border-t border-border/80 dark:border-white/10 max-h-36 overflow-y-auto">
                    {task.checklist?.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2 text-xs cursor-pointer hover:text-accent transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCleaningChecklist(task.id, idx)}
                          className="mt-0.5 rounded text-accent focus:ring-accent border-gray-300 dark:border-gray-600 dark:bg-primary-900 cursor-pointer"
                        />
                        <span
                          className={
                            item.completed
                              ? 'line-through text-charcoal-muted/60 dark:text-gray-500 text-[11px]'
                              : 'text-charcoal dark:text-gray-300 text-[11px]'
                          }
                        >
                          {item.item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-3 border-t border-border/80 dark:border-white/10 flex items-center gap-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleStartCleaning(task.id, task.roomNumber)}
                      className="flex-1 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Cleaning</span>
                    </button>
                  )}

                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteCleaning(task.id, task.roomNumber)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {(task.status === 'completed' || task.status === 'inspected') && (
                    <div className="flex-1 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Turnover Certified</span>
                    </div>
                  )}

                  {task.status !== 'pending' && (
                    <button
                      onClick={() => {
                        updateCleaningTaskStatus(task.id, 'pending');
                        showToast('Status Reset', `Suite ${task.roomNumber} set back to Pending.`, 'info');
                      }}
                      className="p-2 rounded-xl border border-border dark:border-white/10 hover:border-accent text-charcoal-muted hover:text-accent transition-colors"
                      title="Reset Turnover to Pending"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoomCleaningPage;
