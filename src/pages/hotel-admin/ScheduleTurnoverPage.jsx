import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Select, Input, Button, Card } from '../../components/ui';
import { ArrowLeft, Sparkles, BedDouble, ShieldCheck } from 'lucide-react';

export const ScheduleTurnoverPage = () => {
  const navigate = useNavigate();
  const { rooms, addCleaningTask } = useERP();
  const { showToast } = useToast();

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [cleaningType, setCleaningType] = useState('Full Turnover');
  const [priority, setPriority] = useState('high');
  const [assignedStaffName, setAssignedStaffName] = useState('Marie Laurent');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [taskNotes, setTaskNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

    setIsSubmitting(true);
    try {
      addCleaningTask({
        roomId: targetRoom?.id || 'rm-01',
        roomNumber: targetRoom?.roomNumber || '101',
        cleaningType,
        priority,
        status: 'pending',
        assignedTo: 'stf-04',
        assignedStaffName,
        estimatedMinutes,
        notes: taskNotes,
        checklist: [
          { item: 'Replace Egyptian cotton bedsheets and duvet', completed: false },
          { item: 'Full marble bath sterilization and Bulgari restock', completed: false },
          { item: 'Sommelier minibar and crystal flute inventory refresh', completed: false },
          { item: 'Terrace panoramic glass polish and air purifier activation', completed: false },
        ],
      });

      showToast(
        'Turnover Scheduled',
        `Dispatched ${cleaningType} for Suite ${targetRoom?.roomNumber}.`,
        'success'
      );
      navigate('/hotel-admin/housekeeping');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/hotel-admin/housekeeping"
          className="p-2.5 rounded-2xl bg-white dark:bg-primary-900 border border-border dark:border-white/10 hover:border-accent text-charcoal dark:text-gray-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-accent" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
              Housekeeping Command
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary dark:text-white">
            Schedule Suite Turnover Protocol
          </h1>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
            Dispatch prioritized housekeeping team and assign white-glove sanitization checklist
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-primary dark:text-white">
                Turnover Specifications
              </h2>
              <p className="text-xs text-charcoal-muted">
                Suite allocation, assigned housekeeper, and protocol duration
              </p>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField label="Concierge Special Instructions & Fragrance Preferences">
            <textarea
              rows={3}
              value={taskNotes}
              onChange={e => setTaskNotes(e.target.value)}
              placeholder="e.g. Extra Bulgari bath salts, lavender aromatherapy spray, allergen-free bedding..."
              className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
            />
          </FormField>
        </Card>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/hotel-admin/housekeeping')}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            type="submit"
            disabled={isSubmitting}
            icon={Sparkles}
          >
            {isSubmitting ? 'Dispatching...' : 'Dispatch Turnover Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleTurnoverPage;

