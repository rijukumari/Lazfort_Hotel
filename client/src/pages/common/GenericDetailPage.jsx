import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Edit2,
  Plus,
  Sliders,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Trash2,
  Save,
  Send
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const GenericDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mode: 'list' | 'edit' | 'config'
  const [viewMode, setViewMode] = useState('list');

  // Extract page title and section from route path
  const segments = location.pathname.split('/').filter(Boolean);
  const rawTitle = segments[segments.length - 1] || 'Dashboard Detail';
  const pageTitle = rawTitle
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const sectionCategory = segments[1]
    ? segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Hotel Operations';

  // Active records state
  const [records, setRecords] = useState([
    {
      id: 'REC-01',
      title: `${pageTitle} Standard Protocol Specification`,
      category: sectionCategory,
      updated: '10 mins ago',
      status: 'Active & Verified',
      author: 'General Management',
      notes: 'Standard operating procedure specifications, mandatory attendance audit protocols, and biometric verification parameters.',
      effectiveDate: '2026-10-01',
    },
    {
      id: 'REC-02',
      title: `${pageTitle} Sovereign Quality Standard Audit`,
      category: 'Compliance',
      updated: '2 hours ago',
      status: 'Passed (100%)',
      author: 'General Management',
      notes: 'Annual hospitality regulatory and quality benchmark audit verified with zero discrepancies.',
      effectiveDate: '2026-09-15',
    },
    {
      id: 'REC-03',
      title: `${pageTitle} Executive Escalation Matrix`,
      category: 'Governance',
      updated: 'Yesterday',
      status: 'Enabled',
      author: 'General Management',
      notes: 'Automated notification and escalation hierarchy for unexcused duty anomalies or supervisor notifications.',
      effectiveDate: '2026-08-01',
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    status: 'Active & Verified',
    author: 'General Management',
    notes: '',
    effectiveDate: '',
  });

  const [configSettings, setConfigSettings] = useState({
    autoSync: true,
    telemetryLogging: true,
    enforcementMode: 'Strict Luxury Standard',
    notificationEmail: 'management@lazforthotel.com',
  });

  // Open Edit Form Page
  const handleOpenEdit = (record) => {
    setSelectedRecord(record);
    setEditFormData({
      title: record.title,
      category: record.category,
      status: record.status,
      author: record.author || 'General Management',
      notes: record.notes || '',
      effectiveDate: record.effectiveDate || new Date().toISOString().split('T')[0],
    });
    setViewMode('edit');
  };

  // Open Create Form Page
  const handleOpenCreate = () => {
    const newId = `REC-${String(records.length + 1).padStart(2, '0')}`;
    setSelectedRecord({ id: newId, isNew: true });
    setEditFormData({
      title: `${pageTitle} Operational Guideline ${records.length + 1}`,
      category: sectionCategory,
      status: 'Active & Verified',
      author: 'General Management',
      notes: '',
      effectiveDate: new Date().toISOString().split('T')[0],
    });
    setViewMode('edit');
  };

  // Save Edit Form
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    if (selectedRecord.isNew) {
      const newEntry = {
        id: selectedRecord.id,
        title: editFormData.title,
        category: editFormData.category,
        status: editFormData.status,
        author: editFormData.author,
        notes: editFormData.notes,
        effectiveDate: editFormData.effectiveDate,
        updated: 'Just now',
      };
      setRecords(prev => [newEntry, ...prev]);
      showToast(
        'Specification Created',
        `New record ${newEntry.id} added to ${pageTitle}.`,
        'success'
      );
    } else {
      setRecords(prev =>
        prev.map(r =>
          r.id === selectedRecord.id
            ? {
              ...r,
              title: editFormData.title,
              category: editFormData.category,
              status: editFormData.status,
              author: editFormData.author,
              notes: editFormData.notes,
              effectiveDate: editFormData.effectiveDate,
              updated: 'Just now',
            }
            : r
        )
      );
      showToast(
        'Specification Updated',
        `Changes saved for ${selectedRecord.id} (${editFormData.title}).`,
        'success'
      );
    }

    setViewMode('list');
    setSelectedRecord(null);
  };

  const handleDeleteRecord = (recordId) => {
    setRecords(prev => prev.filter(r => r.id !== recordId));
    showToast('Record Removed', `Specification ${recordId} removed from registry.`, 'info');
  };

  const handleSaveGlobalConfig = (e) => {
    e.preventDefault();
    setViewMode('list');
    showToast(
      'Configuration Saved',
      `Master parameters for ${pageTitle} updated and synchronized with PMS.`,
      'success'
    );
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active & Verified':
      case 'Passed (100%)':
      case 'Enabled':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20';
      case 'Pending Review':
      case 'Draft':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-500/20';
      case 'Suspended':
      case 'Disabled':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-500/20';
      default:
        return 'bg-accent/15 text-accent border border-accent/30';
    }
  };

  // FULL PAGE VIEW: EDIT / CREATE SPECIFICATION
  if (viewMode === 'edit') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title={selectedRecord?.isNew ? `Add New ${pageTitle} Specification` : `Edit Specification — ${selectedRecord?.id}`}
          description={`Update parameters, compliance rules, and audit status for this ${sectionCategory.toLowerCase()} record.`}
          badge="Specification Editor"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Specifications
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Specification Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Saved changes are validated against luxury hotel operational specifications.
              </p>
            </div>
            <span className="font-mono text-xs text-accent font-semibold px-3 py-1 rounded-xl bg-accent/15 border border-accent/30">
              {selectedRecord?.id || 'NEW'}
            </span>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Specification Title / Name
              </label>
              <input
                type="text"
                value={editFormData.title}
                onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Category / Division
                </label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Audit / Compliance Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Active & Verified">Active & Verified</option>
                  <option value="Passed (100%)">Passed (100%)</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Draft">Draft</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Authorizing Authority
                </label>
                <input
                  type="text"
                  value={editFormData.author}
                  onChange={e => setEditFormData({ ...editFormData, author: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Effective Compliance Date
                </label>
                <input
                  type="date"
                  value={editFormData.effectiveDate}
                  onChange={e => setEditFormData({ ...editFormData, effectiveDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Operational Directives & Protocol Guidelines
              </label>
              <textarea
                value={editFormData.notes}
                onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })}
                rows={6}
                placeholder="Enter mandatory protocol specifications or operational rules..."
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80 dark:border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Changes apply instantly across PMS telemetry
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <Save className="w-4 h-4" />
                  Save Specification Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // FULL PAGE VIEW: MASTER CONFIGURATION
  if (viewMode === 'config') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title={`${pageTitle} Master Policy Configuration`}
          description="Adjust global policy enforcement and telemetry parameters."
          badge="Policy Management"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Specifications
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSaveGlobalConfig} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Enforcement Standard
              </label>
              <select
                value={configSettings.enforcementMode}
                onChange={e => setConfigSettings({ ...configSettings, enforcementMode: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
              >
                <option value="Strict Luxury Standard">Strict Luxury Standard (Sovereign)</option>
                <option value="Standard Operations">Standard Operations</option>
                <option value="Advisory Only">Advisory Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Notification & Escalation Email
              </label>
              <input
                type="email"
                value={configSettings.notificationEmail}
                onChange={e => setConfigSettings({ ...configSettings, notificationEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 text-xs text-primary dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={configSettings.autoSync}
                  onChange={e => setConfigSettings({ ...configSettings, autoSync: e.target.checked })}
                  className="rounded border-gray-400 text-accent focus:ring-accent"
                />
                <span>Enable Real-Time Telemetry Synchronization with PMS</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-primary dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={configSettings.telemetryLogging}
                  onChange={e => setConfigSettings({ ...configSettings, telemetryLogging: e.target.checked })}
                  className="rounded border-gray-400 text-accent focus:ring-accent"
                />
                <span>Log Executive Audit Trails for Compliance Reviews</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
              >
                <Save className="w-4 h-4" />
                Apply & Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: SPECIFICATIONS LIST
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title={pageTitle}
        description={`Dedicated luxury control panel for ${pageTitle.toLowerCase()} under the ${sectionCategory} division.`}
        badge="Live System Endpoint"
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <button
              type="button"
              onClick={() => setViewMode('config')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <StatsGrid columns={3}>
        <StatCard
          title="Operational Status"
          value="Optimal"
          change="Real-time telemetry"
          isPositive={true}
          iconName="Sparkles"
        />
        <StatCard
          title="Active Records"
          value={`${records.length} Entries`}
          change="Synced with PMS"
          isPositive={true}
          iconName="Sliders"
        />
        <StatCard
          title="Last Synchronized"
          value="Just now"
          change="Automated Backup"
          isPositive={true}
          iconName="Clock"
        />
      </StatsGrid>

      {/* Configuration & Records Box */}
      <div className="card-luxury-3d p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70 dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
              {pageTitle} Specifications & Records
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Configure parameters, rules, and view audit records for this module.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-3.5 py-1.5 text-xs bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold shadow-sm btn-3d"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Record
            </button>
            <button
              type="button"
              onClick={() => showToast('Refreshed', 'Telemetry reloaded.', 'info')}
              className="p-1.5 rounded-xl border border-border dark:border-border-dark hover:bg-ivory dark:hover:bg-primary-800 text-charcoal-muted hover:text-charcoal dark:hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Record Cards */}
        <div className="space-y-3">
          {records
            .filter(r =>
              r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              r.status.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(record => (
              <div
                key={record.id}
                className="p-4 sm:p-5 rounded-2xl bg-ivory/50 dark:bg-primary-900/40 border border-border/60 dark:border-border-dark/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent/40 transition-all duration-200"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider">
                      {record.id} • {record.category}
                    </span>
                    <span className="text-gray-400 text-[10px]">•</span>
                    <span className="text-[10px] font-mono text-charcoal-muted dark:text-gray-400">
                      Effective: {record.effectiveDate}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs sm:text-sm text-primary dark:text-white">
                    {record.title}
                  </h4>

                  {record.notes && (
                    <p className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-1">
                      {record.notes}
                    </p>
                  )}

                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    Last modified {record.updated} by {record.author || 'General Management'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${getStatusBadgeStyle(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>

                  {/* EDIT BUTTON: Opens the Full Page Editor */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(record)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-accent/40 text-xs text-accent hover:bg-accent/15 font-semibold transition-all shadow-sm active:scale-95"
                    title={`Edit ${record.title}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(record.id)}
                    className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete specification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GenericDetailPage;
