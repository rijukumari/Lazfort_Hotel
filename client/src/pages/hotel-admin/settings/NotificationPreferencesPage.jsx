import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export const NotificationPreferencesPage = () => {
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_notification_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      // Email Channels
      emailNewBookings: true,
      emailCancellations: true,
      emailHighValueFolios: true,
      emailDailyAuditSummary: true,
      emailStaffAbsenceAlerts: false,

      // SMS Channels
      smsVipArrivalAlerts: true,
      smsEmergencyMaintenance: true,
      smsPaymentGatewayFailures: true,

      // In-App Desktop Notifications
      inAppTurnoverReadiness: true,
      inAppGuestFeedbackLogged: true,
      inAppShiftHandovers: true,

      // Dispatch routing
      adminNotificationEmail: 'directorate@lazfort.com',
      securityEmergencyMobile: '+377 98 06 20 99',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_notification_settings', JSON.stringify(prefs));
      setIsSaved(true);
      if (showToast) {
        showToast('Notification Routing Saved', 'Dispatch triggers and notification preferences committed.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Unable to commit notification configuration.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Notification Preferences & Dispatch Routing"
        description="Configure automated alerting channels across email, encrypted SMS gateways, and in-app chamber dispatch consoles."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Dispatch Settings */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Executive Email Dispatch Triggers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  New Reservation Confirmations
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Dispatch email upon verified chamber booking
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.emailNewBookings}
                onChange={() => handleToggle('emailNewBookings')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Cancellation & Refund Alerts
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Immediate dispatch on guest chamber cancellation
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.emailCancellations}
                onChange={() => handleToggle('emailCancellations')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  High-Value Folio Settlements (&gt;€10,000)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Financial controller real-time notifications
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.emailHighValueFolios}
                onChange={() => handleToggle('emailHighValueFolios')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Midnight Statutory Night Audit Digest
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Consolidated daily revenue, ADR, and RevPAR breakdown
                </span>
              </div>
              <input
                type="checkbox"
                checked={prefs.emailDailyAuditSummary}
                onChange={() => handleToggle('emailDailyAuditSummary')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Priority SMS & Sovereign Mobile Alerts */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Urgent SMS & Diplomatic Push Dispatch
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Head of State / VIP Arrival
                </span>
                <span className="text-[11px] text-muted-foreground">Alert General Manager</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.smsVipArrivalAlerts}
                onChange={() => handleToggle('smsVipArrivalAlerts')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Urgent Facilities Alert
                </span>
                <span className="text-[11px] text-muted-foreground">Chief Engineer dispatch</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.smsEmergencyMaintenance}
                onChange={() => handleToggle('smsEmergencyMaintenance')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Gateway Outage Warning
                </span>
                <span className="text-[11px] text-muted-foreground">IT Security trigger</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.smsPaymentGatewayFailures}
                onChange={() => handleToggle('smsPaymentGatewayFailures')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Primary Contact Routing */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Primary Dispatch Relays
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Executive Incident Routing Email
              </label>
              <input
                type="email"
                name="adminNotificationEmail"
                value={prefs.adminNotificationEmail}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                24/7 Diplomatic Armed Security Hotline
              </label>
              <input
                type="text"
                name="securityEmergencyMobile"
                value={prefs.securityEmergencyMobile}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Notification routing rules synced with email/SMS relays.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Configured notification relays trigger in real-time on booking state changes.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Notification Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationPreferencesPage;

