/**
 * Lazfort Hotel ERP - Navigation & Layout Data Models
 * Pure JavaScript Module with Navigation Item Helpers
 */

/**
 * Creates a navigation item configuration
 * @param {Object} item
 * @returns {Object}
 */
export const createNavItem = ({
  id,
  label,
  path,
  iconName = 'CircleDot',
  badge = null,
  badgeColor = 'accent',
  children = [],
}) => ({
  id,
  label,
  path,
  iconName,
  badge,
  badgeColor,
  children,
});

/**
 * Creates a navigation group
 * @param {Object} group
 * @returns {Object}
 */
export const createNavGroup = ({
  id,
  title,
  role,
  items = [],
}) => ({
  id,
  title,
  role,
  items,
});

/**
 * Creates a breadcrumb item
 * @param {Object} item
 * @returns {Object}
 */
export const createBreadcrumb = ({
  label,
  path = '',
  isCurrent = false,
}) => ({
  label,
  path,
  isCurrent,
});

