import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
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
  Calendar,
  Clock,
  BadgeCheck
} from 'lucide-react';

export const StaffProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  // Personal Information
  const [name, setName] = useState(user?.name || 'Sebastian Laurent');
  const [email, setEmail] = useState(user?.email || 'sebastian.l@lazfort.com');
  const [phone, setPhone] = useState(user?.phone || '+377 98 00 22 44');
  const [employeeId] = useState(user?.id || 'EMP-STF-304');
  const [jobTitle, setJobTitle] = useState('Senior Concierge & Butler');
  const [department, setDepartment] = useState(user?.department || 'VIP Guest Services & Concierge');
  const [hotelBranch] = useState(user?.hotelName || 'Lazfort Grand Palace & Royal Spa — Monaco');
  const [emergencyContact, setEmergencyContact] = useState('+33 6 12 34 56 78 (Spouse: Camille Laurent)');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  );

  // Security Credentials Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Staff Preferences
  const [shiftAlerts, setShiftAlerts] = useState(true);
  const [smsShiftChanges, setSmsShiftChanges] = useState(true);
  const [emailHandoverNotes, setEmailHandoverNotes] = useState(true);

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
      localStorage.setItem('lazfort_staff_profile', JSON.stringify({
        name,
        email,
        phone,
        department,
        emergencyContact,
        avatar,
        shiftAlerts,
        smsShiftChanges,
        emailHandoverNotes
      }));
      setIsSaving(false);
      showToast('Staff Profile Updated', 'Your personal staff dossier has been successfully saved.', 'success');
    }, 400);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Validation Error', 'Please enter your current staff login password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password Length', 'New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    showToast('Password Updated', 'Your staff console password has been rekeyed.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Profile & Personal Information"
        subtitle="Manage your staff identity, department contact details, and account credentials."
        icon={User}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-gold">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified Staff Member
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Staff ID Badge Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-luxury-3d p-6 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ON DUTY
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
                htmlFor="staff-avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-primary-950 hover:scale-105 cursor-pointer shadow-lg transition-transform"
                title="Update portrait"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="staff-avatar-upload"
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
              {jobTitle}
            </p>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1">
              {hotelBranch}
            </p>

            <div className="mt-6 pt-5 border-t border-border/80 dark:border-white/10 space-y-2.5 text-left text-xs">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Employee ID:</span>
                <span className="font-mono font-bold text-accent">{employeeId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Department:</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[170px]" title={department}>
                  {department}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Shift Schedule:</span>
                <span className="font-medium text-primary dark:text-white">Morning Shift (07:00 - 15:30)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Station / Area:</span>
                <span className="font-medium text-primary dark:text-white">Grand Lobby & Sovereign Lounge</span>
              </div>
            </div>
          </div>

          {/* Quick Staff Attendance Snapshot */}
          <div className="card-luxury-3d p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-primary dark:text-white font-serif font-bold text-sm">
              <Clock className="w-4 h-4 text-accent" />
              Duty & Shift Snapshot
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Check-in Time Today</span>
                <span className="text-emerald-500 font-mono font-bold">06:54 AM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Assigned Tasks Completed</span>
                <span className="text-accent font-mono font-bold">8 / 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Update */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveProfile} className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    Personal Information & Contact Details
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Keep your contact channels and emergency information up to date.
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
                  Full Name
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
                  Work Email Address
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

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Emergency Contact Details
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Contact name, relationship, and phone number"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Shift Notification Preferences */}
            <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-3">
              <h5 className="font-serif font-bold text-xs text-primary dark:text-white uppercase tracking-wider">
                Shift & Roster Alerts
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={shiftAlerts}
                    onChange={(e) => setShiftAlerts(e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary dark:text-white">Shift Reminders</p>
                    <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Receive 1-hour pre-shift alerts.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={smsShiftChanges}
                    onChange={(e) => setSmsShiftChanges(e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary dark:text-white">Roster Update SMS</p>
                    <p className="text-[10px] text-charcoal-muted dark:text-gray-400">SMS notification if your schedule changes.</p>
                  </div>
                </label>
              </div>
            </div>
          </form>

          {/* Change Password Card */}
          <form onSubmit={handleUpdatePassword} className="card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    Change Staff Password
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Update your password used to access the staff portal and shift terminal.
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                icon={Lock}
              >
                Change Password
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
                    placeholder="At least 8 chars"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm matching"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;

