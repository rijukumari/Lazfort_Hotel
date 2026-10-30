import React, { useState, useMemo } from 'react';
import { PageHeader, StatCard, Button, StatusBadge, Modal, FormField, Input, Select } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Plus,
  Eye,
  Download,
  Filter,
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const LeaveRequestsPage = () => {
  const { staff = [], updateStaff } = useERP();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Initial Leave Requests Data
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_staff_leaves');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load leaves', e);
    }

    return [
      {
        id: 'LV-101',
        staffId: 'stf-005',
        staffName: 'Elena Rostova',
        department: 'Housekeeping',
        leaveType: 'Annual Leave',
        fromDate: '2026-10-28',
        toDate: '2026-11-04',
        totalDays: 7,
        reason: 'Annual family leave scheduled and approved prior to Monaco Grand Prix.',
        requestDate: '2026-10-15',
        status: 'approved',
      },
      {
        id: 'LV-102',
        staffId: 'stf-004',
        staffName: 'Julian Henderson',
        department: 'F&B Service',
        leaveType: 'Casual Leave',
        fromDate: '2026-11-02',
        toDate: '2026-11-03',
        totalDays: 2,
        reason: 'Sommelier Masterclass certification examination in Bordeaux.',
        requestDate: '2026-10-25',
        status: 'pending',
      },
      {
        id: 'LV-103',
        staffId: 'stf-002',
        staffName: 'Camilla Valente',
        department: 'Front Desk',
        leaveType: 'Sick Leave',
        fromDate: '2026-10-20',
        toDate: '2026-10-21',
        totalDays: 1,
        reason: 'Medical appointment with specialist in Nice.',
        requestDate: '2026-10-19',
        status: 'approved',
      },
      {
        id: 'LV-104',
        staffId: 'stf-001',
        staffName: 'Sebastian Laurent',
        department: 'Concierge',
        leaveType: 'Emergency Leave',
        fromDate: '2026-10-10',
        toDate: '2026-10-12',
        totalDays: 2,
        reason: 'Family emergency requiring travel to Lyon.',
        requestDate: '2026-10-09',
        status: 'rejected',
        rejectReason: 'Peak hotel arrivals weekend; alternative coverage could not be arranged.',
      },
    ];
  });

  const persistLeaves = (list) => {
    setLeaveRequests(list);
    try {
      localStorage.setItem('lazfort_staff_leaves', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save leaves', e);
    }
  };

  // Metrics
  const totalRequests = leaveRequests.length;
  const pendingCount = leaveRequests.filter(l => l.status === 'pending').length;
  const approvedCount = leaveRequests.filter(l => l.status === 'approved').length;
  const rejectedCount = leaveRequests.filter(l => l.status === 'rejected').length;
  const onLeaveToday = leaveRequests.filter(l => {
    const today = '2026-10-30';
    return l.status === 'approved' && l.fromDate <= today && l.toDate >= today;
  }).length;

  // Modal States
  const [viewModal, setViewModal] = useState(null);
  const [decisionModal, setDecisionModal] = useState(null); // { request, action: 'approve' | 'reject' }
  const [decisionNotes, setDecisionNotes] = useState('');
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState({
    staffId: '',
    leaveType: 'Annual Leave',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const handleOpenDecision = (req, action) => {
    setDecisionModal({ request: req, action });
    setDecisionNotes('');
  };

  const handleConfirmDecision = () => {
    if (!decisionModal) return;
    const { request, action } = decisionModal;
    const updatedStatus = action === 'approve' ? 'approved' : 'rejected';

    const updated = leaveRequests.map(l => {
      if (l.id === request.id) {
        return {
          ...l,
          status: updatedStatus,
          decisionDate: new Date().toISOString().split('T')[0],
          decisionNotes,
          rejectReason: action === 'reject' ? decisionNotes || 'Declined by HR Lead' : undefined,
        };
      }
      return l;
    });

    persistLeaves(updated);

    // If approved and encompasses today, update staff status in ERPContext if available
    if (action === 'approve' && updateStaff) {
      updateStaff(request.staffId, { status: 'on_leave' });
    }

    showToast(
      action === 'approve' ? 'Leave Request Approved' : 'Leave Request Rejected',
      `Leave request ${request.id} for ${request.staffName} marked as ${updatedStatus}.`,
      action === 'approve' ? 'success' : 'info'
    );

    setDecisionModal(null);
  };

  const handleCreateLeaveRequest = (e) => {
    e.preventDefault();
    const assignedStaff = staff.find(s => s.id === newLeaveData.staffId) || {
      name: 'Staff Member',
      department: 'Operations',
    };

    const fromDate = new Date(newLeaveData.fromDate);
    const toDate = new Date(newLeaveData.toDate);
    const totalDays = Math.max(1, Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1);

    const newReq = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      staffId: newLeaveData.staffId,
      staffName: assignedStaff.name,
      department: assignedStaff.department,
      leaveType: newLeaveData.leaveType,
      fromDate: newLeaveData.fromDate,
      toDate: newLeaveData.toDate,
      totalDays,
      reason: newLeaveData.reason,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    const updated = [newReq, ...leaveRequests];
    persistLeaves(updated);
    setNewRequestModal(false);
    setNewLeaveData({ staffId: '', leaveType: 'Annual Leave', fromDate: '', toDate: '', reason: '' });
    showToast('Leave Request Submitted', `Application ${newReq.id} for ${assignedStaff.name} is now pending approval.`, 'success');
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Request ID', 'Staff ID', 'Staff Name', 'Department', 'Leave Type', 'From Date', 'To Date', 'Total Days', 'Status', 'Reason'],
      ...leaveRequests.map(l => [
        l.id,
        l.staffId,
        `"${l.staffName}"`,
        `"${l.department}"`,
        `"${l.leaveType}"`,
        l.fromDate,
        l.toDate,
        l.totalDays,
        l.status,
        `"${l.reason}"`,
      ]),
    ];
    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Staff_Leave_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Ledger Exported', 'Staff leave records saved in CSV format.', 'success');
  };

  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter(l => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchDept = departmentFilter === 'all' || l.department.toLowerCase() === departmentFilter.toLowerCase();
      return matchStatus && matchDept;
    });
  }, [leaveRequests, statusFilter, departmentFilter]);

  const departments = Array.from(new Set(leaveRequests.map(l => l.department)));

  const columns = [
    {
      key: 'id',
      header: 'Request ID',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-accent text-xs">{item.id}</span>
          <p className="text-[10px] text-charcoal-muted uppercase">{item.requestDate}</p>
        </div>
      ),
    },
    {
      key: 'staffName',
      header: 'Staff Member',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.staffName}</p>
          <span className="text-[11px] text-charcoal-muted font-mono">{item.staffId}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: item => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-light/10 dark:bg-white/10 text-primary dark:text-white">
          {item.department}
        </span>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Classification',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-xs text-primary dark:text-white">{item.leaveType}</span>
          <p className="text-[10px] text-accent font-mono font-bold">{item.totalDays} Days Total</p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Leave Window',
      sortable: true,
      render: item => (
        <span className="text-xs font-mono text-charcoal dark:text-gray-200">
          {item.fromDate} → {item.toDate}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason / Purpose',
      sortable: true,
      render: item => (
        <span className="text-xs text-charcoal-muted line-clamp-1 max-w-[200px]" title={item.reason}>
          {item.reason}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Decision Status',
      sortable: true,
      render: item => {
        let badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        if (item.status === 'approved') badgeColor = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        if (item.status === 'rejected') badgeColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'HR Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewModal(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Full Application"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {item.status === 'pending' && (
            <>
              <button
                onClick={() => handleOpenDecision(item, 'approve')}
                className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1"
                title="Approve Request"
              >
                <CheckCircle className="w-3 h-3" /> Approve
              </button>
              <button
                onClick={() => handleOpenDecision(item, 'reject')}
                className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/25 transition-all flex items-center gap-1"
                title="Reject Request"
              >
                <XCircle className="w-3 h-3" /> Decline
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Leave Requests & Absence Ledger"
        description="Formal review of staff leave applications, medical absences, vacation allotments, and coverage validation."
        badge={`${pendingCount} Awaiting Decision`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export Leave Ledger
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => {
                setNewLeaveData({
                  staffId: staff[0]?.id || 'stf-001',
                  leaveType: 'Annual Leave',
                  fromDate: '',
                  toDate: '',
                  reason: '',
                });
                setNewRequestModal(true);
              }}
            >
              Submit Leave Request
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Applications"
          value={totalRequests}
          change="Lifetime records"
          isPositive={true}
          icon={Calendar}
          subtitle="Processed by HR"
        />
        <StatCard
          title="Pending Review"
          value={pendingCount}
          change="Action required"
          isPositive={pendingCount === 0}
          icon={Clock}
          subtitle="Awaiting GM clearance"
        />
        <StatCard
          title="Approved Absences"
          value={approvedCount}
          change="Authorized"
          isPositive={true}
          icon={CheckCircle}
          subtitle="Coverage allocated"
        />
        <StatCard
          title="Declined Requests"
          value={rejectedCount}
          change="Shift conflict"
          isPositive={rejectedCount === 0}
          icon={XCircle}
          subtitle="Peak period restrictions"
        />
        <StatCard
          title="Staff on Leave Today"
          value={onLeaveToday}
          change="Active absent"
          isPositive={true}
          icon={UserX}
          subtitle="30 Oct 2026 status"
        />
      </div>

      {/* Controls Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-charcoal-muted">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Request Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Declined</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-charcoal-muted">Department:</span>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leave Requests DataTable */}
      <DataTable
        data={filteredLeaves}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search leave requests by staff name, ID, or leave type..."
        pageSize={8}
      />

      {/* View Details Modal */}
      {viewModal && (
        <Modal
          isOpen={!!viewModal}
          onClose={() => setViewModal(null)}
          title={`Leave Application Dossier: ${viewModal.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-charcoal-light/10 dark:bg-white/5">
              <div>
                <span className="text-charcoal-muted block">Staff Member</span>
                <span className="font-semibold text-primary dark:text-white text-sm">{viewModal.staffName}</span>
                <p className="text-[11px] text-charcoal-muted font-mono">{viewModal.staffId} • {viewModal.department}</p>
              </div>
              <div>
                <span className="text-charcoal-muted block">Classification</span>
                <span className="font-bold text-accent">{viewModal.leaveType}</span>
                <p className="text-[11px] text-charcoal-muted">{viewModal.totalDays} Total Days</p>
              </div>
              <div>
                <span className="text-charcoal-muted block">Leave Schedule</span>
                <span className="font-mono font-medium">{viewModal.fromDate} → {viewModal.toDate}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Current Status</span>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  viewModal.status === 'approved' ? 'bg-emerald-500/15 text-emerald-600' : viewModal.status === 'rejected' ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-600'
                }`}>
                  {viewModal.status}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/70 dark:border-white/10 space-y-1">
              <span className="text-charcoal-muted block font-semibold">Narrative & Justification:</span>
              <p className="text-primary dark:text-white leading-relaxed">{viewModal.reason}</p>
            </div>

            {viewModal.rejectReason && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1">
                <span className="block font-semibold">HR Denial Note:</span>
                <p>{viewModal.rejectReason}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setViewModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Decision Modal (Approve or Reject) */}
      {decisionModal && (
        <Modal
          isOpen={!!decisionModal}
          onClose={() => setDecisionModal(null)}
          title={`${decisionModal.action === 'approve' ? 'Approve' : 'Decline'} Leave Application: ${decisionModal.request.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className={`p-3 rounded-xl border ${decisionModal.action === 'approve' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
              <p className="font-bold">
                {decisionModal.action === 'approve' ? 'Confirm Authorization:' : 'Confirm Decline:'}
              </p>
              <p className="text-charcoal-muted mt-1">
                {decisionModal.request.staffName} ({decisionModal.request.department}) — {decisionModal.request.leaveType} ({decisionModal.request.totalDays} Days, {decisionModal.request.fromDate} to {decisionModal.request.toDate}).
              </p>
            </div>

            <FormField label={decisionModal.action === 'approve' ? 'Executive Approval Memo (Optional)' : 'Reason for Decline (Mandatory)'}>
              <Input
                value={decisionNotes}
                onChange={e => setDecisionNotes(e.target.value)}
                placeholder={decisionModal.action === 'approve' ? 'e.g. Approved with departmental coverage' : 'e.g. Schedule clash during Grand Prix arrivals'}
                required={decisionModal.action === 'reject'}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setDecisionModal(null)}>
                Cancel
              </Button>
              <Button
                variant={decisionModal.action === 'approve' ? 'gold' : 'destructive'}
                onClick={handleConfirmDecision}
              >
                {decisionModal.action === 'approve' ? 'Authorize Leave' : 'Confirm Decline'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submit New Leave Request Modal */}
      {newRequestModal && (
        <Modal
          isOpen={newRequestModal}
          onClose={() => setNewRequestModal(false)}
          title="Submit Staff Leave Application"
        >
          <form onSubmit={handleCreateLeaveRequest} className="space-y-4">
            <FormField label="Staff Member">
              <Select
                value={newLeaveData.staffId}
                onChange={e => setNewLeaveData({ ...newLeaveData, staffId: e.target.value })}
                options={staff.map(s => ({
                  value: s.id,
                  label: `${s.name} (${s.department} - ${s.role})`
                }))}
                required
              />
            </FormField>

            <FormField label="Leave Type">
              <Select
                value={newLeaveData.leaveType}
                onChange={e => setNewLeaveData({ ...newLeaveData, leaveType: e.target.value })}
                options={[
                  { value: 'Annual Leave', label: 'Annual Leave (Paid Vacation)' },
                  { value: 'Casual Leave', label: 'Casual Leave' },
                  { value: 'Sick Leave', label: 'Sick / Medical Leave' },
                  { value: 'Emergency Leave', label: 'Emergency Leave' },
                  { value: 'Unpaid Leave', label: 'Unpaid Personal Leave' },
                ]}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="From Date">
                <Input
                  type="date"
                  value={newLeaveData.fromDate}
                  onChange={e => setNewLeaveData({ ...newLeaveData, fromDate: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="To Date">
                <Input
                  type="date"
                  value={newLeaveData.toDate}
                  onChange={e => setNewLeaveData({ ...newLeaveData, toDate: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Reason for Leave Request">
              <Input
                value={newLeaveData.reason}
                onChange={e => setNewLeaveData({ ...newLeaveData, reason: e.target.value })}
                placeholder="Reason or medical certificate summary..."
                required
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setNewRequestModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LeaveRequestsPage;

