import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto border-b border-border/80 dark:border-white/10 pb-px ${className}`}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'gold-gradient-bg text-primary-950 font-bold shadow-sm'
                : 'text-charcoal-muted hover:text-accent dark:hover:text-accent hover:bg-ivory dark:hover:bg-primary-800/40'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-primary-950/20 text-primary-950'
                    : 'bg-charcoal/10 dark:bg-white/10 text-charcoal-muted'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between pt-4 border-t border-border/80 dark:border-white/10 text-xs ${className}`}>
      <span className="text-charcoal-muted">
        Page <strong className="text-primary dark:text-white font-mono">{currentPage}</strong> of{' '}
        <strong className="text-primary dark:text-white font-mono">{totalPages}</strong>
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
        >
          Previous
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Tabs;

