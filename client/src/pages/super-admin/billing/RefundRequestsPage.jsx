import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { initialRefundRequests } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  Building2,
  Calendar,
  AlertTriangle,
  DollarSign,
  FileText,
  User,
} from 'lucide-react';

export const RefundRequestsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [refunds, setRefunds] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_refund_requests');
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialRefundRequests || [];
  });

  const persistRefunds = (list) => {
    setRefunds(list);
    try {
      localStorage.setItem('lazfort_refund_requests', JSON.stringify(list));
    } catch {}
  };

  // Confirmation dialogs
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Metrics
  const pendingCount = useMemo(() => refunds.filter(r => r.status === 'pending').length, [refunds]);
  const approvedTotal = useMemo(
    () => refunds.filter(r => r.status === 'approved').reduce((acc, r) => acc + (r.requestedAmount || 0), 0),
    [refunds]
  );
  const rejectedCount = useMemo(() => refunds.filter(r => r.status === 'rejected').length, [refunds]);

  const handleApprove = (id) => {
    const updated = refunds.map(r =>
      r.id === id
        ? {
          ...r,
          status: 'approved',
          reviewedBy: 'Lord Alistair Sterling (Super Admin)',
          reviewedDate: new Date().toISOString().split('T')[0],
        }
        : r
    );
    persistRefunds(updated);
    setConfirmApproveId(null);
    showToast('Refund Approved', `Refund request ${id} approved and disbursement ledger updated.`, 'success');
  };

  const handleReject = () => {
    if (!rejectItem) return;
    const updated = refunds.map(r =>
      r.id === rejectItem.id
        ? {
          ...r,
          status: 'rejected',
          reviewedBy: 'Lord Alistair Sterling (Super Admin)',
          reviewedDate: new Date().toISOString().split('T')[0],
        }
        : r
    );
    persistRefunds(updated);
    setRejectItem(null);
    setRejectionReasonInput('');
    showToast('Refund Rejected', 'Refund claim declined with audited note.', 'info');
  };

  const columns = [
    {
      key: 'requestId',
      header: 'Claim & Original Tx',
      render: (r) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{r.requestId}</span>
          <span className="text-[11px] text-charcoal-muted dark:text-gray-400 block font-mono">
            {r.originalTxId}
          </span>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Beneficiary & Hotel',
      render: (r) => (
        <div>
          <div className="font-medium text-xs text-primary dark:text-white flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-accent/80" />
            {r.guestName}
          </div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/60" />
            <span className="line-clamp-1">{r.hotelName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'bookingRef',
      header: 'Booking Ref',
      render: (r) => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-300">
          {r.bookingRef}
        </span>
      ),
    },
    {
      key: 'requestedAmount',
      header: 'Claim Amount',
      render: (r) => (
        <span className="font-serif font-bold text-xs text-rose-600 dark:text-rose-400">
          ${r.requestedAmount?.toLocaleString()} USD
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-1 max-w-[200px]" title={r.reason}>
          {r.reason}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/billing/refunds/${r.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Review Details on Dedicated Page"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {r.status === 'pending' && (
            <>
              <button
                onClick={() => setConfirmApproveId(r.id)}
                className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                title="Approve Refund"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate(`/super-admin/billing/refunds/${r.id}`)}
                className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                title="Reject Refund"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Refund Requests & Adjustments"
        subtitle="Manage customer refund authorizations, charge reversals, and guest dispute settlements"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'Billing & Payments', path: '/super-admin/billing' },
          { label: 'Refund Requests' },
        ]}
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Total Claims Logged"
          value={refunds.length}
          period="audited claims"
          icon={<RotateCcw className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Pending Executive Review"
          value={pendingCount}
          period="action required"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Approved Disbursements"
          value={`$${approvedTotal.toLocaleString()}`}
          period="lifetime reversals"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Declined Claims"
          value={rejectedCount}
          period="non-compensable"
          icon={<XCircle className="w-5 h-5 text-rose-500" />}
        />
      </StatsGrid>

      {/* Claims Table */}
      <DataTable
        columns={columns}
        data={refunds}
        keyExtractor={(r) => r.id}
        searchPlaceholder="Search by Claim ID, Guest, Hotel, Booking Ref..."
        statusFilterKey="status"
        statusOptions={['pending', 'approved', 'rejected']}
        pageSize={10}
        emptyMessage="No refund claims found matching current criteria."
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmApproveId}
        onClose={() => setConfirmApproveId(null)}
        onConfirm={() => confirmApproveId && handleApprove(confirmApproveId)}
        title="Confirm Refund Approval"
        message="Are you sure you want to approve this refund claim? The requested amount will be authorized for settlement credit from the property escrow account (Simulated Action)."
        confirmLabel="Authorize Refund"
        variant="warning"
      />
    </div>
  );
};

export default RefundRequestsPage;

