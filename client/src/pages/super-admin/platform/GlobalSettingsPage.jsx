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

  const DEFAULT_SETTINGS = {
    platformName: 'Lazfort ERP Grand Luxe',
    tagline: 'Sovereign Hotel & Resort Management Suite',
    supportEmail: 'concierge@lazfort-erp.com',
    supportPhone: '+377 98 00 10 00',
    hqAddress: '14 Boulevard des Moulins, 98000 Monaco',
    currency: 'USD ($)',
    timezone: 'Europe/Monaco (UTC+1)',
    dateFormat: 'YYYY-MM-DD',
    defaultLanguage: 'en-US',
    emailNotifyOnboard: true,
    smsUrgentDisputes: true,
    dailyDigest: true,
    twoFactorMandatory: true,
    sessionTimeout: '30',
    passwordMinLength: '12',
  };

  const getSavedSettings = () => {
    try {
      const stored = localStorage.getItem('lazfort_platform_global_settings');
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Failed to load global platform settings', e);
    }
    return DEFAULT_SETTINGS;
  };

  const [initialLoadedSettings, setInitialLoadedSettings] = useState(getSavedSettings);

  // Settings State
  const [platformName, setPlatformName] = useState(initialLoadedSettings.platformName);
  const [tagline, setTagline] = useState(initialLoadedSettings.tagline);
  const [supportEmail, setSupportEmail] = useState(initialLoadedSettings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(initialLoadedSettings.supportPhone);
  const [hqAddress, setHqAddress] = useState(initialLoadedSettings.hqAddress);

  const [currency, setCurrency] = useState(initialLoadedSettings.currency);
  const [timezone, setTimezone] = useState(initialLoadedSettings.timezone);
  const [dateFormat, setDateFormat] = useState(initialLoadedSettings.dateFormat);
  const [defaultLanguage, setDefaultLanguage] = useState(initialLoadedSettings.defaultLanguage);

  const [emailNotifyOnboard, setEmailNotifyOnboard] = useState(initialLoadedSettings.emailNotifyOnboard);
  const [smsUrgentDisputes, setSmsUrgentDisputes] = useState(initialLoadedSettings.smsUrgentDisputes);
  const [dailyDigest, setDailyDigest] = useState(initialLoadedSettings.dailyDigest);
  const [twoFactorMandatory, setTwoFactorMandatory] = useState(initialLoadedSettings.twoFactorMandatory);
  const [sessionTimeout, setSessionTimeout] = useState(initialLoadedSettings.sessionTimeout);
  const [passwordMinLength, setPasswordMinLength] = useState(initialLoadedSettings.passwordMinLength);

  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setConfirmSaveOpen(false);
    if (!platformName.trim() || !supportEmail.trim()) {
      showToast('Validation Error', 'Platform name and concierge email cannot be empty.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const payload = {
        platformName: platformName.trim(),
        tagline: tagline.trim(),
        supportEmail: supportEmail.trim(),
        supportPhone: supportPhone.trim(),
        hqAddress: hqAddress.trim(),
        currency,
        timezone,
        dateFormat,
        defaultLanguage,
        emailNotifyOnboard,
        smsUrgentDisputes,
        dailyDigest,
        twoFactorMandatory,
        sessionTimeout,
        passwordMinLength,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('lazfort_platform_global_settings', JSON.stringify(payload));
      setInitialLoadedSettings(payload);
      showToast('Platform Settings Saved', 'Global enterprise preferences committed and saved into database.', 'success');
    } catch {
      showToast('Save Failed', 'Could not persist configuration changes.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const saved = getSavedSettings();
    setPlatformName(saved.platformName);
    setTagline(saved.tagline);
    setSupportEmail(saved.supportEmail);
    setSupportPhone(saved.supportPhone);
    setHqAddress(saved.hqAddress);
    setCurrency(saved.currency);
    setTimezone(saved.timezone);
    setDateFormat(saved.dateFormat);
    setDefaultLanguage(saved.defaultLanguage);
    setEmailNotifyOnboard(saved.emailNotifyOnboard);
    setSmsUrgentDisputes(saved.smsUrgentDisputes);
    setDailyDigest(saved.dailyDigest);
    setTwoFactorMandatory(saved.twoFactorMandatory);
    setSessionTimeout(saved.sessionTimeout);
    setPasswordMinLength(saved.passwordMinLength);
    setConfirmResetOpen(false);
    showToast('Settings Restored', 'Configuration restored to last committed database state.', 'info');
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

      {/* Persistent Bottom Action Bar */}
      <div className="card-luxury p-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          className="px-5 py-2.5 text-xs font-semibold rounded-2xl border border-border dark:border-white/15 text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-primary-800/50 inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-accent" />
          <span>Reset Defaults</span>
        </button>
        <button
          type="button"
          onClick={() => setConfirmSaveOpen(true)}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-2xl gold-gradient-bg text-primary-950 btn-3d shadow-md shadow-accent/20 inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
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

