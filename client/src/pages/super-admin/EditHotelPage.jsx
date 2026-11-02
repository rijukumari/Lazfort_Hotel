import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Button, Input, Select, FormField } from '../../components/ui';
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  User,
  Layers,
  Key,
  Star,
  Image as ImageIcon,
  AlertCircle,
  Save,
} from 'lucide-react';

const PRESET_HOTEL_IMAGES = [
  { label: 'French Riviera Palace', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Alpine Sanctuary', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Azure Lagoon Resort', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kyoto Heritage Manor', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Lake Como Villa', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' },
];

export const EditHotelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotels, updateHotel } = useERP();
  const { showToast } = useToast();

  const hotel = hotels.find(h => h.id === id);

  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRooms, setFormRooms] = useState(80);
  const [formStars, setFormStars] = useState(5);
  const [formPlan, setFormPlan] = useState('Palace Enterprise');
  const [formStatus, setFormStatus] = useState('active');
  const [formAdminName, setFormAdminName] = useState('');
  const [formAdminEmail, setFormAdminEmail] = useState('');
  const [formAdminContact, setFormAdminContact] = useState('');
  const [formImage, setFormImage] = useState(PRESET_HOTEL_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hotel) {
      setFormName(hotel.name);
      setFormLocation(hotel.location);
      setFormRooms(hotel.totalRooms);
      setFormStars(hotel.stars || 5);
      setFormPlan(hotel.subscriptionPlan);
      setFormStatus(hotel.status);
      setFormAdminName(hotel.adminName || '');
      setFormAdminEmail(hotel.adminEmail || '');
      setFormAdminContact(hotel.adminContact || '+1 (800) 555-0199');
      setFormImage(hotel.image || PRESET_HOTEL_IMAGES[0].url);
    }
  }, [hotel]);

  if (!hotel) {
    return (
      <div className="space-y-6 p-8 animate-in fade-in duration-300">
        <Link
          to="/super-admin/hotels"
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Return to All Properties</span>
        </Link>
        <div className="card-luxury p-12 text-center rounded-3xl border border-dashed border-border dark:border-white/10">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-primary dark:text-white">
            Property Record Not Found
          </h2>
          <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
            The hotel property with ID <strong className="font-mono text-accent">{id}</strong> could not be located in current records.
          </p>
          <Button
            variant="gold"
            onClick={() => navigate('/super-admin/hotels')}
            className="mt-6"
          >
            Back to Global Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Hotel / Resort Name is required';
    if (!formLocation.trim()) errs.location = 'Destination territory is required';
    if (!formRooms || Number(formRooms) <= 0) errs.rooms = 'Total suites must be greater than 0';
    if (!formAdminName.trim()) errs.adminName = 'General Manager name is required';
    if (formAdminEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formAdminEmail)) {
      errs.adminEmail = 'Please provide a valid administrative email address';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 450));

      const activeImage = customImageUrl.trim() || formImage;

      updateHotel(hotel.id, {
        name: formName.trim(),
        location: formLocation.trim(),
        totalRooms: Number(formRooms),
        stars: Number(formStars),
        subscriptionPlan: formPlan,
        status: formStatus,
        adminName: formAdminName.trim(),
        adminEmail: formAdminEmail.trim(),
        adminContact: formAdminContact.trim(),
        image: activeImage,
      });

      showToast('Property Updated Successfully', `${formName} configuration changes have been committed.`, 'success');
      navigate(`/super-admin/hotels/details?id=${hotel.id}`);
    } catch {
      showToast('Error', 'Failed to update property configuration.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayImage = customImageUrl.trim() || formImage;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to={`/super-admin/hotels/details?id=${hotel.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Property Dossier</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <Building2 className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Edit Property Dossier
            </h1>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
              {hotel.id}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: Main Form Controls (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Identity & Architecture */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Property Identity & Territory
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Configure official nomenclature, sovereign territory, and rating classification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Hotel / Resort Name" required error={formErrors.name}>
                <Input
                  required
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                  }}
                />
              </FormField>

              <FormField label="Destination Territory / Location" required error={formErrors.location}>
                <Input
                  required
                  value={formLocation}
                  onChange={e => {
                    setFormLocation(e.target.value);
                    if (formErrors.location) setFormErrors(prev => ({ ...prev, location: '' }));
                  }}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Total Luxury Suites / Keys" required error={formErrors.rooms}>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formRooms}
                  onChange={e => {
                    setFormRooms(e.target.value);
                    if (formErrors.rooms) setFormErrors(prev => ({ ...prev, rooms: '' }));
                  }}
                />
              </FormField>

              <FormField label="Star Rating / Classification">
                <Select
                  value={formStars}
                  onChange={e => setFormStars(Number(e.target.value))}
                >
                  <option value={5}>5 Stars Luxury Palace</option>
                  <option value={4}>4 Stars Grand Resort</option>
                  <option value={3}>3 Stars Boutique Haven</option>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Card 2: Subscription Tier & Operational Clearance */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Subscription Tier & Operational Clearance
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Update platform tier privileges and live operational status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Platform Plan Tier">
                <Select
                  value={formPlan}
                  onChange={e => setFormPlan(e.target.value)}
                >
                  <option value="Palace Enterprise">Palace Enterprise ($4,900/mo - Unlimited Keys)</option>
                  <option value="Grand Luxury">Grand Luxury ($2,900/mo - Up to 250 Keys)</option>
                  <option value="Boutique Elite">Boutique Elite ($1,400/mo - Up to 80 Keys)</option>
                </Select>
              </FormField>

              <FormField label="Operational Status">
                <Select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value)}
                >
                  <option value="active">Active (Full Commercial Operations)</option>
                  <option value="pending_approval">Pending Approval (Pre-Commissioning Audit)</option>
                  <option value="suspended">Suspended (Administrative Hold)</option>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Card 3: Executive Leadership */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Executive Leadership & GM Contacts
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Primary executive officer for platform administrative telemetry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="General Manager" required error={formErrors.adminName}>
                <Input
                  required
                  value={formAdminName}
                  onChange={e => {
                    setFormAdminName(e.target.value);
                    if (formErrors.adminName) setFormErrors(prev => ({ ...prev, adminName: '' }));
                  }}
                />
              </FormField>

              <FormField label="Executive Email" error={formErrors.adminEmail}>
                <Input
                  type="email"
                  value={formAdminEmail}
                  onChange={e => {
                    setFormAdminEmail(e.target.value);
                    if (formErrors.adminEmail) setFormErrors(prev => ({ ...prev, adminEmail: '' }));
                  }}
                />
              </FormField>

              <FormField label="Direct Telephone">
                <Input
                  type="text"
                  value={formAdminContact}
                  onChange={e => setFormAdminContact(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Card 4: Architecture Visual Theme Selection */}
          <div className="card-luxury p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-white/10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-border/80 dark:border-white/10">
              <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Architectural Cover Visual
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Select a curated architectural preset or input custom sovereign photography URL.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PRESET_HOTEL_IMAGES.map(preset => {
                const isSelected = formImage === preset.url && !customImageUrl.trim();
                return (
                  <div
                    key={preset.url}
                    onClick={() => {
                      setFormImage(preset.url);
                      setCustomImageUrl('');
                    }}
                    className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-accent shadow-md ring-2 ring-accent scale-[1.02]'
                        : 'border-border dark:border-white/10 hover:border-accent/60 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5 text-center">
                      <span className="text-[10px] text-white font-medium truncate block">
                        {preset.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <FormField label="Or Custom Image URL">
              <Input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={customImageUrl}
                onChange={e => setCustomImageUrl(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Right Section: Live Property Showcase Preview (4 Columns) */}
        <div className="lg:col-span-4 sticky top-6 space-y-6">
          <div className="card-luxury p-6 rounded-3xl border border-accent/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-accent">
                Live Preview
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                formStatus === 'active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                formStatus === 'pending_approval' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                {formStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md border border-accent/20">
              <img
                src={currentDisplayImage}
                alt="Property Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent block">
                  {hotel.id}
                </span>
                <h4 className="font-serif font-bold text-base truncate">
                  {formName || 'Property Nomenclature'}
                </h4>
                <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-accent" />
                  {formLocation || 'Destination Location'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/80 dark:border-white/10">
                <span className="text-charcoal-muted">Classification</span>
                <span className="font-serif font-bold text-accent">{formPlan}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/80 dark:border-white/10">
                <span className="text-charcoal-muted">Suite Allotment</span>
                <span className="font-mono font-bold text-primary dark:text-white">{formRooms} Keys</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-border/80 dark:border-white/10">
                <span className="text-charcoal-muted">General Manager</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[140px] text-right">
                  {formAdminName || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                icon={Save}
                loading={isSubmitting}
                onClick={handleSave}
                className="w-full"
              >
                Commit Configuration
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditHotelPage;

