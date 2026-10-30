import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { initialAnnouncements } from '../../../data/mockSuperAdminModules';
import { Button, Card, StatusBadge } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowLeft,
  Megaphone,
  Edit,
  Trash2,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const AnnouncementDetailPage = () => {
  const { id } = useParams();
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

  const storedList = getStoredAnnouncements();
  const announcement = storedList.find(a => a.id === id) || storedList[0];

  if (!announcement) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/platform/announcements" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Announcements
        </Link>
        <p className="text-sm">Announcement record not found.</p>
      </div>
    );
  }

  const handleDelete = () => {
    const updated = storedList.filter(a => a.id !== announcement.id);
    localStorage.setItem('lazfort_announcements', JSON.stringify(updated));
    showToast('Bulletin Deleted', `Bulletin "${announcement.title}" removed from database.`, 'info');
    navigate('/super-admin/platform/announcements');
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
              System Bulletin Dossier
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
              {announcement.type} Notice
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Official operational broadcast record and property delivery telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={Edit}
            onClick={() => navigate(`/super-admin/platform/announcements/edit/${announcement.id}`)}
          >
            Edit Directive
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={handleDelete}
          >
            Withdraw Bulletin
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                  Ref #{announcement.id} • {announcement.status}
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-primary dark:text-white leading-tight">
                  {announcement.title}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono font-bold text-charcoal-muted tracking-wider">
                Full Directive Narrative
              </h4>
              <div className="p-5 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 leading-relaxed text-sm text-charcoal dark:text-gray-200">
                {announcement.message}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/70 dark:border-white/10">
              <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                  Broadcast Audience
                </span>
                <div className="flex items-center gap-2 text-primary dark:text-white font-semibold text-xs">
                  <Users className="w-4 h-4 text-accent" />
                  <span>{announcement.audience}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-border/60 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                  Broadcast Window
                </span>
                <div className="flex items-center gap-2 text-primary dark:text-white font-mono font-semibold text-xs">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{announcement.startDate} &rarr; {announcement.endDate}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Telemetry Status
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Publication Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {announcement.status}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Priority:</span>
                <span className="font-bold text-accent">{announcement.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Acknowledged:</span>
                <span className="font-mono text-primary dark:text-white">100% of GMs</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Created Date:</span>
                <span className="font-mono text-primary dark:text-white">{announcement.createdDate || '2026-10-27'}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                icon={Edit}
                onClick={() => navigate(`/super-admin/platform/announcements/edit/${announcement.id}`)}
                className="w-full"
              >
                Modify Bulletin
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailPage;

