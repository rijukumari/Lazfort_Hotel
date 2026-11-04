import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import {
  Calendar,
  Upload,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffApplyLeavePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    leaveType: 'Annual Vacation Leave',
    startDate: '2026-12-24',
    endDate: '2026-12-28',
    reason: '',
    handoverColleague: 'Marie Laurent (Senior Valet)',
    attachedDoc: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachedDoc: file.name }));
      showToast('Document Attached', `Supporting file "${file.name}" uploaded.`, 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      showToast('Validation Error', 'Please enter a justification for your leave request.', 'error');
      return;
    }

    setIsSubmitting(true);
    const generatedRef = `LVR-2026-${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      setSuccessNotice({
        ref: generatedRef,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      setIsSubmitting(false);
      showToast('Application Submitted', `Leave request ${generatedRef} submitted to General Management.`, 'success');
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      leaveType: 'Annual Vacation Leave',
      startDate: '2026-12-24',
      endDate: '2026-12-28',
      reason: '',
      handoverColleague: 'Marie Laurent (Senior Valet)',
      attachedDoc: '',
    });
    setSuccessNotice(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Apply for Leave / Time-Off"
        subtitle="Submit holiday, medical, or personal leave requests with automated departmental routing."
        icon={Calendar}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={FileText}
              onClick={() => navigate('/staff/schedule/leave-requests')}
            >
              My Leave Requests
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        }
      />

      {successNotice && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-white animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-emerald-300">
                  Application Logged Successfully
                </h4>
                <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">
                  Reference: <span className="text-accent">{successNotice.ref}</span> • {successNotice.leaveType} from {successNotice.startDate} to {successNotice.endDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/staff/schedule/leave-requests')}
              >
                View Status in Requests
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
              >
                Apply Another Date
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Formal Leave Request Form
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Please submit annual leave at least 14 days in advance
                </p>
              </div>
              <span className="badge badge-gold flex items-center gap-1.5 px-3 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                HR Policy Compliant
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Leave Type Category *
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                >
                  <option value="Annual Vacation Leave">Annual Vacation Leave (Paid)</option>
                  <option value="Personal / Compassionate Leave">Personal / Compassionate Leave</option>
                  <option value="Medical / Health Leave">Medical / Health Leave</option>
                  <option value="Compensatory Off Day">Compensatory Off Day (Overtime credit)</option>
                  <option value="Unpaid Special Leave">Unpaid Special Leave</option>
                </select>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Handover Colleague */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Designated Duty Handover Colleague
                </label>
                <select
                  value={formData.handoverColleague}
                  onChange={(e) => setFormData({ ...formData, handoverColleague: e.target.value })}
                  className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                >
                  <option value="Marie Laurent (Senior Valet)">Marie Laurent (Senior Valet)</option>
                  <option value="Elena Rostova (Lead Butler)">Elena Rostova (Lead Butler)</option>
                  <option value="Jean-Luc Picard (Senior Officer)">Jean-Luc Picard (Senior Officer)</option>
                  <option value="Sophie Moreau (Turnover Specialist)">Sophie Moreau (Turnover Specialist)</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Reason for Time-Off / Travel Itinerary *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="State the purpose of your leave and emergency contact details if travelling abroad..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                />
              </div>

              {/* Supporting Document */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Supporting Document (Medical certificate / ticket / evidence)
                </label>
                <div className="border-2 border-dashed border-primary/20 dark:border-white/10 rounded-xl p-4 text-center hover:border-accent/40 transition-colors bg-charcoal-bg dark:bg-[#080d19]">
                  <input
                    type="file"
                    id="doc-upload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-5 h-5 text-accent mb-1" />
                    <span className="text-xs text-primary dark:text-white font-medium">
                      {formData.attachedDoc ? `Attached: ${formData.attachedDoc}` : 'Click to upload PDF or image document'}
                    </span>
                    <span className="text-[10px] text-charcoal-muted dark:text-gray-400 mt-0.5">
                      PDF, JPG, PNG up to 10MB
                    </span>
                  </label>
                </div>
              </div>

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
                  icon={Calendar}
                >
                  Submit Leave Application
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Guidelines & Balance */}
        <div className="space-y-6">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Entitlement Summary
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Total Annual Entitlement:</span>
                <span className="font-bold text-primary dark:text-white font-mono">25 Days</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Leave Days Taken:</span>
                <span className="font-bold text-amber-400 font-mono">7 Days</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                <span className="text-accent font-bold">Remaining Available:</span>
                <span className="font-bold text-accent font-mono">18 Days</span>
              </div>
            </div>
          </div>

          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Palace Policy Notice
            </h4>
            <ul className="text-xs text-charcoal-muted dark:text-gray-400 space-y-2 list-disc list-inside">
              <li>Blackout periods apply during the Monaco Yacht Show & Grand Prix.</li>
              <li>Medical leave over 2 consecutive days requires a certified doctor note.</li>
              <li>Emergency compassionate leave is granted immediately by duty manager.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffApplyLeavePage;

