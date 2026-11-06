import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge, Modal } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
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
  ArrowRight,
  Eye,
  CheckSquare
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const MaintenanceRequestsPage = () => {
  const navigate = useNavigate();
  const { maintenanceTickets: allTickets = [], updateMaintenanceTicket } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filteredTickets = useMemo(() => {
    return allTickets.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q) ||
        t.title?.toLowerCase().includes(q) ||
        t.roomNumber?.toString().includes(q) ||
        t.assignedStaffName?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [allTickets, searchQuery, statusFilter, priorityFilter]);

  const handleResolveTicket = (ticket) => {
    updateMaintenanceTicket(ticket.id, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    });
    showToast('Work Order Resolved', `Ticket ${ticket.ticketNumber || ticket.id} marked as rectified.`, 'success');
  };

  const columns = [
    {
      key: 'ticketNumber',
      header: 'Request Ref',
      render: (t) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">
            {t.ticketNumber || t.id || 'MT-8801'}
          </span>
          <span className="text-[10px] block text-charcoal-muted dark:text-gray-400">
            {t.category || 'General Repair'}
          </span>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Suite / Location',
      render: (t) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <BedDouble className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-serif font-bold text-xs text-primary dark:text-white block">
              Suite {t.roomNumber || 'Counter'}
            </span>
            <span className="text-[10px] text-charcoal-muted dark:text-gray-400">
              {t.location || 'Palace Wing'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Issue Summary',
      render: (t) => (
        <div className="max-w-xs">
          <p className="font-medium text-xs text-primary dark:text-white truncate">
            {t.title || t.issue || 'Maintenance issue reported'}
          </p>
          {t.description && (
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400 truncate">
              {t.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => (
        <StatusBadge
          status={t.priority === 'critical' || t.priority === 'urgent' ? 'cancelled' : t.priority === 'high' ? 'pending' : 'completed'}
          label={t.priority ? t.priority.toUpperCase() : 'NORMAL'}
        />
      ),
    },
    {
      key: 'assignedStaffName',
      header: 'Assigned Engineer',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-xs text-charcoal dark:text-gray-300">
          <User className="w-3.5 h-3.5 text-accent" />
          <span>{t.assignedStaffName || t.assignedTo || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <StatusBadge
          status={t.status === 'resolved' || t.status === 'completed' ? 'completed' : t.status === 'in_progress' ? 'pending' : 'cancelled'}
          label={t.status === 'in_progress' ? 'Under Repair' : t.status === 'resolved' || t.status === 'completed' ? 'Resolved' : 'Open Ticket'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedTicket(t)}
          >
            View
          </Button>
          {t.status !== 'resolved' && t.status !== 'completed' && (
            <Button
              variant="outline"
              size="xs"
              icon={CheckCircle2}
              onClick={() => handleResolveTicket(t)}
            >
              Rectify
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Requests & Work Orders"
        subtitle="Live registry of open maintenance work orders, room deficiencies, and engineering tickets reported during housekeeping."
        icon={Wrench}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Clock}
              onClick={() => navigate('/housekeeping/maintenance/history')}
            >
              Maintenance History
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/housekeeping/maintenance/report')}
            >
              Report New Issue
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Open Requests"
          value={filteredTickets.filter(t => t.status !== 'resolved' && t.status !== 'completed').length}
          subtitle="Active work orders pending"
          icon={Wrench}
        />
        <StatCard
          title="Critical / High Priority"
          value={filteredTickets.filter(t => (t.priority === 'critical' || t.priority === 'high') && t.status !== 'resolved').length}
          subtitle="Suites blocked or urgent"
          icon={AlertTriangle}
        />
        <StatCard
          title="Under Active Repair"
          value={filteredTickets.filter(t => t.status === 'in_progress').length}
          subtitle="Technicians currently on site"
          icon={Clock}
        />
        <StatCard
          title="Resolved Today"
          value={filteredTickets.filter(t => t.status === 'resolved' || t.status === 'completed').length}
          subtitle="Chambers returned to inventory"
          icon={CheckCircle2}
        />
      </div>

      {/* Filters and Table */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by ticket, suite, engineer, issue..."
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
              <option value="all">All Ticket Statuses</option>
              <option value="open">Open Requests</option>
              <option value="in_progress">Under Repair</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical / Out of Order</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTickets}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No maintenance requests match the current filters."
        />
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Work Order • ${selectedTicket.ticketNumber || selectedTicket.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Suite Location:</span>
                <span className="font-bold text-primary dark:text-white">Suite {selectedTicket.roomNumber} ({selectedTicket.location || 'Palace Wing'})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Category:</span>
                <span className="text-primary dark:text-white font-medium">{selectedTicket.category || 'General Repair'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Priority Level:</span>
                <span className="text-amber-400 font-bold uppercase">{selectedTicket.priority || 'Normal'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Assigned Technician:</span>
                <span className="text-primary dark:text-white font-medium">{selectedTicket.assignedStaffName || selectedTicket.assignedTo || 'Unassigned'}</span>
              </div>
              <div className="pt-2 border-t border-primary/10 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400 block mb-1">Issue Description:</span>
                <p className="text-primary dark:text-white italic">{selectedTicket.description || selectedTicket.title}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MaintenanceRequestsPage;

