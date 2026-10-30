/**
 * Lazfort Hotel ERP - Common UI & Data Table Helpers
 * Pure JavaScript Module
 */

export const TOAST_TYPES = ['success', 'error', 'info', 'warning'];

/**
 * Creates a table column configuration
 * @param {Object} column
 * @returns {Object}
 */
export const createTableColumn = ({
  key,
  header,
  render = null,
  sortable = false,
  className = '',
}) => ({
  key,
  header,
  render,
  sortable,
  className,
});

/**
 * Creates pagination state
 * @param {Object} pagination
 * @returns {Object}
 */
export const createPaginationState = ({
  page = 1,
  pageSize = 10,
  total = 0,
} = {}) => ({
  page,
  pageSize,
  total,
});

