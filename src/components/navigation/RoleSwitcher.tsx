import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/user';
import {
  Crown,
  Building2,
  ConciergeBell,
  User,
  Sparkles,
  ShieldCheck,
  Key,
  ChevronDown,
  Check
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, switchRole, availableRoles } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleIcons: Record<UserRole, React.ReactNode> = {
    super_admin: <Crown className="w-3.5 h-3.5 text-accent" />,
    hotel_admin: <Building2 className="w-3.5 h-3.5 text-accent" />,
    receptionist: <ConciergeBell className="w-3.5 h-3.5 text-accent" />,
    customer: <User className="w-3.5 h-3.5 text-accent" />,
    housekeeping: <Sparkles className="w-3.5 h-3.5 text-accent" />,
    staff: <Key className="w-3.5 h-3.5 text-accent" />,
  };

  const handleSelectRole = (newRole: UserRole) => {
    setIsOpen(false);
    if (newRole === role) return;

    switchRole(newRole);
    const targetConfig = availableRoles.find(r => r.role === newRole);
    const targetPath = targetConfig?.defaultPath || `/${newRole.replace(/_/g, '-')}/dashboard`;

    showToast(
      'Role Clearance Switched',
      `Switched console clearance to ${targetConfig?.label || newRole}.`,
      'success'
    );

    navigate(targetPath);
  };

  const currentRoleConfig = availableRoles.find(r => r.role === role);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/60 border border-accent/40 hover:border-accent text-xs font-semibold text-primary dark:text-white transition-all shadow-sm hover:shadow-gold"
        title="Switch Console Clearance Role"
      >
        <span className="flex-shrink-0">{roleIcons[role]}</span>
        <span className="hidden sm:inline-block font-mono tracking-wide text-[11px] truncate max-w-[130px]">
          {currentRoleConfig?.label || role}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-accent transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-3xl shadow-2xl border border-accent/30 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-border/80 dark:border-border-dark">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
              Console Clearance
            </span>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              1-Click Instant Role Switcher
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {availableRoles.map(r => {
              const isSelected = r.role === role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleSelectRole(r.role)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-accent/15 text-accent font-bold border border-accent/30'
                      : 'text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800/80 hover:text-accent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      {roleIcons[r.role]}
                    </span>
                    <div className="truncate">
                      <p className="text-xs truncate">{r.label}</p>
                      <p className="text-[10px] text-charcoal-muted dark:text-gray-400 truncate font-normal">
                        {r.role === 'customer'
                          ? 'Suite Booking, Aapna Room, Facilities'
                          : r.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;

