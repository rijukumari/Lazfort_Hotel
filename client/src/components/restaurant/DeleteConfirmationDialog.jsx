import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to permanently delete this record? This action cannot be undone.',
  confirmText = 'Delete Record',
  cancelText = 'Cancel',
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#101725] rounded-3xl border border-rose-500/30 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
          title="Close Dialog"
          aria-label="Close Dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Irreversible Operational Directive
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-charcoal/90 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
          {itemName && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 truncate">
              Target: {itemName}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;

