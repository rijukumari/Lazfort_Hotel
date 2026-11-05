import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Modal, FormField } from '../../../components/ui';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Search,
  Filter,
  Eye,
  FileCheck2,
  Clock,
  Sparkles,
  BedDouble,
  AlertTriangle
} from 'lucide-react';

const INITIAL_INSPECTIONS = [
  {
    id: 'INSP-801',
    taskId: 'tsk-203',
    roomNumber: 'ST-804',
    roomType: 'Royal Penthouse',
    inspectorName: 'Jean-Luc Picard (Senior Audit Officer)',
    inspectorBadge: 'AUD-09',
    inspectionDate: 'Today, 11:45',
    score: 99,
    status: 'approved',
    checklist: [
      { criterion: 'Frette 1,000-thread Egyptian linen tautness & symmetry', passed: true, notes: 'Impeccable fold lines' },
      { criterion: 'Carrara marble steam sterilization & Jacuzzi swab test', passed: true, notes: '0 bacterial residue detected' },
      { criterion: 'Bulgari au Thé Blanc amenity set & crystal glassware', passed: true, notes: 'Freshly sealed sets' },
      { criterion: 'Terrace panoramic glass acoustic seal & air purifier flow', passed: true, notes: 'HEPA filter 100% capacity' },
      { criterion: 'Digital touch console & electronic vault safe reset', passed: true, notes: 'Master PIN wiped & tested' },
    ],
    notes: 'Exceeds Sovereign 5-Star luxury inspection benchmarks.',
  },
  {
    id: 'INSP-802',
    taskId: 'tsk-204',
    roomNumber: 'JN-402',
    roomType: 'Junior Suite',
    inspectorName: 'Jean-Luc Picard (Senior Audit Officer)',
    inspectorBadge: 'AUD-09',
    inspectionDate: 'Today, 09:30',
    score: 100,
    status: 'approved',
    checklist: [
      { criterion: 'Frette 1,000-thread Egyptian linen tautness & symmetry', passed: true, notes: 'Perfect symmetry' },
      { criterion: 'Carrara marble steam sterilization & Jacuzzi swab test', passed: true, notes: 'Full sterilization verified' },
      { criterion: 'Bulgari au Thé Blanc amenity set & crystal glassware', passed: true, notes: 'Crystal flutes polished' },
      { criterion: 'Terrace panoramic glass acoustic seal & air purifier flow', passed: true, notes: 'Flow rate optimal' },
      { criterion: 'Digital touch console & electronic vault safe reset', passed: true, notes: 'Verified safe zero-reset' },
    ],
    notes: 'Approved for walk-in or confirmed guest check-in.',
  },
  {
    id: 'INSP-803',
    taskId: 'tsk-201',
    roomNumber: 'PH-1201',
    roomType: 'Presidential Suite',
    inspectorName: 'Lady Beatrice Vance (Hygiene Controller)',
    inspectorBadge: 'AUD-04',
    inspectionDate: 'Today, 14:30',
    score: 94,
    status: 'pending',
    checklist: [
      { criterion: 'Frette 1,000-thread Egyptian linen tautness & symmetry', passed: true, notes: 'Silk duvets fluffed' },
      { criterion: 'Carrara marble steam sterilization & Jacuzzi swab test', passed: true, notes: 'Hydro-jets pressure tested' },
      { criterion: 'Bulgari au Thé Blanc amenity set & crystal glassware', passed: true, notes: 'Dom Pérignon welcome bucket set' },
      { criterion: 'Terrace panoramic glass acoustic seal & air purifier flow', passed: false, notes: 'Minor water streak on outdoor balustrade' },
      { criterion: 'Digital touch console & electronic vault safe reset', passed: true, notes: 'iPad room automation linked' },
    ],
    notes: 'Pending final terrace glass buff before release to Sir Alexander.',
  },
];

