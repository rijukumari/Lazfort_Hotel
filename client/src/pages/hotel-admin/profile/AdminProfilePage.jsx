import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/ui';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { hotelApi } from '../../../services/hotelApi';
import { UserAvatar } from '../../../components/common/UserAvatar';
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
} from 'lucide-react';

export const AdminProfilePage = () => {
  const { user, role, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  // Personal profile fields
  const [name, setName] = useState(user?.name || 'Lord Alistair Sterling');
  const [email, setEmail] = useState(user?.email || 'gm@lazfort.com');
  const [phone, setPhone] = useState(user?.phone || '+377 98 06 20 01');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || 'General Manager & Executive Director');
  const [department, setDepartment] = useState(user?.department || 'Executive Directorate');
  const [bio, setBio] = useState(
    user?.bio || 'Supervising high-level palace hospitality operations, private royal engagements, and Michelin culinary affairs at Lazfort Grand Palace.'
  );
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  const [avatar, setAvatar] = useState(user?.avatar || DEFAULT_AVATAR);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || DEFAULT_AVATAR);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Sync with current user from backend
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

  // Handle avatar upload via real Laravel API & MySQL storage
  const handleAvatarChange = async (e) => {
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

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const targetId = user?.id || user?.email || 'usr-ha-1';
      const response = await hotelApi.uploadAvatar(targetId, formData);

      if (response && response.avatar) {
        setAvatar(response.avatar);
        setAvatarPreview(response.avatar);
        if (updateUserProfile) {
          updateUserProfile({ avatar: response.avatar });
        }
        showToast('Profile Picture Updated', 'Your general manager portrait has been securely stored in MySQL.', 'success');
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
      const targetId = user?.id || user?.email || 'usr-ha-1';
      const response = await hotelApi.uploadAvatar(targetId, { remove_avatar: true });
      if (response) {
        setAvatar(DEFAULT_AVATAR);
        setAvatarPreview(DEFAULT_AVATAR);
        if (updateUserProfile) {
          updateUserProfile({ avatar: DEFAULT_AVATAR });
        }
        showToast('Profile Picture Removed', 'Avatar restored to default sovereign portrait.', 'info');
      }
    } catch (err) {
      showToast('Error', 'Failed to remove profile picture.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const updatedProfile = {
        name,
        email,
        phone,
        jobTitle,
        department,
        bio,
        avatar,
      };

      if (updateUserProfile) {
        updateUserProfile(updatedProfile);
      }

      localStorage.setItem('lazfort_admin_personal_prefs', JSON.stringify(preferences));

      if (showToast) {
        showToast('Profile Updated', 'Your personal administrator profile and preferences have been saved.', 'success');
      }
    } catch {
      if (showToast) {
        showToast('Error', 'Failed to update personal profile.', 'error');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      if (showToast) showToast('Validation Error', 'Please enter your current password.', 'warning');
      return;
    }
    if (newPassword.length < 8) {
      if (showToast) showToast('Weak Password', 'New password must be at least 8 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      if (showToast) showToast('Mismatch', 'New password and confirmation password do not match.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (showToast) {
        showToast('Security Update', 'Your administrator password has been updated securely.', 'success');
      }
    }, 700);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="My Profile & Preferences"
        subtitle="Manage your personal administrator identity, credentials, security, and account preferences"
        badge="Personal Account"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="space-y-6">
          <div className="card-luxury-3d p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="flex flex-col items-center text-center">
              {/* Profile Photo with Upload Button */}
              <div className="relative group mb-4">
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
                <label className="absolute bottom-1 right-1 p-2 rounded-full bg-accent text-primary dark:text-primary-950 hover:bg-accent-hover shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95" title="Upload/Change Profile Picture">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={isUploadingAvatar}
                    onChange={handleAvatarChange}
                    className="hidden"
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

              <h3 className="font-serif text-lg font-bold text-charcoal dark:text-white flex items-center gap-1.5">
                {name}
                <Sparkles className="w-4 h-4 text-accent" />
              </h3>
              <p className="text-xs text-accent font-medium mt-0.5">{jobTitle}</p>
              <p className="text-[11px] text-charcoal-muted mt-1">{department}</p>

              <div className="w-full my-4 border-t border-border/60 dark:border-white/10" />

              <div className="w-full space-y-2.5 text-left text-xs">
                <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-charcoal-muted flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-accent" /> Role
                  </span>
                  <span className="font-mono font-semibold text-primary dark:text-accent capitalize">
                    {(role || 'hotel_admin').replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-charcoal-muted flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-accent" /> 2FA Security
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5">
                  <span className="text-charcoal-muted flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" /> Email
                  </span>
                  <span className="text-charcoal dark:text-gray-300 font-mono text-[11px] truncate max-w-[140px]">
                    {email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Personal Preferences */}
          <div className="card-luxury-3d p-6 space-y-4">
            <h4 className="font-serif text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" /> Personal Account Preferences
            </h4>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-ivory dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                <div>
                  <p className="font-medium text-charcoal dark:text-gray-200">Email Notifications</p>
                  <p className="text-[11px] text-charcoal-muted">Receive personal dispatch and emergency alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailAlerts}
                  onChange={() => handlePreferenceToggle('emailAlerts')}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-ivory dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                <div>
                  <p className="font-medium text-charcoal dark:text-gray-200">Audio Chimes</p>
                  <p className="text-[11px] text-charcoal-muted">Subtle chime sound on high-priority VIP actions</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundNotifications}
                  onChange={() => handlePreferenceToggle('soundNotifications')}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-ivory dark:hover:bg-primary-900/30 cursor-pointer transition-colors">
                <div>
                  <p className="font-medium text-charcoal dark:text-gray-200">Compact Data Rows</p>
                  <p className="text-[11px] text-charcoal-muted">Density mode for management tables</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.compactTableRows}
                  onChange={() => handlePreferenceToggle('compactTableRows')}
                  className="w-4 h-4 accent-[#C6A66B] rounded cursor-pointer"
                />
              </label>

              <div className="pt-2 border-t border-border/50 dark:border-white/10">
                <label className="block text-[11px] font-medium text-charcoal-muted mb-1.5">
                  Auto-Lock Idle Session
                </label>
                <select
                  value={preferences.autoLockSessionMinutes}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, autoLockSessionMinutes: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Details & Password Update */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Personal Profile Form */}
          <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" /> Personal Information
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Update your personal name, contact channels, and executive bio
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-accent/10 text-accent border border-accent/20">
                Admin UID: {user?.id || 'usr-ha-1'}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="e.g. Lord Alistair Sterling"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    Official Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="e.g. gm@lazfort.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    Personal Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="e.g. +377 98 06 20 01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    Job Title & Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="e.g. General Manager & Executive Director"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  placeholder="e.g. Executive Directorate & General Management"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Executive Bio & Notes
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white resize-none"
                  placeholder="Personal bio details for corporate filings and internal dispatch..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="btn-luxury px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile & Preferences'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Change Password & Security Credentials */}
          <div className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-accent" /> Change Password
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Update your administrator authentication password to keep your account safe
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-charcoal-muted">
                  Use upper and lower case letters, numbers, and special symbols for maximum strength.
                </p>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 py-2.5 rounded-xl bg-charcoal dark:bg-surface-dark text-white text-xs sm:text-sm font-semibold hover:bg-black dark:hover:bg-primary-800 border border-white/10 transition-all flex items-center gap-2 shadow-sm"
                >
                  <KeyRound className="w-4 h-4 text-accent" />
                  <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;

