import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import {
  CheckSquare,
  Sparkles,
  BedDouble,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const CleaningChecklistPage = () => {
  const navigate = useNavigate();
  const { cleaningTasks: tasks = [], toggleCleaningChecklist, updateCleaningTaskStatus } = useERP();
  const { showToast } = useToast();

  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || '');

  const currentTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  const handleToggleItem = (taskId, index) => {
    toggleCleaningChecklist(taskId, index);
    showToast('Checklist Updated', 'Step marked in live operational log.', 'info');
  };

  const handleCompleteCurrentTask = () => {
    if (!currentTask) return;
    updateCleaningTaskStatus(currentTask.id, 'completed');
    showToast('Suite Cleared', `Suite ${currentTask.roomNumber} turnover marked complete.`, 'success');
  };

  const totalSteps = currentTask?.checklist?.length || 0;
  const completedSteps = currentTask?.checklist?.filter(c => c.completed).length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sanitation & Cleaning Checklist"
        subtitle="Mandatory step-by-step luxury hygiene checklist execution for active chamber turnovers."
        icon={CheckSquare}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Clock}
              onClick={() => navigate('/housekeeping/cleaning/in-progress')}
            >
              In Progress Suites
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={handleCompleteCurrentTask}
              disabled={!currentTask || currentTask.status === 'completed' || currentTask.status === 'inspected'}
            >
              Finish Turnover
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Chamber Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="luxury-card p-4 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-accent" />
              Select Active Chamber
            </h4>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {tasks.map(t => {
                const isSelected = selectedTaskId === t.id;
                const cDone = t.checklist?.filter(c => c.completed).length || 0;
                const cTotal = t.checklist?.length || 4;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all text-xs ${
                      isSelected
                        ? 'border-accent bg-accent/10 dark:bg-accent/15'
                        : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-serif font-bold text-sm text-primary dark:text-white">
                          Suite {t.roomNumber}
                        </p>
                        <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                          {t.assignedStaffName || 'Valet Team'}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-accent">
                        {cDone}/{cTotal} steps
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Checklist Execution */}
        <div className="lg:col-span-8 space-y-4">
          {currentTask ? (
            <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 dark:border-white/5 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                    Suite {currentTask.roomNumber} • Protocol Execution
                  </h3>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400">
                    Assigned: {currentTask.assignedStaffName || 'Lead Sanitizer'} • {currentTask.cleaningType || 'Full Turnover'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl font-bold text-accent">
                    {progressPercent}%
                  </span>
                  <span className="block text-[10px] text-charcoal-muted dark:text-gray-400">
                    Overall Completion
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-charcoal-bg dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-amber-300 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {currentTask.checklist && currentTask.checklist.length > 0 ? (
                  currentTask.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleToggleItem(currentTask.id, idx)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        item.completed
                          ? 'border-emerald-500/30 bg-emerald-500/10'
                          : 'border-primary/10 dark:border-white/5 bg-charcoal-bg dark:bg-[#080d19] hover:border-accent/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          item.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-500'
                        }`}>
                          {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-medium ${
                          item.completed
                            ? 'line-through text-charcoal-muted dark:text-gray-400'
                            : 'text-primary dark:text-white'
                        }`}>
                          {item.item || item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-charcoal-muted dark:text-gray-400">
                        {item.completed ? 'COMPLETED' : 'PENDING'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-charcoal-muted dark:text-gray-400 py-4 text-center">
                    Standard 4-tier turnover protocol active.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="luxury-card p-12 text-center rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] text-charcoal-muted dark:text-gray-400">
              <CheckSquare className="w-12 h-12 text-accent/40 mx-auto mb-3" />
              <p className="font-serif font-bold text-base text-primary dark:text-white">
                Select a Chamber to View Checklist
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleaningChecklistPage;

