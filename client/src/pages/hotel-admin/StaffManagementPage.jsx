import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { mockStaff } from '../../data/mockStaff';
import { DataTable } from '../../components/data-display/DataTable';
import { ViewToggle } from '../../components/ui/ViewToggle';
import { Plus, Edit, Eye, Clock, Trash2, Mail, Phone, Calendar, Building2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffManagementPage = () => {
  const navigate = useNavigate();
  const { staff = mockStaff, deleteStaff } = useERP();
  const { showToast } = useToast();
  const [deleteStaffId, setDeleteStaffId] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_staff') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_staff', mode);
    } catch {}
  };

  const handleConfirmDelete = () => {
    if (!deleteStaffId) return;
    deleteStaff(deleteStaffId);
    setDeleteStaffId(null);
    showToast('Staff Member Removed', 'Staff profile successfully removed from operations.', 'success');
  };

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
          <button
            onClick={() => setDeleteStaffId(item.id)}
            className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Remove Staff Member"
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
        title="Staff & Workforce Operations"
        description="Hotel personnel directory, shift allocations, departmental clearances, and performance metrics."
        badge={`${staff.length} Active Staff`}
        actions={
          <div className="flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/staff/add')}
            >
              Appoint Staff
            </Button>
          </div>
        }
      />

      {viewMode === 'list' ? (
        <DataTable
          data={staff}
          columns={columns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search staff by name, role, or division..."
          pageSize={8}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => (
            <div
              key={member.id}
              className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status={member.status || 'Active'} size="sm" />
                  <span className="text-[11px] font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                    {member.shift || 'General'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/30"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-tight">
                      {member.name}
                    </h4>
                    <p className="text-xs text-charcoal-muted">{member.role}</p>
                    <span className="text-[11px] text-accent font-semibold">{member.department}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Email:</span>
                    <span className="font-mono text-primary dark:text-white truncate max-w-[170px]">{member.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Contact:</span>
                    <span className="font-mono">{member.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Performance Rating:</span>
                    <span className="font-semibold text-accent">★ {member.performanceRating || '4.9'} / 5.0</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-muted font-mono">{member.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/hotel-admin/staff/details/${member.id}`)}
                    className="p-1.5 rounded-xl border border-border dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
                    title="View Staff Profile"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/hotel-admin/staff/edit/${member.id}`)}
                    className="p-1.5 rounded-xl border border-border dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
                    title="Edit Information"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteStaffId(member.id)}
                    className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Decommission Staff"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Delete Confirmation */}
      {deleteStaffId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteStaffId(null)}
          onConfirm={handleConfirmDelete}
          title="Remove Staff Personnel?"
          message="Are you sure you want to decommission this staff member profile? Their access credentials will be immediately revoked."
          confirmText="Confirm Decommission"
          variant="danger"
        />
      )}
    </div>
  );
};

export default StaffManagementPage;

