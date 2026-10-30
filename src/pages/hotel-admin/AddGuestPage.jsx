import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  UserPlus,
  Save,
} from 'lucide-react';

export const AddGuestPage = () => {
  const navigate = useNavigate();
  const { addGuest } = useERP();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+377 98 00 55 22');
  const [nationality, setNationality] = useState('Monaco');
  const [vipTier, setVipTier] = useState('Diamond');
  const [preferences, setPreferences] = useState(
    'Dom Pérignon upon arrival, King size feather pillow, Yacht transfer concierge'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Validation Error', 'Guest name and email are mandatory.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const prefList = preferences
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const newGuest = {
        id: `g_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+377 98 00 55 22',
        nationality: nationality.trim() || 'Monaco',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        vipTier,
        totalStays: 1,
        totalSpent: 4500,
        lastStay: new Date().toISOString().split('T')[0],
        status: 'active',
        preferences:
          prefList.length > 0 ? prefList : ['High floor suite', 'Chauffeur limousine service'],
        idNumber: `MC-${Math.floor(100000 + Math.random() * 900000)}`,
        loyaltyPoints: vipTier === 'Diamond' ? 12500 : vipTier === 'Platinum' ? 7500 : 3000,
      };

      addGuest(newGuest);
      showToast(
        'VIP Guest Enrolled',
        `${newGuest.name} has been welcomed to the ${newGuest.vipTier} dossier.`,
        'success'
      );
      navigate('/hotel-admin/guests');
    } catch {
      showToast('Error', 'Failed to enroll guest profile.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/guests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to VIP Registry</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <UserPlus className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Enroll VIP Sovereign Guest
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Create an official VIP guest profile, configure bespoke concierge preferences, and allocate loyalty tier.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Distinguished Guest Full Name" required>
                <Input
                  required
                  placeholder="e.g. Lady Vivienne Montgomery"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormField>

              <FormField label="VIP Sovereign Tier" required>
                <Select value={vipTier} onChange={e => setVipTier(e.target.value)}>
                  <option value="Diamond">Diamond Tier (Exclusive Sovereign Suite)</option>
                  <option value="Platinum">Platinum Tier (Penthouse & Heli Access)</option>
                  <option value="Gold">Gold Tier (Executive Butler Service)</option>
                  <option value="Standard">Standard VIP Member</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="Official Dispatch Email" required>
                <Input
                  type="email"
                  required
                  placeholder="e.g. vivienne.montgomery@sovereign.mc"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormField>

              <FormField label="Direct Secure Phone">
                <Input
                  placeholder="+377 98 00 55 22"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </FormField>

              <FormField label="Citizenship / Sovereign Origin">
                <Input
                  placeholder="e.g. Monaco / Switzerland"
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                />
              </FormField>
            </div>

            <FormField
              label="Bespoke Concierge Preferences"
              hint="Comma-separated special requests and tastes"
            >
              <textarea
                rows={3}
                placeholder="e.g. Dom Pérignon on arrival, hypoallergenic goose-down pillows, daily yacht transfer"
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
              />
            </FormField>
          </Card>
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-accent block">
              VIP Digital Identity Card
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center font-serif font-black text-primary-950 text-base shadow-sm">
                {name.charAt(0) || 'G'}
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                  {name || 'Distinguished Guest'}
                </h4>
                <p className="text-xs text-charcoal-muted">{email || 'guest@domain.com'}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Sovereign Tier</span>
                <span className="font-bold text-accent">{vipTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Origin</span>
                <span className="font-medium text-primary dark:text-white">{nationality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Initial Loyalty Points</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {vipTier === 'Diamond' ? '12,500 pts' : vipTier === 'Platinum' ? '7,500 pts' : '3,000 pts'}
                </span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Save}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Enrolling...' : 'Enroll Guest'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddGuestPage;

