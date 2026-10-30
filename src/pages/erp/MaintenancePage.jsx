import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { ModalFooter } from '../../components/ui/ModalFooter';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FormField, Input, Select, Textarea } from '../../components/forms/FormField';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react';

export const MaintenancePage = () => {
  const {
    maintenanceTickets = [],
    fixedAssets = [],
    rooms = [],
    createMaintenanceTicket,
    resolveMaintenanceTicket,
    deleteMaintenanceTicket,
    getActiveMaintenanceCount,
  } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('tickets');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTicketId, setDeleteTicketId] = useState(null);

  const handleConfirmDelete = () => {
    if (!deleteTicketId) return;
    deleteMaintenanceTicket(deleteTicketId);
    setDeleteTicketId(null);
    showToast('Ticket Removed', 'Maintenance ticket deleted successfully.', 'success');
  };

  // New Ticket State
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketRoomId, setTicketRoomId] = useState('');
  const [ticketCategory, setTicketCategory] = useState('HVAC & Climate');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketBlocksRoom, setTicketBlocksRoom] = useState(false);

  const activeTickets = maintenanceTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  const totalAssetsValuation = fixedAssets.reduce((sum, a) => sum + (a.currentValue || 0), 0);

  const handleCreateTicketSubmit = async e => {
    e.preventDefault();
    if (!ticketTitle) {
      showToast('Validation Error', 'Please provide a ticket title.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const selectedRoom = rooms.find(r => r.id === ticketRoomId);

      const res = createMaintenanceTicket({
        title: ticketTitle,
        roomId: ticketRoomId || undefined,
        roomNumber: selectedRoom?.roomNumber || undefined,
        location: selectedRoom ? `Suite ${selectedRoom.roomNumber} (${selectedRoom.type})` : 'General Hotel Property',
        category: ticketCategory,
        priority: ticketPriority,
        description: ticketDescription,
        blocksRoom: ticketBlocksRoom || ticketPriority === 'critical',
        assignedStaffName: 'Marco Bellini (Chief Engineer)',
      });

      if (res?.success) {
        showToast('Maintenance Ticket Logged', res.message, 'success');
        setIsNewTicketModalOpen(false);
        setTicketTitle('');
        setTicketDescription('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveTicket = (ticketId, title) => {
    resolveMaintenanceTicket(ticketId);
    showToast(
      'Ticket Resolved',
      `Maintenance ticket ${title} marked resolved. Suite unblocked if previously restricted.`,
      'success'
    );
  };

  // Columns for Tickets
  const ticketColumns = [
    {
      key: 'ticketNumber',
      header: 'Ticket #',
      render: t => <span className="font-mono text-xs font-bold text-accent">{t.ticketNumber}</span>,
    },
    {
      key: 'title',
      header: 'Issue & Location',
      render: t => (
        <div>
          <p className="font-semibold text-primary dark:text-white text-xs leading-tight">{t.title}</p>
          <span className="text-[11px] text-charcoal-muted">{t.location} • {t.category}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: t => {
        const colors = {
          low: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
          medium: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
          high: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
          critical: 'bg-rose-500/15 text-rose-500 border-rose-500/30 animate-pulse',
        };
        return (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${colors[t.priority] || colors.medium}`}>
            {t.priority}
          </span>
        );
      },
    },
    {
      key: 'blocksRoom',
      header: 'Room Status',
      render: t => (
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${t.blocksRoom ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'text-charcoal-muted'
          }`}>
          {t.blocksRoom ? 'BLOCKED' : 'Operational'}
        </span>
      ),
    },
    {
      key: 'assignedStaffName',
      header: 'Engineer Assigned',
      render: t => <span className="text-xs text-charcoal/90 dark:text-gray-300">{t.assignedStaffName || 'Unassigned'}</span>,
    },
    {
      key: 'status',
      header: 'Ticket Status',
      render: t => (
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${t.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
          }`}>
          {t.status?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: t => (
        <div className="flex items-center gap-1.5">
          {t.status !== 'resolved' && (
            <button
              onClick={() => handleResolveTicket(t.id, t.title)}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Resolve
            </button>
          )}
          <button
            onClick={() => setDeleteTicketId(t.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all text-xs"
            title="Delete Ticket"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Columns for Fixed Assets
  const assetColumns = [
    {
      key: 'assetTag',
      header: 'Asset Tag',
      render: a => <span className="font-mono text-xs font-bold text-accent">{a.assetTag}</span>,
    },
    {
      key: 'name',
      header: 'Equipment & Department',
      render: a => (
        <div>
          <p className="font-semibold text-primary dark:text-white text-xs leading-tight">{a.name}</p>
          <span className="text-[11px] text-charcoal-muted">{a.department} • {a.location}</span>
        </div>
      ),
    },
    {
      key: 'purchasePrice',
      header: 'Original Cost',
      render: a => <span className="font-mono text-xs">€{(a.purchasePrice || 0).toLocaleString()}</span>,
    },
    {
      key: 'currentValue',
      header: 'Net Book Value',
      render: a => <span className="font-mono text-xs font-bold text-primary dark:text-white">€{(a.currentValue || 0).toLocaleString()}</span>,
    },
    {
      key: 'nextServiceDate',
      header: 'Next Service Due',
      render: a => <span className="text-xs font-mono text-charcoal-muted">{a.nextServiceDate}</span>,
    },
    {
      key: 'status',
      header: 'Operational Status',
      render: a => (
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          {a.status?.replace(/_/g, ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Engineering, Maintenance & Asset Command"
        description="Lazfort ERP — Real-time facility tickets, automated room blocking, preventive maintenance schedules, and capital asset depreciation."
        badge="Module G & L: Maintenance & Assets"
        actions={
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d"
          >
            <Plus className="w-4 h-4" />
            Raise Maintenance Ticket
          </button>
        }
      />

      {/* Stats Grid */}
      <StatsGrid columns={4}>
        <StatCard
          title="Active Maintenance Tickets"
          value={getActiveMaintenanceCount ? getActiveMaintenanceCount() : activeTickets.length}
          change={`${maintenanceTickets.filter(t => t.priority === 'critical' || t.priority === 'high').length} High Priority`}
          isPositive={(getActiveMaintenanceCount ? getActiveMaintenanceCount() : activeTickets.length) === 0}
          iconName="Wrench"
          subtitle="Chief Engineer On-Duty"
        />
        <StatCard
          title="Rooms Under Maintenance"
          value={rooms.filter(r => r.status === 'maintenance').length}
          change="Blocked From Allocation"
          isPositive={rooms.filter(r => r.status === 'maintenance').length === 0}
          iconName="ShieldAlert"
          subtitle="Protected Inventory"
        />
        <StatCard
          title="Total Fixed Capital Assets"
          value={fixedAssets.length}
          change="Vehicles & Spa Machinery"
          isPositive={true}
          iconName="Car"
          subtitle="Rolls-Royce, Cryo Pods"
        />
        <StatCard
          title="Asset Book Valuation"
          value={`€${totalAssetsValuation.toLocaleString()}`}
          change="Straight-Line Depreciated"
          isPositive={true}
          iconName="Activity"
          subtitle="Audited Capital Value"
        />
      </StatsGrid>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'tickets', label: 'Active Maintenance Tickets', count: activeTickets.length },
          { id: 'assets', label: 'Fixed Asset Register', count: fixedAssets.length },
        ]}
        activeTab={activeTab}
        onChange={tabId => setActiveTab(tabId)}
      />

      {/* Tab Panels */}
      {activeTab === 'tickets' && (
        <DataTable
          data={maintenanceTickets}
          columns={ticketColumns}
          keyExtractor={t => t.id}
          searchPlaceholder="Search maintenance tickets by number, issue, or location..."
        />
      )}

      {activeTab === 'assets' && (
        <DataTable
          data={fixedAssets}
          columns={assetColumns}
          keyExtractor={a => a.id}
          searchPlaceholder="Search asset register by tag, equipment name, or location..."
        />
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        title="Raise Engineering Maintenance Ticket"
        subtitle="Log issue and optionally block suite from reservation allocation"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
          <FormField label="Issue Title" required>
            <Input
              type="text"
              required
              value={ticketTitle}
              onChange={e => setTicketTitle(e.target.value)}
              placeholder="e.g. Jacuzzi Thermostat Calibration / Silent AC Inspection"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Related Suite (Optional)">
              <Select
                value={ticketRoomId}
                onChange={e => setTicketRoomId(e.target.value)}
                options={[
                  { value: '', label: 'General Property (No Suite)' },
                  ...rooms.map(r => ({ value: r.id, label: `Suite ${r.roomNumber} (${r.type})` }))
                ]}
              />
            </FormField>

            <FormField label="Category" required>
              <Select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value)}
                options={[
                  { value: 'HVAC & Climate', label: 'HVAC & Silent Climate' },
                  { value: 'Plumbing', label: 'Plumbing & Hydrotherapy' },
                  { value: 'Electrical', label: 'Electrical & Smart Lighting' },
                  { value: 'Carpentry & Furniture', label: 'Carpentry & Italian Furniture' },
                  { value: 'Audio/Visual', label: 'Audio / Visual & Bang & Olufsen' },
                ]}
              />
            </FormField>
          </div>

          <FormField label="Priority / Urgency" required>
            <Select
              value={ticketPriority}
              onChange={e => {
                const p = e.target.value;
                setTicketPriority(p);
                if (p === 'critical') setTicketBlocksRoom(true);
              }}
              options={[
                { value: 'low', label: 'Low — Scheduled Preventive' },
                { value: 'medium', label: 'Medium — Complete Within 24h' },
                { value: 'high', label: 'High — Immediate Attention' },
                { value: 'critical', label: 'Critical — Emergency (Blocks Suite)' },
              ]}
            />
          </FormField>

          <FormField label="Detailed Description">
            <Textarea
              rows={3}
              value={ticketDescription}
              onChange={e => setTicketDescription(e.target.value)}
              placeholder="Describe symptoms, equipment tag, and required spare parts..."
            />
          </FormField>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border dark:border-white/10">
            <input
              type="checkbox"
              id="blocksRoomCheck"
              checked={ticketBlocksRoom}
              onChange={e => setTicketBlocksRoom(e.target.checked)}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="blocksRoomCheck" className="text-xs font-semibold text-primary dark:text-white cursor-pointer">
              Block Suite from Reservation & Front Desk Allocations
            </label>
          </div>

          <ModalFooter
            onCancel={() => setIsNewTicketModalOpen(false)}
            cancelText="Cancel"
            confirmText="Dispatch Ticket"
            confirmVariant="gold"
            isSubmitting={isSubmitting}
          />
        </form>
      </Modal>

      {/* Delete Ticket Confirmation */}
      {deleteTicketId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteTicketId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Maintenance Work Order?"
          message="Are you sure you want to permanently delete this engineering work order? This action cannot be undone."
          confirmText="Confirm Delete"
          variant="danger"
        />
      )}
    </div>
  );
};

export default MaintenancePage;

