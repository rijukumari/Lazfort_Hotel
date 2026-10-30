import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, Button, Tabs, EmptyState } from '../../components/ui';
import {
  Building2,
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Key,
  Layers,
  Sparkles,
  Star,
  Edit,
  ChevronDown,
} from 'lucide-react';

export const HotelDetailPage = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { hotels, updateHotelStatus } = useERP();
  const { showToast } = useToast();

  const effectiveId = paramId || searchParams.get('id') || hotels[0]?.id;
  const hotel = hotels.find(h => h.id === effectiveId) || hotels[0];

  const [activeTab, setActiveTab] = useState('overview');

  if (!hotel) {
    return (
      <div className="space-y-6 p-8">
        <Link
          to="/super-admin/hotels"
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>
        <EmptyState
          icon={Building2}
          title="Property Record Not Found"
          description="No hotel property matches the specified identifier in current records."
          action={
            <Button variant="gold" onClick={() => navigate('/super-admin/hotels')}>
              Back to Global Portfolio
            </Button>
          }
        />
      </div>
    );
  }

  const handleSelectHotelChange = e => {
    navigate(`/super-admin/hotels/details?id=${e.target.value}`);
  };

  const handleStatusChange = newStatus => {
    updateHotelStatus(hotel.id, newStatus);
    showToast('Status Updated', `${hotel.name} status updated to ${newStatus}.`, 'success');
  };

  const detailTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'info', label: 'Property Information' },
    { id: 'rooms', label: 'Rooms & Facilities' },
    { id: 'management', label: 'Management Contacts' },
    { id: 'history', label: 'Activity History' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Top Navigation & Hotel Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/hotels"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Back to All Properties</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {hotel.name}
            </h1>
            <StatusBadge status={hotel.status} size="md" />
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/25">
              {hotel.id}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>{hotel.location}</span>
          </p>
        </div>

        {/* Actions & Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={hotel.id}
              onChange={handleSelectHotelChange}
              className="appearance-none px-4 py-2 pr-9 text-xs font-semibold rounded-2xl bg-white/90 dark:bg-primary-900/90 border border-border/80 dark:border-accent/30 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-sm cursor-pointer"
            >
              {hotels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.location.split(',').pop()?.trim()})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-accent absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            variant="outline"
            icon={Edit}
            onClick={() => navigate(`/super-admin/hotels/edit/${hotel.id}`)}
          >
            Edit Details
          </Button>

          {hotel.status === 'pending_approval' ? (
            <Button variant="gold" onClick={() => handleStatusChange('active')}>
              Grant Clearance
            </Button>
          ) : hotel.status === 'active' ? (
            <button
              onClick={() => handleStatusChange('suspended')}
              className="px-4 py-2 rounded-2xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
            >
              Suspend Property
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('active')}
              className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Reactivate Property
            </button>
          )}
        </div>
      </div>

      {/* Hero Showcase Estate Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-accent/25 shadow-xl aspect-[21/9] sm:aspect-[25/8] max-h-72">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-primary-950 shadow-sm">
                {hotel.subscriptionPlan}
              </span>
              <div className="flex items-center gap-1 text-xs text-accent">
                {Array.from({ length: hotel.stars || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">{hotel.name}</h2>
            <p className="text-xs text-gray-300 flex items-center gap-1.5 font-mono">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>{hotel.totalRooms} Luxury Keys</span>
              <span>•</span>
              <span>Registered {hotel.createdAt || '2025-01-15'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
              <span className="text-[10px] uppercase font-mono text-gray-300 block">Occupancy</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{hotel.occupancyRate}%</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
              <span className="text-[10px] uppercase font-mono text-gray-300 block">Monthly Revenue</span>
              <span className="text-lg font-bold text-accent font-serif">
                ${(hotel.revenueThisMonth || 185000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={detailTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-accent/25 space-y-4">
            <div className="flex items-center gap-2.5 text-accent">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white uppercase tracking-wider">
                Operational Status
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Current Clearance</span>
                <StatusBadge status={hotel.status} size="sm" />
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Subscription Tier</span>
                <span className="font-bold text-accent font-mono">{hotel.subscriptionPlan}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Billing Cycle</span>
                <span className="font-medium text-primary dark:text-white">Annual Pre-paid Sovereign</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-muted">SLA Response Time</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">&lt; 15 mins (Priority)</span>
              </div>
            </div>
          </div>

          <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-accent/25 space-y-4">
            <div className="flex items-center gap-2.5 text-accent">
              <User className="w-5 h-5" />
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white uppercase tracking-wider">
                General Manager
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Executive Name</span>
                <span className="font-bold text-primary dark:text-white">{hotel.adminName || 'Not Assigned'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Official Email</span>
                <span className="font-mono text-accent truncate max-w-[150px]">{hotel.adminEmail || 'gm@resort.com'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Direct Phone</span>
                <span className="font-mono text-primary dark:text-white">{hotel.adminContact || '+1 (800) 555-0199'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-muted">Appointed Date</span>
                <span className="font-mono text-charcoal-muted">Jan 2025</span>
              </div>
            </div>
          </div>

          <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-accent/25 space-y-4">
            <div className="flex items-center gap-2.5 text-accent">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white uppercase tracking-wider">
                Commercial Performance
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Total Luxury Keys</span>
                <span className="font-bold font-mono text-primary dark:text-white">{hotel.totalRooms} Suites</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">Current Occupancy</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{hotel.occupancyRate}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/60 dark:border-white/5">
                <span className="text-charcoal-muted">RevPAR Index</span>
                <span className="font-mono font-bold text-accent">$842.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-muted">Guest Satisfaction</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">9.9 / 10 (Royal)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6">
          <div className="border-b border-border/80 dark:border-white/10 pb-4">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Sovereign Property Dossier & Statutory Records
            </h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Verified legal and statutory registration credentials filed with the Lazfort Super Admin Directorate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <span className="text-[11px] uppercase font-mono text-accent font-bold block">Geographical Details</span>
              <p><strong>Primary Address:</strong> {hotel.location}</p>
              <p><strong>Territory Classification:</strong> Sovereign Coastal Enclave / Luxury Free-zone</p>
              <p><strong>Cadastral Identifier:</strong> CAD-SOV-{hotel.id.toUpperCase()}-2026</p>
            </div>
            <div className="space-y-3">
              <span className="text-[11px] uppercase font-mono text-accent font-bold block">Operational Clearance</span>
              <p><strong>Clearance Status:</strong> {hotel.status.toUpperCase()}</p>
              <p><strong>License Verification:</strong> Valid through Dec 31, 2026</p>
              <p><strong>Audit Directorate:</strong> Lazfort International Hotel Standards Commission</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
            Suites Allocation & Architectural Facilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/80">
              <span className="text-xs font-mono uppercase text-accent font-bold">Royal Presidential Penthouse</span>
              <p className="text-lg font-serif font-bold text-primary dark:text-white mt-1">12 Suites</p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Private infinity pool & helipad transfer</p>
            </div>
            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/80">
              <span className="text-xs font-mono uppercase text-accent font-bold">Ambassador Executive Suite</span>
              <p className="text-lg font-serif font-bold text-primary dark:text-white mt-1">36 Suites</p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Panoramic sea view & dedicated butler</p>
            </div>
            <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/80">
              <span className="text-xs font-mono uppercase text-accent font-bold">Grand Deluxe Sea Villa</span>
              <p className="text-lg font-serif font-bold text-primary dark:text-white mt-1">
                {(hotel.totalRooms || 80) - 48} Keys
              </p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">Private terrace & sommelier cellar access</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'management' && (
        <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
            Property Leadership Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border space-y-2">
              <span className="font-bold text-primary dark:text-white text-sm">{hotel.adminName || 'General Manager'}</span>
              <p className="text-charcoal-muted">Executive General Manager & Sovereign Plenipotentiary</p>
              <p className="font-mono text-accent">{hotel.adminEmail || 'gm@resort.com'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border space-y-2">
              <span className="font-bold text-primary dark:text-white text-sm">Director of Guest Experiences</span>
              <p className="text-charcoal-muted">Chief Concierge & Head Butler Operations</p>
              <p className="font-mono text-accent">concierge@{hotel.name.toLowerCase().replace(/[^a-z]/g, '')}.com</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
            Audit Trail & Property Telemetry Log
          </h3>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', title: 'Occupancy Telemetry Updated', desc: 'Real-time telemetry reported 88% occupancy across suites.', user: 'PMS Core Gateway' },
              { time: 'Yesterday', title: 'Sovereign Inspection Audit Cleared', desc: 'Annual fire, hygiene, and Michelin gastronomic clearances verified.', user: 'Inspector Laurent (Super Admin)' },
              { time: '5 days ago', title: 'Subscription Term Auto-Renewed', desc: 'Contract billed under Palace Enterprise SLA tier.', user: 'Finance Ledger Engine' },
              { time: 'Jan 15, 2025', title: 'Property Formally Onboarded', desc: 'Full sovereign platform charter allocated with initial suite allotment.', user: 'Super Admin Directorate' },
            ].map((evt, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/80 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary dark:text-white">{evt.title}</span>
                    <span className="text-[10px] font-mono text-charcoal-muted">{evt.time}</span>
                  </div>
                  <p className="text-charcoal-muted">{evt.desc}</p>
                  <span className="text-[10px] font-mono text-accent block pt-0.5">Logged by: {evt.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage;

