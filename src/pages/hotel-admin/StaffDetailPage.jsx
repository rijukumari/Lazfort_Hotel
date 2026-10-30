import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockStaff } from '../../data/mockStaff';
import { useERP } from '../../context/ERPContext';
import { StatusBadge, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const StaffDetailPage = () => {
  const { id, staffId } = useParams();
  const effectiveId = staffId || id;
  const navigate = useNavigate();
  const { staff = mockStaff } = useERP();

  const reservedSubpaths = ['departments', 'roles', 'shifts', 'attendance', 'add', 'schedule', 'shift-scheduling', 'leave', 'leave-requests'];
  const member = (effectiveId && !reservedSubpaths.includes(effectiveId))
    ? staff.find(s => s.id === effectiveId)
    : null;

  if (!member) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-16 text-center animate-in fade-in duration-300">
        <h2 className="font-serif text-2xl font-bold text-primary dark:text-white">
          Staff Record Not Found
        </h2>
        <p className="text-xs text-charcoal-muted">
          No staff dossier found matching <span className="font-mono text-accent">{effectiveId || 'unknown'}</span>.
        </p>
        <div className="pt-2">
          <Button
            variant="gold"
            onClick={() => navigate('/hotel-admin/staff')}
          >
            ← Return to Staff Directory
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3 pt-1">
            <img
              src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
                  {member.name}
                </h1>
                <StatusBadge status={member.status} size="sm" />
              </div>
              <p className="text-xs text-accent font-medium mt-0.5">
                {member.role} • {member.department}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/hotel-admin/staff')}
          >
            Back to Directory
          </Button>
          <Button
            variant="gold"
            icon={Edit}
            onClick={() => navigate(`/hotel-admin/staff/edit/${member.id}`)}
          >
            Edit Staff Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Performance Rating</span>
              <p className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
                {member.performanceScore}%
              </p>
              <span className="text-[11px] text-charcoal-muted">Quality of service score</span>
            </Card>
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Operational Division</span>
              <p className="font-serif font-bold text-xl text-primary dark:text-white mt-1">
                {member.department}
              </p>
              <span className="text-[11px] text-charcoal-muted">Sovereign estate team</span>
            </Card>
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Duty Shift</span>
              <p className="font-semibold text-xs text-primary dark:text-white mt-2 font-mono">
                {member.shift}
              </p>
            </Card>
          </div>

          <Card variant="luxury" className="p-6 sm:p-8 space-y-5">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>Contact Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-mono">Internal Email</span>
                  <p className="font-semibold text-primary dark:text-white mt-0.5">{member.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-mono">Secure Extension</span>
                  <p className="font-semibold text-primary dark:text-white mt-0.5">{member.phone}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              <span>Clearance Overview</span>
            </h4>

            <div className="space-y-3 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Staff Identifier</span>
                <span className="font-mono font-bold text-primary dark:text-white">{member.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Hire Date</span>
                <span className="font-mono text-primary dark:text-white">{member.joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Clearance Status</span>
                <StatusBadge status={member.status} size="sm" />
              </div>
            </div>

            <Button
              variant="gold"
              icon={Edit}
              onClick={() => navigate(`/hotel-admin/staff/edit/${member.id}`)}
              className="w-full"
            >
              Modify Assignment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage;

