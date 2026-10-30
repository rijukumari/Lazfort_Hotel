import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../../components/ui';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Building,
  DollarSign,
} from 'lucide-react';

export const SettleFolioPaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { folios = [], settleFolioPayment } = useERP();
  const { showToast } = useToast();

  const folio = folios.find(f => f.id === id || f.bookingCode === id) || folios[0];

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentAmount, setPaymentAmount] = useState(folio?.balanceDue || 1500);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      showToast('Validation Error', 'Payment amount must be greater than 0.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      if (settleFolioPayment && folio) {
        settleFolioPayment(folio.id, {
          date: new Date().toISOString().split('T')[0],
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: `PAY-${Date.now().toString().slice(-6)}`,
          receivedBy: 'Platform Super Admin',
        });
      }
      showToast('Payment Settled', `Settled $${paymentAmount} for Folio #${folio?.bookingCode}`, 'success');
      navigate('/super-admin/billing');
    } catch {
      showToast('Error', 'Failed to settle payment.', 'error');
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
            <span className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Settle Outstanding Folio Balance
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Resident: {folio?.guestName} • Suite {folio?.roomNumber} • Outstanding: <strong className="text-rose-600 dark:text-rose-400 font-mono">${(folio?.balanceDue || 0).toLocaleString()}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white/90 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-8 shadow-xl space-y-6">
        <FormField label="Clearance Payment Method" required>
          <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="Credit Card">Credit Card (Centurion Black / Visa Infinite)</option>
            <option value="Wire Transfer">Institutional Sovereign Wire Transfer</option>
            <option value="Cash Vault">Sovereign Treasury Cash Deposit</option>
            <option value="Direct Bill">Corporate Account Invoice</option>
          </Select>
        </FormField>

        <FormField label="Settlement Payment Amount ($ USD)" required>
          <Input
            type="number"
            min={1}
            max={folio?.balanceDue || 999999}
            value={paymentAmount}
            onChange={e => setPaymentAmount(Number(e.target.value))}
            required
          />
        </FormField>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs space-y-1">
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Instant Clearance Verification
          </p>
          <p className="text-charcoal-muted">
            The balance will be credited to General Ledger Operating Treasury immediately upon submission.
          </p>
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
            icon={CheckCircle}
            className="flex-1"
          >
            Process Settlement
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettleFolioPaymentPage;

