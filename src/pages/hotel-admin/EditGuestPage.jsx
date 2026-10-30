import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Edit,
  Save,
  Crown,
} from 'lucide-react';

export const EditGuestPage = () => {
  const { id, guestId } = useParams();
  const effectiveId = guestId || id;
  const navigate = useNavigate();
  const { guests, updateGuest } = useERP();
  const { showToast } = useToast();

  const guest = guests.find(g => g.id === effectiveId) || guests[0];

  const [editTier, setEditTier] = useState(guest?.vipTier || 'Diamond');
  const [editPhone, setEditPhone] = useState(guest?.phone || '');
  const [editPreferences, setEditPreferences] = useState(
    guest?.preferences ? guest.preferences.join(', ') : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (guest) {
      setEditTier(guest.vipTier || 'Diamond');
      setEditPhone(guest.phone || '');
      setEditPreferences(guest.preferences ? guest.preferences.join(', ') : '');
    }
  }, [guest]);

  if (!guest) {
    return (
      <div className="space-y-6">
        <Link to="/hotel-admin/guests" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to VIP Registry
        </Link>
        <p className="text-sm">Guest not found.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const parsedPrefs = editPreferences.split(',').map(s => s.trim()).filter(Boolean);
      updateGuest(guest.id, {
        vipTier: editTier,
        phone: editPhone,
        preferences: parsedPrefs,
      });

      showToast('Guest Profile Updated', `${guest.name}'s dossier has been updated.`, 'success');
      navigate('/hotel-admin/guests');
    } catch {
      showToast('Error', 'Failed to update guest profile.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
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
              <Edit className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Edit VIP Profile: {guest.name}
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Update tier privileges, contact coordinates, and bespoke concierge preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/hotel-admin/guests')}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            icon={Save}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Assigned Sovereign VIP Tier" required>
                <Select value={editTier} onChange={e => setEditTier(e.target.value)}>
                  <option value="Diamond">Diamond Tier (Exclusive Sovereign Suite)</option>
                  <option value="Platinum">Platinum Tier (Penthouse & Heli Access)</option>
                  <option value="Gold">Gold Tier (Executive Butler Service)</option>
                  <option value="Standard">Standard VIP Member</option>
                </Select>
              </FormField>

              <FormField label="Direct Secure Telephone" required>
                <Input
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="+377 98 00 55 22"
                />
              </FormField>
            </div>

            <FormField
              label="Bespoke Concierge & Suite Preferences"
              hint="Comma-separated custom guest requests"
            >
              <textarea
                rows={4}
                value={editPreferences}
                onChange={e => setEditPreferences(e.target.value)}
                placeholder="Dom Pérignon upon arrival, King size feather pillow, Yacht transfer concierge..."
                className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
              />
            </FormField>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-accent" />
              <span>Dossier Overview</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Guest ID</span>
                <span className="font-mono font-bold text-primary dark:text-white">{guest.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Passport</span>
                <span className="font-mono text-accent font-bold">{guest.idNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Total Folio Spend</span>
                <span className="font-serif font-bold text-accent">${guest.totalSpent?.toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Save}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Updating...' : 'Save Profile'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditGuestPage;

