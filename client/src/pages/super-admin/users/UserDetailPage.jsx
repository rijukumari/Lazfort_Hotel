import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { Button, Card, StatusBadge } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowLeft,
  UserCheck,
  Edit,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Clock,
  ShieldAlert,
  User,
  KeyRound,
} from 'lucide-react';

export const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, suspendUser, reactivateUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const user = (users || []).find(u => u.id === id) || users[0];

  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <Link to="/super-admin/users" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Users Directory
        </Link>
        <p className="text-sm">User record not found.</p>
      </div>
    );
  }

  const handleToggleStatus = () => {
    if (user.status === 'active') {
      suspendUser(user.id, 'Administrative security suspension');
      showToast('User Suspended', `${user.name}'s clearance suspended.`, 'warning');
    } else {
      reactivateUser(user.id);
      showToast('User Reactivated', `${user.name}'s clearance restored.`, 'success');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to User Directory</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Identity Clearance: {user.name}
            </h1>
            <StatusBadge status={user.status} />
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Sovereign enterprise account profile, assigned permissions, and system audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={Edit}
            onClick={() => navigate(`/super-admin/users/edit/${user.id}`)}
          >
            Edit Profile
          </Button>
          <Button
            variant={user.status === 'active' ? 'danger' : 'gold'}
            icon={user.status === 'active' ? ShieldAlert : UserCheck}
            onClick={handleToggleStatus}
          >
            {user.status === 'active' ? 'Suspend Clearance' : 'Reactivate User'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Dossier */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border/70 dark:border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/40 text-accent font-serif font-bold text-2xl flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                  User ID: {user.id}
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-primary dark:text-white">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-semibold text-xs border border-accent/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Property Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                  Official Email Address
                </span>
                <div className="flex items-center gap-2 text-primary dark:text-white font-medium text-xs">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                  Encrypted Telephone
                </span>
                <div className="flex items-center gap-2 text-primary dark:text-white font-mono text-xs">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>{user.phone || '+377 98 00 12 00'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-1 sm:col-span-2">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">
                  Property Affiliation
                </span>
                <div className="flex items-center gap-2 text-primary dark:text-white font-semibold text-xs">
                  <Building2 className="w-4 h-4 text-accent" />
                  <span>{user.hotel}</span>
                </div>
              </div>
            </div>

            {/* Security Clearances */}
            <div className="space-y-3 pt-4 border-t border-border/70 dark:border-white/10">
              <h4 className="text-xs uppercase font-mono font-bold text-charcoal-muted tracking-wider">
                Authorized Subsystem Clearances
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['PMS Suite Management', 'ERP General Ledger', 'Staff Dispatch', 'Security & Audit', 'Purveyor POs', 'VIP Guest Services'].map(mod => (
                  <div key={mod} className="p-3 rounded-xl border border-border/60 dark:border-white/10 bg-white/40 dark:bg-white/5 flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-charcoal dark:text-gray-200">{mod}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Identity Telemetry
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Onboard Date:</span>
                <span className="font-mono text-primary dark:text-white">{user.registeredDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">Last Activity:</span>
                <span className="font-mono text-accent">{user.lastLogin}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">2FA Enforcement:</span>
                <span className="text-emerald-500 font-semibold">Active Hardware Token</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/10">
                <span className="text-charcoal-muted">SLA Compliance:</span>
                <span className="font-mono text-primary dark:text-white">Tier-1 Cleared</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                icon={Edit}
                onClick={() => navigate(`/super-admin/users/edit/${user.id}`)}
                className="w-full"
              >
                Modify User Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

