import React, { useState } from 'react';
import { X, Wrench, Save, AlertCircle, Building, Calendar, User, Tag } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const ISSUE_CATEGORIES = [
  'HVAC & Climate',
  'Plumbing & Hydraulics',
  'Electrical & Power',
  'Luxury Woodwork & Furnishings',
  'Elevators & Vertical Transport',
  'Smart Automation & Electronics',
  'Kitchen & Culinary Equipment',
  'Spa & Thermal Sanctuary',
  'Marble & Architectural Stone',
];

const TECHNICIANS = [
  'Marco Bellini (Chief Engineer)',
  'Giovanni Rossi (Senior HVAC Specialist)',
  'Laurent Moreau (Master Electrician)',
  'Alain Renaud (Lead Plumber)',
  'David Chen (Smart Systems & Audio/Visual)',
];

export const RaiseTicketModal = ({
  isOpen,
  onClose,
  prefilledRoomId = '',
  onSuccess,
}) => {
  const { rooms = [], createMaintenanceTicket } = useERP();

  const [formData, setFormData] = useState({
    title: '',
    category: 'HVAC & Climate',
    roomId: prefilledRoomId,
    location: '',
    priority: 'medium',
    assignedTechnician: TECHNICIANS[0],
    expectedCompletionDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    description: '',
    blocksRoom: false,
    estimatedCost: 150,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Issue Title is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    const loc = formData.location.trim() || (selectedRoom ? `Suite ${selectedRoom.roomNumber} (${selectedRoom.type})` : 'General Hotel Property');

    const res = createMaintenanceTicket({
      title: formData.title.trim(),
      category: formData.category,
      roomId: formData.roomId || undefined,
      roomNumber: selectedRoom?.roomNumber || undefined,
      location: loc,
      priority: formData.priority,
      assignedStaffName: formData.assignedTechnician,
      expectedCompletion: formData.expectedCompletionDate,
      description: formData.description.trim(),
      blocksRoom: formData.blocksRoom || formData.priority === 'critical',
      totalCost: Number(formData.estimatedCost) || 0,
    });

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess(res.message);
      onClose();
    } else {
      setError(res.message || 'Failed to raise ticket.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-xl bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                Raise Work Order / Maintenance Ticket
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Log technical defects, room disrepairs, and preventive work orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Suite 402 AC Chilled Water Valve Leak"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Issue Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {ISSUE_CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {c}
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
                onChange={e => setFormData({ ...formData, priority: e.target.value, blocksRoom: e.target.value === 'critical' ? true : formData.blocksRoom })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="low" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Low Priority (Routine Work)</option>
                <option value="medium" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Medium Priority (Standard Fix)</option>
                <option value="high" className="bg-white dark:bg-primary-900 text-primary dark:text-white">High Priority (Urgent Suite Touchup)</option>
                <option value="critical" className="bg-white dark:bg-primary-900 text-primary dark:text-white">Critical (Blocks Room / Out of Order)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Affected Room / Suite (Optional)
              </label>
              <select
                value={formData.roomId}
                onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">No specific room (General property)</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    Suite {r.roomNumber} ({r.type}) — Status: {r.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Assigned Technician
              </label>
              <select
                value={formData.assignedTechnician}
                onChange={e => setFormData({ ...formData, assignedTechnician: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
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
                Expected Completion Date
              </label>
              <input
                type="date"
                required
                value={formData.expectedCompletionDate}
                onChange={e => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Estimated Repair Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedCost}
                onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Specific Facility Location (If room not selected)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Grand Ballroom Chandelier West Wing, Spa Thermal Pool #2"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Detailed Description & Defect Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide exact symptoms, parts required, or safety notes for engineering personnel..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-primary-950/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 focus:outline-none resize-none"
            />
          </div>

          {/* Room Blocking Toggle */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Mark Room Under Maintenance (Out of Service)</span>
              </p>
              <p className="text-[11px] text-charcoal-muted">
                Blocks guest check-ins and marks room as maintenance in reservations.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.blocksRoom}
                onChange={e => setFormData({ ...formData, blocksRoom: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-border dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-charcoal dark:text-gray-300 hover:text-primary dark:hover:text-white border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching Ticket...' : 'Dispatch Work Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicketModal;

