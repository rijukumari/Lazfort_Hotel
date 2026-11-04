import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Clock,
  Sliders,
  Bell,
  Save,
  CheckCircle2,
  FileText,
  Calendar,
  Percent,
  Sparkles,
  Shield,
  Layers,
  BedDouble,
  Receipt
} from 'lucide-react';

export const ReceptionistSystemPreferencesPage = () => {
  const { showToast } = useToast();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_receptionist_system_prefs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      // Hotel Information
      hotelName: 'Lazfort Grand Palace & Royal Spa',
      legalEntity: 'Lazfort Resorts International S.A. Monaco',
      officialEmail: 'concierge@lazfort.com',
      officialPhone: '+377 98 06 20 00',
      address: 'Place du Casino, Monte-Carlo, MC 98000 Monaco',

      // Regional & Formats
      country: 'Monaco',
      timeZone: 'Europe/Monaco (UTC+01:00)',
      dateFormat: 'DD/MM/YYYY',
      baseCurrency: 'EUR (€)',
      vatRate: '10',
      serviceChargeRate: '5',

      // Check-in & Check-out Rules
      standardCheckInTime: '15:00',
      standardCheckOutTime: '12:00',
      allowEarlyCheckIn: true,
      allowLateCheckOut: true,

      // Inventory & Room Ops
      autoAssignSuites: true,
      requireIdProofForWalkIn: true,
      autoReleaseUnconfirmedHours: '24',

      // Invoicing & Billing
      invoicePrefix: 'INV-LZ-',
      taxIncludedInTariff: true,
      enableCounterCashSettlement: true,
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem('lazfort_receptionist_system_prefs', JSON.stringify(settings));
      setIsSaving(false);
      showToast(
        'System Settings Saved',
        'Front Desk & Hotel Operational preferences have been updated.',
        'success'
      );
    }, 450);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      <PageHeader
        title="Hotel System Configuration & Operating Rules"
        description="Configure property contact details, currency, regional time standards, check-in windows, and front office billing rules."
        badge="Front Desk Command Config"
      />

      <form onSubmit={handleSave} className="space-y-7">
        {/* 1. Hotel Information & Property Identity */}
        <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <span>1. Property Identity & Official Coordinates</span>
            </h3>
            <span className="text-[10px] uppercase font-mono text-accent font-bold">Palace HQ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Official Hotel Name
              </label>
              <input
                type="text"
                value={settings.hotelName}
                onChange={e => setSettings({ ...settings, hotelName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Legal Operating Entity
              </label>
              <input
                type="text"
                value={settings.legalEntity}
                onChange={e => setSettings({ ...settings, legalEntity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Contact Desk Email
              </label>
              <input
                type="email"
                value={settings.officialEmail}
                onChange={e => setSettings({ ...settings, officialEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Front Desk Telephone Line
              </label>
              <input
                type="tel"
                value={settings.officialPhone}
                onChange={e => setSettings({ ...settings, officialPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Physical Palace Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* 2. Regional Settings, Currency & Tax */}
        <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent" />
              <span>2. Regional Settings & Currency Configuration</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Country of Operation
              </label>
              <input
                type="text"
                value={settings.country}
                onChange={e => setSettings({ ...settings, country: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Property Time Zone
              </label>
              <select
                value={settings.timeZone}
                onChange={e => setSettings({ ...settings, timeZone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="Europe/Monaco (UTC+01:00)">Europe/Monaco (UTC+01:00)</option>
                <option value="Europe/Paris (UTC+01:00)">Europe/Paris (UTC+01:00)</option>
                <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Operational Base Currency
              </label>
              <select
                value={settings.baseCurrency}
                onChange={e => setSettings({ ...settings, baseCurrency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="EUR (€)">EUR (€) — Euro (Monaco Sovereign Base)</option>
                <option value="USD ($)">USD ($) — United States Dollar</option>
                <option value="GBP (£)">GBP (£) — British Pound</option>
                <option value="CHF (Fr)">CHF (Fr) — Swiss Franc</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Monaco Luxury Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.vatRate}
                onChange={e => setSettings({ ...settings, vatRate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Concierge & Resort Service Fee (%)
              </label>
              <input
                type="number"
                value={settings.serviceChargeRate}
                onChange={e => setSettings({ ...settings, serviceChargeRate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Calendar Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={e => setSettings({ ...settings, dateFormat: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 28/10/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/28/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Check-in & Check-out Operating Rules */}
        <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>3. Check-In & Check-Out Schedule Rules</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Standard Check-In Time
              </label>
              <input
                type="time"
                value={settings.standardCheckInTime}
                onChange={e => setSettings({ ...settings, standardCheckInTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Standard Check-Out Time
              </label>
              <input
                type="time"
                value={settings.standardCheckOutTime}
                onChange={e => setSettings({ ...settings, standardCheckOutTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="divide-y divide-border/60 dark:divide-white/10 space-y-3 pt-2 text-xs">
            <div className="pt-2 first:pt-0 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary dark:text-white">Allow Early Check-In Requests</p>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Permit receptionists to allocate ready suites before 15:00.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowEarlyCheckIn}
                onChange={e => setSettings({ ...settings, allowEarlyCheckIn: e.target.checked })}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
            </div>

            <div className="pt-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary dark:text-white">Allow Late Check-Out Extensions</p>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Enable complimentary or surcharged departure extensions up to 16:00.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowLateCheckOut}
                onChange={e => setSettings({ ...settings, allowLateCheckOut: e.target.checked })}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Room & Inventory Preferences */}
        <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-accent" />
              <span>4. Front Desk Room & Folio Preferences</span>
            </h3>
          </div>

          <div className="divide-y divide-border/60 dark:divide-white/10 space-y-3 text-xs">
            <div className="pt-2 first:pt-0 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary dark:text-white">Mandatory ID Verification for Walk-ins</p>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Require passport or diplomatic card number before instant suite keycard encoding.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireIdProofForWalkIn}
                onChange={e => setSettings({ ...settings, requireIdProofForWalkIn: e.target.checked })}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
            </div>

            <div className="pt-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary dark:text-white">Allow Cash Counter Settlements</p>
                <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Permit Treasury Vault physical cash collections at front desk terminal.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableCounterCashSettlement}
                onChange={e => setSettings({ ...settings, enableCounterCashSettlement: e.target.checked })}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="gold"
            loading={isSaving}
            icon={Save}
            className="py-3 px-8 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <span>Save System Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReceptionistSystemPreferencesPage;

