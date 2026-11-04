import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  KeyRound,
  Shield,
  Save,
  Globe,
  Bell,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Camera,
  BadgeCheck
} from 'lucide-react';

export const ReceptionistProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  // Personal Information
  const [name, setName] = useState(user?.name || 'Camilla Valente');
  const [email, setEmail] = useState(user?.email || 'camilla.v@lazfort.com');
  const [phone, setPhone] = useState(user?.phone || '+377 98 00 11 22');
  const [employeeId] = useState('EMP-FD-8821');
  const [jobRole, setJobRole] = useState('Front Desk Lead & Head Concierge');
  const [department, setDepartment] = useState(user?.department || 'Front Office / VIP Guest Services');
  const [hotelBranch] = useState(user?.hotelName || 'Lazfort Grand Palace & Royal Spa — Monaco');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  );

  // Password Update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Preferences
  const [language, setLanguage] = useState('en');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [arrivalPopups, setArrivalPopups] = useState(true);
  const [emailSummary, setEmailSummary] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (updateUserProfile) {
        updateUserProfile({
          name,
          phone,
          jobRole,
          department,
          avatar,
        });
      }

      setIsSaving(false);
      showToast(
        'Staff Profile Updated',
        'Your staff credentials and duty preferences have been successfully updated.',
        'success'
      );
    }, 400);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Validation Error', 'Please complete all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Password Mismatch', 'New passwords do not match.', 'error');
      return;
    }

    showToast('Password Changed', 'Console security credentials updated successfully.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      <PageHeader
        title="My Profile & Personal Preferences"
        description="Manage your front desk staff dossier, identity credentials, duty communication settings, and security passkeys."
        badge="Front Desk Lead Clearance"
      />

      {/* Staff Hero Card */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-accent via-accent/40 to-accent/90 shadow-gold">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-dark" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-primary dark:text-white">
                  {name}
                </h2>
                <BadgeCheck className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium mt-0.5">
                {jobRole} • {department}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-accent/15 text-accent border border-accent/30">
                  {employeeId}
                </span>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  {hotelBranch}
                </span>
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Active On-Duty Shift
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Edit Personal Info & Preferences */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. Personal & Contact Information */}
            <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" />
                  <span>Personal & Duty Particulars</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Official Work Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 text-xs font-medium text-charcoal-muted dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Direct Contact Extension / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Staff Employee ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={employeeId}
                    className="w-full px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 text-xs font-mono font-bold text-accent cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={e => setJobRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Department Unit
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* 2. Language & Console Notification Preferences */}
            <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" />
                  <span>Language & Duty Alerts</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                    Preferred Terminal Language
                  </label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  >
                    <option value="en">English (Official Hospitality Standard)</option>
                    <option value="fr">Français (Monaco & Côte d'Azur)</option>
                    <option value="it">Italiano (Riviera Concierge)</option>
                    <option value="de">Deutsch (Executive Diplomatic)</option>
                  </select>
                </div>

                <div className="divide-y divide-border/60 dark:divide-white/10 space-y-3 pt-2 text-xs">
                  <div className="pt-2 first:pt-0 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary dark:text-white">Acoustic Bell Alerts</p>
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Play soft chime on incoming VIP concierge dispatches.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundAlerts}
                      onChange={e => setSoundAlerts(e.target.checked)}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary dark:text-white">VIP Arrival Gate Screen Popups</p>
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Display immediate notification when limousine reaches palace gates.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={arrivalPopups}
                      onChange={e => setArrivalPopups(e.target.checked)}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary dark:text-white">Shift Handover Digest via Email</p>
                      <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Receive departure summary when clocking out of shift.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailSummary}
                      onChange={e => setEmailSummary(e.target.checked)}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="gold"
                loading={isSaving}
                icon={Save}
                className="py-3 px-8 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
              >
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right 4 Cols: Change Password */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-luxury-3d p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-base font-bold text-primary dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-accent" />
                <span>Change Password</span>
              </h3>
              <Shield className="w-4 h-4 text-accent" />
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-accent"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl border border-border dark:border-white/15 bg-white/40 dark:bg-white/5 text-charcoal dark:text-gray-200 font-bold hover:border-accent transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistProfilePage;

