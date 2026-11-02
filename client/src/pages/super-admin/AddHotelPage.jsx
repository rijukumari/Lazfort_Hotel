import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  User,
  Crown,
  ChevronRight,
  Home,
  CheckCircle2,
} from 'lucide-react';

export const AddHotelPage = () => {
  const navigate = useNavigate();
  const { addHotel } = useERP();
  const { showToast } = useToast();

  // Form Fields matching screenshot
  const [formName, setFormName] = useState('Lazfort Royal Mirage Dubai');
  const [formLocation, setFormLocation] = useState('Palm Jumeirah, Dubai, UAE');
  const [formRooms, setFormRooms] = useState('80');
  const [formPlan, setFormPlan] = useState('Palace Enterprise ($4,900/mo)');
  const [formAdminName, setFormAdminName] = useState('Baroness Camille Beaumont');
  const [formAdminEmail, setFormAdminEmail] = useState('gm@resort.com');
  const [formAdminContact, setFormAdminContact] = useState('+1 (800) 555-0199');
  const [formStatus, setFormStatus] = useState('active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Hotel / Resort Name is required';
    if (!formLocation.trim()) errs.location = 'Destination Location is required';
    if (!formRooms || isNaN(Number(formRooms)) || Number(formRooms) <= 0) {
      errs.rooms = 'Total Luxury Suites must be a positive integer';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const res = addHotel({
        name: formName.trim(),
        location: formLocation.trim(),
        totalRooms: Number(formRooms),
        subscriptionPlan: formPlan.split(' (')[0],
        adminName: formAdminName.trim() || 'General Manager',
        adminEmail: formAdminEmail.trim() || 'gm@resort.com',
        adminContact: formAdminContact.trim() || '+1 (800) 555-0199',
        status: formStatus,
        occupancyRate: 88,
        revenueThisMonth: 185000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      });

      showToast(
        'Property Provisioned Successfully',
        `Sovereign clearance granted for ${res.hotel?.name || formName}.`,
        'success'
      );
      navigate('/super-admin/hotels');
    } catch {
      showToast('Error', 'Failed to onboard property.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 max-w-7xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/super-admin/hotels"
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Global Luxury Properties</span>
        </Link>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-charcoal-muted dark:text-gray-400">
        <Link to="/super-admin/dashboard" className="flex items-center gap-1 hover:text-accent transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link to="/super-admin/dashboard" className="hover:text-accent transition-colors">
          Super Admin
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link to="/super-admin/hotels" className="hover:text-accent transition-colors">
          Hotels
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-primary dark:text-white font-semibold">Add</span>
      </nav>

      {/* Page Title */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary dark:text-white">
            Onboard New Luxury Property
          </h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-sm">
            <Sparkles className="w-3 h-3 text-accent" />
            Property Provisioning
          </span>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400 mt-1.5">
          Register and provision a sovereign resort or hotel property with immediate platform clearance.
        </p>
      </div>

      {/* Main Form Card matching user screenshot */}
      <form onSubmit={handleSubmit} className="card-luxury p-6 sm:p-10 rounded-[32px] border border-border/70 dark:border-white/10 space-y-8 bg-white dark:bg-surface-dark shadow-sm">
        {/* Section Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border/60 dark:border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0 shadow-sm">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-primary dark:text-white">
              1. Property Identity & Location
            </h2>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Official title, geography, and total suite allotment.
            </p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-6">
          {/* Row 1: Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                  HOTEL / RESORT NAME <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  Official commercial or royal title
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Lazfort Royal Mirage Dubai"
                value={formName}
                onChange={e => {
                  setFormName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border ${errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-border dark:border-white/10'
                  } rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all`}
              />
              {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                  DESTINATION LOCATION <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  City, Territory or Sovereign Region
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Palm Jumeirah, Dubai, UAE"
                value={formLocation}
                onChange={e => {
                  setFormLocation(e.target.value);
                  if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                }}
                className={`w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border ${errors.location ? 'border-rose-500 ring-1 ring-rose-500' : 'border-border dark:border-white/10'
                  } rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all`}
              />
              {errors.location && <p className="text-xs text-rose-500 font-medium">{errors.location}</p>}
            </div>
          </div>

          {/* Row 2: Total Suites & Subscription Tier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                  TOTAL LUXURY SUITES <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  Positive integer (&gt; 0)
                </span>
              </div>
              <input
                type="number"
                min="1"
                required
                placeholder="80"
                value={formRooms}
                onChange={e => {
                  setFormRooms(e.target.value);
                  if (errors.rooms) setErrors(prev => ({ ...prev, rooms: '' }));
                }}
                className={`w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border ${errors.rooms ? 'border-rose-500 ring-1 ring-rose-500' : 'border-border dark:border-white/10'
                  } rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all`}
              />
              {errors.rooms && <p className="text-xs text-rose-500 font-medium">{errors.rooms}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                  SUBSCRIPTION TIER <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  Platform feature clearance tier
                </span>
              </div>
              <select
                value={formPlan}
                onChange={e => setFormPlan(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all appearance-none cursor-pointer"
              >
                <option value="Palace Enterprise ($4,900/mo)">Palace Enterprise ($4,900/mo)</option>
                <option value="Grand Luxury ($2,800/mo)">Grand Luxury ($2,800/mo)</option>
                <option value="Boutique Heritage ($1,400/mo)">Boutique Heritage ($1,400/mo)</option>
              </select>
            </div>
          </div>

          {/* Row 3: General Manager Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                GENERAL MANAGER NAME
              </label>
              <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Primary property executive
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Baroness Camille Beaumont"
              value={formAdminName}
              onChange={e => setFormAdminName(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all"
            />
          </div>

          {/* Row 4: Email & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                  GENERAL MANAGER EMAIL
                </label>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  For executive platform alerts
                </span>
              </div>
              <input
                type="email"
                placeholder="gm@resort.com"
                value={formAdminEmail}
                onChange={e => setFormAdminEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                  CONTACT NUMBER
                </label>
                <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                  Direct private telephone
                </span>
              </div>
              <input
                type="text"
                placeholder="+1 (800) 555-0199"
                value={formAdminContact}
                onChange={e => setFormAdminContact(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Row 5: Initial Clearance Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-wider uppercase text-charcoal dark:text-gray-200">
                INITIAL CLEARANCE STATUS
              </label>
              <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Immediate activation or pending audit
              </span>
            </div>
            <select
              value={formStatus}
              onChange={e => setFormStatus(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white transition-all appearance-none cursor-pointer"
            >
              <option value="active">Active (Immediate Full Clearance)</option>
              <option value="pending_approval">Pending Approval (Pre-Commissioning Audit)</option>
            </select>
          </div>
        </div>

        {/* Card Bottom Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/60 dark:border-white/10">
          <button
            type="button"
            onClick={() => navigate('/super-admin/hotels')}
            className="px-6 py-2.5 rounded-full border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-200 hover:bg-ivory dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="gold-gradient-bg text-primary-950 font-bold px-6 py-2.5 rounded-full text-xs tracking-wider uppercase flex items-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-accent/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-950" />
            {isSubmitting ? 'Provisioning...' : 'CONFIRM & ONBOARD'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHotelPage;
