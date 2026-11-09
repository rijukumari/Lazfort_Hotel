import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Tabs, SearchBar, StatusBadge, ConfirmDialog, StatCard } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/data-display/DataTable';
import { hotelApi } from '../../services/hotelApi';
import {
  FileCheck,
  Eye,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const HotelApprovalsPage = () => {
  const { hotels = [], updateHotel } = useERP();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Dynamically derive approval applications from real hote    l records
  const dynamicApplications = useMemo(() => {
    return (hotels || []).map(h => ({
      id: `app-${h.id}`,
      applicationId: `APP-${h.code || h.id}`,
      hotelId: h.id,
      hotelName: h.name,
      location: h.location || h.city || 'Global Destination',
      applicantName: h.adminName || 'General Manager',
      applicantEmail: h.email || 'gm@resort.com',
      submittedDate: (h.createdAt || h.created_at || new Date().toISOString()).split('T')[0],
      tier: h.subscriptionPlan || 'Palace Enterprise',
      totalRooms: Number(h.totalRooms || h.total_rooms) || 0,
      documentsStatus: {
        tourismLicense: true,
        fireSafety: true,
        escrowDeed: h.status === 'active',
        environmentalImpact: true,
      },
      reviewStatus: h.status === 'pending_approval' ? 'pending' : h.status === 'active' ? 'approved' : 'rejected',
    }));
  }, [hotels]);

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setApplications(dynamicApplications);
  }, [dynamicApplications]);

  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [appToApprove, setAppToApprove] = useState(null);
  const [appToReject, setAppToReject] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Trigger dedicated Hotel Approvals API on mount
  useEffect(() => {
    let isMounted = true;
    hotelApi.getHotelApprovals().catch(() => { });
    return () => { isMounted = false; };
  }, []);

  const pendingCount = applications.filter(a => a.reviewStatus === 'pending').length;
  const approvedCount = applications.filter(a => a.reviewStatus === 'approved').length;
  const rejectedCount = applications.filter(a => a.reviewStatus === 'rejected').length;

  const handleConfirmApproval = () => {
    if (!appToApprove) return;

    setApplications(prev =>
      prev.map(a =>
        a.id === appToApprove.id
          ? {
            ...a,
            reviewStatus: 'approved',
            reviewedBy: 'Super Admin Directorate',
            reviewedDate: new Date().toISOString().split('T')[0],
            documentsStatus: {
              tourismLicense: true,
              fireSafety: true,
              escrowDeed: true,
              environmentalImpact: true,
            },
          }
          : a
      )
    );

    updateHotel(appToApprove.hotelId, { status: 'active', rejection_reason: null });

    // Also persist to REST API
    hotelApi.updateHotel(appToApprove.hotelId, { status: 'active', rejection_reason: null }).catch(() => { });

    showToast(
      'Property Approved & Commissioned',
      `${appToApprove.hotelName} has been authorized. Immediate operational clearance active.`,
      'success'
    );
    setAppToApprove(null);
  };

  const handleConfirmRejection = () => {
    if (!appToReject) return;
    const reason = rejectionReasonInput.trim() || 'Required sovereign compliance documents incomplete or missing.';

    setApplications(prev =>
      prev.map(a =>
        a.id === appToReject.id
          ? {
            ...a,
            reviewStatus: 'rejected',
            rejectionReason: reason,
            reviewedBy: 'Super Admin Directorate',
            reviewedDate: new Date().toISOString().split('T')[0],
          }
          : a
      )
    );

    updateHotel(appToReject.hotelId, { status: 'suspended', rejection_reason: reason });

    // Also persist to REST API
    hotelApi.updateHotel(appToReject.hotelId, { status: 'suspended', rejection_reason: reason }).catch(() => { });

    showToast(
      'Application Declined',
      `Application for ${appToReject.hotelName} declined: ${reason}`,
      'info'
    );
    setAppToReject(null);
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesTab =
        activeTab === 'all' || app.reviewStatus === activeTab;
      const matchesSearch =
        app.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchTerm]);

  const approvalTabs = [
    { id: 'pending', label: 'Pending Review', count: pendingCount },
    { id: 'approved', label: 'Approved Properties', count: approvedCount },
    { id: 'rejected', label: 'Declined Dossiers', count: rejectedCount },
    { id: 'all', label: 'All Applications', count: applications.length },
  ];

  const columns = [
    {
      key: 'applicationId',
      header: 'Application Ref',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{item.applicationId}</span>
          <span className="block text-[10px] text-charcoal-muted font-mono">{item.submittedDate}</span>
        </div>
      ),
    },
    {
      key: 'hotelName',
      header: 'Hotel Property',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white font-serif whitespace-nowrap">{item.hotelName}</p>
          <span className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5 whitespace-nowrap">
            <MapPin className="w-3 h-3 text-accent shrink-0" />
            {item.location}
          </span>
        </div>
      ),
    },
    {
      key: 'applicantName',
      header: 'Applicant / GM',
      sortable: true,
      render: item => (
        <div className="text-xs whitespace-nowrap">
          <p className="font-medium text-primary dark:text-white">{item.applicantName}</p>
          <p className="text-[11px] text-charcoal-muted font-mono">{item.applicantEmail}</p>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Tier & Keys',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => (
        <div className="text-xs whitespace-nowrap">
          <StatusBadge status={item.tier} size="sm" />
          <span className="block text-[11px] font-mono text-charcoal-muted mt-0.5">{item.totalRooms} Suites</span>
        </div>
      ),
    },
    {
      key: 'documentsStatus',
      header: 'Verification Dossier',
      className: 'whitespace-nowrap',
      render: item => {
        const verifiedCount = Object.values(item.documentsStatus).filter(Boolean).length;
        const totalDocs = Object.keys(item.documentsStatus).length;
        const isComplete = verifiedCount === totalDocs;
        return (
          <div className="whitespace-nowrap">
            <span className={`font-mono text-xs font-bold ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
              {verifiedCount} of {totalDocs} Verified
            </span>
            <div className="w-20 bg-gray-200 dark:bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
              <div
                className={`h-1 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${(verifiedCount / totalDocs) * 100}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'reviewStatus',
      header: 'Review Status',
      sortable: true,
      className: 'whitespace-nowrap',
      render: item => <StatusBadge status={item.reviewStatus} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      className: 'whitespace-nowrap min-w-[130px]',
      render: item => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            onClick={() => navigate(`/super-admin/hotels/approvals/${item.id}`)}
            className="p-1.5 text-xs text-charcoal-muted hover:text-accent rounded-lg hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            title="Review Full Application Dossier"
          >
            <Eye className="w-4 h-4" />
          </button>
          {item.reviewStatus === 'pending' && (
            <>
              <button
                onClick={() => setAppToApprove(item)}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setAppToReject(item);
                  setRejectionReasonInput('');
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Hotel Approvals & Sovereign Clearances"
        description="Audit luxury hotel intake dossiers, verify statutory certifications, and approve platform operational clearances."
        badge={`${pendingCount} Pending Review`}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Awaiting Clearance"
          value={pendingCount}
          subtitle="In regulatory compliance queue"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved Estates"
          value={approvedCount}
          subtitle="Operational license verified"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Declined Dossiers"
          value={rejectedCount}
          subtitle="Compliance charter deficit"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Tabs and Search */}
      <div className="card-luxury p-5 rounded-3xl border border-border/80 dark:border-accent/25 space-y-4">
        <Tabs
          tabs={approvalTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="w-full sm:max-w-md pt-2">
          <SearchBar
            placeholder="Search by hotel, applicant, or ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredApps}
        columns={columns}
        keyExtractor={item => item.id}
        showSearch={false}
        pageSize={6}
      />

      {/* Approval Confirmation Dialog */}
      {appToApprove && (
        <ConfirmDialog
          isOpen={true}
          title="Confirm Hotel Operational Clearance"
          message={`Are you sure you want to approve sovereign clearance for ${appToApprove.hotelName}? This authorizes immediate live platform provisioning and guest folio activation.`}
          confirmText="Approve Clearance"
          confirmVariant="gold"
          onConfirm={handleConfirmApproval}
          onCancel={() => setAppToApprove(null)}
        />
      )}

      {/* Reject Confirmation Dialog */}
      {appToReject && (
        <ConfirmDialog
          isOpen={true}
          title="Decline Hotel Application"
          message={`Are you sure you want to decline ${appToReject.hotelName}? Provide an optional reason below.`}
          confirmText="Decline Application"
          confirmVariant="danger"
          onConfirm={handleConfirmRejection}
          onCancel={() => setAppToReject(null)}
        />
      )}
    </div>
  );
};

export default HotelApprovalsPage;

