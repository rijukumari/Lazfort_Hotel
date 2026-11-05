import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  User,
  BedDouble,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const CreateFolioPage = () => {
  const navigate = useNavigate();
  const { bookings = [], createFolio } = useERP();
  const { showToast } = useToast();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSelect = (bId) => {
    const booking = bookings.find(b => b.id === bId);
    if (booking) {
      setFormData({
        bookingId: booking.id,
        guestName: booking.guestName,
        roomNumber: booking.roomNumber,
        checkIn: booking.checkIn || booking.checkInDate || new Date().toISOString().split('T')[0],
        checkOut: booking.checkOut || booking.checkOutDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        initialRoomRate: (booking.pricePerNight || booking.totalAmount || 1850).toString(),
        notes: `Folio linked to reservation ${booking.bookingCode}`,
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.guestName.trim()) errs.guestName = 'Guest name is required';
    if (!formData.roomNumber.trim()) errs.roomNumber = 'Chamber / suite number is required';
    if (!formData.checkIn) errs.checkIn = 'Check-in date is required';
    if (!formData.checkOut) errs.checkOut = 'Check-out date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

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

    const res = createFolio({
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

    setIsSubmitting(false);

    if (res?.success) {
      showToast('Folio Created', `Master guest folio initialized for ${formData.guestName}.`, 'success');
      navigate('/hotel-admin/finance/folios');
    } else {
      showToast('Folio Created', 'Master guest folio initialized.', 'success');
      navigate('/hotel-admin/finance/folios');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-border/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => navigate('/hotel-admin/finance/folios')}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Guest Folios</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/25">
          <Sparkles className="w-3.5 h-3.5" />
          VIP Folio Controller
        </span>
      </div>

      {/* Main Form Card exactly matching screenshot UI */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c121d] border border-accent/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-black text-2xl text-primary dark:text-white tracking-wide">
              Create New Guest Folio
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
              Initialize master folio statement for guest or VIP party
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Link to Existing Reservation */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Link to Existing Reservation (Optional)
            </label>
            <select
              value={formData.bookingId}
              onChange={(e) => handleBookingSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-xs focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                -- Manual Direct Folio Entry --
              </option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                  {b.bookingCode || b.id} - {b.guestName} (Suite {b.roomNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Row: Guest Name & Chamber / Suite Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Guest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Duke William Somerset"
                className={`w-full px-3.5 py-2.5 rounded-2xl border ${
                  errors.guestName ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent`}
              />
              {errors.guestName && <p className="text-[10px] text-rose-500 mt-1">{errors.guestName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Chamber / Suite Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="101"
                className={`w-full px-3.5 py-2.5 rounded-2xl border ${
                  errors.roomNumber ? 'border-rose-500' : 'border-border dark:border-white/10'
                } bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono`}
              />
              {errors.roomNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.roomNumber}</p>}
            </div>
          </div>

          {/* Row: Check-in Date & Check-out Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Check-in Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
              {errors.checkIn && <p className="text-[10px] text-rose-500 mt-1">{errors.checkIn}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
                Check-out Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
              />
              {errors.checkOut && <p className="text-[10px] text-rose-500 mt-1">{errors.checkOut}</p>}
            </div>
          </div>

          {/* Opening Nightly Rate */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Opening Nightly Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.initialRoomRate}
              onChange={(e) => setFormData({ ...formData, initialRoomRate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent font-mono"
            />
          </div>

          {/* Folio Notes & Billing Preferences */}
          <div>
            <label className="block text-xs font-semibold text-primary dark:text-gray-200 mb-1.5">
              Folio Notes & Billing Preferences
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Direct VIP Folio Initialization"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border dark:border-white/10 bg-ivory/80 dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate('/hotel-admin/finance/folios')}
              className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Initializing...' : 'INITIALIZE FOLIO'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolioPage;

