import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Card } from '../../components/ui';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  Utensils,
  FileText,
  Key,
  Unlock,
  Sparkles,
  Crown,
  ShieldCheck,
  Thermometer,
  BellRing,
  ArrowRight,
  Phone,
  Wifi,
  Calendar,
  BedDouble,
  Receipt,
  HeartHandshake,
  User,
  Lock,
} from 'lucide-react';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { bookings, rooms, guests } = useERP();
  const { user } = useAuth();

  const currentGuest = guests.find(
    g =>
      (user?.email && g.email?.toLowerCase() === user.email?.toLowerCase()) ||
      (user?.name && g.name?.toLowerCase() === user.name?.toLowerCase())
  );

  const isVip =
    (user?.membershipTier && user.membershipTier !== 'Standard') ||
    user?.vipStatus === true ||
    (currentGuest && currentGuest.vipTier !== 'Standard');

  const tier = currentGuest?.vipTier || user?.membershipTier || (isVip ? 'VIP Diamond' : 'Standard');

  const customerBookings = bookings.filter(b =>
    !user || user.role !== 'customer' ||
    b.guestEmail?.toLowerCase() === user.email?.toLowerCase() ||
    b.guestName?.toLowerCase() === user.name?.toLowerCase()
  );

  const currentBooking =
    customerBookings.find(b => b.status === 'checked_in') ||
    customerBookings.find(b => b.status === 'confirmed') ||
    bookings[0];

  const room = rooms.find(r => r.id === currentBooking?.roomId) || rooms[0];
  const [selectedInvoice, setSelectedInvoice] = useState(currentBooking);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);
  const [temperature, setTemperature] = useState(21);
  const [isDndActive, setIsDndActive] = useState(false);
  const [isMakeUpActive, setIsMakeUpActive] = useState(false);

  const handleUnlockDoor = () => {
    setIsDoorUnlocked(true);
    showToast(
      'Suite Door Unlocked',
      `Smart NFC Access verified for Suite ${room.roomNumber}. Welcome back.`,
      'success'
    );
    setTimeout(() => setIsDoorUnlocked(false), 3000);
  };

  const handleRequestService = (service) => {
    showToast(
      'Butler Dispatched',
      `Your request for ${service} has been dispatched to Head Butler Sebastian for Suite ${room.roomNumber}.`,
      'success'
    );
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Page Header */}
      <PageHeader
        title={`Welcome, ${user ? user.name : 'Alexander Kensington'}`}
        description="Lazfort Grand Palace — Sovereign Customer Portal: manage your room, search available suites, review folios, and access bespoke guest services."
        badge={isVip ? `${tier} Resident` : 'Standard Customer'}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="gold"
              icon={BedDouble}
              onClick={() => navigate('/customer/book')}
            >
              Book a Room
            </Button>
          </div>
        }
      />

      {/* Unified Customer Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => navigate('/customer/book')}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <BedDouble className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block">
            Book a Room
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">Search Dates</span>
        </button>

        <button
          onClick={() => navigate('/customer/rooms')}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block">
            Available Rooms
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">Suites & Tariffs</span>
        </button>

        <button
          onClick={() => navigate('/customer/bookings')}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block">
            My Bookings
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">Stays & Cancellations</span>
        </button>

        <button
          onClick={() => navigate('/customer/payments')}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block">
            Payments & Invoices
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">Folios & Receipts</span>
        </button>

        <button
          onClick={() => navigate('/customer/guest-services')}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block">
            Guest Services
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">Butler & Chauffeur</span>
        </button>

        <button
          onClick={() => navigate('/customer/profile')}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <User className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block">
            My Profile
          </span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">Preferences & Tier</span>
        </button>

        <button
          onClick={() => navigate('/customer/vip-benefits')}
          className={`p-3.5 rounded-2xl border shadow-sm transition-all text-left flex flex-col justify-between group ${
            isVip
              ? 'bg-gradient-to-tr from-accent/20 to-accent/5 border-accent/40 shadow-gold'
              : 'bg-white/80 dark:bg-surface-dark/90 border-border dark:border-white/10'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-2">
            <Crown className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xs text-primary dark:text-white block flex items-center gap-1">
            <span>VIP Benefits</span>
            {isVip && <Sparkles className="w-2.5 h-2.5 text-accent" />}
          </span>
          <span className="text-[10px] text-accent font-semibold">
            {isVip ? 'Unlocked' : 'View Perks'}
          </span>
        </button>
      </div>

      {/* SECTION: VIP CUSTOMER SECTION INSIDE CUSTOMER PANEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              VIP Customer Section (Sovereign Member Privileges)
            </h3>
          </div>
          <button
            onClick={() => navigate('/customer/vip-benefits')}
            className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
          >
            <span>Full VIP Benefits Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className={`card-luxury-3d p-6 sm:p-7 rounded-3xl border transition-all ${
            isVip
              ? 'bg-gradient-to-r from-accent/15 via-primary-950/70 to-accent/10 border-accent/40 shadow-gold'
              : 'bg-white/70 dark:bg-surface-dark/70 border-border dark:border-white/10'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    isVip
                      ? 'bg-accent/25 text-accent border border-accent/40'
                      : 'bg-charcoal/10 dark:bg-white/10 text-charcoal-muted dark:text-gray-300 border border-charcoal/20'
                  }`}
                >
                  {isVip ? <Crown className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isVip ? `VIP Active (${tier} Tier)` : 'Standard Customer Status'}</span>
                </span>
                <span className="text-xs font-mono text-charcoal-muted dark:text-gray-400">
                  Managed via Hotel Admin
                </span>
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-primary dark:text-white">
                {isVip
                  ? 'VIP Privileges Active: Personal Butler, Late Check-out & Vintage Champagne'
                  : 'Exclusive VIP Sovereign Privileges Preview'}
              </h4>

              <p className="text-xs sm:text-sm text-charcoal-muted dark:text-gray-300 leading-relaxed">
                {isVip
                  ? 'As an authorized VIP Resident, your stays include automatic 16:00 late departures, 24/7 dedicated Clefs d’Or butler service, private helipad transfers, and complimentary arrival champagne.'
                  : 'VIP benefits are conferred and managed exclusively by Hotel Administration and Front Desk Concierge based on sovereign loyalty criteria. Customers cannot self-assign VIP status. Standard customers enjoy unrestricted suite booking at standard rates.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <Button
                variant="gold"
                onClick={() => navigate('/customer/vip-benefits')}
              >
                {isVip ? 'Access VIP Lounge' : 'View VIP Benefits'}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/customer/book')}
              >
                Book a Suite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: "AAPNA ROOM" — ACTIVE RESIDENCE HERO CARD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              Aapna Room (Your Active Residence)
            </h3>
          </div>
          <button
            onClick={() => navigate('/customer/my-suite')}
            className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
          >
            <span>Full Room Automation Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="card-luxury-3d overflow-hidden rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Suite Visual */}
            <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[340px]">
              <img
                src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              <div className="absolute top-4 left-4">
                <StatusBadge status={currentBooking.status === 'checked_in' ? 'checked_in' : 'reserved'} />
              </div>

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-accent border border-accent/40 shadow-sm">
                Suite {room.roomNumber}
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                  {room.type} • Floor {room.floor}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1 text-white">{room.name}</h3>
                <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{room.view} • Private Elevator Clearance</span>
                </p>
              </div>
            </div>

            {/* In-Stay Particulars, Digital Key & Controls */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/70 dark:border-white/10">
                  <div>
                    <span className="font-mono text-xs font-bold text-accent">
                      Folio #{currentBooking.bookingCode}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-primary dark:text-white mt-0.5">
                      Stay Particulars & Digital Access
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedInvoice(currentBooking);
                      setIsInvoiceOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Official Folio</span>
                  </button>
                </div>

                {/* Stay Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-charcoal-muted dark:text-gray-400 uppercase text-[10px] block font-mono font-bold tracking-wider">
                      Check-In
                    </span>
                    <p className="font-semibold text-primary dark:text-white mt-1 text-sm font-mono">
                      {currentBooking.checkIn}
                    </p>
                    <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-0.5">15:00 Confirmed</p>
                  </div>

                  <div>
                    <span className="text-charcoal-muted dark:text-gray-400 uppercase text-[10px] block font-mono font-bold tracking-wider">
                      Check-Out
                    </span>
                    <p className="font-semibold text-primary dark:text-white mt-1 text-sm font-mono">
                      {currentBooking.checkOut}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      Complimentary Late 16:00
                    </p>
                  </div>

                  <div>
                    <span className="text-charcoal-muted dark:text-gray-400 uppercase text-[10px] block font-mono font-bold tracking-wider">
                      Total Folio
                    </span>
                    <p className="font-serif text-lg font-bold text-accent mt-0.5">
                      ${currentBooking.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {currentBooking.paymentStatus === 'paid' ? 'Fully Settled' : 'Pay at Desk'}
                    </p>
                  </div>
                </div>

                {/* Digital Key & Smart Automation Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5">
                  <button
                    type="button"
                    onClick={handleUnlockDoor}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isDoorUnlocked
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'bg-accent/10 border-accent/40 text-accent hover:border-accent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                        {isDoorUnlocked ? <Unlock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">
                          {isDoorUnlocked ? 'Suite Unlocked!' : 'Digital NFC Keycard'}
                        </span>
                        <span className="text-[10px] text-charcoal-muted dark:text-gray-400">
                          Tap to unlock Suite {room.roomNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-accent">Tap &rarr;</span>
                  </button>

                  <div className="p-3.5 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-primary dark:text-white">Climate:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTemperature(prev => Math.max(18, prev - 1))}
                        className="w-6 h-6 rounded-lg btn-secondary-3d font-bold text-xs flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-accent">{temperature}°C</span>
                      <button
                        onClick={() => setTemperature(prev => Math.min(26, prev + 1))}
                        className="w-6 h-6 rounded-lg btn-secondary-3d font-bold text-xs flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Privacy switches */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={handleToggleDnd}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                      isDndActive
                        ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'btn-secondary-3d text-charcoal-muted dark:text-gray-300'
                    }`}
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{isDndActive ? 'DND Active' : 'Do Not Disturb'}</span>
                  </button>

                  <button
                    onClick={handleToggleMakeUp}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                      isMakeUpActive
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'btn-secondary-3d text-charcoal-muted dark:text-gray-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isMakeUpActive ? 'Make-Up Queued' : 'Make Up Room'}</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Butler Bar */}
              <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-950/80 border border-border/80 dark:border-accent/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                    alt="Butler"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-accent shadow-sm flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider font-mono">
                      Dedicated Sovereign Butler
                    </span>
                    <p className="font-serif font-bold text-primary dark:text-white">
                      Sebastian Laurent (Clefs d’Or)
                    </p>
                    <p className="text-xs text-charcoal-muted dark:text-gray-400">
                      On Duty 24/7 for Suite {room.roomNumber}
                    </p>
                  </div>
                </div>

                <Button
                  variant="gold"
                  onClick={() => handleRequestService('Personal Butler Consultation')}
                >
                  Page Butler
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PALACE FACILITIES */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              Palace Facilities & Privileges
            </h3>
          </div>
          <button
            onClick={() => navigate('/customer/amenities')}
            className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Facility 1: Royal Spa */}
          <div className="card-luxury-3d rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-all">
            <div className="relative h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                alt="Spa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="text-[10px] text-accent font-mono uppercase font-bold">Level -1</span>
                <h4 className="font-serif font-bold text-sm">Royal Thalasso Spa</h4>
              </div>
            </div>
            <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Heated seawater jet pools, marble hammam & Bulgari skincare cabanas.
              </p>
              <button
                onClick={() => handleRequestService('Royal Spa Treatment')}
                className="w-full py-2 btn-secondary-3d rounded-xl text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
              >
                Reserve Spa Time
              </button>
            </div>
          </div>

          {/* Facility 2: Rooftop Infinity Pool */}
          <div className="card-luxury-3d rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-all">
            <div className="relative h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
                alt="Pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="text-[10px] text-accent font-mono uppercase font-bold">Rooftop Level 14</span>
                <h4 className="font-serif font-bold text-sm">Horizon Infinity Pool</h4>
              </div>
            </div>
            <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Heated to 29°C year-round over the cliffs with poolside champagne bar.
              </p>
              <button
                onClick={() => handleRequestService('Pool Cabana Reservation')}
                className="w-full py-2 btn-secondary-3d rounded-xl text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
              >
                Reserve Sun Cabana
              </button>
            </div>
          </div>

          {/* Facility 3: Rooftop Helipad & Chauffeur */}
          <div className="card-luxury-3d rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-all">
            <div className="relative h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
                alt="Helipad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="text-[10px] text-accent font-mono uppercase font-bold">Skyline Deck</span>
                <h4 className="font-serif font-bold text-sm">Helipad & Rolls-Royce Fleet</h4>
              </div>
            </div>
            <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                7-minute private helicopter transfers to Nice Airport and chauffeur towncars.
              </p>
              <button
                onClick={() => handleRequestService('Helicopter Airport Transfer')}
                className="w-full py-2 btn-secondary-3d rounded-xl text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
              >
                Book Transfer
              </button>
            </div>
          </div>

          {/* Facility 4: Riva Yacht */}
          <div className="card-luxury-3d rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-all">
            <div className="relative h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=800&q=80"
                alt="Yacht"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="text-[10px] text-accent font-mono uppercase font-bold">Port Hercules #4</span>
                <h4 className="font-serif font-bold text-sm">85ft Riva Superyacht</h4>
              </div>
            </div>
            <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                Private Mediterranean day charters to Cap d’Antibes with crew and champagne.
              </p>
              <button
                onClick={() => handleRequestService('Riva Yacht Charter')}
                className="w-full py-2 btn-secondary-3d rounded-xl text-xs font-semibold text-charcoal dark:text-gray-200 hover:text-accent"
              >
                Reserve Charter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: IN-SUITE DINING BANNER */}
      <div className="card-luxury-3d p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-accent/10 via-transparent to-accent/5 border border-accent/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0 shadow-gold">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-widest">
              24/7 In-Suite Dining
            </span>
            <h3 className="font-serif text-2xl font-bold text-primary dark:text-white mt-0.5">
              Craving 3-Star Michelin Cuisine in Your Suite?
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-300 mt-1 max-w-xl">
              Order Imperial Beluga Caviar, Brittany Blue Lobster, or A5 Miyazaki Wagyu ribeye delivered
              silver-cloche directly to Suite {room.roomNumber} with sommelier wine pairings.
            </p>
          </div>
        </div>

        <Button
          variant="gold"
          icon={Utensils}
          onClick={() => navigate('/customer/dining')}
        >
          Open Room Service Menu
        </Button>
      </div>

      {/* SECTION 4: HOTEL DIRECTORY */}
      <Card variant="luxury" className="p-6 rounded-3xl space-y-4 text-xs">
        <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Hotel Directory & Sovereign Concierge Contacts</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/70 dark:border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-accent uppercase font-bold flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> High-Speed Wi-Fi
            </span>
            <p className="font-semibold text-primary dark:text-white">LAZFORT_ROYAL_5G</p>
            <p className="text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">Password: MONACO_VIP</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/70 dark:border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-accent uppercase font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Private Butler
            </span>
            <p className="font-semibold text-primary dark:text-white">Dial Ext. 101</p>
            <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Available 24 Hours</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/70 dark:border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-accent uppercase font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Head Concierge
            </span>
            <p className="font-semibold text-primary dark:text-white">Dial Ext. 100</p>
            <p className="text-[10px] text-charcoal-muted dark:text-gray-400">Helipad, Marina & Bookings</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/70 dark:border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-accent uppercase font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Thalasso Spa Desk
            </span>
            <p className="font-semibold text-primary dark:text-white">Dial Ext. 104</p>
            <p className="text-[10px] text-charcoal-muted dark:text-gray-400">08:00 - 21:00 Daily</p>
          </div>
        </div>
      </Card>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={selectedInvoice}
      />
    </div>
  );
};

export default CustomerDashboard;

