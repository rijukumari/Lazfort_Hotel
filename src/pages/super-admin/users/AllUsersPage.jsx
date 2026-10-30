import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  ShieldAlert,
  Search,
  Filter,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const AllUsersPage = () => {
  const navigate = useNavigate();
  const { users, addUser, updateUser, suspendUser, reactivateUser, deleteUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Confirmations
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspensionReasonInput, setSuspensionReasonInput] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Add Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('Hotel Admin (GM)');
  const [formHotel, setFormHotel] = useState('Lazfort Grand Palace Monaco');

  // Metrics
  const activeCount = useMemo(() => (users || []).filter(u => u.status === 'active').length, [users]);
  const suspendedCount = useMemo(() => (users || []).filter(u => u.status === 'suspended').length, [users]);
  const uniqueHotels = useMemo(() => new Set((users || []).map(u => u.hotel)).size, [users]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return (users || []).filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.hotel?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      showToast('Validation Error', 'Full Name and Email are mandatory fields.', 'error');
      return;
    }

    addUser({
      name: formName,
      email: formEmail,
      phone: formPhone || '+377 98 00 12 00',
      role: formRole,
      hotel: formHotel,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    setIsAddModalOpen(false);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    showToast('User Created', `New user "${formName}" has been provisioned.`, 'success');
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editingUser.name,
      phone: editingUser.phone,
      role: editingUser.role,
      hotel: editingUser.hotel,
    });

    setEditingUser(null);
    showToast('User Updated', 'Account permissions and profile details modified.', 'success');
  };

  const handleConfirmSuspend = () => {
    if (!suspendingUser) return;
    suspendUser(suspendingUser.id, suspensionReasonInput || 'Account suspended by Super Admin directive.');
    setSuspendingUser(null);
    setSuspensionReasonInput('');
    showToast('User Suspended', `${suspendingUser.name}'s console clearance was suspended.`, 'warning');
  };

  const handleConfirmDelete = () => {
    if (!deletingUserId) return;
    deleteUser(deletingUserId);
    setDeletingUserId(null);
    showToast('User Removed', 'User profile and permissions unlinked from database.', 'info');
  };

  const columns = [
    {
      key: 'name',
      header: 'User & Credentials',
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar}
            alt={u.name}
            className="w-9 h-9 rounded-full object-cover border border-accent/40 shadow-sm flex-shrink-0"
          />
          <div>
            <div className="font-semibold text-xs text-primary dark:text-white">{u.name}</div>
            <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1.5 font-mono">
              <Mail className="w-3 h-3 text-accent/70" />
              {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold text-[11px]">
          <ShieldCheck className="w-3 h-3" />
          {u.role}
        </span>
      ),
    },
    {
      key: 'hotel',
      header: 'Property Affiliation',
      render: (u) => (
        <div className="text-xs text-charcoal dark:text-gray-300 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-accent/70 flex-shrink-0" />
          <span className="line-clamp-1">{u.hotel}</span>
        </div>
      ),
    },
    {
      key: 'registeredDate',
      header: 'Activity Dates',
      render: (u) => (
        <div className="text-xs font-mono">
          <span className="text-charcoal dark:text-gray-300 block">Joined {u.registeredDate}</span>
          <span className="text-[10px] text-charcoal-muted">Last login: {u.lastLogin}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/users/details/${u.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Identity Dossier on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/users/edit/${u.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit User Profile on Dedicated Page"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          {u.status === 'active' ? (
            <button
              onClick={() => setSuspendingUser(u)}
              className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
              title="Suspend User"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                reactivateUser(u.id);
                showToast('User Reactivated', `${u.name} has been reactivated.`, 'success');
              }}
              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
              title="Reactivate User"
            >
              <UserCheck className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setDeletingUserId(u.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete User"
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
        title="Enterprise User Directory"
        description="Global system identities, role-based access control (RBAC), and property clearance management"
        actions={
          <button
            onClick={() => navigate('/super-admin/users/add')}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-2xl gold-gradient-bg text-primary-950 btn-3d shadow-md shadow-accent/20 inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Provision New User</span>
          </button>
        }
      />

      <StatsGrid cols={4}>
        <StatCard
          title="Total Platform Users"
          value={users?.length || 0}
          change="+8.3%"
          isPositive={true}
          icon={<Users className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Active Clearances"
          value={activeCount}
          subtitle="verified sessions"
          icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Suspended Credentials"
          value={suspendedCount}
          subtitle="audit locked"
          icon={<UserX className="w-5 h-5 text-rose-500" />}
        />
        <StatCard
          title="Registered Properties"
          value={uniqueHotels}
          subtitle="cross-tenant nodes"
          icon={<Building2 className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      {/* Filter and Table Container */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone or hotel..."
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          pageSize={10}
          emptyMessage="No user profiles found matching current filters."
        />
      </div>

      {/* Suspend Confirmation Dialog */}
      {suspendingUser && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setSuspendingUser(null)}
          onConfirm={handleConfirmSuspend}
          title={`Suspend Clearance: ${suspendingUser.name}`}
          message={
            <div className="space-y-3 pt-2">
              <p className="text-xs text-charcoal-muted">
                Suspending this account will immediately revoke all dashboard session tokens and prevent system login.
              </p>
              <textarea
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-ivory/50 dark:bg-primary-900/40 text-primary dark:text-white"
                placeholder="Audit reason for suspension..."
                value={suspensionReasonInput}
                onChange={e => setSuspensionReasonInput(e.target.value)}
              />
            </div>
          }
          confirmText="Confirm Suspension"
          variant="danger"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingUserId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeletingUserId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Platform Identity Record?"
          message="Are you certain you wish to permanently delete this user account from the central ERP? This action is irrevocable."
          confirmText="Permanently Delete"
          variant="danger"
        />
      )}
    </div>
  );
};

export default AllUsersPage;

