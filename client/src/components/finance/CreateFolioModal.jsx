import React, { useState } from 'react';
import { X, Plus, User, BedDouble, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const CreateFolioModal = ({ isOpen, onClose, onSuccess }) => {
  const { bookings = [], createFolio } = useERP();

  const [formData, setFormData] = useState({
    bookingId: '',
    guestName: '',
    roomNumber: '101',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    initialRoomRate: '1850',
    notes: 'Direct VIP Folio Initialization',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleBookingSelect = (bId) => {
    const booking = bookings.find(b => b.id === bId);
    if (booking) {
      setFormData({
        bookingId: booking.id,
        guestName: booking.guestName,
        roomNumber: booking.roomNumber,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        initialRoomRate: booking.pricePerNight?.toString() || '1850',
        notes: `Folio linked to reservation ${booking.bookingCode}`,
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.guestName.trim()) errs.guestName = 'Guest name is required';
    if (!formData.roomNumber.trim()) errs.roomNumber = 'Room number is required';
    if (!formData.checkIn) errs.checkIn = 'Check-in date required';
    if (!formData.checkOut) errs.checkOut = 'Check-out date required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const rate = Number(formData.initialRoomRate) || 0;
    const initialCharge = rate > 0 ? [{
      id: `chg-${Date.now()}`,
      date: formData.checkIn,
      category: 'room_charge',
      description: `Suite ${formData.roomNumber} — Initial Night Rate`,
      quantity: 1,
      unitPrice: rate,
      taxAmount: Math.round(rate * 0.1),
      totalAmount: Math.round(rate * 1.1),
      postedBy: 'Front Desk Controller',
      createdAt: new Date().toISOString(),
    }] : [];

    const subtotal = rate;
    const totalTax = Math.round(rate * 0.1);
    const grandTotal = subtotal + totalTax;

    createFolio({
      bookingId: formData.bookingId,
      guestName: formData.guestName.trim(),
      roomNumber: formData.roomNumber.trim(),
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: 'open',
      charges: initialCharge,
      payments: [],
      subtotal,
      totalTax,
      grandTotal,
      totalPaid: 0,
      balanceDue: grandTotal,
      notes: formData.notes.trim(),
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/50 dark:bg-primary-800/40 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Create New Guest Folio
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Initialize master folio statement for guest or VIP party
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-accent hover:bg-white dark:hover:bg-primary-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
          {/* Link to Existing Reservation Optional */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Link to Existing Reservation (Optional)
            </label>
            <select
              value={formData.bookingId}
              onChange={(e) => handleBookingSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
            >
              <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">-- Manual Direct Folio Entry --</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                  {b.bookingCode} - {b.guestName} (Suite {b.roomNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Guest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Duke William Somerset"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.guestName ? 'border-rose-500' : 'border-border dark:border-white/10'
                  } bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent`}
              />
              {errors.guestName && <p className="text-[10px] text-rose-500 mt-1">{errors.guestName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Chamber / Suite Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. 101"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.roomNumber ? 'border-rose-500' : 'border-border dark:border-white/10'
                  } bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {errors.roomNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.roomNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Check-in Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Check-out Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Opening Nightly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.initialRoomRate}
              onChange={(e) => setFormData({ ...formData, initialRoomRate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
              Folio Notes & Billing Preferences
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Master billing to corporate ledger, express checkout requested..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/70 text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-4 border-t border-border/80 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Initialize Folio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolioModal;

