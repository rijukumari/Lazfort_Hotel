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
  Smartphone,
  Eye,
  EyeOff,
  Compass
} from 'lucide-react';

export const StaffSystemPreferencesPage = () => {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_staff_system_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      // Hotel & Property Context
      hotelName: 'Lazfort Grand Palace & Royal Spa — Monaco',
      stationId: 'CONCIERGE-DESK-01',
      defaultTerminalMode: 'Lobby Kiosk & Handheld',

      // Regional & Language Formats
      language: 'en-GB',
      timeZone: 'Europe/Monaco (UTC+01:00)',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currencyDisplay: 'EUR (€)',

      // Interface & Theme
      themePreference: 'dark',
      soundEffects: true,
      hapticFeedback: true,
      autoDismissNotifications: '5',

      // Communication & Alerts
      taskAssignmentAlerts: true,
      guestArrivalPaging: true,
      handoverNoteReminders: true,
      smsEmergencyDispatch: true,
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem('lazfort_staff_system_preferences', JSON.stringify(settings));
      setIsSaving(false);
      showToast(
        'Staff Preferences Saved',
        'Your staff terminal and workspace preferences have been updated.',
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
        title="Staff Hotel System Preferences"
        subtitle="Configure your staff workstation, locale formats, theme, and dispatch alerts."
        icon={Settings}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-gold">
              <Compass className="w-3.5 h-3.5" />
              Terminal LZ-STF-01
            </span>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Property & Station Context */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Hotel Station & Workstation Information
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Assigned hotel branch, physical service station, and device profile.
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
                Service Station Identifier
              </label>
              <input
                type="text"
                value={settings.stationId}
                onChange={(e) => updateSetting('stationId', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Terminal Mode
              </label>
              <select
                value={settings.defaultTerminalMode}
                onChange={(e) => updateSetting('defaultTerminalMode', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Lobby Kiosk & Handheld">Lobby Kiosk & Handheld Mobile</option>
                <option value="Executive Concierge Desk">Executive Concierge Desk</option>
                <option value="VIP Lounge Console">VIP Sovereign Lounge Console</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Regional, Currency & Date Formats */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Regional Formats & Currency Standards
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Display formats for scheduling, shift logs, and room tariff quotes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Staff Display Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="en-GB">English (UK / Sovereign)</option>
                <option value="fr-FR">Français (Monaco)</option>
                <option value="it-IT">Italiano (Riviera)</option>
                <option value="de-DE">Deutsch</option>
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
                <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
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
                <option value="MM/DD/YYYY">MM/DD/YYYY (11/05/2026)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-primary dark:text-gray-300 mb-1.5">
                Time Format
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

        {/* Section 3: Visual Theme & Appearance */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Theme & Workplace Aesthetics
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Choose between dark luxury palace mode and daytime ivory clarity.
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
                  className={`flex-1 py-2 px-3 rounded-2xl border text-xs flex items-center justify-center gap-2 font-medium transition-all ${
                    theme === 'dark'
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
                  className={`flex-1 py-2 px-3 rounded-2xl border text-xs flex items-center justify-center gap-2 font-medium transition-all ${
                    theme === 'light'
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
                Sound & Feedback Feedback
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <span className="text-primary dark:text-white font-medium">Sound Effects</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hapticFeedback}
                    onChange={(e) => updateSetting('hapticFeedback', e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <span className="text-primary dark:text-white font-medium">Haptic Feedback</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Notification Dispatches */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 border-b border-border/80 dark:border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Dispatch & Operational Alerts
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Paging alerts when VIPs arrive, tasks are reassigned, or shift handovers occur.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.taskAssignmentAlerts}
                onChange={(e) => updateSetting('taskAssignmentAlerts', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Task Assignment</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Instant sound alert</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.guestArrivalPaging}
                onChange={(e) => updateSetting('guestArrivalPaging', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">VIP Arrival Paging</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Curbside arrival notice</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.handoverNoteReminders}
                onChange={(e) => updateSetting('handoverNoteReminders', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">Shift Handover</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Prompt before sign-out</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
              <input
                type="checkbox"
                checked={settings.smsEmergencyDispatch}
                onChange={(e) => updateSetting('smsEmergencyDispatch', e.target.checked)}
                className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
              />
              <div>
                <p className="font-semibold text-primary dark:text-white">SMS Emergency</p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Critical incident alert</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffSystemPreferencesPage;

