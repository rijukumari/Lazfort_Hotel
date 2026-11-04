import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge, ConfirmDialog } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Building2,
  Users,
  CheckCircle,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  Briefcase,
  Shield,
  Layers
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

const INITIAL_DEPARTMENTS = [
  {
    id: 'DEP-01',
    code: 'FDC',
    name: 'Front Desk & Concierge',
    head: 'Sebastian Laurent',
    employeeCount: 5,
    status: 'Active',
    description: 'First touchpoint guest hospitality, VIP reception, Clefs d’Or concierge and luggage dispatch.',
    budget: '$450,000 / yr',
    location: 'Main Lobby & VIP Lounge'
  },
  {
    id: 'DEP-02',
    code: 'EHS',
    name: 'Executive Housekeeping & Sanitization',
    head: 'Margaux Dubois',
    employeeCount: 8,
    status: 'Active',
    description: 'Five-star suite hygiene, turndown service, linen inventory, and white-glove floor audits.',
    budget: '$620,000 / yr',
    location: 'Wing B Operations Depot'
  },
  {
    id: 'DEP-03',
    code: 'FBS',
    name: 'Haute Cuisine & Beverage Service',
    head: 'Julian Henderson',
    employeeCount: 6,
    status: 'Active',
    description: 'Michelin-standard dining, room service banqueting, sommelier wine cellar and mixology bars.',
    budget: '$780,000 / yr',
    location: 'The Grand Salon & Cellar'
  },
  {
    id: 'DEP-04',
    code: 'EFA',
    name: 'Engineering, Facilities & Assets',
    head: 'Jean-Luc Delacroix',
    employeeCount: 4,
    status: 'Active',
    description: 'HVAC automation, electrical maintenance, plumbing integrity and plant asset monitoring.',
    budget: '$340,000 / yr',
    location: 'Sub-Level Plant & Facility Hub'
  },
  {
    id: 'DEP-05',
    code: 'GRP',
    name: 'Guest Relations & VIP Protocol',
    head: 'Camilla Valente',
    employeeCount: 3,
    status: 'Active',
    description: 'Sovereign protocol management, guest feedback resolution and personalized luxury itineraries.',
    budget: '$280,000 / yr',
    location: 'Mezzanine Executive Suite'
  },
  {
    id: 'DEP-06',
    code: 'FTA',
    name: 'Finance, Treasury & Audit',
    head: 'Alistair Sterling',
    employeeCount: 2,
    status: 'Active',
    description: 'Daily night audit reconciliation, vendor settlements, payroll accounting and tax compliance.',
    budget: '$310,000 / yr',
    location: 'Administrative Floor Wing C'
  }
];

export const DepartmentsPage = () => {
  const navigate = useNavigate();
  const { staff = [] } = useERP();
  const { showToast } = useToast();

  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_departments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load departments from storage', e);
    }
    return INITIAL_DEPARTMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lazfort_departments', JSON.stringify(departments));
    } catch (e) {
      console.warn('Failed to save departments', e);
    }
  }, [departments]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  // KPI Metrics
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.status === 'Active').length;
  const totalEmployees = useMemo(() => {
    return departments.reduce((acc, curr) => acc + (Number(curr.employeeCount) || 0), 0);
  }, [departments]);

  // Filtered List
  const filteredDepartments = useMemo(() => {
    return departments.filter(d => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.head.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [departments, searchTerm, statusFilter]);

  // Actions (Open dedicated pages)
  const handleOpenAdd = () => {
    navigate('/hotel-admin/staff/departments/add');
  };

  const handleOpenEdit = (dept) => {
    navigate(`/hotel-admin/staff/departments/edit/${dept.id}`);
  };

  const handleOpenView = (dept) => {
    navigate(`/hotel-admin/staff/departments/details/${dept.id}`);
  };

  const handleOpenDelete = (dept) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedDept) return;
    setDepartments(prev => prev.filter(d => d.id !== selectedDept.id));
    setIsDeleteOpen(false);
    showToast('Department Removed', `Department "${selectedDept.name}" deleted.`, 'success');
  };

  const columns = [
    {
      header: 'Department Details',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight">{row.name}</p>
            <p className="text-[11px] text-charcoal-muted line-clamp-1 max-w-[260px]">{row.description}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Code',
      accessor: 'code',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
          {row.code}
        </span>
      )
    },
    {
      header: 'Department Head',
      accessor: 'head',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[10px] font-bold text-accent">
            {row.head.charAt(0)}
          </div>
          <span className="text-xs font-medium text-charcoal dark:text-gray-200">{row.head}</span>
        </div>
      )
    },
    {
      header: 'Employees',
      accessor: 'employeeCount',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-primary dark:text-white bg-ivory dark:bg-white/5 px-2.5 py-1 rounded-md border border-border/60 dark:border-white/10 whitespace-nowrap inline-flex items-center gap-1.5 shrink-0">
          <span>{row.employeeCount}</span>
          <span className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold">Staff</span>
        </span>
      )
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
            title="View Department Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Department"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1.5 rounded-lg hover:bg-rose-500/15 text-charcoal-muted hover:text-rose-500 transition-colors"
            title="Delete Department"
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
        title="Department Management"
        description="Organize hotel functional divisions, designate department heads, and monitor active employee rosters."
        badge="Hotel Governance"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Department
          </Button>
        }
      />

      {/* 3 Metric Cards per specification */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Departments"
          value={totalDepartments}
          icon={Building2}
          subtitle="Operational hotel divisions"
        />
        <StatCard
          title="Active Departments"
          value={activeDepartments}
          icon={CheckCircle}
          subtitle="Under active leadership"
        />
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          subtitle="Rostered team members"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 dark:bg-[#111827]/90 p-3 rounded-2xl border border-border/80 dark:border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search department name, code, or department head..."
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
        data={filteredDepartments}
        keyField="id"
        pageSize={8}
        showSearch={false}
        searchPlaceholder=""
        emptyMessage="No departments found matching search criteria."
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete department "${selectedDept?.name}"? Assigned employees will need re-assignment.`}
        confirmText="Delete Department"
        type="danger"
      />
    </div>
  );
};

export default DepartmentsPage;
