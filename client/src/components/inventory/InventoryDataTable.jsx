import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export const InventoryDataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  pageSize = 10,
  emptyMessage = 'No inventory records found matching criteria.',
  emptyAction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const comp = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [data, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="card-luxury-3d rounded-2xl border border-border dark:border-white/10 bg-white/90 dark:bg-[#111827]/90 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-white/[0.02]">
              {columns.map(col => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-4 py-3.5 text-[11px] uppercase tracking-wider font-bold text-charcoal-muted dark:text-gray-400 select-none ${
                      col.sortable ? 'cursor-pointer hover:text-accent transition-colors' : ''
                    } ${col.headerClassName || ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <div className="flex flex-col text-[8px] text-gray-400">
                          <ChevronUp
                            className={`w-3 h-3 -mb-1 ${
                              isSorted && sortDirection === 'asc' ? 'text-accent font-bold' : 'opacity-40'
                            }`}
                          />
                          <ChevronDown
                            className={`w-3 h-3 ${
                              isSorted && sortDirection === 'desc' ? 'text-accent font-bold' : 'opacity-40'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-white/5">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-charcoal-muted dark:text-gray-400">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium max-w-sm">{emptyMessage}</p>
                    {emptyAction && <div className="pt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row[keyField] || idx}
                  className="hover:bg-ivory/40 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className={`px-4 py-3.5 text-xs ${col.className || ''}`}>
                      {col.render ? col.render(row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {sortedData.length > 0 && (
        <div className="px-4 py-3 border-t border-border/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted dark:text-gray-400 bg-ivory/30 dark:bg-white/[0.01]">
          <div className="text-[11px]">
            Showing <span className="font-semibold text-primary dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-primary dark:text-white">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-primary dark:text-white">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 rounded-lg bg-accent/10 text-accent font-semibold text-[11px] border border-accent/20">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDataTable;

