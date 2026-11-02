import React from 'react';

export const MaintenanceStatusBadge = ({ status, className = '' }) => {
  const norm = String(status || '').toLowerCase().trim();

  let label = status || 'Open';
  let badgeStyle = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  let dotColor = 'bg-gray-400';

  if (norm === 'open') {
    label = 'Open';
    badgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (norm === 'assigned') {
    label = 'Assigned';
    badgeStyle = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    dotColor = 'bg-blue-500';
  } else if (norm === 'in_progress' || norm === 'in progress') {
    label = 'In Progress';
    badgeStyle = 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    dotColor = 'bg-purple-500 animate-pulse';
  } else if (norm === 'on_hold' || norm === 'on hold') {
    label = 'On Hold';
    badgeStyle = 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-500';
  } else if (norm === 'completed' || norm === 'resolved' || norm === 'operational' || norm === 'excellent') {
    label = norm === 'operational' ? 'Operational' : norm === 'excellent' ? 'Excellent' : 'Completed';
    badgeStyle = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500';
  } else if (norm === 'good') {
    label = 'Good Condition';
    badgeStyle = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    dotColor = 'bg-emerald-400';
  } else if (norm === 'fair') {
    label = 'Fair Condition';
    badgeStyle = 'bg-amber-500/15 text-amber-600 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (norm === 'poor' || norm === 'under_maintenance' || norm === 'under maintenance') {
    label = norm === 'poor' ? 'Poor Condition' : 'Under Maintenance';
    badgeStyle = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500';
  } else if (norm === 'cancelled' || norm === 'decommissioned' || norm === 'closed') {
    label = norm === 'cancelled' ? 'Cancelled' : norm === 'decommissioned' ? 'Decommissioned' : 'Closed';
    badgeStyle = 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    dotColor = 'bg-gray-400';
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

export default MaintenanceStatusBadge;

