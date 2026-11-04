import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { PageHeader, Card, Button } from '../../../components/ui';
import {
  UserCheck,
  Key,
  ShieldCheck,
  CreditCard,
  BedDouble,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  DollarSign,
  ScanLine,
  Compass,
  Check
} from 'lucide-react';

const ID_PROOF_TYPES = [
  'Passport (International Diplomatic / Standard)',
  'Monaco Resident Identity Card (Carte de Séjour)',
  'EU National Identity Card',
  'UK / Swiss Biometric Passport',
  'GCC Resident Identity Card',
];

const PAYMENT_METHODS = [
  'Centurion Black Card (Front Desk Terminal)',
  'Visa Infinite Luxury Chip & PIN',
  'Mastercard World Elite',
  'Cash Settlement (Treasury Vault)',
  'Direct VIP House Account Clearance',
];

export const WalkInBookingPage = () => {
  const navigate = useNavigate();
  const { rooms = [], createReservation, checkInGuest } = useERP();
  const { showToast } = useToast();

  // Filter ONLY rooms currently available for immediate check-in
  const availableRooms = useMemo(() => {
    return rooms.filter(r => r.status === 'available');
  }, [rooms]);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  // Guest Identity & Immediate Check-in States
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+377 98 00 15 50');
  const [nationality, setNationality] = useState('Monaco');
  const [idType, setIdType] = useState(ID_PROOF_TYPES[0]);
  const [idNumber, setIdNumber] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(availableRooms[0]?.id || '');
  const [checkInTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [checkOutDate, setCheckOutDate] = useState(tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [depositAmount, setDepositAmount] = useState('');
  const [keyCardEncoded, setKeyCardEncoded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected available room
  const selectedRoom = useMemo(() => {
    return availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0] || rooms[0];
  }, [availableRooms, selectedRoomId, rooms]);

  // Duration
  const nights = useMemo(() => {
    const inDate = new Date(todayStr);
    const outDate = new Date(checkOutDate);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) || 1);
  }, [todayStr, checkOutDate]);

  // Pricing
  const nightlyRate = selectedRoom ? selectedRoom.pricePerNight : 1200;
  const baseTariff = nightlyRate * nights;
  const tax = Math.round(baseTariff * 0.10);
  const serviceCharge = Math.round(baseTariff * 0.05);
  const totalAmount = baseTariff + tax + serviceCharge;

  // Active advance calculation
  const paidAdvance = depositAmount === '' ? totalAmount : Math.min(totalAmount, Number(depositAmount) || 0);
  const remainingBalance = Math.max(0, totalAmount - paidAdvance);

  const handleWalkInCheckIn = (e) => {
    e.preventDefault();

    if (!guestName.trim()) {
      showToast('Validation Error', 'Guest full name is required for walk-in registration.', 'error');
      return;
    }

    if (!idNumber.trim()) {
      showToast('Security Clearance Error', 'Identity proof or passport document number is required.', 'error');
      return;
    }

    if (!selectedRoom) {
      showToast('No Suite Selected', 'Please select an available suite for this walk-in.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // 1. Create reservation
      const res = createReservation({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim() || `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest.lazfort.com`,
        guestPhone: guestPhone.trim(),
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.roomNumber,
        roomType: selectedRoom.type,
        checkIn: todayStr,
        checkOut: checkOutDate,
        nights,
        adults: Number(adults),
        children: 0,
        totalAmount,
        paidAmount: paidAdvance,
        paymentStatus: remainingBalance === 0 ? 'paid' : 'pending',
        paymentMethod,
        bookingSource: 'Front Desk Walk-In Counter',
        specialRequests: `Walk-in registration. ID verified: ${idType} (${idNumber}). Key encoded.`,
        status: 'checked_in', // Instant check-in status
      });

      if (res && res.success === false) {
        setIsSubmitting(false);
        showToast('Error', res.message || 'Could not allocate suite.', 'error');
        return;
      }

      // Check-in guest directly if booking ID returned
      if (res?.booking?.id && checkInGuest) {
        checkInGuest(res.booking.id);
      }

      setIsSubmitting(false);
      showToast(
        'Walk-in Check-In Complete',
        `Guest ${guestName} immediately checked into Suite ${selectedRoom.roomNumber}. Key issued.`,
        'success'
      );
      navigate('/receptionist/dashboard');
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-6xl mx-auto">
      {/* Header */}
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
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Walk-in Guest Check-In & Instant Allocation
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Immediate lobby arrival registration, mandatory identity verification, instant suite keycard encoding, and counter settlement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Lobby Mode
          </span>
        </div>
      </div>

      <form onSubmit={handleWalkInCheckIn} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Walk-in Guest Profile & Document Verification */}
          <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-accent" />
                <span>1. Guest Identity & Mandatory Document Clearance</span>
              </h3>
              <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Arrival Counter
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Full Legal Name (as on Passport) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="e.g. Duke William Somerset"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  ID Proof Document Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {ID_PROOF_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Document / Passport Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder="e.g. MC-PASS-991280"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-mono font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Contact Mobile Phone
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="+377 98 00 12 34"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Email Address (Optional / Folio Dispatch)
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="somerset@private-office.mc"
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* 2. Immediate Suite Allocation */}
          <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-accent" />
                <span>2. Instant Suite Allocation (Available Suites Only)</span>
              </h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-accent/15 text-accent">
                {availableRooms.length} Ready Suites
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Assign Inspected Clean Suite <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRoomId}
                  onChange={e => setSelectedRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Suite {r.roomNumber} — {r.name} ({r.type}) — Floor {r.floor} — €{r.pricePerNight?.toLocaleString()}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Immediate Check-In
                </label>
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Today at {checkInTime}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Expected Check-Out Date
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Occupants Count
                </label>
                <select
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} Guests</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Instant Keycard Encoding Check */}
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary dark:text-white">
                    Encode RFID Suite Keycard at Terminal
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Flash cryptographic key fob for Suite {selectedRoom?.roomNumber}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setKeyCardEncoded(!keyCardEncoded);
                  showToast('Keycard Programmed', `RFID Key Fob synchronized for Suite ${selectedRoom?.roomNumber}.`, 'success');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  keyCardEncoded
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'gold-gradient-bg text-primary-950 shadow-sm'
                }`}
              >
                {keyCardEncoded ? '✓ Key Card Encoded' : 'Encode Key Now'}
              </button>
            </div>
          </div>

          {/* 3. Payment Settlement & Immediate Cash / Card Advance */}
          <div className="card-luxury-3d p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                <span>3. Counter Payment & Deposit Settlement</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                  Advance Collected Now (€)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder={`Full amount: €${totalAmount.toLocaleString()}`}
                  className="w-full px-4 py-2.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/80 border border-border dark:border-white/10 text-xs font-mono font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="card-luxury-3d p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider">
                Immediate Check-in Folio
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
                  <span className="absolute bottom-2 left-2 bg-emerald-600/90 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    Ready for Occupancy
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    {selectedRoom.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Suite {selectedRoom.roomNumber} • Floor {selectedRoom.floor} • {selectedRoom.view}
                  </p>
                </div>
              </div>
            )}

            <div className="divide-y divide-border/60 dark:divide-white/10 text-xs space-y-2 pt-2">
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Stay Duration</span>
                <span className="font-bold text-primary dark:text-white font-mono">{nights} Night(s)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Nightly Base Tariff</span>
                <span className="font-mono text-primary dark:text-white">€{nightlyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-muted dark:text-gray-400">Monaco Tax & Service (15%)</span>
                <span className="font-mono text-primary dark:text-white">€{(tax + serviceCharge).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 font-semibold text-primary dark:text-white">
                <span>Total Stay Folio</span>
                <span className="font-mono text-accent">€{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Paid Advance</span>
                <span className="font-mono">€{paidAdvance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 pb-1 font-serif font-bold text-base">
                <span className="text-primary dark:text-white">Remaining Balance</span>
                <span className={remainingBalance > 0 ? 'text-amber-500 font-mono' : 'text-emerald-500 font-mono'}>
                  €{remainingBalance.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              loading={isSubmitting}
              className="w-full py-3.5 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <span>{isSubmitting ? 'Checking In Guest...' : 'Check-In & Issue Room Key'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WalkInBookingPage;

