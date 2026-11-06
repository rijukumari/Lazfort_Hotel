import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Button } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { hotelApi } from '../../../services/hotelApi';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  Bell,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Building,
  Globe,
  Award
} from 'lucide-react';

export const SuperAdminProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  // Personal Information
  const [name, setName] = useState(user?.name || 'Julian St. Clair');
  const [email, setEmail] = useState(user?.email || 'julian@grandluxe-group.com');
  const [phone, setPhone] = useState(user?.phone || '+377 98 00 90 00');
  const [employeeId] = useState(user?.id || 'SA-EXEC-001');
  const [roleTitle] = useState('Chief Executive & Global Platform Controller');
  const [department, setDepartment] = useState(user?.department || 'Corporate Executive Suite');
  const [organization] = useState('Grand Luxe International Hotels & Resorts');
  const [hqLocation] = useState('14 Boulevard des Moulins, 98000 Monaco');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );

  // Security Credentials Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Executive Preferences
  const [notificationsEmail, setNotificationsEmail] = useState(true);

  // Fetch current user details from API
  useEffect(() => {
    let isMounted = true;
    hotelApi.getCurrentUser().catch(() => {});
    return () => { isMounted = false; };
  }, []);
  const [urgentDisputeAlerts, setUrgentDisputeAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [autoSessionLock, setAutoSessionLock] = useState('15');

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (updateUserProfile) {
        updateUserProfile({
          name,
          email,
          phone,
          department,
          avatar
        });
      }
      localStorage.setItem('lazfort_superadmin_profile', JSON.stringify({
        name,
        email,
        phone,
        department,
        avatar,
        notificationsEmail,
        urgentDisputeAlerts,
        twoFactorAuth,
        autoSessionLock
      }));
      setIsSaving(false);
      showToast('Super Admin Profile Updated', 'Executive personal credentials saved successfully.', 'success');
    }, 400);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Validation Error', 'Please enter your current security clearance password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Weak Password', 'New password must contain at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    showToast('Credentials Rekeyed', 'Super Administrator security master key updated.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Profile & Personal Dossier"
        subtitle="Manage your personal executive credentials, executive identity, and corporate contact dossier."
        icon={User}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Root Governance Authority
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Executive Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-luxury-3d p-6 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="relative inline-block mx-auto mb-4 mt-2">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-accent via-accent/40 to-accent/90 shadow-gold">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-primary-950 hover:scale-105 cursor-pointer shadow-lg transition-transform"
                title="Update portrait"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setAvatar(event.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <h3 className="font-serif font-black text-xl text-primary dark:text-white tracking-wide">
              {name}
            </h3>
            <p className="text-xs text-accent font-semibold mt-0.5">
              {roleTitle}
            </p>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1">
              {organization}
            </p>

            <div className="mt-6 pt-5 border-t border-border/80 dark:border-white/10 space-y-2.5 text-left text-xs">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Employee / User ID:</span>
                <span className="font-mono font-bold text-accent">{employeeId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Access Level:</span>
                <span className="font-semibold text-primary dark:text-white">Tier 0 (Unrestricted)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Department:</span>
                <span className="font-medium text-primary dark:text-white">{department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">HQ Headquarters:</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[170px]" title={hqLocation}>
                  {hqLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Security Status */}
          <div className="card-luxury-3d p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-primary dark:text-white font-serif font-bold text-sm">
              <Shield className="w-4 h-4 text-accent" />
              Clearance & Integrity
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Two-Factor Authentication</span>
                <span className="text-emerald-500 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Session Isolation</span>
                <span className="text-accent font-bold">Hardware Token</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Personal Information & Password Modification */}
        <div className="lg:col-span-8 space-y-6">
          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    Personal Information & Contact Dossier
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Update your executive details, official communication channels, and identity.
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
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Direct Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Notification & Personal Security Checkboxes */}
            <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-3">
              <h5 className="font-serif font-bold text-xs text-primary dark:text-white uppercase tracking-wider">
                Personal Notifications & Alerts
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={notificationsEmail}
                    onChange={(e) => setNotificationsEmail(e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary dark:text-white">Email Digest & Reports</p>
                    <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Receive morning portfolio summaries.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={urgentDisputeAlerts}
                    onChange={(e) => setUrgentDisputeAlerts(e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary dark:text-white">Urgent Dispute Alerts</p>
                    <p className="text-[10px] text-charcoal-muted dark:text-gray-400">SMS alert for high-value guest escalations.</p>
                  </div>
                </label>
              </div>
            </div>
          </form>

          {/* Change Password Card */}
          <form onSubmit={handleUpdatePassword} className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-sm">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    Super Admin Security Credentials
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Change master root console login password and rekey authentication.
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                icon={Lock}
              >
                Update Password
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm matching key"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-accent/40 text-accent focus:ring-accent"
                />
                <span>Show passwords in plaintext</span>
              </label>
              <span className="text-[11px] font-mono text-accent">Last changed: 42 days ago</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfilePage;

