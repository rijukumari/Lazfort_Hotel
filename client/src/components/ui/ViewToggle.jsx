import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

/**
 * ViewToggle Component
 * Reusable luxury toggle button for switching between Grid View and List View.
 * Matches Lazfort luxury aesthetic with gold accents and smooth transitions.
 *
 * @param {'grid' | 'list'} viewMode Current active view
 * @param {(mode: 'grid' | 'list') => void} onViewChange Callback when toggled
 * @param {string} [className] Optional wrapper classes
 */
export const ViewToggle = ({
  viewMode = 'list',
  onViewChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center bg-ivory dark:bg-white/5 border border-border dark:border-white/10 rounded-xl p-1 shadow-inner ${className}`}
      role="group"
      aria-label="View layout toggle"
    >
      <button
        type="button"
        onClick={() => onViewChange && onViewChange('grid')}
        className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
          viewMode === 'grid'
            ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold scale-105'
            : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
        }`}
        title="Switch to Grid View"
        aria-pressed={viewMode === 'grid'}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onViewChange && onViewChange('list')}
        className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
          viewMode === 'list'
            ? 'gold-gradient-bg text-primary-950 font-bold shadow-gold scale-105'
            : 'text-charcoal-muted hover:text-charcoal dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
        }`}
        title="Switch to List View"
        aria-pressed={viewMode === 'list'}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ViewToggle;

