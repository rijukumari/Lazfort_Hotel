/**
 * Utility helper functions for Lazfort Hotel ERP
 */

/**
 * Format currency in USD
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format ISO date string to localized date
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Capitalize string and format snake_case or kebab-case
 * @param {string} str
 * @returns {string}
 */
export const formatLabel = (str = '') => {
  return String(str)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

