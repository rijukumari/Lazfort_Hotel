import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';
import {
  Lock,
  KeyRound,
  Smartphone,
  Clock,
  Save,
  RotateCcw,
  Laptop,
  Trash2,
} from 'lucide-react';

const initialActiveSessions = [
  {
    id: 'ses-01',
    user: 'Lord Alistair Sterling',
    role: 'Super Admin',
    device: 'Safari 18.1 • macOS Sonoma (Apple Silicon)',
    ipAddress: '194.199.110.12',
    location: 'Monaco, MC',
    loginTime: '2026-10-28 18:30',
    isCurrent: true,
  },
  {
    id: 'ses-02',
    user: 'Helena Von Berg',
    role: 'Hotel Admin (GM)',
    device: 'Chrome 131 • Windows 11 Enterprise',
    ipAddress: '193.134.254.10',
    location: 'St. Moritz, CH',
    loginTime: '2026-10-28 17:15',
    isCurrent: false,
  },
  {
    id: 'ses-03',
    user: 'Jean-Luc De La Tour',
    role: 'Hotel Admin (GM)',
    device: 'Edge 131 • iPadOS 18 (Private Wi-Fi)',
    ipAddress: '202.3.238.18',
    location: 'Bora Bora, PF',
    loginTime: '2026-10-28 14:02',
    isCurrent: false,
  },
];

