import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ViewToggle } from '../../../components/ui/ViewToggle';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import { hotelApi } from '../../../services/hotelApi';
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
import { UserAvatar } from '../../../components/common/UserAvatar';

export const SuspendedUsersPage = () => {
  const { users, reactivateUser, deleteUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [viewingUser, setViewingUser] = useState(null);
  const [reactivateTarget, setReactivateTarget] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_suspended_users') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_suspended_users', mode);
    } catch {}
  };

  // Fetch suspended users from API with dedicated caching
  useEffect(() => {
    let isMounted = true;
    hotelApi.getSuspendedUsersData().catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Filtered to suspended
  const suspendedUsers = useMemo(() => (users || []).filter(u => u.status === 'suspended'), [users]);

  const handleConfirmReactivate = async () => {
    if (!reactivateTarget) return;
    try {
      await reactivateUser(reactivateTarget.id);
      showToast('Clearance Restored', `${reactivateTarget.name}'s console clearance has been reactivated.`, 'success');
      setReactivateTarget(null);
    } catch (err) {
      showToast('Error', err.message || 'Failed to reactivate user.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteUser(deleteTargetId);
      showToast('Account Removed', 'Suspended user record unlinked from database.', 'info');
      setDeleteTargetId(null);
    } catch (err) {
      showToast('Error', err.message || 'Failed to remove user record.', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Suspended Operator',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              src={u.avatar}
              alt={u.name}
              fallbackName={u.name}
              size="sm"
              ring={true}
              className="grayscale opacity-80"
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
            <span className="line-clamp-1">{u.hotel || (Array.isArray(u.hotelAccess) ? u.hotelAccess[0] : u.hotelAccess) || 'All Properties'}</span>
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
        {/* Toolbar: View Toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60 dark:border-white/10">
          <span className="text-xs text-charcoal-muted">
            Showing <strong className="text-primary dark:text-white">{suspendedUsers.length}</strong> suspended credentials
          </span>
          <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
        </div>

        {/* View Mode Switch: Table vs Card Grid */}
        {viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={suspendedUsers}
            keyExtractor={(u, idx) => `suspended-user-${u.db_id || u.id || idx}-${idx}`}
            searchPlaceholder="Search suspended operators..."
            showSearch={true}
            pageSize={10}
            emptyMessage="No suspended operator records found."
          />
        ) : (
          suspendedUsers.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <UserX className="w-10 h-10 text-rose-500/40 mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-primary dark:text-white">No suspended credentials found</p>
              <p className="text-xs">All platform accounts are currently in good standing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {suspendedUsers.map((u, idx) => (
                <div
                  key={`suspended-user-card-${u.db_id || u.id || idx}-${idx}`}
                  className="card-luxury p-5 rounded-2xl border border-rose-500/20 dark:border-rose-500/15 space-y-4 hover:border-rose-500/40 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <UserAvatar
                      src={u.avatar}
                      alt={u.name}
                      fallbackName={u.name}
                      className="w-12 h-12 border-2 border-rose-500/40 grayscale shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-primary dark:text-white truncate">
                          {u.name}
                        </h4>
                        <StatusBadge status="suspended" />
                      </div>
                      <p className="text-xs text-charcoal-muted truncate mt-0.5">{u.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-mono text-charcoal-muted bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        {u.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Property:</span>
                      <span className="font-semibold text-primary dark:text-white truncate max-w-[140px]">{u.hotel}</span>
                    </div>
                    <div className="flex items-center justify-between text-rose-500">
                      <span>Suspended Date:</span>
                      <span className="font-mono">{u.suspensionDate || 'Recent'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-charcoal-muted font-mono">{u.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingUser(u)}
                        className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
                        title="View Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setReactivateTarget(u)}
                        className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors"
                        title="Reactivate Clearance"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(u.id)}
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors"
                        title="Purge Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
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

