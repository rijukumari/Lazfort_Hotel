import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Sparkles,
  ArrowLeft,
  BedDouble,
  ShieldCheck,
  UserCheck,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const CLEANING_STAFF = [
  { id: 'stf-001', name: 'Margaux Dubois', role: 'Head Butler & Lead Sanitizer', floor: 'Floors 10-18', avatar: 'MD' },
  { id: 'stf-002', name: 'Marie Laurent', role: 'Senior Chamber Valet', floor: 'Penthouse Level', avatar: 'ML' },
  { id: 'stf-003', name: 'Elena Rostova', role: 'Hygiene Specialist', floor: 'Floors 4-9', avatar: 'ER' },
  { id: 'stf-004', name: 'Jean-Luc Picard', role: 'White-Glove Inspector', floor: 'All Resort Wings', avatar: 'JP' },
  { id: 'stf-005', name: 'Sophie Moreau', role: 'Turnover Specialist', floor: 'Floors 1-3', avatar: 'SM' },
];

export const AssignChamberTurnoverPage = () => {
  const navigate = useNavigate();
  const { rooms = [], addCleaningTask } = useERP();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    roomId: rooms[0]?.id || '',
    staffName: CLEANING_STAFF[0].name,
    priority: 'high',
    cleaningType: 'Full Turnover & Linen Change',
    date: new Date().toISOString().split('T')[0],
    estimatedMinutes: 60,
    notes: 'Prioritize terrace glass polish and fresh orchid placement.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetRoom = rooms.find(r => r.id === form.roomId) || rooms[0];

    try {
      addCleaningTask({
        roomId: targetRoom?.id || 'rm-custom',
        roomNumber: targetRoom?.roomNumber || '101',
        roomType: targetRoom?.type || 'Presidential Tier',
        cleaningType: form.cleaningType,
        priority: form.priority,
        status: 'pending',
        assignedStaffName: form.staffName,
        estimatedMinutes: Number(form.estimatedMinutes) || 60,
        notes: form.notes,
        assignedDate: form.date,
        checklist: [
          { item: 'Replace 1000-thread Egyptian linen & feather duvets', completed: false },
          { item: 'Bathroom marble steam sanitization & Bulgari replenishment', completed: false },
          { item: 'Minibar crystal glasses & sommelier reserve restock', completed: false },
          { item: 'Final supervisor white-glove inspection check', completed: false }
        ],
      });

      showToast(
        'Assignment Dispatched',
        `Assigned Suite ${targetRoom?.roomNumber || '101'} turnover to ${form.staffName}.`,
        'success'
      );
      navigate('/hotel-admin/housekeeping/assignments');
    } catch (err) {
      showToast('Error', 'Failed to dispatch turnover assignment.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Assignments</span>
        </button>

        <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold px-3 py-1 rounded-full bg-accent/15 border border-accent/30">
          Turnover Dispatch Command
        </span>
      </div>

      {/* Main Page Form Card */}
      <div className="card-luxury-3d p-8 rounded-3xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 shadow-2xl space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 pb-6 border-b border-border/60 dark:border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-primary dark:text-white">
              Assign Chamber Turnover
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
              Allocate royal suite sanitation duty to an on-shift housekeeping specialist.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Chamber / Suite */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Target Chamber / Suite <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.roomId}
                onChange={e => setForm(prev => ({ ...prev, roomId: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              >
                {rooms.map(rm => (
                  <option key={rm.id} value={rm.id} className="dark:bg-primary-950">
                    Suite {rm.roomNumber} — {rm.type} ({rm.status || 'available'})
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Housekeeping Attendant */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Assigned Housekeeping Attendant <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.staffName}
                onChange={e => setForm(prev => ({ ...prev, staffName: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              >
                {CLEANING_STAFF.map(st => (
                  <option key={st.id} value={st.name} className="dark:bg-primary-950">
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Dispatch Priority */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Dispatch Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.priority}
                onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              >
                <option value="urgent" className="dark:bg-primary-950">Urgent (VIP Departure/Arrival &lt; 2 hrs)</option>
                <option value="high" className="dark:bg-primary-950">High Priority (Standard Departure)</option>
                <option value="medium" className="dark:bg-primary-950">Medium (Daily Stayover Refresh)</option>
                <option value="low" className="dark:bg-primary-950">Low (Deep Turndown Service)</option>
              </select>
            </div>

            {/* Turnover Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Turnover Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.cleaningType}
                onChange={e => setForm(prev => ({ ...prev, cleaningType: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              >
                <option value="Full Turnover & Linen Change" className="dark:bg-primary-950">Full Turnover & Linen Change</option>
                <option value="Daily Refresh & Restock" className="dark:bg-primary-950">Daily Refresh & Restock</option>
                <option value="Deep Medical Sanitization" className="dark:bg-primary-950">Deep Medical Sanitization</option>
                <option value="VIP Evening Turndown" className="dark:bg-primary-950">VIP Evening Turndown</option>
              </select>
            </div>

            {/* Assignment Date */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Assignment Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              />
            </div>

            {/* Estimated Duration (Mins) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Estimated Duration (Mins) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="15"
                max="180"
                required
                value={form.estimatedMinutes}
                onChange={e => setForm(prev => ({ ...prev, estimatedMinutes: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              />
            </div>
          </div>

          {/* Special Directives & Guest Requests */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Special Directives & Guest Requests
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Prioritize terrace glass polish and fresh orchid placement..."
              className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate('/hotel-admin/housekeeping/assignments')}
              className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider shadow-gold hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary-950" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignChamberTurnoverPage;

