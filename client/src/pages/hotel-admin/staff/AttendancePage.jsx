import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader, StatCard, Button, StatusBadge, Modal, FormField, Input, Select } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarOff,
  Filter,
  Download,
  Plus,
  Eye,
  Edit2,
  Calendar,
  Building,
  UserCheck,
  Search,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

const INITIAL_ATTENDANCE = [
  {
    id: 'ATT-101',
    staffId: 'stf-001',
    name: 'Sebastian Laurent',
    department: 'Concierge',
    date: new Date().toISOString().split('T')[0],
    checkIn: '07:02 AM',
    checkOut: '03:35 PM',
    workingHours: '8.5 hrs',
    status: 'Present',
    notes: 'Punctual arrival. Handled VIP Lord Sterling check-in protocol.'
  },
  {
    id: 'ATT-102',
    staffId: 'stf-002',
    name: 'Camilla Valente',
    department: 'Front Desk',
    date: new Date().toISOString().split('T')[0],
    checkIn: '07:18 AM',
    checkOut: '03:30 PM',
    workingHours: '8.2 hrs',
    status: 'Late',
    notes: 'Traffic delay along coastal corniche route. Notified concierge supervisor.'
  },
  {
    id: 'ATT-103',
    staffId: 'stf-003',
    name: 'Margaux Dubois',
    department: 'Housekeeping',
    date: new Date().toISOString().split('T')[0],
    checkIn: '06:55 AM',
    checkOut: '03:30 PM',
    workingHours: '8.5 hrs',
    status: 'Present',
    notes: 'Early check-in. Conducted morning penthouse white-glove inspection.'
  },
  {
    id: 'ATT-104',
    staffId: 'stf-004',
    name: 'Julian Henderson',
    department: 'Haute Cuisine',
    date: new Date().toISOString().split('T')[0],
    checkIn: '02:58 PM',
    checkOut: '11:30 PM',
    workingHours: '8.5 hrs',
    status: 'Present',
    notes: 'Executive evening shift dinner service & sommelier wine service.'
  },
  {
    id: 'ATT-105',
    staffId: 'stf-005',
    name: 'Elena Rostova',
    department: 'Housekeeping',
    date: new Date().toISOString().split('T')[0],
    checkIn: '—',
    checkOut: '—',
    workingHours: '0.0 hrs',
    status: 'On Leave',
    notes: 'Approved medical leave request recorded in HR records.'
  },
  {
    id: 'ATT-106',
    staffId: 'stf-006',
    name: 'Jean-Luc Delacroix',
    department: 'Engineering',
    date: new Date().toISOString().split('T')[0],
    checkIn: '—',
    checkOut: '—',
    workingHours: '0.0 hrs',
    status: 'Absent',
    notes: 'Unplanned absence. Shift lead contacted on emergency cellular.'
  }
];

