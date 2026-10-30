import React from 'react';
import { Loader2 } from 'lucide-react';

export const ModalFooter = ({
  onCancel,
  cancelText = 'Cancel',
  confirmText = 'Confirm & Onboard',
  confirmVariant = 'gold',
  isSubmitting = false,
  confirmDisabled = false,
  confirmType = 'submit',
  onConfirm,
  children,
  className = '',
}) => {
  const getConfirmStyle = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20';
      case 'primary':
        return 'bg-primary-900 hover:bg-primary-800 text-gold-300 border border-gold-500/30';
      case 'gold':
      default:
        return 'gold-gradient-bg text-primary-950 font-bold hover:brightness-105 active:scale-[0.98] shadow-md shadow-accent/20';
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 pt-4 mt-6 border-t border-border/80 dark:border-border-dark ${className}`}
    >
      {children}
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-border dark:border-border-dark text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelText}
      </button>

      <button
        type={confirmType}
        onClick={confirmType === 'button' ? onConfirm : undefined}
        disabled={confirmDisabled || isSubmitting}
        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getConfirmStyle()}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Processing...</span>
          </>
        ) : (
          <span>{confirmText}</span>
        )}
      </button>
    </div>
  );
};

export default ModalFooter;

