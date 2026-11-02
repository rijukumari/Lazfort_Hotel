import React, { useState } from 'react';
import { X, UserCheck, Save } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const TECHNICIANS = [
  'Marco Bellini (Chief Engineer)',
  'Giovanni Rossi (Senior HVAC Specialist)',
  'Laurent Moreau (Master Electrician)',
  'Alain Renaud (Lead Plumber)',
  'David Chen (Smart Systems & Audio/Visual)',
];

export const AssignTechnicianModal = ({
  isOpen,
  onClose,
  ticket = null,
  onSuccess,
}) => {
  const { assignTechnicianToTicket } = useERP();
  const [selectedTech, setSelectedTech] = useState(ticket?.assignedStaffName || TECHNICIANS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = assignTechnicianToTicket(ticket.id, selectedTech);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess(`Technician assigned to ${ticket.ticketNumber || ticket.id}.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-md bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white">
                Assign Engineering Specialist
              </h3>
              <p className="text-[10px] text-accent font-mono font-bold">
                {ticket.ticketNumber || ticket.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-charcoal-muted hover:text-accent">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Select Certified Technician
            </label>
            <select
              value={selectedTech}
              onChange={e => setSelectedTech(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
            >
              {TECHNICIANS.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-muted border border-border dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-3d px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-gold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Assigning...' : 'Confirm Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;

