import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  User,
  BedDouble,
  Sparkles,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckSquare
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffTaskDetailsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [tasks] = useState([
    {
      id: 'TSK-2026-881',
      title: 'Chilled Vintage Champagne & Caviar Service',
      suite: 'Suite 801 (Presidential Penthouse)',
      roomNumber: '801',
      guestName: 'Lord Alistair Sterling',
      vipTier: 'Centurion Royal Guest',
      category: 'In-Suite VIP Dining',
      priority: 'Urgent VIP',
      assignedStaff: 'Sebastian Laurent (Lead Concierge)',
      assignedTime: '10:15 AM Today',
      dueTime: '11:00 AM Today',
      status: 'In Progress',
      description: 'The guest has requested private terrace champagne and canapés setup overlooking Monaco harbor prior to their business summit.',
      instructions: [
        'Coordinate with Head Sommelier for chilled bottle of Dom Pérignon Vintage 2012.',
        'Obtain 50g Imperial Beluga Caviar on hand-carved ice display with blinis and crème fraîche.',
        'Use gold-rimmed crystal Baccarat flutes and mother-of-pearl serving spoons.',
        'Greet guest with white-glove decorum and inquire if evening limousine transit is required.',
      ],
      timeline: [
        { time: '10:15 AM', event: 'Task assigned by Chief Concierge desk.' },
        { time: '10:20 AM', event: 'Sommelier cellar requisition approved.' },
        { time: '10:35 AM', event: 'Caviar and flutes loaded onto private service trolley.' },
        { time: '10:45 AM', event: 'Elevator key card engaged for Penthouse Level.' },
      ]
    },
    {
      id: 'TSK-2026-882',
      title: 'Private Chauffeur & Helipad Transit Coordination',
      suite: 'Suite 604 (Grand Mediterranean)',
      roomNumber: '604',
      guestName: 'Princess Sophia of Monaco',
      vipTier: 'Sovereign Royal',
      category: 'Transportation & Transit',
      priority: 'High Priority',
      assignedStaff: 'Sebastian Laurent (Lead Concierge)',
      assignedTime: '09:30 AM Today',
      dueTime: '12:30 PM Today',
      status: 'Pending',
      description: 'Royal luggage escort and limousine coordination from Helipad Gate 2.',
      instructions: [
        'Verify driver security credentials with Monaco security police.',
        'Ensure temperature inside vehicle is pre-conditioned to 20.5°C.',
        'Escort luggage directly to Grand Mediterranean private walk-in wardrobe.',
      ],
      timeline: [
        { time: '09:30 AM', event: 'Helipad flight coordinator confirmed ETA 12:15 PM.' },
      ]
    }
  ]);

  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id);
  const currentTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];
  const [taskStatus, setTaskStatus] = useState(currentTask.status);

  const handleUpdateStatus = (newStatus) => {
    setTaskStatus(newStatus);
    showToast('Task Updated', `Task ${currentTask.id} status changed to ${newStatus}.`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Dossier & Operational Briefing"
        subtitle="Individual work order specifications, guest preferences, activity timelines, and instructions."
        icon={Briefcase}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/staff/work')}
            >
              Back to Task List
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleUpdateStatus('Completed')}
              disabled={taskStatus === 'Completed'}
            >
              Mark Completed
            </Button>
          </div>
        }
      />

      {/* Task Selector Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-charcoal-card dark:bg-[#0c1424] border border-primary/20 dark:border-white/10 overflow-x-auto">
        {tasks.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSelectedTaskId(t.id);
              setTaskStatus(t.status);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all whitespace-nowrap ${
              selectedTaskId === t.id
                ? 'bg-accent text-primary dark:text-[#080d19] shadow-gold'
                : 'text-charcoal-muted dark:text-gray-400 hover:text-white'
            }`}
          >
            {t.id} • {t.title.slice(0, 24)}...
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Task Detailed Specifications */}
        <div className="lg:col-span-8 space-y-6">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 dark:border-white/5 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-accent">{currentTask.id}</span>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white mt-1">
                  {currentTask.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={currentTask.priority.includes('Urgent') ? 'cancelled' : 'pending'}
                  label={currentTask.priority}
                />
                <StatusBadge
                  status={taskStatus === 'Completed' ? 'completed' : 'pending'}
                  label={taskStatus}
                />
              </div>
            </div>

            {/* Guest & Chamber Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 text-xs">
              <div>
                <span className="text-charcoal-muted dark:text-gray-400 block mb-1">Target Chamber</span>
                <span className="font-serif font-bold text-primary dark:text-white flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-accent" />
                  {currentTask.suite}
                </span>
              </div>
              <div>
                <span className="text-charcoal-muted dark:text-gray-400 block mb-1">Guest Beneficiary</span>
                <span className="font-serif font-bold text-primary dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-accent" />
                  {currentTask.guestName}
                </span>
                <span className="text-[10px] text-accent block">{currentTask.vipTier}</span>
              </div>
              <div>
                <span className="text-charcoal-muted dark:text-gray-400 block mb-1">Fulfillment SLA</span>
                <span className="font-mono text-charcoal dark:text-gray-300 flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  Due: {currentTask.dueTime}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-2">
                Mission Description
              </h4>
              <p className="text-xs text-charcoal-muted dark:text-gray-300 leading-relaxed bg-charcoal-bg/50 dark:bg-[#080d19]/50 p-4 rounded-xl border border-primary/10 dark:border-white/5">
                {currentTask.description}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-accent" />
                Operational Execution Steps
              </h4>
              <div className="space-y-2.5">
                {currentTask.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 text-xs">
                    <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-charcoal dark:text-gray-200">{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Change Controls */}
            <div className="pt-4 border-t border-primary/10 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-charcoal-muted dark:text-gray-400">
                Update Task State:
              </span>
              <div className="flex gap-2">
                <Button
                  variant={taskStatus === 'Pending' ? 'primary' : 'outline'}
                  size="xs"
                  onClick={() => handleUpdateStatus('Pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={taskStatus === 'In Progress' ? 'primary' : 'outline'}
                  size="xs"
                  onClick={() => handleUpdateStatus('In Progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={taskStatus === 'Completed' ? 'primary' : 'outline'}
                  size="xs"
                  onClick={() => handleUpdateStatus('Completed')}
                >
                  Mark Completed
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Timeline & Assigned Staff */}
        <div className="lg:col-span-4 space-y-6">
          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424]">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Activity Audit Timeline
            </h4>
            <div className="relative pl-6 space-y-4 border-l border-accent/30 text-xs">
              {currentTask.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-accent shadow-gold" />
                  <span className="font-mono text-[10px] text-accent block font-bold">{item.time}</span>
                  <p className="text-charcoal dark:text-gray-300 text-xs mt-0.5">{item.event}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] text-xs space-y-3">
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Assigned Specialist
            </h4>
            <div className="p-3 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 space-y-1.5">
              <span className="font-bold text-primary dark:text-white block">{currentTask.assignedStaff}</span>
              <span className="text-charcoal-muted dark:text-gray-400 block text-[11px]">Department: Head Concierge Desk</span>
              <span className="badge badge-gold font-mono text-[9px] px-2 py-0.5">Clefs d’Or Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTaskDetailsPage;

