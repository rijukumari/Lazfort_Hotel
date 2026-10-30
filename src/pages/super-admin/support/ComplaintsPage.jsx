import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { initialComplaints } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Building2,
  User,
  FileText,
  UserCheck,
  Send,
  Plus,
} from 'lucide-react';

export const ComplaintsPage = () => {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState(initialComplaints || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolutionSummaryInput, setResolutionSummaryInput] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Metrics
  const pendingCount = useMemo(() => complaints.filter(c => c.status === 'pending' || c.status === 'under_review').length, [complaints]);
  const resolvedCount = useMemo(() => complaints.filter(c => c.status === 'resolved').length, [complaints]);
  const urgentCount = useMemo(() => complaints.filter(c => c.priority === 'urgent' || c.priority === 'high').length, [complaints]);

  // Filtering
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch =
        c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hotelName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
      const matchesStat = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesCat && matchesStat;
    });
  }, [complaints, searchQuery, categoryFilter, statusFilter]);

  const handleAddNote = (id) => {
    if (!newNoteInput) return;
    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? {
            ...c,
            notes: [...(c.notes || []), newNoteInput],
          }
          : c
      )
    );
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint({
        ...selectedComplaint,
        notes: [...(selectedComplaint.notes || []), newNoteInput],
      });
    }
    setNewNoteInput('');
    showToast('Investigation Note Added', 'Audit note recorded on complaint dossier.', 'info');
  };

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    if (!resolveTarget) return;

    setComplaints(prev =>
      prev.map(c =>
        c.id === resolveTarget.id
          ? {
            ...c,
            status: 'resolved',
            resolutionSummary: resolutionSummaryInput || 'Amicably resolved with guest satisfaction confirmation.',
          }
          : c
      )
    );

    showToast('Complaint Resolved', `Case ${resolveTarget.complaintId} settled.`, 'success');
    setResolveTarget(null);
    setResolutionSummaryInput('');
  };

  const handleConfirmReject = () => {
    if (!rejectTargetId) return;
    setComplaints(prev =>
      prev.map(c =>
        c.id === rejectTargetId
          ? {
            ...c,
            status: 'dismissed',
          }
          : c
      )
    );
    showToast('Case Dismissed', 'Complaint dismissed after preliminary compliance check.', 'info');
    setRejectTargetId(null);
  };

  const columns = [
    {
      key: 'complaintId',
      header: 'Complaint & Nature',
      render: (c) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{c.complaintId}</span>
          <span className="font-semibold text-xs text-primary dark:text-white block mt-0.5 line-clamp-1">
            {c.title}
          </span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Complainant & Property',
      render: (c) => (
        <div>
          <div className="font-medium text-xs text-primary dark:text-white flex items-center gap-1">
            <User className="w-3 h-3 text-accent" />
            <span>{c.customerName}</span>
          </div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/70" />
            <span className="line-clamp-1">{c.hotelName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Department Category',
      render: (c) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-[11px]">
          {c.category}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Severity',
      render: (c) => {
        let prioColor = 'bg-accent/15 text-accent border-accent/30';
        if (c.priority === 'urgent') prioColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        if (c.priority === 'high') prioColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';

        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${prioColor}`}>
            {c.priority}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedComplaint(c)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {c.status !== 'resolved' && (
            <button
              onClick={() => setResolveTarget(c)}
              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
              title="Resolve Complaint"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {c.status !== 'dismissed' && (
            <button
              onClick={() => setRejectTargetId(c.id)}
              className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
              title="Dismiss Complaint"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Guest Grievance & Complaint Arbitration"
        description="Executive arbitration tribunal for luxury guest disputes, service lapses, and formal compensation claims"
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Active Investigations"
          value={pendingCount}
          subtitle="under executive audit"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Amicably Resolved"
          value={resolvedCount}
          subtitle="100% goodwill maintained"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="High Severity Grievances"
          value={urgentCount}
          subtitle="direct GM escalation"
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search complaints by ID, guest, hotel, or subject..."
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
              <option value="all">All Departments</option>
              <option value="Billing & Charges">Billing & Charges</option>
              <option value="Suite Noise / Acoustics">Suite Acoustics</option>
              <option value="Housekeeping Standard">Housekeeping</option>
              <option value="Dining & Sommelier">Dining</option>
              <option value="Butler Response SLA">Butler SLA</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredComplaints}
          keyExtractor={(c) => c.id}
          pageSize={10}
          emptyMessage="No grievances matching filter criteria."
        />
      </div>

      {/* View Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedComplaint(null)}
          title={`Grievance Dossier: ${selectedComplaint.complaintId}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border/80">
              <span className="font-mono text-[10px] text-accent font-bold uppercase">{selectedComplaint.category} • {selectedComplaint.priority}</span>
              <h4 className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                {selectedComplaint.title}
              </h4>
              <p className="text-charcoal-muted mt-2 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Complainant</span>
                <span className="font-semibold text-primary dark:text-white">{selectedComplaint.customerName}</span>
                <span className="text-[10px] text-charcoal-muted block">{selectedComplaint.hotelName}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Current Status</span>
                <StatusBadge status={selectedComplaint.status} size="sm" />
              </div>
            </div>

            {/* Notes Log */}
            <div className="space-y-2">
              <span className="font-bold text-primary dark:text-white uppercase tracking-wider text-[10px] block">
                Investigation Audit Trail
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedComplaint.notes?.map((n, i) => (
                  <div key={i} className="p-2 rounded-xl bg-ivory/50 dark:bg-primary-900/30 border border-border/50 text-[11px]">
                    {n}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Append confidential investigation note..."
                  value={newNoteInput}
                  onChange={e => setNewNoteInput(e.target.value)}
                  className="input-luxury flex-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(selectedComplaint.id)}
                  className="px-3 py-1.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d"
                >
                  Post Note
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resolve Modal */}
      {resolveTarget && (
        <Modal
          isOpen={true}
          onClose={() => setResolveTarget(null)}
          title={`Resolve Grievance: ${resolveTarget.complaintId}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmResolve} className="space-y-4 text-xs">
            <p className="text-charcoal-muted">
              Confirm settlement for <strong>{resolveTarget.customerName}</strong> regarding "{resolveTarget.title}".
            </p>
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Settlement & Compensation Narrative</label>
              <textarea
                rows={3}
                required
                value={resolutionSummaryInput}
                onChange={e => setResolutionSummaryInput(e.target.value)}
                placeholder="e.g. Authorized $500 spa credit and personal apology letter from GM..."
                className="input-luxury w-full text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolveTarget(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Dismiss Confirmation */}
      {rejectTargetId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setRejectTargetId(null)}
          onConfirm={handleConfirmReject}
          title="Dismiss Guest Complaint?"
          message="Are you sure you wish to mark this complaint as dismissed without compensation?"
          confirmText="Confirm Dismissal"
          variant="danger"
        />
      )}
    </div>
  );
};

export default ComplaintsPage;

