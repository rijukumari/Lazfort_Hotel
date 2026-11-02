import React from 'react';

export const InventoryStatusBadge = ({ status, className = '' }) => {
  const norm = String(status || '').toLowerCase().trim();

  let label = status || 'Unknown';
  let badgeStyle = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  let dotColor = 'bg-gray-400';

  if (norm === 'in_stock' || norm === 'instock' || norm === 'active' || norm === 'approved' || norm === 'operational') {
    label = norm.includes('stock') ? 'In Stock' : 'Active / Approved';
    badgeStyle = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500';
  } else if (norm === 'low_stock' || norm === 'lowstock' || norm === 'pending' || norm === 'moderate') {
    label = norm === 'moderate' ? 'Moderate Priority' : 'Low Stock Warning';
    badgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (norm === 'out_of_stock' || norm === 'outofstock' || norm === 'critical' || norm === 'inactive' || norm === 'deactivated') {
    label = norm === 'critical' ? 'Critical Priority' : norm.includes('stock') ? 'Out of Stock' : 'Inactive';
    badgeStyle = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500';
  } else if (norm === 'high') {
    label = 'High Priority';
    badgeStyle = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500';
  } else if (norm.includes('receipt') || norm.includes('stock in')) {
    label = 'Stock In';
    badgeStyle = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500';
  } else if (norm.includes('issue') || norm.includes('stock out')) {
    label = 'Stock Out';
    badgeStyle = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    dotColor = 'bg-blue-500';
  } else if (norm.includes('transfer')) {
    label = 'Dept Transfer';
    badgeStyle = 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    dotColor = 'bg-purple-500';
  } else if (norm.includes('adjust')) {
    label = 'Adjustment';
    badgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (norm.includes('return')) {
    label = 'Vendor Return';
    badgeStyle = 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-500';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeStyle} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      <span className="truncate">{label}</span>
    </span>
  );
};

export default InventoryStatusBadge;

