import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Shield, Calendar, DollarSign, Tag, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const ASSET_CATEGORIES = [
  'HVAC & Climate Control',
  'Elevators & Vertical Transport',
  'Commercial Kitchen & Culinary Equipment',
  'Laundry & Dry-Cleaning Machinery',
  'Water Filtration, Pumps & Plumbing',
  'Emergency Generators & Power Distribution',
  'Smart In-Suite Automation & Audio/Visual',
  'Spa & Wellness Infrastructure',
  'Security & Surveillance Systems',
  'Luxury Transportation & Chauffeur Fleet'
];

const LOCATIONS = [
  'Tower A - Penthouse Level',
  'Tower A - Floors 10 to 18',
  'Tower B - Executive Suites',
  'Tower C - Seaside Pavilions',
  'Central Plant & Rooftop Mechanical',
  'Sub-Basement Engineering Vault',
  'Michelin Kitchen Main Line',
  'Grand Ballroom & Conference Wing',
  'Royal Spa & Thermal Baths',
  'Private Yacht Marina & Dock'
];

const CONDITIONS = [
  { value: 'Excellent', label: 'Excellent - Optimum Performance', color: 'emerald' },
  { value: 'Good', label: 'Good - Operational with Routine Service', color: 'blue' },
  { value: 'Fair', label: 'Fair - Minor Wear, Service Scheduled', color: 'amber' },
  { value: 'Poor', label: 'Poor - Critical Attention Required', color: 'rose' }
];

const DEPRECIATION_METHODS = [
  'Straight-Line (Standard IAS-16)',
  'Double Declining Balance',
  'Sum of Years Digits',
  'Units of Production'
];

export const AddAssetModal = ({
  isOpen,
  onClose,
  assetToEdit = null,
  onSuccess
}) => {
  const { addFixedAsset, updateFixedAsset } = useERP();
  const isEditing = Boolean(assetToEdit);

  const [formData, setFormData] = useState({
    name: '',
    category: ASSET_CATEGORIES[0],
    serialNumber: '',
    location: LOCATIONS[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: '',
    salvageValue: '0',
    usefulLifeYears: '10',
    depreciationMethod: DEPRECIATION_METHODS[0],
    supplier: '',
    warrantyExpiry: '',
    condition: 'Excellent',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        name: assetToEdit.name || '',
        category: assetToEdit.category || ASSET_CATEGORIES[0],
        serialNumber: assetToEdit.serialNumber || assetToEdit.tag || '',
        location: assetToEdit.location || LOCATIONS[0],
        purchaseDate: assetToEdit.purchaseDate || new Date().toISOString().split('T')[0],
        purchaseCost: assetToEdit.purchaseCost?.toString() || assetToEdit.cost?.toString() || '',
        salvageValue: assetToEdit.salvageValue?.toString() || '0',
        usefulLifeYears: assetToEdit.usefulLifeYears?.toString() || '10',
        depreciationMethod: assetToEdit.depreciationMethod || DEPRECIATION_METHODS[0],
        supplier: assetToEdit.supplier || '',
        warrantyExpiry: assetToEdit.warrantyExpiry || '',
        condition: assetToEdit.condition || 'Excellent',
        notes: assetToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        category: ASSET_CATEGORIES[0],
        serialNumber: `SN-${Date.now().toString().slice(-6)}`,
        location: LOCATIONS[0],
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseCost: '',
        salvageValue: '0',
        usefulLifeYears: '10',
        depreciationMethod: DEPRECIATION_METHODS[0],
        supplier: '',
        warrantyExpiry: '',
        condition: 'Excellent',
        notes: ''
      });
    }
    setErrors({});
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Asset Name is required';
    if (!formData.purchaseCost || isNaN(formData.purchaseCost) || Number(formData.purchaseCost) <= 0) {
      errs.purchaseCost = 'Valid purchase cost is required';
    }
    if (!formData.purchaseDate) errs.purchaseDate = 'Purchase date is required';
    if (!formData.usefulLifeYears || isNaN(formData.usefulLifeYears) || Number(formData.usefulLifeYears) <= 0) {
      errs.usefulLifeYears = 'Useful life in years must be greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      serialNumber: formData.serialNumber.trim(),
      location: formData.location,
      purchaseDate: formData.purchaseDate,
      purchaseCost: Number(formData.purchaseCost),
      salvageValue: Number(formData.salvageValue || 0),
      usefulLifeYears: Number(formData.usefulLifeYears),
      depreciationMethod: formData.depreciationMethod,
      supplier: formData.supplier.trim(),
      warrantyExpiry: formData.warrantyExpiry,
      condition: formData.condition,
      notes: formData.notes.trim()
    };

    if (isEditing && assetToEdit?.id) {
      updateFixedAsset(assetToEdit.id, payload);
    } else {
      addFixedAsset(payload);
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-primary-900 border border-accent/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                {isEditing ? 'Modify Capital Asset Record' : 'Register New Fixed Capital Asset'}
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                IAS-16 Fixed Asset Compliance & Luxury Property Asset Registry
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
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Asset Name & Serial Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Asset Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Carrier Centrifugal Chiller 450T"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.name ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent`}
              />
              {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Serial / Tag Number
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g. SN-CHILLER-091"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Asset Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              >
                {ASSET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Physical Location / Facility Wing
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purchase Cost, Salvage Value & Useful Life */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Purchase Cost ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchaseCost}
                onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                placeholder="45000"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.purchaseCost ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {errors.purchaseCost && <p className="text-[10px] text-rose-500 mt-1">{errors.purchaseCost}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Salvage Residual Value ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salvageValue}
                onChange={(e) => setFormData({ ...formData, salvageValue: e.target.value })}
                placeholder="5000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Useful Life (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.usefulLifeYears}
                onChange={(e) => setFormData({ ...formData, usefulLifeYears: e.target.value })}
                placeholder="10"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.usefulLifeYears ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {errors.usefulLifeYears && <p className="text-[10px] text-rose-500 mt-1">{errors.usefulLifeYears}</p>}
            </div>
          </div>

          {/* Depreciation Method & Purchase Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Depreciation Schedule Method
              </label>
              <select
                value={formData.depreciationMethod}
                onChange={(e) => setFormData({ ...formData, depreciationMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              >
                {DEPRECIATION_METHODS.map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Commissioning / Purchase Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Supplier & Warranty Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Authorized Supplier / Manufacturer
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g. Carrier HVAC International Monaco"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Operating Condition */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Current Engineering Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITIONS.map((cond) => {
                const isSelected = formData.condition === cond.value;
                return (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond.value })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/20 text-accent shadow-sm'
                        : 'border-border dark:border-white/10 hover:border-accent/40 text-charcoal dark:text-gray-300'
                    }`}
                  >
                    {cond.value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Technical Specifications & Maintenance Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter routine maintenance interval, manufacturer contact, or critical load parameters..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-primary-950/50 text-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Asset Modifications' : 'Commit Fixed Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;

