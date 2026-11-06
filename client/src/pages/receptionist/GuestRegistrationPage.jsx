import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  FileText,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Crown,
} from 'lucide-react';

export const GuestRegistrationPage = () => {
  const navigate = useNavigate();
  const { addGuest } = useERP();
  const { showToast } = useToast();

  const initialForm = {
    name: '',
    email: '',
    phone: '',
    nationality: 'Monaco',
    address: '',
    idProofType: 'Passport',
    idNumber: '',
    passportExpiry: '',
    vipTier: 'Standard',
    specialRequests: '',
    dietaryRestrictions: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialForm);
    if (showToast) {
      showToast('Form Reset', 'Guest registration form cleared.', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      if (showToast) {
        showToast('Validation Error', 'Guest name, official email, and phone number are required.', 'error');
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newGuest = {
        id: `gst-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        nationality: formData.nationality.trim(),
        address: formData.address.trim() || 'Place du Casino, Monte-Carlo',
        idType: formData.idProofType,
        idNumber: formData.idNumber.trim() || `MC-${Math.floor(100000 + Math.random() * 900000)}`,
        passportExpiry: formData.passportExpiry || '2032-12-31',
        vipTier: formData.vipTier,
        category: formData.vipTier === 'Standard' ? 'Regular Guest' : 'VIP Resident',
        registrationDate: new Date().toISOString().split('T')[0],
        preferences: formData.specialRequests
          ? formData.specialRequests.split(',').map((s) => s.trim())
          : ['Non-smoking chamber', 'High floor'],
        dietary: formData.dietaryRestrictions || 'None',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        totalStays: 0,
        totalSpent: 0,
      };

      if (addGuest) {
        addGuest(newGuest);
      }

      setIsSubmitting(false);
      if (showToast) {
        showToast(
          'Guest Registered Successfully',
          `${newGuest.name} has been enrolled in the Lazfort Guest Directory with ${newGuest.vipTier} tier.`,
          'success'
        );
      }
      navigate('/receptionist/guest-services/directory');
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Guest Registration"
        subtitle="Enroll new patron profile, verify legal identification credentials & configure guest preferences"
        badge="Guest Services"
        actions={
          <Button
            variant="outline"
            icon={FileText}
            onClick={() => navigate('/receptionist/guest-services/directory')}
          >
            Open Guest Directory
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Information Card */}
        <div className="space-y-6">
          <div className="card-luxury-3d p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <h3 className="font-serif text-base font-bold text-charcoal dark:text-white flex items-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-accent" /> Patron Registration
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Registering an incoming or walk-in patron establishes their sovereign hotel folio, keycard authorization profile, and VIP privileges across Lazfort Palace.
            </p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary dark:text-white">Statutory ID Compliance</p>
                  <p className="text-[11px] text-charcoal-muted">All Monaco hospitality mandates require valid passport or diplomatic credential capture.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-primary-900/40 border border-border/40 dark:border-white/5 flex items-start gap-2.5">
                <Crown className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary dark:text-white">VIP Tier Classification</p>
                  <p className="text-[11px] text-charcoal-muted">Sovereign & Diamond tiers automatically alert private butler retinues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card-luxury-3d p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal dark:text-white">
                  Patron Identity & Credentials
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Complete official details accurately for regulatory ledger entry
                </p>
              </div>
              <span className="text-xs text-rose-500 font-medium">* Mandatory fields</span>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Guest Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                    placeholder="e.g. Baroness Charlotte von Berg"
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                    placeholder="e.g. c.vonberg@vanguard.ch"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Contact Telephone / Mobile <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                    placeholder="e.g. +41 22 819 9000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                  Nationality / Citizenship
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                    placeholder="e.g. Switzerland / Monaco"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-gray-300 mb-1.5">
                Residential / Corporate Billing Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  placeholder="e.g. Via Serlas 12, St. Moritz, Switzerland"
                />
              </div>
            </div>

            {/* ID & Compliance */}
            <div className="pt-2 border-t border-border/60 dark:border-white/10">
              <h4 className="text-xs font-semibold text-charcoal dark:text-gray-200 mb-3 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-accent" /> Legal Identification & Tier
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                    ID Proof Type
                  </label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Passport">Passport</option>
                    <option value="Diplomatic ID">Diplomatic ID</option>
                    <option value="National Identity Card">National Identity Card</option>
                    <option value="Driver's License">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                    ID / Document Number
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white font-mono"
                    placeholder="e.g. CH-892019-X"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                    Sovereign Tier Status
                  </label>
                  <select
                    name="vipTier"
                    value={formData.vipTier}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent font-semibold"
                  >
                    <option value="Standard">Standard Guest</option>
                    <option value="VIP">VIP Resident</option>
                    <option value="Elite">Elite Ambassador</option>
                    <option value="Diamond">Diamond Sovereign</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="pt-2 border-t border-border/60 dark:border-white/10 space-y-4">
              <h4 className="text-xs font-semibold text-charcoal dark:text-gray-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Preferences & Dietary Protocol
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                  Chamber Preferences & Special Requests (Comma separated)
                </label>
                <input
                  type="text"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-xs bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  placeholder="e.g. High floor suite, Extra plush pillows, Yacht berth request"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-charcoal-muted mb-1">
                  Dietary Restrictions / Gastronomic Preferences
                </label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-xs bg-white dark:bg-primary-900/70 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
                  placeholder="e.g. Gluten-free, Chilled Vintage Krug Champagne"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-primary-900/40 text-charcoal-muted dark:text-gray-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-luxury px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering Patron...' : 'Save & Register Guest'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestRegistrationPage;

