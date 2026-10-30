import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Terminal,
  Layers,
} from 'lucide-react';

const mockAuditLogs = [
  {
    id: 'log-01',
    eventId: 'EVT-2026-9041',
    timestamp: '2026-10-28 19:42:15',
    user: 'Lord Alistair Sterling',
    role: 'Super Admin',
    action: 'Commit Platform Settings',
    module: 'Platform Core',
    ipAddress: '194.199.110.12 (Monaco)',
    result: 'Success',
    details: 'Modified master settlement currency and updated session inactivity security policies.',
  },
  {
    id: 'log-02',
    eventId: 'EVT-2026-9042',
    timestamp: '2026-10-28 18:30:04',
    user: 'Helena Von Berg',
    role: 'Hotel Admin (GM)',
    action: 'Authorize Folio Refund',
    module: 'Billing & Payments',
    ipAddress: '193.134.254.10 (St. Moritz)',
    result: 'Success',
    details: 'Authorized $1,800 refund voucher REF-2026-042 for Countess Beatrix Von Habsburg.',
  },
  {
    id: 'log-03',
    eventId: 'EVT-2026-9043',
    timestamp: '2026-10-28 16:15:30',
    user: 'System Cron Service',
    role: 'Platform Kernel',
    action: 'Autonomous Database Cluster Snapshot',
    module: 'System & Security',
    ipAddress: '10.0.4.1 (Internal Mesh)',
    result: 'Success',
    details: 'Completed incremental differential cluster archive (4.2 GB) dispatched to Frankfurt Vault.',
  },
  {
    id: 'log-04',
    eventId: 'EVT-2026-9044',
    timestamp: '2026-10-28 14:02:11',
    user: 'Unknown Remote Subject',
    role: 'Guest / Anonymous',
    action: 'Failed Console Authentication',
    module: 'Security & Access',
    ipAddress: '82.165.197.80 (Frankfurt)',
    result: 'Failed',
    details: 'Excessive password retry threshold reached for user account baroness@beaumontmanor.fr. IP temporarily blacklisted.',
  },
  {
    id: 'log-05',
    eventId: 'EVT-2026-9045',
    timestamp: '2026-10-28 11:10:45',
    user: 'Jean-Luc De La Tour',
    role: 'Hotel Admin (GM)',
    action: 'Suite Rate Plan Adjustment',
    module: 'Room Management',
    ipAddress: '202.3.238.18 (Bora Bora)',
    result: 'Success',
    details: 'Adjusted seasonal peak rate on Overwater Sunset Royal Villa from $2,800 to $3,100 per night.',
  },
  {
    id: 'log-06',
    eventId: 'EVT-2026-9046',
    timestamp: '2026-10-27 22:45:00',
    user: 'Kenzo Takahashi',
    role: 'Front Desk Manager',
    action: 'Walk-in VIP Guest Onboarding',
    module: 'Front Desk Operations',
    ipAddress: '210.140.10.1 (Kyoto)',
    result: 'Success',
    details: 'Created instant reservation for Duke William Somerset in Imperial Garden Suite.',
  },
];

