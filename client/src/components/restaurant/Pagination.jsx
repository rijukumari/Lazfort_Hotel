import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={`px-4 py-3 border-t border-border/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted dark:text-gray-400 ${className}`}
    >
      <div>
        Showing <span className="font-semibold text-primary dark:text-white">{startIdx}</span> to{' '}
        <span className="font-semibold text-primary dark:text-white">{endIdx}</span> of{' '}
        <span className="font-semibold text-primary dark:text-white">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-border/80 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-white transition-colors"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
              page === currentPage
                ? 'bg-accent text-white dark:text-primary-950 shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-charcoal-muted dark:text-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-border/80 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-white transition-colors"
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

