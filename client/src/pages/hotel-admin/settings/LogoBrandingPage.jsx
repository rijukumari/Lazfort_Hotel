import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { useToast } from '../../../context/ToastContext';
import {
  Palette,
  Image,
  Upload,
  Sparkles,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
} from 'lucide-react';

export const LogoBrandingPage = () => {
  const { showToast } = useToast();

  const [brandConfig, setBrandConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('lazfort_brand_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      brandName: 'LAZFORT',
      subTitle: 'Resort & Palace',
      primaryGold: '#C6A66B',
      secondaryNavy: '#0F172A',
      accentAmber: '#EAB308',
      fontFamily: 'Playfair Display, serif',
      logoUrl: '',
      faviconUrl: '',
      watermarkOpacity: '12%',
      enableGoldInsigniaGlow: true,
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleColorChange = (key, val) => {
    setBrandConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lazfort_brand_settings', JSON.stringify(brandConfig));
      setIsSaved(true);
      if (showToast) {
        showToast('Branding Saved', 'Visual brand guidelines and insignia palette saved.', 'success');
      }
      setTimeout(() => setIsSaved(false), 4000);
    } catch {
      if (showToast) {
        showToast('Error', 'Failed to commit branding configurations.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Logo & Palace Visual Identity"
        description="Establishment insignia assets, luxury gold color palettes, typography scales, and customer portal branding."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Assets Upload Simulation */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Image className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Official Insignia & Crest Assets
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Logo Card */}
            <div className="p-6 rounded-xl border border-dashed border-border bg-background/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/15 to-accent/5 border border-accent/50 flex items-center justify-center text-accent shadow-gold">
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">
                  Primary Palace Crest (SVG / High-Res PNG)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 512×512px. Transparent background.
                </p>
              </div>
              <label className="px-4 py-2 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-semibold cursor-pointer transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload New Crest
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={() => {
                    if (showToast) showToast('Asset Selected', 'New crest uploaded to temporary buffer.', 'info');
                  }}
                />
              </label>
            </div>

            {/* Favicon Card */}
            <div className="p-6 rounded-xl border border-dashed border-border bg-background/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <span className="font-serif font-bold text-lg">L</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">
                  Browser Favicon (.ico / .png)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Rendered across browser tabs and mobile bookmarks (64×64px).
                </p>
              </div>
              <label className="px-4 py-2 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-semibold cursor-pointer transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Favicon
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={() => {
                    if (showToast) showToast('Favicon Selected', 'New favicon staged for deployment.', 'info');
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Color Palette & Font Matrix */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Heritage Color Tokens & Luxury Styling
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Gold Accent */}
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Imperial Gold Highlight
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandConfig.primaryGold}
                  onChange={(e) => handleColorChange('primaryGold', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={brandConfig.primaryGold}
                  onChange={(e) => handleColorChange('primaryGold', e.target.value)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-background text-foreground uppercase"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Used for borders, insignias, and gold CTAs.</p>
            </div>

            {/* Sovereign Charcoal / Navy */}
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Nocturne Foundation Surface
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandConfig.secondaryNavy}
                  onChange={(e) => handleColorChange('secondaryNavy', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={brandConfig.secondaryNavy}
                  onChange={(e) => handleColorChange('secondaryNavy', e.target.value)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-background text-foreground uppercase"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Dark mode base canvas and midnight header tones.</p>
            </div>

            {/* Amber Warmth */}
            <div className="p-4 rounded-xl border border-border bg-background space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Warm Champagne Glow
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandConfig.accentAmber}
                  onChange={(e) => handleColorChange('accentAmber', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={brandConfig.accentAmber}
                  onChange={(e) => handleColorChange('accentAmber', e.target.value)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-background text-foreground uppercase"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Secondary gradients, ratings, and luxury tags.</p>
            </div>
          </div>
        </div>

        {/* Live Brand Crest Preview */}
        <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              Live Identity Header Preview
            </h3>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
              Interactive Preview
            </span>
          </div>

          <div className="p-8 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                style={{
                  background: `linear-gradient(135deg, ${brandConfig.primaryGold}40, ${brandConfig.primaryGold}10)`,
                  borderColor: brandConfig.primaryGold,
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
              >
                <Sparkles className="w-6 h-6" style={{ color: brandConfig.primaryGold }} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl tracking-wider text-white flex items-center gap-2">
                  <span style={{ color: brandConfig.primaryGold }}>{brandConfig.brandName}</span>
                  <span className="text-white text-sm font-sans tracking-widest font-normal">ERP</span>
                </h2>
                <p className="text-[10px] tracking-[0.25em] uppercase font-mono" style={{ color: brandConfig.primaryGold }}>
                  {brandConfig.subTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: brandConfig.primaryGold,
                color: '#000',
              }}
            >
              Exemplary CTA
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Branding guidelines committed to styling engine.</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Style tokens apply globally across customer checkouts, folios, and invoices.
            </p>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Brand Identity
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogoBrandingPage;

