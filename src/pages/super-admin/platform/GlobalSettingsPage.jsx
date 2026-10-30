import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';
import {
  Sliders,
  Sparkles,
  Building2,
  Mail,
  Phone,
  Globe,
  Clock,
  Shield,
  Bell,
  Save,
  RotateCcw,
  CheckCircle,
  Palette,
  KeyRound,
  FileCheck,
} from 'lucide-react';

export const GlobalSettingsPage = () => {
  const { showToast } = useToast();

  // Settings State
  const [platformName, setPlatformName] = useState('Lazfort ERP Grand Luxe');
  const [tagline, setTagline] = useState('Sovereign Hotel & Resort Management Suite');
  const [supportEmail, setSupportEmail] = useState('concierge@lazfort-erp.com');
  const [supportPhone, setSupportPhone] = useState('+377 98 00 10 00');
  const [hqAddress, setHqAddress] = useState('14 Boulevard des Moulins, 98000 Monaco');
  
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('Europe/Monaco (UTC+1)');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [defaultLanguage, setDefaultLanguage] = useState('en-US');

  const [emailNotifyOnboard, setEmailNotifyOnboard] = useState(true);
  const [smsUrgentDisputes, setSmsUrgentDisputes] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [twoFactorMandatory, setTwoFactorMandatory] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordMinLength, setPasswordMinLength] = useState('12');

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSave = () => {
    setConfirmSaveOpen(false);
    showToast('Platform Settings Saved', 'Global enterprise preferences updated across all hotel instances (Demo State).', 'success');
  };

  const handleReset = () => {
    setPlatformName('Lazfort ERP Grand Luxe');
    setTagline('Sovereign Hotel & Resort Management Suite');
    setSupportEmail('concierge@lazfort-erp.com');
    setSupportPhone('+377 98 00 10 00');
    setCurrency('USD ($)');
    setTimezone('Europe/Monaco (UTC+1)');
    setSessionTimeout('30');
    setConfirmResetOpen(false);
    showToast('Settings Reset', 'Configuration restored to sovereign factory defaults.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Global Platform Settings"
        subtitle="Configure sovereign master branding, regional localization standards, enterprise notifications, and core security policies"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'Platform Management', path: '/super-admin/platform' },
          { label: 'Global Settings' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="btn-luxury-outline inline-flex items-center gap-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={() => setConfirmSaveOpen(true)}
              className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 2 Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Branding */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Sovereign Master Identity & Branding
                </h3>
                <p className="text-xs text-charcoal-muted">Master platform labels, royal heraldry, and tenant branding defaults</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Platform Brand Title</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={e => setPlatformName(e.target.value)}
                  className="input-luxury w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Sovereign Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="input-luxury w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Executive Concierge Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  className="input-luxury w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">HQ Direct Telephone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={e => setSupportPhone(e.target.value)}
                  className="input-luxury w-full text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase mb-1">Monaco Registry Headquarters Address</label>
                <input
                  type="text"
                  value={hqAddress}
                  onChange={e => setHqAddress(e.target.value)}
                  className="input-luxury w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Regional & Fiscal Standards */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Regional, Currency & Fiscal Standards
                </h3>
                <p className="text-xs text-charcoal-muted">Multi-currency settlement bases, default timezones, and audit formatting</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Base Clearing Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="USD ($)">USD ($) — United States Dollar</option>
                  <option value="EUR (€)">EUR (€) — Euro Sovereignty</option>
                  <option value="CHF (CHF)">CHF (CHF) — Swiss Franc</option>
                  <option value="GBP (£)">GBP (£) — British Pound Sterling</option>
                  <option value="AED (AED)">AED (AED) — UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Primary System Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="Europe/Monaco (UTC+1)">Europe/Monaco (UTC+1 / CET)</option>
                  <option value="Europe/Zurich (UTC+1)">Europe/Zurich (UTC+1)</option>
                  <option value="Europe/London (UTC+0)">Europe/London (UTC+0 / GMT)</option>
                  <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4 / GST)</option>
                  <option value="America/New_York (UTC-5)">America/New_York (UTC-5 / EST)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Standard Date Display</label>
                <select
                  value={dateFormat}
                  onChange={e => setDateFormat(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (European Format)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Default UI Language</label>
                <select
                  value={defaultLanguage}
                  onChange={e => setDefaultLanguage(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="en-US">English (United States / International)</option>
                  <option value="fr-FR">Français (Monaco & Côte d’Azur)</option>
                  <option value="de-CH">Deutsch (Schweiz / Suisse)</option>
                  <option value="it-IT">Italiano (Riviera Ligure)</option>
                  <option value="ar-AE">العربية (Emirates Sovereign)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Notifications */}
        <div className="space-y-8">
          {/* Section 3: Security & Session Policies */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Security Policies & Auth
                </h3>
                <p className="text-xs text-charcoal-muted">Session TTL, 2FA enforcement, and password constraints</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-ivory dark:bg-primary-900/40 border border-border/60">
                <div>
                  <span className="font-semibold block text-primary dark:text-white">Mandatory 2FA Enforcement</span>
                  <span className="text-[11px] text-charcoal-muted">Require hardware/TOTP for all hotel administrators</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorMandatory}
                  onChange={e => setTwoFactorMandatory(e.target.checked)}
                  className="rounded text-accent focus:ring-accent h-4 w-4"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Idle Session Timeout (Minutes)</label>
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="15">15 Minutes (High Security)</option>
                  <option value="30">30 Minutes (Standard)</option>
                  <option value="60">60 Minutes (Extended)</option>
                  <option value="120">120 Minutes (Permissive)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Minimum Password Length</label>
                <select
                  value={passwordMinLength}
                  onChange={e => setPasswordMinLength(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="10">10 Characters</option>
                  <option value="12">12 Characters (Recommended)</option>
                  <option value="16">16 Characters (Strict Enterprise)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Notifications */}
          <div className="card-luxury p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Platform Dispatch Alerts
                </h3>
                <p className="text-xs text-charcoal-muted">Automated notification relays</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-ivory dark:bg-primary-900/40 border border-border/60 cursor-pointer">
                <div>
                  <span className="font-semibold block text-primary dark:text-white">Hotel Onboarding Transcripts</span>
                  <span className="text-[11px] text-charcoal-muted">Email alerts for new hotel provisioning</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifyOnboard}
                  onChange={e => setEmailNotifyOnboard(e.target.checked)}
                  className="rounded text-accent focus:ring-accent h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-ivory dark:bg-primary-900/40 border border-border/60 cursor-pointer">
                <div>
                  <span className="font-semibold block text-primary dark:text-white">Emergency SMS Pager</span>
                  <span className="text-[11px] text-charcoal-muted">Urgent alerts for disputes & security flags</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsUrgentDisputes}
                  onChange={e => setSmsUrgentDisputes(e.target.checked)}
                  className="rounded text-accent focus:ring-accent h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-ivory dark:bg-primary-900/40 border border-border/60 cursor-pointer">
                <div>
                  <span className="font-semibold block text-primary dark:text-white">Daily Revenue Digest</span>
                  <span className="text-[11px] text-charcoal-muted">Executive summary at 23:59 CET nightly</span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={e => setDailyDigest(e.target.checked)}
                  className="rounded text-accent focus:ring-accent h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      {confirmSaveOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmSaveOpen(false)}
          onConfirm={handleSave}
          title="Save Global Platform Configuration?"
          message="These settings will immediately apply to all multi-tenant properties, billing switches, and user auth flows."
          confirmText="Apply Configuration"
          variant="primary"
        />
      )}

      {confirmResetOpen && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmResetOpen(false)}
          onConfirm={handleReset}
          title="Reset to Sovereign Factory Defaults?"
          message="Are you sure you want to revert all global settings back to the default Lazfort ERP configuration?"
          confirmText="Yes, Reset Defaults"
          variant="danger"
        />
      )}
    </div>
  );
};

export default GlobalSettingsPage;

