import React from 'react';
import { User, Mail, Phone, Globe, MessageSquare, Clock, Sparkles } from 'lucide-react';

export const GuestDetailsForm = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border dark:border-white/10 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
            Step 1 of 3
          </span>
          <h3 className="font-serif text-xl font-bold text-primary dark:text-white mt-0.5">
            Distinguished Guest Information
          </h3>
        </div>
        <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
          <User className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-accent" />
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={data.fullName}
            onChange={e => onChange({ fullName: e.target.value })}
            placeholder="e.g. Lord Alexander Kensington"
            className={`w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent transition-all ${
              errors.fullName ? 'border-rose-500' : 'border-border dark:border-white/10'
            }`}
          />
          {errors.fullName && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-accent" />
            Clearance Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={data.email}
            onChange={e => onChange({ email: e.target.value })}
            placeholder="e.g. kensington@capitalgroup.co.uk"
            className={`w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent transition-all ${
              errors.email ? 'border-rose-500' : 'border-border dark:border-white/10'
            }`}
          />
          {errors.email && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-accent" />
            Contact Telephone <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={data.phone}
            onChange={e => onChange({ phone: e.target.value })}
            placeholder="+377 98 00 12 34"
            className={`w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent transition-all ${
              errors.phone ? 'border-rose-500' : 'border-border dark:border-white/10'
            }`}
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-500 font-semibold">{errors.phone}</p>
          )}
        </div>

        {/* Country / Nationality */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-accent" />
            Country of Residence
          </label>
          <input
            type="text"
            value={data.country}
            onChange={e => onChange({ country: e.target.value })}
            placeholder="Monaco / United Kingdom / United States"
            className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      {/* Arrival Details & Special Preferences */}
      <div className="pt-4 border-t border-border/70 dark:border-white/10 space-y-4">
        <h4 className="text-xs font-serif font-bold text-primary dark:text-white flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Sovereign Concierge Preferences</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent" />
              Estimated Arrival Time
            </label>
            <select
              value={data.estimatedArrival}
              onChange={e => onChange({ estimatedArrival: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent transition-all"
            >
              <option value="14:00 - 16:00">Standard Check-In (15:00 - 17:00)</option>
              <option value="12:00 - 14:00">Early Arrival Request (12:00 - 14:00)</option>
              <option value="18:00 - 21:00">Evening Arrival (18:00 - 21:00)</option>
              <option value="21:00 - 00:00">Late Night Private Arrival (21:00+)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Helipad or Chauffeur Limousine Pickup
            </label>
            <label className="flex items-center gap-3 p-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs text-charcoal dark:text-gray-200 cursor-pointer hover:border-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={data.wantsAirportPickup}
                onChange={e => onChange({ wantsAirportPickup: e.target.checked })}
                className="w-4 h-4 rounded text-accent focus:ring-accent border-gray-300"
              />
              <span className="font-medium">Request Nice Airport (NCE) Private Chauffeur</span>
            </label>
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            Special Requests & Dietary Preferences
          </label>
          <textarea
            rows={3}
            value={data.specialRequests}
            onChange={e => onChange({ specialRequests: e.target.value })}
            placeholder="e.g. Chilled Dom Pérignon in suite, hypoallergenic feather pillows, high floor with Mediterranean sunset view..."
            className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent transition-all resize-none"
          />
          <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
            Special requests cannot be guaranteed but our Head Butler will make every effort to accommodate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsForm;

