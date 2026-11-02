import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader, FormField, Input, Select, Button, Card } from '../../../components/ui';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const AddDepartmentPage = () => {
  const navigate = useNavigate();
  const { staff = [] } = useERP();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: 'DEP-0' + Math.floor(10 + Math.random() * 90),
    head: staff[0]?.name || 'Sebastian Laurent',
    employeeCount: 1,
    status: 'Active',
    description: '',
    budget: '$250,000 / yr',
    location: 'Executive Wing'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('Validation Error', 'Department name and code are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const stored = localStorage.getItem('lazfort_departments');
      const departments = stored ? JSON.parse(stored) : [];

      const newDept = {
        id: `DEP-${Date.now().toString().slice(-4)}`,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        head: formData.head.trim(),
        employeeCount: Number(formData.employeeCount) || 0,
        status: formData.status,
        description: formData.description.trim(),
        budget: formData.budget.trim(),
        location: formData.location.trim()
      };

      localStorage.setItem('lazfort_departments', JSON.stringify([newDept, ...departments]));
      showToast('Department Created', `Department "${newDept.name}" created successfully.`, 'success');
      navigate('/hotel-admin/staff/departments');
    } catch (err) {
      showToast('Error', 'Failed to create department.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          to="/hotel-admin/staff/departments"
          className="p-2 rounded-xl border border-border/80 dark:border-white/10 hover:bg-white dark:hover:bg-primary-800 text-charcoal-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary dark:text-white">
            Add New Department
          </h1>
          <p className="text-xs text-charcoal-muted">
            Establish a dedicated hotel operational department or service wing.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-8 card-luxury-3d">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Department Name" required>
              <Input
                placeholder="e.g. Concierge & Valet Service"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Department Code" required>
              <Input
                placeholder="e.g. CVS"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Department Head" required>
              <Input
                placeholder="Name of Director / Supervisor"
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Staff Complement (Headcount)" required>
              <Input
                type="number"
                min="0"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Operational Status">
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
              />
            </FormField>
            <FormField label="Annual Budget Allocation">
              <Input
                placeholder="e.g. $450,000 / yr"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Physical Location / Wing">
            <Input
              placeholder="e.g. North Atrium & Ground Concierge Desk"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </FormField>

          <FormField label="Operational Mandate / Scope">
            <textarea
              rows={4}
              placeholder="Detail responsibilities, core service level agreements, and daily mandates..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-ivory/50 dark:bg-white/5 border border-border/80 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent resize-none"
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
            <Button
              variant="outline"
              onClick={() => navigate('/hotel-admin/staff/departments')}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              icon={Save}
              loading={isSubmitting}
            >
              Create Department
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddDepartmentPage;

