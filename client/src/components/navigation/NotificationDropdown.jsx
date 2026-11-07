import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Sparkles, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import hotelApi from '../../services/hotelApi';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  // Load notifications from backend API
  const fetchNotifications = useCallback(async (force = false) => {
    if (!force && hasLoadedOnce && !isOpen) return;
    try {
      setIsLoading(true);
      const res = await hotelApi.getNotifications(role || '');
      if (res && res.status === 'success') {
        setNotifications(res.data || []);
        setUnreadCount(typeof res.unread_count === 'number' ? res.unread_count : (res.data || []).filter(n => !n.read).length);
      } else if (Array.isArray(res)) {
        setNotifications(res);
        setUnreadCount(res.filter(n => !n.read).length);
      }
      setHasLoadedOnce(true);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [role, hasLoadedOnce, isOpen]);

  // Initial fetch for unread badge count
  useEffect(() => {
    fetchNotifications(true);
  }, [role]);

  // Handle dropdown open toggle
  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && !hasLoadedOnce) {
      fetchNotifications(true);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })));
    setUnreadCount(0);
    try {
      await hotelApi.markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Click on a single notification (marks as read without redirecting)
  const handleNotificationClick = async (item) => {
    if (!item.read) {
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, read: true, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      try {
        await hotelApi.markNotificationRead(item.id);
      } catch (err) {
        console.error('Failed to mark notification read:', err);
      }
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggle}
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
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
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
              {isLoading && notifications.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-charcoal-muted">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  <span className="text-xs">Loading live dispatch logs...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-charcoal-muted dark:text-gray-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-80" />
                  All clear. No active dispatch notices.
                </div>
              ) : (
                notifications.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 my-1 rounded-2xl hover:bg-ivory/80 dark:hover:bg-primary-800/60 transition-all cursor-pointer ${
                      !item.read
                        ? 'bg-accent/10 border border-accent/20 dark:bg-accent/10'
                        : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-charcoal dark:text-gray-200 font-medium leading-relaxed">
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />
                      )}
                    </div>
                    {item.message && (
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1 line-clamp-1">
                        {item.message}
                      </p>
                    )}
                    <span className="text-[10px] text-charcoal-muted dark:text-gray-400 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      {item.time || 'Recent'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 pt-2.5 text-center border-t border-border/60 dark:border-border-dark/60">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowAllModal(true);
                }}
                className="text-[11px] text-accent font-semibold hover:underline cursor-pointer bg-transparent border-0"
              >
                View All Sovereign Dispatch Log ({notifications.length}) →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-surface dark:bg-surface-dark border border-accent/30 rounded-3xl shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/60 dark:border-border-dark/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                    Sovereign Dispatch History
                  </h3>
                  <p className="text-xs text-charcoal-muted">All system, VIP, and operational events</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="text-charcoal-muted hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="my-4 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {notifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    !item.read
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-primary-900/30 border-border/40 hover:border-accent/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-charcoal-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      {item.time || 'Recent'}
                    </span>
                  </div>
                  {item.message && (
                    <p className="text-xs text-charcoal-muted dark:text-gray-300 mt-1">
                      {item.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border/60 dark:border-border-dark/60 flex items-center justify-between">
              {unreadCount > 0 ? (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-accent hover:underline font-semibold"
                >
                  Mark all as read
                </button>
              ) : <div />}
              <button
                onClick={() => setShowAllModal(false)}
                className="px-4 py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-semibold text-xs transition-colors"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationDropdown;


