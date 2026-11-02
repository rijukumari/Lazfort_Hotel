import React, { useState, useEffect } from 'react';
import { X, Truck, Save, Building, Mail, Phone, MapPin } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const SUPPLIER_CATEGORIES = [
  'Food & Beverage Purveyor',
  'Fine Wine & Spirits',
  'Housekeeping & Linen',
  'Guest Amenities',
  'Engineering & Maintenance',
  'Spa & Cosmetics',
  'Luxury Florals & Decor',
  'Print & Stationery',
];

export const SupplierFormModal = ({
  isOpen,
  onClose,
  supplier = null,
  onSuccess,
}) => {
  const { addSupplier, updateSupplier } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: 'Guest Amenities',
    status: 'active',
    paymentTerms: 'Net 30',
    leadTimeDays: 3,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        code: supplier.code || '',
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        category: Array.isArray(supplier.categories) ? supplier.categories[0] : (supplier.category || 'Guest Amenities'),
        status: supplier.status || 'active',
        paymentTerms: supplier.paymentTerms || 'Net 30',
        leadTimeDays: supplier.leadTimeDays || 3,
      });
    } else {
      setFormData({
        name: '',
        code: `SUP-${Math.floor(100 + Math.random() * 900)}`,
        contactPerson: '',
        email: '',
        phone: '+377 98 00 12 00',
        address: 'Quai Jean-Charles Rey, 98000 Monaco',
        category: 'Food & Beverage Purveyor',
        status: 'active',
        paymentTerms: 'Net 30',
        leadTimeDays: 3,
      });
    }
    setError('');
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Supplier name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Contact email is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    let res;
    if (supplier) {
      res = updateSupplier(supplier.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        categories: [formData.category],
        category: formData.category,
        status: formData.status,
        paymentTerms: formData.paymentTerms,
        leadTimeDays: Number(formData.leadTimeDays),
      });
    } else {
      res = addSupplier({
        name: formData.name.trim(),
        code: formData.code.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        categories: [formData.category],
        category: formData.category,
        status: formData.status,
        paymentTerms: formData.paymentTerms,
        leadTimeDays: Number(formData.leadTimeDays),
      });
    }

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.message || 'Failed to save supplier.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-xl bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                {supplier ? 'Edit Approved Purveyor' : 'Onboard New Approved Supplier'}
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Verified luxury hotel supply chain partner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Supplier / Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Petrossian Paris S.A."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Supplier Code / ID
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="SUP-001"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Armand Petrossian"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="procurement@petrossian.fr"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 1 44 11 32 22"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Supplied Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {SUPPLIER_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Lead Time (Days)
              </label>
              <input
                type="number"
                min="1"
                value={formData.leadTimeDays}
                onChange={e => setFormData({ ...formData, leadTimeDays: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Supplier Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="active">Active / Approved</option>
                <option value="inactive">Inactive / Suspended</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Billing & Warehouse Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 18 Boulevard de la Madeleine, 75009 Paris, France"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-border dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-primary dark:hover:text-white border border-border dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-3d px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-gold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : supplier ? 'Update Supplier' : 'Register Supplier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierFormModal;

