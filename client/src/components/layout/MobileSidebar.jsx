import React from 'react';
import { Sidebar } from './Sidebar';
import { X } from 'lucide-react';

export const MobileSidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/70 dark:bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="relative w-72 max-w-xs shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
          {/* Close button float */}
          <button
            onClick={onClose}
            className="absolute top-4 right-3 z-50 p-1.5 rounded-xl bg-primary-800 text-gray-300 hover:text-white transition-colors"
            aria-label="Close mobile navigation"
          >
            <X className="w-5 h-5" />
          </button>

          <Sidebar
            isCollapsed={false}
            onToggleCollapse={() => {}}
            onNavigateMobile={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;

