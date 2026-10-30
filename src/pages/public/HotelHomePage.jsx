import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { RoomSearchForm } from '../../components/booking/RoomSearchForm';
import { RoomCard } from '../../components/hotel/RoomCard';
import {
  Sparkles,
  Crown,
  ShieldCheck,
  Utensils,
  Wine,
  Anchor,
  Compass,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Award
} from 'lucide-react';

export const HotelHomePage = () => {
  const navigate = useNavigate();
  const { rooms } = useERP();
  const { isAuthenticated, role, user } = useAuth();

  const handleSearch = (criteria) => {
    const query = new URLSearchParams({
      checkIn: criteria.checkIn || '',
      checkOut: criteria.checkOut || '',
      adults: (criteria.adults || 1).toString(),
      children: (criteria.children || 0).toString(),
      roomsCount: (criteria.roomsCount || 1).toString(),
      roomType: criteria.roomType || 'all',
    }).toString();

    navigate(`/customer/discover/rooms?${query}`);
  };

  const featuredRooms = (rooms || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#090d14] text-charcoal dark:text-gray-100 transition-colors">
      {/* 1. PUBLIC LUXURY TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#0c121d]/85 backdrop-blur-xl border-b border-border/70 dark:border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Insignia */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/15 to-transparent border border-accent/60 flex items-center justify-center text-accent shadow-gold group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg tracking-wider text-primary dark:text-white">
                  LAZFORT
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30">
                  PALACE
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal-muted dark:text-gray-400 font-mono">
                Monte-Carlo • Monaco
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
            <button
              onClick={() => navigate('/customer/discover/rooms')}
              className="hover:text-accent transition-colors"
            >
              Suites & Villas
            </button>
            <button
              onClick={() => navigate('/customer/discover/rooms')}
              className="hover:text-accent transition-colors"
            >
              Search & Book
            </button>
            <button
              onClick={() => navigate('/customer/amenities')}
              className="hover:text-accent transition-colors"
            >
              Hotel Facilities
            </button>
            <button
              onClick={() => navigate('/customer/bookings')}
              className="hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <span>My Bookings</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </button>
          </div>

          {/* Right Action / Role Console CTA */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(`/${role ? role.replace(/_/g, '-') : 'super-admin'}/dashboard`)}
                className="px-4 py-2 rounded-2xl btn-secondary-3d text-xs font-semibold text-primary dark:text-white border border-accent/40 flex items-center gap-2 hover:border-accent"
              >
                <span>Console Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => navigate('/customer/discover/rooms')}
              className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold hidden sm:inline-flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Reserve Suite</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. GRAND HERO SECTION WITH EMBEDDED SEARCH FORM */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
        {/* Background Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2600&q=90"
            alt="Lazfort Palace Monaco"
            className="w-full h-full object-cover scale-105 animate-pulse duration-[12000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-[#090d14]/70 to-[#090d14]/85" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/15 rounded-full blur-[160px] pointer-events-none" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 pt-8 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Sovereign Standard of Monte-Carlo</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            Where Sovereign Elegance Meets{' '}
            <span className="gold-gradient-text italic font-serif">Mediterranean Grandeur</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Perched atop the cliffs of Monaco, Lazfort Palace welcomes royalty, heads of state, and
            discerning travellers to palatial oceanfront suites, private heated plunge pools, and
            dedicated 24/7 royal butler service.
          </p>
        </div>

        {/* Embedded Interactive Search Form */}
        <div className="relative z-20 w-full max-w-6xl mx-auto">
          <RoomSearchForm onSearch={handleSearch} isHeroLayout={true} />
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 text-center text-xs text-gray-300">
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Guaranteed Best Rate</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
            <Crown className="w-4 h-4 text-accent" />
            <span>24/7 Dedicated Butler</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
            <Anchor className="w-4 h-4 text-accent" />
            <span>Private Marina Yacht</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
            <Utensils className="w-4 h-4 text-accent" />
            <span>3-Star Michelin Dining</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROYAL RESIDENCES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/70 dark:border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-accent block">
              Curated Accommodations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary dark:text-white mt-1">
              Featured Royal Residences & Suites
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400 mt-2 max-w-xl">
              Each residence is hand-finished with Italian marble, custom acoustic systems, and
              unobstructed views of the Mediterranean coastline.
            </p>
          </div>

          <button
            onClick={() => navigate('/customer/discover/rooms')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 hover:border-accent hover:text-accent transition-all self-start md:self-auto"
          >
            <span>View All {(rooms || []).length} Suites</span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </button>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              nights={1}
              isAvailableForDates={room.status === 'available'}
              onBookNow={r => {
                navigate(`/customer/checkout?roomId=${r.id}`);
              }}
              onViewDetails={r => {
                navigate(`/customer/rooms/${r.id}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. UNMATCHED SOVEREIGN EXPERIENCES & SERVICES */}
      <section className="py-20 bg-gradient-to-b from-white to-ivory dark:from-[#0d131f] dark:to-[#090d14] border-y border-border/60 dark:border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-accent">
              World-Class Hospitality
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary dark:text-white">
              The Sovereign Guest Privilege
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-400">
              Immerse yourself in services crafted exclusively for heads of state, celebrities, and
              visionary leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/70 dark:bg-surface-dark/80 border border-border dark:border-white/10 shadow-lg space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
                Personal Royal Butler Service
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 leading-relaxed">
                Trained at the prestigious Guild of Professional English Butlers, your personal
                valet attends to unpacking, bespoke itinerary planning, private dining, and custom
                room scented baths.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/70 dark:bg-surface-dark/80 border border-border dark:border-white/10 shadow-lg space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
                Michelin-Star In-Suite Dining
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 leading-relaxed">
                Executive Chef Laurent prepares caviar degustations, blue lobster, and hand-rolled
                pasta served by your private butler on your terrace overlooking the harbor.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/70 dark:bg-surface-dark/80 border border-border dark:border-white/10 shadow-lg space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
                Helipad & Riviera Yacht Charters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 leading-relaxed">
                Direct rooftop helicopter transfers from Nice Côte d'Azur Airport (7 minutes) and
                complimentary day charters aboard the Lazfort 85-foot Riva yacht along the French
                Riviera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUEST TESTIMONIALS & ROYAL ACCLAIM */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-accent">
            Guest Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary dark:text-white">
            Endorsed by Royalty & Discerning Travellers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'The Imperial Penthouse is without equal anywhere in Europe. Our private butler anticipated our every wish, from helicopter transfers to vintage Champagne.',
              author: 'Sir Alexander Kensington',
              title: 'Capital Group UK • Diamond Member',
              rating: 5,
            },
            {
              quote:
                'Checking into Lazfort is like stepping into another era of gracious hospitality, yet with the most advanced ERP and room controls imaginable.',
              author: 'Countess Eleonora De Medici',
              title: 'Florence • Sovereign Resident',
              rating: 5,
            },
            {
              quote:
                'Seamless booking experience, flawless suite condition, and unforgettable ocean sunsets from the private heated plunge pool.',
              author: 'Jean-Luc Moreau',
              title: 'Geneva • Private Office',
              rating: 5,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white/70 dark:bg-surface-dark/70 border border-border dark:border-white/10 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-1 text-accent">
                {[...Array(item.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-accent" />
                ))}
              </div>
              <p className="text-xs text-charcoal dark:text-gray-300 italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="pt-2 border-t border-border/60 dark:border-white/10">
                <p className="font-serif font-bold text-sm text-primary dark:text-white">
                  {item.author}
                </p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LUXURY FOOTER */}
      <footer className="border-t border-border/80 dark:border-white/10 bg-white/50 dark:bg-[#070b12] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-serif font-bold text-lg text-primary dark:text-white">
                LAZFORT GRAND PALACE
              </span>
            </div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 leading-relaxed">
              Sovereign Palace & Royal Spa Resort Monaco. Certified 5-Star Palace Distinction by the
              Monégasque Tourism Authority.
            </p>
            <p className="text-[11px] text-accent font-mono">
              Boulevard de Suisse, 98000 Monaco
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Reservations & Concierge
            </h4>
            <p className="text-charcoal-muted dark:text-gray-400 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-accent" />
              +377 98 00 12 34
            </p>
            <p className="text-charcoal-muted dark:text-gray-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-accent" />
              concierge@lazfort-palace.mc
            </p>
            <p className="text-charcoal-muted dark:text-gray-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Monte-Carlo Coastline, Monaco
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-charcoal-muted dark:text-gray-400">
              <li>
                <button
                  onClick={() => navigate('/customer/discover/rooms')}
                  className="hover:text-accent transition-colors"
                >
                  Suites & Penthouses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/customer/bookings')}
                  className="hover:text-accent transition-colors"
                >
                  My Stays & Folios
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-accent transition-colors"
                >
                  Staff & Admin Clearance Console
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Sovereign Guarantee
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 leading-relaxed">
              Direct bookings enjoy complimentary Rolls-Royce transfers, Dom Pérignon welcome
              service, and late check-out privileges.
            </p>
            <button
              onClick={() => navigate('/customer/discover/rooms')}
              className="w-full py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
            >
              Book Direct Now
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-border/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted dark:text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Lazfort ERP Grand Luxe Monaco. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Sovereign Hospitality</span>
            <span>•</span>
            <span>Audit & Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelHomePage;

