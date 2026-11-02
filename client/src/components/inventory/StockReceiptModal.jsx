import React, { useState } from 'react';
import { X, ArrowDownRight, PackagePlus, Save, Building } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const StockReceiptModal = ({
  isOpen,
  onClose,
  preselectedItem = null,
  onSuccess,
}) => {
  const { inventoryItems = [], recordStockMovement, suppliers = [] } = useERP();

  const [itemId, setItemId] = useState(preselectedItem?.id || inventoryItems[0]?.id || '');
  const [quantity, setQuantity] = useState(25);
  const [referenceNumber, setReferenceNumber] = useState(`PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [department, setDepartment] = useState('Central Stores');
  const [reason, setReason] = useState('Scheduled supplier restock shipment');
  const [performedBy, setPerformedBy] = useState('Chief Storekeeper');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedItem = inventoryItems.find(i => i.id === itemId) || preselectedItem || inventoryItems[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) {
      setError('Please select a valid inventory SKU.');
      return;
    }
    if (Number(quantity) <= 0) {
      setError('Received quantity must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = recordStockMovement({
      itemId: selectedItem.id,
      movementType: 'Stock In',
      type: 'receipt',
      quantity: Number(quantity),
      referenceNumber: referenceNumber.trim(),
      department: department.trim(),
      reason: reason.trim(),
      performedBy: performedBy.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess(res.message);
      onClose();
    } else {
      setError(res.message || 'Failed to record receipt.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-lg bg-white dark:bg-[#111827] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border dark:border-white/10 flex items-center justify-between bg-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                Record Stock In (Goods Receipt)
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Increase verified warehouse stock and generate audit ledger entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Select Inventory Item *
            </label>
            <select
              value={selectedItem?.id || itemId}
              onChange={e => setItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
            >
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.sku} — {item.name} (Current: {item.currentStock ?? 0} {item.unitOfMeasure || 'Units'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Quantity Received *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                PO / Reference #
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                placeholder="PO-2026-081"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Receiving Department
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="Central Stores / Kitchen"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Receiver (Staff Name)
              </label>
              <input
                type="text"
                value={performedBy}
                onChange={e => setPerformedBy(e.target.value)}
                placeholder="Chief Storekeeper"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Receipt Notes / Vendor Shipment Info
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Weekly fine foods delivery from Petrossian Paris"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
            />
          </div>

          {/* Quick Preview Card */}
          {selectedItem && (
            <div className="p-3.5 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/80 dark:border-white/10 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">Current Stock</p>
                <p className="font-semibold text-primary dark:text-white">
                  {selectedItem.currentStock ?? 0} {selectedItem.unitOfMeasure || 'Units'}
                </p>
              </div>
              <ArrowDownRight className="w-4 h-4 text-emerald-500" />
              <div className="text-right">
                <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">New Resulting Stock</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  {(selectedItem.currentStock ?? 0) + Number(quantity || 0)} {selectedItem.unitOfMeasure || 'Units'}
                </p>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-border dark:border-white/10 flex items-center justify-end gap-3">
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
              <span>{isSubmitting ? 'Recording Receipt...' : 'Confirm Goods Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockReceiptModal;

