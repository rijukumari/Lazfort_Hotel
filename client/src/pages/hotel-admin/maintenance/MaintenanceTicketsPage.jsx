import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  BedDouble,
  ShieldAlert,
  Flame,
  ArrowUpDown,
  ArrowLeft,
  Save,
  Tag,
  Building,
  User
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  MaintenanceNavTabs,
  MaintenanceStatusBadge,
  PriorityBadge,
  DeleteConfirmationDialog
} from '../../../components/maintenance';

const CATEGORIES = [
  'All Categories',
  'HVAC & Climate Control',
  'Plumbing & Sanitization',
  'Electrical & Power Distribution',
  'Vertical Elevators & Escalators',
  'Smart In-Suite Automation & A/V',
  'Carpentry, Glazing & Finishes',
  'Michelin Kitchen Equipment',
  'Pool, Spa & Thermal Water'
];

const ISSUE_CATEGORIES = [
  'HVAC & Climate Control',
  'Plumbing & Sanitization',
  'Electrical & Power Distribution',
  'Luxury Woodwork & Furnishings',
  'Vertical Elevators & Escalators',
  'Smart In-Suite Automation & A/V',
  'Michelin Kitchen Equipment',
  'Pool, Spa & Thermal Water',
  'Marble & Architectural Stone',
];

const TECHNICIANS = [
  'Marco Bellini (Chief Engineer)',
  'Giovanni Rossi (Senior HVAC Specialist)',
  'Laurent Moreau (Master Electrician)',
  'Alain Renaud (Lead Plumber)',
  'David Chen (Smart Systems & Audio/Visual)',
];

