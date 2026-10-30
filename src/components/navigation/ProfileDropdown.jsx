import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Settings, ShieldCheck, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-white dark:hover:bg-primary-800/80 border border-transparent hover:border-accent/30 shadow-none hover:shadow-sm transition-all duration-300 group"
        aria-label="User profile menu"
      >
        {/* 3D Double-Ring Gold Avatar */}
        <div className="relative">
          <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-accent via-accent/40 to-accent/90 shadow-sm group-hover:shadow-gold transition-all duration-300">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name || 'User'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-dark" />
        </div>

        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-primary dark:text-white leading-tight group-hover:text-accent transition-colors">
            {user?.name || 'User'}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-[10px] text-accent font-mono font-medium capitalize">
              {(role || '').replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-accent hidden md:block transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 glass-dropdown rounded-3xl shadow-2xl border border-accent/30 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-3.5 border-b border-border/80 dark:border-border-dark flex items-center gap-3">
            <div className="w-11 h-11 rounded-full p-0.5 bg-accent/40 shadow-sm flex-shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-primary dark:text-white truncate">
                  {user?.name}
                </p>
                <Sparkles className="w-3 h-3 text-accent flex-shrink-0" />
              </div>
              <p className="text-[11px] text-charcoal-muted truncate">{user?.email}</p>
              {user?.hotelName && (
                <span className="inline-block mt-1 px-2 py-0.5 text-[9px] rounded-md bg-accent/15 text-accent font-semibold truncate border border-accent/20">
                  {user.hotelName}
                </span>
              )}
            </div>
          </div>

          <div className="py-2 px-2 text-xs text-charcoal dark:text-gray-200 space-y-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(role === 'customer' ? '/customer/profile' : `/${role.replace(/_/g, '-')}/settings`);
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-ivory dark:hover:bg-primary-800/80 flex items-center gap-2.5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">My Profile & Preferences</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(role === 'customer' ? '/customer/profile' : `/${role.replace(/_/g, '-')}/settings`);
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-ivory dark:hover:bg-primary-800/80 flex items-center gap-2.5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Hotel System Preferences</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(role === 'customer' ? '/customer/profile' : `/${role.replace(/_/g, '-')}/system/security`);
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-ivory dark:hover:bg-primary-800/80 flex items-center gap-2.5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Security & Clearance</span>
            </button>
          </div>

          <div className="pt-2 px-2 border-t border-border/80 dark:border-border-dark">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-xl text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors font-medium"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <span>Sign Out & Lock Console</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

