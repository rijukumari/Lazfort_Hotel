import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { initialContactRequests } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  UserCheck,
  Send,
  Clock,
  Briefcase,
} from 'lucide-react';

export const ContactRequestsPage = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_contact_requests');
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialContactRequests || [];
  });

  const persistRequests = (list) => {
    setRequests(list);
    try {
      localStorage.setItem('lazfort_contact_requests', JSON.stringify(list));
    } catch {}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notesTarget, setNotesTarget] = useState(null);
  const [followUpNoteInput, setFollowUpNoteInput] = useState('');

  // Metrics
  const newCount = useMemo(() => requests.filter(r => r.status === 'new').length, [requests]);
  const licensingCount = useMemo(() => requests.filter(r => r.inquiryType === 'Enterprise Licensing').length, [requests]);
  const completedCount = useMemo(() => requests.filter(r => r.status === 'completed').length, [requests]);

  // Filtering
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch =
        r.requestId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.companyOrHotel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.message?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || r.inquiryType === typeFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [requests, searchQuery, typeFilter, statusFilter]);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = requests.map(r => (r.id === id ? { ...r, status: newStatus } : r));
    persistRequests(updated);
    showToast('Inquiry Updated', `Status changed to ${newStatus}.`, 'success');
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (!notesTarget) return;

    const updated = requests.map(r =>
      r.id === notesTarget.id
        ? {
            ...r,
            status: 'in_progress',
            followUpNotes: followUpNoteInput,
          }
        : r
    );
    persistRequests(updated);

    showToast('Follow-up Logged', 'Sales consultation notes saved to lead file.', 'info');
    setNotesTarget(null);
    setFollowUpNoteInput('');
  };

  const columns = [
    {
      key: 'requestId',
      header: 'Request ID & Date',
      render: (r) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent block">{r.requestId}</span>
          <span className="text-[10px] text-charcoal-muted font-mono">{r.receivedDate}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Prospective Client & Entity',
      render: (r) => (
        <div>
          <span className="font-semibold text-xs text-primary dark:text-white block">{r.name}</span>
          <span className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/70" />
            <span className="line-clamp-1">{r.companyOrHotel}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'inquiryType',
      header: 'Nature of Inquiry',
      render: (r) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-[11px]">
          {r.inquiryType}
        </span>
      ),
    },
    {
      key: 'message',
      header: 'Message Narrative',
      render: (r) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-1 max-w-[220px]" title={r.message}>
          {r.message}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedRequest(r)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setNotesTarget(r)}
            className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
            title="Log Consultation Notes"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Enterprise Inquiries & VIP Contact Requests"
        description="Prospective sovereign hotel onboarding leads, multi-property licensing inquiries, and executive demos"
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Fresh Lead Submissions"
          value={newCount}
          subtitle="awaiting outreach"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Enterprise Licensing Proposals"
          value={licensingCount}
          subtitle="high-value potential"
          icon={<Briefcase className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Closed Inquiries"
          value={completedCount}
          subtitle="successfully onboarded"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, entity, email or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Inquiry Types</option>
              <option value="Enterprise Licensing">Enterprise Licensing</option>
              <option value="Platform Demo">Platform Demo</option>
              <option value="Custom Integration">Custom Integration</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredRequests}
          keyExtractor={(r) => r.id}
          pageSize={10}
          emptyMessage="No prospective requests matching filter criteria."
        />
      </div>

      {/* View Modal */}
      {selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          title={`Lead Dossier: ${selectedRequest.requestId}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border/80">
              <span className="font-mono text-[10px] text-accent font-bold uppercase">{selectedRequest.inquiryType}</span>
              <h4 className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                {selectedRequest.companyOrHotel}
              </h4>
              <p className="text-charcoal-muted mt-2 leading-relaxed italic">"{selectedRequest.message}"</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Direct Contact</span>
                <span className="font-semibold text-primary dark:text-white">{selectedRequest.name}</span>
                <span className="text-[11px] text-charcoal-muted block">{selectedRequest.email}</span>
                <span className="text-[11px] text-charcoal-muted block font-mono">{selectedRequest.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Current Status</span>
                <div className="pt-1">
                  <StatusBadge status={selectedRequest.status} size="sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d shadow-gold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Notes Modal */}
      {notesTarget && (
        <Modal
          isOpen={true}
          onClose={() => setNotesTarget(null)}
          title={`Log Consultation Notes: ${notesTarget.requestId}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveNotes} className="space-y-4 text-xs">
            <p className="text-charcoal-muted">
              Add private sales consultation or executive follow-up notes for <strong>{notesTarget.name}</strong> ({notesTarget.companyOrHotel}).
            </p>
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Internal Consultation Narrative</label>
              <textarea
                rows={4}
                required
                value={followUpNoteInput}
                onChange={e => setFollowUpNoteInput(e.target.value)}
                placeholder="e.g. Conducted preliminary demo with GM Lord Sterling. Follow up with contract proposal..."
                className="input-luxury w-full text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNotesTarget(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
              >
                Save to Lead File
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ContactRequestsPage;

