import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Save,
  ShieldAlert,
  Fingerprint,
  RefreshCw
} from 'lucide-react';

export const CustomerSecurityPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Active Sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro 16" — Apple M3 Max',
      browser: 'Safari 18.1 (macOS Sequoia)',
      ipAddress: '195.78.82.14 (Monte-Carlo, Monaco)',
      lastActive: 'Active Now (Current Session)',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'iPhone 16 Pro Max — iOS 18.2',
      browser: 'Lazfort Resident App v2.4',
      ipAddress: '195.78.82.20 (Monte-Carlo, Monaco)',
      lastActive: '24 minutes ago',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'iPad Pro 13" (M4) — iPadOS 18',
      browser: 'Chrome 130 Mobile',
      ipAddress: '82.165.197.10 (London, United Kingdom)',
      lastActive: 'Yesterday, 18:42',
      isCurrent: false,
    },
  ]);

  // Security Audit History
  const [securityEvents] = useState([
    {
      id: 'evt-1',
      event: 'Digital Key clearance verified for Suite PH-1201',
      timestamp: 'Today, 14:10',
      status: 'success',
      location: 'Monaco Private Elevator Lock',
    },
    {
      id: 'evt-2',
      event: 'Successful biometric authentication (TouchID/FaceID)',
      timestamp: 'Today, 09:30',
      status: 'success',
      location: 'Monte-Carlo, Monaco',
    },
    {
      id: 'evt-3',
      event: 'Security clearance updated to Sovereign Diamond Member',
      timestamp: '26 Oct 2026, 11:15',
      status: 'info',
      location: 'Corporate Front Desk Terminal',
    },
  ]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Validation Error', 'Please complete all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mismatch', 'New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Security Rule', 'Password must be at least 8 characters long.', 'warning');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast(
        'Password Updated',
        'Your security credentials have been updated across all encrypted sessions.',
        'success'
      );
    }, 500);
  };

  const handleTerminateOtherSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent));
    showToast(
      'Sessions Terminated',
      'All other active devices have been securely logged out and clearances revoked.',
      'info'
    );
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    showToast(
      nextState ? '2FA Enabled' : '2FA Disabled',
      nextState
        ? 'Two-Factor Authentication is now actively protecting your account.'
        : 'Two-Factor Authentication has been suspended.',
      nextState ? 'success' : 'warning'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl">
      <PageHeader
        title="Security & Clearance Console"
        description="Encrypted credentials, multi-factor hardware security keys, active login sessions, and sovereign audit trail."
        badge="Sovereign Shield Active"
      />

      {/* Account Security Status Banner */}
      <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Account Protection: Maximum Luxury Clearance
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                100% SECURE
              </span>
            </div>
            <p className="text-xs text-charcoal-muted dark:text-gray-300 mt-0.5">
              End-to-end 256-bit encryption active for digital keys, personal documents, and financial transactions.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-white/80 dark:bg-primary-900 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          TLS 1.3 Verified
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Change Password Form */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                Credential Vault
              </span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
                Change Password
              </h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-accent"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 8 characters with numbers & symbols"
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isChangingPassword ? 'Securing Credentials...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Multi-Factor Authentication (2FA) */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                Hardware & Identity Protection
              </span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
                Two-Factor & Biometrics
              </h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/60 border border-border/80 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Authenticator App (2FA)
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Google Authenticator or YubiKey OTP
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${twoFactorEnabled
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
              >
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/60 border border-border/80 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Biometric Digital Key Passkey
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    FaceID / TouchID suite door unlock
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBiometricEnabled(!biometricEnabled);
                  showToast(
                    biometricEnabled ? 'Biometrics Suspended' : 'Biometrics Active',
                    biometricEnabled
                      ? 'Biometric keys unlinked.'
                      : 'Apple FaceID / WebAuthn passkey registered.',
                    'info'
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${biometricEnabled
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
              >
                {biometricEnabled ? 'Linked' : 'Not Linked'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/25 text-xs text-charcoal dark:text-gray-200">
              <p className="font-semibold text-primary dark:text-white mb-1">
                🔒 Security Note for Luxury Suites
              </p>
              Your personal RFID suite credentials and cryptographic key fob are synchronized directly with this portal. Disabling 2FA will require front desk re-verification upon next check-in.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Login Sessions & Devices */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/80 dark:border-white/10 gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
              Device Management
            </span>
            <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
              Active Login Sessions ({activeSessions.length})
            </h3>
          </div>

          {activeSessions.length > 1 && (
            <button
              type="button"
              onClick={handleTerminateOtherSessions}
              className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out All Other Devices</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {activeSessions.map(session => (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-primary dark:text-white">
                      {session.device}
                    </h4>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    {session.browser} • {session.ipAddress}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-mono text-accent text-[11px] block">
                  {session.lastActive}
                </span>
                {!session.isCurrent && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSessions(prev => prev.filter(s => s.id !== session.id));
                      showToast('Device Terminated', `Signed out ${session.device}.`, 'info');
                    }}
                    className="text-[10px] text-rose-500 hover:underline font-semibold mt-1"
                  >
                    Revoke Clearance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Security Audit Log */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
              Compliance & Audit
            </span>
            <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
              Recent Clearance & Authentication Events
            </h3>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-3">
          {securityEvents.map(evt => (
            <div
              key={evt.id}
              className="p-3.5 rounded-2xl bg-ivory/60 dark:bg-primary-900/30 border border-border/60 dark:border-white/5 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-primary dark:text-white">{evt.event}</p>
                  <p className="text-[10px] text-charcoal-muted dark:text-gray-400">{evt.location}</p>
                </div>
              </div>

              <span className="font-mono text-accent text-[11px] shrink-0">
                {evt.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSecurityPage;

export default CustomerSecurityPage;

export default CustomerSecurityPage;