export const HousekeepingInspectionPage = () => {
  const navigate = useNavigate();
  const { updateCleaningTaskStatus, rooms, updateRoomStatus } = useERP();
  const { showToast } = useToast();

  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (inspection) => {
    setInspections(prev =>
      prev.map(i => (i.id === inspection.id ? { ...i, status: 'approved', score: Math.max(i.score, 98) } : i))
    );

    if (inspection.taskId) {
      updateCleaningTaskStatus(inspection.taskId, 'inspected');
    }

    const roomObj = rooms.find(r => r.roomNumber === inspection.roomNumber);
    if (roomObj && roomObj.status !== 'occupied') {
      updateRoomStatus(roomObj.id, 'available');
    }

    showToast(
      'Inspection Approved',
      `Suite ${inspection.roomNumber} verified with score of ${inspection.score}%. Released to available inventory.`,
      'success'
    );
    setSelectedInspection(null);
  };

  const handleOpenReject = (inspection) => {
    setSelectedInspection(inspection);
    setRejectionReason(`Touchup required on ${inspection.checklist.find(c => !c.passed)?.criterion || 'sanitation checklist'}`);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedInspection) return;

    setInspections(prev =>
      prev.map(i => (i.id === selectedInspection.id ? { ...i, status: 'rejected', notes: rejectionReason } : i))
    );

    if (selectedInspection.taskId) {
      updateCleaningTaskStatus(selectedInspection.taskId, 'in_progress');
    }

    showToast(
      'Turnover Flagged for Reclean',
      `Suite ${selectedInspection.roomNumber} returned to housekeeping team. Reason: ${rejectionReason}`,
      'warning'
    );
    setRejectModalOpen(false);
    setSelectedInspection(null);
  };

  const filteredInspections = inspections.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.roomNumber.toLowerCase().includes(q) ||
      item.inspectorName.toLowerCase().includes(q) ||
      item.roomType.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="White-Glove Chamber Inspection & Quality Clearance"
        description="Independent hygiene audits, swab verification scoring, and executive approval workflows for sovereign suites."
        badge="Quality Assurance"
        actions={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Inspection Mandate</span>
            </span>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Inspections Completed</span>
            <span className="font-serif font-bold text-2xl text-primary dark:text-white mt-1 block">
              {inspections.filter(i => i.status === 'approved').length} Approved
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Zero guest hygiene variances</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Average Audit Score</span>
            <span className="font-serif font-bold text-2xl text-accent mt-1 block">
              98.2 / 100
            </span>
            <span className="text-[11px] text-charcoal-muted">5-Star Sovereign Protocol</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Awaiting Final Clearance</span>
            <span className="font-serif font-bold text-2xl text-amber-500 mt-1 block">
              {inspections.filter(i => i.status === 'pending').length} In Review
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Prioritized for afternoon arrivals</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="card-luxury-3d p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search inspections by Suite #, Inspector, or Tier..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs">
          {[
            { id: 'all', label: 'All Audits' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'approved', label: 'Approved & Cleared' },
            { id: 'rejected', label: 'Rejected / Reclean' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'gold-gradient-bg text-primary-900 shadow-sm'
                  : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inspections Table */}
      <div className="card-luxury-3d p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-accent" />
            <span>Inspection Log Ledger</span>
          </h3>
          <span className="text-xs font-mono text-charcoal-muted">
            {filteredInspections.length} Records Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-[11px] font-mono uppercase text-charcoal-muted">
                <th className="pb-3 px-3">Audit Ref</th>
                <th className="pb-3 px-3">Chamber</th>
                <th className="pb-3 px-3">Lead Auditor</th>
                <th className="pb-3 px-3">Audit Date</th>
                <th className="pb-3 px-3">Hygiene Score</th>
                <th className="pb-3 px-3">Clearance Status</th>
                <th className="pb-3 px-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    No inspection logs match your query.
                  </td>
                </tr>
              ) : (
                filteredInspections.map(insp => (
                  <tr key={insp.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-accent">
                      {insp.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-primary dark:text-white block">Suite {insp.roomNumber}</span>
                      <span className="text-[11px] text-charcoal-muted">{insp.roomType}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-primary dark:text-white block">{insp.inspectorName}</span>
                      <span className="text-[10px] font-mono text-charcoal-muted">Badge: {insp.inspectorBadge}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-charcoal-muted">
                      {insp.inspectionDate}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-sm ${
                          insp.score >= 98
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : insp.score >= 90
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}>
                          {insp.score}%
                        </span>
                        <div className="w-16 h-1.5 bg-border/60 dark:bg-black/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              insp.score >= 98 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${insp.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={insp.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/hotel-admin/housekeeping/inspection/${insp.id}`)}
                          className="px-2.5 py-1 rounded-lg border border-border dark:border-white/10 hover:border-accent text-charcoal-muted hover:text-accent text-[11px] font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                          title="View Full Audit Protocol Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>

                        {insp.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(insp)}
                              className="px-2.5 py-1 rounded-lg gold-gradient-bg text-primary-900 text-[11px] font-bold uppercase tracking-wider shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenReject(insp)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white text-[11px] font-semibold transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Checklist Modal removed in favor of dedicated standalone page /hotel-admin/housekeeping/inspection/:id */}

      {/* Reject Confirmation Modal */}
      {rejectModalOpen && selectedInspection && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModalOpen(false)}
          title={`Reject Inspection — Suite ${selectedInspection.roomNumber}`}
          description="Send chamber back to housekeeping attendants for immediate corrective sanitization."
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <FormField label="Corrective Action Directives" required>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Specify exact defects needing re-cleaning (e.g. bathroom mirror streak, minibar restock)..."
                className="w-full px-3 py-2 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-rose-500"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors"
              >
                Confirm Re-Clean Request
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HousekeepingInspectionPage;
