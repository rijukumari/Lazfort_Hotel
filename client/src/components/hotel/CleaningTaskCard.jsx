import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Clock, User, CheckSquare } from 'lucide-react';

export const CleaningTaskCard = ({
  task,
  onToggleChecklist,
  onComplete,
}) => {
  const completedCount = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
  const totalCount = task.checklist?.length || 1;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="card-luxury-3d p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs font-bold text-accent">
            Suite {task.roomNumber}
          </span>
          <h4 className="font-serif text-lg font-bold text-primary dark:text-white mt-0.5">
            {task.cleaningType}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.priority} size="sm" />
          <StatusBadge status={task.status} size="sm" />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-gray-400 py-2 border-y border-border/70 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-primary dark:text-gray-200">{task.assignedStaffName}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-accent font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>{task.estimatedMinutes} mins</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[11px] mb-1.5 font-medium text-charcoal-muted dark:text-gray-400 font-mono">
          <span>Checklist Progress</span>
          <span className="text-accent font-bold">
            {completedCount}/{task.checklist?.length || 0} ({progressPct}%)
          </span>
        </div>
        <div className="h-2 w-full bg-ivory dark:bg-primary-950/80 rounded-full overflow-hidden p-0.5 border border-border/40 dark:border-white/5">
          <div
            className="h-full gold-gradient-bg rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="space-y-2 pt-2 border-t border-border/70 dark:border-white/10">
        {task.checklist?.map((item, idx) => (
          <label
            key={idx}
            className="flex items-start gap-3 text-xs cursor-pointer hover:text-accent transition-colors group"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onToggleChecklist && onToggleChecklist(task.id, idx)}
              className="mt-0.5 rounded text-accent focus:ring-accent border-gray-300 dark:border-gray-600 dark:bg-primary-800 cursor-pointer"
            />
            <span
              className={
                item.completed
                  ? 'line-through text-charcoal-muted/60 dark:text-gray-500'
                  : 'text-charcoal dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors'
              }
            >
              {item.item}
            </span>
          </label>
        ))}
      </div>

      {task.notes && (
        <p className="text-[11px] italic bg-accent/5 dark:bg-accent/10 p-3 rounded-xl border border-accent/20 text-charcoal-muted dark:text-gray-300">
          Note: {task.notes}
        </p>
      )}

      {onComplete && task.status !== 'completed' && (
        <button
          onClick={() => onComplete(task)}
          className="w-full py-2.5 gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider rounded-xl btn-3d flex items-center justify-center gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          Mark Suite as Sanitized & Clean
        </button>
      )}
    </div>
  );
};

export default CleaningTaskCard;

