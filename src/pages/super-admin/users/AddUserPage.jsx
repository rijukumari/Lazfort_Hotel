import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSuperAdminUsers } from '../../../context/SuperAdminUserContext';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  UserPlus,
  Save,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';

export const AddUserPage = () => {
  const navigate = useNavigate();
  const { addUser } = useSuperAdminUsers();
  const { showToast } = useToast();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('+377 98 00 12 00');
  const [formRole, setFormRole] = useState('Hotel Admin (GM)');
  const [formHotel, setFormHotel] = useState('Lazfort Grand Palace Monaco');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formName.trim()) errs.name = 'Full name is required';
    if (!formEmail.trim()) errs.email = 'Valid operational email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      addUser({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        hotel: formHotel,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      });

      showToast('User Provisioned', `New user "${formName}" has been created and granted ${formRole} credentials.`, 'success');
      navigate('/super-admin/users');
    } catch {
      showToast('Error', 'Failed to provision user.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to User Directory</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <UserPlus className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Provision New Enterprise User
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Configure system identity, assign role clearance (RBAC), and link hotel property clearance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required error={errors.name}>
                <Input
                  placeholder="e.g. Baroness Camille Beaumont"
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  required
                />
              </FormField>

              <FormField label="Work Email Address" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="e.g. c.beaumont@lazfort-palace.mc"
                  value={formEmail}
                  onChange={e => {
                    setFormEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Contact Direct Phone" required>
                <Input
                  placeholder="+377 98 00 12 00"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                />
              </FormField>

              <FormField label="Assigned System Role (RBAC)" required>
                <Select value={formRole} onChange={e => setFormRole(e.target.value)}>
                  <option value="Super Admin">Super Admin (Universal Console)</option>
                  <option value="Hotel Admin (GM)">Hotel Admin (General Manager)</option>
                  <option value="Front Desk Manager">Front Desk Manager / Receptionist</option>
                  <option value="Chief Financial Officer">Chief Financial Officer (Finance)</option>
                  <option value="Executive Housekeeper">Executive Housekeeper</option>
                  <option value="Staff Specialist">Staff Specialist</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Assigned Hotel Property" required>
              <Select value={formHotel} onChange={e => setFormHotel(e.target.value)}>
                <option value="Lazfort Grand Palace Monaco">Lazfort Grand Palace Monaco</option>
                <option value="Alpine Luxury Sanctuary St. Moritz">Alpine Luxury Sanctuary St. Moritz</option>
                <option value="Bora Bora Overwater Lagoon Resort">Bora Bora Overwater Lagoon Resort</option>
                <option value="Kyoto Imperial Heritage Manor">Kyoto Imperial Heritage Manor</option>
                <option value="Villa Bellissima Bellagio (Lake Como)">Villa Bellissima Bellagio (Lake Como)</option>
                <option value="All Properties (Global Console)">All Properties (Global Console)</option>
              </Select>
            </FormField>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 shadow-xl space-y-5 sticky top-24">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold block">
              Identity Card Preview
            </span>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/30"
              />
              <div className="truncate">
                <h4 className="font-serif font-bold text-base text-primary dark:text-white truncate">
                  {formName || 'New User Identity'}
                </h4>
                <p className="text-xs text-charcoal-muted truncate">{formEmail || 'user@lazfort-palace.mc'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Clearance Level:</span>
                <span className="font-semibold text-accent">{formRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Assigned Property:</span>
                <span className="font-medium text-primary dark:text-white truncate max-w-[150px]">{formHotel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Account Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active Instant</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/super-admin/users')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                type="submit"
                loading={isSubmitting}
                icon={Save}
                className="flex-1"
              >
                Provision
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;

