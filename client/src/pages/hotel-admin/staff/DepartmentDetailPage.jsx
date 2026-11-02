import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Card } from '../../../components/ui';
import { ArrowLeft, Building2, Edit2, Users, DollarSign, MapPin, Shield } from 'lucide-react';

export const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lazfort_departments');
      if (stored) {
        const departments = JSON.parse(stored);
        const found = departments.find(d => String(d.id) === String(id));
        if (found) setDept(found);
      }
    } catch (e) {
      console.warn('Failed to load department', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-charcoal-muted">Loading profile...</div>;
  }

  if (!dept) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-charcoal-muted">Department not found.</p>
        <Button variant="gold" onClick={() => navigate('/hotel-admin/staff/departments')}>
          Back to Departments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/hotel-admin/staff/departments"
            className="p-2 rounded-xl border border-border/80 dark:border-white/10 hover:bg-white dark:hover:bg-primary-800 text-charcoal-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-primary dark:text-white">
                {dept.name}
              </h1>
              <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
                {dept.code}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Location: {dept.location || 'Central Complex'}
            </p>
          </div>
        </div>

        <Button
          variant="gold"
          icon={Edit2}
          onClick={() => navigate(`/hotel-admin/staff/departments/edit/${dept.id}`)}
        >
          Edit Department
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Department Head</span>
          <span className="text-sm font-semibold text-primary dark:text-white mt-1 block">
            {dept.head}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Active Personnel</span>
          <span className="text-sm font-semibold text-primary dark:text-white mt-1 block">
            {dept.employeeCount} Staff Members
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Operational Status</span>
          <div className="mt-1">
            <StatusBadge status={dept.status === 'Active' ? 'active' : 'inactive'} size="sm" />
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Annual Budget</span>
          <span className="text-sm font-semibold text-accent mt-1 block">
            {dept.budget || '$350,000 / yr'}
          </span>
        </Card>
      </div>

      <Card className="p-6 space-y-3">
        <h3 className="font-serif font-bold text-base text-primary dark:text-white">
          Mandate & Operational Scope
        </h3>
        <p className="text-xs text-charcoal dark:text-gray-300 leading-relaxed bg-ivory/40 dark:bg-white/[0.02] p-4 rounded-xl border border-border/60 dark:border-white/10">
          {dept.description || 'No operational mandate registered.'}
        </p>
      </Card>
    </div>
  );
};

export default DepartmentDetailPage;

