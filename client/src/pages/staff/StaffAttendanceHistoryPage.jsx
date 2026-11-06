import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import {
  CalendarCheck,
  Search,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Calendar,
  Filter
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffAttendanceHistoryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [attendanceRecords] = useState([
    {
      id: 'ATT-2026-11-04',
      date: 'Wed, Nov 04, 2026',
      checkIn: '07:02 AM',
      checkOut: 'Active',
      workHours: '4h 12m',
      status: 'Present',
      overtime: '0.0h',
      verification: 'Biometric Verified',
    },
    {
      id: 'ATT-2026-11-03',
      date: 'Tue, Nov 03, 2026',
      checkIn: '07:00 AM',
      checkOut: '03:32 PM',
      workHours: '8h 32m',
      status: 'Present',
      overtime: '0.5h',
      verification: 'Biometric Verified',
    },
    {
      id: 'ATT-2026-11-02',
      date: 'Mon, Nov 02, 2026',
      checkIn: '06:58 AM',
      checkOut: '03:30 PM',
      workHours: '8h 32m',
      status: 'Present',
      overtime: '0.5h',
      verification: 'Biometric Verified',
    },
    {
      id: 'ATT-2026-11-01',
      date: 'Sun, Nov 01, 2026',
      checkIn: '—',
      checkOut: '—',
      workHours: '0h 00m',
      status: 'Rest Day',
      overtime: '0.0h',
      verification: 'Roster Scheduled Off',
    },
    {
      id: 'ATT-2026-10-31',
      date: 'Sat, Oct 31, 2026',
      checkIn: '—',
      checkOut: '—',
      workHours: '0h 00m',
      status: 'Rest Day',
      overtime: '0.0h',
      verification: 'Roster Scheduled Off',
    },
    {
      id: 'ATT-2026-10-30',
      date: 'Fri, Oct 30, 2026',
      checkIn: '07:12 AM',
      checkOut: '03:35 PM',
      workHours: '8h 23m',
      status: 'Late Arrival',
      overtime: '0.0h',
      verification: 'Biometric Verified (+12m)',
    },
    {
      id: 'ATT-2026-10-29',
      date: 'Thu, Oct 29, 2026',
      checkIn: '07:01 AM',
      checkOut: '03:30 PM',
      workHours: '8h 29m',
      status: 'Present',
      overtime: '0.5h',
      verification: 'Biometric Verified',
    },
  ]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || r.date.toLowerCase().includes(q) || r.status.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [attendanceRecords, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Clock In', 'Clock Out', 'Duration', 'Overtime', 'Status', 'Verification'];
    const rows = filteredRecords.map(r => [
      `"${r.date}"`,
      `"${r.checkIn}"`,
      `"${r.checkOut}"`,
      `"${r.workHours}"`,
      `"${r.overtime}"`,
      `"${r.status}"`,
      `"${r.verification}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Staff_Attendance_History_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Completed', 'Monthly attendance timecard downloaded.', 'success');
  };

  const columns = [
    {
      key: 'date',
      header: 'Duty Date',
      render: (r) => (
        <span className="font-serif font-bold text-sm text-primary dark:text-white">
          {r.date}
        </span>
      ),
    },
    {
      key: 'checkIn',
      header: 'Biometric In',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-emerald-400">
          {r.checkIn}
        </span>
      ),
    },
    {
      key: 'checkOut',
      header: 'Biometric Out',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-accent">
          {r.checkOut}
        </span>
      ),
    },
    {
      key: 'workHours',
      header: 'Duration',
      render: (r) => (
        <div className="flex items-center gap-1.5 text-xs font-mono text-charcoal dark:text-gray-300">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{r.workHours}</span>
        </div>
      ),
    },
    {
      key: 'overtime',
      header: 'Overtime',
      render: (r) => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-400">
          {r.overtime}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Duty Record Status',
      render: (r) => (
        <StatusBadge
          status={r.status === 'Present' ? 'completed' : r.status === 'Late Arrival' ? 'cancelled' : 'pending'}
          label={r.status}
        />
      ),
    },
    {
      key: 'verification',
      header: 'Terminal Auth',
      render: (r) => (
        <span className="badge badge-gold font-mono text-[9px] px-2 py-0.5">
          {r.verification}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Attendance History & Timecards"
        subtitle="Complete daily punch records, biometric audit logs, overtime credits, and shift validations."
        icon={CalendarCheck}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Fingerprint}
              onClick={() => navigate('/staff/attendance/check-in')}
            >
              Clock Terminal
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Days Logged (Month)"
          value="24 Days"
          subtitle="98% on-time attendance"
          icon={CalendarCheck}
        />
        <StatCard
          title="Total Hours Worked"
          value="182.5 hrs"
          subtitle="Standard 40h weekly baseline"
          icon={Clock}
        />
        <StatCard
          title="Approved Overtime"
          value="+6.5 hrs"
          subtitle="VIP Monaco Grand Prix shifts"
          icon={CheckCircle2}
        />
        <StatCard
          title="Tardiness / Incidents"
          value="1 Instance"
          subtitle="Resolved with supervisor"
          icon={AlertTriangle}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by date or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Late Arrival">Late Arrival</option>
              <option value="Rest Day">Rest Day</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredRecords}
          keyField="id"
          pagination={true}
          pageSize={7}
          emptyMessage="No attendance history records match your search filter."
        />
      </div>
    </div>
  );
};

export default StaffAttendanceHistoryPage;

