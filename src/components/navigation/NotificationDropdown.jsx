import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, Clock } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'VIP Arrival: Sir Alexander Kensington arriving in 45 minutes.',
    time: '10m ago',
    read: false,
    type: 'vip',
  },
  {
    id: 'notif-2',
    title: 'New Presidential Suite reservation confirmed (AUR-9922).',
    time: '1h ago',
    read: false,
    type: 'booking',
  },
  {
    id: 'notif-3',
    title: 'Suite PH-1201 sanitation inspection approved with 100% score.',
    time: '2h ago',
    read: true,
    type: 'system',
  },
];

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-charcoal-muted dark:text-gray-300 hover:text-accent hover:bg-white dark:hover:bg-primary-800 border border-transparent hover:border-accent/40 shadow-sm hover:shadow-gold transition-all duration-300 active:scale-95 group"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-[0_0_6px_#C6A66B]" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-dropdown rounded-3xl shadow-2xl border border-accent/30 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-3 border-b border-border/80 dark:border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                Dispatch Notifications
              </h4>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-accent hover:underline flex items-center gap-1 font-semibold transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-border/40 dark:divide-border-dark/40 max-h-72 overflow-y-auto px-2 py-1">
            {notifications.map(item => (
              <div
                key={item.id}
                className={`p-3 my-1 rounded-2xl hover:bg-ivory/80 dark:hover:bg-primary-800/60 transition-all cursor-pointer ${
                  !item.read
                    ? 'bg-accent/10 border border-accent/20 dark:bg-accent/10'
                    : 'border border-transparent'
                }`}
              >
                <p className="text-xs text-charcoal dark:text-gray-200 font-medium leading-relaxed">
                  {item.title}
                </p>
                <span className="text-[10px] text-charcoal-muted dark:text-gray-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 pt-2.5 text-center border-t border-border/60 dark:border-border-dark/60">
            <span className="text-[11px] text-accent font-semibold hover:underline cursor-pointer">
              View All Sovereign Dispatch Log →
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

