import React, { useState, useMemo } from 'react';
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
  const { showToast } = useToast();
  const [tickets, setTickets] = useState(initialSupportTickets || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyTicket, setReplyTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [assignTicket, setAssignTicket] = useState(null);
  const [newAgent, setNewAgent] = useState('Alexander Cross (Senior Fintech Engineer)');

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
            onClick={() => setSelectedTicket(t)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Ticket Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setReplyTicket(t)}
            className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
            title="Transmit Executive Reply"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAssignTicket(t)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Reassign Specialist"
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

      {/* View Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          title={`Support Dossier: ${selectedTicket.ticketId}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border/80">
              <span className="font-mono text-[10px] text-accent font-bold uppercase">{selectedTicket.category} • {selectedTicket.priority} Priority</span>
              <h4 className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                {selectedTicket.subject}
              </h4>
              <p className="text-charcoal-muted mt-2 leading-relaxed">{selectedTicket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Client Beneficiary</span>
                <span className="font-semibold text-primary dark:text-white">{selectedTicket.clientName}</span>
                <span className="text-[10px] text-charcoal-muted block">{selectedTicket.hotelName}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Assigned Engineer</span>
                <span className="font-semibold text-primary dark:text-white">{selectedTicket.assignedAgent}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d shadow-gold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reply Modal */}
      {replyTicket && (
        <Modal
          isOpen={true}
          onClose={() => setReplyTicket(null)}
          title={`Transmit Executive Reply: ${replyTicket.ticketId}`}
          maxWidth="md"
        >
          <form onSubmit={handleSendReply} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-ivory dark:bg-primary-900/40 border border-border/60">
              <span className="font-semibold text-primary dark:text-white block">{replyTicket.subject}</span>
              <span className="text-[11px] text-charcoal-muted">To: {replyTicket.clientName} ({replyTicket.hotelName})</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Executive Response Narrative</label>
              <textarea
                rows={4}
                required
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Type response to client..."
                className="input-luxury w-full text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setReplyTicket(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Response</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reassign Modal */}
      {assignTicket && (
        <Modal
          isOpen={true}
          onClose={() => setAssignTicket(null)}
          title={`Reassign Specialist: ${assignTicket.ticketId}`}
          maxWidth="md"
        >
          <form onSubmit={handleAssignAgent} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Select Tier-2 Specialist Engineer</label>
              <select
                value={newAgent}
                onChange={e => setNewAgent(e.target.value)}
                className="input-luxury w-full text-xs py-2"
              >
                <option value="Alexander Cross (Senior Fintech Engineer)">Alexander Cross (Senior Fintech Engineer)</option>
                <option value="Vivienne Moreau (Head of Protocol)">Vivienne Moreau (Head of Protocol)</option>
                <option value="Marcus Sterling (Lead Infrastructure Architect)">Marcus Sterling (Lead Infrastructure Architect)</option>
                <option value="Elena Rostova (Compliance & Auditing Lead)">Elena Rostova (Compliance & Auditing Lead)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignTicket(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
              >
                Update Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SupportTicketsPage;

