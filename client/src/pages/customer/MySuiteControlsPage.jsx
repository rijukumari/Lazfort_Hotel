import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import {
  Key,
  Lock,
  Unlock,
  Thermometer,
  Sun,
  Moon,
  Sparkles,
  BellRing,
  Wine,
  Coffee,
  CheckCircle2,
  FileText,
  MapPin,
  Clock,
  ShieldCheck,
  BedDouble,
  Sliders,
  AlertTriangle,
  Crown
} from 'lucide-react';

export const MySuiteControlsPage = () => {
  const { bookings, rooms, folios } = useERP();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Find customer's active or upcoming booking
  const userBookings = (bookings || []).filter(b =>
    !user || user.role !== 'customer' ||
    b.guestEmail?.toLowerCase() === user.email?.toLowerCase() ||
    b.guestName?.toLowerCase() === user.name?.toLowerCase()
  );

  const currentBooking =
    userBookings.find(b => b.status === 'checked_in') ||
    userBookings.find(b => b.status === 'confirmed') ||
    (bookings && bookings[0]);

  const room = (rooms || []).find(r => r.id === currentBooking?.roomId) || (rooms && rooms[0]) || { roomNumber: '101', type: 'Royal Suite', floor: 1, sizeSqFt: 850, bedType: 'King', view: 'Oceanfront' };
  const folio = (folios || []).find(f => f.bookingId === currentBooking?.id);

  // Digital Key & Controls State
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);
  const [temperature, setTemperature] = useState(21);
  const [lightPreset, setLightPreset] = useState('relax');
  const [isDndActive, setIsDndActive] = useState(false);
  const [isMakeUpActive, setIsMakeUpActive] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleUnlockDoor = () => {
    setIsDoorUnlocked(true);
    showToast(
      'Suite Unlocked',
      `Smart NFC Access Granted for Suite ${room.roomNumber}. Suite entry authorized.`,
      'success'
    );
    setTimeout(() => {
      setIsDoorUnlocked(false);
    }, 4000);
  };

  const handleToggleDnd = () => {
    setIsDndActive(!isDndActive);
    if (isMakeUpActive) setIsMakeUpActive(false);
    showToast(
      !isDndActive ? 'Privacy Engaged' : 'Privacy Disengaged',
      !isDndActive
        ? `Do Not Disturb activated for Suite ${room.roomNumber}. Exterior chime muted.`
        : 'Do Not Disturb deactivated.',
      'info'
    );
  };

  const handleToggleMakeUp = () => {
    setIsMakeUpActive(!isMakeUpActive);
    if (isDndActive) setIsDndActive(false);
    showToast(
      !isMakeUpActive ? 'Housekeeping Notified' : 'Service Cancelled',
      !isMakeUpActive
        ? `Suite ${room.roomNumber} queued for immediate white-glove refresh.`
        : 'Housekeeping alert cleared.',
      'success'
    );
  };

  const handleServiceRequest = (service) => {
    showToast(
      'Butler Dispatched',
      `${service} requested for Suite ${room.roomNumber}. Head Butler Sebastian will arrive within 7 minutes.`,
      'success'
    );
  };

  if (!currentBooking) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-surface-dark/60 border border-dashed border-border dark:border-white/10 space-y-4">
        <BedDouble className="w-12 h-12 text-accent/50 mx-auto" />
        <h3 className="font-serif text-xl font-bold text-primary dark:text-white">No Active In-House Residence</h3>
        <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-sm mx-auto">
          You do not currently have a checked-in suite. Explore our royal suites to begin your Monaco stay.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title={`Suite ${room.roomNumber} Resident Console`}
        description="Your dedicated digital room key, ambient suite automation controls, 24/7 butler dispatch, and live stay ledger."
        badge={currentBooking.status === 'checked_in' ? 'Resident In-House' : 'Confirmed Upcoming'}
        actions={
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
          >
            <FileText className="w-4 h-4 text-accent" />
            <span>View Stay Folio</span>
          </button>
        }
      />

      {/* Grid: Left NFC Key & Quick Info / Right Room Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Keycard & Suite Particulars */}
        <div className="lg:col-span-5 space-y-6">
          {/* Digital NFC Keycard */}
          <div className="relative rounded-3xl p-7 bg-gradient-to-br from-[#1c2430] via-[#121924] to-[#0a0f16] border border-accent/50 text-white shadow-2xl overflow-hidden group">
            {/* Shimmer light effect */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="font-serif font-bold text-sm tracking-wider">
                  LAZFORT PALACE
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold uppercase tracking-widest border border-accent/40">
                NFC Key
              </span>
            </div>

            <div className="space-y-1 my-6">
              <span className="text-[10px] font-mono uppercase text-gray-400 tracking-widest">
                Monaco Sovereign Suite
              </span>
              <h3 className="font-serif text-3xl font-bold text-white tracking-wider">
                Suite {room.roomNumber}
              </h3>
              <p className="text-xs text-accent font-mono">{room.type}</p>
            </div>

            <div className="flex items-end justify-between pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-mono">
                  Resident Keyholder
                </span>
                <span className="font-semibold text-white mt-0.5 block">
                  {currentBooking.guestName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleUnlockDoor}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-gold ${
                  isDoorUnlocked
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'gold-gradient-bg text-primary-900 hover:scale-105 active:scale-95'
                }`}
              >
                {isDoorUnlocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlocked</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Tap to Unlock</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Suite Specs Card */}
          <div className="card-luxury-3d p-6 rounded-3xl space-y-4 text-xs">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Suite Particulars</span>
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Residence Level:</span>
                <span className="font-semibold text-primary dark:text-white font-mono">
                  Floor {room.floor} (Private Elevator)
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Total Floor Area:</span>
                <span className="font-semibold text-primary dark:text-white font-mono">
                  {room.sizeSqFt} sq ft
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Bed Configuration:</span>
                <span className="font-semibold text-primary dark:text-white">
                  {room.bedType} Bed (1000-Thread Cotton)
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Panoramic Aspect:</span>
                <span className="font-semibold text-primary dark:text-white truncate max-w-[50%]">
                  {room.view}
                </span>
              </div>
              <div className="flex items-center justify-between text-charcoal-muted dark:text-gray-300">
                <span>Stay Dates:</span>
                <span className="font-mono font-semibold text-primary dark:text-white">
                  {currentBooking.checkIn} &rarr; {currentBooking.checkOut}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: In-Suite Environmental & Service Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Smart Automation: Climate & Lighting */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-border dark:border-white/10 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/70 dark:border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                  Smart Environment
                </span>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white mt-0.5">
                  Climate & Lighting Ambiance
                </h3>
              </div>
              <Sliders className="w-5 h-5 text-accent" />
            </div>

            {/* Climate Control */}
            <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary dark:text-white block">
                    Suite Thermostat
                  </span>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Precision Monaco Climate Control
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTemperature(prev => Math.max(18, prev - 1))}
                  className="w-8 h-8 rounded-xl btn-secondary-3d font-bold text-base flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono text-xl font-bold text-accent min-w-[3rem] text-center">
                  {temperature}°C
                </span>
                <button
                  type="button"
                  onClick={() => setTemperature(prev => Math.min(26, prev + 1))}
                  className="w-8 h-8 rounded-xl btn-secondary-3d font-bold text-base flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lighting Scenes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Atmospheric Lighting Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'relax', label: 'Amber Relax', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: 'daylight', label: 'Pure Daylight', icon: <Sun className="w-3.5 h-3.5" /> },
                  { id: 'candle', label: 'Candlelight', icon: <Wine className="w-3.5 h-3.5" /> },
                  { id: 'cinema', label: 'Cinema Night', icon: <Moon className="w-3.5 h-3.5" /> },
                ].map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setLightPreset(preset.id)}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                      lightPreset === preset.id
                        ? 'border-accent bg-accent/15 text-accent shadow-sm'
                        : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/30 text-charcoal-muted dark:text-gray-400 hover:text-accent'
                    }`}
                  >
                    {preset.icon}
                    <span className="text-[11px]">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Toggles: DND & Make-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleDnd}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isDndActive
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/30 text-charcoal dark:text-gray-300 hover:border-accent/40'
                }`}
              >
                <div>
                  <h5 className="font-semibold text-xs">Do Not Disturb</h5>
                  <p className="text-[10px] text-charcoal-muted dark:text-gray-400">
                    Mute doorbell & exterior chime
                  </p>
                </div>
                <BellRing className={`w-5 h-5 ${isDndActive ? 'text-rose-500' : 'text-gray-400'}`} />
              </button>

              <button
                type="button"
                onClick={handleToggleMakeUp}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isMakeUpActive
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-900/30 text-charcoal dark:text-gray-300 hover:border-accent/40'
                }`}
              >
                <div>
                  <h5 className="font-semibold text-xs">Make Up Suite</h5>
                  <p className="text-[10px] text-charcoal-muted dark:text-gray-400">
                    Request immediate refresh
                  </p>
                </div>
                <Sparkles className={`w-5 h-5 ${isMakeUpActive ? 'text-emerald-500' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

          {/* 1-Click Concierge Requests */}
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-border dark:border-white/10 shadow-lg space-y-4">
            <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-accent" />
              <span>Instant Butler Amenities & Requests</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Fresh Egyptian Towels',
                'Ice Bucket & Crystal Flutes',
                'Dom Pérignon Champagne',
                'Hypoallergenic Pillow Menu',
                'Evening Turndown Service',
                'Luggage Porter Collection',
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleServiceRequest(item)}
                  className="p-3.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent hover:border-accent text-left transition-all"
                >
                  <span className="block truncate">{item}</span>
                  <span className="text-[10px] text-accent font-mono mt-1 block">Request &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Folio Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={currentBooking}
      />
    </div>
  );
};

export default MySuiteControlsPage;

