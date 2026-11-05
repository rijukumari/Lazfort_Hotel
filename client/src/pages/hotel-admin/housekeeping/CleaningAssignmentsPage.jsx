import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Modal, FormField, Input, Select } from '../../../components/ui';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  UserCheck,
  User,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  Briefcase,
  Layers,
  Edit2
} from 'lucide-react';

const CLEANING_STAFF = [
  { id: 'stf-001', name: 'Margaux Dubois', role: 'Head Butler & Lead Sanitizer', floor: 'Floors 10-18', avatar: 'MD' },
  { id: 'stf-002', name: 'Marie Laurent', role: 'Senior Chamber Valet', floor: 'Penthouse Level', avatar: 'ML' },
  { id: 'stf-003', name: 'Elena Rostova', role: 'Hygiene Specialist', floor: 'Floors 4-9', avatar: 'ER' },
  { id: 'stf-004', name: 'Jean-Luc Picard', role: 'White-Glove Inspector', floor: 'All Resort Wings', avatar: 'JP' },
  { id: 'stf-005', name: 'Sophie Moreau', role: 'Turnover Specialist', floor: 'Floors 1-3', avatar: 'SM' },
];

export const CleaningAssignmentsPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks, rooms, addCleaningTask, updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [selectedStaffFilter, setSelectedStaffFilter] = useState('all');
  const [assignmentTab, setAssignmentTab] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for new assignment
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    roomId: rooms[0]?.id || '',
    staffName: CLEANING_STAFF[0].name,
    priority: 'high',
    cleaningType: 'Full Turnover',
    estimatedMinutes: 60,
    date: new Date().toISOString().split('T')[0],
    notes: 'Prioritize terrace glass polish and fresh orchid placement.',
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const targetRoom = rooms.find(r => r.id === assignForm.roomId) || rooms[0];

    addCleaningTask({
      roomId: targetRoom?.id || 'rm-custom',
      roomNumber: targetRoom?.roomNumber || '101',
      roomType: targetRoom?.type || 'Presidential Tier',
      cleaningType: assignForm.cleaningType,
      priority: assignForm.priority,
      status: 'pending',
      assignedStaffName: assignForm.staffName,
      estimatedMinutes: Number(assignForm.estimatedMinutes) || 60,
      notes: assignForm.notes,
      assignedDate: assignForm.date,
      checklist: [
        { item: 'Replace 1000-thread Egyptian linen & feather duvets', completed: false },
        { item: 'Bathroom marble steam sanitization & Bulgari replenishment', completed: false },
        { item: 'Minibar crystal glasses & sommelier reserve restock', completed: false },
        { item: 'Final supervisor white-glove inspection check', completed: false }
      ],
    });

    showToast(
      'Assignment Dispatched',
      `Assigned Suite ${targetRoom?.roomNumber} turnover to ${assignForm.staffName}.`,
      'success'
    );
    setIsAssignModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        task.roomNumber?.toLowerCase().includes(q) ||
        task.assignedStaffName?.toLowerCase().includes(q) ||
        task.cleaningType?.toLowerCase().includes(q);

      const matchesStaff =
        selectedStaffFilter === 'all' || task.assignedStaffName === selectedStaffFilter;

      const isCompleted = task.status === 'completed' || task.status === 'inspected';
      const matchesTab =
        assignmentTab === 'all'
          ? true
          : assignmentTab === 'completed'
          ? isCompleted
          : !isCompleted;

      return matchesSearch && matchesStaff && matchesTab;
    });
  }, [tasks, searchQuery, selectedStaffFilter, assignmentTab]);

  // Compute staff assignment counts
  const staffWorkload = useMemo(() => {
    return CLEANING_STAFF.map(member => {
      const memberTasks = tasks.filter(t => t.assignedStaffName === member.name);
      const pendingCount = memberTasks.filter(t => t.status !== 'completed' && t.status !== 'inspected').length;
      const completedCount = memberTasks.filter(t => t.status === 'completed' || t.status === 'inspected').length;
      return {
        ...member,
        total: memberTasks.length,
        pending: pendingCount,
        completed: completedCount,
      };
    });
  }, [tasks]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Housekeeping Staff & Chamber Assignments"
        description="Roster distribution, chamber turnover scheduling, and duty assignments for Lazfort white-glove attendants."
        badge="Duty Dispatch"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/hotel-admin/housekeeping/assignments/create')}
          >
            Assign Chamber Turnover
          </Button>
        }
      />

      {/* Staff Roster Workload Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {staffWorkload.map(staffMember => (
          <div
            key={staffMember.id}
            onClick={() => setSelectedStaffFilter(selectedStaffFilter === staffMember.name ? 'all' : staffMember.name)}
            className={`card-luxury-3d p-4 rounded-2xl cursor-pointer transition-all ${
              selectedStaffFilter === staffMember.name
                ? 'border-accent shadow-gold scale-[1.02]'
                : 'hover:border-accent/40'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs flex items-center justify-center font-mono">
                {staffMember.avatar}
              </div>
              <div className="truncate">
                <span className="font-semibold text-xs text-primary dark:text-white truncate block">
                  {staffMember.name}
                </span>
                <span className="text-[10px] text-charcoal-muted truncate block">
                  {staffMember.floor}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/70 dark:border-white/10 flex justify-between text-[11px] font-mono">
              <span className="text-charcoal-muted">Active: <strong className="text-amber-500">{staffMember.pending}</strong></span>
              <span className="text-charcoal-muted">Done: <strong className="text-emerald-500">{staffMember.completed}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card-luxury-3d p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search assignments by Suite #, Staff, or Cleaning Type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Tab filter: All / Pending / Completed */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs">
            {[
              { id: 'all', label: `All (${tasks.length})` },
              { id: 'pending', label: `Pending (${tasks.filter(t => t.status !== 'completed' && t.status !== 'inspected').length})` },
              { id: 'completed', label: `Completed (${tasks.filter(t => t.status === 'completed' || t.status === 'inspected').length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAssignmentTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  assignmentTab === tab.id
                    ? 'gold-gradient-bg text-primary-900 shadow-sm'
                    : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selectedStaffFilter !== 'all' && (
            <button
              onClick={() => setSelectedStaffFilter('all')}
              className="px-3 py-1.5 rounded-xl border border-accent text-accent text-xs font-semibold hover:bg-accent/10"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Assignments Table */}
      <div className="card-luxury-3d p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            <span>Assigned Chamber Turnovers</span>
          </h3>
          <span className="text-xs font-mono text-charcoal-muted">
            Showing {filteredTasks.length} of {tasks.length} assignments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-[11px] font-mono uppercase text-charcoal-muted">
                <th className="pb-3 px-3">Suite Ref</th>
                <th className="pb-3 px-3">Assigned Staff</th>
                <th className="pb-3 px-3">Service Type</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Assignment Date</th>
                <th className="pb-3 px-3">Est. Time</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    No cleaning assignments match your query.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-accent block">Suite {task.roomNumber}</span>
                      <span className="text-[11px] text-charcoal-muted">{task.roomType || 'Presidential Tier'}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent font-bold text-[10px]">
                          {task.assignedStaffName?.split(' ').map(n => n[0]).join('') || 'ST'}
                        </div>
                        <span className="font-semibold text-primary dark:text-white">{task.assignedStaffName || 'Marie Laurent'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-charcoal dark:text-gray-300">
                      {task.cleaningType || 'Turnover Sanitation'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-accent/15 text-accent border border-accent/30'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-charcoal-muted">
                      {task.assignedDate || 'Today, 2026-10-30'}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-primary dark:text-white">
                      {task.estimatedMinutes} mins
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={task.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {task.status !== 'completed' && task.status !== 'inspected' ? (
                        <button
                          onClick={() => {
                            updateCleaningTaskStatus(task.id, 'completed');
                            showToast('Turnover Cleared', `Marked Suite ${task.roomNumber} turnover complete for ${task.assignedStaffName}.`, 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg gold-gradient-bg text-primary-900 text-[11px] font-bold uppercase tracking-wider"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Finished
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Chamber Modal */}
      {/* Modal removed in favor of dedicated standalone page /hotel-admin/housekeeping/assignments/create */}
    </div>
  );
};

export default CleaningAssignmentsPage;
