import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../../components/ui';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  CreditCard,
  DollarSign,
  User,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const PAYMENT_METHODS = [
  'Centurion Black Card',
  'Visa Infinite Luxury',
  'Mastercard World Elite',
  'International Wire Transfer (UBS)',
  'Cash Settlement (Treasury Vault)',
  'Sovereign Crypto Vault',
];

export const CollectPaymentPage = () => {
  const navigate = useNavigate();
  const { folios = [], bookings = [], processPayment } = useERP();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    guestName: '',
    bookingCode: '',
    folioId: '',
    roomNumber: '',
    amount: '',
    paymentMethod: PAYMENT_METHODS[0],
    notes: 'Front Desk Counter Collection',
    date: new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Sync selected folio
  const handleFolioSelect = (folioId) => {
    const selected = folios.find((f) => f.id === folioId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        folioId: selected.id,
        guestName: selected.guestName || prev.guestName,
        bookingCode: selected.bookingCode || prev.bookingCode,
        roomNumber: selected.roomNumber || prev.roomNumber,
        amount: selected.balance ? String(selected.balance) : prev.amount,
      }));
    }
  };

  const handleBookingSelect = (bookingId) => {
    const selected = bookings.find((b) => b.id === bookingId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        guestName: selected.guestName || prev.guestName,
        bookingCode: selected.bookingCode || prev.bookingCode,
        roomNumber: selected.roomNumber || prev.roomNumber,
        amount: selected.totalAmount ? String(selected.totalAmount) : prev.amount,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      showToast('Validation Error', 'Guest name is required to collect payment.', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Validation Error', 'Please enter a valid payment amount.', 'error');
      return;
    }

    setIsSubmitting(true);
    const generatedRef = `TX-REC-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      if (processPayment) {
        processPayment({
          guestName: formData.guestName.trim(),
          bookingCode: formData.bookingCode.trim() || undefined,
          folioId: formData.folioId || undefined,
          roomNumber: formData.roomNumber || 'Counter',
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
          reference: generatedRef,
          notes: formData.notes,
          status: 'paid',
          date: formData.date,
        });
      }

      setSuccessReceipt({
        reference: generatedRef,
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        amount: Number(formData.amount),
        method: formData.paymentMethod,
        date: formData.date,
      });

      setIsSubmitting(false);
      showToast('Payment Captured', `Transaction ${generatedRef} settled successfully.`, 'success');
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      guestName: '',
      bookingCode: '',
      folioId: '',
      roomNumber: '',
      amount: '',
      paymentMethod: PAYMENT_METHODS[0],
      notes: 'Front Desk Counter Collection',
      date: new Date().toISOString().split('T')[0],
    });
    setSuccessReceipt(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collect Guest Payment"
        subtitle="Front desk payment collection terminal for suite bills, incidentals, and walk-in settlements."
        icon={CreditCard}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/receptionist/payments/history')}
            >
              View Payment History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/receptionist/payments/pending')}
            >
              Pending Settlements
            </Button>
          </div>
        }
      />

      {successReceipt && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-white animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-emerald-300">
                  Payment Successfully Cleared
                </h4>
                <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">
                  Receipt Ref: <span className="text-accent">{successReceipt.reference}</span> • ${successReceipt.amount.toLocaleString()} via {successReceipt.method}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/receptionist/payments/receipt')}
              >
                Print Receipt
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
              >
                Collect Another Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Counter Payment Terminal
                </h3>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Process instant card charges, luxury vault cash, or direct wire settlement
                </p>
              </div>
              <span className="badge badge-gold flex items-center gap-1.5 px-3 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                PCI-DSS Cleared
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Link from Open Folios */}
              {folios.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-2">
                    Quick Select Active Guest Folio (Optional)
                  </label>
                  <select
                    value={formData.folioId}
                    onChange={(e) => handleFolioSelect(e.target.value)}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  >
                    <option value="">-- Manual Settlement or Select Folio --</option>
                    {folios.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.folioNumber || f.id} — {f.guestName} (Suite {f.roomNumber}) — Outstanding: ${f.balance || 0}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Guest & Room */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Guest Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alistair Vance"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      className="luxury-input w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Suite / Chamber Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 501 or Penthouse A"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Booking Code & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Reservation Reference Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BK-2026-9021"
                    value={formData.bookingCode}
                    onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Settlement Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Amount & Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Settlement Amount (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="luxury-input w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                    Settlement Channel
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                  Internal Ledger Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="luxury-input w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/10 dark:border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  icon={RotateCcw}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  icon={CreditCard}
                >
                  Authorize & Collect Payment
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Quick Reference */}
        <div className="space-y-6">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Terminal Guidance
            </h4>
            <ul className="text-xs text-charcoal-muted dark:text-gray-400 space-y-2.5 list-disc list-inside">
              <li>Swipe or insert chip card into physical front desk POS terminal.</li>
              <li>For direct wire transfers, verify cleared bank reference before completing.</li>
              <li>Treasury cash receipts must be locked immediately in the primary counter vault.</li>
              <li>Upon settlement, the folio balance automatically updates in real time.</li>
            </ul>
          </div>

          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              Payment Shortcuts
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/receptionist/payments/history')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40 border border-primary/10 dark:border-white/5 text-xs text-left transition-colors"
              >
                <span className="text-primary dark:text-white font-medium">Payment History</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/receptionist/payments/invoice')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40 border border-primary/10 dark:border-white/5 text-xs text-left transition-colors"
              >
                <span className="text-primary dark:text-white font-medium">Generate Invoices</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/receptionist/payments/receipt')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40 border border-primary/10 dark:border-white/5 text-xs text-left transition-colors"
              >
                <span className="text-primary dark:text-white font-medium">Print Receipts</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectPaymentPage;

