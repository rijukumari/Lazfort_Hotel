import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import {
  Sparkles,
  Clock,
  MapPin,
  ShieldCheck,
  Crown,
  Waves,
  Bath,
  Utensils,
  Wine,
  Anchor,
  Tv,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';

const HOTEL_FACILITIES = [
  {
    id: 'fac-spa',
    name: 'The Royal Sovereign Thalasso Spa',
    category: 'wellness',
    categoryLabel: 'Wellness & Spa',
    tagline: 'World-Renowned Mediterranean Hydrotherapy & Thermal Sanctuaries',
    timing: '08:00 - 21:00 Daily',
    location: 'Wellness Level -1 & Ocean Terrace',
    accessTier: 'Complimentary Access for Residents',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    description: 'A 2,500 m² temple of revitalization featuring filtered warm sea-water jet pools, authentic marble Turkish hammams, cryotherapy chambers, and private couples’ suites curated with Bulgari skincare.',
    features: [
      'Heated Mineral Seawater Jacuzzis',
      'Authentic Ottoman Marble Hammam',
      'Whole-Body Cryotherapy (-110°C)',
      'Couples Private VIP Cabana Suites',
      'Dedicated Spa Butler'
    ]
  },
  {
    id: 'fac-pool',
    name: 'Horizon Panoramic Infinity Pool & Beach Club',
    category: 'wellness',
    categoryLabel: 'Pools & Beach',
    tagline: 'Heated Rooftop Pool Suspended Over the Mediterranean Sea',
    timing: '06:00 - 23:00 Daily',
    location: 'Rooftop Sky Deck Level 14',
    accessTier: 'Private Keycard Access for Hotel Guests',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    description: 'Suspended 140 feet above the cliffs of Monaco, our heated freshwater infinity pool blends seamlessly into the horizon. Enjoy plush daybeds, chilled misting services, and poolside champagne bar.',
    features: [
      'Constant 29°C Heated Water Year-Round',
      'Private Teak Sun Cabanas',
      'Poolside Caviar & Champagne Butler',
      'Underwater Acoustic Sound System',
      'Private Direct Beach Lift Access'
    ]
  },
  {
    id: 'fac-dining-louis',
    name: 'Le Louis Sovereign (3-Star Michelin)',
    category: 'dining',
    categoryLabel: 'Michelin Dining',
    tagline: 'Mastery of Haute Cuisine by Chef Sommelier Laurent',
    timing: '12:30 - 15:00 • 19:30 - 23:30',
    location: 'Grand Belle Époque Salon, Ground Floor',
    accessTier: 'Priority Table Reservation for Suite Guests',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Three Michelin stars celebrating the culinary wealth of the French and Italian Rivieras. Featuring line-caught Mediterranean blue lobster, white Alba truffles, and a 40,000-bottle subterranean wine cellar.',
    features: [
      '3 Michelin Star French Riviera Gastronomy',
      'Private Chef’s Table in the Kitchen',
      '40,000-Bottle Rare Vintage Cellar',
      'Dedicated Cheese Master Sommelier',
      'Direct In-Suite Silver-Cloche Service'
    ]
  },
  {
    id: 'fac-dining-bar',
    name: 'The Sapphire Caviar Lounge & Champagne Terrace',
    category: 'dining',
    categoryLabel: 'Lounges & Bars',
    tagline: 'Sunset Aperitifs Overlooking Port Hercules & Monaco Marina',
    timing: '16:00 - 02:00 Nightly',
    location: 'Mezzanine Terrace Level 2',
    accessTier: 'Complimentary Entry for Residents',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    description: 'An intimate cocktail and caviar sanctuary with live jazz harpists, crystal chandeliers, hand-crafted mixology, and an extensive tasting flight of Dom Pérignon, Krug, and Imperial Beluga caviar.',
    features: [
      'Imperial Beluga & Osetra Caviar Service',
      'Rare Cognac & Single Malt Vintage Collection',
      'Live Sunset Jazz & Classical Harp',
      'Private Temperature-Controlled Cigar Humidor',
      'Panoramic Balcony with Fire Pits'
    ]
  },
  {
    id: 'fac-transport-heli',
    name: 'Rooftop Helipad & Executive Chauffeur Fleet',
    category: 'transport',
    categoryLabel: 'VIP Transport',
    tagline: '7-Minute Private Helicopter Transfers from Nice Airport',
    timing: '24/7 On-Demand Flight Clearance',
    location: 'Palace Rooftop Helipad & Chauffeur Courtyard',
    accessTier: 'Private Booking / Diamond Tier Inclusions',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Skip Monaco highway traffic with direct Airbus H130 helicopter transfers landing on the palace roof. Ground transfers provided by our bespoke fleet of Rolls-Royce Phantoms and Bentley Mulsannes.',
    features: [
      '7-Minute Direct Flight to/from Nice (NCE)',
      'Customs & Immigration Clearance on Roof',
      'Rolls-Royce Phantom VIII Chauffeur Fleet',
      'Complimentary Monte-Carlo City Shuttle',
      '24/7 Secure Underground Valet Parking'
    ]
  },
  {
    id: 'fac-transport-yacht',
    name: 'The Lazfort Sovereign 85ft Riva Yacht',
    category: 'transport',
    categoryLabel: 'Private Yacht Charters',
    tagline: 'Private Mediterranean Escapes along Cannes, Cap d’Antibes & Saint-Tropez',
    timing: 'Daily Charters (Morning, Sunset & Full Day)',
    location: 'Port Hercules Private Yacht Berth #4',
    accessTier: 'Exclusive Resident Charter Privileges',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=1200&q=80',
    description: 'Step aboard our private 85-foot Riva luxury yacht staffed with a private captain, deckhand, and personal butler. Includes champagne bar, sea-bobs, paddleboards, and gourmet Mediterranean lunch.',
    features: [
      'Twin 2400 HP MTU Engines',
      'Full Crew (Licensed Captain, Deckhand, Butler)',
      'Seabobs, Snorkeling & Water Toys Included',
      'Champagne Open Bar & Seafood Platter',
      'Sunset Riviera Cruise to Cap Ferrat'
    ]
  },
  {
    id: 'fac-sports-gym',
    name: 'Olympus Technogym Athletic Club & Tennis',
    category: 'recreation',
    categoryLabel: 'Sports & Fitness',
    tagline: 'Olympic-Grade Cardio, Biomechanics & Rooftop Clay Tennis Court',
    timing: '24 Hours Open for Residents',
    location: 'Level 4 & Rooftop Sports Pavilion',
    accessTier: 'Complimentary for All Resident Guests',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    description: 'Equipped with the complete Technogym Artis collection, personal biometric tracking, private pilates reformer studio, and a championship floodlit rooftop tennis court overlooking the harbor.',
    features: [
      'Technogym Artis Biomechanical Cardio & Weights',
      'Dedicated Pilates Reformer & Yoga Studio',
      'Rooftop Red-Clay Tennis Court with Sea View',
      'Certified Personal Fitness Coaches Available',
      'Fresh Cold-Pressed Juice & Electrolyte Bar'
    ]
  },
  {
    id: 'fac-cinema',
    name: 'The Sovereign Dolby Atmos Private Cinema',
    category: 'entertainment',
    categoryLabel: 'Private Cinema',
    tagline: 'Private Screening Room with Italian Leather Recliners & Champagne',
    timing: '10:00 - 01:00 (Private Bookings)',
    location: 'Entertainment Mezzanine Level -1',
    accessTier: 'Private Reservation via Concierge',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    description: 'An intimate 18-seat private cinema boasting a 4K laser projection system, 64-channel Dolby Atmos sound, motorized Italian leather recliners with heated seats, and fresh truffle popcorn service.',
    features: [
      '4K Barco Laser Cinema Projection',
      '64-Channel Spatial Dolby Atmos Acoustics',
      'Plush Cashmere Blankets & Reclining Loungers',
      'Truffle Popcorn & Confectionery Service',
      'Private First-Run Film & Streaming Library'
    ]
  }
];

export const HotelFacilitiesPage = () => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFacilityModal, setActiveFacilityModal] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-10-29');
  const [bookingTime, setBookingTime] = useState('15:00');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const filteredFacilities =
    selectedCategory === 'all'
      ? HOTEL_FACILITIES
      : HOTEL_FACILITIES.filter(f => f.category === selectedCategory);

  const handleBookFacility = (e) => {
    e.preventDefault();
    if (!activeFacilityModal) return;

    showToast(
      'Facility Access Reserved',
      `Your reservation for ${activeFacilityModal.name} on ${bookingDate} at ${bookingTime} for ${guestCount} guest(s) has been confirmed and assigned to your suite butler.`,
      'success'
    );
    setActiveFacilityModal(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Palace Facilities & Sovereign Inclusions"
        description="Discover everything Lazfort Palace Monaco has to offer: heated infinity pools, 3-star Michelin dining, private Riva yachts, rooftop helipad, and royal wellness sanctuaries."
        badge={`${HOTEL_FACILITIES.length} World-Class Amenities`}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Hotel Amenities & Facilities' },
          { id: 'wellness', label: 'Pools & Royal Spa' },
          { id: 'dining', label: 'Michelin Dining & Bars' },
          { id: 'transport', label: 'Helipad & Riva Yacht' },
          { id: 'recreation', label: 'Sports & Tennis' },
          { id: 'entertainment', label: 'Private Cinema' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'gold-gradient-bg text-primary-900 font-bold shadow-gold scale-105'
                : 'btn-secondary-3d text-charcoal-muted dark:text-gray-300 hover:text-accent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredFacilities.map(fac => (
          <div
            key={fac.id}
            className="card-luxury-3d overflow-hidden rounded-3xl flex flex-col justify-between group hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Top Golden Light Strip */}
            <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none z-20 group-hover:via-accent transition-all duration-500" />

            {/* High-res Image & Tag */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={fac.image}
                alt={fac.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-accent border border-accent/40 backdrop-blur-md">
                  {fac.categoryLabel}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] text-accent uppercase font-mono tracking-widest font-bold block">
                  {fac.location}
                </span>
                <h3 className="font-serif font-bold text-xl leading-snug drop-shadow-sm">
                  {fac.name}
                </h3>
              </div>
            </div>

            {/* Body Specs & Inclusions */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-accent italic">
                  "{fac.tagline}"
                </p>
                <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed">
                  {fac.description}
                </p>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-border/70 dark:border-white/10 text-charcoal-muted dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>{fac.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span className="truncate">{fac.accessTier}</span>
                  </div>
                </div>

                {/* Key Inclusions Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-charcoal-muted dark:text-gray-400 block">
                    Exclusive Inclusions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fac.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-primary dark:text-gray-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-[11px] truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFacilityModal(fac)}
                  className="w-full py-3 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reserve Facility / Request Access</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking / Access Request Modal */}
      <Modal
        isOpen={activeFacilityModal !== null}
        onClose={() => setActiveFacilityModal(null)}
        title={activeFacilityModal ? `Reserve ${activeFacilityModal.name}` : ''}
        subtitle="Our Clefs d'Or Head Concierge will prepare your access pass and personalize your experience."
        maxWidth="lg"
      >
        {activeFacilityModal && (
          <form onSubmit={handleBookFacility} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-accent">
                {activeFacilityModal.location} • {activeFacilityModal.timing}
              </span>
              <p className="text-charcoal-muted dark:text-gray-300 text-[11px] leading-relaxed">
                {activeFacilityModal.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-charcoal-muted dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-charcoal-muted dark:text-gray-300">
                  Preferred Time
                </label>
                <select
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="09:00">09:00 (Morning Refresh)</option>
                  <option value="12:30">12:30 (Lunch / Afternoon)</option>
                  <option value="15:00">15:00 (Midday Relaxation)</option>
                  <option value="18:30">18:30 (Sunset Aperitif)</option>
                  <option value="20:30">20:30 (Evening Reserve)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold uppercase text-charcoal-muted dark:text-gray-300">
                  Guests Count
                </label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {[1, 2, 3, 4, 6, 8].map(n => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase text-charcoal-muted dark:text-gray-300">
                Special Requests or Dietary Requirements
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="e.g. Chilled Champagne upon arrival, private cabana preference, anniversary celebration..."
                className="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/70 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveFacilityModal(null)}
                className="px-4 py-2 rounded-xl btn-secondary-3d font-semibold text-charcoal dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Facility Reservation</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default HotelFacilitiesPage;

