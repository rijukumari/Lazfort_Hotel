import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Users, MapPin, CalendarCheck, Utensils } from 'lucide-react';
import { TableStatusBadge } from './TableStatusBadge';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

const SECTIONS = ['Main Salon', 'Terrace Riviera', 'Private Dining Vault', 'Rooftop Lounge', 'Garden Gazebo'];
const STATUSES = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];

export const TableDetailsModal = ({
  isOpen,
  onClose,
  table = null,
  isCreateMode = false,
  onSuccess,
}) => {
  const { addRestaurantTable, updateRestaurantTable, updateRestaurantTableStatus, reserveRestaurantTable } = useERP();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '4',
    section: 'Main Salon',
    status: 'Available',
    assignedGuest: '',
    notes: '',
  });

  const [reservationGuest, setReservationGuest] = useState('');
  const [reservationNotes, setReservationNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (table && !isCreateMode) {
      setFormData({
        tableNumber: table.tableNumber || '',
        capacity: (table.capacity || 4).toString(),
        section: table.section || 'Main Salon',
        status: table.status || 'Available',
        assignedGuest: table.assignedGuest || '',
        notes: table.notes || '',
      });
      setReservationGuest(table.assignedGuest || '');
      setReservationNotes(table.notes || '');
    } else {
      setFormData({
        tableNumber: `T-${Math.floor(10 + Math.random() * 90)}`,
        capacity: '4',
        section: 'Main Salon',
        status: 'Available',
        assignedGuest: '',
        notes: '',
      });
      setReservationGuest('');
      setReservationNotes('');
    }
    setErrors({});
  }, [table, isCreateMode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.tableNumber.trim()) errs.tableNumber = 'Table number is required.';
    if (!formData.capacity || Number(formData.capacity) <= 0) errs.capacity = 'Valid capacity required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    if (isCreateMode) {
      const res = addRestaurantTable(payload);
      if (res?.success) {
        showToast('Table Created', `Table ${formData.tableNumber} added to floor map.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } else {
      const res = updateRestaurantTable(table.id, payload);
      if (res?.success) {
        showToast('Table Updated', `Table ${formData.tableNumber} details saved.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    }
  };

  const handleQuickStatus = (status) => {
    if (!table) return;
    updateRestaurantTableStatus(table.id, status);
    showToast('Table Status Updated', `Table ${table.tableNumber} is now ${status}.`, 'success');
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleReserve = (e) => {
    e.preventDefault();
    if (!reservationGuest.trim()) {
      showToast('Validation Error', 'Guest name is required to reserve.', 'error');
      return;
    }
    reserveRestaurantTable(table.id, reservationGuest, reservationNotes);
    showToast('Table Reserved', `Table ${table.tableNumber} reserved for ${reservationGuest}.`, 'success');
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#101725] rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
          title="Close Modal"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                {isCreateMode ? 'Add Restaurant Table' : `Table ${table?.tableNumber || formData.tableNumber}`}
              </h3>
              {!isCreateMode && table && <TableStatusBadge status={table.status} />}
            </div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Palace Floor Plan & VIP Reservation Console
            </p>
          </div>
        </div>

        {/* Table Details Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Table Identifier *
              </label>
              <input
                type="text"
                value={formData.tableNumber}
                onChange={e => setFormData({ ...formData, tableNumber: e.target.value })}
                placeholder="e.g. T-01, Table 12, VIP Cabana"
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-semibold"
              />
              {errors.tableNumber && <p className="text-[11px] text-rose-500 font-medium">{errors.tableNumber}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Seating Capacity *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>
              {errors.capacity && <p className="text-[11px] text-rose-500 font-medium">{errors.capacity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Dining Section / Area
              </label>
              <select
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent cursor-pointer"
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Floor Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent cursor-pointer"
              >
                {STATUSES.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
              Assigned Guest / Reservation Note
            </label>
            <input
              type="text"
              value={formData.assignedGuest}
              onChange={e => setFormData({ ...formData, assignedGuest: e.target.value })}
              placeholder="e.g. Sir Alexander Kensington (VIP)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCreateMode ? 'Save New Table' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

        {/* Quick Status Bar for Existing Table */}
        {!isCreateMode && table && (
          <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
              Fast Status Transition:
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(st => (
                <button
                  key={st}
                  onClick={() => handleQuickStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    table.status === st
                      ? 'bg-accent/20 border-accent text-accent font-semibold'
                      : 'bg-ivory dark:bg-white/5 border-border/70 dark:border-white/10 text-charcoal-muted hover:text-primary dark:hover:text-white'
                  }`}
                >
                  Set {st}
                </button>
              ))}
            </div>

            {/* Direct Reservation Box */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                <CalendarCheck className="w-4 h-4" />
                <span>Direct VIP Reservation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={reservationGuest}
                  onChange={e => setReservationGuest(e.target.value)}
                  placeholder="Guest Name (e.g. Duke William)"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#121926] border border-amber-500/30 text-xs text-primary dark:text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={reservationNotes}
                  onChange={e => setReservationNotes(e.target.value)}
                  placeholder="Notes (e.g. 8:30 PM, Dom Pérignon)"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#121926] border border-amber-500/30 text-xs text-primary dark:text-white focus:outline-none"
                />
              </div>
              <button
                onClick={handleReserve}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Confirm VIP Reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDetailsModal;

