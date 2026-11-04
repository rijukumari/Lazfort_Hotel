import React, { useState } from 'react';
import { X, Plus, FileText, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const { folios = [], createInvoice } = useERP();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

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
    if (!formData.guestName.trim()) errs.guestName = 'Guest or client name is required';
    if (!formData.subtotal || Number(formData.subtotal) <= 0) {
      errs.subtotal = 'Valid subtotal is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

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

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Generate Formal VAT Invoice
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Official billing statement with corporate tax details & line items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto no-scrollbar p-6 space-y-4 flex-1">
          {/* Quick Folio Link */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Auto-Populate From Guest Folio (Optional)
            </label>
            <select
              value={formData.folioId}
              onChange={(e) => handleFolioSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">-- Manual Direct Invoice --</option>
              {folios.map((f) => (
                <option key={f.id} value={f.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                  {f.bookingCode} - {f.guestName} (Suite {f.roomNumber}) — Balance: ${f.balanceDue || 0}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Client / Guest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Baroness Charlotte von Berg"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.guestName ? 'border-rose-500' : 'border-border dark:border-white/10'
                  } bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent`}
              />
              {errors.guestName && <p className="text-[10px] text-rose-500 mt-1">{errors.guestName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Billing Email
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                placeholder="billing@sovereign-holdings.ch"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Company / Corporate Entity Name (Optional)
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Sovereign Holdings International SA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Billing Address
              </label>
              <input
                type="text"
                value={formData.guestAddress}
                onChange={(e) => setFormData({ ...formData, guestAddress: e.target.value })}
                placeholder="e.g. Via Serlas 12, St. Moritz, Switzerland"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issuedDate}
                onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Service / Hospitality Line Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Subtotal ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.subtotal ? 'border-rose-500' : 'border-border dark:border-white/10'
                  } bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {errors.subtotal && <p className="text-[10px] text-rose-500 mt-1">{errors.subtotal}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                VAT Rate (%)
              </label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Discount ($)
              </label>
              <input
                type="number"
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Initial Payment ($)
              </label>
              <input
                type="number"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Invoice Terms & Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue Tax Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;

