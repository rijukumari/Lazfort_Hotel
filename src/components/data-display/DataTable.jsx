import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';

export function DataTable({
  data = [],
  columns = [],
  keyExtractor = (item, index) => item.id || String(index),
  searchPlaceholder = 'Search records...',
  searchFilter,
  statusFilterKey,
  statusOptions = [],
  pageSize = 6,
  actions,
  emptyMessage,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredData = useMemo(() => {
    return (data || []).filter(item => {
      // Status filter
      if (selectedStatus !== 'all' && statusFilterKey) {
        const itemStatus = String(item[statusFilterKey] || '').toLowerCase();
        if (itemStatus !== selectedStatus.toLowerCase()) return false;
      }
      // Text search filter
      if (searchQuery.trim()) {
        if (searchFilter) {
          return searchFilter(item, searchQuery.toLowerCase());
        }
        return Object.values(item || {}).some(val =>
          String(val || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  }, [data, searchQuery, selectedStatus, statusFilterKey, searchFilter]);

  // Sort logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      const comparison = valA > valB ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination logic
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = key => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="card-luxury-3d overflow-hidden">
      {/* Top golden shimmer border */}
      <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none" />

      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-border/70 dark:border-white/10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-ivory/50 dark:bg-black/20">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 items-center">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/15 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-charcoal dark:text-white placeholder:text-charcoal-muted/70 shadow-sm transition-all"
            />
          </div>

          {/* Status filter dropdown */}
          {statusOptions.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedStatus}
                onChange={e => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto pl-3.5 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/15 rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent text-charcoal dark:text-white capitalize appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="all">All Status Tiers</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt} className="capitalize bg-white dark:bg-[#101722] text-charcoal dark:text-white">
                    {opt.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 self-end md:self-auto">{actions}</div>}
      </div>

      {/* Table Scroll Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-white/[0.03] text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-400 font-mono font-semibold">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-6 py-4 select-none ${col.className || ''} ${
                    col.sortable ? 'cursor-pointer hover:text-accent dark:hover:text-accent transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-accent" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-white/[0.06]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-charcoal-muted dark:text-gray-400">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-serif text-base font-semibold text-primary dark:text-white mb-1">
                    {emptyMessage || 'No matching luxury records found'}
                  </p>
                  <p className="text-xs">Adjust query filters or search terms.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={keyExtractor(item, idx)}
                  className="hover:bg-accent/[0.04] dark:hover:bg-white/[0.04] transition-colors duration-150 group"
                >
                  {columns.map(col => (
                    <td key={col.key} className={`px-6 py-4 text-xs sm:text-sm ${col.className || ''}`}>
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-border/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted dark:text-gray-400 bg-ivory/30 dark:bg-black/20">
        <div>
          Showing{' '}
          <span className="font-semibold text-primary dark:text-white">
            {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-primary dark:text-white">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-primary dark:text-white font-mono">{totalItems}</span> entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-border dark:border-white/15 hover:bg-white dark:hover:bg-primary-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentPage === pageNum
                  ? 'gold-gradient-bg text-primary-900 font-bold shadow-gold scale-105'
                  : 'hover:bg-white dark:hover:bg-primary-800 text-charcoal dark:text-gray-300 border border-transparent hover:border-border'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-border dark:border-white/15 hover:bg-white dark:hover:bg-primary-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;

