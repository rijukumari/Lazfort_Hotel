import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { initialAnnouncements } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  Megaphone,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  Wrench,
  CheckCircle,
  Users,
} from 'lucide-react';

export const SystemAnnouncementsPage = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState(initialAnnouncements || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState('Information');
  const [formAudience, setFormAudience] = useState('All Hotel Properties');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  // Metrics
  const publishedCount = useMemo(() => announcements.filter(a => a.status === 'Published').length, [announcements]);
  const maintenanceCount = useMemo(() => announcements.filter(a => a.type === 'Maintenance').length, [announcements]);
  const urgentCount = useMemo(() => announcements.filter(a => a.type === 'Urgent' || a.type === 'Warning').length, [announcements]);

  // Filtering
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.audience.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || a.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [announcements, searchQuery, typeFilter, statusFilter]);

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!formTitle || !formMessage) {
      showToast('Validation Error', 'Title and message are required.', 'error');
      return;
    }

    const newAnn = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title: formTitle,
      message: formMessage,
      type: formType,
      audience: formAudience,
      startDate: formStartDate,
      endDate: formEndDate,
      status: 'Published',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setIsCreateModalOpen(false);
    setFormTitle('');
    setFormMessage('');
    showToast('Announcement Broadcasted', 'The announcement has been dispatched to connected consoles.', 'success');
  };

  const handleUpdateAnnouncement = (e) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    setAnnouncements(prev =>
      prev.map(a => (a.id === editingAnnouncement.id ? editingAnnouncement : a))
    );
    setEditingAnnouncement(null);
    showToast('Announcement Updated', 'Notice text and broadcasting window updated.', 'success');
  };

  const handleDeleteAnnouncement = () => {
    if (!deleteId) return;
    setAnnouncements(prev => prev.filter(a => a.id !== deleteId));
    setDeleteId(null);
    showToast('Announcement Deleted', 'Broadcast notice removed from tenant feeds.', 'info');
  };

  const columns = [
    {
      key: 'title',
      header: 'Announcement & Type',
      render: (a) => (
        <div>
          <div className="font-semibold text-xs text-primary dark:text-white flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-accent" />
            <span>{a.title}</span>
          </div>
          <span className="text-[11px] text-charcoal-muted line-clamp-1 mt-0.5">{a.message}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Classification',
      render: (a) => {
        let badgeColor = 'bg-accent/15 text-accent border-accent/30';
        if (a.type === 'Urgent') badgeColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        if (a.type === 'Maintenance') badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        if (a.type === 'Warning') badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';

        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
            {a.type}
          </span>
        );
      },
    },
    {
      key: 'audience',
      header: 'Target Audience',
      render: (a) => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium">
          {a.audience}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Broadcast Window',
      render: (a) => (
        <span className="text-xs font-mono text-charcoal-muted dark:text-gray-400">
          {a.startDate} &rarr; {a.endDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
          a.status === 'Published'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-charcoal/10 dark:bg-white/10 text-charcoal-muted'
        }`}>
          {a.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (a) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedAnnouncement(a)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditingAnnouncement(a)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Notice"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(a.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete Notice"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Platform Bulletins & System Broadcasts"
        description="Deliver real-time maintenance notices, compliance directives, and operational announcements to hotel managers"
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Bulletin</span>
          </button>
        }
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Active Broadcast Bulletins"
          value={publishedCount}
          subtitle="live on property dashboards"
          icon={<Megaphone className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Scheduled Maintenances"
          value={maintenanceCount}
          subtitle="scheduled maintenance windows"
          icon={<Wrench className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Urgent Directives"
          value={urgentCount}
          subtitle="high priority alerts"
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search announcements..."
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
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All Types</option>
              <option value="Information">Information</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Urgent">Urgent</option>
              <option value="Warning">Warning</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredAnnouncements}
          keyExtractor={(a) => a.id}
          pageSize={10}
          emptyMessage="No announcements found matching current filters."
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast System Bulletin"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase mb-1">Bulletin Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Monaco Grand Prix Security & Traffic Clearance Protocol"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="input-luxury w-full text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Bulletin Classification</label>
              <select
                value={formType}
                onChange={e => setFormType(e.target.value)}
                className="input-luxury w-full text-xs py-2"
              >
                <option value="Information">Information (Standard)</option>
                <option value="Maintenance">Scheduled Maintenance</option>
                <option value="Urgent">Urgent Directive</option>
                <option value="Warning">Compliance Warning</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Target Audience</label>
              <select
                value={formAudience}
                onChange={e => setFormAudience(e.target.value)}
                className="input-luxury w-full text-xs py-2"
              >
                <option value="All Hotel Properties">All Hotel Properties</option>
                <option value="General Managers & Front Desk">GMs & Front Desk Only</option>
                <option value="Finance & Accounting">Finance Teams Only</option>
                <option value="All Staff Members">All Staff Members</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={formStartDate}
                onChange={e => setFormStartDate(e.target.value)}
                className="input-luxury w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">End Date</label>
              <input
                type="date"
                value={formEndDate}
                onChange={e => setFormEndDate(e.target.value)}
                className="input-luxury w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase mb-1">Full Announcement Narrative *</label>
            <textarea
              rows={4}
              required
              placeholder="Type the complete bulletin text to display on property consoles..."
              value={formMessage}
              onChange={e => setFormMessage(e.target.value)}
              className="input-luxury w-full text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold"
            >
              Dispatch Broadcast
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {selectedAnnouncement && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAnnouncement(null)}
          title="System Bulletin Dossier"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border/80">
              <span className="font-mono text-[10px] text-accent font-bold uppercase">{selectedAnnouncement.type} Notice</span>
              <h4 className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                {selectedAnnouncement.title}
              </h4>
              <p className="text-charcoal-muted mt-2 leading-relaxed">{selectedAnnouncement.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Target Audience</span>
                <span className="font-semibold text-primary dark:text-white">{selectedAnnouncement.audience}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Broadcast Schedule</span>
                <span className="font-mono text-primary dark:text-white">{selectedAnnouncement.startDate} to {selectedAnnouncement.endDate}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d shadow-gold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteAnnouncement}
          title="Delete System Bulletin?"
          message="Are you sure you wish to delete this active broadcast announcement?"
          confirmText="Confirm Deletion"
          variant="danger"
        />
      )}
    </div>
  );
};

export default SystemAnnouncementsPage;

