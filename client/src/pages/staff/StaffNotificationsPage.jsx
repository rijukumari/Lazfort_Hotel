import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
  Trash2,
  Briefcase,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffNotificationsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([
    {
      id: 'STF-NT-101',
      title: 'New VIP Concierge Mission Assigned',
      message: 'Lord Alistair Sterling in Suite 801 requested vintage champagne & caviar service on private terrace by 11:00 AM.',
      category: 'Task Alert',
      timestamp: '15 mins ago',
      read: false,
      priority: 'urgent',
    },
    {
      id: 'STF-NT-102',
      title: 'Shift Timetable Update Approved',
      message: 'Your shift swap request for Nov 06 has been approved by Chief Concierge desk. Evening turndown roster updated.',
      category: 'Shift Reminder',
      timestamp: '1 hour ago',
      read: false,
      priority: 'normal',
    },
    {
      id: 'STF-NT-103',
      title: 'Monthly Biometric Attendance Validation Passed',
      message: 'October attendance ledger verified with 100% on-time check-in record. Overtime compensation approved for Grand Prix weekend.',
      category: 'Attendance Alert',
      timestamp: 'Yesterday at 17:30',
      read: true,
      priority: 'normal',
    },
    {
      id: 'STF-NT-104',
      title: 'Clefs d’Or Masterclass Accreditation Session',
      message: 'Reminder: Professional hospitality protocol symposium will be held in Salon des Ambassadeurs this Thursday at 14:00.',
      category: 'Training Notice',
      timestamp: 'Oct 30, 2026',
      read: true,
      priority: 'normal',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Updated', 'All notifications marked as read.', 'success');
  };

  const handleToggleRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Dismissed', 'Notification alert cleared.', 'info');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Duty Notifications"
        subtitle="Live work order dispatches, shift announcements, attendance milestones, and operational prompts."
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
              Mark All Read
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/staff/work')}
            >
              Assigned Tasks
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Unread Alerts"
          value={unreadCount}
          subtitle="Action required today"
          icon={Bell}
        />
        <StatCard
          title="Urgent Mission Alerts"
          value={notifications.filter(n => n.priority === 'urgent').length}
          subtitle="Time-sensitive VIP errands"
          icon={AlertTriangle}
        />
        <StatCard
          title="Shift Reminders"
          value={notifications.filter(n => n.category.includes('Shift')).length}
          subtitle="Roster & station updates"
          icon={Clock}
        />
        <StatCard
          title="Attendance Confirmed"
          value="100%"
          subtitle="Biometric punch verified"
          icon={CheckCircle2}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${!n.read
                ? 'border-accent/40 bg-accent/10 shadow-gold'
                : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] opacity-75 hover:opacity-100'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.priority === 'urgent'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-accent/20 text-accent border border-accent/30'
                }`}>
                {n.priority === 'urgent' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
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
                onClick={() => handleDelete(n.id)}
                title="Dismiss Alert"
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffNotificationsPage;

