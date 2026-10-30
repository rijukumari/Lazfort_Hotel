import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
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

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[width];

  const posClass = position === 'right' ? 'right-0' : 'left-0';
  const slideAnimation =
    position === 'right'
      ? 'animate-in slide-in-from-right duration-300'
      : 'animate-in slide-in-from-left duration-300';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-primary/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 ${posClass} flex max-w-full`}>
        <div
          className={`w-screen ${widthClasses} bg-white dark:bg-surface-dark border-l border-border dark:border-border-dark shadow-2xl flex flex-col ${slideAnimation}`}
        >
          {title && (
            <div className="px-6 py-5 border-b border-border/80 dark:border-border-dark flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40">
              <h3 className="text-lg font-serif font-bold text-primary dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-charcoal dark:hover:text-white hover:bg-gray-100 dark:hover:bg-primary-700 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
