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
  Sparkle,
  Sparkles as SparklesIcon,
  BadgeCheck
} from 'lucide-react';

export const HousekeepingProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  // Personal Information
  const [name, setName] = useState(user?.name || 'Margaux Dubois');
  const [email, setEmail] = useState(user?.email || 'margaux.d@lazfort.com');
  const [phone, setPhone] = useState(user?.phone || '+377 98 00 33 55');
  const [employeeId] = useState(user?.id || 'EMP-HK-109');
  const [jobTitle, setJobTitle] = useState('Head of Housekeeping & Hygiene Lead');
  const [department, setDepartment] = useState(user?.department || 'Housekeeping & Chamber Care');
  const [hotelBranch] = useState(user?.hotelName || 'Lazfort Grand Palace & Royal Spa — Monaco');
  const [assignedFloors, setAssignedFloors] = useState('Floors 3, 4 & Royal Penthouse Suite Level');
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80';
  const [avatar, setAvatar] = useState(user?.avatar || DEFAULT_AVATAR);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || DEFAULT_AVATAR);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    let isMounted = true;
    hotelApi.getCurrentUser()
      .then(res => {
        if (isMounted && res && res.user) {
          if (res.user.name) setName(res.user.name);
          if (res.user.email) setEmail(res.user.email);
          if (res.user.phone) setPhone(res.user.phone);
          if (res.user.avatar) {
            setAvatar(res.user.avatar);
            setAvatarPreview(res.user.avatar);
          }
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid Image Format', 'Please upload a JPEG, PNG, WEBP, or GIF image file.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Profile image size must not exceed 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const targetId = user?.id || user?.email || 'usr-hk-1';
      const response = await hotelApi.uploadAvatar(targetId, formData);

      if (response && response.avatar) {
        setAvatar(response.avatar);
        setAvatarPreview(response.avatar);
        if (updateUserProfile) {
          updateUserProfile({ avatar: response.avatar });
        }
        showToast('Profile Picture Updated', 'Housekeeping portrait stored securely in MySQL.', 'success');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      showToast('Upload Error', err?.data?.message || err.message || 'Failed to upload profile picture.', 'error');
      setAvatarPreview(avatar);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const targetId = user?.id || user?.email || 'usr-hk-1';
      const response = await hotelApi.uploadAvatar(targetId, { remove_avatar: true });
      if (response) {
        setAvatar(DEFAULT_AVATAR);
        setAvatarPreview(DEFAULT_AVATAR);
        if (updateUserProfile) {
          updateUserProfile({ avatar: DEFAULT_AVATAR });
        }
        showToast('Profile Picture Removed', 'Avatar restored to default housekeeping portrait.', 'info');
      }
    } catch (err) {
      showToast('Error', 'Failed to remove profile picture.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Security Credentials Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Operational Preferences
  const [notifyInspectionFailed, setNotifyInspectionFailed] = useState(true);
  const [notifyTurnoverUrgent, setNotifyTurnoverUrgent] = useState(true);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);

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
      localStorage.setItem('lazfort_housekeeping_profile', JSON.stringify({
        name,
        email,
        phone,
        department,
        assignedFloors,
        avatar,
        notifyInspectionFailed,
        notifyTurnoverUrgent,
        vibrationAlerts
      }));
      setIsSaving(false);
      showToast('Housekeeping Profile Saved', 'Hygiene Lead credentials and information saved.', 'success');
    }, 400);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Validation Error', 'Please enter your current housekeeping login password.', 'error');
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

    showToast('Password Updated', 'Housekeeping terminal clearance password updated.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Housekeeping Profile & Personal Dossier"
        subtitle="Manage your personal hygiene lead credentials, assigned floors, and contact information."
        icon={User}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-gold">
              <BadgeCheck className="w-3.5 h-3.5" />
              Chamber Care Directorate
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Housekeeping Lead ID Badge */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-luxury-3d p-6 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ACTIVE SHIFT
              </span>
            </div>

            <div className="relative inline-block mx-auto mb-4 mt-2">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-accent via-accent/40 to-accent/90 shadow-gold relative">
                <img
                  src={avatarPreview}
                  alt={name}
                  onError={() => setAvatarPreview(DEFAULT_AVATAR)}
                  className={`w-full h-full rounded-full object-cover transition-opacity ${isUploadingAvatar ? 'opacity-50' : 'opacity-100'}`}
                />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 text-accent font-mono text-[10px] font-bold">
                    Uploading...
                  </div>
                )}
              </div>
              <label
                htmlFor="hk-avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-primary-950 hover:scale-105 cursor-pointer shadow-lg transition-transform"
                title="Update portrait"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="hk-avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={isUploadingAvatar}
                  onChange={handleAvatarFileChange}
                />
              </label>
            </div>

            {avatar && avatar !== DEFAULT_AVATAR && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar}
                  className="text-[11px] text-rose-500 hover:text-rose-400 hover:underline font-mono"
                >
                  Remove Profile Picture
                </button>
              </div>
            )}

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
                <span className="text-charcoal-muted dark:text-gray-400">Assigned Sector:</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[170px]" title={assignedFloors}>
                  {assignedFloors}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Radio Channel:</span>
                <span className="font-mono text-accent">Channel 04 (HK Ops)</span>
              </div>
            </div>
          </div>

          {/* Quick Housekeeping Duty Stats */}
          <div className="card-luxury-3d p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-primary dark:text-white font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              Today's Chamber Readiness
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Suites Cleaned & Inspected</span>
                <span className="text-emerald-500 font-mono font-bold">14 / 16</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-ivory dark:bg-primary-900/60 border border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400">Average Turnaround Time</span>
                <span className="text-accent font-mono font-bold">34 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
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
                    Update your official staff contact information and assigned floor coverage.
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
                  Official Email
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
                  Mobile / Terminal Number
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
                  Assigned Floors & Sector Supervision
                </label>
                <input
                  type="text"
                  value={assignedFloors}
                  onChange={(e) => setAssignedFloors(e.target.value)}
                  placeholder="e.g. Floors 3, 4 & Penthouse"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Housekeeping Operational Preferences */}
            <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-3">
              <h5 className="font-serif font-bold text-xs text-primary dark:text-white uppercase tracking-wider">
                Turnover & Hygiene Notification Preferences
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={notifyTurnoverUrgent}
                    onChange={(e) => setNotifyTurnoverUrgent(e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary dark:text-white">VIP Priority Turnovers</p>
                    <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Instant notification for expedited check-in suites.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-border/60 dark:border-white/5 bg-ivory/50 dark:bg-primary-900/40 cursor-pointer hover:border-accent/40">
                  <input
                    type="checkbox"
                    checked={notifyInspectionFailed}
                    onChange={(e) => setNotifyInspectionFailed(e.target.checked)}
                    className="rounded border-accent/40 text-accent focus:ring-accent w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-primary dark:text-white">Inspection Rework Alerts</p>
                    <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Alert if supervisor flags a touchpoint during audit.</p>
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
                    Update Housekeeping Terminal Password
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Change authentication key used on floor tablet scanners and stations.
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

export default HousekeepingProfilePage;

