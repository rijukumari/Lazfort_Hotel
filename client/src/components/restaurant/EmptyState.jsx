import React from 'react';
import { Sparkles, Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Try adjusting your search query or filter criteria.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-14 px-4 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="font-serif font-semibold text-primary dark:text-white text-base">
          {title}
        </h4>
        <p className="text-xs text-charcoal-muted dark:text-gray-400">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-accent text-white dark:text-primary-950 font-semibold text-xs shadow-gold hover:opacity-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingState = ({ message = 'Synchronizing gastronomy registry...' }) => {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto animate-pulse shadow-gold">
        <Sparkles className="w-5 h-5 text-accent animate-spin" />
      </div>
      <p className="text-xs font-mono text-accent">{message}</p>
    </div>
  );
};

export default EmptyState;

