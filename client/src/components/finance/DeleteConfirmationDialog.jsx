import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you certain you wish to purge this record? This action cannot be reversed.',
  itemName = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-primary-900 border border-rose-500/40 rounded-3xl shadow-2xl p-6 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
            {title}
          </h3>
          {itemName && (
            <p className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
              "{itemName}"
            </p>
          )}
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-rose-600 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Deletion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;

