import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight
} from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, availableRoles } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hotelName, setHotelName] = useState('Lazfort Grand Palace & Royal Spa');
  const [role, setRole] = useState('hotel_admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Password Mismatch', 'The entered passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      signup(name, email, role, hotelName);
      const roleConfig = availableRoles.find(r => r.role === role);
      showToast(
        'Account Registered',
        `Welcome to Lazfort ERP, ${name}! Your ${roleConfig?.label} workspace is ready.`,
        'success'
      );
      setIsLoading(false);
      navigate(roleConfig?.defaultPath || '/hotel-admin/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#090d14] text-white overflow-hidden select-none">
      {/* Background Resort Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=85"
          alt="Luxury Resort Backdrop"
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c13] via-[#090d14]/90 to-[#080c13]/95" />
        <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[550px] h-[550px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 3D Glassmorphic Signup Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/[0.04] dark:bg-[#101722]/85 backdrop-blur-2xl border border-accent/30 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

        {/* Brand Crest */}
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-accent/30 via-accent/15 to-transparent border border-accent/60 flex items-center justify-center text-accent shadow-gold">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white mt-2">
            <span className="gold-gradient-text">LAZFORT ERP</span> ONBOARDING
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-accent/90 font-mono">
            New Clearance Registration
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Lady Vivienne De Luca"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Official Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="v.deluca@lazfort.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Assigned Role Clearance *
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white cursor-pointer focus:outline-none"
              >
                <option value="hotel_admin" className="bg-[#101722] text-white">
                  Hotel Admin (General Manager)
                </option>
                <option value="super_admin" className="bg-[#101722] text-white">
                  Super Admin (Corporate Portfolio)
                </option>
                <option value="receptionist" className="bg-[#101722] text-white">
                  Front Desk / Concierge
                </option>
                <option value="customer" className="bg-[#101722] text-white">
                  VIP Customer / Resident
                </option>
                <option value="housekeeping" className="bg-[#101722] text-white">
                  Housekeeping Lead
                </option>
                <option value="staff" className="bg-[#101722] text-white">
                  Staff Operations
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Hotel Property
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={hotelName}
                  onChange={e => setHotelName(e.target.value)}
                  placeholder="e.g. Lazfort Monaco Palace"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="rounded border-gray-600 text-accent focus:ring-accent bg-black/40"
            />
            <label htmlFor="terms" className="text-gray-300 cursor-pointer">
              I agree to the Sovereign Security & Confidentiality Protocols
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !termsAccepted}
            className="w-full py-3.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-sm tracking-wider uppercase btn-3d flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                <span>Creating Sovereign Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration & Launch Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-white/10 text-center text-xs text-gray-400">
          <span>Already have clearance? </span>
          <Link
            to="/login"
            className="text-accent font-semibold hover:underline inline-flex items-center gap-1"
          >
            Sign In Here →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
