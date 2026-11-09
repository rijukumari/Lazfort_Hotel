import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Button } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import { useERP } from '../../../context/ERPContext';
import { hotelApi } from '../../../services/hotelApi';
import {
  Sliders,
  Building2,
  Globe,
  DollarSign,
  Clock,
  Calendar,
  Bell,
  Sun,
  Moon,
  Save,
  CheckCircle2,
  Layout,
  Palette,
  Shield,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';

export const SuperAdminSystemPreferencesPage = () => {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();
  const { currencies, defaultBaseCurrency, setDefaultBaseCurrency } = useERP();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_superadmin_system_preferences');
      if (saved) return JSON.parse(saved);
    } catch { }
    return {
      // Platform Identity & Branding
      brandName: 'Lazfort ERP Grand Luxe',
      tagline: 'Sovereign Multi-Property Hotel & Resort Operating System',
      defaultCurrency: 'USD ($)',
      multiCurrencyEnabled: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CHF', 'AED', 'SGD'],

      // Regional & Localization Defaults
      defaultLanguage: 'en-US',
      defaultTimezone: 'Europe/Monaco (UTC+01:00)',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',

      // Dashboard & Visual Customization
      themePreference: 'dark',
      densityMode: 'comfortable',
      liveAnalyticsRefreshRate: '30',
      showLiveOccupancyTicker: true,

      // Global Notification Dispatches
      emailSystemAlerts: true,
      dailyExecutiveDigest: true,
      criticalUptimeSms: true,
      maintenanceWindowNoticeHours: '48',

      // Tenant & Property Isolation Defaults
      autoProvisionDatabase: true,
      enforceTenantVatRules: true,
      maxPropertiesPerGroup: '50',
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings from API on mount
  useEffect(() => {
    let isMounted = true;
    hotelApi.getPlatformSettings()
      .then(res => {
        if (isMounted && res && Object.keys(res).length > 0) {
          setSettings(prev => ({ ...prev, ...res }));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem('lazfort_superadmin_system_preferences', JSON.stringify(settings));
      hotelApi.savePlatformSettings(settings).catch(() => {});
      setIsSaving(false);
      showToast(
        'System Preferences Applied',
        'Global platform parameters and tenant defaults have been updated.',
        'success'
      );
    }, 400);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Hotel System Preferences"
        subtitle="Global platform branding, currency standards, localization, visual theme, and tenant configuration."
        icon={Sliders}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Core v3.4
            </span>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Platform Branding & Identity */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Hotel Platform Branding & Identification
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Global branding displayed across customer vouchers, admin consoles, and tenant portals.
                </p>
              </div>
            </div>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              icon={Save}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Platform Brand Name
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => updateSetting('brandName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Platform Tagline & Descriptor
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSetting('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Maximum Properties Allowed
              </label>
              <input
                type="number"
                value={settings.maxPropertiesPerGroup}
                onChange={(e) => updateSetting('maxPropertiesPerGroup', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Regional, Currency & Localization Settings */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Currency, Timezone & Regional Localization
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Standard reporting currencies, global timestamps, and multi-lingual presets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Primary Base Currency
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => {
                  updateSetting('defaultCurrency', e.target.value);
                  const codeMatch = e.target.value.match(/^[A-Z]{3}/);
                  if (codeMatch && setDefaultBaseCurrency) {
                    setDefaultBaseCurrency(codeMatch[0]);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                {currencies && currencies.length > 0 ? (
                  currencies.map((curr) => {
                    const code = curr.currency_code || curr.code;
                    const symbol = curr.currency_symbol || curr.symbol || '';
                    const name = curr.currency_name || curr.name || code;
                    const val = `${code} (${symbol})`;
                    return (
                      <option key={curr.id || code} value={val}>
                        {code} ({symbol}) — {name}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                    <option value="USD ($)">USD ($) — Sovereign Dollar</option>
                    <option value="EUR (€)">EUR (€) — Euro Sovereign</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                    <option value="CHF (CHF)">CHF (CHF) — Swiss Franc</option>
                    <option value="AED (AED)">AED (AED) — Emirati Dirham</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Standard Timezone
              </label>
              <select
                value={settings.defaultTimezone}
                onChange={(e) => updateSetting('defaultTimezone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Europe/Monaco (UTC+01:00)">Europe/Monaco (UTC+01:00)</option>
                <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                <option value="Europe/Paris (UTC+01:00)">Europe/Paris (UTC+01:00)</option>
                <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (UTC+04:00)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-11-05)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (05/11/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (11/05/2026)</option>
                <option value="DD MMM YYYY">DD MMM YYYY (05 Nov 2026)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Time Standard
              </label>
              <select
                value={settings.timeFormat}
                onChange={(e) => updateSetting('timeFormat', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="24h">24-Hour International (14:30)</option>
                <option value="12h">12-Hour Standard (02:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Visual Theme & Dashboard Density */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Theme Preferences & Console UI Controls
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Visual aesthetics, dashboard live polling, and interface typography settings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                System Interface Theme
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    updateSetting('themePreference', 'dark');
                  }}
                  className={`flex-1 py-2 px-3 rounded-2xl border text-xs flex items-center justify-center gap-2 font-medium transition-all ${theme === 'dark'
                      ? 'border-accent bg-accent/20 text-accent font-bold ring-1 ring-accent/30'
                      : 'border-border/60 dark:border-white/10 bg-ivory/40 dark:bg-primary-900/40 text-charcoal-muted'
                    }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark Luxury (Gold)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('light');
                    updateSetting('themePreference', 'light');
                  }}
                  className={`flex-1 py-2 px-3 rounded-2xl border text-xs flex items-center justify-center gap-2 font-medium transition-all ${theme === 'light'
                      ? 'border-accent bg-accent/20 text-accent font-bold ring-1 ring-accent/30'
                      : 'border-border/60 dark:border-white/10 bg-ivory/40 dark:bg-primary-900/40 text-charcoal-muted'
                    }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Ivory White
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Real-Time Analytics Refresh (Secs)
              </label>
              <select
                value={settings.liveAnalyticsRefreshRate}
                onChange={(e) => updateSetting('liveAnalyticsRefreshRate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="15">Every 15 seconds (High Frequency)</option>
                <option value="30">Every 30 seconds (Balanced)</option>
                <option value="60">Every 60 seconds (Conserve bandwidth)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Table & Grid Density
              </label>
              <select
                value={settings.densityMode}
                onChange={(e) => updateSetting('densityMode', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="comfortable">Comfortable Spacing (Luxe)</option>
                <option value="compact">Compact / High Density Data</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Notification & Dispatch Preferences */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Platform Notifications & Health Dispatches
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Automated alerts regarding database backups, uptime interruptions, and critical disputes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.emailSystemAlerts}
                onChange={(e) => updateSetting('emailSystemAlerts', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">System Email Dispatches</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Send critical server warnings to root admin.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.criticalUptimeSms}
                onChange={(e) => updateSetting('criticalUptimeSms', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Emergency SMS Alerts</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Paging SMS if API latency breaches SLA.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.showLiveOccupancyTicker}
                onChange={(e) => updateSetting('showLiveOccupancyTicker', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Live Occupancy Ticker</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Display global occupancy header pill.</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminSystemPreferencesPage;