export const MaintenanceTicketsPage = () => {
  const {
    maintenanceTickets = [],
    createMaintenanceTicket,
    updateMaintenanceTicket,
    assignTechnicianToTicket,
    deleteMaintenanceTicket,
    resolveMaintenanceTicket,
    rooms = []
  } = useERP();
  const { showToast } = useToast();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');

  // Dedicated Page State: 'list' | 'create' | 'edit' | 'assign'
  const [pageView, setPageView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    category: ISSUE_CATEGORIES[0],
    roomId: '',
    location: '',
    priority: 'medium',
    assignedTechnician: TECHNICIANS[0],
    expectedCompletionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    description: '',
    blocksRoom: false,
    estimatedCost: 150,
  });
  const [createErrors, setCreateErrors] = useState({});

  // Update Form State
  const [updateForm, setUpdateForm] = useState({
    title: '',
    status: 'open',
    priority: 'medium',
    assignedStaffName: '',
    expectedCompletion: '',
    totalCost: 0,
    newNote: '',
  });

  // Assign Technician State
  const [assignTech, setAssignTech] = useState(TECHNICIANS[0]);

  const startCreate = () => {
    setCreateForm({
      title: '',
      category: ISSUE_CATEGORIES[0],
      roomId: rooms[0]?.id || '',
      location: rooms[0]?.number ? `Suite ${rooms[0].number}` : 'Chamber 501',
      priority: 'medium',
      assignedTechnician: TECHNICIANS[0],
      expectedCompletionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      description: '',
      blocksRoom: false,
      estimatedCost: 150,
    });
    setCreateErrors({});
    setPageView('create');
  };

  const startEdit = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateForm({
      title: ticket.title || ticket.issue || '',
      status: ticket.status || 'open',
      priority: ticket.priority || 'medium',
      assignedStaffName: ticket.assignedTo || ticket.assignedStaffName || TECHNICIANS[0],
      expectedCompletion: ticket.expectedCompletion || '',
      totalCost: ticket.totalCost || 0,
      newNote: '',
    });
    setPageView('edit');
  };

  const startAssign = (ticket) => {
    setSelectedTicket(ticket);
    setAssignTech(ticket.assignedTo || ticket.assignedStaffName || TECHNICIANS[0]);
    setPageView('assign');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      setCreateErrors({ title: 'Issue Title is required.' });
      return;
    }

    createMaintenanceTicket({
      title: createForm.title.trim(),
      issue: createForm.title.trim(),
      category: createForm.category,
      roomId: createForm.roomId,
      location: createForm.location || 'Luxury Wing',
      priority: createForm.priority,
      assignedTo: createForm.assignedTechnician,
      assignedStaffName: createForm.assignedTechnician,
      description: createForm.description.trim(),
      estimatedCost: Number(createForm.estimatedCost) || 0,
      status: 'open',
      createdAt: new Date().toISOString(),
    });

    showToast('Work Order Created', `Ticket "${createForm.title}" registered in system.`, 'success');
    setPageView('list');
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    updateMaintenanceTicket(selectedTicket.id, {
      title: updateForm.title,
      status: updateForm.status,
      priority: updateForm.priority,
      assignedTo: updateForm.assignedStaffName,
      assignedStaffName: updateForm.assignedStaffName,
      totalCost: Number(updateForm.totalCost) || 0,
    });

    showToast('Work Order Updated', `Ticket #${selectedTicket.id} updated to ${updateForm.status}.`, 'success');
    setPageView('list');
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    assignTechnicianToTicket(selectedTicket.id, assignTech);
    showToast('Technician Dispatched', `Assigned ${assignTech} to ticket #${selectedTicket.id}.`, 'success');
    setPageView('list');
  };

  // Filtered & Sorted Tickets
  const filteredTickets = useMemo(() => {
    return maintenanceTickets
      .filter((ticket) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          ticket.id?.toLowerCase().includes(q) ||
          ticket.title?.toLowerCase().includes(q) ||
          ticket.issue?.toLowerCase().includes(q) ||
          ticket.description?.toLowerCase().includes(q) ||
          ticket.location?.toLowerCase().includes(q) ||
          ticket.roomNumber?.toString().includes(q) ||
          ticket.assignedTo?.toLowerCase().includes(q);

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesCategory =
          categoryFilter === 'All Categories' || ticket.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'priority') {
          const weights = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        return 0;
      });
  }, [maintenanceTickets, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const handleResolveQuick = (ticket) => {
    resolveMaintenanceTicket(ticket.id, 'Resolved via quick command dispatch');
    showToast('Ticket Resolved', `Work order ${ticket.id} marked as completed.`, 'success');
  };

  const handleDeleteConfirm = () => {
    if (ticketToDelete) {
      deleteMaintenanceTicket(ticketToDelete.id);
      showToast('Ticket Deleted', `Work order ${ticketToDelete.id} removed.`, 'info');
      setTicketToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // KPI Calculations
  const totalCount = maintenanceTickets.length;
  const openCount = maintenanceTickets.filter((t) => t.status === 'open').length;
  const inProgressCount = maintenanceTickets.filter(
    (t) => t.status === 'in_progress' || t.status === 'assigned'
  ).length;
  const urgentCount = maintenanceTickets.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;

  // Dedicated View: Create / Raise Ticket
  if (pageView === 'create') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Work Orders</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Raise Engineering Work Order
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Log mechanical, electrical, thermal, or architectural issue across palace suites.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Work Order Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Master Bath Thermal Radiator Pressure Calibration"
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none focus:border-accent"
                />
                {createErrors.title && (
                  <p className="mt-1 text-[11px] text-rose-500">{createErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Technical Category
                </label>
                <select
                  value={createForm.category}
                  onChange={e => setCreateForm({ ...createForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {ISSUE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Chamber / Location
                </label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={e => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder="e.g. Presidential Suite 801"
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Dispatch Priority
                </label>
                <select
                  value={createForm.priority}
                  onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="low" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Low (Standard PM)</option>
                  <option value="medium" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Medium (Routine Service)</option>
                  <option value="high" className="bg-white dark:bg-primary-900 text-primary dark:text-white">High (Guest Impact)</option>
                  <option value="urgent" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Urgent (Immediate VIP Dispatch)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Assign Lead Technician
                </label>
                <select
                  value={createForm.assignedTechnician}
                  onChange={e => setCreateForm({ ...createForm, assignedTechnician: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {TECHNICIANS.map(tech => (
                    <option key={tech} value={tech} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{tech}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Technical Directives & Work Instructions
              </label>
              <textarea
                rows={4}
                value={createForm.description}
                onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Specify precise diagnostic instructions, guest privacy constraints, or replacement parts..."
                className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-800 text-xs font-semibold text-charcoal dark:text-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Dispatch Work Order</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dedicated View: Edit / Update Ticket
  if (pageView === 'edit' && selectedTicket) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Work Orders</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Edit2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Update Work Order #{selectedTicket.id}
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Modify status progression, assign technician, or log maintenance expenses.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Work Order Title
                </label>
                <input
                  type="text"
                  value={updateForm.title}
                  onChange={e => setUpdateForm({ ...updateForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Resolution Status
                </label>
                <select
                  value={updateForm.status}
                  onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="open" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Open</option>
                  <option value="assigned" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Assigned</option>
                  <option value="in_progress" className="bg-white dark:bg-primary-900 text-primary dark:text-white">In Progress</option>
                  <option value="on_hold" className="bg-white dark:bg-primary-900 text-primary dark:text-white">On Hold</option>
                  <option value="completed" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Completed / Resolved</option>
                  <option value="cancelled" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Priority
                </label>
                <select
                  value={updateForm.priority}
                  onChange={e => setUpdateForm({ ...updateForm, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="low" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Low</option>
                  <option value="medium" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Medium</option>
                  <option value="high" className="bg-white dark:bg-primary-900 text-primary dark:text-white">High</option>
                  <option value="urgent" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Assigned Technician
                </label>
                <select
                  value={updateForm.assignedStaffName}
                  onChange={e => setUpdateForm({ ...updateForm, assignedStaffName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {TECHNICIANS.map(t => (
                    <option key={t} value={t} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Parts & Labor Expense ($ USD)
                </label>
                <input
                  type="number"
                  value={updateForm.totalCost}
                  onChange={e => setUpdateForm({ ...updateForm, totalCost: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/60 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-800 text-xs font-semibold text-charcoal dark:text-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Work Order Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dedicated View: Assign Technician
  if (pageView === 'assign' && selectedTicket) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Work Orders</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Assign Technical Officer
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Dispatch ticket #{selectedTicket.id}: {selectedTicket.title || selectedTicket.issue}
              </p>
            </div>
          </div>

          <form onSubmit={handleAssignSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-2">
                Available Engineering Specialists
              </label>
              <div className="space-y-2">
                {TECHNICIANS.map(tech => (
                  <label
                    key={tech}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${assignTech === tech
                        ? 'bg-accent/15 border-accent text-primary dark:text-white font-bold shadow-sm'
                        : 'border-border/80 dark:border-white/10 hover:bg-ivory/50 dark:hover:bg-primary-800/40 text-charcoal dark:text-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="tech"
                      value={tech}
                      checked={assignTech === tech}
                      onChange={() => setAssignTech(tech)}
                      className="text-accent focus:ring-accent"
                    />
                    <span className="text-xs">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Confirm Technician Dispatch</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Engineering & Maintenance Tickets
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Work Order Registry
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Monitor mechanical issues, facility inspections, technician assignments, and repair costs.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Work Order</span>
        </button>
      </div>



      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">All Work Orders</p>
            <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
              {totalCount}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">Total Logged Tickets</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Pending Triage</p>
            <p className="font-serif font-bold text-2xl text-blue-500 mt-1">
              {openCount}
            </p>
            <p className="text-[10px] text-blue-500 font-mono mt-0.5">Unassigned or New</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Under Repair</p>
            <p className="font-serif font-bold text-2xl text-amber-500 mt-1">
              {inProgressCount}
            </p>
            <p className="text-[10px] text-amber-500 font-mono mt-0.5">Assigned to Technicians</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Urgent Directives</p>
            <p className="font-serif font-bold text-2xl text-rose-500 mt-1">
              {urgentCount}
            </p>
            <p className="text-[10px] text-rose-500 font-mono mt-0.5">High Severity Impact</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket #, description, room, or technician..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{c}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              <option value="all" className="bg-white dark:bg-primary-900 text-primary dark:text-white">All Priorities</option>
              <option value="urgent" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Urgent</option>
              <option value="high" className="bg-white dark:bg-primary-900 text-primary dark:text-white">High</option>
              <option value="medium" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Medium</option>
              <option value="low" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Low</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              <option value="newest" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Sort: Newest First</option>
              <option value="oldest" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Sort: Oldest First</option>
              <option value="priority" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Sort: By Severity</option>
            </select>
          </div>
        </div>

        {/* Quick Status Pill Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['all', 'open', 'assigned', 'in_progress', 'completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${statusFilter === st
                  ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                  : 'bg-ivory/80 dark:bg-primary-950/40 border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent/40'
                }`}
            >
              {st === 'all'
                ? 'All Statuses'
                : st.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Data Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredTickets.length}</span> of {maintenanceTickets.length} Tickets
          </p>
          {(statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'All Categories' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('All Categories');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-950/80 text-[11px] uppercase tracking-wider text-charcoal dark:text-gray-300 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Ticket Ref</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Work Order & Description</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Category</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Location</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Priority</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Assigned Specialist</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Logged Date</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Status</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {ticket.id}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-primary dark:text-white truncate">
                        {ticket.title || ticket.issue || 'Maintenance Diagnostic'}
                      </p>
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400 truncate">
                        {ticket.description || 'Routine preventive work order'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal dark:text-gray-300">
                      {ticket.category || 'General Works'}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-accent">
                      {ticket.location || (ticket.roomNumber ? `Suite ${ticket.roomNumber}` : 'Palace Facility')}
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={ticket.priority} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-charcoal dark:text-gray-300">
                          {ticket.assignedTo || ticket.assignedStaffName || 'Unassigned'}
                        </span>
                        <button
                          onClick={() => startAssign(ticket)}
                          className="p-1 rounded hover:bg-accent/15 text-accent transition-colors"
                          title="Assign or change technician"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {ticket.createdAt ? ticket.createdAt.split('T')[0] : 'Today'}
                    </td>

                    <td className="py-3.5 px-4">
                      <MaintenanceStatusBadge status={ticket.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ticket.status !== 'completed' && (
                          <button
                            onClick={() => handleResolveQuick(ticket)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/15 transition-colors"
                            title="Quick Resolve Ticket"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => startEdit(ticket)}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
                          title="Edit Ticket Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setTicketToDelete(ticket);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-muted dark:text-gray-400">
            <Wrench className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No Work Orders Found
            </p>
            <p className="text-xs mt-1">Try adjusting your search criteria or priority filters.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Work Order Record"
        itemName={ticketToDelete ? `${ticketToDelete.id} - ${ticketToDelete.title || ticketToDelete.issue}` : ''}
        message="Are you certain you wish to purge this maintenance ticket from the register?"
      />
    </div>
  );
};

export default MaintenanceTicketsPage;
