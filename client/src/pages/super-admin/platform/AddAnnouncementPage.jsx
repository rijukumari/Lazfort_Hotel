import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { initialAnnouncements } from '../../../data/mockSuperAdminModules';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Textarea, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  Megaphone,
  Save,
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';

export const AddAnnouncementPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getStoredAnnouncements = () => {
    try {
      const stored = localStorage.getItem('lazfort_announcements');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse announcements', e);
    }
    return initialAnnouncements || [];
  };

  const allAnnouncements = getStoredAnnouncements();
  const existingAnnouncement = id
    ? allAnnouncements.find(a => a.id === id)
    : null;

  const [headline, setHeadline] = useState(existingAnnouncement?.title || '');
  const [classification, setClassification] = useState(existingAnnouncement?.type || 'Information');
  const [targetAudience, setTargetAudience] = useState(existingAnnouncement?.audience || 'All Hotel Properties');
  const [startDate, setStartDate] = useState(
    existingAnnouncement?.startDate || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    existingAnnouncement?.endDate ||
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [narrative, setNarrative] = useState(existingAnnouncement?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingAnnouncement) {
      setHeadline(existingAnnouncement.title);
      setClassification(existingAnnouncement.type);
      setTargetAudience(existingAnnouncement.audience);
      setStartDate(existingAnnouncement.startDate);
      setEndDate(existingAnnouncement.endDate);
      setNarrative(existingAnnouncement.message);
    }
  }, [existingAnnouncement]);

  const validate = () => {
    const errs = {};
    if (!headline.trim()) errs.headline = 'Bulletin headline is required';
    if (!narrative.trim()) errs.narrative = 'Full announcement narrative is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const currentList = getStoredAnnouncements();
      let updatedList = [];
      if (isEditMode) {
        updatedList = currentList.map(a =>
          a.id === id
            ? {
                ...a,
                title: headline.trim(),
                type: classification,
                audience: targetAudience,
                startDate,
                endDate,
                message: narrative.trim(),
              }
            : a
        );
      } else {
        const newItem = {
          id: `ann-${Date.now()}`,
          title: headline.trim(),
          type: classification,
          audience: targetAudience,
          startDate,
          endDate,
          message: narrative.trim(),
          status: 'Published',
          publishedDate: new Date().toISOString().split('T')[0],
          readCount: 0,
        };
        updatedList = [newItem, ...currentList];
      }
      localStorage.setItem('lazfort_announcements', JSON.stringify(updatedList));

      showToast(
        isEditMode ? 'Bulletin Updated' : 'Bulletin Broadcasted',
        isEditMode
          ? `Directive "${headline}" saved into database and network feeds updated.`
          : `Official bulletin dispatched to ${targetAudience} and saved to database.`,
        'success'
      );
      navigate('/super-admin/platform/announcements');
    } catch {
      showToast('Transmission Error', 'Failed to dispatch broadcast bulletin.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/platform/announcements"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Announcements & Bulletins</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {isEditMode ? 'Edit Broadcast Bulletin' : 'Broadcast System Bulletin'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
              {classification} Directive
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            {isEditMode
              ? 'Modify scheduled parameters and dispatch revisions to connected hotel properties.'
              : 'Dispatch urgent notices, maintenance schedules, or compliance mandates across hotel properties.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/super-admin/platform/announcements')}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            type="button"
            loading={isSubmitting}
            icon={isEditMode ? Save : Send}
            onClick={handleSubmit}
          >
            {isEditMode ? 'Commit Changes' : 'Dispatch Broadcast'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Bulletin Headline & Classification
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Visible prominently on manager consoles and staff broadcast ribbons.
                </p>
              </div>
            </div>

            <FormField
              label="Bulletin Headline"
              required
              hint="Concise, authoritative title"
              error={errors.headline}
            >
              <Input
                type="text"
                placeholder="e.g. Monaco Grand Prix Security & Traffic Clearance Protocol"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Bulletin Classification" required hint="Alert level badge">
                <Select
                  value={classification}
                  onChange={e => setClassification(e.target.value)}
                >
                  <option value="Information">Information (Standard Notice)</option>
                  <option value="Maintenance">Scheduled Infrastructure Maintenance</option>
                  <option value="Urgent">Urgent Operational Directive</option>
                  <option value="Warning">Regulatory & Compliance Warning</option>
                </Select>
              </FormField>

              <FormField label="Target Audience" required hint="Dispatched endpoints">
                <Select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                >
                  <option value="All Hotel Properties">All Hotel Properties (Global)</option>
                  <option value="General Managers & Front Desk">GMs & Front Desk Only</option>
                  <option value="Finance & Accounting">Finance & Accounting Teams</option>
                  <option value="All Staff Members">All Staff Members & Concierge</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Broadcast Start Date" required hint="Effective immediately" error={errors.startDate}>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Broadcast End Date" required hint="Auto-archived afterwards" error={errors.endDate}>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField
              label="Full Announcement Narrative"
              required
              hint="Comprehensive operational directive"
              error={errors.narrative}
            >
              <Textarea
                rows={6}
                placeholder="Type the complete bulletin text to display on property consoles..."
                value={narrative}
                onChange={e => setNarrative(e.target.value)}
                required
              />
            </FormField>
          </Card>
        </div>

        {/* Right Column: Broadcast Preview & Policy */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Live Console Preview
            </span>

            <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-950/70 border border-accent/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-accent">
                  {classification}
                </span>
                <span className="text-[10px] font-mono text-charcoal-muted">
                  {startDate}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-primary dark:text-white leading-tight">
                {headline || 'Bulletin Title Appears Here'}
              </h4>
              <p className="text-xs text-charcoal-muted dark:text-gray-300 line-clamp-3 leading-relaxed">
                {narrative || 'Full announcement body preview displays here for operators...'}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/70 dark:border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Recipients:</span>
                <span className="font-semibold text-primary dark:text-white">{targetAudience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Audited By:</span>
                <span className="font-medium text-accent">Platform Super Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">SLA Window:</span>
                <span className="font-mono text-emerald-500 font-semibold">Immediate Dispatch</span>
              </div>
            </div>
          </Card>

          <Card variant="luxury" className="p-5 space-y-3 text-xs bg-accent/5 border-accent/20">
            <div className="flex items-center gap-2 text-accent font-serif font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Broadcast Protocol</span>
            </div>
            <p className="text-charcoal-muted dark:text-gray-400 text-[11px] leading-relaxed">
              Dispatched bulletins are cryptographically signed and recorded into the Sovereign Audit Log.
              Urgent classifications trigger real-time modal notifications upon operator authentication.
            </p>
          </Card>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/super-admin/platform/announcements')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              loading={isSubmitting}
              icon={isEditMode ? Save : Send}
              className="flex-1"
            >
              {isEditMode ? 'Save' : 'Dispatch'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAnnouncementPage;

