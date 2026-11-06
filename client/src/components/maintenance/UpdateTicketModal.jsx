import React, { useState, useEffect } from 'react';
import { X, Edit2, Save, Wrench, AlertCircle, FileText } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed / Resolved' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TECHNICIANS = [
  'Marco Bellini (Chief Engineer)',
  'Giovanni Rossi (Senior HVAC Specialist)',
  'Laurent Moreau (Master Electrician)',
  'Alain Renaud (Lead Plumber)',
  'David Chen (Smart Systems & Audio/Visual)',
];

export const UpdateTicketModal = ({
  isOpen,
  onClose,
  ticket = null,
  onSuccess,
}) => {
  const { updateMaintenanceTicket } = useERP();

  const [formData, setFormData] = useState({
    title: '',
    status: 'open',
    priority: 'medium',
    assignedStaffName: '',
    expectedCompletion: '',
    totalCost: 0,
    newNote: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        status: ticket.status || 'open',
        priority: ticket.priority || 'medium',
        assignedStaffName: ticket.assignedStaffName || TECHNICIANS[0],
        expectedCompletion: ticket.expectedCompletion || '',
        totalCost: ticket.totalCost || 0,
        newNote: '',
      });
    }
  }, [ticket, isOpen]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let updatedNotes = ticket.notes || '';
    if (formData.newNote.trim()) {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
      updatedNotes = updatedNotes
        ? `${updatedNotes}\n[${timestamp}]: ${formData.newNote.trim()}`
        : `[${timestamp}]: ${formData.newNote.trim()}`;
    }

    const res = updateMaintenanceTicket(ticket.id, {
      title: formData.title.trim(),
      status: formData.status,
      priority: formData.priority,
      assignedStaffName: formData.assignedStaffName,
      expectedCompletion: formData.expectedCompletion,
      totalCost: Number(formData.totalCost),
      notes: updatedNotes,
    });

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess('Work order dossier updated.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-lg bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-white/[0.02] sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                  Update Work Order
                </h2>
                <span className="font-mono text-xs font-bold text-accent">
                  {ticket.ticketNumber || ticket.id}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                {ticket.location || 'Resort Facility'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-charcoal-muted hover:text-accent shrink-0 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto no-scrollbar space-y-4 flex-1">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Work Order Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Ticket Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Priority Tier
              </label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="low" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Low Priority</option>
                <option value="medium" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Medium Priority</option>
                <option value="high" className="bg-white dark:bg-primary-900 text-primary dark:text-white">High Priority</option>
                <option value="critical" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Critical (Blocks Room)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Assigned Specialist
              </label>
              <select
                value={formData.assignedStaffName}
                onChange={e => setFormData({ ...formData, assignedStaffName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {TECHNICIANS.map(t => (
                  <option key={t} value={t} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Estimated / Incurred Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.totalCost}
                onChange={e => setFormData({ ...formData, totalCost: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-ivory/50 dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {ticket.notes && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-charcoal-muted">
                Previous Maintenance Logs:
              </label>
              <div className="p-3 rounded-xl bg-ivory/50 dark:bg-white/[0.02] border border-border/80 dark:border-white/10 text-xs font-mono whitespace-pre-line text-charcoal-muted max-h-24 overflow-y-auto">
                {ticket.notes}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Append Technical Maintenance Note
            </label>
            <textarea
              rows={2}
              value={formData.newNote}
              onChange={e => setFormData({ ...formData, newNote: e.target.value })}
              placeholder="e.g., Replacement gasket installed; system tested for 30 minutes at standard atmospheric pressure."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-border dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-charcoal-muted border border-border dark:border-white/10 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-3d px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-gold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Update Work Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTicketModal;

