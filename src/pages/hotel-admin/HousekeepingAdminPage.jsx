import React, { useState } from 'react';
import { PageHeader, StatCard, Tabs, Modal, FormField, Input, Select, Button } from '../../components/ui';
import { CleaningTaskCard } from '../../components/hotel/CleaningTaskCard';
import { CheckCircle, Plus, Sparkles, Clock, AlertTriangle, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const HousekeepingAdminPage = () => {
  const { cleaningTasks: tasks, updateCleaningTaskStatus, addCleaningTask, toggleCleaningChecklist, rooms } = useERP();
  const [activeTab, setActiveTab] = useState('all');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const { showToast } = useToast();

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [cleaningType, setCleaningType] = useState('Full Turnover');
  const [priority, setPriority] = useState('high');
  const [assignedStaffName, setAssignedStaffName] = useState('Marie Laurent');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [taskNotes, setTaskNotes] = useState('');

  const handleToggleChecklist = (taskId, index) => {
    toggleCleaningChecklist(taskId, index);
  };

  const handleCompleteTask = (task) => {
    updateCleaningTaskStatus(task.id, 'inspected');
    showToast(
      'Suite Inspected & Approved',
      `Suite ${task.roomNumber} has been verified and returned to Available inventory.`,
      'success'
    );
  };

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    const targetRoom = rooms.find(r => r.id === selectedRoomId);
    if (!targetRoom) {
      showToast('Validation Error', 'Please select a valid suite.', 'error');
      return;
    }

    addCleaningTask({
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      roomType: targetRoom.type,
      assignedStaffId: 'stf-002',
      assignedStaffName: assignedStaffName || 'Marie Laurent',
      priority,
      status: 'pending',
      cleaningType,
      estimatedMinutes: Number(estimatedMinutes),
      checklist: [
        { item: 'Full linen replacement with Frette 1000-thread Egyptian cotton', completed: false },
        { item: 'Sanitize Italian marble bathroom & whirlpool jets', completed: false },
        { item: 'Replenish Bulgari and Acqua Di Parma bath amenities', completed: false },
        { item: 'White-glove supervisor inspection', completed: false }
      ],
      notes: taskNotes || 'Scheduled VIP turnover protocol.',
    });

    showToast(
      'Turnover Dispatched',
      `Cleaning task scheduled for Suite ${targetRoom.roomNumber} (${cleaningType}).`,
      'success'
    );
    setIsAddTaskModalOpen(false);
  };

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: tasks.filter(t => t.status === 'in_progress').length,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: tasks.filter(t => t.status === 'pending').length,
    },
    {
      id: 'completed',
      label: 'Completed & Inspected',
      count: tasks.filter(t => t.status === 'completed' || t.status === 'inspected').length,
    },
  ];

  const displayedTasks =
    activeTab === 'all'
      ? tasks
      : activeTab === 'completed'
      ? tasks.filter(t => t.status === 'completed' || t.status === 'inspected')
      : tasks.filter(t => t.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Executive Housekeeping & Hygiene Operations"
        description="Room turnover tracking, deep sanitization checklist adherence, and white-glove inspection sign-offs."
        badge="Zero Compromise Hygiene"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CheckCircle}
              onClick={() => {
                showToast('Hygiene Audit Scheduled', 'All pending suites flagged for immediate executive white-glove audit.', 'info');
              }}
            >
              Audit All Suites
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              Schedule Turnover
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Turnovers Scheduled"
          value={`${tasks.length} Tasks`}
          change={`${tasks.filter(t => t.status === 'inspected' || t.status === 'completed').length} Cleaned`}
          isPositive={true}
          icon={Sparkles}
          subtitle="White-Glove Standard"
        />
        <StatCard
          title="Urgent VIP Turnovers"
          value={`${tasks.filter(t => t.priority === 'urgent' && t.status !== 'inspected').length} Urgent`}
          change="Expedited protocols"
          isPositive={tasks.filter(t => t.priority === 'urgent' && t.status !== 'inspected').length === 0}
          icon={AlertTriangle}
          subtitle="Arrivals in < 2 Hours"
        />
        <StatCard
          title="Avg Turnaround Time"
          value="48 Mins"
          change="Under 60m SLA"
          isPositive={true}
          icon={Clock}
          subtitle="Executive Floor Teams"
        />
        <StatCard
          title="Hygiene Audit Pass Rate"
          value="100%"
          change="5-Star Sovereign Rating"
          isPositive={true}
          icon={Award}
          subtitle="Medical Grade Sanitization"
        />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedTasks.map(task => (
          <CleaningTaskCard
            key={task.id}
            task={task}
            onToggleChecklist={handleToggleChecklist}
            onComplete={handleCompleteTask}
          />
        ))}
      </div>

      {/* Schedule Turnover Task Modal */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Schedule Suite Turnover & Sanitization"
        subtitle="Dispatch housekeeping task and monitor white-glove inspection progress"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
          <FormField label="Target Suite" required>
            <Select
              value={selectedRoomId}
              onChange={e => setSelectedRoomId(e.target.value)}
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  Suite {r.roomNumber} — {r.type} ({(r.status || '').toUpperCase()}, {r.cleaningStatus})
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Protocol / Cleaning Type" required>
              <Select
                value={cleaningType}
                onChange={e => setCleaningType(e.target.value)}
              >
                <option value="Full Turnover">Full Departure Turnover</option>
                <option value="Daily Refresh">Daily Turndown & Refresh</option>
                <option value="Deep Sanitization">Deep Medical Sanitization</option>
                <option value="Inspection">White-Glove Inspection</option>
              </Select>
            </FormField>

            <FormField label="Priority / Urgency" required>
              <Select
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="urgent">Urgent (Immediate VIP arrival)</option>
                <option value="high">High Priority</option>
                <option value="medium">Standard Turnaround</option>
                <option value="low">Low / Preventive</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Assigned Housekeeper" required>
              <Input
                type="text"
                required
                value={assignedStaffName}
                onChange={e => setAssignedStaffName(e.target.value)}
                placeholder="e.g. Marie Laurent / Margaux Dubois"
              />
            </FormField>

            <FormField label="Target Duration (Mins)" required>
              <Input
                type="number"
                min={15}
                max={180}
                required
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
              />
            </FormField>
          </div>

          <FormField label="Concierge Special Instructions">
            <textarea
              rows={2}
              value={taskNotes}
              onChange={e => setTaskNotes(e.target.value)}
              placeholder="e.g. Extra Bulgari bath salts, lavender aromatherapy spray, allergen-free bedding..."
              className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
            >
              Dispatch Turnover Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HousekeepingAdminPage;

