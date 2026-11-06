import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  Globe,
  DollarSign,
  Calendar,
  Clock,
  Bell,
  Mail,
  MessageSquare,
  Sun,
  Moon,
  Sparkles,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Smartphone
} from 'lucide-react';

export const CustomerSystemPreferencesPage = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('EUR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24h');

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(false);
  const [conciergeDirectMessages, setConciergeDirectMessages] = useState(true);
  const [roomReadinessAlerts, setRoomReadinessAlerts] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      // Save locally
      localStorage.setItem('lazfort_customer_lang', language);
      localStorage.setItem('lazfort_customer_curr', currency);
      localStorage.setItem('lazfort_customer_date_format', dateFormat);
      localStorage.setItem('lazfort_customer_time_format', timeFormat);

      setIsSaving(false);
      showToast(
        'System Preferences Saved',
        'Your interface language, currency, and notification options have been updated.',
        'success'
      );
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl">
      <PageHeader
        title="Hotel System Preferences"
        description="Personalize your guest portal experience, regional localization, currency presentation, and communication notifications."
        badge="System Configuration"
      />

      <form onSubmit={handleSavePreferences} className="space-y-8">
        {/* 1. Regional Localization & Display */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                Regional Settings
              </span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
                Language, Currency & Formats
              </h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Globe className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Interface Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent" />
                Portal Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="en">English (Royal Sovereign - Global)</option>
                <option value="fr">Français (Monaco & France)</option>
                <option value="it">Italiano (Riviera / Italia)</option>
                <option value="de">Deutsch (Schweiz & Deutschland)</option>
                <option value="ar">العربية (Gulf Executive Standard)</option>
                <option value="es">Español (Castellano)</option>
              </select>
            </div>

            {/* Currency Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-accent" />
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="EUR">EUR (€) — Euro (Monaco Sovereign Base)</option>
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="GBP">GBP (£) — British Pound Sterling</option>
                <option value="CHF">CHF (Fr) — Swiss Franc</option>
                <option value="AED">AED (د.إ) — UAE Dirham</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={e => setDateFormat(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 28/10/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/28/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO standard)</option>
              </select>
            </div>

            {/* Time Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Time Format
              </label>
              <select
                value={timeFormat}
                onChange={e => setTimeFormat(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="24h">24-Hour International (e.g. 15:30)</option>
                <option value="12h">12-Hour AM/PM (e.g. 03:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Theme & Visual Appearance */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                Visual Experience
              </span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
                Theme & Color Palette
              </h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                theme === 'dark'
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/30 shadow-gold'
                  : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/40 hover:border-accent/40'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-primary-950 border border-accent/40 flex items-center justify-center text-accent">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                  Obsidian & Sovereign Gold (Dark)
                </h4>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-0.5">
                  Deep Monaco midnight sapphire with golden accents.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                theme === 'light'
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/30 shadow-gold'
                  : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/40 hover:border-accent/40'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
                  Ivory Palace & Royal Gold (Light)
                </h4>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-0.5">
                  Alabaster marble texture with high-contrast text.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Communication & Notification Dispatch */}
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                Concierge Communications
              </span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
                Notification & Dispatch Channels
              </h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Bell className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4 divide-y divide-border/60 dark:divide-white/10">
            {/* Email Notifications */}
            <div className="pt-2 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Email Itinerary & Official Folio Dispatches
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Receive reservation confirmations, digital bills, and folio PDFs via email.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={e => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
              />
            </div>

            {/* SMS Notifications */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    VIP SMS & Instant Chauffeur Arrival Alerts
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Instant text notifications for limousine dispatches and VIP arrival gates.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={e => setSmsNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
              />
            </div>

            {/* Room Readiness Alerts */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Suite Readiness & Early Check-In Alerts
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Receive instant notification the moment Housekeeping finishes suite sanitization.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={roomReadinessAlerts}
                onChange={e => setRoomReadinessAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
              />
            </div>

            {/* In-Room Dining & Concierge Chat */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Direct Butler & Concierge Messaging
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Allow direct updates from your assigned Clefs d’Or Head Concierge and Butler.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={conciergeDirectMessages}
                onChange={e => setConciergeDirectMessages(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
              />
            </div>

            {/* Promotional Offers */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Seasonal Yachting & Gala Invitations
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Invitations to private Monaco Grand Prix events, yacht exhibitions, and Michelin galas.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={promotionalOffers}
                onChange={e => setPromotionalOffers(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl gold-gradient-bg text-primary-950 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Preferences...' : 'Save System Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSystemPreferencesPage;

