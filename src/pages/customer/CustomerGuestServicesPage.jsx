import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  HeartHandshake,
  Sparkles,
  Phone,
  Clock,
  CheckCircle2,
  BellRing,
  Luggage,
  Coffee,
  Waves,
  Utensils,
  Plane,
  Key,
  Calendar,
  Send,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const CustomerGuestServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms, bookings } = useERP();
  const { showToast } = useToast();

  const customerBookings = (bookings || []).filter(b =>
    !user || user.role !== 'customer' ||
    b.guestEmail?.toLowerCase() === user.email?.toLowerCase() ||
    b.guestName?.toLowerCase() === user.name?.toLowerCase()
  );

  const activeBooking =
    customerBookings.find(b => b.status === 'checked_in') ||
    customerBookings.find(b => b.status === 'confirmed') ||
    (bookings && bookings[0]);

  const currentRoom = (rooms || []).find(r => r.id === activeBooking?.roomId) || (rooms && rooms[0]) || { roomNumber: '101' };

  const [activeRequests, setActiveRequests] = useState([
    {
      id: 'req-1',
      serviceName: 'Luggage Unpacking & Wardrobe Valet',
      category: 'Butler Services',
      requestedAt: 'Today, 14:30',
      status: 'dispatched',
      notes: `Dedicated Butler Sebastian Laurent assigned for Suite ${currentRoom.roomNumber}.`,
    },
    {
      id: 'req-2',
      serviceName: 'Hypoallergenic Silk Pillows Replacement',
      category: 'Housekeeping',
      requestedAt: 'Today, 11:15',
      status: 'completed',
      notes: 'Delivered by Housekeeping Lead Margaux Dubois.',
    },
  ]);

  const [selectedService, setSelectedService] = useState('Luggage Valet Assistance');
  const [preferredTime, setPreferredTime] = useState('Immediately (Within 10 Mins)');
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDispatchService = (serviceName) => {
    const newReq = {
      id: `req-${Date.now()}`,
      serviceName,
      category: 'Bespoke Concierge',
      requestedAt: 'Just Now',
      status: 'pending',
      notes: `Requested for Suite ${currentRoom.roomNumber} (${preferredTime}).`,
    };

    setActiveRequests(prev => [newReq, ...prev]);
    showToast(
      'Service Request Dispatched',
      `${serviceName} has been routed to Head Butler & Concierge for Suite ${currentRoom.roomNumber}.`,
      'success'
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      handleDispatchService(`${selectedService}: ${requestNotes || 'Standard White-Glove Procedure'}`);
      setRequestNotes('');
      setIsSubmitting(false);
    }, 400);
  };

  const quickServices = [
    {
      id: 'srv-housekeeping',
      title: 'Full Suite Refresh & Turndown',
      category: 'Hygiene & Linens',
      icon: <Sparkles className="w-5 h-5 text-accent" />,
      desc: 'Fresh Egyptian cotton linens, plush robes, and complete Bulgari bathroom replenishment.',
    },
    {
      id: 'srv-luggage',
      title: 'Luggage & Valet Porterage',
      category: 'Bellhop Concierge',
      icon: <Luggage className="w-5 h-5 text-accent" />,
      desc: 'White-glove arrival baggage delivery, garment steaming, or departure bag collection.',
    },
    {
      id: 'srv-barista',
      title: 'Morning Espresso & Breakfast Tray',
      category: 'In-Suite Dining',
      icon: <Coffee className="w-5 h-5 text-accent" />,
      desc: 'Fresh artisan Illy roast, fresh-pressed orange juice, and warm butter croissants.',
    },
    {
      id: 'srv-limo',
      title: 'Rolls-Royce Chauffeur / Airport',
      category: 'Transport',
      icon: <Plane className="w-5 h-5 text-accent" />,
      desc: 'Private transfer to Nice Côte d’Azur Airport or Monaco Port Hercules yacht berths.',
    },
    {
      id: 'srv-spa',
      title: 'Thalasso Spa Cabana Reservation',
      category: 'Wellness Booking',
      icon: <Waves className="w-5 h-5 text-accent" />,
      desc: 'Heated hydrotherapy jet pools, couples massage, or Ottoman marble hammam.',
    },
    {
      id: 'srv-dining',
      title: 'Michelin Chef Table Priority',
      category: 'Fine Gastronomy',
      icon: <Utensils className="w-5 h-5 text-accent" />,
      desc: 'Prime 20:00 table reservation at Le Louis Sovereign with head sommelier pairing.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Guest Services & Bespoke Concierge"
        description="24/7 dedicated white-glove assistance, housekeeping requests, private transportation, and personal butler dispatch."
        badge={`Suite ${currentRoom.roomNumber} Active`}
      />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/customer/dining')}
          className="p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform flex-shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              In-Room Dining Menu
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Michelin Haute Cuisine to Suite
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/customer/amenities')}
          className="p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform flex-shrink-0">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Hotel Facilities (Suvidha)
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Spa, Infinity Pool & Helipad
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/customer/my-suite')}
          className="p-5 rounded-3xl bg-white/80 dark:bg-surface-dark/90 border border-border dark:border-white/10 shadow-sm hover:border-accent hover:shadow-gold transition-all text-left flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform flex-shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary dark:text-white">
              Aapna Room Controls
            </h4>
            <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Smart NFC Key, AC & Lights
            </p>
          </div>
        </button>
      </div>

      {/* 1-Click Quick Service Dispatch Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
              Instant Service Dispatch
            </h3>
          </div>
          <span className="text-xs font-mono text-accent">
            Dispatches directly to Suite {currentRoom.roomNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickServices.map(srv => (
            <div
              key={srv.id}
              className="card-luxury-3d p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-accent/60 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider">
                    {srv.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white">
                    {srv.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDispatchService(srv.title)}
                className="w-full py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Request for Suite {currentRoom.roomNumber}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Request Form & Active Requests Live Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Custom Request Form */}
        <div className="lg:col-span-6 card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-5">
          <h4 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-accent" />
            <span>Send Custom Concierge Request</span>
          </h4>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Service Category
              </label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              >
                <option value="Luggage Valet Assistance">Luggage Valet Assistance</option>
                <option value="Bed Linen & Pillow Refresh">Bed Linen & Pillow Refresh</option>
                <option value="Champagne & Floral In-Room Arrangement">Champagne & Floral In-Room Arrangement</option>
                <option value="Wake-Up Call & Morning Coffee">Wake-Up Call & Morning Coffee</option>
                <option value="Helicopter / Rolls-Royce Transfer">Helicopter / Rolls-Royce Transfer</option>
                <option value="Private Laundry & Garment Pressing">Private Laundry & Garment Pressing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Target Fulfillment Time
              </label>
              <select
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none"
              >
                <option value="Immediately (Within 10 Mins)">Immediately (Within 10 Mins)</option>
                <option value="Within the Next Hour">Within the Next Hour</option>
                <option value="This Evening at 19:00">This Evening at 19:00</option>
                <option value="Tomorrow Morning at 08:00">Tomorrow Morning at 08:00</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-charcoal-muted dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                Specific Instructions / Notes for Butler
              </label>
              <textarea
                rows={3}
                value={requestNotes}
                onChange={e => setRequestNotes(e.target.value)}
                placeholder="e.g. Please bring two extra down feather pillows and ice bucket..."
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-primary-900/60 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white focus:outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs uppercase tracking-wider btn-3d shadow-gold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting to Desk...' : 'Transmit Request to Concierge'}</span>
            </button>
          </form>
        </div>

        {/* Right: Active Requests Live Tracker */}
        <div className="lg:col-span-6 card-luxury-3d p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
            <h4 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Live Service Activity Log</span>
            </h4>
            <span className="text-xs font-mono text-emerald-500 font-bold">
              ● Desk Active 24/7
            </span>
          </div>

          <div className="space-y-3">
            {activeRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-ivory dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary dark:text-white">
                    {req.serviceName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      req.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : req.status === 'dispatched'
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    }`}
                  >
                    {req.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{req.status}</span>
                  </span>
                </div>

                <p className="text-[11px] text-charcoal-muted dark:text-gray-400">{req.notes}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 border-t border-border/40 dark:border-white/5">
                  <span>{req.category}</span>
                  <span>{req.requestedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotel Direct Extensions Bar */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-surface-dark/70 border border-border dark:border-white/10 shadow-sm space-y-3 text-xs">
        <h4 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-accent" />
          <span>Direct In-Suite Dial Extensions</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/80 dark:border-white/10">
            <span className="text-[10px] font-mono text-accent uppercase font-bold block">Head Concierge</span>
            <p className="font-bold text-primary dark:text-white mt-0.5">Dial Ext. 100</p>
          </div>
          <div className="p-3 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/80 dark:border-white/10">
            <span className="text-[10px] font-mono text-accent uppercase font-bold block">Personal Butler</span>
            <p className="font-bold text-primary dark:text-white mt-0.5">Dial Ext. 101</p>
          </div>
          <div className="p-3 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/80 dark:border-white/10">
            <span className="text-[10px] font-mono text-accent uppercase font-bold block">Thalasso Spa</span>
            <p className="font-bold text-primary dark:text-white mt-0.5">Dial Ext. 104</p>
          </div>
          <div className="p-3 rounded-2xl bg-ivory dark:bg-primary-900/40 border border-border/80 dark:border-white/10">
            <span className="text-[10px] font-mono text-accent uppercase font-bold block">Michelin Dining</span>
            <p className="font-bold text-primary dark:text-white mt-0.5">Dial Ext. 105</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerGuestServicesPage;

