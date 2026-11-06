import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Building,
  User,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const { folios = [], createInvoice } = useERP();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    folioId: '',
    guestName: '',
    guestEmail: '',
    companyName: '',
    guestAddress: '',
    issuedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    description: 'Luxury Suite Accommodation & Gastronomy',
    subtotal: '3500',
    taxRate: '10',
    discountAmount: '0',
    amountPaid: '0',
    notes: 'Payment due within 7 days. Statutory VAT applies.',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFolioSelect = (fId) => {
    const folio = folios.find(f => f.id === fId);
    if (folio) {
      setFormData({
        ...formData,
        folioId: folio.id,
        guestName: folio.guestName,
        guestEmail: folio.guestEmail || '',
        subtotal: (folio.subtotal || folio.grandTotal || 0).toString(),
        taxRate: '10',
        amountPaid: (folio.totalPaid || 0).toString(),
        description: `Full folio settlement for Suite ${folio.roomNumber} (${folio.bookingCode})`,
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.guestName.trim()) errs.guestName = 'Client or guest name is required';
    if (!formData.subtotal || Number(formData.subtotal) <= 0) {
      errs.subtotal = 'Valid subtotal amount is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const sub = Number(formData.subtotal) || 0;
    const rate = Number(formData.taxRate) || 10;
    const discount = Number(formData.discountAmount) || 0;
    const taxAmount = Math.round((sub * rate) / 100);
    const totalAmount = Math.max(0, sub + taxAmount - discount);
    const amountPaid = Number(formData.amountPaid) || 0;
    const balance = Math.max(0, totalAmount - amountPaid);

    createInvoice({
      folioId: formData.folioId || null,
      guestName: formData.guestName.trim(),
      guestEmail: formData.guestEmail.trim(),
      companyName: formData.companyName.trim(),
      guestAddress: formData.guestAddress.trim(),
      issuedDate: formData.issuedDate,
      dueDate: formData.dueDate,
      items: [
        {
          id: `item-${Date.now()}`,
          description: formData.description.trim(),
          quantity: 1,
          unitPrice: sub,
          totalAmount: sub,
        }
      ],
      subtotal: sub,
      taxRate: rate,
      taxAmount,
      discountAmount: discount,
      totalAmount,
      amountPaid,
      balance,
      paymentStatus: balance === 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'issued',
      status: balance === 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'issued',
      notes: formData.notes.trim(),
    });

    setIsSubmitting(false);
    showToast('Invoice Issued', 'Formal VAT invoice created and posted to billing register.', 'success');
    navigate('/hotel-admin/finance/invoices');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-border/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => navigate('/hotel-admin/finance/invoices')}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Invoices Register</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/25">
          <Sparkles className="w-3.5 h-3.5" />
          IAS Statutory VAT Invoicing
        </span>
      </div>

      {/* Main Full-Page Form Card exactly matching screenshot UI */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c121d] border border-accent/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-black text-2xl text-primary dark:text-white tracking-wide">
              Generate Formal VAT Invoice
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Official billing statement with corporate tax details & line items
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Auto-Populate From Guest Folio */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Auto-Populate From Guest Folio (Optional)
            </label>
            <select
              value={formData.folioId}
              onChange={(e) => handleFolioSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                -- Manual Direct Invoice --
              </option>
              {folios.map((f) => (
                <option key={f.id} value={f.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                  {f.bookingCode} - {f.guestName} (Suite {f.roomNumber}) — Balance: ${f.balanceDue || 0}
                </option>
              ))}
            </select>
          </div>

          {/* Row 1: Client/Guest Name & Billing Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Client / Guest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Baroness Charlotte von Berg"
                className={`w-full px-3.5 py-2.5 rounded-2xl border ${
                  formErrors.guestName ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent`}
              />
              {formErrors.guestName && <p className="text-[10px] text-rose-500 mt-1">{formErrors.guestName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Billing Email
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="billing@sovereign-holdings.ch"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Row 2: Company/Corporate Entity & Billing Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Company / Corporate Entity Name (Optional)
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Sovereign Holdings International SA"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Billing Address
              </label>
              <input
                type="text"
                value={formData.guestAddress}
                onChange={(e) => setFormData({ ...formData, guestAddress: e.target.value })}
                placeholder="e.g. Via Serlas 12, St. Moritz, Switzerland"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Row 3: Issue Date & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issuedDate}
                onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          {/* Row 4: Service / Hospitality Line Description */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Service / Hospitality Line Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          {/* Row 5: Financial Numerical Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Subtotal ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-2xl border ${
                  formErrors.subtotal ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {formErrors.subtotal && <p className="text-[10px] text-rose-500 mt-1">{formErrors.subtotal}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                VAT Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Discount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Initial Payment ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          {/* Row 6: Invoice Terms & Notes */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Invoice Terms & Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Live Calculated Invoice Summary */}
          {(() => {
            const sub = Number(formData.subtotal) || 0;
            const rate = Number(formData.taxRate) || 10;
            const discount = Number(formData.discountAmount) || 0;
            const taxAmount = Math.round((sub * rate) / 100);
            const totalAmount = Math.max(0, sub + taxAmount - discount);
            const amountPaid = Number(formData.amountPaid) || 0;
            const balance = Math.max(0, totalAmount - amountPaid);

            return (
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-mono">${sub.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
                  <span>Statutory VAT ({rate}%):</span>
                  <span className="font-mono">+${taxAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Executive Discount:</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-primary dark:text-white border-t border-border/80 dark:border-white/10 pt-2 font-serif">
                  <span>Grand Total:</span>
                  <span className="text-accent font-mono">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal-muted dark:text-gray-400">
                  <span>Advance Remitted:</span>
                  <span className="font-mono">${amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-500 border-t border-dashed border-border/80 dark:border-white/10 pt-1.5">
                  <span>Balance Due:</span>
                  <span className="font-mono font-bold">${balance.toFixed(2)}</span>
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate('/hotel-admin/finance/invoices')}
              className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Issuing Invoice...' : 'Issue Formal Tax Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoicePage;

