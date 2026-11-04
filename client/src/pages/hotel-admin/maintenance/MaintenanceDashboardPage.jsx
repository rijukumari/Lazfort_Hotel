import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  BedDouble,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Flame,
  FileText,
  ArrowLeft,
  Edit2,
  Save
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  MaintenanceStatCard,
  MaintenanceStatusBadge,
  PriorityBadge,
  MaintenanceNavTabs,
  RaiseTicketModal,
  AddAssetModal,
  UpdateTicketModal
} from '../../../components/maintenance';

export const MaintenanceDashboardPage = () => {
  const navigate = useNavigate();
  const {
    maintenanceTickets = [],
    fixedAssets = [],
    rooms = [],
    getActiveMaintenanceCount,
    updateMaintenanceTicket,
    createMaintenanceTicket
  } = useERP();
  const { showToast } = useToast();

  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Dedicated Page View: 'dashboard' | 'edit-ticket' | 'create-ticket'
  const [pageView, setPageView] = useState('dashboard');
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [createTicketForm, setCreateTicketForm] = useState({
    title: '',
    category: 'HVAC & Climate',
    roomId: '',
    location: '',
    priority: 'medium',
    assignedTechnician: 'Marco Bellini (Chief Engineer)',
    expectedCompletionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    description: '',
    blocksRoom: false,
    estimatedCost: 150,
  });

  const startCreateTicket = () => {
    setCreateTicketForm({
      title: '',
      category: 'HVAC & Climate',
      roomId: rooms[0]?.id || '',
      location: rooms[0]?.roomNumber ? `Suite ${rooms[0].roomNumber}` : 'General Palace Property',
      priority: 'medium',
      assignedTechnician: 'Marco Bellini (Chief Engineer)',
      expectedCompletionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      description: '',
      blocksRoom: false,
      estimatedCost: 150,
    });
    setPageView('create-ticket');
  };

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!createTicketForm.title.trim()) {
      showToast('Validation Error', 'Issue title is required.', 'error');
      return;
    }

    createMaintenanceTicket({
      title: createTicketForm.title.trim(),
      issue: createTicketForm.title.trim(),
      category: createTicketForm.category,
      roomId: createTicketForm.roomId,
      location: createTicketForm.location || 'General Palace Property',
      priority: createTicketForm.priority,
      assignedTo: createTicketForm.assignedTechnician,
      assignedStaffName: createTicketForm.assignedTechnician,
      description: createTicketForm.description.trim(),
      estimatedCost: Number(createTicketForm.estimatedCost) || 0,
      blocksRoom: createTicketForm.blocksRoom,
      status: 'open',
      createdAt: new Date().toISOString(),
    });

    showToast('Work Order Created', `Ticket "${createTicketForm.title}" registered successfully.`, 'success');
    setPageView('dashboard');
  };

  const [editForm, setEditForm] = useState({
    title: '',
    status: 'open',
    priority: 'medium',
    assignedStaffName: '',
    expectedCompletion: '',
    totalCost: 0,
    newNote: '',
  });

  const startEditTicket = (ticket) => {
    setTicketToEdit(ticket);
    setEditForm({
      title: ticket.title || ticket.issue || '',
      status: ticket.status || 'open',
      priority: ticket.priority || 'medium',
      assignedStaffName: ticket.assignedTo || ticket.assignedStaffName || 'Marco Bellini (Chief Engineer)',
      expectedCompletion: ticket.expectedCompletion || '',
      totalCost: ticket.totalCost || ticket.estimatedCost || 0,
      newNote: '',
    });
    setPageView('edit-ticket');
  };

  const handleUpdateTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketToEdit) return;

    let updatedNotes = ticketToEdit.notes || '';
    if (editForm.newNote.trim()) {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
      updatedNotes = updatedNotes 
        ? `${updatedNotes}\n[${timestamp}]: ${editForm.newNote.trim()}`
        : `[${timestamp}]: ${editForm.newNote.trim()}`;
    }

    updateMaintenanceTicket(ticketToEdit.id, {
      title: editForm.title.trim(),
      status: editForm.status,
      priority: editForm.priority,
      assignedTo: editForm.assignedStaffName,
      assignedStaffName: editForm.assignedStaffName,
      expectedCompletion: editForm.expectedCompletion,
      totalCost: Number(editForm.totalCost),
      notes: updatedNotes,
    });

    showToast('Work Order Updated', `Ticket #${ticketToEdit.ticketNumber || ticketToEdit.id} updated.`, 'success');
    setPageView('dashboard');
  };

  // Dedicated Page View: Raise Work Order on Same Page
  if (pageView === 'create-ticket') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('dashboard')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Maintenance Dashboard</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-secondary/40 border border-transparent shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/40 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Raise Work Order / Maintenance Ticket
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Log technical defects, room disrepairs, and preventive work orders across Lazfort Palace
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateTicketSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Work Order / Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jacuzzi Hydrotherapy Jet Pressure Calibration"
                value={createTicketForm.title}
                onChange={e => setCreateTicketForm({ ...createTicketForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Chamber / Location
                </label>
                <select
                  value={createTicketForm.roomId}
                  onChange={e => {
                    const room = rooms.find(r => r.id === e.target.value);
                    setCreateTicketForm({
                      ...createTicketForm,
                      roomId: e.target.value,
                      location: room ? `Suite ${room.roomNumber}` : 'General Palace Property'
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">General Palace Property</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                      Suite {r.roomNumber} ({r.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Assign Lead Technician
                </label>
                <select
                  value={createTicketForm.assignedTechnician}
                  onChange={e => setCreateTicketForm({ ...createTicketForm, assignedTechnician: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer shadow-sm"
                >
                  {[
                    'Marco Bellini (Chief Engineer)',
                    'Giovanni Rossi (Senior HVAC Specialist)',
                    'Laurent Moreau (Master Electrician)',
                    'Alain Renaud (Lead Plumber)',
                    'David Chen (Smart Systems & Audio/Visual)'
                  ].map(tech => (
                    <option key={tech} value={tech} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{tech}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={createTicketForm.expectedCompletionDate}
                  onChange={e => setCreateTicketForm({ ...createTicketForm, expectedCompletionDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Estimated Repair Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={createTicketForm.estimatedCost}
                  onChange={e => setCreateTicketForm({ ...createTicketForm, estimatedCost: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Specific Facility Location (If room not selected)
              </label>
              <input
                type="text"
                placeholder="e.g., Grand Ballroom Chandelier West Wing, Spa Thermal Pool #2"
                value={createTicketForm.location}
                onChange={e => setCreateTicketForm({ ...createTicketForm, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Technical Directives & Work Instructions
              </label>
              <textarea
                rows={3}
                value={createTicketForm.description}
                onChange={e => setCreateTicketForm({ ...createTicketForm, description: e.target.value })}
                placeholder="Specify precise diagnostic instructions, guest privacy constraints, or replacement parts..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none shadow-inner resize-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mark Room Under Maintenance (Out of Service)</span>
                </p>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-0.5">
                  Blocks guest check-ins and marks room as maintenance in reservations.
                </p>
              </div>
              <input
                type="checkbox"
                checked={createTicketForm.blocksRoom}
                onChange={e => setCreateTicketForm({ ...createTicketForm, blocksRoom: e.target.checked })}
                className="w-5 h-5 rounded border-rose-500 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('dashboard')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Dispatch Work Order</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Dedicated Page View: Update Work Order on Same Page
  if (pageView === 'edit-ticket' && ticketToEdit) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('dashboard')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Maintenance Dashboard</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface-light dark:bg-secondary/40 border border-transparent shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/40 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <Edit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                  Update Work Order
                </h2>
                <span className="font-mono text-sm font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-lg">
                  {ticketToEdit.ticketNumber || ticketToEdit.id}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                {ticketToEdit.location || 'Suite & Resort Facility'} • Assigned Technician Directives
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateTicketSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Work Order Title
              </label>
              <input
                type="text"
                required
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Ticket Status
                </label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="open" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Open</option>
                  <option value="assigned" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Assigned</option>
                  <option value="in_progress" className="bg-white dark:bg-primary-900 text-primary dark:text-white">In Progress</option>
                  <option value="on_hold" className="bg-white dark:bg-primary-900 text-primary dark:text-white">On Hold</option>
                  <option value="completed" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Completed / Resolved</option>
                  <option value="cancelled" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Priority Tier
                </label>
                <select
                  value={editForm.priority}
                  onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="low" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Low Priority</option>
                  <option value="medium" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Medium Priority</option>
                  <option value="high" className="bg-white dark:bg-primary-900 text-primary dark:text-white">High Priority</option>
                  <option value="critical" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Critical / VIP Emergency</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Assigned Specialist
                </label>
                <select
                  value={editForm.assignedStaffName}
                  onChange={e => setEditForm({ ...editForm, assignedStaffName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer shadow-sm"
                >
                  {[
                    'Marco Bellini (Chief Engineer)',
                    'Giovanni Rossi (Senior HVAC Specialist)',
                    'Laurent Moreau (Master Electrician)',
                    'Alain Renaud (Lead Plumber)',
                    'David Chen (Smart Systems & Audio/Visual)'
                  ].map(tech => (
                    <option key={tech} value={tech} className="bg-white dark:bg-primary-900 text-primary dark:text-white">{tech}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Estimated / Incurred Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editForm.totalCost}
                  onChange={e => setEditForm({ ...editForm, totalCost: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Append Technical Maintenance Note
              </label>
              <textarea
                rows={3}
                value={editForm.newNote}
                onChange={e => setEditForm({ ...editForm, newNote: e.target.value })}
                placeholder="e.g., Replacement gasket installed; system tested for 30 minutes at standard atmospheric pressure."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border/60 dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none shadow-inner resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('dashboard')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Work Order</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Key KPI Computations
  const activeTickets = maintenanceTickets.filter(
    (t) => t.status === 'open' || t.status === 'assigned' || t.status === 'in_progress'
  );
  const criticalTickets = activeTickets.filter(
    (t) => t.priority === 'critical' || t.priority === 'high'
  );
  const roomsInMaintenance = rooms.filter((r) => r.status === 'maintenance');

  // Asset Valuation Computations
  const now = new Date();
  const totalValuation = fixedAssets.reduce((sum, a) => {
    const cost = Number(a.purchaseCost || a.cost || 0);
    const salvage = Number(a.salvageValue || 0);
    const usefulLife = Number(a.usefulLifeYears || 10);
    const purchaseDate = new Date(a.purchaseDate || Date.now());
    const ageYears = Math.max(0, (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25));
    const annualDepr = usefulLife > 0 ? (cost - salvage) / usefulLife : 0;
    const accumDepr = Math.min(cost - salvage, ageYears * annualDepr);
    const bookVal = Math.max(salvage, cost - accumDepr);
    return sum + bookVal;
  }, 0);

  // Condition breakdown
  const conditionCounts = {
    Excellent: fixedAssets.filter((a) => (a.condition || 'Excellent') === 'Excellent').length,
    Good: fixedAssets.filter((a) => a.condition === 'Good').length,
    Fair: fixedAssets.filter((a) => a.condition === 'Fair').length,
    Poor: fixedAssets.filter((a) => a.condition === 'Poor').length
  };

  const recentTickets = [...maintenanceTickets]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary dark:text-white">
                Engineering, Maintenance & Asset Command
              </h1>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Lazfort Palace Grand Infrastructure, Work Orders & Fixed Capital Valuation
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddAssetOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/15 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <Building2 className="w-4 h-4 text-accent shrink-0" />
            <span>Register Fixed Asset</span>
          </button>
          <button
            type="button"
            onClick={startCreateTicket}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Raise Work Order</span>
          </button>
        </div>
      </div>



      {/* Critical Alert Banner if high/critical tickets exist */}
      {criticalTickets.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-rose-600 dark:text-rose-400">
                High Priority Infrastructure Alert
              </p>
              <p className="text-xs text-charcoal-muted dark:text-gray-300">
                {criticalTickets.length} urgent ticket(s) require engineering intervention. Guest comfort or safety affected.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/hotel-admin/maintenance/tickets')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors shrink-0"
          >
            Resolve Tickets →
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MaintenanceStatCard
          title="Active Maintenance Tickets"
          value={activeTickets.length}
          subtitle={`${maintenanceTickets.filter((t) => t.status === 'completed').length} Resolved this month`}
          icon={Wrench}
          color="gold"
          onClick={() => navigate('/hotel-admin/maintenance/tickets')}
        />
        <MaintenanceStatCard
          title="Chambers Under Maintenance"
          value={roomsInMaintenance.length}
          subtitle={`${rooms.length} Total Suites in Portfolio`}
          icon={BedDouble}
          color={roomsInMaintenance.length > 0 ? 'rose' : 'emerald'}
          onClick={() => navigate('/hotel-admin/rooms/maintenance')}
        />
        <MaintenanceStatCard
          title="Fixed Capital Assets"
          value={fixedAssets.length}
          subtitle="Machinery & Property Equipment"
          icon={Building2}
          color="blue"
          onClick={() => navigate('/hotel-admin/maintenance/assets')}
        />
        <MaintenanceStatCard
          title="Asset Book Valuation"
          value={`$${Math.round(totalValuation).toLocaleString()}`}
          subtitle="IAS-16 Net Book Value"
          icon={DollarSign}
          color="emerald"
          onClick={() => navigate('/hotel-admin/maintenance/assets')}
        />
      </div>

      {/* Analytics & Priority Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Priority Breakdown */}
        <div className="p-5 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent" />
              <span>Ticket Priority Breakdown</span>
            </h3>
            <span className="text-xs text-charcoal-muted font-mono">{activeTickets.length} Active</span>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Critical / Blocking',
                count: activeTickets.filter((t) => t.priority === 'critical').length,
                color: 'bg-rose-500',
                textColor: 'text-rose-500'
              },
              {
                label: 'High Priority',
                count: activeTickets.filter((t) => t.priority === 'high').length,
                color: 'bg-amber-500',
                textColor: 'text-amber-500'
              },
              {
                label: 'Medium Routine',
                count: activeTickets.filter((t) => t.priority === 'medium').length,
                color: 'bg-blue-500',
                textColor: 'text-blue-500'
              },
              {
                label: 'Low / Preventative',
                count: activeTickets.filter((t) => t.priority === 'low').length,
                color: 'bg-emerald-500',
                textColor: 'text-emerald-500'
              }
            ].map((p, idx) => {
              const pct = activeTickets.length > 0 ? (p.count / activeTickets.length) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-charcoal dark:text-gray-300">{p.label}</span>
                    <span className={`font-mono font-bold ${p.textColor}`}>{p.count}</span>
                  </div>
                  <div className="w-full bg-border/60 dark:bg-black/50 rounded-full h-2 overflow-hidden border border-border/40 dark:border-white/10">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${p.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/hotel-admin/maintenance/tickets')}
            className="w-full mt-2 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Tickets Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Capital Asset Operating Health */}
        <div className="p-5 rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <span>Asset Physical Condition</span>
            </h3>
            <span className="text-xs text-charcoal-muted font-mono">{fixedAssets.length} Assets</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                {conditionCounts.Excellent}
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                Excellent Condition
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">
                {conditionCounts.Good}
              </p>
              <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 mt-1">
                Good Standing
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                {conditionCounts.Fair}
              </p>
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-1">
                Fair / Minor Wear
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <p className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400">
                {conditionCounts.Poor}
              </p>
              <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 mt-1">
                Needs Immediate Attention
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/hotel-admin/maintenance/assets')}
            className="w-full mt-2 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Asset Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preventative Schedule & Dispatch Card */}
        <div className="p-5 rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-transparent shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Routine Maintenance Plan</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-accent/20 text-accent font-bold">
              Automated
            </span>
          </div>

          <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed">
            Preventative maintenance rounds are automatically cycled across central HVAC chiller towers, high-speed Otis elevators, and Michelin culinary refrigeration.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/60 border border-border/80 dark:border-white/10">
              <span className="font-medium text-primary dark:text-gray-100">Central Chiller Inspection</span>
              <span className="text-accent font-mono font-semibold">Today 14:00</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/60 border border-border/80 dark:border-white/10">
              <span className="font-medium text-primary dark:text-gray-100">Penthouse Elevator Cable Test</span>
              <span className="text-accent font-mono font-semibold">Tomorrow 09:30</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/60 border border-border/80 dark:border-white/10">
              <span className="font-medium text-primary dark:text-gray-100">Royal Spa Pool Chlorination</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Completed</span>
            </div>
          </div>

          <button
            onClick={startCreateTicket}
            className="w-full py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold cursor-pointer"
          >
            Dispatch Quick Work Order
          </button>
        </div>
      </div>

      {/* Recent Work Orders Table */}
      <div className="p-6 rounded-3xl border border-transparent bg-surface-light dark:bg-secondary/40 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Recent Engineering Work Orders
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Live maintenance telemetry, dispatch assignments and resolution timeline
            </p>
          </div>

          <button
            onClick={() => navigate('/hotel-admin/maintenance/tickets')}
            className="px-3.5 py-1.5 rounded-xl border border-accent/40 text-accent text-xs font-semibold hover:bg-accent/15 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Tickets ({maintenanceTickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/40 dark:border-white/5 bg-ivory/50 dark:bg-primary-950/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Location / Chamber</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-accent">
                      {ticket.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-primary dark:text-white">
                        {ticket.title || ticket.issue}
                      </p>
                      <p className="text-[11px] text-charcoal-muted truncate max-w-xs">
                        {ticket.category || 'General Repair'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-primary dark:text-white">
                        {ticket.roomNumber ? `Suite ${ticket.roomNumber}` : ticket.location || 'Facility Wide'}
                      </span>
                      {ticket.blocksRoom && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30">
                          Chamber Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={ticket.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-charcoal dark:text-gray-300">
                      {ticket.assignedTo || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <MaintenanceStatusBadge status={ticket.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => startEditTicket(ticket)}
                        className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-semibold hover:bg-accent/25 transition-colors cursor-pointer"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-charcoal-muted dark:text-gray-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-serif font-bold text-sm text-primary dark:text-white">
              No Outstanding Maintenance Tickets
            </p>
            <p className="text-xs">All palace facilities operating at optimal parameters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <RaiseTicketModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        onSuccess={() => {
          showToast('Ticket Raised', 'Maintenance work order has been logged successfully.', 'success');
        }}
      />

      <AddAssetModal
        isOpen={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        onSuccess={() => {
          showToast('Asset Registered', 'Fixed capital asset has been recorded in IAS-16 register.', 'success');
        }}
      />

      <UpdateTicketModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        ticket={selectedTicket}
        onSuccess={() => {
          showToast('Ticket Updated', 'Work order parameters and status updated.', 'success');
        }}
      />
    </div>
  );
};

export default MaintenanceDashboardPage;

