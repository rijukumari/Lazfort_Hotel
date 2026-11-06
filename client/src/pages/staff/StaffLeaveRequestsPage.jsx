import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge, Modal } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  Search,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffLeaveRequestsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [leaveRequests] = useState([
    {
      id: 'LVR-2026-031',
      leaveType: 'Annual Vacation Leave',
      startDate: 'Dec 24, 2026',
      endDate: 'Dec 28, 2026',
      daysCount: 5,
      reason: 'Annual family holiday travel to Geneva.',
      appliedOn: 'Nov 01, 2026',
      status: 'Approved',
      approvedBy: 'Julian St. Clair (GM)',
    },
    {
      id: 'LVR-2026-024',
      leaveType: 'Personal / Compassionate Leave',
      startDate: 'Nov 18, 2026',
      endDate: 'Nov 19, 2026',
      daysCount: 2,
      reason: 'Family legal appointment in Milan.',
      appliedOn: 'Oct 28, 2026',
      status: 'Pending',
      approvedBy: 'Awaiting HR & Department Head',
    },
    {
      id: 'LVR-2026-018',
      leaveType: 'Medical / Health Leave',
      startDate: 'Oct 12, 2026',
      endDate: 'Oct 13, 2026',
      daysCount: 2,
      reason: 'Specialist dental surgical appointment with medical certificate.',
      appliedOn: 'Oct 10, 2026',
      status: 'Approved',
      approvedBy: 'Dr. Vivienne Moreau (Medical Officer)',
    },
    {
      id: 'LVR-2026-012',
      leaveType: 'Unpaid Special Sabbatical',
      startDate: 'Aug 05, 2026',
      endDate: 'Aug 12, 2026',
      daysCount: 7,
      reason: 'Monaco Grand Prix blackout dates requested during peak occupancy.',
      appliedOn: 'Jul 20, 2026',
      status: 'Rejected',
      approvedBy: 'Julian St. Clair (Peak Season Policy)',
    },
  ]);

  const columns = [
    {
      key: 'id',
      header: 'Request Ref',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-accent">{r.id}</span>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Category',
      render: (r) => (
        <div>
          <span className="font-serif font-bold text-sm text-primary dark:text-white block">
            {r.leaveType}
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">
            Applied on {r.appliedOn}
          </span>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Duration & Dates',
      render: (r) => (
        <div>
          <span className="text-xs font-medium text-primary dark:text-white block">
            {r.startDate} — {r.endDate}
          </span>
          <span className="font-mono text-[11px] text-accent font-bold">
            {r.daysCount} Working Days
          </span>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Justification / Notes',
      render: (r) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-300 max-w-xs truncate block italic">
          {r.reason}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Review Status',
      render: (r) => (
        <StatusBadge
          status={r.status === 'Approved' ? 'completed' : r.status === 'Pending' ? 'pending' : 'cancelled'}
          label={r.status}
        />
      ),
    },
    {
      key: 'approvedBy',
      header: 'Approval Authority',
      render: (r) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400">
          {r.approvedBy}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests & Time-Off Ledger"
        subtitle="Historical and pending leave applications, approved holidays, and department authorizations."
        icon={FileText}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Calendar}
              onClick={() => navigate('/staff/schedule/weekly')}
            >
              Weekly Schedule
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/staff/schedule/apply-leave')}
            >
              Submit New Leave Request
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Annual Leave Balance"
          value="18 Days"
          subtitle="Remaining for calendar year"
          icon={Calendar}
        />
        <StatCard
          title="Approved Vacation"
          value="7 Days"
          subtitle="Holiday requests verified"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Authorization"
          value="1 Request"
          subtitle="2 Days awaiting review"
          icon={Clock}
        />
        <StatCard
          title="Sick / Medical Used"
          value="2 Days"
          subtitle="With authorized certificate"
          icon={AlertCircle}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex items-center justify-between border-b border-primary/10 dark:border-white/5 pb-3">
          <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Submitted Applications Ledger
          </h4>
          <Button
            variant="primary"
            size="xs"
            icon={Plus}
            onClick={() => navigate('/staff/schedule/apply-leave')}
          >
            Apply for Leave
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={leaveRequests}
          keyField="id"
          pagination={true}
          pageSize={6}
          emptyMessage="No leave requests filed."
        />
      </div>
    </div>
  );
};

export default StaffLeaveRequestsPage;

