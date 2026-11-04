import React, { useState, useMemo } from 'react';
import { PageHeader, Button, Modal, FormField, Input } from '../../../components/ui';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Wrench,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  BedDouble,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const TECHNICIANS = [
  'Marco Bellini (Chief Engineer)',
  'Luca Moretti (HVAC Specialist)',
  'Antoine Mercier (Plumbing Master)',
  'Giovanni Rossi (Automation & Smart IoT)',
];

export const HousekeepingMaintenancePage = () => {
  const { maintenanceTickets: allTickets, createMaintenanceTicket, updateMaintenanceTicket, rooms } = useERP();
  const { showToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Dedicated Page View: 'list' | 'create'
  const [pageView, setPageView] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    roomNumber: rooms[0]?.roomNumber || '101',
    title: '',
    category: 'Plumbing & Bath',
    priority: 'high',
    assignedTechnician: TECHNICIANS[0],
    description: '',
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.title.trim()) {
      showToast('Validation Error', 'Please enter an issue title.', 'error');
      return;
    }

    createMaintenanceTicket({
      title: ticketForm.title.trim(),
      issue: ticketForm.title.trim(),
      category: ticketForm.category,
      roomNumber: ticketForm.roomNumber,
      location: `Suite ${ticketForm.roomNumber}`,
      priority: ticketForm.priority,
      assignedTo: ticketForm.assignedTechnician,
      assignedStaffName: ticketForm.assignedTechnician,
      description: ticketForm.description.trim(),
      blocksRoom: ticketForm.priority === 'critical',
      status: 'open',
      createdAt: new Date().toISOString(),
    });

    showToast('Work Order Dispatched', `Maintenance ticket for Suite ${ticketForm.roomNumber} logged.`, 'success');
    setIsModalOpen(false);
    setPageView('list');
    setTicketForm({
      roomNumber: rooms[0]?.roomNumber || '101',
      title: '',
      category: 'Plumbing & Bath',
      priority: 'high',
      assignedTechnician: TECHNICIANS[0],
      description: '',
    });
  };

  // Filter only tickets associated with room maintenance or reported during housekeeping turnover
  const housekeepingTickets = useMemo(() => {
    return allTickets.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.title?.toLowerCase().includes(q) ||
        t.roomNumber?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assignedStaffName?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || t.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [allTickets, searchQuery, statusFilter, priorityFilter]);

  const handleResolveTicket = (ticketId, roomNumber) => {
    updateMaintenanceTicket(ticketId, { status: 'completed' });
    showToast(
      'Issue Resolved',
      `Engineering ticket for Suite ${roomNumber} closed. Chamber ready for housekeeping turnover inspection.`,
      'success'
    );
  };

  // Dedicated Page View: Report Engineering Issue on Same Page
  if (pageView === 'create') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-accent rotate-180" />
            <span>Back to Housekeeping Maintenance</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-secondary/40 border border-transparent shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/40 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Report Engineering Issue
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Direct dispatch to maintenance division during chamber cleaning & turnover
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Suite / Location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ticketForm.roomNumber}
                  onChange={e => setTicketForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm cursor-pointer"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.roomNumber} className="dark:bg-primary-950">
                      Suite {room.roomNumber} ({room.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Technical Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ticketForm.category}
                  onChange={e => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm cursor-pointer"
                >
                  <option value="Plumbing & Bath">Plumbing & Marble Bath</option>
                  <option value="HVAC & Climate">HVAC & Climate Control</option>
                  <option value="Electrical & Lighting">Lighting & Electrical Fixtures</option>
                  <option value="Audio/Visual & Smart IoT">Smart Automation & Sound</option>
                  <option value="Furniture & Architectural">Architectural & Furniture Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Dispatch Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={e => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm cursor-pointer"
                >
                  <option value="critical">Critical (Blocks Room Allocation)</option>
                  <option value="high">High (Urgent Guest Arrival)</option>
                  <option value="medium">Medium (Routine Service)</option>
                  <option value="low">Low (Cosmetic Wear)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Assign Lead Technician <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ticketForm.assignedTechnician}
                  onChange={e => setTicketForm(prev => ({ ...prev, assignedTechnician: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm cursor-pointer"
                >
                  {TECHNICIANS.map(tech => (
                    <option key={tech} value={tech} className="dark:bg-primary-950">
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hydrotherapy Jacuzzi Jet Low Pressure"
                value={ticketForm.title}
                onChange={e => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Detailed Defect Description & Access Constraints
              </label>
              <textarea
                rows={3}
                value={ticketForm.description}
                onChange={e => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Specify precise observations, guest privacy constraints, or replacement parts..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none shadow-inner resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold cursor-pointer"
              >
                Dispatch Work Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Housekeeping Maintenance & Engineering Dispatch"
        description="Track fixture anomalies, plumbing faults, and environmental directives detected during chamber sanitization."
        badge="Facilities Bridge"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => setPageView('create')}
          >
            Report Engineering Issue
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Total Logged</span>
            <span className="font-serif font-bold text-2xl text-primary dark:text-white mt-1 block">
              {allTickets.length} Issues
            </span>
            <span className="text-[11px] text-charcoal-muted">Suite infrastructure</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Critical / Blocking</span>
            <span className="font-serif font-bold text-2xl text-rose-500 mt-1 block">
              {allTickets.filter(t => t.priority === 'critical' && t.status !== 'completed').length} Urgent
            </span>
            <span className="text-[11px] text-rose-500 font-semibold">Immediate intervention</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Technicians Active</span>
            <span className="font-serif font-bold text-2xl text-amber-500 mt-1 block">
              {allTickets.filter(t => t.status === 'in_progress' || t.status === 'assigned' || t.status === 'open').length} Dispatched
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Under repair</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Resolved & Cleared</span>
            <span className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1 block">
              {allTickets.filter(t => t.status === 'completed' || t.status === 'resolved').length} Cleared
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Turnover unblocked</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search maintenance requests by Suite #, issue, or technician..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs">
            {['all', 'open', 'in_progress', 'completed'].map(st => (
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

          {/* Priority Filter */}
          <div className="flex items-center gap-2 bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-accent shrink-0" />
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-transparent text-primary dark:text-white text-xs font-medium focus:outline-none"
            >
              <option value="all" className="dark:bg-primary-900">All Priorities</option>
              <option value="critical" className="dark:bg-primary-900">Critical</option>
              <option value="high" className="dark:bg-primary-900">High</option>
              <option value="medium" className="dark:bg-primary-900">Medium</option>
              <option value="low" className="dark:bg-primary-900">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card-luxury-3d p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-accent" />
            <span>Housekeeping Defect & Maintenance Tickets</span>
          </h3>
          <span className="text-xs font-mono text-charcoal-muted font-bold">
            {housekeepingTickets.length} Tickets Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-[11px] font-mono uppercase text-charcoal-muted">
                <th className="pb-3 px-3">Ticket ID</th>
                <th className="pb-3 px-3">Chamber Ref</th>
                <th className="pb-3 px-3">Issue Description</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Assigned Specialist</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {housekeepingTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    No active maintenance issues found matching query.
                  </td>
                </tr>
              ) : (
                housekeepingTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-accent">
                      {ticket.ticketNumber || ticket.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-primary dark:text-white block">
                        Suite {ticket.roomNumber || 'General'}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block">
                        {ticket.blocksRoom ? '🚫 Chamber Blocked' : 'Operational'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <span className="font-semibold text-primary dark:text-white block truncate">
                        {ticket.title}
                      </span>
                      <p className="text-[11px] text-charcoal-muted truncate">
                        {ticket.description || 'Reported by housekeeping attendant.'}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-charcoal dark:text-gray-300">
                      {ticket.category || 'HVAC & Plumbing'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        ticket.priority === 'critical'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : ticket.priority === 'high'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-accent/15 text-accent border border-accent/30'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium text-primary dark:text-white truncate">
                          {ticket.assignedStaffName || 'Engineering Team'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={ticket.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {ticket.status !== 'completed' && ticket.status !== 'resolved' ? (
                        <button
                          onClick={() => handleResolveTicket(ticket.id, ticket.roomNumber)}
                          className="px-2.5 py-1 rounded-lg gold-gradient-bg text-primary-900 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                        >
                          Mark Cleared
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolved
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

      {/* Report Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise Housekeeping Defect Report"
        description="Notify engineering dispatch of physical, thermal, or plumbing defects inside suites."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Suite / Location" required>
              <select
                value={ticketForm.roomNumber}
                onChange={e => setTicketForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.roomNumber} className="dark:bg-primary-950">
                    Suite {room.roomNumber} ({room.type})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Technical Category" required>
              <select
                value={ticketForm.category}
                onChange={e => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Plumbing & Bath">Plumbing & Marble Bath</option>
                <option value="HVAC & Climate">HVAC & Climate Control</option>
                <option value="Electrical & Lighting">Lighting & Electrical Fixtures</option>
                <option value="Audio/Visual & Smart IoT">Smart Automation & Sound</option>
                <option value="Furniture & Architectural">Architectural & Furniture Repair</option>
              </select>
            </FormField>

            <FormField label="Dispatch Priority" required>
              <select
                value={ticketForm.priority}
                onChange={e => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="critical">Critical (Blocks Room Allocation)</option>
                <option value="high">High (Urgent Guest Arrival)</option>
                <option value="medium">Medium (Routine Service)</option>
                <option value="low">Low (Cosmetic Wear)</option>
              </select>
            </FormField>

            <FormField label="Assign Lead Technician" required>
              <select
                value={ticketForm.assignedTechnician}
                onChange={e => setTicketForm(prev => ({ ...prev, assignedTechnician: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                {TECHNICIANS.map(tech => (
                  <option key={tech} value={tech} className="dark:bg-primary-950">
                    {tech}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Issue Title" required>
            <Input
              placeholder="e.g. Hydrotherapy Jacuzzi Jet Low Pressure"
              value={ticketForm.title}
              onChange={e => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </FormField>

          <FormField label="Detailed Defect Description & Access Constraints">
            <textarea
              rows={3}
              value={ticketForm.description}
              onChange={e => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Specify precise observations, guest privacy constraints, or replacement parts..."
              className="w-full px-3 py-2 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              Dispatch Work Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HousekeepingMaintenancePage;
