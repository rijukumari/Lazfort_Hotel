import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-ivory dark:bg-primary-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-3xl p-8 sm:p-10 shadow-luxury space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
            Error 404 • Lost in the Palace
          </span>
          <h2 className="font-serif text-3xl font-bold text-primary dark:text-white">
            Chamber Not Found
          </h2>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            The private wing, suite, or document you are seeking has either moved or requires specific clearance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-border dark:border-border-dark text-xs font-semibold hover:bg-ivory dark:hover:bg-primary-800 text-charcoal dark:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Wing
          </button>
          <button
            onClick={() => navigate(`/${role.replace(/_/g, '-')}/dashboard`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm hover:shadow-gold"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { role, switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-ivory dark:bg-primary-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-3xl p-8 sm:p-10 shadow-luxury space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
          <span className="font-serif text-3xl font-bold">403</span>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Role Clearance Restricted
          </span>
          <h2 className="font-serif text-3xl font-bold text-primary dark:text-white">
            Executive Access Required
          </h2>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            This module requires elevated privileges. Use the top demo switcher to switch your preview role to Super Admin or General Manager.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              switchRole('super_admin');
              navigate('/super-admin/dashboard');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm"
          >
            Switch to Super Admin
          </button>
          <button
            onClick={() => navigate(`/${role.replace(/_/g, '-')}/dashboard`)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border dark:border-border-dark text-xs font-semibold hover:bg-ivory dark:hover:bg-primary-800 text-charcoal dark:text-gray-200"
          >
            My Current Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

