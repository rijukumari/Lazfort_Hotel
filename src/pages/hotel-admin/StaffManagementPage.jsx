import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { mockStaff } from '../../data/mockStaff';
import { DataTable } from '../../components/data-display/DataTable';
import { Plus, Edit, Eye, Clock } from 'lucide-react';

export const StaffManagementPage = () => {
  const navigate = useNavigate();
  const { staff = mockStaff } = useERP();

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight font-serif">{item.name}</p>
            <p className="text-xs text-charcoal-muted">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role & Division',
      sortable: true,
      render: item => (
        <div>
          <p className="font-medium text-primary dark:text-white text-xs">{item.role}</p>
          <span className="text-[11px] text-accent font-semibold">{item.department}</span>
        </div>
      ),
    },
    {
      key: 'shift',
      header: 'Shift Schedule',
      sortable: true,
      render: item => (
        <span className="text-xs text-charcoal-muted flex items-center gap-1 font-mono">
          <Clock className="w-3.5 h-3.5 text-accent" />
          {item.shift}
        </span>
      ),
    },
    {
      key: 'performanceScore',
      header: 'Performance',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${item.performanceScore}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {item.performanceScore}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Duty Status',
      sortable: true,
      render: item => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/hotel-admin/staff/edit/${item.id}`)}
            className="p-1.5 rounded-xl border border-border dark:border-border-dark text-xs text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
            title="Edit Staff Member on Dedicated Page"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/staff/${item.id}`)}
            className="p-1.5 rounded-xl border border-border dark:border-border-dark text-xs text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
            title="View Details on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Staff & Workforce Operations"
        description="Hotel personnel directory, shift allocations, departmental clearances, and performance metrics."
        badge={`${staff.length} Active Staff`}
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/hotel-admin/staff/add')}
          >
            Appoint Staff
          </Button>
        }
      />

      <DataTable
        data={staff}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search staff by name, role, or division..."
        pageSize={8}
      />
    </div>
  );
};

export default StaffManagementPage;

