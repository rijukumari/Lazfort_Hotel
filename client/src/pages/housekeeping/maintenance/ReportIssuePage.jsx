import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../../components/ui';
import {
  Wrench,
  AlertTriangle,
  Upload,
  CheckCircle2,
  BedDouble,
  User,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

const ISSUE_CATEGORIES = [
  'Plumbing & Bath Fixtures',
  'HVAC & Climate Control',
  'Electrical & Luxury Lighting',
  'Smart Home & Digital Console',
  'Furniture & Cabinetry',
  'Door Locks & RFID Keycard',
  'Acoustic Glass & Balcony Terrace',
  'Curtains & Motorized Drapes',
  'Other Operational Defect',
];

const TECHNICIANS = [
  'Marco Bellini (Chief Engineer)',
  'Luca Moretti (HVAC Specialist)',
  'Antoine Mercier (Plumbing Master)',
  'Giovanni Rossi (Automation & Smart IoT)',
  'Unassigned (Queue for Chief Engineer)',
];

export const ReportIssuePage = () => {
  const navigate = useNavigate();
  const { rooms = [], createMaintenanceTicket } = useERP();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    roomNumber: rooms[0]?.roomNumber || '101',
    title: '',
    category: ISSUE_CATEGORIES[0],
    priority: 'high',
    assignedTechnician: TECHNICIANS[0],
    description: '',
    blocksRoom: false,
    imageFileName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFileName: file.name }));
      showToast('Image Attached', `Evidence image "${file.name}" uploaded.`, 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Validation Error', 'Please enter a summary title for the defect.', 'error');
      return;
    }

    setIsSubmitting(true);
    const generatedRef = `MT-REC-${Date.now().toString().slice(-5)}`;

    setTimeout(() => {
      createMaintenanceTicket({
        ticketNumber: generatedRef,
        title: formData.title.trim(),
        issue: formData.title.trim(),
        category: formData.category,
        roomNumber: formData.roomNumber,
        location: `Suite ${formData.roomNumber}`,
        priority: formData.priority,
        assignedTo: formData.assignedTechnician,
        assignedStaffName: formData.assignedTechnician,
        description: formData.description.trim() || 'Defect reported during housekeeping turnover routine.',
        blocksRoom: formData.blocksRoom,
        status: 'open',
        imageAttached: formData.imageFileName || null,
        createdAt: new Date().toISOString(),
      });

      setSubmittedRef({
        ticketNumber: generatedRef,
        suite: formData.roomNumber,
        title: formData.title,
        priority: formData.priority,
      });

      setIsSubmitting(false);
      showToast('Defect Logged', `Work order ${generatedRef} dispatched to engineering.`, 'success');
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      roomNumber: rooms[0]?.roomNumber || '101',
      title: '',
      category: ISSUE_CATEGORIES[0],
      priority: 'high',
      assignedTechnician: TECHNICIANS[0],
      description: '',
      blocksRoom: false,
      imageFileName: '',
    });
    setSubmittedRef(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Room Issue or Defect"
        subtitle="Dispatch emergency or standard repair orders to the palace engineering team."
        icon={AlertTriangle}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Wrench}
              onClick={() => navigate('/housekeeping/maintenance/requests')}
            >
              Active Requests
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
            >
              Reset Form
            </Button>
          </div>
        }
      />

      {submittedRef && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-white animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-emerald-300">
                  Work Order Successfully Logged & Dispatched
                </h4>
                <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">
                  Ticket Ref: <span className="text-accent">{submittedRef.ticketNumber}</span> • Suite {submittedRef.suite} • Priority: <span className="uppercase text-amber-400">{submittedRef.priority}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/housekeeping/maintenance/requests')}
              >
                View in Requests Ledger
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
              >
                Log Another Defect
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-2">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Maintenance Defect Intake
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Fill in chamber location and symptoms for automated engineer routing
                </p>
              </div>
              <span className="badge badge-gold flex items-center gap-1.5 px-3 py-1">
                <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                Live Engineering Dispatch
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Suite Selection & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Affected Chamber / Suite *
                  </label>
                  <select
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.roomNumber}>
                        Suite {r.roomNumber} — {r.type || r.roomType || 'Chamber'} ({r.status || 'Active'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Issue Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  >
                    {ISSUE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Issue Summary Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bath hydro-jet pressure drop or terrace motorized curtain sensor offline"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                />
              </div>

              {/* Priority & Assignee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Urgency & Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm font-bold"
                  >
                    <option value="critical">Critical (Blocks Room / Out of Order)</option>
                    <option value="high">High (Service prior to guest arrival)</option>
                    <option value="medium">Medium (Standard engineering shift)</option>
                    <option value="low">Low (Routine cosmetic maintenance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Designated Engineering Specialist
                  </label>
                  <select
                    value={formData.assignedTechnician}
                    onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  >
                    {TECHNICIANS.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Detailed Diagnostic Symptoms / Valet Observations
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide precise details to assist technician with tool/parts preparation..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                />
              </div>

              {/* Image Evidence Upload */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Upload Photo Evidence (Optional)
                </label>
                <div className="border-2 border-dashed border-primary/20 dark:border-white/10 rounded-xl p-4 text-center hover:border-accent/40 transition-colors bg-charcoal-bg dark:bg-[#080d19]">
                  <input
                    type="file"
                    id="evidence-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-6 h-6 text-accent mb-1.5" />
                    <span className="text-xs text-primary dark:text-white font-medium">
                      {formData.imageFileName ? `Selected: ${formData.imageFileName}` : 'Click to upload chamber defect photograph'}
                    </span>
                    <span className="text-[10px] text-charcoal-muted dark:text-gray-400 mt-0.5">
                      JPG, PNG, WEBP up to 10MB
                    </span>
                  </label>
                </div>
              </div>

              {/* Out of Order Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <input
                  type="checkbox"
                  id="block-room"
                  checked={formData.blocksRoom}
                  onChange={(e) => setFormData({ ...formData, blocksRoom: e.target.checked })}
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <label htmlFor="block-room" className="cursor-pointer text-amber-200">
                  <strong>Mark Suite Out of Order (OOO)</strong> — Prevents front desk from assigning room until engineering signs off.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/10 dark:border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  icon={RotateCcw}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  icon={AlertTriangle}
                >
                  Submit & Dispatch Work Order
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Guidelines */}
        <div className="space-y-6">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Reporting Guidelines
            </h4>
            <ul className="text-xs text-charcoal-muted dark:text-gray-400 space-y-2.5 list-disc list-inside">
              <li>Always check if suite has an arriving VIP within 2 hours.</li>
              <li>Mark <strong>Critical</strong> for water leaks, air conditioning failures, or lock malfunctions.</li>
              <li>Chief Engineer is automatically notified via SMS for all Critical orders.</li>
              <li>Photograph defects when visible wear or guest damage is observed.</li>
            </ul>
          </div>

          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-accent" />
              Maintenance Shortcuts
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/housekeeping/maintenance/requests')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40 border border-primary/10 dark:border-white/5 text-xs text-left transition-colors"
              >
                <span className="text-primary dark:text-white font-medium">All Open Requests</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/housekeeping/maintenance/history')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40 border border-primary/10 dark:border-white/5 text-xs text-left transition-colors"
              >
                <span className="text-primary dark:text-white font-medium">Maintenance History</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;

