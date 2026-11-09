import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ViewToggle } from '../../../components/ui/ViewToggle';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import { hotelApi } from '../../../services/hotelApi';
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
  Phone,
  Calendar,
} from 'lucide-react';
import { UserAvatar } from '../../../components/common/UserAvatar';

export const ActiveUsersPage = () => {
  const { users, suspendUser, updateUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_active_users') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_active_users', mode);
    } catch { }
  };

  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  // Fetch active users from API with dedicated caching
  useEffect(() => {
    let isMounted = true;
    hotelApi.getActiveUsersData().catch(() => { });
    return () => { isMounted = false; };
  }, []);

  // Only active users
  const activeUsers = useMemo(() => (users || []).filter(u => u.status === 'active'), [users]);

  const filteredUsers = useMemo(() => {
    return activeUsers.filter(user => {
      const userRole = (user.role || '').toLowerCase();
      const targetRole = roleFilter.toLowerCase();
      const matchesRole = targetRole === 'all' || userRole === targetRole || userRole.includes(targetRole);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (user.name && user.name.toLowerCase().includes(q)) ||
        (user.email && user.email.toLowerCase().includes(q)) ||
        (user.phone && user.phone.toLowerCase().includes(q)) ||
        (user.hotel && user.hotel.toLowerCase().includes(q)) ||
        (user.role && user.role.toLowerCase().includes(q));

      return matchesRole && matchesSearch;
    });
  }, [activeUsers, roleFilter, searchQuery]);

  const handleConfirmSuspend = async () => {
    if (!suspendingUser) return;
    try {
      await suspendUser(suspendingUser.id, suspensionReason || 'Executive suspension by Super Admin.');
      showToast('User Suspended', `${suspendingUser.name}'s clearance has been placed in suspension.`, 'warning');
      setSuspendingUser(null);
      setSuspensionReason('');
    } catch (err) {
      showToast('Error', err.message || 'Failed to suspend user.', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Active Operator',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              src={u.avatar}
              alt={u.name}
              fallbackName={u.name}
              size="sm"
              ring={true}
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
          <span className="line-clamp-1">{u.hotel || (Array.isArray(u.hotelAccess) ? u.hotelAccess[0] : u.hotelAccess) || 'All Properties'}</span>
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
        {/* Toolbar: Search, Filters & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-border/60 dark:border-white/10">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active users by name, email, phone or property..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-ivory dark:bg-white/5 border border-border dark:border-white/10 text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-2 text-xs self-end md:self-auto">
            <Filter className="w-4 h-4 text-accent shrink-0" />
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

            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} className="ml-2" />
          </div>
        </div>

        {/* View Mode Switch: Table vs Card Grid */}
        {viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={filteredUsers}
            keyExtractor={(u, idx) => `active-user-${u.db_id || u.id || idx}-${idx}`}
            showSearch={false}
            pageSize={10}
            emptyMessage="No active operators match the search criteria."
          />
        ) : (
          filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <UserCheck className="w-10 h-10 text-accent/40 mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-primary dark:text-white">No active operators found</p>
              <p className="text-xs">Adjust your search or filter options.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredUsers.map((u, idx) => (
                <div
                  key={`active-user-card-${u.db_id || u.id || idx}-${idx}`}
                  className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <UserAvatar
                      src={u.avatar}
                      alt={u.name}
                      fallbackName={u.name}
                      className="w-12 h-12 border-2 border-emerald-500/40 shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-primary dark:text-white truncate">
                          {u.name}
                        </h4>
                        <StatusBadge status="active" />
                      </div>
                      <p className="text-xs text-charcoal-muted truncate mt-0.5">{u.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-mono text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        {u.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Property:</span>
                      <span className="font-semibold text-primary dark:text-white truncate max-w-[140px]">{u.hotel}</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Contact:</span>
                      <span className="font-mono">{u.phone || 'N/A'}</span>
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
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
                        title="Edit Account"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSuspendingUser(u)}
                        className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                        title="Suspend Clearance"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
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

