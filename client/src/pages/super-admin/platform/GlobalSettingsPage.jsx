import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';
import { useERP } from '../../../context/ERPContext';
import { hotelApi } from '../../../services/hotelApi';
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
  Plus,
  Edit2,
  Power,
  Trash2,
} from 'lucide-react';

export const GlobalSettingsPage = () => {
  const { showToast } = useToast();
  const {
    currencies = [],
    addCurrency,
    updateCurrency,
    toggleCurrencyActive,
    setDefaultBaseCurrency,
    deleteCurrency,
  } = useERP();

  // Currency Modal State
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [currName, setCurrName] = useState('');
  const [currCode, setCurrCode] = useState('');
  const [currSymbol, setCurrSymbol] = useState('');
  const [currDecimals, setCurrDecimals] = useState(2);
  const [currIsDefault, setCurrIsDefault] = useState(false);
  const [currIsActive, setCurrIsActive] = useState(true);
  const [currencyErrors, setCurrencyErrors] = useState({});
  const [deletingCurrencyId, setDeletingCurrencyId] = useState(null);
  const [currencySearch, setCurrencySearch] = useState('');

  const handleDeleteCurrency = async (currency) => {
    const idToDelete = currency.id || currency.currency_code;
    if (deletingCurrencyId === idToDelete) return; // Prevent duplicate clicks

    setDeletingCurrencyId(idToDelete);
    try {
      const res = await deleteCurrency(idToDelete);
      if (res?.deactivated) {
        showToast('Currency Deactivated', res.message, 'warning');
      } else {
        showToast('Currency Removed', `${currency.currency_name} (${currency.currency_code}) removed from database.`, 'info');
      }
    } catch (err) {
      showToast('Error', err.message || 'Could not delete currency.', 'error');
    } finally {
      setDeletingCurrencyId(null);
    }
  };

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

  // Fetch settings from API on mount
  useEffect(() => {
    let isMounted = true;
    hotelApi.getPlatformSettings()
      .then(res => {
        if (isMounted && res && Object.keys(res).length > 0) {
          if (res.platformName) setPlatformName(res.platformName);
          if (res.supportEmail) setSupportEmail(res.supportEmail);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

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
      hotelApi.savePlatformSettings(payload).catch(() => {});
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
                <label className="block text-[11px] font-semibold uppercase mb-1">Base Platform Clearing Currency</label>
                <select
                  value={currency}
                  onChange={e => {
                    const val = e.target.value;
                    setCurrency(val);
                    // Extract code, e.g. "INR" from "INR (₹)" or direct code
                    const codeMatch = val.split(' ')[0];
                    if (codeMatch) {
                      setDefaultBaseCurrency(codeMatch).catch(() => {});
                    }
                  }}
                  className="input-luxury w-full text-xs py-2"
                >
                  {currencies.map(c => (
                    <option key={c.currency_code} value={`${c.currency_code} (${c.currency_symbol})`}>
                      {c.currency_code} ({c.currency_symbol}) — {c.currency_name} {c.is_default ? '★ (Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Primary System Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (UTC+5:30 / IST)</option>
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
                  <option value="DD/MM/YYYY">DD/MM/YYYY (Indian & European Format)</option>
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
                  <option value="hi-IN">हिन्दी (Hindi / India)</option>
                  <option value="fr-FR">Français (Monaco & Côte d’Azur)</option>
                  <option value="de-CH">Deutsch (Schweiz / Suisse)</option>
                  <option value="it-IT">Italiano (Riviera Ligure)</option>
                  <option value="ar-AE">العربية (Emirates Sovereign)</option>
                </select>
              </div>
            </div>

            {/* Currency Management Table */}
            <div className="pt-5 border-t border-border/70 dark:border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                    Supported Multi-Currency Standards (MySQL)
                  </h4>
                  <p className="text-[11px] text-charcoal-muted">
                    Currencies stored in MySQL and applied to hotel rates, subscriptions, invoices, and payments.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCurrency(null);
                      setCurrName('');
                      setCurrCode('');
                      setCurrSymbol('');
                      setCurrDecimals(2);
                      setCurrIsDefault(false);
                      setCurrIsActive(true);
                      setCurrencyErrors({});
                      setIsCurrencyModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl gold-gradient-bg text-primary-950 btn-3d inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Currency</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/80 dark:border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory dark:bg-primary-950/80 text-[10px] uppercase font-mono tracking-wider text-charcoal-muted border-b border-border/70 dark:border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Currency</th>
                      <th className="py-2.5 px-2">Code</th>
                      <th className="py-2.5 px-2">Symbol</th>
                      <th className="py-2.5 px-2">Decimals</th>
                      <th className="py-2.5 px-2">Role</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 dark:divide-white/5">
                    {currencies
                      .filter(c => {
                        if (!currencySearch.trim()) return true;
                        const term = currencySearch.toLowerCase();
                        return (
                          (c.currency_name && c.currency_name.toLowerCase().includes(term)) ||
                          (c.currency_code && c.currency_code.toLowerCase().includes(term)) ||
                          (c.currency_symbol && c.currency_symbol.toLowerCase().includes(term))
                        );
                      })
                      .map(c => (
                      <tr key={c.id || c.currency_code} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-primary dark:text-white">
                          {c.currency_name}
                        </td>
                        <td className="py-2.5 px-2 font-mono font-bold text-accent">
                          {c.currency_code}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-sm">
                          {c.currency_symbol}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-charcoal-muted">
                          {c.decimal_precision !== undefined ? c.decimal_precision : 2}
                        </td>
                        <td className="py-2.5 px-2">
                          {c.is_default ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent border border-accent/40">
                              Base Clearing
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setDefaultBaseCurrency(c.currency_code || c.id);
                                setCurrency(`${c.currency_code} (${c.currency_symbol})`);
                                showToast('Base Currency Set', `${c.currency_name} (${c.currency_code}) set as platform base.`, 'success');
                              }}
                              className="text-[10px] text-charcoal-muted hover:text-accent underline"
                            >
                              Make Base
                            </button>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.is_active !== false
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          }`}>
                            {c.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCurrency(c);
                                setCurrName(c.currency_name);
                                setCurrCode(c.currency_code);
                                setCurrSymbol(c.currency_symbol);
                                setCurrDecimals(c.decimal_precision !== undefined ? c.decimal_precision : 2);
                                setCurrIsDefault(Boolean(c.is_default));
                                setCurrIsActive(c.is_active !== false);
                                setCurrencyErrors({});
                                setIsCurrencyModalOpen(true);
                              }}
                              className="p-1 rounded-lg text-charcoal-muted hover:text-accent hover:bg-white/10"
                              title="Edit Currency"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await toggleCurrencyActive(c.currency_code || c.id);
                                  showToast('Status Updated', `${c.currency_name} status updated.`, 'info');
                                } catch (err) {
                                  showToast('Error', err.message, 'error');
                                }
                              }}
                              disabled={c.is_default}
                              className={`p-1 rounded-lg transition-colors ${
                                c.is_default
                                  ? 'opacity-30 cursor-not-allowed text-gray-500'
                                  : c.is_active !== false
                                  ? 'text-amber-500 hover:bg-amber-500/10'
                                  : 'text-emerald-500 hover:bg-emerald-500/10'
                              }`}
                              title={c.is_active !== false ? 'Deactivate Currency' : 'Activate Currency'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            {!c.is_default && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCurrency(c)}
                                disabled={deletingCurrencyId === (c.id || c.currency_code)}
                                className={`p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-opacity ${
                                  deletingCurrencyId === (c.id || c.currency_code)
                                    ? 'opacity-40 cursor-not-allowed animate-pulse'
                                    : ''
                                }`}
                                title="Delete Currency"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* Currency Modal (Add / Edit) */}
      {isCurrencyModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCurrencyModalOpen(false)}
          title={editingCurrency ? `Edit Currency: ${editingCurrency.currency_code}` : 'Register New Currency Standard'}
          maxWidth="max-w-md"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const errs = {};
              if (!currName.trim()) errs.name = 'Currency name is required.';
              if (!currCode.trim()) errs.code = 'ISO currency code is required.';
              else if (currCode.trim().length !== 3) errs.code = 'Must be a 3-character ISO code (e.g. INR, USD).';
              if (!currSymbol.trim()) errs.symbol = 'Currency symbol is required.';

              const normalized = currCode.trim().toUpperCase();
              const duplicate = currencies.find(c => c.currency_code?.toUpperCase() === normalized && (!editingCurrency || (c.id !== editingCurrency.id && c.currency_code !== editingCurrency.currency_code)));
              if (duplicate) {
                errs.code = `Currency code '${normalized}' already exists.`;
              }

              if (Object.keys(errs).length > 0) {
                setCurrencyErrors(errs);
                return;
              }

              setIsSavingCurrency(true);
              try {
                if (editingCurrency) {
                  await updateCurrency(editingCurrency.currency_code || editingCurrency.id, {
                    currency_name: currName.trim(),
                    currency_code: normalized,
                    currency_symbol: currSymbol.trim(),
                    decimal_precision: Number(currDecimals),
                    is_default: currIsDefault,
                    is_active: currIsActive,
                  });
                  showToast('Currency Updated', `${currName} (${normalized}) modified successfully.`, 'success');
                } else {
                  await addCurrency({
                    currency_name: currName.trim(),
                    currency_code: normalized,
                    currency_symbol: currSymbol.trim(),
                    decimal_precision: Number(currDecimals),
                    is_default: currIsDefault,
                    is_active: currIsActive,
                  });
                  showToast('Currency Registered', `${currName} (${normalized} - ${currSymbol}) saved in MySQL.`, 'success');
                }
                setIsCurrencyModalOpen(false);
              } catch (err) {
                showToast('Operation Failed', err.message || 'Failed to save currency.', 'error');
              } finally {
                setIsSavingCurrency(false);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal dark:text-gray-200 uppercase tracking-wider block">
                Currency Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Indian Rupee, Euro"
                value={currName}
                onChange={e => {
                  setCurrName(e.target.value);
                  if (currencyErrors.name) setCurrencyErrors(p => ({ ...p, name: '' }));
                }}
                className={`input-luxury w-full text-xs ${currencyErrors.name ? 'border-rose-500' : ''}`}
              />
              {currencyErrors.name && <p className="text-[11px] text-rose-500">{currencyErrors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal dark:text-gray-200 uppercase tracking-wider block">
                  ISO Code (3-letter) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  placeholder="e.g. INR"
                  value={currCode}
                  onChange={e => {
                    setCurrCode(e.target.value.toUpperCase());
                    if (currencyErrors.code) setCurrencyErrors(p => ({ ...p, code: '' }));
                  }}
                  className={`input-luxury w-full text-xs uppercase ${currencyErrors.code ? 'border-rose-500' : ''}`}
                />
                {currencyErrors.code && <p className="text-[11px] text-rose-500">{currencyErrors.code}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal dark:text-gray-200 uppercase tracking-wider block">
                  Symbol *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="e.g. ₹, $, €"
                  value={currSymbol}
                  onChange={e => {
                    setCurrSymbol(e.target.value);
                    if (currencyErrors.symbol) setCurrencyErrors(p => ({ ...p, symbol: '' }));
                  }}
                  className={`input-luxury w-full text-xs ${currencyErrors.symbol ? 'border-rose-500' : ''}`}
                />
                {currencyErrors.symbol && <p className="text-[11px] text-rose-500">{currencyErrors.symbol}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal dark:text-gray-200 uppercase tracking-wider block">
                  Decimal Places
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={currDecimals}
                  onChange={e => setCurrDecimals(Number(e.target.value))}
                  className="input-luxury w-full text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal dark:text-gray-200 uppercase tracking-wider block">
                  Status
                </label>
                <select
                  value={currIsActive ? 'active' : 'inactive'}
                  onChange={e => setCurrIsActive(e.target.value === 'active')}
                  className="input-luxury w-full text-xs py-2"
                >
                  <option value="active">Active (Available for hotels)</option>
                  <option value="inactive">Inactive (Disabled)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 dark:border-white/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-white/10 text-charcoal dark:text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingCurrency}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl gold-gradient-bg text-primary-950 btn-3d"
              >
                {isSavingCurrency ? 'Saving...' : editingCurrency ? 'Update Currency' : 'Save Currency'}
              </button>
            </div>
          </form>
        </Modal>
      )}

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

