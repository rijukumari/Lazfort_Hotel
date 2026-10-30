import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog, Card } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  Wrench,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  BedDouble,
  UserCheck,
  Calendar,
  X,
  Save,
  ShieldAlert,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const RoomMaintenancePage = () => {
  const navigate = useNavigate();
  const {
    maintenanceTickets = [],
    createMaintenanceTicket,
    resolveMaintenanceTicket,
    deleteMaintenanceTicket,
    rooms = [],
    staff = [],
    updateRoomStatus,
  } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    roomId: rooms[0]?.id || '',
    type: 'Plumbing',
    title: '',
    description: '',
    priority: 'high',
    assignedStaff: staff[0]?.name || 'Chief Engineer Marcus Vance',
    startDate: new Date().toISOString().split('T')[0],
    expectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    blocksRoom: true,
  });

  const activeTickets = useMemo(() => {
    return maintenanceTickets.filter(t => t.status !== 'resolved' && t.status !== 'completed');
  }, [maintenanceTickets]);

  const historyTickets = useMemo(() => {
    return maintenanceTickets.filter(t => t.status === 'resolved' || t.status === 'completed');
  }, [maintenanceTickets]);

  const displayedTickets = useMemo(() => {
    const sourceList = activeTab === 'active' ? activeTickets : historyTickets;
    return sourceList.filter(t => {
      const roomNum = t.roomNumber || '';
      const title = t.title || '';
      const desc = t.description || '';
      const assigned = t.assignedTo || t.assignedStaff || '';

      const matchesSearch =
        roomNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assigned.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || (t.priority || '').toLowerCase() === priorityFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || (t.type || t.category || '').toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesPriority && matchesType;
    });
  }, [activeTab, activeTickets, historyTickets, searchQuery, priorityFilter, typeFilter]);

  const urgentCount = maintenanceTickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;
  const inProgressCount = maintenanceTickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = maintenanceTickets.filter(t => t.status === 'resolved').length;

  const handleOpenAdd = () => {
    setEditingTicket(null);
    setFormData({
      roomId: rooms[0]?.id || '',
      type: 'Plumbing',
      title: '',
      description: '',
      priority: 'high',
      assignedStaff: staff[0]?.name || 'Chief Engineer Marcus Vance',
      startDate: new Date().toISOString().split('T')[0],
      expectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      blocksRoom: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      roomId: ticket.roomId || rooms[0]?.id || '',
      type: ticket.type || ticket.category || 'Plumbing',
      title: ticket.title || '',
      description: ticket.description || '',
      priority: ticket.priority || 'medium',
      assignedStaff: ticket.assignedTo || ticket.assignedStaff || '',
      startDate: ticket.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      expectedDate: ticket.estimatedResolution?.split('T')[0] || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      blocksRoom: ticket.blocksRoom ?? true,
    });
    setModalOpen(true);
  };

  const handleSaveTicket = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Validation Error', 'Maintenance title or issue summary is required.', 'error');
      return;
    }

    const selectedRoom = rooms.find(r => r.id === formData.roomId) || rooms[0];

    if (editingTicket) {
      if (resolveMaintenanceTicket && formData.status === 'resolved') {
        resolveMaintenanceTicket(editingTicket.id);
      }
      showToast('Maintenance Ticket Updated', `Ticket #${editingTicket.ticketNumber || editingTicket.id} updated.`, 'success');
    } else {
      createMaintenanceTicket({
        roomId: selectedRoom?.id,
        roomNumber: selectedRoom?.roomNumber,
        category: formData.type,
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim() || formData.title.trim(),
        priority: formData.priority,
        assignedTo: formData.assignedStaff,
        assignedStaff: formData.assignedStaff,
        blocksRoom: formData.blocksRoom,
        estimatedResolution: formData.expectedDate,
      });

      if (formData.blocksRoom && selectedRoom) {
        updateRoomStatus(selectedRoom.id, 'maintenance');
      }

      showToast(
        'Maintenance Order Raised',
        `Work order dispatched for Suite ${selectedRoom?.roomNumber}. Engineering team notified.`,
        'success'
      );
    }

    setModalOpen(false);
  };

  const handleMarkCompleted = (ticketId) => {
    resolveMaintenanceTicket(ticketId);
    showToast('Work Order Resolved', 'Maintenance verified and suite restored to clean operational inventory.', 'success');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMaintenanceTicket(deleteId);
    setDeleteId(null);
    showToast('Ticket Removed', 'Maintenance record deleted.', 'info');
  };

  const columns = [
    {
      key: 'ticketNumber',
      header: 'Ticket ID & Room',
      sortable: true,
      render: t => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-accent text-xs">{t.ticketNumber || t.id}</span>
          </div>
          <span className="font-serif font-bold text-primary dark:text-white text-xs block mt-0.5">
            Suite {t.roomNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Issue Narrative & Category',
      sortable: true,
      render: t => (
        <div>
          <span className="font-semibold text-xs text-primary dark:text-white">{t.title}</span>
          <p className="text-[11px] text-charcoal-muted line-clamp-1 mt-0.5">{t.description}</p>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.2 rounded bg-ivory dark:bg-white/5 border border-border/60 text-charcoal-muted font-mono">
            {t.category || t.type || 'General'}
          </span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Severity Priority',
      sortable: true,
      render: t => {
        let badgeColor = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30';
        if (t.priority === 'urgent') badgeColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold';
        if (t.priority === 'high') badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${badgeColor}`}>
            {t.priority === 'urgent' && <AlertTriangle className="w-3 h-3 text-rose-500" />}
            {t.priority}
          </span>
        );
      },
    },
    {
      key: 'assignedTo',
      header: 'Engineer Assigned',
      sortable: true,
      render: t => (
        <span className="text-xs text-charcoal dark:text-gray-200 font-medium flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-accent" />
          {t.assignedTo || t.assignedStaff || 'Chief Engineer Marcus'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: t => <StatusBadge status={t.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: t => (
        <div className="flex items-center gap-1.5">
          {t.status !== 'resolved' && (
            <button
              onClick={() => handleMarkCompleted(t.id)}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[11px] hover:bg-emerald-500/25 transition-all flex items-center gap-1"
              title="Mark as Completed & Restore Room"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>
          )}
          <button
            onClick={() => handleOpenEdit(t)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Ticket"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(t.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete Ticket"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Room Maintenance & Engineering Work Orders"
        description="Raise and track suite repairs, plumbing protocols, HVAC climate adjustments, jacuzzi servicing, and restore rooms to active inventory."
        badge={`${maintenanceTickets.length} Work Orders`}
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Create Maintenance Request
          </Button>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Active Work Orders"
          value={activeTickets.length}
          subtitle="engineering tickets open"
          icon={<Wrench className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Urgent Critical Items"
          value={urgentCount}
          subtitle="requires instant repair"
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="technician on-site"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Completed & Restored"
          value={resolvedCount}
          subtitle="suites returned to inventory"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Tab Controls & Table */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'active'
                  ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold'
                  : 'btn-secondary-3d text-charcoal-muted hover:text-accent'
                }`}
            >
              Active Work Orders ({activeTickets.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'history'
                  ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold'
                  : 'btn-secondary-3d text-charcoal-muted hover:text-accent'
                }`}
            >
              Maintenance History ({historyTickets.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket, room, issue..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-luxury pl-8 text-xs py-1.5 w-full"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All Types</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC / Climate</option>
              <option value="Electrical">Electrical</option>
              <option value="Jacuzzi">Jacuzzi / Pool</option>
              <option value="Interior">Interior Finish</option>
              <option value="Painting">Painting</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={displayedTickets}
          keyExtractor={t => t.id}
          pageSize={6}
          emptyMessage={
            activeTab === 'active'
              ? 'No active maintenance tickets found. All luxury suites are 100% operational.'
              : 'No resolved maintenance history records match criteria.'
          }
        />
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury w-full max-w-lg p-6 sm:p-7 rounded-2xl border border-accent/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  {editingTicket ? `Edit Work Order #${editingTicket.ticketNumber || editingTicket.id}` : 'Create Suite Maintenance Request'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Select Suite *
                  </label>
                  <select
                    value={formData.roomId}
                    onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>Suite {r.roomNumber} - {r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Maintenance Category *
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC & Climate Control</option>
                    <option value="Electrical">Electrical & Lighting</option>
                    <option value="Jacuzzi">Jacuzzi / Infinity Pool</option>
                    <option value="Interior">Interior Trim & Furniture</option>
                    <option value="Painting">Painting & Plaster</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Issue Summary Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bath hydro-jet water pressure low"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input-luxury text-xs w-full"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                  Technical Diagnosis / Detailed Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail observations, valve numbers, parts required, or safety notes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury text-xs w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Assigned Lead Technician
                  </label>
                  <select
                    value={formData.assignedStaff}
                    onChange={e => setFormData({ ...formData, assignedStaff: e.target.value })}
                    className="input-luxury text-xs w-full"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.department || s.role})</option>
                    ))}
                    <option value="Chief Engineer Marcus Vance">Chief Engineer Marcus Vance</option>
                    <option value="Senior Tech Jean Dupont">Senior Tech Jean Dupont</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="input-luxury text-xs w-full font-bold"
                  >
                    <option value="urgent">Urgent (Immediate Dispatch)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="blocksRoomCheck"
                  checked={formData.blocksRoom}
                  onChange={e => setFormData({ ...formData, blocksRoom: e.target.checked })}
                  className="rounded border-accent text-accent focus:ring-accent"
                />
                <label htmlFor="blocksRoomCheck" className="text-xs font-semibold text-primary dark:text-white cursor-pointer">
                  Block suite from check-in availability during maintenance
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80 dark:border-white/10">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  icon={Save}
                >
                  {editingTicket ? 'Update Ticket' : 'Dispatch Work Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Work Order?"
          message="Are you sure you wish to delete this maintenance record?"
          confirmText="Confirm Deletion"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RoomMaintenancePage;

