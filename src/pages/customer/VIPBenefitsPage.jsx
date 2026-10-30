import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Wine,
  Waves,
  Plane,
  Percent,
  BedDouble,
  ArrowRight,
  Phone,
  HelpCircle,
  Award
} from 'lucide-react';

export const VIPBenefitsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const tierName = currentGuest?.vipTier || user?.membershipTier || (isVip ? 'VIP Diamond' : 'Standard');

  const handleClaimBenefit = (benefitTitle) => {
    if (!isVip) {
      showToast(
        'VIP Benefit Locked',
        'This privilege is reserved exclusively for VIP Diamond tier residents. Contact the Front Desk to inquire about eligibility.',
        'info'
      );
      return;
    }

    showToast(
      'VIP Privilege Dispatched',
      `${benefitTitle} has been confirmed for your dossier and dispatched to the Head Concierge.`,
      'success'
    );
  };

  const vipPerks = [
    {
      id: 'perk-butler',
      title: '24/7 Dedicated Clefs d’Or Butler',
      category: 'Bespoke Service',
      icon: <Award className="w-5 h-5 text-accent" />,
      description: 'Personal valet unpacking, bespoke garment pressing, 24-hour private dining silver-cloche service.',
      benefit: 'Complimentary for active stays',
      actionLabel: 'Page Dedicated Butler',
    },
    {
      id: 'perk-checkout',
      title: 'Guaranteed 16:00 Late Check-Out',
      category: 'Flexibility',
      icon: <Clock className="w-5 h-5 text-accent" />,
      description: 'Complimentary extended stay until 16:00 on day of departure with unhurried beach club access.',
      benefit: 'Automatic on all bookings',
      actionLabel: 'Confirm 16:00 Departure',
    },
    {
      id: 'perk-welcome',
      title: 'Dom Pérignon Vintage Welcome',
      category: 'Culinary Privileges',
      icon: <Wine className="w-5 h-5 text-accent" />,
      description: 'Chilled bottle of vintage Dom Pérignon and Imperial Beluga caviar awaiting in your suite on arrival.',
      benefit: 'Every confirmed stay',
      actionLabel: 'Request Sommelier Pairing',
    },
    {
      id: 'perk-cabana',
      title: 'Priority Sun Cabana & Thalasso Spa',
      category: 'Wellness & Beach',
      icon: <Waves className="w-5 h-5 text-accent" />,
      description: 'Reserved front-row Mediterranean daybeds at the Horizon Infinity Pool and private hydrotherapy access.',
      benefit: 'Priority reservation tier',
      actionLabel: 'Reserve Ocean Cabana',
    },
    {
      id: 'perk-helipad',
      title: 'Helicopter Airport Shuttle',
      category: 'Sovereign Transport',
      icon: <Plane className="w-5 h-5 text-accent" />,
      description: '7-minute private aerial transfer between Nice Côte d’Azur International Airport and Lazfort Helipad.',
      benefit: 'Complimentary for stays > 3 nights',
      actionLabel: 'Schedule Flight Transfer',
    },
    {
      id: 'perk-tariff',
      title: '15% Resident Tariff Reduction',
      category: 'Private Member Rates',
      icon: <Percent className="w-5 h-5 text-accent" />,
      description: 'Exclusive sovereign discount applied automatically across all luxury suite categories and penthouses.',
      benefit: 'Applied at checkout',
      actionLabel: 'View Member Suite Rates',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="VIP Customer Benefits & Sovereign Privileges"
        description="Exclusive elite amenities, bespoke services, and elevated hospitality reserved for distinguished guests."
        badge={isVip ? `${tierName} Resident` : 'Standard Customer'}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/customer/rooms')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <BedDouble className="w-4 h-4" />
              <span>Browse Available Rooms</span>
            </button>
          </div>
        }
      />

      {/* Membership Status Hero Banner */}
      <div
        className={`card-luxury-3d p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
          isVip
            ? 'bg-gradient-to-r from-accent/20 via-primary-900/60 to-accent/10 border-accent/40 shadow-gold'
            : 'bg-white/80 dark:bg-surface-dark/90 border-border dark:border-white/10'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-accent/15 text-accent border border-accent/30">
              {isVip ? <Crown className="w-3.5 h-3.5 text-accent" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isVip ? 'VIP Membership Active' : 'Standard Guest Membership'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary dark:text-white">
              {isVip
                ? `Welcome to the VIP Sovereign Club, ${user?.name || 'Distinguished Resident'}`
                : `Lazfort Customer Membership Tier: Standard`}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-300 max-w-2xl leading-relaxed">
              {isVip
                ? 'Your VIP status grants you unrestricted access to bespoke concierge services, complimentary late departures, private helipad shuttles, and priority reservations.'
                : 'You are currently a Standard Customer. Standard guests enjoy seamless room bookings, digital folios, and 24/7 guest service assistance. VIP privileges are conferred by Hotel Management based on loyalty.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-accent/30 text-right min-w-[200px]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                Assigned Membership Tier
              </span>
              <p className="font-serif text-xl font-bold text-accent mt-0.5">{tierName}</p>
              <span className="text-[10px] text-gray-400 block mt-1">
                {isVip ? 'Verified by Hotel Admin' : 'Admin Managed Clearance'}
              </span>
            </div>
          </div>
        </div>

        {/* Informative Security Notice */}
        <div className="mt-6 pt-4 border-t border-border/80 dark:border-white/10 flex items-start gap-2.5 text-xs text-charcoal-muted dark:text-gray-400">
          <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-primary dark:text-white font-medium">Security Notice: </strong>
            In accordance with Lazfort Grand Palace regulations, VIP membership status is granted exclusively
            through authorized Hotel Administration and Front Desk Concierge controls. Customers cannot self-assign
            VIP tier. Inquire with reception during check-in.
          </p>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              {isVip ? 'Your Active VIP Privileges' : 'VIP Privileges (Preview)'}
            </h3>
          </div>
          <span className="text-xs font-mono text-accent">
            {isVip ? 'All 6 Privileges Unlocked' : 'VIP Status Required to Unlock'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vipPerks.map(perk => (
            <div
              key={perk.id}
              className={`card-luxury-3d rounded-3xl p-6 flex flex-col justify-between transition-all ${
                isVip
                  ? 'hover:border-accent/60'
                  : 'opacity-85 hover:opacity-100 bg-white/60 dark:bg-surface-dark/60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center">
                    {perk.icon}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isVip
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-charcoal/10 dark:bg-white/10 text-charcoal-muted dark:text-gray-400 border border-charcoal/20'
                    }`}
                  >
                    {isVip ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{isVip ? 'Unlocked' : 'VIP Only'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-widest block">
                    {perk.category}
                  </span>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white mt-1">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-2 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-border/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-accent font-mono font-semibold">
                  <span>Benefit Tier:</span>
                  <span>{perk.benefit}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleClaimBenefit(perk.title)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isVip
                      ? 'gold-gradient-bg text-primary-900 btn-3d shadow-gold hover:scale-[1.01]'
                      : 'btn-secondary-3d text-charcoal-muted dark:text-gray-300'
                  }`}
                >
                  <span>{perk.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Customer Call-to-action */}
      {!isVip && (
        <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-accent/10 via-transparent to-accent/5 border border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0 shadow-gold">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-primary dark:text-white">
                Book Luxury Suites at Standard Rates
              </h4>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Standard customers have full access to our online suite reservation system, instant confirmations, and stay management.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/customer/book')}
            className="px-6 py-3 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold whitespace-nowrap"
          >
            Book a Room Now
          </button>
        </div>
      )}
    </div>
  );
};

export default VIPBenefitsPage;

