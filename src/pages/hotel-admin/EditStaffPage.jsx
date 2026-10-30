import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockStaff } from '../../data/mockStaff';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Edit,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const EditStaffPage = () => {
  const { id, staffId } = useParams();
  const effectiveId = staffId || id;
  const navigate = useNavigate();
  const { staff = mockStaff, updateStaff } = useERP();
  const { showToast } = useToast();

  const member = staff.find(s => s.id === effectiveId) || staff[0];

  const [role, setRole] = useState(member?.role || '');
  const [department, setDepartment] = useState(member?.department || 'Front Desk');
  const [shift, setShift] = useState(member?.shift || 'Morning (07:00 - 15:30)');
  const [status, setStatus] = useState(member?.status || 'active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setRole(member.role || '');
      setDepartment(member.department || 'Front Desk');
      setShift(member.shift || 'Morning (07:00 - 15:30)');
      setStatus(member.status || 'active');
    }
  }, [member]);

  if (!member) {
    return (
      <div className="space-y-6">
        <Link to="/hotel-admin/staff" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Staff Directory
        </Link>
        <p className="text-sm">Staff member not found.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      if (updateStaff) {
        updateStaff(member.id, {
          role,
          department,
          shift,
          status,
        });
      }
      showToast(
        'Staff Profile Updated',
        `${member.name}'s duties and shift schedule have been updated.`,
        'success'
      );
      navigate('/hotel-admin/staff');
    } catch {
      showToast('Error', 'Failed to update staff member.', 'error');
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
              <Edit className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Edit Staff Profile: {member.name}
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Update role title, operational division, duty shifts, and clearance status.
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
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card variant="luxury" className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Professional Role Title" required>
                <Input
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </FormField>

              <FormField label="Department Division" required>
                <Select value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Concierge">Concierge</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="F&B Service">F&B Service</option>
                  <option value="Management">Management</option>
                  <option value="Security">Security</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Duty Shift Assignment" required>
                <Select value={shift} onChange={e => setShift(e.target.value)}>
                  <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
                  <option value="Evening (15:00 - 23:30)">Evening (15:00 - 23:30)</option>
                  <option value="Night (23:00 - 07:30)">Night (23:00 - 07:30)</option>
                </Select>
              </FormField>

              <FormField label="Operational Status" required>
                <Select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="active">Active Duty</option>
                  <option value="on_leave">On Approved Leave</option>
                  <option value="inactive">Inactive / Suspended</option>
                </Select>
              </FormField>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Staff Profile Snapshot</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Staff ID</span>
                <span className="font-mono font-bold text-primary dark:text-white">{member.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Tenure Since</span>
                <span className="font-mono text-charcoal">{member.joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Performance Rating</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {member.performanceScore}%
                </span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Save}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default EditStaffPage;

