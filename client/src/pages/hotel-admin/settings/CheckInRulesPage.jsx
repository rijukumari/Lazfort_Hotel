import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  Clock,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const CheckInRulesPage = () => {
  const { showToast } = useToast();

  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_checkin_rules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      standardCheckIn: '15:00',
      standardCheckOut: '12:00',
      earlyCheckInAllowed: true,
      earlyCheckInFee: '250',
      earlyCheckInThreshold: '10:00',
      lateCheckOutAllowed: true,
      lateCheckOutFee: '350',
      lateCheckOutGraceLimit: '16:00',
      requirePassportVerification: true,
      requireSecurityDeposit: true,
      depositAmount: '1500',
      minAgeRequirement: '21',
      quietHoursStart: '23:00',
      quietHoursEnd: '07:00',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRules((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_checkin_rules', JSON.stringify(rules));
      setIsSaved(true);
      if (showToast) {
        showToast('Operating Rules Saved', 'Check-in/out policies, grace windows, and deposit constraints committed.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Failed to commit operational check-in rules.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Check-in & Check-out Operating Rules"
        description="Standard turnover hours, early arrival fees, late departure grace allowances, and guest identification mandates."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Timings */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Standard Turnover Schedule
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Standard Check-In (After)
              </label>
              <input
                type="time"
                name="standardCheckIn"
                value={rules.standardCheckIn}
                onChange={handleChange}
                required
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Standard Check-Out (Before)
              </label>
              <input
                type="time"
                name="standardCheckOut"
                value={rules.standardCheckOut}
                onChange={handleChange}
                required
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quiet Hours Begin
              </label>
              <input
                type="time"
                name="quietHoursStart"
                value={rules.quietHoursStart}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quiet Hours End
              </label>
              <input
                type="time"
                name="quietHoursEnd"
                value={rules.quietHoursEnd}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Early Arrival & Extended Departure Protocol */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Early Arrival & Late Departure Surcharges
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Early Check-In Section */}
            <div className="p-5 rounded-xl border border-border bg-background/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Early Check-In Privilege</h4>
                  <p className="text-xs text-muted-foreground">Allow guests to check in prior to 15:00</p>
                </div>
                <input
                  type="checkbox"
                  name="earlyCheckInAllowed"
                  checked={rules.earlyCheckInAllowed}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {rules.earlyCheckInAllowed && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                      Allowed From
                    </label>
                    <input
                      type="time"
                      name="earlyCheckInThreshold"
                      value={rules.earlyCheckInThreshold}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                      Surcharge Fee ($/€)
                    </label>
                    <input
                      type="number"
                      name="earlyCheckInFee"
                      value={rules.earlyCheckInFee}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Late Check-Out Section */}
            <div className="p-5 rounded-xl border border-border bg-background/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Late Departure Privilege</h4>
                  <p className="text-xs text-muted-foreground">Permit extended chamber occupation</p>
                </div>
                <input
                  type="checkbox"
                  name="lateCheckOutAllowed"
                  checked={rules.lateCheckOutAllowed}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {rules.lateCheckOutAllowed && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                      Extended Until
                    </label>
                    <input
                      type="time"
                      name="lateCheckOutGraceLimit"
                      value={rules.lateCheckOutGraceLimit}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                      Surcharge Fee ($/€)
                    </label>
                    <input
                      type="number"
                      name="lateCheckOutFee"
                      value={rules.lateCheckOutFee}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security & Verification Mandates */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Diplomatic Verification & Security Guarantee
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Mandatory Passport Scan
                </span>
                <span className="text-[11px] text-muted-foreground">Required at desk arrival</span>
              </div>
              <input
                type="checkbox"
                name="requirePassportVerification"
                checked={rules.requirePassportVerification}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Pre-Authorization Guarantee
                </span>
                <input
                  type="checkbox"
                  name="requireSecurityDeposit"
                  checked={rules.requireSecurityDeposit}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Hold Amount:</span>
                <input
                  type="number"
                  name="depositAmount"
                  value={rules.depositAmount}
                  onChange={handleChange}
                  className="w-24 text-xs px-2 py-1 rounded border border-border bg-background text-foreground font-mono"
                />
                <span className="text-xs text-muted-foreground">EUR</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background space-y-2">
              <span className="text-xs font-semibold text-foreground block">
                Primary Registrant Age Limit
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minAgeRequirement"
                  value={rules.minAgeRequirement}
                  onChange={handleChange}
                  className="w-20 text-xs px-3 py-1.5 rounded border border-border bg-background text-foreground font-mono"
                />
                <span className="text-xs text-muted-foreground">years or older</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Operating check-in rules synchronized with Front Desk console.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Turnover windows integrate automatically with Housekeeping room readiness tracking.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Check-in Rules
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckInRulesPage;