export const AuditLogsPage = () => {
  const { showToast } = useToast();
  const [logs] = useState(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch =
        l.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.details.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMod = moduleFilter === 'all' || l.module === moduleFilter;
      const matchesRes = resultFilter === 'all' || l.result === resultFilter;

      return matchesSearch && matchesMod && matchesRes;
    });
  }, [logs, searchQuery, moduleFilter, resultFilter]);

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'User', 'Role', 'Action', 'Module', 'IP Address', 'Result', 'Details'];
    const rows = filteredLogs.map(l => [
      l.eventId,
      l.timestamp,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.ipAddress}"`,
      l.result,
      `"${l.details}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sovereign_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit Trail Exported', `Exported ${filteredLogs.length} security events as CSV.`, 'success');
  };

  const columns = [
    {
      key: 'eventId',
      header: 'Event ID & Time',
      render: l => (
        <div>
          <span className="font-mono text-xs font-bold text-accent block">{l.eventId}</span>
          <span className="text-[10px] text-charcoal-muted font-mono">{l.timestamp}</span>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User & Role',
      render: l => (
        <div>
          <span className="font-semibold text-xs text-primary dark:text-white block">{l.user}</span>
          <span className="text-[10px] text-accent font-medium">{l.role}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action & Module',
      render: l => (
        <div>
          <span className="font-medium text-xs text-charcoal dark:text-gray-200 block">{l.action}</span>
          <span className="text-[10px] text-charcoal-muted flex items-center gap-1 mt-0.5">
            <Layers className="w-3 h-3 text-accent" />
            {l.module}
          </span>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: l => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-400">
          {l.ipAddress}
        </span>
      ),
    },
    {
      key: 'result',
      header: 'Audit Result',
      render: l => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
            l.result === 'Success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          {l.result === 'Success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {l.result}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: l => (
        <button
          onClick={() => setSelectedLog(l)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border dark:border-white/10 text-[11px] font-medium text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-white/5 hover:text-accent transition-colors"
        >
          <Eye className="w-3 h-3" />
          Payload
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Immutable System Audit Trail"
        subtitle="Cryptographically sealed audit logs, operator access records, rate modifications, and transaction events"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'System & Security', path: '/super-admin/system' },
          { label: 'Audit Logs' },
        ]}
        actions={
          <button
            onClick={handleExportCSV}
            className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Trail CSV
          </button>
        }
      />

      <StatsGrid cols={4}>
        <StatCard
          title="Total Audited Events"
          value={logs.length}
          period="tamper-proof ledger"
          icon={<Terminal className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Authorized Actions"
          value={logs.filter(l => l.result === 'Success').length}
          period="99.8% compliance"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Security Interventions"
          value={logs.filter(l => l.result === 'Failed').length}
          period="quarantined anomalies"
          icon={<XCircle className="w-5 h-5 text-rose-500" />}
        />
        <StatCard
          title="Audit Hash Integrity"
          value="SHA-256 Valid"
          period="zero tampering detected"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      <div className="card-luxury p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event ID, operator, action..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-9 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-accent" />
            <span className="text-charcoal-muted">Module:</span>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[150px]"
            >
              <option value="all">All Modules</option>
              <option value="Platform Core">Platform Core</option>
              <option value="Billing & Payments">Billing & Payments</option>
              <option value="System & Security">System & Security</option>
              <option value="Security & Access">Security & Access</option>
              <option value="Room Management">Room Management</option>
              <option value="Front Desk Operations">Front Desk Operations</option>
            </select>

            <span className="text-charcoal-muted ml-2">Result:</span>
            <select
              value={resultFilter}
              onChange={e => setResultFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[100px]"
            >
              <option value="all">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredLogs}
          keyExtractor={l => l.id}
          pageSize={10}
          emptyMessage="No audit logs found matching criteria."
        />
      </div>

      {/* Log Payload Modal */}
      {selectedLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`Audit Security Record — ${selectedLog.eventId}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-accent font-bold uppercase">
                  {selectedLog.module}
                </span>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white mt-0.5">
                  {selectedLog.action}
                </h3>
                <span className="text-[10px] text-charcoal-muted font-mono">{selectedLog.timestamp}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold ${
                  selectedLog.result === 'Success'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                }`}
              >
                {selectedLog.result}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-ivory/50 dark:bg-white/5 border border-border/70 dark:border-white/5">
                <span className="text-[10px] text-charcoal-muted block">Executing Identity</span>
                <span className="font-semibold text-primary dark:text-white block mt-0.5">
                  {selectedLog.user}
                </span>
                <span className="text-[10px] text-accent font-mono">{selectedLog.role}</span>
              </div>
              <div className="p-3 rounded-lg bg-ivory/50 dark:bg-white/5 border border-border/70 dark:border-white/5">
                <span className="text-[10px] text-charcoal-muted block">Origin IP & Node</span>
                <span className="font-mono text-primary dark:text-white block mt-0.5">
                  {selectedLog.ipAddress}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono">TLS 1.3 Verified</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory/50 dark:bg-white/5 border border-border/70 dark:border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                Audited Event Payload & Changes
              </span>
              <p className="text-charcoal dark:text-gray-300 leading-relaxed font-mono text-[11px]">
                {selectedLog.details}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-white/10">
              <button onClick={() => setSelectedLog(null)} className="btn-luxury-outline text-xs">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuditLogsPage;

