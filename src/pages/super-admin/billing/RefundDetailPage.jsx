import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { initialRefundRequests } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

export const RefundDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [refund, setRefund] = useState(() => {
    return initialRefundRequests.find(r => r.id === id) || initialRefundRequests[0];
  });

  const [confirmApprove, setConfirmApprove] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    setRefund(prev => ({
      ...prev,
      status: 'approved',
      reviewedBy: 'Lord Alistair Sterling (Super Admin)',
      reviewedDate: new Date().toISOString().split('T')[0],
    }));
    setConfirmApprove(false);
    showToast(
      'Refund Approved',
      `Disbursement of $${refund.requestedAmount.toLocaleString()} USD has been cleared to ${refund.guestName}.`,
      'success'
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      showToast('Reason Required', 'Please specify grounds for rejecting the refund request.', 'error');
      return;
    }
    setRefund(prev => ({
      ...prev,
      status: 'rejected',
      reviewedBy: 'Lord Alistair Sterling (Super Admin)',
      reviewedDate: new Date().toISOString().split('T')[0],
      rejectionReason: rejectionReason.trim(),
    }));
    setRejectModalOpen(false);
    showToast(
      'Refund Declined',
      `Claim for ${refund.guestName} has been declined. Notification transmitted.`,
      'info'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/billing/refunds"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Refund Requests</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <span className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <RotateCcw className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  Refund Dossier {refund.requestId}
                </h1>
                <StatusBadge status={refund.status} size="sm" />
              </div>
              <p className="font-mono text-xs text-charcoal-muted mt-0.5">
                Original Transaction: {refund.originalTxId}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/super-admin/billing/refunds')}
            className="px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-900/50 transition-colors"
          >
            Back to Registry
          </button>
          {refund.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-colors"
              >
                Decline Claim
              </button>
              <button
                type="button"
                onClick={() => setConfirmApprove(true)}
                className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer"
              >
                Authorize Disbursement
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Claim Dossier (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80">
              <div>
                <span className="text-[10px] font-mono text-accent font-bold uppercase block">
                  Requested Disbursement Amount
                </span>
                <span className="text-3xl font-serif font-bold text-rose-600 dark:text-rose-400 mt-1 block">
                  ${refund.requestedAmount.toLocaleString()} USD
                </span>
                <span className="text-xs text-charcoal-muted mt-0.5 block">
                  Original Invoice Total: ${refund.originalAmount.toLocaleString()} USD
                </span>
              </div>
              <StatusBadge status={refund.status} size="lg" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Claimant Guest</span>
                <p className="font-semibold text-primary dark:text-white text-sm mt-1">{refund.guestName}</p>
                <span className="text-xs text-charcoal-muted font-mono block mt-0.5">
                  Booking Reference: {refund.bookingRef}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/80">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Hotel Property</span>
                <p className="font-semibold text-primary dark:text-white text-sm mt-1">{refund.hotelName}</p>
                <span className="text-xs text-charcoal-muted font-mono block mt-0.5">
                  Lodged on: {refund.requestDate}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Stated Grounds & Grievance
              </h3>
              <div className="p-5 rounded-2xl bg-ivory/70 dark:bg-primary-900/40 border border-border/80 text-sm italic text-charcoal dark:text-gray-200 leading-relaxed">
                "{refund.reason}"
              </div>
            </div>

            {refund.reviewedBy && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Executive Review Logged</span>
                </p>
                <p>
                  Claim reviewed and finalized by <strong>{refund.reviewedBy}</strong> on {refund.reviewedDate}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Audit Trail Meta</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Claim Reference</span>
                <span className="font-mono font-bold text-primary dark:text-white">{refund.requestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Lodged Date</span>
                <span className="font-mono text-primary dark:text-white">{refund.requestDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Sovereign Vault Status</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Escrow Verified</span>
              </div>
            </div>

            {refund.status === 'pending' && (
              <button
                type="button"
                onClick={() => setConfirmApprove(true)}
                className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Authorize Disbursement</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {confirmApprove && (
        <ConfirmDialog
          isOpen={confirmApprove}
          onClose={() => setConfirmApprove(false)}
          onConfirm={handleApprove}
          title="Authorize Sovereign Refund Disbursement?"
          message={
            <span>
              Are you sure you want to approve disbursement of{' '}
              <strong>${refund.requestedAmount.toLocaleString()} USD</strong> to <strong>{refund.guestName}</strong>?
              This will initiate an automated SWIFT / gateway reversal.
            </span>
          }
          confirmText="Yes, Authorize Disbursement"
          variant="primary"
        />
      )}

      {rejectModalOpen && (
        <ConfirmDialog
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleReject}
          title="Decline Refund Claim"
          message={
            <div className="space-y-3 pt-2">
              <p className="text-xs text-charcoal-muted">
                Specify official platform reasons for rejecting this refund request:
              </p>
              <textarea
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-ivory/50 dark:bg-primary-900/40 text-primary dark:text-white"
                placeholder="e.g. Reservation policy non-refundable window expired..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />
            </div>
          }
          confirmText="Confirm Rejection"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RefundDetailPage;
