import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { hotelApi } from '../../services/hotelApi';
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Sparkles,
  Upload,
  CheckCircle2,
} from 'lucide-react';

export const AddHotelModal = ({ isOpen, onClose, onHotelCreated }) => {
  const { addHotel, currencies = [] } = useERP();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('Monaco');
  const [state, setState] = useState('');
  const [city, setCity] = useState('Monte-Carlo');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [category, setCategory] = useState('5 Star Ultra-Luxury');
  const [totalRooms, setTotalRooms] = useState('80');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [timezone, setTimezone] = useState('Europe/Monaco (UTC+1)');
  const [status, setStatus] = useState('active');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80');

  // Owner credentials
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminContact, setAdminContact] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Hotel Name is required';
    if (!code.trim()) errs.code = 'Hotel Code / Unique ID is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid hotel email is required';
    if (!totalRooms || Number(totalRooms) <= 0) errs.totalRooms = 'Must have at least 1 room';
    if (!city.trim()) errs.city = 'City is required';
    if (!country.trim()) errs.country = 'Country is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete required fields highlighted in red.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const location = `${city}${state ? `, ${state}` : ''}, ${country}`;
      const payload = {
        name: name.trim(),
        legalName: legalName.trim() || name.trim(),
        code: code.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim() || '+377 98 00 12 00',
        website: website.trim(),
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        address: address.trim() || location,
        location,
        postalCode: postalCode.trim(),
        hotelCategory: category,
        totalRooms: Number(totalRooms),
        currencyCode,
        timezone,
        status,
        image: logoUrl,
        adminName: adminName.trim() || 'General Manager',
        adminEmail: adminEmail.trim() || email.trim(),
        adminContact: adminContact.trim() || phone.trim() || '+377 98 00 12 00',
      };

      const res = await addHotel(payload);
      const created = res.hotel || payload;

      showToast(
        'Hotel Registered Successfully',
        `Property "${created.name}" has been registered into MySQL database.`,
        'success'
      );

      if (onHotelCreated) {
        onHotelCreated(created);
      }
      onClose();
    } catch (err) {
      showToast('Registration Error', err.message || 'Failed to register hotel property.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Hotel Property"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 text-xs">
        {/* Section 1: Hotel Identification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/80 dark:border-white/10 text-accent font-serif font-bold text-sm">
            <Building2 className="w-4 h-4" />
            <span>Establishment Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Hotel Property Name" required error={errors.name} className="sm:col-span-2">
              <Input
                placeholder="e.g. Lazfort Royal Mirage"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (!code) {
                    const initials = e.target.value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
                    setCode(initials ? `HTL-${initials}` : '');
                  }
                }}
              />
            </FormField>

            <FormField label="Hotel Code / ID" required error={errors.code}>
              <Input
                placeholder="e.g. HTL-LRM"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Hotel Legal Entity Name">
              <Input
                placeholder="e.g. Mirage Luxury Hospitality S.A."
                value={legalName}
                onChange={e => setLegalName(e.target.value)}
              />
            </FormField>

            <FormField label="Hotel Category / Classification">
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="5 Star Ultra-Luxury">5 Star Ultra-Luxury Palace</option>
                <option value="Luxury Boutique Resort">Luxury Boutique Resort</option>
                <option value="Historic Alpine Chalet">Historic Alpine Chalet</option>
                <option value="Oceanfront Villa Estate">Oceanfront Villa Estate</option>
                <option value="Executive Business Suites">Executive Business Suites</option>
              </Select>
            </FormField>
          </div>
        </div>

        {/* Section 2: Contact & Online Presence */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/80 dark:border-white/10 text-accent font-serif font-bold text-sm">
            <Globe className="w-4 h-4" />
            <span>Contact & Online Presence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Official Contact Email" required error={errors.email}>
              <Input
                type="email"
                placeholder="concierge@hotel.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Contact Phone Number">
              <Input
                placeholder="+377 98 00 12 00"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Official Website">
              <Input
                placeholder="https://mirage.lazfort.com"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Section 3: Geographical Location & Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/80 dark:border-white/10 text-accent font-serif font-bold text-sm">
            <MapPin className="w-4 h-4" />
            <span>Geographical Location & Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Country" required error={errors.country}>
              <Input
                placeholder="e.g. Monaco"
                value={country}
                onChange={e => setCountry(e.target.value)}
              />
            </FormField>

            <FormField label="State / Province">
              <Input
                placeholder="e.g. Monte-Carlo"
                value={state}
                onChange={e => setState(e.target.value)}
              />
            </FormField>

            <FormField label="City" required error={errors.city}>
              <Input
                placeholder="e.g. Monaco"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </FormField>

            <FormField label="Postal Code">
              <Input
                placeholder="e.g. 98000"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Complete Physical Address">
            <Textarea
              rows={2}
              placeholder="e.g. 14 Boulevard des Moulins, Monte-Carlo, 98000 Monaco"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </FormField>
        </div>

        {/* Section 4: Inventory, Currency & Operating Parameters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/80 dark:border-white/10 text-accent font-serif font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Inventory, Currency & Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Number of Rooms" required error={errors.totalRooms}>
              <Input
                type="number"
                min="1"
                placeholder="80"
                value={totalRooms}
                onChange={e => setTotalRooms(e.target.value)}
              />
            </FormField>

            <FormField label="Default Currency">
              <Select value={currencyCode} onChange={e => setCurrencyCode(e.target.value)}>
                {currencies.map(c => (
                  <option key={c.currency_code} value={c.currency_code}>
                    {c.currency_code} ({c.currency_symbol}) - {c.currency_name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Operating Timezone">
              <Select value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option value="Europe/Monaco (UTC+1)">Europe/Monaco (UTC+1)</option>
                <option value="Europe/Zurich (UTC+1)">Europe/Zurich (UTC+1)</option>
                <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4)</option>
                <option value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (UTC+5:30)</option>
                <option value="Asia/Singapore (UTC+8)">Asia/Singapore (UTC+8)</option>
              </Select>
            </FormField>

            <FormField label="Hotel Status">
              <Select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">Active Operational</option>
                <option value="inactive">Inactive / Onboarding</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Hotel Logo / Cover URL">
            <Input
              placeholder="https://..."
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
            />
          </FormField>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" loading={isSubmitting} icon={CheckCircle2}>
            Register Property in Database
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHotelModal;

