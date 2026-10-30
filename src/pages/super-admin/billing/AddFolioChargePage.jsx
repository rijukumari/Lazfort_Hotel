import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  Receipt,
  Plus,
  Save,
  CheckCircle,
} from 'lucide-react';

export const AddFolioChargePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { folios = [], postFolioCharge } = useERP();
  const { showToast } = useToast();

  const folio = folios.find(f => f.id === id || f.bookingCode === id) || folios[0];

  const [category, setCategory] = useState('restaurant');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(150);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) {
      showToast('Validation Error', 'Please complete description and amount.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      if (postFolioCharge && folio) {
        postFolioCharge(folio.id, {
          date: new Date().toISOString().split('T')[0],
          category,
          description: description.trim(),
          quantity: 1,
          unitPrice: Number(amount),
          taxAmount: Number(amount) * 0.1,
          totalAmount: Number(amount) * 1.1,
          postedBy: 'Billing Officer',
        });
      }
      showToast('Charge Posted', `Posted $${amount} to Folio #${folio?.bookingCode}`, 'success');
      navigate('/super-admin/billing');
    } catch {
      showToast('Error', 'Failed to post charge.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/super-admin/billing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Billing</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <Receipt className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Post Incidental Folio Charge
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Folio #{folio?.bookingCode} • Suite {folio?.roomNumber} • Resident: {folio?.guestName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-8 shadow-xl space-y-6">
        <FormField label="Service Department / Category" required>
          <Select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="restaurant">Fine Dining & Room Service</option>
            <option value="spa_wellness">Royal Spa & Wellness</option>
            <option value="bar_lounge">Sommelier Cellar & Champagne Bar</option>
            <option value="concierge">Private Jet / Yacht Concierge</option>
            <option value="laundry">Valet Laundry & Dry Cleaning</option>
            <option value="room_charge">Suite Tariff & Upgrades</option>
          </Select>
        </FormField>

        <FormField label="Detailed Charge Description" required>
          <Input
            placeholder="e.g. Imperial Beluga Caviar & 2012 Dom Pérignon Vintage"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Base Net Amount ($ USD)" required>
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            required
          />
        </FormField>

        <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-950/50 border border-border/80 dark:border-white/10 text-xs space-y-1.5">
          <div className="flex justify-between text-charcoal-muted">
            <span>Statutory Luxury VAT (10%):</span>
            <span className="font-mono">${(amount * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-primary dark:text-white pt-2 border-t border-border/50">
            <span>Total Debited to Resident:</span>
            <span className="font-serif text-accent text-base">${(amount * 1.1).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/super-admin/billing')}
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
            Post to Folio
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFolioChargePage;

