import React, { useState } from 'react';
import { X, ArrowUpRight, PackageMinus, Save, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const StockIssueModal = ({
  isOpen,
  onClose,
  preselectedItem = null,
  onSuccess,
}) => {
  const { inventoryItems = [], recordStockMovement } = useERP();

  const [itemId, setItemId] = useState(preselectedItem?.id || inventoryItems[0]?.id || '');
  const [quantity, setQuantity] = useState(5);
  const [referenceNumber, setReferenceNumber] = useState(`ISS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [department, setDepartment] = useState('Fine Dining Kitchen');
  const [reason, setReason] = useState('Operational requisition for suite service');
  const [performedBy, setPerformedBy] = useState('Central Storekeeper');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedItem = inventoryItems.find(i => i.id === itemId) || preselectedItem || inventoryItems[0];
  const maxAvailable = selectedItem ? Number(selectedItem.currentStock ?? selectedItem.availableQuantity ?? 0) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) {
      setError('Please select a valid inventory SKU.');
      return;
    }
    const numQty = Number(quantity);
    if (numQty <= 0) {
      setError('Issued quantity must be greater than 0.');
      return;
    }
    if (numQty > maxAvailable) {
      setError(`Cannot issue ${numQty} units. Maximum available stock is ${maxAvailable}.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = recordStockMovement({
      itemId: selectedItem.id,
      movementType: 'Stock Out',
      type: 'issue',
      quantity: numQty,
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
      setError(res.message || 'Failed to record stock issue.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-lg bg-white dark:bg-[#101722] border border-border/80 dark:border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-blue-500/10 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <PackageMinus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                Record Stock Out (Departmental Issue)
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Disburse inventory items to departments and record audit ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
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
                  {item.sku} — {item.name} (Available: {item.currentStock ?? 0} {item.unitOfMeasure || 'Units'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Quantity to Issue *
                </label>
                <span className="text-[10px] text-charcoal-muted font-mono">
                  Max: {maxAvailable}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max={maxAvailable}
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Requisition / Ref #
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                placeholder="ISS-2026-042"
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
                placeholder="e.g., Fine Dining Kitchen, Housekeeping"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Disbursed By (Staff)
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
              Reason / Requisition Note
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Fulfilling Presidential Suite catering banquet"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
            />
          </div>

          {/* Quick Preview Card */}
          {selectedItem && (
            <div className="p-3.5 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/80 dark:border-white/10 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">Current Stock</p>
                <p className="font-semibold text-primary dark:text-white">
                  {maxAvailable} {selectedItem.unitOfMeasure || 'Units'}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <div className="text-right">
                <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">Remaining Balance</p>
                <p className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
                  {Math.max(0, maxAvailable - Number(quantity || 0))} {selectedItem.unitOfMeasure || 'Units'}
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
              disabled={isSubmitting || maxAvailable <= 0}
              className="btn-primary-3d px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-gold disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording Issue...' : 'Confirm Stock Issue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockIssueModal;