export const SecuritySettingsPage = () => {
  const { showToast } = useToast();

  const DEFAULT_POLICIES = {
    sessionTimeout: '30',
    passwordMinLength: '12',
    requireSymbols: true,
    passwordExpiryDays: '90',
    twoFactorMandatory: true,
    maxFailedAttempts: '5',
    lockoutDurationMins: '30',
    ipWhitelistingEnabled: false,
  };

  const getSavedPolicies = () => {
    try {
      const stored = localStorage.getItem('lazfort_security_settings');
      if (stored) return { ...DEFAULT_POLICIES, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Failed to load security settings', e);
    }
    return DEFAULT_POLICIES;
  };

  const [savedPolicies, setSavedPolicies] = useState(getSavedPolicies);

  const [sessionTimeout, setSessionTimeout] = useState(savedPolicies.sessionTimeout);
  const [passwordMinLength, setPasswordMinLength] = useState(savedPolicies.passwordMinLength);
  const [requireSymbols, setRequireSymbols] = useState(savedPolicies.requireSymbols);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(savedPolicies.passwordExpiryDays);
  const [twoFactorMandatory, setTwoFactorMandatory] = useState(savedPolicies.twoFactorMandatory);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState(savedPolicies.maxFailedAttempts);
  const [lockoutDurationMins, setLockoutDurationMins] = useState(savedPolicies.lockoutDurationMins);
  const [ipWhitelistingEnabled, setIpWhitelistingEnabled] = useState(savedPolicies.ipWhitelistingEnabled);

  const [activeSessions, setActiveSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_active_sessions');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load sessions', e);
    }
    return initialActiveSessions;
  });

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [terminateSessionId, setTerminateSessionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setConfirmSaveOpen(false);
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const payload = {
        sessionTimeout,
        passwordMinLength,
        requireSymbols,
        passwordExpiryDays,
        twoFactorMandatory,
        maxFailedAttempts,
        lockoutDurationMins,
        ipWhitelistingEnabled,
        lastCommitted: new Date().toISOString(),
      };
      localStorage.setItem('lazfort_security_settings', JSON.stringify(payload));
      setSavedPolicies(payload);
      showToast('Security Policies Enforced', 'Global authentication tokens and session policies committed into database.', 'success');
    } catch {
      showToast('Error', 'Failed to enforce security policies.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const saved = getSavedPolicies();
    setSessionTimeout(saved.sessionTimeout);
    setPasswordMinLength(saved.passwordMinLength);
    setRequireSymbols(saved.requireSymbols);
    setPasswordExpiryDays(saved.passwordExpiryDays);
    setTwoFactorMandatory(saved.twoFactorMandatory);
    setMaxFailedAttempts(saved.maxFailedAttempts);
    setLockoutDurationMins(saved.lockoutDurationMins);
    setIpWhitelistingEnabled(saved.ipWhitelistingEnabled);
    setConfirmResetOpen(false);
    showToast('Policies Restored', 'Restored to last committed database policies.', 'info');
  };

  const handleTerminateSession = () => {
    if (!terminateSessionId) return;
    setActiveSessions(prev => {
      const updated = prev.filter(s => s.id !== terminateSessionId);
      localStorage.setItem('lazfort_active_sessions', JSON.stringify(updated));
      return updated;
    });
    setTerminateSessionId(null);
    showToast('Session Terminated', 'Remote authentication clearance revoked and operator logged out.', 'warning');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Security & Access Control Settings"
        subtitle="Manage cryptographic access protocols, mandatory Two-Factor Authentication, and active operator sessions"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'System & Security', path: '/super-admin/system' },
          { label: 'Security Settings' },
        ]}
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Active Clearances"
          value={activeSessions.length}
          period="concurrent operator sessions"
          icon={<Laptop className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="2FA Enforcement"
          value={twoFactorMandatory ? '100% Enforced' : 'Optional'}
          period="hardware token or TOTP"
          icon={<Smartphone className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Brute-Force Guard"
          value={`${maxFailedAttempts} Attempts`}
          period="auto-lockout threshold"
          icon={<Lock className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Session Inactivity SLA"
          value={`${sessionTimeout} Minutes`}
          period="idle token revocation"
          icon={<Clock className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Password & 2FA */}
        <div className="card-luxury p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border dark:border-white/10">
            <KeyRound className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Password & Credential Governance
              </h3>
              <p className="text-xs text-charcoal-muted">Enforced on all staff and admin accounts</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                  Minimum Password Length
                </label>
                <select
                  value={passwordMinLength}
                  onChange={e => setPasswordMinLength(e.target.value)}
                  className="input-luxury text-xs w-full font-mono"
                >
                  <option value="10">10 Characters</option>
                  <option value="12">12 Characters (Recommended)</option>
                  <option value="16">16 Characters (High Assurance)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                  Password Rotation Frequency
                </label>
                <select
                  value={passwordExpiryDays}
                  onChange={e => setPasswordExpiryDays(e.target.value)}
                  className="input-luxury text-xs w-full font-mono"
                >
                  <option value="60">Every 60 Days</option>
                  <option value="90">Every 90 Days</option>
                  <option value="180">Every 180 Days</option>
                  <option value="0">No Expiration</option>
                </select>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireSymbols}
                  onChange={e => setRequireSymbols(e.target.checked)}
                  className="mt-1 rounded text-accent focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-charcoal dark:text-gray-200 block">
                    Require Special Symbols & Mixed Case
                  </span>
                  <span className="text-[11px] text-charcoal-muted">
                    Requires upper, lower, numbers, and special symbols (e.g. !@#$%).
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorMandatory}
                  onChange={e => setTwoFactorMandatory(e.target.checked)}
                  className="mt-1 rounded text-accent focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-charcoal dark:text-gray-200 block">
                    Mandatory Multi-Factor Authentication (2FA)
                  </span>
                  <span className="text-[11px] text-charcoal-muted">
                    Restricts login clearance until Google Authenticator or FIDO2 key is registered.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Session & Lockout */}
        <div className="card-luxury p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border dark:border-white/10">
            <Lock className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Session Control & Lockout Thresholds
              </h3>
              <p className="text-xs text-charcoal-muted">Brute-force and automated intrusion defense</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                  Idle Session Inactivity Expiry
                </label>
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="input-luxury text-xs w-full font-mono"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                  Failed Attempt Lockout Count
                </label>
                <select
                  value={maxFailedAttempts}
                  onChange={e => setMaxFailedAttempts(e.target.value)}
                  className="input-luxury text-xs w-full font-mono"
                >
                  <option value="3">3 Attempts</option>
                  <option value="5">5 Attempts</option>
                  <option value="10">10 Attempts</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                Account Lockout Quarantine Duration
              </label>
              <select
                value={lockoutDurationMins}
                onChange={e => setLockoutDurationMins(e.target.value)}
                className="input-luxury text-xs w-full font-mono"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="manual">Require Super Admin Unlock Only</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ipWhitelistingEnabled}
                  onChange={e => setIpWhitelistingEnabled(e.target.checked)}
                  className="mt-1 rounded text-accent focus:ring-accent"
                />
                <div>
                  <span className="font-semibold text-charcoal dark:text-gray-200 block">
                    Corporate Static IP Range Lock
                  </span>
                  <span className="text-[11px] text-charcoal-muted">
                    Only permit Super Admin logins originating from approved corporate subnets.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-6 border-t border-border dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-2xl border border-border dark:border-white/15 text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800/50 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 text-accent shrink-0" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmSaveOpen(true)}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-2xl gold-gradient-bg text-primary-950 btn-3d shadow-md shadow-accent/20 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Save className="w-4 h-4 shrink-0" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Operator Sessions Table */}
      <div className="card-luxury p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Active Operator Console Sessions
            </h3>
            <p className="text-xs text-charcoal-muted">
              Live JWT sessions currently authenticated across luxury consoles
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold">
            {activeSessions.length} Active Tokens
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory dark:bg-white/5 border-b border-border dark:border-white/10 text-[10px] font-mono text-charcoal-muted uppercase">
              <tr>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Client Device</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Login Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {activeSessions.map(ses => (
                <tr key={ses.id} className="hover:bg-ivory/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary dark:text-white">{ses.user}</span>
                      {ses.isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono text-[9px] font-bold">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-accent font-mono">{ses.role}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-charcoal dark:text-gray-300">
                    {ses.device}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-charcoal-muted">{ses.ipAddress}</td>
                  <td className="py-3.5 px-4 text-charcoal dark:text-gray-300">{ses.location}</td>
                  <td className="py-3.5 px-4 font-mono text-charcoal-muted">{ses.loginTime}</td>
                  <td className="py-3.5 px-4 text-right">
                    {!ses.isCurrent && (
                      <button
                        onClick={() => setTerminateSessionId(ses.id)}
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        title="Terminate Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        onConfirm={handleSave}
        title="Commit Security Policies"
        message="Are you sure you want to commit these security parameters? Operators who fail to meet the new password or 2FA policies will be prompted upon their next clearance check."
        confirmText="Enforce Policies"
        confirmLabel="Enforce Policies"
        variant="info"
      />

      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleReset}
        title="Revert to Default Security"
        message="Are you sure you want to revert security thresholds to default factory values?"
        confirmText="Reset Defaults"
        confirmLabel="Reset Defaults"
        variant="warning"
      />

      <ConfirmDialog
        isOpen={!!terminateSessionId}
        onClose={() => setTerminateSessionId(null)}
        onConfirm={handleTerminateSession}
        title="Terminate Operator Session"
        message="Are you sure you want to immediately revoke this operator's active session token? Their console will be locked and redirected to login."
        confirmText="Terminate Token"
        confirmLabel="Terminate Token"
        variant="danger"
      />
    </div>
  );
};

export default SecuritySettingsPage;

