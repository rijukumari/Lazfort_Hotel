import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  Settings,
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
  BedDouble,
  CheckSquare,
  Volume2
} from 'lucide-react';

export const HousekeepingSystemPreferencesPage = () => {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_housekeeping_system_preferences');
      if (saved) return JSON.parse(saved);
    } catch { }
    return {
      // Hotel & Property Context
      hotelName: 'Lazfort Grand Palace & Royal Spa — Monaco',
      hygieneDepartment: 'Housekeeping, Chamber Care & Laundry',
      cleaningProtocolStandard: 'Five-Diamond Ultra-Luxury Protocol',

      // Regional & Language Formats
      language: 'en-GB',
      timeZone: 'Europe/Monaco (UTC+01:00)',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',

      // Operational Defaults
      defaultCleaningTimeMinutes: '35',
      deepCleaningTimeMinutes: '60',
      inspectionAuditSamplePercent: '100',
      autoNotifyReceptionUponClean: true,

      // Interface & Theme
      themePreference: 'dark',
      highContrastMode: false,
      audioChimeOnNewAssignment: true,
      hapticOnChecklistComplete: true,

      // Notification Preferences
      rushRoomPushNotifications: true,
      dndOverrideAlerts: true,
      maintenanceEscalationNotices: true,
      linenInventoryShortageAlerts: true,
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem('lazfort_housekeeping_system_preferences', JSON.stringify(settings));
      setIsSaving(false);
      showToast(
        'Housekeeping Preferences Saved',
        'Cleaning standards, timing parameters, and terminal options have been updated.',
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
        title="Housekeeping Hotel System Preferences"
        subtitle="Configure chamber turnover defaults, inspection standards, notification dispatches, and interface theme."
        icon={Settings}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Hygiene Standards v4.2
            </span>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Property & Hygiene Context */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Hotel Property & Hygiene Standards
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Property branch parameters and operational cleanliness benchmarks.
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
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Hotel Property
              </label>
              <input
                type="text"
                disabled
                value={settings.hotelName}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border/80 dark:border-white/10 bg-ivory/40 dark:bg-primary-950/40 text-charcoal-muted dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Sanitation Protocol Standard
              </label>
              <select
                value={settings.cleaningProtocolStandard}
                onChange={(e) => updateSetting('cleaningProtocolStandard', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Five-Diamond Ultra-Luxury Protocol">Five-Diamond Ultra-Luxury Protocol</option>
                <option value="Hospital-Grade Medical Sterilization">Hospital-Grade Medical Sterilization</option>
                <option value="Eco-Luxe Sustainable Protocol">Eco-Luxe Sustainable Botanical Protocol</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Standard Room Turnover Target (Mins)
              </label>
              <input
                type="number"
                value={settings.defaultCleaningTimeMinutes}
                onChange={(e) => updateSetting('defaultCleaningTimeMinutes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Regional, Timezone & Formats */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Regional Localization & Time Formats
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Timestamp settings for task completion logs and turnover audit trails.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Terminal Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="en-GB">English (UK)</option>
                <option value="fr-FR">Français (Monaco)</option>
                <option value="it-IT">Italiano</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Property Time Zone
              </label>
              <select
                value={settings.timeZone}
                onChange={(e) => updateSetting('timeZone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Europe/Monaco (UTC+01:00)">Europe/Monaco (UTC+01:00)</option>
                <option value="Europe/Paris (UTC+01:00)">Europe/Paris (UTC+01:00)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Date Notation
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting('dateFormat', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (05/11/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-11-05)</option>
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
                <option value="12h">12-Hour (02:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Visual Theme Preferences */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Display Theme & Floor Tablet Controls
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Visual themes designed for floor tablets and handheld inspection devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Color Scheme
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
                  Ivory Daylight
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Audio & Haptic Feedback
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.audioChimeOnNewAssignment}
                    onChange={(e) => updateSetting('audioChimeOnNewAssignment', e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <span className="text-primary dark:text-white font-medium">Assignment Chime</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hapticOnChecklistComplete}
                    onChange={(e) => updateSetting('hapticOnChecklistComplete', e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <span className="text-primary dark:text-white font-medium">Haptic Vibration</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Operational Dispatches */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Operational Dispatch & Suite Alerts
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Paging alerts when suites require rush cleaning or guest requests touch-ups.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.rushRoomPushNotifications}
                onChange={(e) => updateSetting('rushRoomPushNotifications', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Rush Room Pushes</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Urgent turnover requests</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.autoNotifyReceptionUponClean}
                onChange={(e) => updateSetting('autoNotifyReceptionUponClean', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Auto-Notify Desk</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Mark room ready instantly</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.dndOverrideAlerts}
                onChange={(e) => updateSetting('dndOverrideAlerts', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">DND Cleared Alert</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">When guest removes sign</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.linenInventoryShortageAlerts}
                onChange={(e) => updateSetting('linenInventoryShortageAlerts', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Linen Shortage</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Low stock floor closet</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HousekeepingSystemPreferencesPage;

