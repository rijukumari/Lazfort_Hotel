import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import {
  UserCheck,
  Building2,
  Eye,
  Edit,
  ShieldAlert,
  Search,
  Filter,
  Mail,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const ActiveUsersPage = () => {
  const { users, suspendUser, updateUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  // Only active users
  const activeUsers = useMemo(() => (users || []).filter(u => u.status === 'active'), [users]);

  const filteredUsers = useMemo(() => {
    return activeUsers.filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.hotel?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [activeUsers, searchQuery, roleFilter]);

  const handleConfirmSuspend = () => {
    if (!suspendingUser) return;
    suspendUser(suspendingUser.id, suspensionReason || 'Executive suspension by Super Admin.');
    setSuspendingUser(null);
    setSuspensionReason('');
    showToast('User Suspended', `${suspendingUser.name}'s clearance has been placed in suspension.`, 'warning');
  };

  const columns = [
    {
      key: 'name',
      header: 'Active Operator',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={u.avatar}
              alt={u.name}
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/50"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-primary-900 absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <div className="font-semibold text-xs text-primary dark:text-white">{u.name}</div>
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
      header: 'Role Clearance',
      render: (u) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
          <ShieldCheck className="w-3 h-3" />
          {u.role}
        </span>
      ),
    },
    {
      key: 'hotel',
      header: 'Assigned Property',
      render: (u) => (
        <div className="text-xs text-charcoal dark:text-gray-300 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-accent/70 flex-shrink-0" />
          <span className="line-clamp-1">{u.hotel}</span>
        </div>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Recent Session',
      render: (u) => (
        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
          {u.lastLogin}
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
            title="Inspect Credentials"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSuspendingUser(u)}
            className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
            title="Suspend Access"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Active User Sessions & Verified Operators"
        description="Real-time monitoring of all authenticated staff, general managers, and operational users"
        badge={`${activeUsers.length} Active Credentials`}
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Active Credentials"
          value={activeUsers.length}
          subtitle="live clearance verified"
          icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Security SLA Fulfillment"
          value="100%"
          subtitle="2FA token enforced"
          icon={<CheckCircle className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Properties with Active Operators"
          value={new Set(activeUsers.map(u => u.hotel)).size}
          subtitle="zero downtime detected"
          icon={<Building2 className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search active users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Hotel Admin (GM)">Hotel Admin (GM)</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Housekeeping Lead">Housekeeping Lead</option>
              <option value="Staff Specialist">Staff Specialist</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          pageSize={10}
          emptyMessage="No active operators match the search criteria."
        />
      </div>

      {/* View User Modal */}
      {viewingUser && (
        <Modal
          isOpen={true}
          onClose={() => setViewingUser(null)}
          title="Active Operator Dossier"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-ivory dark:bg-primary-900/60 border border-border/80">
              <img
                src={viewingUser.avatar}
                alt={viewingUser.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                  {viewingUser.name}
                </h4>
                <p className="text-charcoal-muted font-mono">{viewingUser.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold uppercase text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Active Clearance
                  </span>
                  <span className="text-accent font-semibold">{viewingUser.role}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Direct Phone</span>
                <span className="font-semibold text-primary dark:text-white">{viewingUser.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Property Node</span>
                <span className="font-semibold text-primary dark:text-white truncate block">{viewingUser.hotel}</span>
              </div>
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

      {/* Suspend Confirmation Modal */}
      {suspendingUser && (
        <Modal
          isOpen={true}
          onClose={() => setSuspendingUser(null)}
          title={`Suspend User Access: ${suspendingUser.name}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-charcoal-muted">
              Are you sure you want to suspend clearance for <strong>{suspendingUser.name}</strong> ({suspendingUser.role})?
              Their ongoing session will be terminated instantly.
            </p>
            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Reason for Suspension</label>
              <textarea
                rows={2}
                value={suspensionReason}
                onChange={e => setSuspensionReason(e.target.value)}
                placeholder="Audit explanation for suspension..."
                className="input-luxury w-full text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingUser(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActiveUsersPage;

