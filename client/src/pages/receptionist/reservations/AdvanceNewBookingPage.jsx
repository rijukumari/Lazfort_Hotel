import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { PageHeader, Card, Button } from '../../../components/ui';
import {
  CalendarCheck,
  Calendar,
  Users,
  CreditCard,
  BedDouble,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Tag,
  ShieldCheck,
  Plane
} from 'lucide-react';

const BOOKING_SOURCES = [
  'Direct Palace Portal',
  'Private Wealth Concierge',
  'Leading Hotels of the World (LHW)',
  'Virtuoso Luxury Network',
  'Amex Fine Hotels & Resorts (FHR)',
  'VIP Ambassador Direct',
  'Monaco Yacht Club Retinue',
];

const RATE_PLANS = [
  { id: 'standard', name: 'Sovereign Standard Rate', discount: 0, desc: 'Includes luxury breakfast & thermal spa access' },
  { id: 'advance', name: 'Advance Purchase Prestige (-15%)', discount: 0.15, desc: 'Non-refundable, complimentary airport limousine transfer' },
  { id: 'vip', name: 'Diplomatic VIP Penthouse Package (-10%)', discount: 0.10, desc: 'Dedicated 24/7 private butler & unlimited Dom Pérignon' },
];

export const AdvanceNewBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rooms = [], createReservation, checkRoomAvailability } = useERP();
  const { showToast } = useToast();

  const queryRoomId = searchParams.get('roomId');
  const initialRoomId = (queryRoomId && rooms.find(r => r.id === queryRoomId)) ? queryRoomId : (rooms[0]?.id || '');

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 3);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+377 98 00 24 00');
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [bookingSource, setBookingSource] = useState(BOOKING_SOURCES[0]);
  const [ratePlanId, setRatePlanId] = useState(RATE_PLANS[0].id);
  const [specialRequests, setSpecialRequests] = useState('High floor oceanfront preferred, airport transfer arranged.');
  const [paymentMethod, setPaymentMethod] = useState('Centurion Black Card');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected room computation
  const selectedRoom = useMemo(() => {
    return rooms.find(r => r.id === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  // Duration computation
  const nights = useMemo(() => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) || 1);
  }, [checkIn, checkOut]);

  // Rate plan computation
  const selectedRatePlan = RATE_PLANS.find(p => p.id === ratePlanId) || RATE_PLANS[0];
  const baseTariff = (selectedRoom ? selectedRoom.pricePerNight : 1200) * nights;
  const discountAmount = Math.round(baseTariff * selectedRatePlan.discount);
  const subtotal = baseTariff - discountAmount;
  const tax = Math.round(subtotal * 0.10);
  const serviceCharge = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + tax + serviceCharge;

  // Availability validation
  const isAvailable = useMemo(() => {
    if (!selectedRoom) return true;
    if (checkRoomAvailability) {
      return checkRoomAvailability(selectedRoom.id, checkIn, checkOut);
    }
    return selectedRoom.status !== 'maintenance';
  }, [selectedRoom, checkIn, checkOut, checkRoomAvailability]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guestName.trim() || !guestEmail.trim()) {
      showToast('Validation Error', 'Guest name and email address are required.', 'error');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      showToast('Date Error', 'Check-out date must be after check-in date.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = createReservation({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        roomId: selectedRoom?.id,
        roomNumber: selectedRoom?.roomNumber,
        roomType: selectedRoom?.type,
        checkIn,
        checkOut,
        nights,
        adults: Number(adults),
        children: Number(children),
        totalAmount,
        paidAmount: paymentStatus === 'paid' ? totalAmount : 0,
        paymentStatus,
        paymentMethod,
        bookingSource,
        specialRequests,
        status: 'confirmed',
      });

      setIsSubmitting(false);

      if (result && result.success === false) {
        showToast('Reservation Error', result.message || 'Could not place reservation.', 'error');
        return;
      }

      showToast(
        'Advance Reservation Created',
        `Confirmed booking for ${guestName} in Suite ${selectedRoom?.roomNumber}.`,
        'success'
      );
      navigate('/receptionist/reservations');
    }, 450);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/receptionist/reservations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to All Reservations</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Create New Advance Reservation
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Book future stays, configure rate plans, secure VIP guest deposits, and schedule advance arrival services.
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
          Front Desk Terminal
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Guest Identification */}
          <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>1. Primary Guest Particulars</span>
              </h3>
              <span className="text-[10px] uppercase font-mono text-accent font-bold">Advance Guest</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Full Guest Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="e.g. Lord Alexander Kensington"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="a.kensington@capitalgroup.co.uk"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="+44 20 7946 0912"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Booking Channel / Source
                </label>
                <select
                  value={bookingSource}
                  onChange={e => setBookingSource(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {BOOKING_SOURCES.map(source => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Suite & Date Itinerary */}
          <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-accent" />
                <span>2. Suite Selection & Schedule</span>
              </h3>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${isAvailable ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'}`}>
                {isAvailable ? 'Suite Available for Dates' : 'Occupancy Conflict'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Select Room / Royal Suite
                </label>
                <select
                  value={selectedRoomId}
                  onChange={e => setSelectedRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Suite {r.roomNumber} — {r.name} ({r.type}) — €{r.pricePerNight?.toLocaleString()}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Check-In Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Party Size
                </label>
                <div className="flex gap-2">
                  <select
                    value={adults}
                    onChange={e => setAdults(Number(e.target.value))}
                    className="flex-1 px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} Adults</option>
                    ))}
                  </select>
                  <select
                    value={children}
                    onChange={e => setChildren(Number(e.target.value))}
                    className="flex-1 px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white"
                  >
                    {[0, 1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} Kids</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Rate Plan & Payment Setup */}
          <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                <span>3. Rate Plan & Settlement Method</span>
              </h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300 block">
                Choose Rate Plan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {RATE_PLANS.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setRatePlanId(plan.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      ratePlanId === plan.id
                        ? 'border-accent bg-accent/15 ring-2 ring-accent/30 shadow-gold'
                        : 'border-border dark:border-white/10 bg-ivory/40 dark:bg-primary-900/40 hover:border-accent/50'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif font-bold text-xs text-primary dark:text-white">
                        {plan.name}
                      </h4>
                      <p className="text-[10px] text-charcoal-muted dark:text-gray-400 mt-1">
                        {plan.desc}
                      </p>
                    </div>
                    {plan.discount > 0 && (
                      <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        Savings: -{(plan.discount * 100).toFixed(0)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Payment Guarantee Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="Centurion Black Card">Centurion Black Card (Amex)</option>
                  <option value="Visa Infinite Luxury">Visa Infinite Luxury</option>
                  <option value="Mastercard World Elite">Mastercard World Elite</option>
                  <option value="UBS Private Bank Wire">UBS Private Bank Wire</option>
                  <option value="Pay on Arrival Deposit">Pay on Arrival Deposit Guarantee</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Initial Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  <option value="paid">Settled Full Advance Deposit (€{totalAmount.toLocaleString()})</option>
                  <option value="pending">Pending Payment (Collect at Check-In)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Special Bespoke Requests
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="Enter guest arrival preferences, dietary restrictions, champagne brand, etc."
                className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="card-luxury-3d p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider">
                Summary Dossier
              </span>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>

            {selectedRoom && (
              <div className="space-y-3">
                <div className="h-36 rounded-2xl overflow-hidden border border-accent/30 relative">
                  <img
                    src={selectedRoom.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    Suite {selectedRoom.roomNumber}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    {selectedRoom.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    {selectedRoom.type} • Floor {selectedRoom.floor} • {selectedRoom.view} View
                  </p>
                </div>
              </div>
            )}

            <div className="divide-y divide-border/60 dark:divide-white/10 text-xs space-y-2 pt-2">
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Duration</span>
                <span className="font-bold text-primary dark:text-white font-mono">{nights} Nights</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Base Nightly Rate</span>
                <span className="font-mono text-primary dark:text-white">€{selectedRoom?.pricePerNight?.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between py-1.5 text-emerald-600 dark:text-emerald-400">
                  <span>Rate Plan Discount</span>
                  <span className="font-mono">-€{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Monaco Luxury Tax (10%)</span>
                <span className="font-mono text-primary dark:text-white">€{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Resort & Concierge Fee (5%)</span>
                <span className="font-mono text-primary dark:text-white">€{serviceCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 pb-1 border-t-2 border-accent/40 font-serif font-bold text-base">
                <span className="text-primary dark:text-white">Total Sovereign Tariff</span>
                <span className="text-accent text-lg">€{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              loading={isSubmitting}
              disabled={!isAvailable}
              className="w-full py-3.5 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <span>{isSubmitting ? 'Securing Suite...' : 'Confirm Advance Reservation'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvanceNewBookingPage;

