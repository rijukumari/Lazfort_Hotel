import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import {
  UserX,
  CheckCircle,
  Building2,
  Eye,
  Trash2,
  Search,
  Mail,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const SuspendedUsersPage = () => {
  const { users, reactivateUser, deleteUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [reactivateTarget, setReactivateTarget] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filtered to suspended
  const suspendedUsers = useMemo(() => (users || []).filter(u => u.status === 'suspended'), [users]);

  const filteredUsers = useMemo(() => {
    return suspendedUsers.filter(user => {
      return (
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.hotel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.suspensionReason && user.suspensionReason.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [suspendedUsers, searchQuery]);

  const handleConfirmReactivate = () => {
    if (!reactivateTarget) return;
    reactivateUser(reactivateTarget.id);
    showToast('Clearance Restored', `${reactivateTarget.name}'s console clearance has been reactivated.`, 'success');
    setReactivateTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteUser(deleteTargetId);
    showToast('Account Removed', 'Suspended user record permanently purged (Demo).', 'info');
    setDeleteTargetId(null);
  };

  const columns = [
    {
      key: 'name',
      header: 'Suspended Operator',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={u.avatar}
              alt={u.name}
              className="w-9 h-9 rounded-full object-cover border border-rose-500/50 grayscale opacity-80"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-primary-900 absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <div className="font-semibold text-xs text-primary dark:text-white line-through opacity-80">
              {u.name}
            </div>
            <div className="text-[11px] text-charcoal-muted dark:text-gray-400 font-mono flex items-center gap-1">
              <Mail className="w-3 h-3 text-accent" />
              {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Former Role & Hotel',
      render: (u) => (
        <div>
          <span className="text-xs font-semibold text-charcoal dark:text-gray-300 block">{u.role}</span>
          <span className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/60" />
            <span className="line-clamp-1">{u.hotel}</span>
          </span>
        </div>
      ),
    },
    {
      key: 'suspensionReason',
      header: 'Reason for Suspension',
      render: (u) => (
        <span className="text-xs text-rose-600 dark:text-rose-400 line-clamp-1" title={u.suspensionReason}>
          {u.suspensionReason || 'Executive directive suspension'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (u) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewingUser(u)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Inspect Audit"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setReactivateTarget(u)}
            className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
            title="Reactivate Clearance"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTargetId(u.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Purge Profile"
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
        title="Suspended Users & Revoked Access"
        description="Audit directory of terminated, suspended, or flagged credentials across enterprise property nodes"
        badge={`${suspendedUsers.length} Suspended Accounts`}
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Suspended Credentials"
          value={suspendedUsers.length}
          subtitle="tokens permanently revoked"
          icon={<UserX className="w-5 h-5 text-rose-500" />}
        />
        <StatCard
          title="Security Enforcement"
          value="Immediate"
          subtitle="zero unauthorized attempts"
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Audit Trail Retention"
          value="10 Years"
          subtitle="Monaco GDPR compliant"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suspended operators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury pl-10 text-xs w-full"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          pageSize={10}
          emptyMessage="No suspended operator records found."
        />
      </div>

      {/* View Modal */}
      {viewingUser && (
        <Modal
          isOpen={true}
          onClose={() => setViewingUser(null)}
          title="Suspended Clearance Dossier"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-1">
              <span className="font-bold uppercase tracking-wider block">Clearance Suspended</span>
              <p>Reason: {viewingUser.suspensionReason || 'Executive directive suspension.'}</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs btn-3d shadow-gold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reactivate Confirmation */}
      {reactivateTarget && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setReactivateTarget(null)}
          onConfirm={handleConfirmReactivate}
          title={`Reactivate Clearance: ${reactivateTarget.name}`}
          message={`Are you sure you want to restore full login clearance and permissions for ${reactivateTarget.name}?`}
          confirmText="Yes, Reactivate"
          variant="primary"
        />
      )}

      {/* Delete Confirmation */}
      {deleteTargetId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          title="Permanently Purge Record?"
          message="This action will delete the suspended user profile from the database permanently."
          confirmText="Confirm Purge"
          variant="danger"
        />
      )}
    </div>
  );
};

export default SuspendedUsersPage;

