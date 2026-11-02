import React, { useState } from 'react';
import { X, Sliders, RefreshCw, Save, ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

const DEPARTMENTS = [
  'Central Stores',
  'Fine Dining Kitchen',
  'Housekeeping Operations',
  'Engineering & Maintenance',
  'Front Office Concierge',
  'Spa & Thermal Sanctuary',
  'Executive Directorate',
];

export const StockAdjustmentModal = ({
  isOpen,
  onClose,
  preselectedItem = null,
  onSuccess,
}) => {
  const { inventoryItems = [], recordStockMovement } = useERP();

  const [itemId, setItemId] = useState(preselectedItem?.id || inventoryItems[0]?.id || '');
  const [movementMode, setMovementMode] = useState('Adjustment'); // 'Adjustment', 'Department Transfer', 'Return'
  const [newCount, setNewCount] = useState('');
  const [transferQty, setTransferQty] = useState(5);
  const [fromDept, setFromDept] = useState('Central Stores');
  const [toDept, setToDept] = useState('Housekeeping Operations');
  const [reason, setReason] = useState('Periodic physical stock audit variance reconciliation');
  const [referenceNumber, setReferenceNumber] = useState(`ADJ-${Math.floor(10000 + Math.random() * 90000)}`);
  const [performedBy, setPerformedBy] = useState('Head of Procurement');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedItem = inventoryItems.find(i => i.id === itemId) || preselectedItem || inventoryItems[0];
  const currentStock = selectedItem ? Number(selectedItem.currentStock ?? selectedItem.availableQuantity ?? 0) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) {
      setError('Please select an item.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    let res;
    if (movementMode === 'Adjustment') {
      const targetCount = newCount !== '' ? Number(newCount) : currentStock;
      const diff = Math.abs(targetCount - currentStock);
      res = recordStockMovement({
        itemId: selectedItem.id,
        movementType: 'Adjustment',
        newQuantity: targetCount,
        quantity: diff,
        quantityChanged: diff,
        reason: reason.trim() || 'Physical inventory audit variance adjustment',
        referenceNumber: referenceNumber.trim(),
        department: fromDept,
        performedBy: performedBy.trim(),
      });
    } else if (movementMode === 'Department Transfer') {
      const numQty = Number(transferQty);
      if (numQty <= 0) {
        setError('Transfer quantity must be greater than 0.');
        setIsSubmitting(false);
        return;
      }
      if (fromDept === toDept) {
        setError('Source and Destination departments must be different.');
        setIsSubmitting(false);
        return;
      }
      res = recordStockMovement({
        itemId: selectedItem.id,
        movementType: 'Department Transfer',
        quantity: numQty,
        quantityChanged: numQty,
        reason: `Transfer from ${fromDept} to ${toDept}. Notes: ${reason.trim()}`,
        referenceNumber: referenceNumber.trim(),
        department: fromDept,
        destinationDepartment: toDept,
        performedBy: performedBy.trim(),
      });
    } else {
      // Return
      const numQty = Number(transferQty);
      res = recordStockMovement({
        itemId: selectedItem.id,
        movementType: 'Return',
        quantity: numQty,
        quantityChanged: numQty,
        reason: `Vendor return for defective or expired batch. Ref: ${referenceNumber.trim()}. Notes: ${reason.trim()}`,
        referenceNumber: referenceNumber.trim(),
        department: fromDept,
        performedBy: performedBy.trim(),
      });
    }

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess(res.message);
      onClose();
    } else {
      setError(res.message || 'Operation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-lg bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border dark:border-white/10 flex items-center justify-between bg-accent/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                Stock Adjustment & Department Transfer
              </h2>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Reconcile physical inventory counts, inter-department transfers, or returns
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

        {/* Mode Selector */}
        <div className="p-4 bg-ivory/50 dark:bg-white/[0.02] border-b border-border/80 dark:border-white/10 flex items-center justify-center gap-2">
          {[
            { id: 'Adjustment', label: 'Inventory Count Audit', icon: Sliders },
            { id: 'Department Transfer', label: 'Dept Transfer', icon: ArrowLeftRight },
            { id: 'Return', label: 'Vendor Return', icon: RotateCcw },
          ].map(m => {
            const Icon = m.icon;
            const active = movementMode === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setMovementMode(m.id);
                  if (m.id === 'Department Transfer') {
                    setReferenceNumber(`TRF-${Math.floor(10000 + Math.random() * 90000)}`);
                    setReason('Inter-department stock transfer');
                  } else if (m.id === 'Return') {
                    setReferenceNumber(`RET-${Math.floor(10000 + Math.random() * 90000)}`);
                    setReason('Damaged or expired goods return to supplier');
                  } else {
                    setReferenceNumber(`ADJ-${Math.floor(10000 + Math.random() * 90000)}`);
                    setReason('Periodic physical stock audit variance reconciliation');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-charcoal-muted dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-white/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
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

          {movementMode === 'Adjustment' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Current Counted Quantity
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentStock} ${selectedItem?.unitOfMeasure || 'Units'}`}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 text-charcoal-muted font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Actual Physical Count *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newCount}
                  onChange={e => setNewCount(e.target.value)}
                  placeholder={`e.g., ${currentStock}`}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none font-bold"
                />
              </div>
            </div>
          ) : movementMode === 'Department Transfer' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                    Source Department
                  </label>
                  <select
                    value={fromDept}
                    onChange={e => setFromDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                    Destination Department
                  </label>
                  <select
                    value={toDept}
                    onChange={e => setToDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                    Transfer Quantity *
                  </label>
                  <span className="text-[10px] text-charcoal-muted">Max: {currentStock}</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max={currentStock}
                  required
                  value={transferQty}
                  onChange={e => setTransferQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  Return Quantity to Supplier *
                </label>
                <span className="text-[10px] text-charcoal-muted">Available: {currentStock}</span>
              </div>
              <input
                type="number"
                min="1"
                max={currentStock}
                required
                value={transferQty}
                onChange={e => setTransferQty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Audit Reference #
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                Authorized By
              </label>
              <input
                type="text"
                value={performedBy}
                onChange={e => setPerformedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
              Audit Justification / Variance Reason
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Physical cycle count variance approved by finance"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
            />
          </div>

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
              <span>{isSubmitting ? 'Processing...' : `Confirm ${movementMode}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;

