import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Tabs, SearchBar, StatusBadge, ConfirmDialog, StatCard } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/data-display/DataTable';
import {
  FileCheck,
  Eye,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const INITIAL_APPLICATIONS = [
  {
    id: 'app-001',
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
  },
  {
    id: 'app-002',
    applicationId: 'APP-2026-079',
    hotelId: 'hotel-001',
    hotelName: 'Lazfort Grand Palace & Royal Spa',
    location: 'Monaco, French Riviera',
    applicantName: 'Lord Alistair Sterling',
    applicantEmail: 'alistair@lazfort.com',
    submittedDate: '2026-10-12',
    tier: 'Palace Enterprise',
    totalRooms: 128,
    documentsStatus: {
      tourismLicense: true,
      fireSafety: true,
      escrowDeed: true,
      environmentalImpact: true,
    },
    reviewStatus: 'approved',
    reviewedBy: 'Super Admin Directorate',
    reviewedDate: '2026-10-14',
  },
  {
    id: 'app-003',
    applicationId: 'APP-2026-072',
    hotelId: 'hotel-004',
    hotelName: 'The Golden Pavilion Heritage Manor',
    location: 'Kyoto, Japan',
    applicantName: 'Kenzo Takahashi',
    applicantEmail: 'kenzo@goldenpavilion.jp',
    submittedDate: '2026-09-28',
    tier: 'Grand Luxury',
    totalRooms: 64,
    documentsStatus: {
      tourismLicense: false,
      fireSafety: true,
      escrowDeed: false,
      environmentalImpact: false,
    },
    reviewStatus: 'rejected',
    rejectionReason: 'Zoning clearances did not meet sovereign architectural charter specifications.',
    reviewedBy: 'Super Admin Directorate',
    reviewedDate: '2026-10-02',
  },
];

export const HotelApprovalsPage = () => {
  const { updateHotel } = useERP();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [appToApprove, setAppToApprove] = useState(null);
  const [appToReject, setAppToReject] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

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

    updateHotel(appToApprove.hotelId, { status: 'active' });

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

    updateHotel(appToReject.hotelId, { status: 'suspended' });

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
          <p className="font-semibold text-primary dark:text-white font-serif">{item.hotelName}</p>
          <span className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-accent" />
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
        <div className="text-xs">
          <p className="font-medium text-primary dark:text-white">{item.applicantName}</p>
          <p className="text-[11px] text-charcoal-muted font-mono">{item.applicantEmail}</p>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Tier & Keys',
      sortable: true,
      render: item => (
        <div className="text-xs">
          <StatusBadge status={item.tier} size="sm" />
          <span className="block text-[11px] font-mono text-charcoal-muted mt-0.5">{item.totalRooms} Suites</span>
        </div>
      ),
    },
    {
      key: 'documentsStatus',
      header: 'Verification Dossier',
      render: item => {
        const verifiedCount = Object.values(item.documentsStatus).filter(Boolean).length;
        const totalDocs = Object.keys(item.documentsStatus).length;
        const isComplete = verifiedCount === totalDocs;
        return (
          <div>
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
      render: item => <StatusBadge status={item.reviewStatus} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
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
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setAppToReject(item);
                  setRejectionReasonInput('');
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 transition-colors"
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

