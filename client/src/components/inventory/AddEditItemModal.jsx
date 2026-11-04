import React, { useState, useEffect } from 'react';
import { X, Boxes, Save, Sparkles, Building2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const DEFAULT_CATEGORIES = [
  'Guest Amenities',
  'Food & Beverage',
  'Housekeeping & Linen',
  'Fine Wine & Spirits',
  'Engineering & Maintenance',
  'Spa & Wellness',
  'Front Office & Stationery',
];

const DEFAULT_UNITS = ['Units', 'Boxes', 'Bottles', 'Sets', 'Kg', 'Liters', 'Packs', 'Rolls'];

export const AddEditItemModal = ({
  isOpen,
  onClose,
  item = null,
  onSuccess,
}) => {
  const { addInventoryItem, updateInventoryItem, suppliers = [] } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    itemCode: '',
    category: 'Guest Amenities',
    description: '',
    supplier: '',
    unit: 'Units',
    purchasePrice: 50,
    openingStock: 25,
    minimumStock: 10,
    storageLocation: 'Main Store Room Wing A',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        itemCode: item.sku || item.itemCode || '',
        category: item.category || 'Guest Amenities',
        description: item.description || '',
        supplier: item.supplier || item.supplierName || (suppliers[0]?.name || ''),
        unit: item.unit || item.unitOfMeasure || 'Units',
        purchasePrice: item.purchasePrice ?? item.unitCost ?? item.unitPrice ?? 0,
        openingStock: item.currentStock ?? item.availableQuantity ?? 0,
        minimumStock: item.minimumStock ?? item.minStock ?? 10,
        storageLocation: item.storageLocation || item.location || '',
      });
    } else {
      setFormData({
        name: '',
        itemCode: `INV-${Math.floor(1000 + Math.random() * 9000)}-LX`,
        category: 'Guest Amenities',
        description: '',
        supplier: suppliers[0]?.name || 'Petrossian Paris',
        unit: 'Units',
        purchasePrice: 45,
        openingStock: 30,
        minimumStock: 10,
        storageLocation: 'Central Vault Zone A',
      });
    }
    setError('');
  }, [item, isOpen, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Item Name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (item) {
        updateInventoryItem(item.id, {
          name: formData.name.trim(),
          itemCode: formData.itemCode.trim(),
          category: formData.category,
          description: formData.description.trim(),
          supplier: formData.supplier,
          supplierName: formData.supplier,
          unit: formData.unit,
          unitOfMeasure: formData.unit,
          purchasePrice: Number(formData.purchasePrice),
          unitCost: Number(formData.purchasePrice),
          currentStock: Number(formData.openingStock),
          availableQuantity: Number(formData.openingStock),
          minimumStock: Number(formData.minimumStock),
          storageLocation: formData.storageLocation.trim(),
          location: formData.storageLocation.trim(),
        });
      } else {
        addInventoryItem({
          name: formData.name.trim(),
          itemCode: formData.itemCode.trim(),
          category: formData.category,
          description: formData.description.trim(),
          supplier: formData.supplier,
          supplierName: formData.supplier,
          unit: formData.unit,
          unitOfMeasure: formData.unit,
          purchasePrice: Number(formData.purchasePrice),
          unitCost: Number(formData.purchasePrice),
          openingStock: Number(formData.openingStock),
          currentStock: Number(formData.openingStock),
          availableQuantity: Number(formData.openingStock),
          minimumStock: Number(formData.minimumStock),
          storageLocation: formData.storageLocation.trim(),
          location: formData.storageLocation.trim(),
        });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError('An error occurred while saving the inventory item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-2xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-900/60 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                {item ? 'Edit Inventory SKU' : 'Register New Item in Catalog'}
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Lazfort Sovereign Central Stores & Provisions Catalog
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-accent hover:bg-ivory dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Frette 1000TC Egyptian Cotton Sheet"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Item Code / SKU *
              </label>
              <input
                type="text"
                required
                value={formData.itemCode}
                onChange={e => setFormData({ ...formData, itemCode: e.target.value })}
                placeholder="e.g., HK-LIN-1000"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Approved Supplier
              </label>
              <select
                value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {suppliers.length > 0 ? (
                  suppliers.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Petrossian Paris">Petrossian Paris Caviar & Fine Provisions</option>
                    <option value="Frette Milan">Frette Luxury Linens Milan</option>
                    <option value="Acqua Di Parma">Acqua Di Parma Amenity Collection</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Unit of Measure
              </label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                {DEFAULT_UNITS.map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Purchase Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.purchasePrice}
                onChange={e => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                {item ? 'Available Stock Quantity' : 'Opening Stock Quantity'}
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.openingStock}
                onChange={e => setFormData({ ...formData, openingStock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Minimum Stock Level (Alert Threshold)
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.minimumStock}
                onChange={e => setFormData({ ...formData, minimumStock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Storage Location / Depot
            </label>
            <input
              type="text"
              value={formData.storageLocation}
              onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
              placeholder="e.g., Cold Cellar Vault B, Shelf 4"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specifications, supplier contract details, or storage guidelines..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none resize-none"
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
              <span>{isSubmitting ? 'Saving Item...' : item ? 'Update Item' : 'Save Item to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditItemModal;

