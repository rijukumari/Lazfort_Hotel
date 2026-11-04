import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  Info,
  Sparkles,
  BedDouble,
  Clock,
  Star,
  Shield,
  Save,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const HotelInformationPage = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_hotel_information');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      starRating: '5-Star Superior Palace',
      totalChambers: '128 Suites',
      maxGuestCapacity: '350 Royal Guests',
      languages: 'English, French, Italian, Arabic, German, Russian',
      establishedYear: '1894',
      primaryArchitecture: 'Monégasque Belle Époque & Neoclassical Marble',
      propertyClassification: 'Heritage Luxury Palace & Ultra-Exclusive Resort',
      primaryFacilities: [
        'Helipad & Sovereign Maritime Pier',
        '3-Star Michelin Signature Dining (Le Grand Lazfort)',
        'Royal Thalassotherapy Thermal Baths & Hydrotherapy Caves',
        '24/7 Diplomatic Armed Protection & Secure Chauffeur Fleet',
        'Temperature-Controlled Olympic Seawater Lagoon',
        'Private Vaults & High-Security Jewel Depositary',
      ],
      guestGuidelines:
        'Smart Elegant dress code requested within salon chambers after 19:00. Discrete photographic guidelines apply to preserve patron privacy across all public lounges.',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFormData((prev) => {
      const exists = prev.primaryFacilities.includes(facility);
      return {
        ...prev,
        primaryFacilities: exists
          ? prev.primaryFacilities.filter((f) => f !== facility)
          : [...prev.primaryFacilities, facility],
      };
    });
  };

  const allFacilityOptions = [
    'Helipad & Sovereign Maritime Pier',
    '3-Star Michelin Signature Dining (Le Grand Lazfort)',
    'Royal Thalassotherapy Thermal Baths & Hydrotherapy Caves',
    '24/7 Diplomatic Armed Protection & Secure Chauffeur Fleet',
    'Temperature-Controlled Olympic Seawater Lagoon',
    'Private Vaults & High-Security Jewel Depositary',
    'Chauffeur Rolls-Royce Phantom Fleet',
    'Sommelier Private Wine Reserve Cellar',
    'Bespoke Butler Retinue on Each Wing',
  ];

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_hotel_information', JSON.stringify(formData));
      setIsSaved(true);
      if (showToast) {
        showToast('Information Updated', 'Palace capacity, ratings, and facility specifications updated.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Unable to save property specifications.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Hotel Information & Specifications"
        description="Palace architectural classifications, room inventory capacity, premium guest facilities, and hospitality standards."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Rating and Capacity Metrics */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Capacity & Star Classification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Star Classification
              </label>
              <input
                type="text"
                name="starRating"
                value={formData.starRating}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Suite Inventory
              </label>
              <div className="relative">
                <BedDouble className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="totalChambers"
                  value={formData.totalChambers}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Max Patron Capacity
              </label>
              <input
                type="text"
                name="maxGuestCapacity"
                value={formData.maxGuestCapacity}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Founded / Heritage Year
              </label>
              <input
                type="text"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Staff Polyglot Languages
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Classification Type
              </label>
              <input
                type="text"
                name="propertyClassification"
                value={formData.propertyClassification}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Palace Facilities Checklist */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Verified Palace Facilities & Royal Amenities
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Select high-tier amenities displayed on booking confirmations and concierge portals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allFacilityOptions.map((facility, idx) => {
              const active = formData.primaryFacilities.includes(facility);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleFacilityToggle(facility)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                    active
                      ? 'border-accent bg-accent/15 text-foreground shadow-sm'
                      : 'border-border bg-background/50 text-muted-foreground hover:border-accent/40'
                  }`}
                >
                  <span className="truncate pr-2">{facility}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      active ? 'bg-accent text-background' : 'border border-border bg-background'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Hospitality Code */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Patron Etiquette & Public Space Guidelines
            </h3>
          </div>

          <div className="space-y-2">
            <textarea
              name="guestGuidelines"
              rows={3}
              value={formData.guestGuidelines}
              onChange={handleChange}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Property specifications and facilities successfully updated.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Updates propagate instantaneously across customer booking portals.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Hotel Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelInformationPage;

