import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Crown,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  Award,
  Save,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const CustomerProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { guests } = useERP();
  const { showToast } = useToast();

  const currentGuest = (guests || []).find(
    g =>
      (user?.email && g.email?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && g.name?.toLowerCase() === user.name.toLowerCase())
  );

  const isVip =
    (user?.membershipTier && user.membershipTier !== 'Standard') ||
    user?.vipStatus === true ||
    (currentGuest && currentGuest.vipTier !== 'Standard');

  const tier = currentGuest?.vipTier || user?.membershipTier || (isVip ? 'VIP' : 'Standard');

  // Form states for editable fields
  const [name, setName] = useState(user?.name || 'Alexander Kensington');
  const [email] = useState(user?.email || 'a.kensington@capitalgroup.co.uk');
  const [phone, setPhone] = useState(user?.phone || currentGuest?.phone || '+44 20 7946 0912');
  const [nationality, setNationality] = useState(user?.nationality || currentGuest?.nationality || 'British');
  const [address, setAddress] = useState(user?.address || '7 Avenue Princesse Grace, Monte-Carlo');
  const [bedPreference, setBedPreference] = useState('Super King Plush');
  const [floorPreference, setFloorPreference] = useState('High Floor / Penthouse');
  const [dietary, setDietary] = useState('Gluten-Free, Champagne Pairing');
  const [specialRequests, setSpecialRequests] = useState('Non-smoking suite, feather-free hypoallergenic pillows.');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (updateUserProfile) {
        updateUserProfile({
          name,
          phone,
          nationality,
          address,
          preferences: [bedPreference, floorPreference, dietary, specialRequests],
        });
      }
      setIsSaving(false);
      showToast(
        'Profile Updated',
        'Your guest preferences and contact details have been successfully saved.',
        'success'
      );
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Customer Profile & Membership Dossier"
        description="Manage your guest particulars, stay preferences, and view your verified hotel membership status."
        badge={isVip ? `${tier} Resident` : 'Standard Customer'}
      />

      {/* Profile Overview Card */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-accent via-accent/40 to-accent/90 shadow-gold">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={user?.name || name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-dark" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-primary dark:text-white">
                  {user?.name || name}
                </h3>
                {isVip && <Crown className="w-5 h-5 text-accent animate-pulse" />}
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    isVip
                      ? 'bg-accent/20 text-accent border border-accent/40'
                      : 'bg-primary-900/10 dark:bg-white/10 text-charcoal-muted dark:text-gray-300 border border-charcoal/20'
                  }`}
                >
                  {isVip ? <Crown className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{isVip ? `${tier} Tier Member` : 'Standard Member'}</span>
                </span>
                <span className="text-xs font-mono text-charcoal-muted dark:text-gray-400">
                  ID: {user?.idNumber || currentGuest?.idNumber || 'MC-GST-001'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 w-full sm:w-auto text-center sm:text-right">
            <div className="p-3 bg-ivory dark:bg-primary-900/40 rounded-2xl border border-border/80 dark:border-white/10">
              <span className="text-[10px] font-mono text-charcoal-muted dark:text-gray-400 uppercase font-bold block">
                Total Stays
              </span>
              <p className="font-mono text-base font-bold text-primary dark:text-white mt-0.5">
                {currentGuest?.totalStays || user?.totalStays || 14}
              </p>
            </div>
            <div className="p-3 bg-ivory dark:bg-primary-900/40 rounded-2xl border border-border/80 dark:border-white/10">
              <span className="text-[10px] font-mono text-charcoal-muted dark:text-gray-400 uppercase font-bold block">
                Total Folio
              </span>
              <p className="font-serif text-base font-bold text-accent mt-0.5">
                €{(currentGuest?.totalSpent || user?.totalSpent || 168000).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-ivory dark:bg-primary-900/40 rounded-2xl border border-border/80 dark:border-white/10">
              <span className="text-[10px] font-mono text-charcoal-muted dark:text-gray-400 uppercase font-bold block">
                Loyalty Pts
              </span>
              <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {(currentGuest?.loyaltyPoints || user?.loyaltyPoints || 34500).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ADMIN-CONTROLLED MEMBERSHIP STATUS */}
        <div className="mt-6 p-5 rounded-2xl bg-black/40 border border-accent/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                  Membership Status & Tier Governance
                </span>
                <h4 className="font-serif font-bold text-base text-white">
                  Current Status: {isVip ? `VIP Active (${tier})` : 'Standard Customer'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 text-accent text-xs font-mono font-bold border border-accent/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Managed</span>
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5 text-xs text-gray-300">
            <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Admin Clearance Policy: </strong>
              Customer membership tier (<span className="text-accent font-semibold">Standard</span> or{' '}
              <span className="text-accent font-semibold">VIP</span>) is assigned and managed exclusively by
              authorized <strong>Hotel Administration</strong> and <strong>Front Desk Concierge</strong>.
              Customers cannot grant VIP privileges to themselves. If you believe your tier should be upgraded,
              please consult Hotel Management or Front Desk reception.
            </p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="mt-8 space-y-6">
          <h4 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-accent" />
            <span>Personal Information & Contact Details</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Email Address (Account Identifier)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-950/60 border border-border/60 dark:border-white/10 text-charcoal-muted dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Nationality / Country
              </label>
              <input
                type="text"
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Stay Preferences */}
          <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-4">
            <h4 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Bespoke Stay & Concierge Preferences</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                  Preferred Bed Type
                </label>
                <select
                  value={bedPreference}
                  onChange={e => setBedPreference(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
                >
                  <option value="Super King Plush">Super King Plush</option>
                  <option value="Emperor Double Bed">Emperor Double Bed</option>
                  <option value="Twin Luxury Singles">Twin Luxury Singles</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                  Floor & View Preference
                </label>
                <select
                  value={floorPreference}
                  onChange={e => setFloorPreference(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
                >
                  <option value="High Floor / Penthouse">High Floor / Penthouse</option>
                  <option value="Ocean Panorama Level">Ocean Panorama Level</option>
                  <option value="Quiet Wing Corner Suite">Quiet Wing Corner Suite</option>
                  <option value="Ground Terrace Garden View">Ground Terrace Garden View</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                  Dietary & Sommelier Preferences
                </label>
                <input
                  type="text"
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                  Special Requests for In-Suite Arrival
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Preferences...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfilePage;

