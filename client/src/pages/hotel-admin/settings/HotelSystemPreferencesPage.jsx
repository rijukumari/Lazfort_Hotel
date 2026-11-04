import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
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
} from 'lucide-react';

export const HotelSystemPreferencesPage = () => {
  const { showToast } = useToast();

  // Hotel System Preferences State
  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_hotel_system_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      // General Hotel Information
      hotelName: 'Lazfort Grand Palace & Royal Spa',
      legalEntity: 'Lazfort Resorts International S.A. Monaco',
      taxIdentificationNumber: 'MC-VAT-893021-X',
      officialEmail: 'concierge@lazfort.com',
      officialPhone: '+377 98 06 20 00',
      officialWebsite: 'https://palace.lazfort.com',

      // Address
      country: 'Monaco',
      city: 'Monte-Carlo',
      addressLine: 'Place du Casino, Monte-Carlo',
      postalCode: '98000',

      // Currency & Tax Preferences
      baseCurrency: 'USD ($)',
      vatRate: '10',
      serviceChargeRate: '12',
      cityTaxPerNight: '7.50',
      taxInclusivePricing: true,

      // Timezone, Date & Language
      timezone: 'Europe/Monaco (UTC+01:00)',
      dateFormat: 'DD/MM/YYYY',
      defaultLanguage: 'English (UK)',

      // Booking & Reservation Defaults
      standardCheckInTime: '15:00',
      standardCheckOutTime: '12:00',
      allowInstantBooking: true,
      requireSecurityDeposit: true,
      defaultSecurityDepositAmount: '1500',
      freeCancellationDaysNotice: '3',

      // System Notifications
      systemNotificationEmail: 'directorate@lazfort.com',
      dispatchEmergencySms: true,
      dailyFinancialSummaryReport: true,
      maintenanceUrgentAlerts: true,
    };
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem('lazfort_hotel_system_preferences', JSON.stringify(systemSettings));
      // Also sync standard check-in / check-out times and tax to global store for interoperability
      localStorage.setItem(
        'lazfort_hotel_settings',
        JSON.stringify({
          checkInTime: systemSettings.standardCheckInTime,
          checkOutTime: systemSettings.standardCheckOutTime,
          vatRate: Number(systemSettings.vatRate) || 10,
          currency: systemSettings.baseCurrency,
          updatedAt: new Date().toISOString(),
        })
      );

      if (showToast) {
        showToast('System Preferences Saved', 'Hotel-wide operational and financial configurations updated successfully.', 'success');
      }
    } catch {
      if (showToast) {
        showToast('Error', 'Failed to save hotel system settings.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General & Contact', icon: Building2 },
    { id: 'finance', label: 'Currency, Taxes & Dates', icon: DollarSign },
    { id: 'reservations', label: 'Bookings & Check-In', icon: Clock },
    { id: 'notifications', label: 'System Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Hotel System Preferences"
        subtitle="Manage property-wide operational rules, financial tax setups, check-in policies, and business defaults"
        badge="Hotel Configuration"
      />

      {/* Luxury Tabs Bar */}
      <div className="flex border-b border-border/80 dark:border-white/10 gap-2 sm:gap-6 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-transparent text-charcoal-muted hover:text-charcoal dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: General & Contact Information */}
        {activeTab === 'general' && (
          <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" /> Hotel Property & Legal Identity
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Official hotel entity details applied to guest folios, invoices, and vouchers
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Property Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Hotel Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="hotelName"
                  value={systemSettings.hotelName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Corporate / Legal Entity
                </label>
                <input
                  type="text"
                  name="legalEntity"
                  value={systemSettings.legalEntity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Statutory Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  name="taxIdentificationNumber"
                  value={systemSettings.taxIdentificationNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Official Concierge Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  name="officialEmail"
                  value={systemSettings.officialEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Official Telephone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="officialPhone"
                  value={systemSettings.officialPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Official Website
                </label>
                <input
                  type="url"
                  name="officialWebsite"
                  value={systemSettings.officialWebsite}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 dark:border-white/10">
              <h4 className="text-xs font-semibold text-charcoal dark:text-gray-200 mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent" /> Property Physical Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                    Street Address & District
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    value={systemSettings.addressLine}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                    City / Principality
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={systemSettings.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={systemSettings.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                    Postal Code / ZIP
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={systemSettings.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Currency, Taxes & Regional Settings */}
        {activeTab === 'finance' && (
          <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" /> Currency, Taxes & Localization
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Configure default base currency, tax levies, timezones, and display formats
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-accent/10 text-accent border border-accent/20">
                Accounting Engine Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Primary Property Base Currency
                </label>
                <select
                  name="baseCurrency"
                  value={systemSettings.baseCurrency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                >
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro (Monaco Sovereign)</option>
                  <option value="GBP (£)">GBP (£) - British Pound Sterling</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="AED">AED - United Arab Emirates Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Statutory Value Added Tax (VAT Rate %)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    name="vatRate"
                    value={systemSettings.vatRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted font-bold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Palace Service Charge (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    name="serviceChargeRate"
                    value={systemSettings.serviceChargeRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted font-bold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Municipal City / Tourist Tax (Per Guest / Night)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    name="cityTaxPerNight"
                    value={systemSettings.cityTaxPerNight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted font-bold">
                    Flat
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={systemSettings.timezone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                >
                  <option value="Europe/Monaco (UTC+01:00)">Europe/Monaco (UTC+01:00)</option>
                  <option value="Europe/Paris (UTC+01:00)">Europe/Paris (UTC+01:00)</option>
                  <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                  <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                  <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (UTC+04:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Date Format
                </label>
                <select
                  name="dateFormat"
                  value={systemSettings.dateFormat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 03/11/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/03/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Default System Language
                </label>
                <select
                  name="defaultLanguage"
                  value={systemSettings.defaultLanguage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                >
                  <option value="English (UK)">English (UK)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="Italian (Italiano)">Italian (Italiano)</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="taxInclusivePricing"
                    checked={systemSettings.taxInclusivePricing}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-semibold text-charcoal dark:text-white">
                      Tax-Inclusive Pricing Mode
                    </p>
                    <p className="text-[11px] text-charcoal-muted">
                      Display rates inclusive of VAT in guest booking engine
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Booking & Reservation Operational Policies */}
        {activeTab === 'reservations' && (
          <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" /> Check-In, Check-Out & Booking Policies
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Set standard chamber turnover hours, security deposits, and cancellation terms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Standard Check-In Time
                </label>
                <input
                  type="time"
                  name="standardCheckInTime"
                  value={systemSettings.standardCheckInTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Standard Check-Out Time
                </label>
                <input
                  type="time"
                  name="standardCheckOutTime"
                  value={systemSettings.standardCheckOutTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Default Chamber Incidentals Security Deposit ($)
                </label>
                <input
                  type="number"
                  name="defaultSecurityDepositAmount"
                  value={systemSettings.defaultSecurityDepositAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Complimentary Cancellation Window (Days Before Arrival)
                </label>
                <input
                  type="number"
                  name="freeCancellationDaysNotice"
                  value={systemSettings.freeCancellationDaysNotice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 dark:border-white/10 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowInstantBooking"
                  checked={systemSettings.allowInstantBooking}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
                <div>
                  <p className="text-xs font-semibold text-charcoal dark:text-white">
                    Enable Instant Online Booking
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    Automatically confirm guest reservations without requiring manual front-desk review
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="requireSecurityDeposit"
                  checked={systemSettings.requireSecurityDeposit}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
                <div>
                  <p className="text-xs font-semibold text-charcoal dark:text-white">
                    Mandatory Credit Card Pre-Authorization at Check-in
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    Pre-authorizes incidental deposit before guest keycard encoding
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: System Notifications & Alerts */}
        {activeTab === 'notifications' && (
          <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent" /> Hotel-Wide System Notification Alerts
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Configure centralized hotel management routing for critical alerts, reports, and emergencies
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                Centralized System Alert Email Destination <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                name="systemNotificationEmail"
                value={systemSettings.systemNotificationEmail}
                onChange={handleInputChange}
                className="w-full sm:w-96 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                placeholder="directorate@lazfort.com"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border/60 dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-semibold text-charcoal dark:text-white">
                    Urgent Maintenance & Engineering Work Orders
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    Broadcast critical chamber malfunctions immediately to duty engineering managers
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="maintenanceUrgentAlerts"
                  checked={systemSettings.maintenanceUrgentAlerts}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border/60 dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-semibold text-charcoal dark:text-white">
                    Automated Daily Night-Audit Financial Summary
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    Compile ledger closures and gross RevPAR into executive PDF at 04:00 AM daily
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="dailyFinancialSummaryReport"
                  checked={systemSettings.dailyFinancialSummaryReport}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border/60 dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-semibold text-charcoal dark:text-white">
                    Emergency SMS Dispatch for VIP Protocol & Security Incidents
                  </p>
                  <p className="text-[11px] text-charcoal-muted">
                    Send encrypted SMS alerts for royal arrivals or security alarms
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="dispatchEmergencySms"
                  checked={systemSettings.dispatchEmergencySms}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-ivory/80 dark:bg-primary-950/80 border border-border/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Changes affect hotel-wide operational modules and guest booking engines</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-luxury px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelSystemPreferencesPage;