export const AttendancePage = () => {
  const { staff = [] } = useERP();
  const { showToast } = useToast();

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_attendance_records');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load attendance records', e);
    }
    return INITIAL_ATTENDANCE;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lazfort_attendance_records', JSON.stringify(attendanceRecords));
    } catch (e) {
      console.warn('Failed to save attendance records', e);
    }
  }, [attendanceRecords]);

  // Filters state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    department: 'Front Desk',
    date: todayStr,
    checkIn: '07:00 AM',
    checkOut: '03:30 PM',
    workingHours: '8.5 hrs',
    status: 'Present',
    notes: ''
  });

  // KPI Metrics (for selected date or entire active view)
  const relevantRecords = useMemo(() => {
    return attendanceRecords.filter(r => !selectedDate || r.date === selectedDate);
  }, [attendanceRecords, selectedDate]);

  const totalEmployees = relevantRecords.length;
  const presentCount = relevantRecords.filter(r => r.status === 'Present').length;
  const absentCount = relevantRecords.filter(r => r.status === 'Absent').length;
  const lateCount = relevantRecords.filter(r => r.status === 'Late').length;
  const onLeaveCount = relevantRecords.filter(r => r.status === 'On Leave').length;

  // Department options list
  const departmentsList = useMemo(() => {
    const set = new Set(attendanceRecords.map(r => r.department));
    return ['All', ...Array.from(set)];
  }, [attendanceRecords]);

  // Filtered Table Data
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(r => {
      const matchesDate = !selectedDate || r.date === selectedDate;
      const matchesDept = selectedDepartment === 'All' || r.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesDate && matchesDept && matchesStatus && matchesSearch;
    });
  }, [attendanceRecords, selectedDate, selectedDepartment, selectedStatus, searchQuery]);

  // Actions
  const handleOpenMarkAttendance = () => {
    const firstStaff = staff[0] || { id: 'stf-001', name: 'Sebastian Laurent', department: 'Concierge' };
    setFormData({
      staffId: firstStaff.id,
      name: firstStaff.name,
      department: firstStaff.department || 'Concierge',
      date: selectedDate || todayStr,
      checkIn: '07:00 AM',
      checkOut: '03:30 PM',
      workingHours: '8.5 hrs',
      status: 'Present',
      notes: 'Biometric fingerprint verified at staff security portal.'
    });
    setIsMarkModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setSelectedRecord(rec);
    setFormData({
      staffId: rec.staffId,
      name: rec.name,
      department: rec.department,
      date: rec.date,
      checkIn: rec.checkIn,
      checkOut: rec.checkOut,
      workingHours: rec.workingHours,
      status: rec.status,
      notes: rec.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleOpenHistory = (rec) => {
    setSelectedRecord(rec);
    setIsHistoryModalOpen(true);
  };

  const handleStaffSelect = (staffId) => {
    const found = staff.find(s => s.id === staffId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        staffId: found.id,
        name: found.name,
        department: found.department || 'Hospitality'
      }));
    }
  };

  const handleSaveMark = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Validation Error', 'Please select or enter staff member name.', 'error');
      return;
    }

    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      staffId: formData.staffId || `stf-${Date.now().toString().slice(-3)}`,
      name: formData.name.trim(),
      department: formData.department,
      date: formData.date,
      checkIn: formData.status === 'Absent' || formData.status === 'On Leave' ? '—' : formData.checkIn,
      checkOut: formData.status === 'Absent' || formData.status === 'On Leave' ? '—' : formData.checkOut,
      workingHours: formData.status === 'Absent' || formData.status === 'On Leave' ? '0.0 hrs' : formData.workingHours,
      status: formData.status,
      notes: formData.notes.trim()
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    setIsMarkModalOpen(false);
    showToast('Attendance Logged', `Logged status "${newRecord.status}" for ${newRecord.name}.`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setAttendanceRecords(prev =>
      prev.map(r =>
        r.id === selectedRecord.id
          ? {
              ...r,
              date: formData.date,
              checkIn: formData.status === 'Absent' || formData.status === 'On Leave' ? '—' : formData.checkIn,
              checkOut: formData.status === 'Absent' || formData.status === 'On Leave' ? '—' : formData.checkOut,
              workingHours: formData.status === 'Absent' || formData.status === 'On Leave' ? '0.0 hrs' : formData.workingHours,
              status: formData.status,
              notes: formData.notes.trim()
            }
          : r
      )
    );

    setIsEditModalOpen(false);
    showToast('Record Updated', `Attendance for ${formData.name} updated successfully.`, 'success');
  };

  // Export CSV Report
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showToast('No Records', 'There are no records to export.', 'error');
      return;
    }

    const headers = ['Record ID', 'Employee ID', 'Name', 'Department', 'Date', 'Check-In', 'Check-Out', 'Working Hours', 'Status', 'Notes'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.staffId,
      `"${r.name}"`,
      `"${r.department}"`,
      r.date,
      r.checkIn,
      r.checkOut,
      r.workingHours,
      r.status,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LAZFORT_Attendance_Report_${selectedDate || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'Attendance CSV report downloaded successfully.', 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Present
          </span>
        );
      case 'Late':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/25 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> Late
          </span>
        );
      case 'On Leave':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/25 inline-flex items-center gap-1">
            <CalendarOff className="w-3 h-3" /> On Leave
          </span>
        );
      case 'Absent':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-500 border border-rose-500/25 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Absent
          </span>
        );
    }
  };

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'staffId',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
          {row.staffId}
        </span>
      )
    },
    {
      header: 'Employee Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight">{row.name}</p>
            <p className="text-[10px] text-charcoal-muted font-mono">{row.date}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-charcoal dark:text-gray-200">
          {row.department}
        </span>
      )
    },
    {
      header: 'Check-In',
      accessor: 'checkIn',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-300">
          {row.checkIn}
        </span>
      )
    },
    {
      header: 'Check-Out',
      accessor: 'checkOut',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-300">
          {row.checkOut}
        </span>
      )
    },
    {
      header: 'Working Hours',
      accessor: 'workingHours',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary dark:text-white bg-ivory dark:bg-white/5 px-2 py-0.5 rounded border border-border/60 dark:border-white/10">
          {row.workingHours}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => getStatusBadge(row.status)
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenHistory(row)}
            className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
            title="View Attendance History"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Attendance Record"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Employee Attendance Roster"
        description="Daily biometric verification logs, check-in timestamps, working durations, and departmental attendance reports."
        badge="Biometric Tracking"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export Report
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={handleOpenMarkAttendance}
            >
              Mark Attendance
            </Button>
          </div>
        }
      />

      {/* 5 Metric Cards per specification */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          subtitle="Rostered for shift"
        />
        <StatCard
          title="Present"
          value={presentCount}
          icon={CheckCircle2}
          subtitle="On-duty stations"
        />
        <StatCard
          title="Absent"
          value={absentCount}
          icon={XCircle}
          subtitle="Unexcused / missing"
        />
        <StatCard
          title="Late"
          value={lateCount}
          icon={Clock}
          subtitle="Exceeded grace grace"
        />
        <StatCard
          title="On Leave"
          value={onLeaveCount}
          icon={CalendarOff}
          subtitle="Authorized PTO/leave"
        />
      </div>

      {/* Filters Strip per specification: Date & Department filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/80 dark:bg-[#111827]/90 p-3.5 rounded-2xl border border-border/80 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Date Picker Filter */}
          <div className="flex items-center gap-2 bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/10 px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-accent shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-primary dark:text-white font-medium focus:outline-none cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-[10px] text-accent hover:underline ml-1"
                title="View All Dates"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/10 px-3 py-1.5 rounded-xl">
            <Building className="w-4 h-4 text-accent shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-xs text-primary dark:text-white font-medium focus:outline-none cursor-pointer"
            >
              {departmentsList.map(dept => (
                <option key={dept} value={dept} className="bg-white dark:bg-[#111827] text-primary dark:text-white">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/10 px-3 py-1.5 rounded-xl">
            <Filter className="w-4 h-4 text-accent shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-primary dark:text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-[#111827]">All Statuses</option>
              <option value="Present" className="bg-white dark:bg-[#111827]">Present</option>
              <option value="Late" className="bg-white dark:bg-[#111827]">Late</option>
              <option value="Absent" className="bg-white dark:bg-[#111827]">Absent</option>
              <option value="On Leave" className="bg-white dark:bg-[#111827]">On Leave</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search employee name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-ivory/50 dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        keyField="id"
        pageSize={8}
        emptyMessage="No attendance records found for this date and filter selection."
      />

      {/* MARK ATTENDANCE MODAL */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Mark Employee Attendance"
        size="md"
      >
        <form onSubmit={handleSaveMark} className="space-y-4">
          <FormField label="Select Employee" required>
            <select
              value={formData.staffId}
              onChange={(e) => handleStaffSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-ivory/50 dark:bg-white/5 border border-border/80 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium"
            >
              {staff.length > 0 ? (
                staff.map(s => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-[#111827]">
                    {s.name} ({s.department} • {s.id})
                  </option>
                ))
              ) : (
                <option value="stf-001">Sebastian Laurent (Concierge • stf-001)</option>
              )}
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Attendance Date" required>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Status" required>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Present', label: 'Present' },
                  { value: 'Late', label: 'Late' },
                  { value: 'Absent', label: 'Absent' },
                  { value: 'On Leave', label: 'On Leave' }
                ]}
              />
            </FormField>
          </div>

          {formData.status !== 'Absent' && formData.status !== 'On Leave' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Check-In Time">
                <Input
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                />
              </FormField>
              <FormField label="Check-Out Time">
                <Input
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                />
              </FormField>
              <FormField label="Working Hours">
                <Input
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                />
              </FormField>
            </div>
          )}

          <FormField label="Log Notes / Biometric Observations">
            <textarea
              rows={3}
              placeholder="e.g. Cleared biometric check. Stationed at East Concierge desk..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-ivory/50 dark:bg-white/5 border border-border/80 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent resize-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/60 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" icon={Check} type="submit">
              Record Attendance
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT ATTENDANCE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Attendance Entry"
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="p-3 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10 flex items-center justify-between">
            <div>
              <p className="font-semibold text-xs text-primary dark:text-white">{formData.name}</p>
              <p className="text-[11px] text-charcoal-muted font-mono">{formData.department} • {formData.staffId}</p>
            </div>
            <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              {formData.date}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date" required>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Status" required>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Present', label: 'Present' },
                  { value: 'Late', label: 'Late' },
                  { value: 'Absent', label: 'Absent' },
                  { value: 'On Leave', label: 'On Leave' }
                ]}
              />
            </FormField>
          </div>

          {formData.status !== 'Absent' && formData.status !== 'On Leave' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Check-In Time">
                <Input
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                />
              </FormField>
              <FormField label="Check-Out Time">
                <Input
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                />
              </FormField>
              <FormField label="Working Hours">
                <Input
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                />
              </FormField>
            </div>
          )}

          <FormField label="Reason for Correction / Notes">
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-ivory/50 dark:bg-white/5 border border-border/80 dark:border-white/10 rounded-xl text-xs text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent resize-none"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/60 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              Update Entry
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW ATTENDANCE HISTORY MODAL */}
      {selectedRecord && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title="Employee Attendance Dossier"
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-border/60 dark:border-white/10">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-lg font-bold">
                {selectedRecord.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  {selectedRecord.name}
                </h3>
                <p className="text-xs text-accent font-medium">
                  {selectedRecord.department} • <span className="font-mono text-charcoal-muted">{selectedRecord.staffId}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Log Date</span>
                <span className="text-xs font-bold text-primary dark:text-white mt-0.5 block font-mono">
                  {selectedRecord.date}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Status</span>
                <div className="mt-1">
                  {getStatusBadge(selectedRecord.status)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Check-In / Out</span>
                <span className="text-xs font-semibold text-primary dark:text-white mt-0.5 block font-mono">
                  {selectedRecord.checkIn} → {selectedRecord.checkOut}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Total Shift Hours</span>
                <span className="text-xs font-bold text-accent mt-0.5 block font-mono">
                  {selectedRecord.workingHours}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block mb-1">Dossier Notes</span>
              <p className="text-xs text-charcoal dark:text-gray-300 leading-relaxed bg-ivory/40 dark:bg-white/[0.02] p-3 rounded-xl border border-border/60 dark:border-white/10">
                {selectedRecord.notes || 'No biometric annotations recorded.'}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/60 dark:border-white/10">
              <Button
                variant="outline"
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  handleOpenEdit(selectedRecord);
                }}
              >
                Edit Entry
              </Button>
              <Button variant="gold" onClick={() => setIsHistoryModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AttendancePage;
