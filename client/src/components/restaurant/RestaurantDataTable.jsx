import React from 'react';
import { EmptyState, LoadingState } from './EmptyState';
import { Pagination } from './Pagination';

export const RestaurantDataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items matching your criteria.',
  emptyActionLabel,
  onEmptyAction,
  currentPage = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/70 dark:bg-[#101725]/80 backdrop-blur-xl overflow-hidden shadow-sm">
        <LoadingState />
      </div>
    );
  }

  const itemsCount = totalItems !== undefined ? totalItems : data.length;
  const totalPages = Math.ceil(itemsCount / pageSize);

  // Client-side slice if onPageChange is provided and data has all items
  const displayData =
    onPageChange && totalItems === undefined
      ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : data;

  return (
    <div
      className={`rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl overflow-hidden shadow-sm ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-white/[0.02] text-[11px] font-mono font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-white/5 text-xs text-charcoal/90 dark:text-gray-200">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              displayData.map((row, rIdx) => (
                <tr
                  key={row.id || row.code || rIdx}
                  className="hover:bg-accent/[0.03] dark:hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col, cIdx) => (
                    <td key={col.key || cIdx} className={`px-4 py-3.5 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row, rIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && itemsCount > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={itemsCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default RestaurantDataTable;
