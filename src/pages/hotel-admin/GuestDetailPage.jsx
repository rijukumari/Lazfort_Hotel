import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { StatusBadge, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Crown,
  Edit,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const GuestDetailPage = () => {
  const { id, guestId } = useParams();
  const effectiveId = guestId || id;
  const navigate = useNavigate();
  const { guests } = useERP();

  const guest = guests.find(g => g.id === effectiveId) || guests[0];

  if (!guest) {
    return (
      <div className="space-y-6">
        <Link to="/hotel-admin/guests" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to VIP Registry
        </Link>
        <p className="text-sm">Guest not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/guests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to VIP Registry</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <img
              src={guest.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={guest.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  {guest.name}
                </h1>
                <StatusBadge status={guest.vipTier} size="sm" />
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Passport ID: <span className="font-mono font-bold text-accent">{guest.idNumber}</span> • {guest.nationality}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/hotel-admin/guests')}
          >
            Back to Registry
          </Button>
          <Button
            variant="gold"
            icon={Edit}
            onClick={() => navigate(`/hotel-admin/guests/edit/${guest.id}`)}
          >
            Edit VIP Dossier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Dossier (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Lifetime Folio Spend</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">
                ${guest.totalSpent?.toLocaleString()}
              </p>
              <span className="text-[11px] text-charcoal-muted">Sovereign settlement gross</span>
            </Card>
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Loyalty Points</span>
              <p className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
                {guest.loyaltyPoints?.toLocaleString()}
              </p>
              <span className="text-[11px] text-charcoal-muted">Diamond reward tokens</span>
            </Card>
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Completed Stays</span>
              <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                {guest.totalStays}
              </p>
              <span className="text-[11px] text-charcoal-muted">Last stay: {guest.lastStay}</span>
            </Card>
          </div>

          {/* Contact Details */}
          <Card variant="luxury" className="p-6 sm:p-8 space-y-5">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>Executive Contact & Verification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-mono">Official Email</span>
                  <p className="font-semibold text-primary dark:text-white mt-0.5">{guest.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-mono">Secure Phone</span>
                  <p className="font-semibold text-primary dark:text-white mt-0.5">{guest.phone}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Bespoke Preferences */}
          <Card variant="luxury" className="p-6 sm:p-8 space-y-4">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Bespoke Concierge & Suite Preferences</span>
            </h3>

            <div className="space-y-2.5">
              {guest.preferences && guest.preferences.length > 0 ? (
                guest.preferences.map((pref, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-ivory/70 dark:bg-primary-900/30 border border-border/80 text-xs font-medium text-primary dark:text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{pref}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-charcoal-muted italic">No custom preferences registered.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-accent" />
              <span>Sovereign Clearance</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Loyalty Status</span>
                <StatusBadge status={guest.vipTier} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Nationality</span>
                <span className="font-semibold text-primary dark:text-white">{guest.nationality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Account Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono text-[11px]">
                  {guest.status}
                </span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Edit}
              onClick={() => navigate(`/hotel-admin/guests/edit/${guest.id}`)}
              className="w-full"
            >
              Modify Profile
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailPage;

