import React from 'react';
import { Modal } from './Modal';
import { ModalFooter } from './ModalFooter';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmLabel,
  cancelLabel,
  variant = 'primary',
  isSubmitting = false,
}) => {
  const finalConfirmText = confirmText || confirmLabel || 'Confirm';
  const finalCancelText = cancelText || cancelLabel || 'Cancel';

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'info':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {getIcon()}
          <div className="text-sm text-charcoal dark:text-gray-300 leading-relaxed pt-1">
            {message}
          </div>
        </div>

        <ModalFooter
          onCancel={onClose}
          cancelText={finalCancelText}
          confirmText={finalConfirmText}
          confirmVariant={variant === 'warning' ? 'danger' : variant === 'info' ? 'primary' : variant}
          isSubmitting={isSubmitting}
          confirmType="button"
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

