import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to permanently remove this record? This action cannot be undone.',
  confirmText = 'Delete Permanently',
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury-3d w-full max-w-md bg-white dark:bg-[#111827] border border-rose-500/30 rounded-3xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-charcoal-muted hover:text-primary dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
            {message}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-primary dark:hover:text-white border border-border dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;

