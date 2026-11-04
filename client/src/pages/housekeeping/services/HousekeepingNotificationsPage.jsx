import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Wrench,
  Clock,
  Check,
  Trash2,
  Settings,
  Filter,
  Volume2
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const HousekeepingNotificationsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'alerts' | 'announcements'

  // Notifications registry
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-901',
      title: 'Urgent VIP Arrival — Suite 801 Presidential Penthouse',
      message: 'Lady Eleanor Vance arriving early via private yacht transfer at 14:00. Prioritize turn-down linen change, fresh white orchids, and crystal decanter setup immediately.',
      type: 'vip',
      category: 'Task Alert',
      timestamp: '10 minutes ago',
      read: false,
      priority: 'urgent',
    },
    {
      id: 'NOTIF-902',
      title: 'Maintenance Sign-Off Completed for Suite 402',
      message: 'Chief Engineer Marco Bellini has cleared the Jacuzzi hydro-jet repair in Junior Suite 402. Room returned to clean turnover queue.',
      type: 'maintenance',
      category: 'Maintenance Update',
      timestamp: '45 minutes ago',
      read: false,
      priority: 'high',
    },
    {
      id: 'NOTIF-903',
      title: 'Palace Sanitation Hygiene Protocol Update v4.2',
      message: 'Executive management bulletin: Steam sterilization temperature for master marble baths must reach 115°C certified threshold. All inspection checklists updated accordingly.',
      type: 'announcement',
      category: 'Executive Announcement',
      timestamp: '2 hours ago',
      read: true,
      priority: 'normal',
    },
    {
      id: 'NOTIF-904',
      title: 'Shift Handover Roster Dispatched',
      message: 'Evening turndown team allocations for Floors 10-18 have been published. Check your personal duty schedule.',
      type: 'schedule',
      category: 'Schedule Alert',
      timestamp: '4 hours ago',
      read: true,
      priority: 'normal',
    },
    {
      id: 'NOTIF-905',
      title: 'Lost Property Repatriation Confirmed',
      message: 'Cartier Love Bracelet found in Suite 801 has been logged and placed into Safe Vault B under primary custody.',
      type: 'service',
      category: 'Service Alert',
      timestamp: 'Yesterday at 17:30',
      read: true,
      priority: 'normal',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Updated', 'All operational alerts marked as read.', 'success');
  };

  const handleToggleRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Alert Cleared', 'Notification removed from dispatch tray.', 'info');
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'alerts') return n.type === 'vip' || n.type === 'maintenance';
    if (filterType === 'announcements') return n.type === 'announcement';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Housekeeping Notification Center"
        subtitle="Operational broadcasts, VIP turnover alerts, engineering work order updates, and sanitation bulletins."
        icon={Bell}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Check}
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/housekeeping/cleaning/todo')}
            >
              Go to Turnover Queue
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Unread Broadcasts"
          value={unreadCount}
          subtitle="Awaiting acknowledgement"
          icon={Bell}
        />
        <StatCard
          title="VIP Turnover Alerts"
          value={notifications.filter(n => n.type === 'vip').length}
          subtitle="Immediate priority check-ins"
          icon={AlertTriangle}
        />
        <StatCard
          title="Engineering Rectifications"
          value={notifications.filter(n => n.type === 'maintenance').length}
          subtitle="Cleared maintenance tickets"
          icon={Wrench}
        />
        <StatCard
          title="Operational Bulletins"
          value={notifications.filter(n => n.type === 'announcement').length}
          subtitle="Executive palace notices"
          icon={Volume2}
        />
      </div>

      {/* Notification List & Filters */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-primary/10 dark:border-white/5 pb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-accent text-primary dark:text-[#080d19] font-bold shadow-gold'
                  : 'bg-charcoal-bg dark:bg-[#080d19] text-charcoal-muted dark:text-gray-400 hover:text-white'
              }`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterType === 'unread'
                  ? 'bg-accent text-primary dark:text-[#080d19] font-bold shadow-gold'
                  : 'bg-charcoal-bg dark:bg-[#080d19] text-charcoal-muted dark:text-gray-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('alerts')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterType === 'alerts'
                  ? 'bg-accent text-primary dark:text-[#080d19] font-bold shadow-gold'
                  : 'bg-charcoal-bg dark:bg-[#080d19] text-charcoal-muted dark:text-gray-400 hover:text-white'
              }`}
            >
              VIP & Maintenance Alerts
            </button>
            <button
              type="button"
              onClick={() => setFilterType('announcements')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterType === 'announcements'
                  ? 'bg-accent text-primary dark:text-[#080d19] font-bold shadow-gold'
                  : 'bg-charcoal-bg dark:bg-[#080d19] text-charcoal-muted dark:text-gray-400 hover:text-white'
              }`}
            >
              Executive Bulletins
            </button>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3 pt-2">
          {filteredNotifications.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                !n.read
                  ? 'border-accent/40 bg-accent/5 dark:bg-accent/10 shadow-sm'
                  : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'vip'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : n.type === 'maintenance'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-accent/20 text-accent border border-accent/30'
                }`}>
                  {n.type === 'vip' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'maintenance' ? (
                    <Wrench className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-bold text-sm text-primary dark:text-white">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    )}
                    <span className="badge badge-gold font-mono text-[9px] px-2 py-0.5">
                      {n.category}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal dark:text-gray-300 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-charcoal-muted dark:text-gray-400 pt-1">
                    <Clock className="w-3 h-3 text-accent" />
                    <span>{n.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleRead(n.id)}
                  title={n.read ? 'Mark as Unread' : 'Mark as Read'}
                  className="p-1.5 rounded-lg text-charcoal-muted dark:text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteNotif(n.id)}
                  title="Dismiss Alert"
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center text-charcoal-muted dark:text-gray-400 text-xs">
              <Bell className="w-10 h-10 text-accent/30 mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-primary dark:text-white">
                No Notifications Found
              </p>
              <p className="text-[11px] mt-0.5">All operational alerts in this category have been acknowledged.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousekeepingNotificationsPage;

