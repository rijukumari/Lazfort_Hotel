import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge, Modal, FormField, Input, Select } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Calendar,
  Clock,
  Users,
  Sun,
  Sunset,
  Moon,
  Plus,
  Edit2,
  Trash2,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  UserCheck
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const ShiftSchedulingPage = () => {
  const navigate = useNavigate();
  const { staff = [], updateStaff } = useERP();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Initial Schedule Data connected with staff records
  const [schedules, setSchedules] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_staff_shifts');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load shifts', e);
    }

    return [
      {
        id: 'SCH-01',
        staffId: 'stf-001',
        staffName: 'Sebastian Laurent',
        department: 'Concierge',
        designation: 'Head Concierge & Clefs d’Or',
        shiftName: 'Morning Shift',
        startTime: '07:00',
        endTime: '15:30',
        workingDays: 'Mon, Tue, Wed, Thu, Fri',
        status: 'active',
      },
      {
        id: 'SCH-02',
        staffId: 'stf-002',
        staffName: 'Camilla Valente',
        department: 'Front Desk',
        designation: 'Front Desk Lead Supervisor',
        shiftName: 'Morning Shift',
        startTime: '07:00',
        endTime: '15:30',
        workingDays: 'Mon, Tue, Wed, Thu, Fri',
        status: 'active',
      },
      {
        id: 'SCH-03',
        staffId: 'stf-003',
        staffName: 'Margaux Dubois',
        department: 'Housekeeping',
        designation: 'Executive Housekeeper',
        shiftName: 'General Shift',
        startTime: '08:30',
        endTime: '17:00',
        workingDays: 'Mon, Tue, Wed, Thu, Fri, Sat',
        status: 'active',
      },
      {
        id: 'SCH-04',
        staffId: 'stf-004',
        staffName: 'Julian Henderson',
        department: 'F&B Service',
        designation: 'Chef Sommelier & F&B Lead',
        shiftName: 'Evening Shift',
        startTime: '15:00',
        endTime: '23:30',
        workingDays: 'Wed, Thu, Fri, Sat, Sun',
        status: 'active',
      },
      {
        id: 'SCH-05',
        staffId: 'stf-005',
        staffName: 'Elena Rostova',
        department: 'Housekeeping',
        designation: 'Senior Housekeeping Specialist',
        shiftName: 'Night Shift',
        startTime: '23:00',
        endTime: '07:30',
        workingDays: 'Mon, Tue, Wed, Thu, Fri',
        status: 'on_leave',
      },
    ];
  });

  const persistSchedules = (list) => {
    setSchedules(list);
    try {
      localStorage.setItem('lazfort_staff_shifts', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save shifts', e);
    }
  };

  // Metrics
  const totalStaff = staff.length > 0 ? staff.length : 18;
  const activeScheduled = schedules.filter(s => s.status === 'active').length;
  const morningCount = schedules.filter(s => s.shiftName.includes('Morning') && s.status === 'active').length;
  const eveningCount = schedules.filter(s => s.shiftName.includes('Evening') && s.status === 'active').length;
  const nightCount = schedules.filter(s => s.shiftName.includes('Night') && s.status === 'active').length;
  const unassignedCount = Math.max(0, totalStaff - schedules.length);

  // Modal States
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    shiftName: 'Morning Shift',
    startTime: '07:00',
    endTime: '15:30',
    workingDays: 'Mon, Tue, Wed, Thu, Fri',
    status: 'active',
  });

  const handleOpenAssign = (existing = null) => {
    if (existing) {
      setEditingSchedule(existing);
      setFormData({
        staffId: existing.staffId,
        shiftName: existing.shiftName,
        startTime: existing.startTime,
        endTime: existing.endTime,
        workingDays: existing.workingDays,
        status: existing.status,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        staffId: staff[0]?.id || 'stf-001',
        shiftName: 'Morning Shift',
        startTime: '07:00',
        endTime: '15:30',
        workingDays: 'Mon, Tue, Wed, Thu, Fri',
        status: 'active',
      });
    }
    setAssignModalOpen(true);
  };

  const handleShiftPresetChange = (preset) => {
    let startTime = '07:00';
    let endTime = '15:30';
    if (preset === 'Evening Shift') {
      startTime = '15:00';
      endTime = '23:30';
    } else if (preset === 'Night Shift') {
      startTime = '23:00';
      endTime = '07:30';
    } else if (preset === 'General Shift') {
      startTime = '09:00';
      endTime = '17:30';
    }
    setFormData(prev => ({
      ...prev,
      shiftName: preset,
      startTime,
      endTime,
    }));
  };

  const handleSaveShift = (e) => {
    e.preventDefault();
    const assignedStaff = staff.find(s => s.id === formData.staffId) || {
      name: 'Staff Member',
      department: 'Operations',
      role: 'Associate',
    };

    if (editingSchedule) {
      const updated = schedules.map(s => {
        if (s.id === editingSchedule.id) {
          return {
            ...s,
            ...formData,
            staffName: assignedStaff.name,
            department: assignedStaff.department,
            designation: assignedStaff.role,
          };
        }
        return s;
      });
      persistSchedules(updated);
      showToast('Shift Updated', `Shift schedule updated for ${assignedStaff.name}.`, 'success');
    } else {
      const newSchedule = {
        id: `SCH-${Date.now().toString().slice(-4)}`,
        staffId: formData.staffId,
        staffName: assignedStaff.name,
        department: assignedStaff.department,
        designation: assignedStaff.role,
        shiftName: formData.shiftName,
        startTime: formData.startTime,
        endTime: formData.endTime,
        workingDays: formData.workingDays,
        status: formData.status,
      };
      persistSchedules([newSchedule, ...schedules]);
      showToast('Shift Assigned', `Assigned ${formData.shiftName} to ${assignedStaff.name}.`, 'success');
    }

    setAssignModalOpen(false);
  };

  const handleDeleteSchedule = (id) => {
    const updated = schedules.filter(s => s.id !== id);
    persistSchedules(updated);
    showToast('Shift Removed', 'Shift assignment deleted from roster.', 'info');
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Staff ID', 'Staff Name', 'Department', 'Designation', 'Shift Name', 'Hours', 'Days', 'Status'],
      ...schedules.map(s => [
        s.staffId,
        `"${s.staffName}"`,
        `"${s.department}"`,
        `"${s.designation}"`,
        `"${s.shiftName}"`,
        `${s.startTime} - ${s.endTime}`,
        `"${s.workingDays}"`,
        s.status,
      ]),
    ];
    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Staff_Shift_Schedule_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Schedule Exported', 'Shift roster downloaded as CSV.', 'success');
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      const matchDept = departmentFilter === 'all' || s.department.toLowerCase() === departmentFilter.toLowerCase();
      const matchShift = shiftFilter === 'all' || s.shiftName.toLowerCase().includes(shiftFilter.toLowerCase());
      return matchDept && matchShift;
    });
  }, [schedules, departmentFilter, shiftFilter]);

  const departments = Array.from(new Set(schedules.map(s => s.department)));

  const columns = [
    {
      key: 'staffId',
      header: 'Staff ID',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-accent text-xs">{item.staffId}</span>
      ),
    },
    {
      key: 'staffName',
      header: 'Staff Member',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.staffName}</p>
          <span className="text-[11px] text-charcoal-muted">{item.designation}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: item => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-light/10 dark:bg-white/10 text-primary dark:text-white">
          {item.department}
        </span>
      ),
    },
    {
      key: 'shiftName',
      header: 'Shift Assignment',
      sortable: true,
      render: item => {
        let icon = <Sun className="w-3.5 h-3.5 text-amber-500" />;
        if (item.shiftName.includes('Evening')) icon = <Sunset className="w-3.5 h-3.5 text-orange-500" />;
        if (item.shiftName.includes('Night')) icon = <Moon className="w-3.5 h-3.5 text-indigo-400" />;

        return (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {icon}
            <span className="font-semibold">{item.shiftName}</span>
          </div>
        );
      },
    },
    {
      key: 'hours',
      header: 'Shift Hours',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-300">
          {item.startTime} → {item.endTime}
        </span>
      ),
    },
    {
      key: 'workingDays',
      header: 'Working Days',
      sortable: true,
      render: item => (
        <span className="text-xs text-charcoal-muted font-sans line-clamp-1 max-w-[150px]">
          {item.workingDays}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          item.status === 'active'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
        }`}>
          {item.status === 'active' ? 'On Duty' : 'On Leave'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenAssign(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Shift Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteSchedule(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Remove Shift"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Staff Shift Scheduling & Roster"
        description="Comprehensive workforce duty management — Morning, evening, and night shift rotations, departmental coverage telemetry, and timetable assignment."
        badge={`${activeScheduled} Personnel On Duty`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export Schedule
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => handleOpenAssign()}
            >
              Assign New Shift
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Staff"
          value={totalStaff}
          change="All Departments"
          isPositive={true}
          icon={Users}
          subtitle="Registered staff count"
        />
        <StatCard
          title="Scheduled On Duty"
          value={activeScheduled}
          change="Full hotel coverage"
          isPositive={true}
          icon={UserCheck}
          subtitle="Currently active"
        />
        <StatCard
          title="Morning Shift"
          value={morningCount}
          change="07:00 - 15:30"
          isPositive={true}
          icon={Sun}
          subtitle="Concierge & Breakfast"
        />
        <StatCard
          title="Evening Shift"
          value={eveningCount}
          change="15:00 - 23:30"
          isPositive={true}
          icon={Sunset}
          subtitle="Fine Dining & Turn-down"
        />
        <StatCard
          title="Night Shift"
          value={nightCount}
          change="23:00 - 07:30"
          isPositive={true}
          icon={Moon}
          subtitle="Security & Night Audit"
        />
      </div>

      {/* Controls Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-charcoal-muted">Department:</span>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <span className="text-xs font-semibold text-charcoal-muted ml-2">Shift Type:</span>
          <select
            value={shiftFilter}
            onChange={e => setShiftFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning Shift</option>
            <option value="evening">Evening Shift</option>
            <option value="night">Night Shift</option>
            <option value="general">General Shift</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="p-1 rounded-xl bg-charcoal-light/10 dark:bg-white/5 border border-border/80 dark:border-white/10 flex text-xs">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'table' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Schedule Table
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'calendar' ? 'bg-accent text-primary dark:text-white shadow-sm' : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Weekly Roster View
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <DataTable
          data={filteredSchedules}
          columns={columns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search schedule by staff name, ID, or designation..."
          pageSize={8}
        />
      )}

      {/* WEEKLY CALENDAR ROSTER VIEW */}
      {viewMode === 'calendar' && (
        <div className="card-luxury-3d p-6 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-4">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-accent" />
              Weekly Departmental Duty Calendar
            </h3>
            <span className="text-xs text-charcoal-muted font-mono">Current Week • Lazfort Palace Monaco</span>
          </div>

          <div className="grid grid-cols-7 gap-3 min-w-[850px]">
            {weekDays.map(day => (
              <div key={day} className="space-y-2">
                <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-center">
                  <span className="font-bold text-xs text-primary dark:text-white">{day}</span>
                </div>

                <div className="space-y-2 min-h-[300px] p-2 rounded-xl bg-charcoal-light/5 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                  {filteredSchedules.map(sch => (
                    <div
                      key={`${day}-${sch.id}`}
                      onClick={() => handleOpenAssign(sch)}
                      className="p-2 rounded-lg border border-border/80 dark:border-white/10 bg-white/70 dark:bg-primary-900/60 hover:border-accent cursor-pointer transition-all space-y-1"
                    >
                      <p className="font-semibold text-[11px] text-primary dark:text-white line-clamp-1">{sch.staffName}</p>
                      <span className="block text-[10px] text-accent font-medium">{sch.shiftName.split(' ')[0]}</span>
                      <span className="block text-[9px] font-mono text-charcoal-muted">{sch.startTime}-{sch.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign / Edit Shift Modal */}
      {assignModalOpen && (
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title={editingSchedule ? `Edit Shift: ${editingSchedule.staffName}` : 'Assign Shift Schedule'}
        >
          <form onSubmit={handleSaveShift} className="space-y-4">
            <FormField label="Select Staff Member">
              <Select
                value={formData.staffId}
                onChange={e => setFormData({ ...formData, staffId: e.target.value })}
                options={staff.map(s => ({
                  value: s.id,
                  label: `${s.name} (${s.department} - ${s.role})`
                }))}
                required
              />
            </FormField>

            <FormField label="Shift Template Preset">
              <Select
                value={formData.shiftName}
                onChange={e => handleShiftPresetChange(e.target.value)}
                options={[
                  { value: 'Morning Shift', label: 'Morning Shift (07:00 - 15:30)' },
                  { value: 'Evening Shift', label: 'Evening Shift (15:00 - 23:30)' },
                  { value: 'Night Shift', label: 'Night Shift (23:00 - 07:30)' },
                  { value: 'General Shift', label: 'General Shift (09:00 - 17:30)' },
                  { value: 'Custom Shift', label: 'Custom Shift (Manual Hours)' },
                ]}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Time">
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="End Time">
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Working Days (Weekly)">
              <Input
                value={formData.workingDays}
                onChange={e => setFormData({ ...formData, workingDays: e.target.value })}
                placeholder="e.g. Mon, Tue, Wed, Thu, Fri"
                required
              />
            </FormField>

            <FormField label="Shift Assignment Status">
              <Select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'active', label: 'Active (On Duty)' },
                  { value: 'on_leave', label: 'On Leave / Off-Duty' },
                ]}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Save & Assign Shift
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ShiftSchedulingPage;

