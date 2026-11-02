import React from 'react';
import { X, History, FileText, ArrowRight, Calendar, User, Building, Tag } from 'lucide-react';
import { InventoryStatusBadge } from './InventoryStatusBadge';

export const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction = null,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-lg bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-border dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base text-primary dark:text-white">
                  Movement Audit Folio
                </h2>
                <span className="font-mono text-xs font-bold text-accent">
                  {transaction.transactionId || transaction.id}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Official Lazfort Inventory Central Stores Log
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-ivory/60 dark:bg-white/[0.02] border border-border/80 dark:border-white/10">
            <div>
              <p className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">SKU / Item Name</p>
              <p className="font-semibold text-primary dark:text-white text-sm">
                {transaction.itemName || transaction.name}
              </p>
              <p className="text-[11px] font-mono text-accent">{transaction.sku || transaction.itemCode}</p>
            </div>
            <InventoryStatusBadge status={transaction.movementType || transaction.type} />
          </div>

          {/* Quantity Flow Card */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-accent/5 border border-accent/20 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-charcoal-muted">Previous</p>
              <p className="font-mono font-bold text-base text-primary dark:text-white">
                {transaction.previousQuantity ?? transaction.previousStock ?? 0}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold text-accent">Change</span>
              <span className="font-mono font-bold text-sm text-accent">
                {transaction.quantityChanged ?? transaction.quantity ?? 0}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-charcoal-muted">New Stock</p>
              <p className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                {transaction.newQuantity ?? transaction.newStock ?? 0}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border/60 dark:border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-charcoal-muted flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-accent" /> Reference Number
              </span>
              <p className="font-mono font-semibold text-primary dark:text-white">
                {transaction.referenceNumber || 'N/A'}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/60 dark:border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-charcoal-muted flex items-center gap-1.5">
                <Building className="w-3 h-3 text-accent" /> Department
              </span>
              <p className="font-semibold text-primary dark:text-white">
                {transaction.department || 'Central Stores'}
                {transaction.destinationDepartment && (
                  <span className="block text-[10px] text-accent font-normal">
                    → {transaction.destinationDepartment}
                  </span>
                )}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/60 dark:border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-charcoal-muted flex items-center gap-1.5">
                <User className="w-3 h-3 text-accent" /> Performed By
              </span>
              <p className="font-semibold text-primary dark:text-white">
                {transaction.performedBy || 'Storekeeper'}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/60 dark:border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-charcoal-muted flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-accent" /> Timestamp
              </span>
              <p className="font-mono text-primary dark:text-white text-[11px]">
                {transaction.transactionDate || (transaction.timestamp ? transaction.timestamp.slice(0, 16).replace('T', ' ') : 'N/A')}
              </p>
            </div>
          </div>

          {/* Reason / Notes */}
          {transaction.reason && (
            <div className="p-3.5 rounded-xl bg-ivory/40 dark:bg-white/[0.02] border border-border/60 dark:border-white/5 space-y-1 text-xs">
              <p className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">
                Operation Justification & Notes:
              </p>
              <p className="text-charcoal dark:text-gray-300">
                {transaction.reason}
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-border dark:border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary-3d px-5 py-2 rounded-xl text-xs font-semibold text-white"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;

