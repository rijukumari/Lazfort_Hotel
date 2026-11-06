import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import { mockOrganization } from '../../../data/mockERPData';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const HotelProfilePage = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_hotel_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      hotelName: 'Lazfort Grand Palace & Royal Spa',
      tradeName: 'Lazfort Sovereign Hospitality Group',
      legalEntity: mockOrganization?.legalEntity || 'Lazfort Resorts International S.A. Monaco',
      taxId: mockOrganization?.taxId || 'MC-893021-X',
      registrationNumber: 'HRB-980021-MC',
      contactEmail: 'concierge@lazfort.com',
      contactPhone: '+377 98 06 20 00',
      officialWebsite: 'https://palace.lazfort.com',
      country: 'Monaco',
      city: 'Monte-Carlo',
      address: 'Place du Casino, Monte-Carlo 98000',
      postalCode: '98000',
      description:
        'A historic sovereign luxury destination offering ultra-high-net-worth chamber suites, Michelin-star gastronomy, private butler retinues, and bespoke thalassotherapy wellness retreats.',
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_hotel_profile', JSON.stringify(formData));
      setIsSaved(true);
      if (showToast) {
        showToast('Profile Saved', 'Hotel legal credentials and contact profile successfully updated.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Unable to commit profile updates to persistent storage.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Hotel Profile & Legal Registration"
        description="Official registered establishment identity, sovereign hospitality credentials, contact routing, and property dossier."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Information */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Official Establishment Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hotel / Palace Name
              </label>
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                required
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Operating Trade Group
              </label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
                required
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registered Legal Entity
              </label>
              <input
                type="text"
                name="legalEntity"
                value={formData.legalEntity}
                onChange={handleChange}
                required
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  VAT / Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Registration No.
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Establishment Overview & Luxury Dossier
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        {/* Contact & Dispatch Information */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Official Communication & Physical Location
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Concierge Dispatch Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Direct Telephony Line
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Official Web Portal
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="url"
                  name="officialWebsite"
                  value={formData.officialWebsite}
                  onChange={handleChange}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Full Street Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  City / State
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hotel profile changes committed to database.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Official changes are logged in the sovereign ERP regulatory ledger.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile Dossier
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelProfilePage;

