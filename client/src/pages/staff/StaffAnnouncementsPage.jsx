import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import {
  Volume2,
  Pin,
  Calendar,
  User,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  Check
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const [announcements] = useState([
    {
      id: 'ANN-2026-042',
      title: 'Monaco Grand Prix VIP Chauffeur Fleet Protocols',
      category: 'Executive Bulletin',
      author: 'Julian St. Clair (General Manager)',
      date: 'Today at 08:30 AM',
      pinned: true,
      body: 'All concierge, valet, and butler staff are reminded that special security credentials for the Port Hercule paddock zone are now ready for collection from Security Station 2. Please verify guest names prior to dispatching luxury fleet vehicles and Rolls Royce phantoms.',
    },
    {
      id: 'ANN-2026-041',
      title: 'Michelin Star Wine Cellar Private Sommelier Tasting',
      category: 'Department Briefing',
      author: 'Henri Delacroix (Head Sommelier)',
      date: 'Yesterday at 17:00 PM',
      pinned: false,
      body: 'A tasting and pairing briefing for the rare 1996 Château Margaux consignment will take place in the Grand Cellar at 16:30 tomorrow for all senior service leads and dining staff.',
    },
    {
      id: 'ANN-2026-039',
      title: 'Hygiene & Cleanliness Inspection Audit Clearance: 99.8%',
      category: 'Hospitality Recognition',
      author: 'Audit Bureau Monaco',
      date: 'Oct 28, 2026',
      pinned: false,
      body: 'Lazfort Palace has been awarded the prestigious Sovereign 5-Star Hygiene Excellence Ribbon for Q4 2026. Warm congratulations to our dedicated housekeeping, engineering, and concierge staff.',
    },
    {
      id: 'ANN-2026-035',
      title: 'Helipad Night-Time Noise Ordinance Reminder',
      category: 'Safety & Aviation',
      author: 'Captain Luc Beaumont (Helipad Master)',
      date: 'Oct 24, 2026',
      pinned: false,
      body: 'Monaco Civil Aviation requires all rotorcraft arrivals past 22:30 to utilize silent-approach descent paths over Port Hercule. Ensure departing VIP guests are briefed accordingly.',
    },
  ]);

  const filteredAnnouncements = announcements.filter(a => {
    const q = searchQuery.toLowerCase().trim();
    return !q || a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Hotel Directives & Announcements"
        subtitle="Executive management bulletins, departmental operational memos, and palace recognition notices."
        icon={Volume2}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/staff/communication/notifications')}
            >
              My Notifications
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/staff/communication/messages')}
            >
              Open Staff Chat
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Bulletins"
          value={announcements.length}
          subtitle="General management memos"
          icon={Volume2}
        />
        <StatCard
          title="Pinned High-Priority Directives"
          value={announcements.filter(a => a.pinned).length}
          subtitle="Mandatory reading for shift"
          icon={Pin}
        />
        <StatCard
          title="Compliance Verified"
          value="100%"
          subtitle="Staff acknowledgement logged"
          icon={ShieldCheck}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          <input
            type="text"
            placeholder="Search bulletins and executive directives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
          />
        </div>

        <div className="space-y-4 pt-2">
          {filteredAnnouncements.map((a) => (
            <div
              key={a.id}
              className={`p-6 rounded-2xl border transition-all ${
                a.pinned
                  ? 'border-accent/50 bg-accent/10 shadow-gold'
                  : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/10 dark:border-white/5 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  {a.pinned && (
                    <span className="badge badge-gold font-mono text-[10px] flex items-center gap-1 px-2.5 py-0.5">
                      <Pin className="w-3 h-3 text-accent" />
                      Pinned Directive
                    </span>
                  )}
                  <span className="badge badge-neutral font-mono text-[10px] px-2 py-0.5">
                    {a.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-charcoal-muted dark:text-gray-400">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span>{a.author}</span>
                  <span>•</span>
                  <span>{a.date}</span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-base text-primary dark:text-white mb-2">
                {a.title}
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffAnnouncementsPage;

