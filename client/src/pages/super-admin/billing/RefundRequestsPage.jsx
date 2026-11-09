import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ViewToggle } from '../../../components/ui/ViewToggle';
import { useToast } from '../../../context/ToastContext';
import { useERP } from '../../../context/ERPContext';
import { hotelApi } from '../../../services/hotelApi';
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
  const { refundRequests = [], updateRefundRequestStatus } = useERP();
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('lazfort_view_refunds') || 'list';
    } catch {
      return 'list';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lazfort_view_refunds', mode);
    } catch {}
  };
  const [refunds, setRefunds] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_refund_requests');
      if (stored) return JSON.parse(stored);
    } catch { }
    return [];
  });

  useEffect(() => {
    let isMounted = true;
    hotelApi.getRefundRequests({ skipCache: true }).then(data => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setRefunds(data);
      }
    }).catch(() => { });

    return () => { isMounted = false; };
  }, []);

  const persistRefunds = (list) => {
    setRefunds(list);
    try {
      localStorage.setItem('lazfort_refund_requests', JSON.stringify(list));
    } catch { }
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
      r.id === id || r.requestId === id
        ? {
          ...r,
          status: 'approved',
          reviewedBy: 'Super Administrator',
          reviewedDate: new Date().toISOString().split('T')[0],
        }
        : r
    );
    persistRefunds(updated);
    updateRefundRequestStatus?.(id, 'approved');
    setConfirmApproveId(null);
    showToast('Refund Approved', `Refund request ${id} approved and disbursement ledger updated.`, 'success');
  };

  const handleReject = () => {
    if (!rejectItem) return;
    const targetId = rejectItem.id || rejectItem.requestId;
    const updated = refunds.map(r =>
      r.id === targetId || r.requestId === targetId
        ? {
          ...r,
          status: 'rejected',
          reviewedBy: 'Super Administrator',
          reviewedDate: new Date().toISOString().split('T')[0],
        }
        : r
    );
    persistRefunds(updated);
    updateRefundRequestStatus?.(targetId, 'rejected');
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
          <span className="font-mono text-xs font-bold text-accent">{r.request_id || r.requestId || r.id}</span>
          <span className="text-[11px] text-charcoal-muted dark:text-gray-400 block font-mono">
            {r.original_tx_id || r.originalTxId}
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
            {r.guest_name || r.guestName}
          </div>
          <div className="text-[11px] text-charcoal-muted dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-accent/60" />
            <span className="line-clamp-1">{r.hotel_name || r.hotelName}</span>
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

      {/* Claims View: Grid or List */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={refunds}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search by Claim ID, Guest, Hotel, Booking Ref..."
          statusFilterKey="status"
          statusOptions={['pending', 'approved', 'rejected']}
          pageSize={10}
          emptyMessage="No refund claims found matching current criteria."
          actions={
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="card-luxury p-4 rounded-2xl border border-border/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-charcoal-muted">
              Showing <strong className="text-primary dark:text-white">{refunds.length}</strong> claims
            </span>
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {refunds.map((r) => (
              <div
                key={r.id}
                className="card-luxury p-5 rounded-2xl border border-border/80 dark:border-white/10 space-y-4 hover:border-accent/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">{r.claimId || r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-tight">
                      {r.guestName}
                    </h4>
                    <p className="text-xs text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-accent" />
                      <span>{r.hotelName}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory dark:bg-black/30 border border-border/60 dark:border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Booking Ref:</span>
                      <span className="font-mono font-semibold text-primary dark:text-white">{r.bookingRef}</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Reason:</span>
                      <span className="truncate max-w-[170px] text-primary dark:text-white">{r.reason}</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-muted">
                      <span>Logged Date:</span>
                      <span className="font-mono text-[11px]">{r.date}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/70 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal-muted uppercase block">Claim Value</span>
                    <span className="font-serif font-bold text-lg text-primary dark:text-accent">
                      ${Number(r.amount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/super-admin/billing/refunds/${r.id}`)}
                      className="p-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent transition-colors flex items-center gap-1 text-xs font-semibold px-2"
                      title="Inspect Claim"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setConfirmApproveId(r.id)}
                          className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="Authorize Refund"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Decline Refund"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


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

