import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Crown,
  Building2,
  ConciergeBell,
  User,
  ShieldCheck,
  ArrowRight,
  Key,
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, availableRoles = [] } = useAuth();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState('hotel_admin');
  const [email, setEmail] = useState('gm@lazfort.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = role => {
    setSelectedRole(role);
    const roleConfig = availableRoles.find(r => r.role === role);
    if (roleConfig?.mockUser?.email) {
      setEmail(roleConfig.mockUser.email);
    }
  };

  const handleLogin = e => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRole, email);
      const roleConfig = availableRoles.find(r => r.role === selectedRole);
      showToast(
        'Welcome to Lazfort ERP',
        `Authenticated successfully as ${roleConfig?.label || 'Distinguished User'}.`,
        'success'
      );
      setIsLoading(false);
      navigate(roleConfig?.defaultPath || '/hotel-admin/dashboard');
    }, 600);
  };

  const roleIcons = {
    super_admin: <Crown className="w-4 h-4" />,
    hotel_admin: <Building2 className="w-4 h-4" />,
    receptionist: <ConciergeBell className="w-4 h-4" />,
    customer: <User className="w-4 h-4" />,
    housekeeping: <Sparkles className="w-4 h-4" />,
    staff: <Key className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#090d14] text-white overflow-hidden select-none">
      {/* Background Luxury Hotel Image with Deep Ambient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85"
          alt="Lazfort Palace Resort"
          className="w-full h-full object-cover opacity-25 scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c13] via-[#090d14]/90 to-[#080c13]/95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 3D Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/[0.04] dark:bg-[#101722]/80 backdrop-blur-2xl border border-accent/30 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-7 animate-in fade-in zoom-in-95 duration-500">
        {/* Shimmer light bar across top edge */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

        {/* Brand Crest Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-accent/30 via-accent/15 to-transparent border border-accent/60 flex items-center justify-center text-accent shadow-gold">
            <Sparkles className="w-8 h-8 animate-pulse text-accent" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-white mt-3 flex items-center justify-center gap-2">
            <span className="gold-gradient-text">LAZFORT</span>
            <span className="text-white text-2xl font-sans tracking-widest">ERP</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-accent/90 font-mono">
            Sovereign Hotel & Resort Portal
          </p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto pt-1">
            Sign in with your credentials or select a role below for instant demo clearance.
          </p>
        </div>

        {/* 3D Role Selection Tabs */}
        <div className="space-y-2">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-center">
            Select Console Clearance:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableRoles.map(r => {
              const isSelected = selectedRole === r.role;
              return (
                <button
                  type="button"
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border text-left cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-accent/25 to-accent/10 border-accent text-white shadow-gold scale-[1.02]'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={isSelected ? 'text-accent' : 'text-gray-400'}>
                    {roleIcons[r.role]}
                  </span>
                  <span className="truncate">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Clearance Email / ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@lazfort.com"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Security Passcode
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast('Password Reset', 'A secure reset link has been dispatched.', 'info')
                }
                className="text-xs text-accent hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-black/40 border border-white/15 focus:border-accent rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-gray-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Security status */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-gray-600 text-accent focus:ring-accent bg-black/40"
              />
              <span>Remember clearance on this device</span>
            </label>
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              256-Bit Encrypted
            </span>
          </div>

          {/* 3D Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-sm tracking-wider uppercase btn-3d flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Sovereign Access...</span>
              </>
            ) : (
              <>
                <span>Enter Sovereign Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Signup */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400">
          <span>Need new staff credentials or property onboarding? </span>
          <Link
            to="/signup"
            className="text-accent font-semibold hover:underline inline-flex items-center gap-1"
          >
            Register Here →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
