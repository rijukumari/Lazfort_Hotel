import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  UserPlus,
  Save,
} from 'lucide-react';

export const AddStaffPage = () => {
  const navigate = useNavigate();
  const { addStaff } = useERP();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+377 98 00 11 22');
  const [role, setRole] = useState('Senior Concierge');
  const [department, setDepartment] = useState('Front Desk');
  const [shift, setShift] = useState('Morning (07:00 - 15:30)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Validation Error', 'Please complete staff member name and email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      if (addStaff) {
        addStaff({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          department,
          shift,
          status: 'active',
        });
      }
      showToast(
        'Staff Member Provisioned',
        `${name} has been appointed to ${department} as ${role}.`,
        'success'
      );
      navigate('/hotel-admin/staff');
    } catch {
      showToast('Error', 'Failed to provision staff member.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/staff"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Staff Directory</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <UserPlus className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Appoint Sovereign Staff Member
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Register luxury estate personnel, operational shifts, department clearances, and duty assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/hotel-admin/staff')}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            icon={Save}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Appointing...' : 'Appoint Staff'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Legal Name" required>
                <Input
                  required
                  placeholder="e.g. Jean-Luc Delacroix"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormField>

              <FormField label="Professional Role Title" required>
                <Input
                  required
                  placeholder="e.g. Head Sommelier & Cellar Master"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Department Division" required>
                <Select value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="Front Desk">Front Desk & VIP Reception</option>
                  <option value="Concierge">Royal Concierge & Butler</option>
                  <option value="Housekeeping">Housekeeping & Hygiene</option>
                  <option value="F&B Service">Fine Dining & Sommelier</option>
                  <option value="Management">Executive Hotel Management</option>
                  <option value="Security">Estate Security & Clearance</option>
                </Select>
              </FormField>

              <FormField label="Duty Shift Assignment" required>
                <Select value={shift} onChange={e => setShift(e.target.value)}>
                  <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
                  <option value="Evening (15:00 - 23:30)">Evening (15:00 - 23:30)</option>
                  <option value="Night (23:00 - 07:30)">Night (23:00 - 07:30)</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Direct Corporate Email" required>
                <Input
                  type="email"
                  required
                  placeholder="j.delacroix@palace.lazfort.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormField>

              <FormField label="Direct Contact Telephone">
                <Input
                  placeholder="+377 98 00 11 22"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </FormField>
            </div>
          </Card>
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-accent block">
              Staff Badge Clearance
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center font-serif font-black text-primary-950 text-base shadow-sm">
                {name.charAt(0) || 'S'}
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                  {name || 'New Personnel'}
                </h4>
                <p className="text-xs text-accent font-medium">{role}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Division</span>
                <span className="font-semibold text-primary dark:text-white">{department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Shift</span>
                <span className="font-mono text-primary dark:text-white text-[11px]">{shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Sovereign Clearance</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Granted</span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Save}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Appointing...' : 'Appoint Staff'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddStaffPage;

