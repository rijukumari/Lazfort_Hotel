import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { StatusBadge, Button, Card, Tabs } from '../../components/ui';
import {
  ArrowLeft,
  Crown,
  Edit,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BedDouble,
  DollarSign,
  FileText,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';

export const GuestDetailPage = () => {
  const { id, guestId } = useParams();
  const [searchParams] = useSearchParams();
  const effectiveId = guestId || id || searchParams.get('id');
  const navigate = useNavigate();
  const { guests, bookings, folios = [] } = useERP();

  const [activeTab, setActiveTab] = useState('overview');

  // Strict lookup by ID - no fallback to guests[0]!
  const guest = useMemo(() => {
    if (!effectiveId || effectiveId === 'details' || effectiveId === 'history' || effectiveId === 'vip' || effectiveId === 'feedback') {
      return null;
    }
    return (guests || []).find(
      g => g.id === effectiveId || (g.idNumber && g.idNumber.toLowerCase() === effectiveId.toLowerCase())
    );
  }, [guests, effectiveId]);

  // Guest-specific stay history
  const guestBookings = useMemo(() => {
    if (!guest) return [];
    return (bookings || []).filter(
      b => b.guestId === guest.id || b.guestEmail?.toLowerCase() === guest.email?.toLowerCase()
    );
  }, [bookings, guest]);

  // Guest-specific folios
  const guestFolios = useMemo(() => {
    if (!guest) return [];
    return (folios || []).filter(
      f => f.guestId === guest.id || f.guestName?.toLowerCase() === guest.name?.toLowerCase()
    );
  }, [folios, guest]);

  // If not found, render clean Empty State without breaking or defaulting
  if (!guest) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-16 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-primary dark:text-white">
            Guest Record Not Found
          </h2>
          <p className="text-xs text-charcoal-muted">
            No guest dossier exists matching ID <span className="font-mono text-accent">{effectiveId || 'unknown'}</span>. The record may have been archived or removed.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="gold"
            icon={ArrowLeft}
            onClick={() => navigate('/hotel-admin/guests')}
          >
            Return to Guest Registry
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Dossier Overview' },
    { id: 'stays', label: `Stay History (${guestBookings.length})` },
    { id: 'folios', label: `Invoices & Billing (${guestFolios.length || (guestBookings.length ? 'Folio Active' : '0')})` },
    { id: 'preferences', label: 'Concierge Preferences' },
  ];

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
            <span>Return to Guest Registry</span>
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
                Passport ID: <span className="font-mono font-bold text-accent">{guest.idNumber || guest.id}</span> • {guest.nationality}
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

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Dossier (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card variant="luxury" className="p-5">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Lifetime Spend</span>
                <p className="font-serif font-bold text-2xl text-accent mt-1">
                  ${guest.totalSpent?.toLocaleString()}
                </p>
                <span className="text-[11px] text-charcoal-muted">Settled gross folio spend</span>
              </Card>
              <Card variant="luxury" className="p-5">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Loyalty Points</span>
                <p className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
                  {guest.loyaltyPoints?.toLocaleString()}
                </p>
                <span className="text-[11px] text-charcoal-muted">{guest.vipTier} token balance</span>
              </Card>
              <Card variant="luxury" className="p-5">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Completed Stays</span>
                <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
                  {guest.totalStays}
                </p>
                <span className="text-[11px] text-charcoal-muted">Last stay: {guest.lastStay || '2026-10-25'}</span>
              </Card>
            </div>

            {/* Contact Details */}
            <Card variant="luxury" className="p-6 sm:p-8 space-y-5">
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span>Executive Contact & Identity Verification</span>
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
                <span>Sovereign Clearance & Tier</span>
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
                    {guest.status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Recorded Stays</span>
                  <span className="font-semibold text-primary dark:text-white">{guest.totalStays} Stays</span>
                </div>
              </div>

              <Button
                variant="gold"
                icon={Edit}
                onClick={() => navigate(`/hotel-admin/guests/edit/${guest.id}`)}
                className="w-full"
              >
                Modify VIP Profile
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Stay History */}
      {activeTab === 'stays' && (
        <Card variant="luxury" className="p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span>Stay History for {guest.name}</span>
          </h3>

          {guestBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/80 dark:border-white/10 text-charcoal-muted font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Allocated Suite</th>
                    <th className="py-3 px-4">Dates & Nights</th>
                    <th className="py-3 px-4">Folio Amount</th>
                    <th className="py-3 px-4">Stay Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {guestBookings.map(b => (
                    <tr key={b.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-accent">{b.bookingCode}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-primary dark:text-white">Suite {b.roomNumber}</span>
                        <span className="text-[10px] text-charcoal-muted block">{b.roomType}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {b.checkIn} &rarr; {b.checkOut} ({b.nights}n)
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-accent">
                        ${b.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => navigate(`/hotel-admin/bookings/folio/${b.id}`)}
                          className="px-2.5 py-1 rounded-lg border border-border dark:border-white/10 text-accent font-semibold hover:bg-accent/10 transition-colors"
                        >
                          View Folio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-charcoal-muted italic py-6 text-center">
              No historical stay records found for this guest.
            </p>
          )}
        </Card>
      )}

      {/* Tab: Invoices & Billing */}
      {activeTab === 'folios' && (
        <Card variant="luxury" className="p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <span>Folios, Invoices & Financial Ledgers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Settled Total Spend</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">${guest.totalSpent?.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Paid in full via Escrow / Card</p>
            </div>
            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Reward Tokens</span>
              <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">{guest.loyaltyPoints?.toLocaleString()} pts</p>
              <p className="text-[11px] text-charcoal-muted mt-1">Applicable to luxury spa and dining folios</p>
            </div>
          </div>

          {guestBookings.length > 0 && (
            <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-3">
              <h4 className="font-serif font-bold text-sm text-primary dark:text-white">Active Stay Billing Statements</h4>
              {guestBookings.map(b => (
                <div key={b.id} className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-border/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-accent">Folio Ref #{b.bookingCode}</span>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">Suite {b.roomNumber} • Stay Amount: ${b.totalAmount?.toLocaleString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    icon={FileText}
                    onClick={() => navigate(`/hotel-admin/bookings/folio/${b.id}`)}
                  >
                    Open Folio
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab: Preferences */}
      {activeTab === 'preferences' && (
        <Card variant="luxury" className="p-6 sm:p-8 space-y-5">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Bespoke Concierge & Suite Preferences</span>
          </h3>

          <div className="space-y-3">
            {guest.preferences && guest.preferences.length > 0 ? (
              guest.preferences.map((pref, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-ivory/70 dark:bg-primary-900/30 border border-border/80 text-xs font-medium text-primary dark:text-white"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>{pref}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-charcoal-muted italic">No custom preferences registered.</p>
            )}
          </div>

          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex justify-end">
            <Button
              variant="gold"
              icon={Edit}
              onClick={() => navigate(`/hotel-admin/guests/edit/${guest.id}`)}
            >
              Update Preferences
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GuestDetailPage;
