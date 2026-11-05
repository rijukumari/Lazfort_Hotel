import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  BedDouble,
  Award,
  Clock,
  Printer,
  Calendar,
  UserCheck
} from 'lucide-react';
import { printElement } from '../../../utils/printSystem';

const SAMPLE_INSPECTIONS = [
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

export const InspectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCleaningTaskStatus, updateRoomStatus, rooms = [] } = useERP();
  const { showToast } = useToast();

  const inspection = useMemo(() => {
    return SAMPLE_INSPECTIONS.find(i => i.id === id || i.roomNumber === id) || SAMPLE_INSPECTIONS[0];
  }, [id]);

  const [currentStatus, setCurrentStatus] = useState(inspection?.status || 'approved');

  const handlePrint = () => {
    printElement('printable-inspection-protocol', {
      documentTitle: `Inspection_Protocol_${inspection.roomNumber}`
    });
  };

  const handleApprove = () => {
    setCurrentStatus('approved');
    if (inspection.taskId) {
      updateCleaningTaskStatus(inspection.taskId, 'inspected');
    }
    const matchingRoom = rooms.find(r => r.roomNumber === inspection.roomNumber);
    if (matchingRoom) {
      updateRoomStatus(matchingRoom.id, 'available', 'clean');
    }
    showToast(
      'Audit Approved & Released',
      `Suite ${inspection.roomNumber} verified by ${inspection.inspectorName}. Ready for check-in.`,
      'success'
    );
  };

  const handleReject = () => {
    setCurrentStatus('rejected');
    if (inspection.taskId) {
      updateCleaningTaskStatus(inspection.taskId, 'pending');
    }
    const matchingRoom = rooms.find(r => r.roomNumber === inspection.roomNumber);
    if (matchingRoom) {
      updateRoomStatus(matchingRoom.id, 'cleaning', 'dirty');
    }
    showToast(
      'Audit Rejected',
      `Suite ${inspection.roomNumber} flagged for immediate corrective re-cleaning.`,
      'error'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10 print:hidden">
        <button
          type="button"
          onClick={() => navigate('/hotel-admin/housekeeping/inspection')}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Inspections Ledger</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-accent/40 text-xs font-semibold text-accent hover:bg-accent/15 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Protocol</span>
          </button>

          {currentStatus !== 'approved' && (
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-950" />
              <span>Approve & Release</span>
            </button>
          )}

          {currentStatus === 'approved' && (
            <button
              type="button"
              onClick={handleReject}
              className="px-3.5 py-2 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Flag Re-Clean</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Inspection Page Card */}
      <div
        id="printable-inspection-protocol"
        className="card-luxury-3d p-8 rounded-3xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 shadow-2xl space-y-6"
      >
        {/* Title Header */}
        <div className="border-b border-border/60 dark:border-white/10 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-primary dark:text-white">
                Hygiene Inspection Protocol — Suite {inspection.roomNumber}
              </h1>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
                Conducted by {inspection.inspectorName} • Score: {inspection.score}%
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
              currentStatus === 'approved'
                ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                : currentStatus === 'rejected'
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
            }`}>
              {currentStatus === 'approved' ? 'VERIFIED & CLEARED' : currentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Auditor Card */}
        <div className="p-6 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold block">
              SUITE {inspection.roomNumber} • {inspection.roomType.toUpperCase()}
            </span>
            <p className="font-serif font-bold text-lg text-primary dark:text-white">
              Auditor: {inspection.inspectorName}
            </p>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">
              Timestamp: {inspection.inspectionDate}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-border/60 dark:sm:border-white/10 sm:pl-8">
            <span className="font-serif font-black text-4xl text-accent block">
              {inspection.score}%
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase tracking-wider mt-0.5">
              VERIFIED AUDIT
            </span>
          </div>
        </div>

        {/* Detailed 5-Point Quality Checklist */}
        <div className="space-y-3">
          <h2 className="font-serif font-bold text-base text-primary dark:text-white">
            Detailed 5-Point Quality Checklist:
          </h2>
          <div className="divide-y divide-border/60 dark:divide-white/5 border border-border/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {inspection.checklist?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 flex items-start justify-between gap-4 bg-white dark:bg-[#131b26] hover:bg-ivory/40 dark:hover:bg-primary-900/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                    {item.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-xs sm:text-sm ${
                      item.passed ? 'text-primary dark:text-white' : 'text-rose-500'
                    }`}>
                      {item.criterion}
                    </p>
                    <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                      {item.notes}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  item.passed
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                }`}>
                  {item.passed ? 'PASSED' : 'DEFECT'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Auditor Directives & Notes */}
        {inspection.notes && (
          <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-xs text-charcoal-muted dark:text-gray-300 space-y-1">
            <strong className="text-primary dark:text-white block font-serif">Auditor Directives:</strong>
            <p className="italic">{inspection.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionDetailPage;

