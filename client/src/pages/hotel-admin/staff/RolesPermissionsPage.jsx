import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader, StatCard, Button, StatusBadge, Modal, ConfirmDialog, FormField, Input, Select } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  ShieldCheck,
  CheckCircle,
  Users,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  KeyRound,
  Lock,
  CheckSquare,
  Square,
  Shield,
  Save
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

const MODULES = [
  'Dashboard',
  'Rooms',
  'Bookings',
  'Guests',
  'Staff',
  'Finance',
  'Inventory',
  'Reports',
  'Settings'
];

const INITIAL_ROLES = [
  {
    id: 'ROL-01',
    code: 'GM',
    name: 'General Manager',
    assignedEmployees: 2,
    status: 'Active',
    description: 'Supreme executive authority across resort operations, treasury, personnel, and governance.',
    permissions: [
      'Dashboard',
      'Rooms',
      'Bookings',
      'Guests',
      'Staff',
      'Finance',
      'Inventory',
      'Reports',
      'Settings'
    ]
  },
  {
    id: 'ROL-02',
    code: 'FDS',
    name: 'Front Desk Supervisor',
    assignedEmployees: 4,
    status: 'Active',
    description: 'Manages reception desk, concierge duties, VIP arrivals, room bookings, and guest itineraries.',
    permissions: [
      'Dashboard',
      'Rooms',
      'Bookings',
      'Guests',
      'Reports'
    ]
  },
  {
    id: 'ROL-03',
    code: 'EHK',
    name: 'Executive Housekeeper',
    assignedEmployees: 3,
    status: 'Active',
    description: 'Coordinates room turnovers, deep hygiene checklists, linen depots, and lost & found vault.',
    permissions: [
      'Dashboard',
      'Rooms',
      'Inventory'
    ]
  },
  {
    id: 'ROL-04',
    code: 'FBL',
    name: 'F&B Operations Lead',
    assignedEmployees: 5,
    status: 'Active',
    description: 'Directs restaurant operations, room service dispatch, wine stock cellar, and supplier deliveries.',
    permissions: [
      'Dashboard',
      'Bookings',
      'Inventory'
    ]
  },
  {
    id: 'ROL-05',
    code: 'SHR',
    name: 'Staff Specialist & HR',
    assignedEmployees: 2,
    status: 'Active',
    description: 'Rosters employee shifts, tracks daily biometric attendance, leaves, and staff performance.',
    permissions: [
      'Dashboard',
      'Staff',
      'Reports'
    ]
  },
  {
    id: 'ROL-06',
    code: 'FIN',
    name: 'Finance Comptroller',
    assignedEmployees: 2,
    status: 'Active',
    description: 'Oversees guest folios, accounts ledger, journal settlements, payment gateways, and tax audits.',
    permissions: [
      'Dashboard',
      'Bookings',
      'Finance',
      'Reports'
    ]
  }
];

