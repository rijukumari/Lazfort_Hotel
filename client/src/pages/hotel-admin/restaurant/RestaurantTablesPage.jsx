import React, { useState, useMemo } from 'react';
import {
  Grid,
  Plus,
  Search,
  Filter,
  Users,
  CalendarCheck,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  MapPin,
  ArrowLeft,
  Save,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  RestaurantStatCard,
  RestaurantNavTabs,
  RestaurantSearch,
  RestaurantFilters,
  RestaurantDataTable,
  TableStatusBadge,
  DeleteConfirmationDialog,
} from '../../../components/restaurant';

const SECTIONS = ['all', 'Main Salon', 'Terrace Riviera', 'Private Dining Vault', 'Rooftop Lounge', 'Garden Gazebo'];
const SECTION_LIST = ['Main Salon', 'Terrace Riviera', 'Private Dining Vault', 'Rooftop Lounge', 'Garden Gazebo'];
const STATUS_OPTIONS = ['all', 'Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];
const STATUS_LIST = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];

export const RestaurantTablesPage = () => {
  const {
    restaurantTables = [],
    addRestaurantTable,
    updateRestaurantTable,
    deleteRestaurantTable,
    updateRestaurantTableStatus,
    reserveRestaurantTable
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('floor'); // 'floor' | 'table'

  // Dedicated Page State: 'list' | 'create' | 'edit'
  const [pageView, setPageView] = useState('list');
  const [tableToEdit, setTableToEdit] = useState(null);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '4',
    section: 'Main Salon',
    status: 'Available',
    assignedGuest: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const startCreate = () => {
    setTableToEdit(null);
    setFormData({
      tableNumber: `T-${Math.floor(10 + Math.random() * 90)}`,
      capacity: '4',
      section: 'Main Salon',
      status: 'Available',
      assignedGuest: '',
      notes: '',
    });
    setFormErrors({});
    setPageView('create');
  };

  const startEdit = (tbl) => {
    setTableToEdit(tbl);
    setFormData({
      tableNumber: tbl.tableNumber || '',
      capacity: (tbl.capacity || 4).toString(),
      section: tbl.section || 'Main Salon',
      status: tbl.status || 'Available',
      assignedGuest: tbl.assignedGuest || '',
      notes: tbl.notes || '',
    });
    setFormErrors({});
    setPageView('edit');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.tableNumber.trim()) errs.tableNumber = 'Table identifier is required.';
    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be at least 1 guest.';
    }
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const payload = {
      ...formData,
      capacity: Number(formData.capacity)
    };

    if (tableToEdit) {
      updateRestaurantTable(tableToEdit.id, payload);
      showToast('Table Updated', `Table ${formData.tableNumber} specifications updated.`, 'success');
    } else {
      addRestaurantTable(payload);
      showToast('Table Registered', `Table ${formData.tableNumber} added to dining floor plan.`, 'success');
    }
    setPageView('list');
  };

  // Filtered Tables
  const filteredTables = useMemo(() => {
    return restaurantTables.filter(t => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.tableNumber?.toLowerCase().includes(q) ||
        t.section?.toLowerCase().includes(q) ||
        (t.assignedGuest && t.assignedGuest.toLowerCase().includes(q));

      const matchesSec = selectedSection === 'all' || t.section === selectedSection;
      const matchesSt = selectedStatus === 'all' || t.status === selectedStatus;

      return matchesSearch && matchesSec && matchesSt;
    });
  }, [restaurantTables, searchQuery, selectedSection, selectedStatus]);

  const handleQuickStatusChange = (tbl, newStatus, e) => {
    e.stopPropagation();
    updateRestaurantTableStatus(tbl.id, newStatus);
    showToast('Table Status Updated', `Table ${tbl.tableNumber} is now ${newStatus}.`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!tableToDelete) return;
    deleteRestaurantTable(tableToDelete.id);
    showToast('Table Removed', `Table ${tableToDelete.tableNumber} deleted from floor map.`, 'success');
    setTableToDelete(null);
  };

  // Stats
  const totalTables = restaurantTables.length;
  const availableTables = restaurantTables.filter(t => t.status === 'Available').length;
  const occupiedTables = restaurantTables.filter(t => t.status === 'Occupied').length;
  const reservedTables = restaurantTables.filter(t => t.status === 'Reserved').length;

  const columns = [
    {
      key: 'tableNumber',
      header: 'Table Ref',
      sortable: true,
      render: t => <span className="font-mono text-xs font-bold text-accent">{t.tableNumber}</span>,
    },
    {
      key: 'section',
      header: 'Dining Section',
      sortable: true,
      render: t => (
        <span className="text-xs font-medium text-primary dark:text-gray-300">
          {t.section || 'Main Salon'}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Seating Capacity',
      sortable: true,
      render: t => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400 flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-accent" />
          <span>{t.capacity} Guests</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Floor Status',
      sortable: true,
      render: t => <TableStatusBadge status={t.status} />,
    },
    {
      key: 'assignedGuest',
      header: 'Assigned Guest',
      render: t => (
        <span className="text-xs text-primary dark:text-white font-medium">
          {t.assignedGuest || <span className="text-charcoal-muted/60 dark:text-gray-500">—</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: t => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => startEdit(t)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Configure Table"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setTableToDelete(t);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-charcoal-muted hover:text-rose-600 transition-colors"
            title="Delete Table"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Dedicated Full Page Table Configuration View
  if (pageView === 'create' || pageView === 'edit') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-[#101725] text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Tables Floor Map</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#101725]/90 backdrop-blur-xl border border-accent/30 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                {pageView === 'edit' ? `Configure Table: ${tableToEdit?.tableNumber}` : 'Register New Dining Table'}
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Salon seating assignment, covers capacity and VIP salon reservations
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Table Identifier / Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tableNumber}
                  onChange={e => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="e.g. T-12 or VIP-01"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono font-bold"
                />
                {formErrors.tableNumber && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.tableNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Seating Capacity (Guests) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
                {formErrors.capacity && (
                  <p className="mt-1 text-[11px] text-rose-500">{formErrors.capacity}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Dining Salon Section
                </label>
                <select
                  value={formData.section}
                  onChange={e => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {SECTION_LIST.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Floor Service Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {STATUS_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Reserved / Assigned Guest Name
              </label>
              <input
                type="text"
                value={formData.assignedGuest}
                onChange={e => setFormData({ ...formData, assignedGuest: e.target.value })}
                placeholder="e.g. Lord Harrington (Suite 701) or Leave empty if vacant"
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Service Directives & Sommelier Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Special table preparation, celebratory champagne arrangement, window request..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{pageView === 'edit' ? 'Update Table' : 'Save Table to Floor Plan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Restaurant Tables & Floor Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Seating Plan
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Real-time table occupancy, salon sections, and luxury reservation placements.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dining Table</span>
        </button>
      </div>



      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RestaurantStatCard
          title="Total Tables"
          value={totalTables}
          subtitle="All salons & terraces"
          icon={Grid}
        />
        <RestaurantStatCard
          title="Available Now"
          value={availableTables}
          subtitle="Ready for seating"
          icon={CheckCircle}
        />
        <RestaurantStatCard
          title="Occupied"
          value={occupiedTables}
          subtitle="Active dining service"
          icon={Users}
        />
        <RestaurantStatCard
          title="Reserved"
          value={reservedTables}
          subtitle="Upcoming seatings"
          icon={CalendarCheck}
        />
      </div>

      {/* Filters & Floor Map Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <RestaurantSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search table number, section, or guest..."
          />

          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
          >
            {SECTIONS.map(sec => (
              <option key={sec} value={sec}>
                {sec === 'all' ? 'All Sections' : sec}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
          >
            {STATUS_OPTIONS.map(st => (
              <option key={st} value={st}>
                {st === 'all' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 self-end md:self-center p-1 rounded-xl bg-ivory dark:bg-white/5 border border-border/80 dark:border-white/10">
          <button
            onClick={() => setViewMode('floor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'floor'
                ? 'bg-accent text-white dark:text-primary-950 shadow-sm'
                : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            Floor Visual
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-accent text-white dark:text-primary-950 shadow-sm'
                : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
            }`}
          >
            List Table
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {viewMode === 'table' ? (
        <RestaurantDataTable
          columns={columns}
          data={filteredTables}
          emptyTitle="No tables match your filter criteria"
          emptyDescription="Try clearing filters or add a table to the floor plan."
          emptyActionLabel="Add Table"
          onEmptyAction={startCreate}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTables.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-charcoal-muted">
              No tables found in this section or status.
            </div>
          ) : (
            filteredTables.map(tbl => (
              <div
                key={tbl.id}
                onClick={() => startEdit(tbl)}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-200 cursor-pointer hover:shadow-gold hover:-translate-y-1 flex flex-col justify-between space-y-3 ${
                  tbl.status === 'Available'
                    ? 'bg-white/80 dark:bg-[#101725]/90 border-emerald-500/30'
                    : tbl.status === 'Occupied'
                      ? 'bg-white/80 dark:bg-[#101725]/90 border-rose-500/30'
                      : tbl.status === 'Reserved'
                        ? 'bg-white/80 dark:bg-[#101725]/90 border-amber-500/30'
                        : 'bg-white/80 dark:bg-[#101725]/90 border-border/80 dark:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-primary dark:text-white">
                        {tbl.tableNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                      {tbl.section}
                    </p>
                  </div>
                  <TableStatusBadge status={tbl.status} size="sm" />
                </div>

                <div className="p-2.5 rounded-xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Capacity:</span>
                    <span className="font-semibold text-primary dark:text-white">{tbl.capacity} Guests</span>
                  </div>
                  {tbl.assignedGuest ? (
                    <div className="flex justify-between text-charcoal-muted truncate">
                      <span>Guest:</span>
                      <span className="font-semibold text-accent truncate max-w-[120px]">{tbl.assignedGuest}</span>
                    </div>
                  ) : null}
                </div>

                {/* Quick Status Control */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60 dark:border-white/5 text-[11px]">
                  <span className="text-charcoal-muted">Set:</span>
                  <div className="flex items-center gap-1">
                    {tbl.status !== 'Available' && (
                      <button
                        onClick={e => handleQuickStatusChange(tbl, 'Available', e)}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-semibold"
                        title="Set Available"
                      >
                        Free
                      </button>
                    )}
                    {tbl.status !== 'Occupied' && (
                      <button
                        onClick={e => handleQuickStatusChange(tbl, 'Occupied', e)}
                        className="px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-semibold"
                        title="Set Occupied"
                      >
                        Sit
                      </button>
                    )}
                    {tbl.status !== 'Cleaning' && (
                      <button
                        onClick={e => handleQuickStatusChange(tbl, 'Cleaning', e)}
                        className="px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 font-semibold"
                        title="Set Cleaning"
                      >
                        Clean
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Restaurant Table"
        message="Are you sure you want to delete this table from the active floor plan?"
        itemName={tableToDelete?.tableNumber}
      />
    </div>
  );
};

export default RestaurantTablesPage;
