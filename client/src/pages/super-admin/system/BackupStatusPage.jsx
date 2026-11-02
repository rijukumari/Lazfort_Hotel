import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { initialBackupHistory } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  HardDrive,
  CheckCircle2,
  Clock,
  Download,
  RotateCw,
  Eye,
  ShieldCheck,
  Cloud,
  FileArchive,
} from 'lucide-react';

export const BackupStatusPage = () => {
  const { showToast } = useToast();
  const [backups, setBackups] = useState(initialBackupHistory);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const handleRunBackup = () => {
    setIsBackingUp(true);
    showToast('Snapshot Initiated', 'Capturing immutable write-ahead log & database cluster dump...', 'info');

    setTimeout(() => {
      const newBackup = {
        id: `bak-${Date.now().toString().slice(-4)}`,
        backupId: `BAK-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-MANUAL`,
        date: 'Just now (Manual Trigger)',
        size: '43.1 GB',
        type: 'Full Cluster',
        destination: 'AWS eu-west-3 (Paris Encrypted Vault)',
        duration: '9 mins 14 secs',
        result: 'completed',
      };

      setBackups(prev => [newBackup, ...prev]);
      setIsBackingUp(false);
      showToast('Cluster Backup Complete', 'Manual backup completed successfully with 256-bit AES encryption seal.', 'success');
    }, 1500);
  };

  const columns = [
    {
      key: 'backupId',
      header: 'Backup Archive Ref',
      render: b => (
        <div>
          <span className="font-mono text-xs font-bold text-accent block">{b.backupId}</span>
          <span className="text-[10px] text-charcoal-muted font-mono">{b.date}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Snapshot Type',
      render: b => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ivory dark:bg-white/5 border border-border dark:border-white/10 text-xs font-medium text-charcoal dark:text-gray-300">
          <FileArchive className="w-3 h-3 text-accent" />
          {b.type}
        </span>
      ),
    },
    {
      key: 'size',
      header: 'Archive Size',
      render: b => (
        <span className="font-mono text-xs font-semibold text-primary dark:text-white">
          {b.size}
        </span>
      ),
    },
    {
      key: 'destination',
      header: 'Encrypted Vault Destination',
      render: b => (
        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted dark:text-gray-300">
          <Cloud className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          <span className="font-mono text-[11px] line-clamp-1">{b.destination}</span>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Elapsed Time',
      render: b => (
        <span className="font-mono text-xs text-charcoal-muted">
          {b.duration}
        </span>
      ),
    },
    {
      key: 'result',
      header: 'Integrity',
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
          <CheckCircle2 className="w-3 h-3" />
          VERIFIED
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: b => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedBackup(b)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              showToast('Download Dispatched', `Commencing secure transfer of ${b.backupId}.tar.gz`, 'info');
            }}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Download Archive"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Disaster Recovery & Cluster Backups"
        subtitle="Automated off-site differential snapshots, database write-ahead log replication, and cryptographic cold storage"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'System & Security', path: '/super-admin/system' },
          { label: 'Backup Status' },
        ]}
        actions={
          <button
            onClick={handleRunBackup}
            disabled={isBackingUp}
            className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
            {isBackingUp ? 'Snapshotting Cluster...' : 'Trigger Immediate Backup'}
          </button>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Last Successful Snapshot"
          value="Today 03:00 UTC"
          period="automated differential"
          icon={<Clock className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Next Scheduled Job"
          value="Tomorrow 03:00"
          period="crontab 0 3 * * *"
          icon={<HardDrive className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Total Cold Storage"
          value="42.8 GB"
          period="256-bit AES compressed"
          icon={<Cloud className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Cluster RPO / RTO"
          value="< 5 mins RPO"
          period="15 mins recovery SLA"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Backup Vault Status Summary */}
      <div className="card-luxury p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Sovereign Cloud Backup Vault Configuration
            </h3>
            <p className="text-xs text-charcoal-muted">Continuous point-in-time recovery & geo-redundant storage</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
            CONTINUOUS WAL ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Primary Storage</span>
            <span className="font-semibold text-primary dark:text-white block">AWS S3 Glacier Vault (Paris)</span>
            <span className="text-[11px] text-charcoal-muted font-mono">eu-west-3 • Immutable Object Lock</span>
          </div>
          <div className="p-4 rounded-xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Secondary Mirror</span>
            <span className="font-semibold text-primary dark:text-white block">AWS S3 Glacier Vault (Frankfurt)</span>
            <span className="text-[11px] text-charcoal-muted font-mono">eu-central-1 • Cross-Region Sync</span>
          </div>
          <div className="p-4 rounded-xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Retention Window</span>
            <span className="font-semibold text-primary dark:text-white block">365 Days Rolling Archive</span>
            <span className="text-[11px] text-charcoal-muted font-mono">Complies with GDPR & Swiss Banking</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card-luxury p-5 space-y-4">
        <h3 className="font-serif font-bold text-base text-primary dark:text-white">
          Historical Snapshot Archive Ledger
        </h3>

        <DataTable
          columns={columns}
          data={backups}
          keyExtractor={b => b.id}
          pageSize={10}
          emptyMessage="No backup archives logged."
        />
      </div>

      {/* Backup Details Modal */}
      {selectedBackup && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBackup(null)}
          title={`Backup Manifest — ${selectedBackup.backupId}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-accent text-[10px] font-bold uppercase block">
                  {selectedBackup.type}
                </span>
                <h3 className="text-base font-serif font-bold text-primary dark:text-white mt-0.5">
                  {selectedBackup.backupId}
                </h3>
                <span className="text-[10px] text-charcoal-muted font-mono">{selectedBackup.date}</span>
              </div>
              <span className="text-xl font-mono font-bold text-accent">{selectedBackup.size}</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-ivory/50 dark:bg-white/5 border border-border/70 dark:border-white/5 flex justify-between">
                <span className="text-charcoal-muted">Storage Destination:</span>
                <span className="font-mono text-primary dark:text-white">{selectedBackup.destination}</span>
              </div>
              <div className="p-3 rounded-lg bg-ivory/50 dark:bg-white/5 border border-border/70 dark:border-white/5 flex justify-between">
                <span className="text-charcoal-muted">Execution Duration:</span>
                <span className="font-mono text-primary dark:text-white">{selectedBackup.duration}</span>
              </div>
              <div className="p-3 rounded-lg bg-ivory/50 dark:bg-white/5 border border-border/70 dark:border-white/5 flex justify-between">
                <span className="text-charcoal-muted">Integrity Seal:</span>
                <span className="font-mono text-emerald-600 font-semibold">SHA-256 Checksum Valid</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-white/10">
              <button onClick={() => setSelectedBackup(null)} className="btn-luxury-outline text-xs">
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Archive Download Commenced', `Transferring ${selectedBackup.backupId}.tar.gz`, 'success');
                  setSelectedBackup(null);
                }}
                className="btn-luxury-primary text-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Archive
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BackupStatusPage;

