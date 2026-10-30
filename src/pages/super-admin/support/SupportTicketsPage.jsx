import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { initialSupportTickets } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  HelpCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  Search,
  Building2,
  User,
  ShieldCheck,
  Send,
  UserCheck,
} from 'lucide-react';

export const SupportTicketsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_support_tickets');
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialSupportTickets || [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const persistTickets = (list) => {
    setTickets(list);
    try {
      localStorage.setItem('lazfort_support_tickets', JSON.stringify(list));
    } catch {}
  };

  // Metrics
  const openCount = useMemo(() => tickets.filter(t => t.status === 'open').length, [tickets]);
  const inProgressCount = useMemo(() => tickets.filter(t => t.status === 'in_progress').length, [tickets]);
  const resolvedCount = useMemo(() => tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length, [tickets]);
  const slaRate = useMemo(
    () => (tickets.length > 0 ? ((resolvedCount / tickets.length) * 100).toFixed(0) : '100'),
    [resolvedCount, tickets.length]
  );

  // Filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch =
        t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.hotelName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesPri = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesStat = statusFilter === 'all' || t.status === statusFilter;

      return matchesSearch && matchesCat && matchesPri && matchesStat;
    });
  }, [tickets, searchQuery, categoryFilter, priorityFilter, statusFilter]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyTicket || !replyMessage) return;

    setTickets(prev =>
      prev.map(t =>
        t.id === replyTicket.id
          ? {
            ...t,
            status: 'in_progress',
            repliesCount: t.repliesCount + 1,
          }
          : t
      )
    );

    showToast('Reply Dispatched', `Response transmitted to ${replyTicket.clientName} on ticket ${replyTicket.ticketId}.`, 'success');
    setReplyTicket(null);
    setReplyMessage('');
  };

  const handleAssignAgent = (e) => {
    e.preventDefault();
    if (!assignTicket) return;

    setTickets(prev =>
      prev.map(t =>
        t.id === assignTicket.id
          ? {
            ...t,
            assignedAgent: newAgent,
          }
          : t
      )
    );

    showToast('Ticket Reassigned', `Ticket ${assignTicket.ticketId} assigned to ${newAgent}.`, 'info');
    setAssignTicket(null);
  };

  const columns = [
    {
      key: 'ticketId',
      header: 'Ticket ID & Subject',
      render: (t) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{t.ticketId}</span>
          <span className="font-semibold text-xs text-primary dark:text-white block mt-0.5 line-clamp-1">
            {t.subject}
          </span>
        </div>
      ),
    },
    {
      key: 'clientName',
      header: 'Property & Client',
      render: (t) => (
        <div>
          <div className="font-medium text-xs text-primary dark:text-white">{t.clientName}</div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/70" />
            <span className="line-clamp-1">{t.hotelName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category & Priority',
      render: (t) => {
        let prioColor = 'bg-accent/15 text-accent border-accent/30';
        if (t.priority === 'Critical') prioColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        if (t.priority === 'High') prioColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';

        return (
          <div>
            <span className="text-xs text-charcoal dark:text-gray-300 block font-medium">{t.category}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 ${prioColor}`}>
              {t.priority}
            </span>
          </div>
        );
      },
    },
    {
      key: 'assignedAgent',
      header: 'Assigned Specialist',
      render: (t) => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium">
          {t.assignedAgent}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (t) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/support/tickets/${t.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Ticket Dossier on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/support/tickets/${t.id}`)}
            className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
            title="Transmit Executive Reply on Dedicated Page"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/support/tickets/${t.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Reassign Specialist on Dedicated Page"
          >
            <UserCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Institutional Support Desk & Concierge SLA"
        description="Priority support tickets, platform engineering requests, and enterprise resolution audits"
      />

      <StatsGrid cols={4}>
        <StatCard
          title="Active Support Inquiries"
          value={openCount + inProgressCount}
          subtitle="live queue count"
          icon={<HelpCircle className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Awaiting Dispatch (Open)"
          value={openCount}
          subtitle="new unassigned tickets"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Resolved Lifetime"
          value={resolvedCount}
          subtitle="verified resolutions"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Executive SLA Compliance"
          value={`${slaRate}%`}
          subtitle="sub-15 minute response"
          icon={<ShieldCheck className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket ID, subject, client, or hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All Categories</option>
              <option value="Payment Gateway">Payment Gateway</option>
              <option value="Billing & Invoicing">Billing</option>
              <option value="User Permissions">Permissions</option>
              <option value="Platform Setting">Settings</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[110px]"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTickets}
          keyExtractor={(t) => t.id}
          pageSize={10}
          emptyMessage="No support tickets match current criteria."
        />
      </div>
    </div>
  );
};

export default SupportTicketsPage;

