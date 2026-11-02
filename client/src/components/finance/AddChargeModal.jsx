import React, { useState } from 'react';
import { X, Plus, DollarSign, Tag, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const CHARGE_CATEGORIES = [
  { value: 'room_charge', label: 'Room & Suite Accommodation' },
  { value: 'restaurant', label: 'Michelin Dining & In-Suite Gastronomy' },
  { value: 'spa', label: 'Royal Spa, Thermal Baths & Wellness' },
  { value: 'minibar', label: 'Private Bar, Champagne & Caviar Restock' },
  { value: 'concierge', label: 'VIP Chauffeur, Yacht Charter & Concierge' },
  { value: 'laundry', label: 'Dry Cleaning & Express Valet Service' },
  { value: 'miscellaneous', label: 'Incidental / Custom Charge' },
];

export const AddChargeModal = ({ isOpen, onClose, folio, onSuccess }) => {
  const { postFolioCharge } = useERP();

  const [formData, setFormData] = useState({
    category: 'restaurant',
    description: '',
    quantity: '1',
    unitPrice: '',
    taxRate: '10',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !folio) return null;

  const validate = () => {
    const errs = {};
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
      errs.unitPrice = 'Valid price is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const qty = Number(formData.quantity) || 1;
    const price = Number(formData.unitPrice) || 0;
    const subtotal = qty * price;
    const taxRate = Number(formData.taxRate) || 10;
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const totalAmount = subtotal + taxAmount;

    postFolioCharge(folio.id, {
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      description: formData.description.trim(),
      quantity: qty,
      unitPrice: price,
      taxAmount,
      totalAmount,
      postedBy: 'Finance Controller',
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Post Charge to Folio
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Suite {folio.roomNumber} • {folio.guestName} ({folio.bookingCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Charge Department / Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/40 dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              {CHARGE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Charge Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Vintage Dom Pérignon Room Service Service"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.description ? 'border-rose-500' : 'border-border dark:border-white/10'
              } bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent`}
            />
            {errors.description && <p className="text-[10px] text-rose-500 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Unit Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="480"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.unitPrice ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {errors.unitPrice && <p className="text-[10px] text-rose-500 mt-1">{errors.unitPrice}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                VAT Tax Rate (%)
              </label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
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
              <span>Post Charge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChargeModal;

