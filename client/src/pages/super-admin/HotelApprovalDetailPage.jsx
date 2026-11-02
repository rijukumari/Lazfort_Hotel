import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, Button } from '../../components/ui';
import {
  FileCheck,
  ArrowLeft,
  Building2,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Key,
  CheckCircle2,
} from 'lucide-react';

export const HotelApprovalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotels, updateHotel } = useERP();
  const { showToast } = useToast();

  const [appState, setAppState] = useState({
    id: id || 'app-001',
    applicationId: 'APP-2026-081',
    hotelId: 'hotel-005',
    hotelName: 'Villa Bellissima Bellagio',
    location: 'Lake Como, Italy',
    applicantName: 'Contessa Sofia Moretti',
    applicantEmail: 'sofia@bellissimacomo.it',
    submittedDate: '2026-10-24',
    tier: 'Boutique Elite',
    totalRooms: 34,
    documentsStatus: {
      tourismLicense: true,
      fireSafety: true,
      escrowDeed: false,
      environmentalImpact: true,
    },
    reviewStatus: 'pending',
    rejectionReason: '',
  });

  const [rejectionInput, setRejectionInput] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const matchedHotel = hotels.find(
    h => h.id === appState.hotelId || h.name.toLowerCase().includes(appState.hotelName.toLowerCase())
  );

  const handleApprove = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    setAppState(prev => ({
      ...prev,
      reviewStatus: 'approved',
      documentsStatus: {
        tourismLicense: true,
        fireSafety: true,
        escrowDeed: true,
        environmentalImpact: true,
      },
    }));

    if (matchedHotel) {
      updateHotel(matchedHotel.id, { status: 'active' });
    }

    setIsSubmitting(false);
    showToast(
      'Application Approved',
      `Sovereign operating license granted to ${appState.hotelName}. Property is now active.`,
      'success'
    );
  };

  const handleRejectConfirm = async () => {
    if (!rejectionInput.trim()) {
      showToast('Validation Error', 'Please input reason for dossier rejection.', 'error');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    setAppState(prev => ({
      ...prev,
      reviewStatus: 'rejected',
      rejectionReason: rejectionInput.trim(),
    }));

    if (matchedHotel) {
      updateHotel(matchedHotel.id, { status: 'suspended' });
    }

    setIsSubmitting(false);
    setIsRejecting(false);
    showToast(
      'Application Declined',
      `Application ${appState.applicationId} has been declined. Compliance report generated.`,
      'info'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/hotels/approvals"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Applications Review</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <FileCheck className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Application Dossier: {appState.applicationId}
            </h1>
            <StatusBadge status={appState.reviewStatus} size="sm" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/super-admin/hotels/approvals')}
          >
            Back
          </Button>
          {appState.reviewStatus === 'pending' && !isRejecting && (
            <>
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2 rounded-2xl border border-rose-500 text-rose-600 hover:bg-rose-500/10 text-xs font-bold transition-colors"
              >
                Decline Dossier
              </button>
              <Button
                variant="gold"
                icon={Sparkles}
                loading={isSubmitting}
                onClick={handleApprove}
              >
                Approve Clearance
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {isRejecting && (
            <div className="card-luxury p-6 rounded-3xl border border-rose-500/40 bg-rose-500/[0.03] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-base">Decline Property Application</h3>
              </div>
              <p className="text-xs text-charcoal-muted">
                Specify legal, compliance, or structural grounds for declining this onboarding application.
              </p>
              <textarea
                rows={3}
                required
                placeholder="e.g. Escrow deposit proof insufficient; missing maritime environmental impact clearance..."
                value={rejectionInput}
                onChange={e => setRejectionInput(e.target.value)}
                className="w-full p-3.5 text-xs bg-white dark:bg-primary-900/60 border border-rose-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-primary dark:text-white"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsRejecting(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" loading={isSubmitting} onClick={handleRejectConfirm}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}

          {appState.rejectionReason && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Grounds for Dossier Rejection</span>
              </div>
              <p className="text-xs italic">&ldquo;{appState.rejectionReason}&rdquo;</p>
            </div>
          )}

          {/* Card: Estate Information */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Property Identity & Application Details
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Official commercial name, destination territory, and applicant dossier.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1 p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60">
                <span className="text-[10px] font-mono uppercase text-charcoal-muted">Property Name</span>
                <p className="font-serif font-bold text-base text-primary dark:text-white">{appState.hotelName}</p>
                <p className="text-charcoal-muted flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {appState.location}
                </p>
              </div>

              <div className="space-y-1 p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60">
                <span className="text-[10px] font-mono uppercase text-charcoal-muted">Commercial Scope</span>
                <p className="font-serif font-bold text-base text-accent">{appState.tier}</p>
                <p className="text-charcoal-muted flex items-center gap-1 pt-1 font-mono">
                  <Key className="w-3.5 h-3.5 text-accent" />
                  {appState.totalRooms} Luxury Keys
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <span className="text-charcoal-muted text-[11px] block">Applicant Executive</span>
                <p className="font-semibold text-primary dark:text-white mt-0.5">{appState.applicantName}</p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[11px] block">Contact Email</span>
                <p className="font-mono text-accent mt-0.5">{appState.applicantEmail}</p>
              </div>
              <div>
                <span className="text-charcoal-muted text-[11px] block">Submission Date</span>
                <p className="font-mono text-primary dark:text-white mt-0.5">{appState.submittedDate}</p>
              </div>
            </div>
          </div>

          {/* Card: Required Documents Verification Checklist */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Regulatory Compliance & Document Verification
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Audited documentation submitted for sovereign platform licensing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Tourism Board License', desc: 'National hospitality registry operating permit', ok: appState.documentsStatus.tourismLicense },
                { title: 'Fire Safety & Life Support Systems', desc: 'Emergency evacuation & suppression certification', ok: appState.documentsStatus.fireSafety },
                { title: 'Financial Escrow Deposit Deed', desc: 'Guaranteed customer deposits reserve clearance', ok: appState.documentsStatus.escrowDeed },
                { title: 'Environmental & Maritime Clearance', desc: 'Coastal and sovereign territory eco-compliance', ok: appState.documentsStatus.environmentalImpact },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${doc.ok
                    ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                    : 'border-amber-500/30 bg-amber-500/[0.03]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-primary dark:text-white">{doc.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${doc.ok
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                    >
                      {doc.ok ? 'Verified' : 'Pending Audit'}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted mt-1.5">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Decision Summary (4 Columns) */}
        <div className="lg:col-span-4 sticky top-6 space-y-6">
          <div className="card-luxury p-6 rounded-3xl border border-accent/30 shadow-xl space-y-5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-accent block">
              Dossier Decision Summary
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/80 dark:border-white/10">
                <span className="text-charcoal-muted">Application Ref</span>
                <span className="font-mono font-bold text-accent">{appState.applicationId}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/80 dark:border-white/10">
                <span className="text-charcoal-muted">Current Review State</span>
                <span className="font-mono font-bold uppercase text-primary dark:text-white">
                  {appState.reviewStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/80 dark:border-white/10">
                <span className="text-charcoal-muted">Audit Completion</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {Object.values(appState.documentsStatus).filter(Boolean).length} / 4 Documents
                </span>
              </div>
            </div>

            {appState.reviewStatus === 'pending' && (
              <div className="pt-2 space-y-2.5">
                <Button
                  variant="gold"
                  icon={Sparkles}
                  loading={isSubmitting}
                  onClick={handleApprove}
                  className="w-full py-3"
                >
                  Approve Clearance
                </Button>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="w-full py-2.5 rounded-2xl border border-rose-500/50 text-rose-600 text-xs font-semibold hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  Decline Application
                </button>
              </div>
            )}

            {appState.reviewStatus === 'approved' && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                <span className="font-bold text-xs uppercase tracking-wider block">Clearance Fully Approved</span>
                <p className="text-[11px] mt-0.5">Sovereign resort credential assigned.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelApprovalDetailPage;

