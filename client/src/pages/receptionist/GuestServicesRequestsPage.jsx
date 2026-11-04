import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard } from '../../components/ui/StatCard';
import {
  HeartHandshake,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Sparkles,
  Crown,
  BellRing,
  BedDouble,
  User,
  Plus,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const GuestServicesRequestsPage = () => {
  const navigate = useNavigate();
  const { guests = [], bookings = [] } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Initial guest requests dataset
  const [requests, setRequests] = useState([
    {
      id: 'req-101',
      guestName: 'Baroness Charlotte von Berg',
      roomNumber: '502',
      category: 'Butler / Gastronomy',
      title: 'Chilled Vintage Krug Champagne & Beluga Caviar service',
      priority: 'high',
      status: 'in_progress',
      loggedAt: '10:15 AM',
      assignedTo: 'Jean-Luc (Royal Retinue Lead)',
    },
    {
      id: 'req-102',
      guestName: 'Lord Alistair Sterling',
      roomNumber: '801',
      category: 'Transportation',
      title: 'Rolls-Royce Phantom Chauffeur to Monaco Heliport',
      priority: 'urgent',
      status: 'pending',
      loggedAt: '10:45 AM',
      assignedTo: 'Concierge Chauffeur Fleet',
    },
    {
      id: 'req-103',
      guestName: 'Countess Elena Rostova',
      roomNumber: '404',
      category: 'Housekeeping / Wellness',
      title: 'Hypoallergenic silk bedding & eucalyptus aromatherapy setup',
      priority: 'normal',
      status: 'completed',
      loggedAt: '09:00 AM',
      assignedTo: 'Marie Dupont (Housekeeping Lead)',
    },
    {
      id: 'req-104',
      guestName: 'Prince Guillaume of Luxembourg',
      roomNumber: '901',
      category: 'Security / IT',
      title: 'Encrypted satellite connection verification in Royal Penthouse',
      priority: 'urgent',
      status: 'in_progress',
      loggedAt: '11:10 AM',
      assignedTo: 'Telecom & Security Desk',
    },
    {
      id: 'req-105',
      guestName: 'Sir Arthur Sterling',
      roomNumber: '302',
      category: 'Dining',
      title: 'Private veranda table reservation at Michelin-star Le Grand Lazfort',
      priority: 'normal',
      status: 'completed',
      loggedAt: '08:30 AM',
      assignedTo: 'Maitre D’ Reception',
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (showToast) {
      showToast('Request Updated', `Guest request #${id} marked as ${newStatus}.`, 'success');
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        !searchQuery ||
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomNumber.includes(searchQuery);

      const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchSearch && matchPriority && matchStatus;
    });
  }, [requests, searchQuery, priorityFilter, statusFilter]);

  const columns = [
    {
      key: 'id',
      header: 'Ticket Ref',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.id}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest & Chamber',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight font-serif flex items-center gap-1.5">
            {item.guestName}
          </p>
          <p className="text-[11px] text-charcoal-muted">Suite {item.roomNumber}</p>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Request Directives',
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-xs font-medium text-primary dark:text-white leading-snug">{item.title}</p>
          <p className="text-[10px] text-accent font-semibold">{item.category}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (item) => {
        const isUrgent = item.priority === 'urgent';
        const isHigh = item.priority === 'high';
        return (
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              isUrgent
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
                : isHigh
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                : 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
            }`}
          >
            {item.priority}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Fulfillment',
      sortable: true,
      render: (item) => (
        <StatusBadge status={item.status} size="sm" />
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.status !== 'completed' ? (
            <button
              onClick={() => handleStatusChange(item.id, 'completed')}
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border border-emerald-500/20 font-semibold transition-all flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Fulfill
            </button>
          ) : (
            <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Fulfilled
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Guest Requests & Butler Dispatch"
        subtitle="Live guest service tickets: concierge requirements, presidential amenities, and bespoke housekeeping orders"
        badge="Concierge Dispatch"
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Service Tickets"
          value={String(requests.filter((r) => r.status !== 'completed').length)}
          subtitle="Orders currently in progress or queued"
          icon={BellRing}
          isPositive={false}
        />
        <StatCard
          title="Urgent VIP Protocols"
          value={String(requests.filter((r) => r.priority === 'urgent').length)}
          subtitle="Priority dispatcher retinue"
          icon={Crown}
          isPositive={true}
        />
        <StatCard
          title="Fulfilled Today"
          value={String(requests.filter((r) => r.status === 'completed').length)}
          subtitle="Successfully executed guest orders"
          icon={CheckCircle}
          isPositive={true}
        />
      </div>

      {/* Search and Filters */}
      <div className="card-luxury-3d p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron, directive or suite..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-charcoal-muted">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-charcoal-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <DataTable
        data={filteredRequests}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No guest service requests found."
      />
    </div>
  );
};

export default GuestServicesRequestsPage;

