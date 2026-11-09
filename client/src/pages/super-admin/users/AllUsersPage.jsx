import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import { hotelApi } from '../../../services/hotelApi';
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
  LayoutGrid,
  List,
} from 'lucide-react';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { ViewToggle } from '../../../components/ui/ViewToggle';

export const AllUsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users, addUser, updateUser, suspendUser, reactivateUser, deleteUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_users') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_users', mode);
    } catch {}
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Confirmations
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspensionReasonInput, setSuspensionReasonInput] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Fetch users or permissions based on route with independent caching
  useEffect(() => {
    let isMounted = true;
    if (location.pathname.includes('/permissions')) {
      hotelApi.getHotelAdminPermissionsData().catch(() => { });
    } else if (location.pathname.startsWith('/super-admin/users')) {
      hotelApi.getUsersAllData().catch(() => { });
    } else {
      hotelApi.getUsers().catch(() => { });
    }
    return () => { isMounted = false; };
  }, [location.pathname]);

  // Add Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('Hotel Admin (GM)');
  const [formHotel, setFormHotel] = useState('');
  const [hotelOptions, setHotelOptions] = useState([]);

  // Fetch real hotels from backend MySQL database
  useEffect(() => {
    let isMounted = true;
    hotelApi.getHotels()
      .then(hotels => {
        if (isMounted && Array.isArray(hotels) && hotels.length > 0) {
          setHotelOptions(hotels);
          if (!formHotel) {
            setFormHotel(hotels[0]?.name || 'All Properties');
          }
        }
      })
      .catch(() => { });
    return () => { isMounted = false; };
  }, []);

  // Metrics
  const activeCount = useMemo(() => (users || []).filter(u => u.status === 'active').length, [users]);
  const suspendedCount = useMemo(() => (users || []).filter(u => u.status === 'suspended').length, [users]);
  const uniqueHotels = useMemo(() => new Set((users || []).map(u => u.hotel)).size, [users]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return (users || []).filter(user => {
      const userRole = (user.role || '').toLowerCase();
      const userStatus = (user.status || '').toLowerCase();
      const targetRole = roleFilter.toLowerCase();
      const targetStatus = statusFilter.toLowerCase();

      const matchesRole = targetRole === 'all' || userRole === targetRole || userRole.includes(targetRole);
      const matchesStatus = targetStatus === 'all' || userStatus === targetStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (user.name && user.name.toLowerCase().includes(q)) ||
        (user.email && user.email.toLowerCase().includes(q)) ||
        (user.phone && user.phone.toLowerCase().includes(q)) ||
        (user.hotel && user.hotel.toLowerCase().includes(q)) ||
        (user.role && user.role.toLowerCase().includes(q));

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

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
          <UserAvatar
            src={u.avatar}
            alt={u.name}
            fallbackName={u.name}
            size="sm"
            ring={true}
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
        <div onClick={() => setStatusFilter('all')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard
            title="Total Platform Users"
            value={users?.length || 0}
            change="+8.3%"
            isPositive={true}
            icon={<Users className="w-5 h-5 text-accent" />}
          />
        </div>
        <div onClick={() => setStatusFilter('active')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard
            title="Active Clearances"
            value={activeCount}
            subtitle="verified sessions"
            icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
          />
        </div>
        <div onClick={() => setStatusFilter('suspended')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard
            title="Suspended Credentials"
            value={suspendedCount}
            subtitle="audit locked"
            icon={<UserX className="w-5 h-5 text-rose-500" />}
          />
        </div>
        <StatCard
          title="Registered Properties"
          value={uniqueHotels}
          subtitle="cross-tenant nodes"
          icon={<Building2 className="w-5 h-5 text-accent" />}
        />
      </StatsGrid>

      {/* Filter and Table/Grid Container */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        {/* Toolbar: Filters & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-border/60 dark:border-white/10">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone or hotel..."
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>

            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} className="ml-2" />
          </div>
        </div>

        {/* View Mode Switch: Table vs Card Grid */}
        {viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={filteredUsers}
            keyExtractor={(u, idx) => `user-row-${u.db_id || u.id || idx}-${idx}`}
            showSearch={false}
            pageSize={10}
            emptyMessage="No user profiles found matching current filters."
          />
        ) : (
          filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <Users className="w-10 h-10 text-accent/40 mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-primary dark:text-white">No user profiles found</p>
              <p className="text-xs">Adjust your search or filter options.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredUsers.map((u, idx) => (
                <div
                  key={`user-card-${u.db_id || u.id || idx}-${idx}`}
                  className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <UserAvatar
                      src={u.avatar}
                      alt={u.name}
                      fallbackName={u.name}
                      size="md"
                      ring={true}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif font-bold text-sm text-primary dark:text-white truncate">
                          {u.name}
                        </h4>
                        <StatusBadge status={u.status} />
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/25 uppercase font-bold">
                        {u.role}
                      </span>
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400 truncate mt-1">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 dark:border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-charcoal-muted dark:text-gray-300 truncate max-w-[150px]">
                      <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">{u.hotel || 'Platform Core'}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => navigate(`/super-admin/users/details/${u.id}`)}
                        className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
                        title="Inspect User Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate(`/super-admin/users/edit/${u.id}`)}
                        className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
                        title="Edit User Credentials"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {u.status === 'active' ? (
                        <button
                          onClick={() => setSuspendingUser(u)}
                          className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                          title="Suspend Clearance"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            reactivateUser(u.id);
                            showToast('User Reactivated', `${u.name} has been reactivated.`, 'success');
                          }}
                          className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                          title="Reactivate Clearance"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
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

