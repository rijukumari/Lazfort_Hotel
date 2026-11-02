import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  MessageSquare,
  Bell,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Clock,
  Pin,
  ArrowLeft,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffCommunicationPage = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: 'list' | 'compose'
  const isComposeRoute = location.pathname.includes('/compose') || location.pathname.includes('/messages');
  const [viewMode, setViewMode] = useState(isComposeRoute ? 'compose' : 'list');

  useEffect(() => {
    if (location.pathname.includes('/compose') || location.pathname.includes('/messages')) {
      setViewMode('compose');
    } else {
      setViewMode('list');
    }
  }, [location.pathname]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 'ANN-2026-042',
      title: 'Monaco Grand Prix VIP Chauffeur Fleet Protocols',
      category: 'Executive Bulletin',
      author: 'Julian St. Clair (General Manager)',
      date: 'Today at 08:30 AM',
      pinned: true,
      read: true,
      body: 'All concierge and valet staff are reminded that special security credentials for the Port Hercule paddock zone are now ready for collection from Security Station 2. Please verify guest names prior to dispatching luxury fleet vehicles.',
    },
    {
      id: 'ANN-2026-039',
      title: 'Michelin Guide Mystery Inspector Readiness Directives',
      category: 'Gastronomy & Service',
      author: 'Executive Chef Jean-Luc Moreau',
      date: 'Yesterday at 16:00 PM',
      pinned: true,
      read: false,
      body: 'Unannounced Michelin inspections are anticipated across all three dining salons throughout this weekend. Maintain absolute five-star table etiquette and Sommelier wine pouring precision without exception.',
    },
    {
      id: 'ANN-2026-035',
      title: 'Quarterly Staff Excellence Awards & Cocktail Reception',
      category: 'Human Resources',
      author: 'HR Division',
      date: 'Oct 28, 2026',
      pinned: false,
      read: true,
      body: 'Congratulations to the Concierge division for achieving a 99.4% guest satisfaction audit score this month. The quarterly celebration will be hosted on Thursday at the Riviera Terrace.',
    },
  ]);

  const [composeForm, setComposeForm] = useState({
    recipient: 'Front Desk Operations',
    priority: 'Normal',
    subject: '',
    message: '',
  });

  const handleMarkAsRead = (id) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, read: true } : a))
    );
    showToast('Notice Acknowledged', 'Announcement marked as read.', 'info');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const newNotice = {
      id: `ANN-2026-0${Math.floor(45 + Math.random() * 50)}`,
      title: composeForm.subject,
      category: `Duty Inquiry → ${composeForm.recipient}`,
      author: 'Sebastian Laurent (Head Concierge)',
      date: 'Just now',
      pinned: false,
      read: true,
      body: composeForm.message,
    };

    setAnnouncements([newNotice, ...announcements]);
    setViewMode('list');
    setComposeForm({
      recipient: 'Front Desk Operations',
      priority: 'Normal',
      subject: '',
      message: '',
    });
    showToast(
      'Notice Dispatched',
      `Message successfully sent to ${composeForm.recipient} and recorded in broadcast registry.`,
      'success'
    );
  };

  // FULL PAGE VIEW: COMPOSE NOTICE
  if (viewMode === 'compose') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title="Compose Team Notice & Broadcast Inquiry"
          description="Send an official operational directive or inquiry to Front Desk, Housekeeping, or Management."
          badge="Internal Dispatch"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Communications Feed
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Dispatch Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                All sent notices are timestamped and logged in the sovereign audit trail.
              </p>
            </div>
            <span className="font-mono text-xs text-accent font-semibold px-3 py-1 rounded-xl bg-accent/15 border border-accent/30">
              Clearance: Level 4
            </span>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Recipient Department / Command Desk
                </label>
                <select
                  value={composeForm.recipient}
                  onChange={e => setComposeForm({ ...composeForm, recipient: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Front Desk Operations">Front Desk & Concierge Operations</option>
                  <option value="Housekeeping Command Desk">Housekeeping Command Desk</option>
                  <option value="Food & Beverage">Michelin Dining & In-Suite Service</option>
                  <option value="Facilities & Engineering">Engineering & Facilities Maintenance</option>
                  <option value="General Management">Executive Office / General Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Priority Clearance
                </label>
                <select
                  value={composeForm.priority}
                  onChange={e => setComposeForm({ ...composeForm, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Normal">Normal Operational Notice</option>
                  <option value="High Priority">High Priority (Urgent Attention)</option>
                  <option value="Executive Confidential">Executive Confidential</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Notice Subject
              </label>
              <input
                type="text"
                placeholder="e.g. VIP Penthouse 801 Special Amenities Notification"
                value={composeForm.subject}
                onChange={e => setComposeForm({ ...composeForm, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Message Directives & Content
              </label>
              <textarea
                value={composeForm.message}
                onChange={e => setComposeForm({ ...composeForm, message: e.target.value })}
                rows={6}
                placeholder="Type the full operational instructions or inquiry details here..."
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80 dark:border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Encrypted via PMS Broadcast Protocol v2.5
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Notice
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: COMMUNICATIONS FEED
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Palace Communications, Bulletins & Team Notices"
        description="Daily operational briefings, executive management bulletins, emergency protocols, and team inquiries."
        badge="Internal Broadcast"
        actions={
          <button
            type="button"
            onClick={() => setViewMode('compose')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Send className="w-4 h-4" />
            Send Team Notice
          </button>
        }
      />

      {/* KPI Stats */}
      <StatsGrid columns={3}>
        <StatCard
          title="Active Bulletins"
          value={announcements.length}
          change="3 Pinned by General Manager"
          isPositive={true}
          iconName="Bell"
          subtitle="All Staff Broadcast"
        />
        <StatCard
          title="Unread Notices"
          value={announcements.filter(a => !a.read).length}
          change="Action required"
          isPositive={false}
          iconName="AlertCircle"
          subtitle="New Announcements"
        />
        <StatCard
          title="Broadcast Clearance"
          value="Level 4 (Concierge Lead)"
          change="Biometric Encrypted"
          isPositive={true}
          iconName="ShieldCheck"
          subtitle="Internal Comms PMS"
        />
      </StatsGrid>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map(notice => (
          <div
            key={notice.id}
            className={`p-6 rounded-2xl card-luxury-3d transition-all space-y-3 ${notice.pinned ? 'border-accent/40 bg-accent/5' : ''
              }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5 flex-wrap">
                {notice.pinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30">
                    <Pin className="w-3 h-3" />
                    Pinned Directive
                  </span>
                )}
                <span className="font-mono text-xs text-charcoal-muted">
                  {notice.id}
                </span>
                <span className="text-charcoal-muted text-xs">•</span>
                <span className="text-xs font-semibold text-primary dark:text-gray-200">
                  {notice.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-charcoal-muted font-mono">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>{notice.date}</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                {notice.title}
              </h3>
              <p className="text-xs text-accent font-medium mt-0.5">
                From: {notice.author}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-300 leading-relaxed max-w-4xl">
              {notice.body}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-charcoal-muted">
                Official Lazfort Resort & Palace Operational Directive
              </span>
              {!notice.read ? (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(notice.id)}
                  className="px-3.5 py-1.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  Acknowledge & Mark Read
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Read & Acknowledged
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffCommunicationPage;