export const RolesPermissionsPage = () => {
  const { staff = [] } = useERP();
  const { showToast } = useToast();

  const [roles, setRoles] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_roles_permissions');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load roles from storage', e);
    }
    return INITIAL_ROLES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lazfort_roles_permissions', JSON.stringify(roles));
    } catch (e) {
      console.warn('Failed to save roles', e);
    }
  }, [roles]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    assignedEmployees: 1,
    status: 'Active',
    description: '',
    permissions: ['Dashboard']
  });

  // KPI Metrics
  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.status === 'Active').length;
  const totalAssignedStaff = useMemo(() => {
    return roles.reduce((acc, curr) => acc + (Number(curr.assignedEmployees) || 0), 0);
  }, [roles]);

  // Filtered List
  const filteredRoles = useMemo(() => {
    return roles.filter(r => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [roles, searchTerm, statusFilter]);

  // Actions
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      code: `ROL-0${roles.length + 1}`,
      assignedEmployees: 1,
      status: 'Active',
      description: '',
      permissions: ['Dashboard', 'Rooms']
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      code: role.code,
      assignedEmployees: role.assignedEmployees,
      status: role.status,
      description: role.description || '',
      permissions: role.permissions || []
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (role) => {
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const togglePermission = (modName) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(modName);
      if (exists) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== modName)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, modName]
        };
      }
    });
  };

  const handleSelectAllPermissions = () => {
    if (formData.permissions.length === MODULES.length) {
      setFormData(prev => ({ ...prev, permissions: ['Dashboard'] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: [...MODULES] }));
    }
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('Validation Error', 'Role Name and Role Code are required.', 'error');
      return;
    }

    const newRole = {
      id: `ROL-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      assignedEmployees: Number(formData.assignedEmployees) || 0,
      status: formData.status,
      description: formData.description.trim(),
      permissions: formData.permissions
    };

    setRoles(prev => [newRole, ...prev]);
    setIsAddModalOpen(false);
    showToast('Role Created', `Role "${newRole.name}" created with ${newRole.permissions.length} module permissions.`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('Validation Error', 'Role Name and Role Code are required.', 'error');
      return;
    }

    setRoles(prev =>
      prev.map(r =>
        r.id === selectedRole.id
          ? {
              ...r,
              name: formData.name.trim(),
              code: formData.code.trim().toUpperCase(),
              assignedEmployees: Number(formData.assignedEmployees) || 0,
              status: formData.status,
              description: formData.description.trim(),
              permissions: formData.permissions
            }
          : r
      )
    );

    setIsEditModalOpen(false);
    showToast('Permissions Saved', `Role "${formData.name}" permissions updated successfully.`, 'success');
  };

  const handleDeleteConfirm = () => {
    if (!selectedRole) return;
    setRoles(prev => prev.filter(r => r.id !== selectedRole.id));
    setIsDeleteOpen(false);
    showToast('Role Deleted', `Role "${selectedRole.name}" deleted.`, 'success');
  };

  const columns = [
    {
      header: 'Role & Scope',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight">{row.name}</p>
            <p className="text-[11px] text-charcoal-muted line-clamp-1 max-w-[280px]">
              {row.description || `${row.permissions?.length || 0} system modules granted`}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Role Code',
      accessor: 'code',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
          {row.code}
        </span>
      )
    },
    {
      header: 'Assigned Employees',
      accessor: 'assignedEmployees',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-primary dark:text-white bg-ivory dark:bg-white/5 px-2.5 py-1 rounded-md border border-border/60 dark:border-white/10 whitespace-nowrap inline-flex items-center gap-1.5 shrink-0">
          <span>{row.assignedEmployees}</span>
          <span className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold">Employees</span>
        </span>
      )
    },
    {
      header: 'Access Scope',
      accessor: 'permissions',
      render: (row) => {
        const perms = row.permissions || [];
        const isAll = perms.length === MODULES.length;
        return (
          <div className="flex items-center gap-1.5">
            {isAll ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-semibold">
                Full Sovereign Access (9/9)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 text-[11px] font-semibold">
                {perms.length} of {MODULES.length} Modules
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.status === 'Active' ? 'active' : 'inactive'} size="sm" />
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenView(row)}
            className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
            title="View Role & Permissions"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Role & Permissions Matrix"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1.5 rounded-lg hover:bg-rose-500/15 text-charcoal-muted hover:text-rose-500 transition-colors"
            title="Delete Role"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Roles & Permissions Management"
        description="Configure fine-grained system access controls, RBAC policies, and module privileges for hotel personnel."
        badge="Access Governance"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add New Role
          </Button>
        }
      />

      {/* 3 Metric Cards per specification */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Roles"
          value={totalRoles}
          icon={KeyRound}
          subtitle="Defined RBAC privilege tiers"
        />
        <StatCard
          title="Active Roles"
          value={activeRoles}
          icon={ShieldCheck}
          subtitle="Enforced in security domain"
        />
        <StatCard
          title="Assigned Employees"
          value={totalAssignedStaff}
          icon={Users}
          subtitle="Active roster accounts"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 dark:bg-[#111827]/90 p-3 rounded-2xl border border-border/80 dark:border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search role name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredRoles}
        keyField="id"
        pageSize={8}
        showSearch={false}
        emptyMessage="No roles found matching criteria."
      />

      {/* ADD ROLE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Role & Define Permissions"
        size="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Role Name" required>
              <Input
                placeholder="e.g. Concierge Supervisor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Role Code" required>
              <Input
                placeholder="e.g. CSV"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Assigned Employees Count">
              <Input
                type="number"
                min="0"
                value={formData.assignedEmployees}
                onChange={(e) => setFormData({ ...formData, assignedEmployees: e.target.value })}
              />
            </FormField>
            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <Input
              placeholder="Primary responsibilities and department alignment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          {/* PERMISSION CHECKBOXES MATRIX */}
          <div className="space-y-3 pt-2 border-t border-border/60 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                <span>Module Permissions Access Matrix</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllPermissions}
                className="text-xs font-semibold text-accent hover:underline"
              >
                {formData.permissions.length === MODULES.length ? 'Deselect All' : 'Select All Modules'}
              </button>
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Select which ERP subsystems employees with this role can view and manage:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {MODULES.map((mod) => {
                const checked = formData.permissions.includes(mod);
                return (
                  <div
                    key={mod}
                    onClick={() => togglePermission(mod)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      checked
                        ? 'border-accent bg-accent/10 dark:bg-accent/15 text-primary dark:text-white shadow-sm'
                        : 'border-border/60 dark:border-white/10 bg-ivory/40 dark:bg-white/[0.02] text-charcoal-muted hover:border-border'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}} // handled by parent div
                      className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold">{mod}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" icon={Save} type="submit">
              Save Role & Permissions
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT ROLE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Role & Permissions Matrix"
        size="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Role Name" required>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Role Code" required>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Assigned Employees Count">
              <Input
                type="number"
                min="0"
                value={formData.assignedEmployees}
                onChange={(e) => setFormData({ ...formData, assignedEmployees: e.target.value })}
              />
            </FormField>
            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>

          {/* PERMISSION CHECKBOXES MATRIX */}
          <div className="space-y-3 pt-2 border-t border-border/60 dark:border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                <span>Check Permissions to Grant</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllPermissions}
                className="text-xs font-semibold text-accent hover:underline"
              >
                {formData.permissions.length === MODULES.length ? 'Deselect All' : 'Select All Modules'}
              </button>
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Select which ERP subsystems employees with this role can view and manage:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {MODULES.map((mod) => {
                const checked = formData.permissions.includes(mod);
                return (
                  <div
                    key={mod}
                    onClick={() => togglePermission(mod)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      checked
                        ? 'border-accent bg-accent/10 dark:bg-accent/15 text-primary dark:text-white shadow-sm'
                        : 'border-border/60 dark:border-white/10 bg-ivory/40 dark:bg-white/[0.02] text-charcoal-muted hover:border-border'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold">{mod}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" icon={Save} type="submit">
              Save Permissions
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW ROLE MODAL */}
      {selectedRole && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Role Profile & Granted Privileges"
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-border/60 dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                    {selectedRole.name}
                  </h3>
                  <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    {selectedRole.code}
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  {selectedRole.assignedEmployees} Rostered Employees with this security profile
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedRole.status === 'Active' ? 'active' : 'inactive'} size="sm" />
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Module Coverage</span>
                <span className="text-sm font-semibold text-accent mt-1 block">
                  {selectedRole.permissions?.length || 0} / {MODULES.length} Systems
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block mb-1">Role Description</span>
              <p className="text-xs text-charcoal dark:text-gray-300 leading-relaxed bg-ivory/40 dark:bg-white/[0.02] p-3 rounded-xl border border-border/60 dark:border-white/10">
                {selectedRole.description || 'No description provided.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block mb-2">Granted Modules</span>
              <div className="flex flex-wrap gap-1.5">
                {MODULES.map((mod) => {
                  const hasAccess = selectedRole.permissions?.includes(mod);
                  return (
                    <span
                      key={mod}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                        hasAccess
                          ? 'bg-accent/15 text-accent border-accent/30 font-semibold'
                          : 'bg-charcoal/5 dark:bg-white/[0.03] text-charcoal-muted/50 border-border/40 line-through'
                      }`}
                    >
                      {hasAccess && <CheckCircle className="w-3 h-3" />}
                      <span>{mod}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/60 dark:border-white/10">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedRole);
                }}
              >
                Edit Permissions
              </Button>
              <Button variant="gold" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete role "${selectedRole?.name}"? Assigned users will lose privileges.`}
        confirmText="Delete Role"
        type="danger"
      />
    </div>
  );
};

export default RolesPermissionsPage;
