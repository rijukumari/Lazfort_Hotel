import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea, ViewToggle } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { useERP } from '../../../context/ERPContext';
import { useAuth } from '../../../context/AuthContext';
import { hotelApi } from '../../../services/hotelApi';
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
  Plus,
  RotateCcw,
  Check,
  Lock,
} from 'lucide-react';

export const SupportTicketsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hotels = [] } = useERP();
  const { user, isSuperAdmin } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_tickets') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_tickets', mode);
    } catch {}
  };

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Payment Gateway');
  const [newPriority, setNewPriority] = useState('medium');
  const [newHotelId, setNewHotelId] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');

  // Load from MySQL
  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const res = await hotelApi.getSupportTickets();
      if (Array.isArray(res)) {
        setTickets(res);
      }
    } catch (err) {
      console.warn('[SupportTicketsPage] Error fetching tickets from MySQL:', err);
      showToast('Data Sync Notice', 'Unable to retrieve tickets from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Quick Status Toggle (Close / Reopen) directly in table
  const handleToggleStatus = async (ticket) => {
    const nextStatus = (ticket.status === 'resolved' || ticket.status === 'closed') ? 'open' : 'resolved';
    try {
      await hotelApi.updateSupportTicket(ticket.id, { status: nextStatus });
      setTickets(prev =>
        prev.map(t => (t.id === ticket.id ? { ...t, status: nextStatus } : t))
      );
      showToast(
        nextStatus === 'resolved' ? 'Ticket Closed' : 'Ticket Reopened',
        `Ticket ${ticket.ticket_id || ticket.ticketId || ticket.id} marked as ${nextStatus}.`,
        'success'
      );
    } catch (err) {
      showToast('Update Failed', err.message || 'Could not change ticket status.', 'error');
    }
  };

  // Submit New Ticket to MySQL
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      showToast('Validation Error', 'Please enter subject and description.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedHotel = hotels.find(h => h.id === newHotelId) || hotels[0];
      const payload = {
        subject: newSubject.trim(),
        category: newCategory,
        priority: newPriority,
        hotelId: selectedHotel?.id || null,
        hotelName: selectedHotel?.name || 'Lazfort Sovereign Portfolio',
        clientName: user?.name || 'Executive Client',
        userId: user?.id || null,
        description: newDescription.trim(),
        assignedAgent: 'Alexander Cross (Senior Fintech Engineer)',
        status: 'open',
      };

      const created = await hotelApi.createSupportTicket(payload);
      setTickets(prev => [created, ...prev]);
      showToast('Support Ticket Raised', `Ticket #${created.ticket_id || created.ticketId} logged in MySQL.`, 'success');
      setIsCreateModalOpen(false);
      setNewSubject('');
      setNewDescription('');
    } catch (err) {
      showToast('Creation Failed', err.message || 'Unable to save support ticket.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
      const tId = (t.ticket_id || t.ticketId || t.id || '').toLowerCase();
      const tSubject = (t.subject || '').toLowerCase();
      const tClient = (t.client_name || t.clientName || '').toLowerCase();
      const tHotel = (t.hotel_name || t.hotelName || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch = !q || tId.includes(q) || tSubject.includes(q) || tClient.includes(q) || tHotel.includes(q);
      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesPri = priorityFilter === 'all' || (t.priority || '').toLowerCase() === priorityFilter.toLowerCase();
      const matchesStat = statusFilter === 'all' || t.status === statusFilter;
      const matchesHotel = hotelFilter === 'all' || t.hotel_id === hotelFilter || t.hotelId === hotelFilter;

      return matchesSearch && matchesCat && matchesPri && matchesStat && matchesHotel;
    });
  }, [tickets, searchQuery, categoryFilter, priorityFilter, statusFilter, hotelFilter]);

  const columns = [
    {
      key: 'ticketId',
      header: 'Ticket ID & Subject',
      render: (t) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{t.ticket_id || t.ticketId || t.id}</span>
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
          <div className="font-medium text-xs text-primary dark:text-white">{t.client_name || t.clientName || 'Guest'}</div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/70" />
            <span className="line-clamp-1">{t.hotel_name || t.hotelName || 'Sovereign Property'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category & Priority',
      render: (t) => {
        const prio = (t.priority || 'medium').toLowerCase();
        let prioColor = 'bg-accent/15 text-accent border-accent/30';
        if (prio === 'critical') prioColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        if (prio === 'high') prioColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';

        return (
          <div>
            <span className="text-xs text-charcoal dark:text-gray-300 block font-medium">{t.category}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 uppercase ${prioColor}`}>
              {t.priority || 'medium'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'assignedAgent',
      header: 'Assigned Specialist',
      render: (t) => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium line-clamp-1">
          {t.assigned_agent || t.assignedAgent || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status || 'open'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (t) => {
        const isClosed = t.status === 'resolved' || t.status === 'closed';
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate(`/super-admin/support/tickets/${t.id || t.ticket_id}`)}
              className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
              title="Inspect Ticket Details & Conversation"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate(`/super-admin/support/tickets/${t.id || t.ticket_id}`)}
              className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
              title="Reply to Ticket"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleToggleStatus(t)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isClosed
                  ? 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                  : 'border-charcoal-muted/30 text-charcoal-muted hover:text-rose-500 hover:border-rose-500/30'
              }`}
              title={isClosed ? 'Reopen Ticket' : 'Close Ticket'}
            >
              {isClosed ? <RotateCcw className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Institutional Support Desk & Concierge SLA"
        description="Priority support tickets, platform engineering requests, and enterprise resolution audits"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Ticket
          </Button>
        }
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
        {/* Controls Bar: Search, Filters, and Grid/List Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

          <div className="flex flex-wrap items-center gap-2 text-xs">
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
              <option value="General Inquiries">General</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[110px]"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[110px]"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* Grid vs List View Toggle (Zero additional API calls) */}
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} className="ml-auto" />
          </div>
        </div>

        {/* View Mode Switching using IDENTICAL backend data */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-charcoal-muted">
            <span className="animate-pulse">Retrieving active tickets from MySQL...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-xs text-charcoal-muted">
            No support tickets match current criteria.
          </div>
        ) : viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={filteredTickets}
            keyExtractor={(t) => t.id || t.ticket_id}
            showSearch={false}
            pageSize={10}
            emptyMessage="No support tickets match current criteria."
          />
        ) : (
          /* Grid View Representation */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
            {filteredTickets.map((t) => {
              const isClosed = t.status === 'resolved' || t.status === 'closed';
              const prio = (t.priority || 'medium').toLowerCase();
              let prioColor = 'bg-accent/15 text-accent border-accent/30';
              if (prio === 'critical') prioColor = 'bg-rose-500/15 text-rose-600 border-rose-500/30';
              if (prio === 'high') prioColor = 'bg-amber-500/15 text-amber-600 border-amber-500/30';

              return (
                <div
                  key={t.id || t.ticket_id}
                  className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-3 flex flex-col justify-between hover:border-accent/40 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-accent">
                        {t.ticket_id || t.ticketId || t.id}
                      </span>
                      <StatusBadge status={t.status || 'open'} />
                    </div>

                    <h4 className="font-serif font-bold text-sm text-primary dark:text-white line-clamp-1 group-hover:text-accent transition-colors">
                      {t.subject}
                    </h4>

                    <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                      {t.description || 'No detailed issue statement provided.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 dark:border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-accent" />
                        <span className="truncate max-w-[130px]">{t.hotel_name || t.hotelName || 'Property'}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${prioColor}`}>
                        {t.priority || 'medium'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-charcoal-muted truncate max-w-[140px]">
                        By: <strong className="text-primary dark:text-white">{t.client_name || t.clientName || 'Guest'}</strong>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(t)}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            isClosed
                              ? 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                              : 'border-border dark:border-white/10 text-charcoal-muted hover:text-rose-500'
                          }`}
                          title={isClosed ? 'Reopen Ticket' : 'Close Ticket'}
                        >
                          {isClosed ? <RotateCcw className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => navigate(`/super-admin/support/tickets/${t.id || t.ticket_id}`)}
                          className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent font-semibold text-xs hover:bg-accent/20 transition-colors flex items-center gap-1"
                        >
                          <span>Open</span>
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Raise Institutional Support Ticket"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <FormField label="Subject Summary" required>
            <Input
              type="text"
              placeholder="E.g., Payment Gateway Settlement Discrepancy"
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category" required>
              <Select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="Billing & Invoicing">Billing & Invoicing</option>
                <option value="User Permissions">User Permissions</option>
                <option value="Platform Setting">Platform Setting</option>
                <option value="General Inquiries">General Inquiries</option>
              </Select>
            </FormField>

            <FormField label="Priority" required>
              <Select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Associated Hotel / Resort Property">
            <Select value={newHotelId} onChange={e => setNewHotelId(e.target.value)}>
              <option value="">Consolidated Sovereign Platform</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.location || 'Resort'})
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Detailed Issue Statement" required>
            <Textarea
              rows={4}
              placeholder="State the technical error, transaction reference, or operational difficulty..."
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              required
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/60 dark:border-white/10">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              icon={Send}
              loading={isSubmitting}
            >
              Commit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportTicketsPage;
