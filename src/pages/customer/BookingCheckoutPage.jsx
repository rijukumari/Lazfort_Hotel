import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { GuestDetailsForm } from '../../components/booking/GuestDetailsForm';
import { PaymentSection } from '../../components/booking/PaymentSection';
import { BookingSummary } from '../../components/booking/BookingSummary';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';

export const BookingCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, createReservation, checkRoomAvailability } = useERP();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const roomId = searchParams.get('roomId') || rooms[0]?.id;
  const room = rooms.find(r => r.id === roomId) || rooms[0];

  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date(defaultIn);
  defaultOut.setDate(defaultIn.getDate() + 2);
  const formatDate = (d) => d.toISOString().split('T')[0];

  const checkIn = searchParams.get('checkIn') || formatDate(defaultIn);
  const checkOut = searchParams.get('checkOut') || formatDate(defaultOut);
  const adults = parseInt(searchParams.get('adults') || '2', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const roomsCount = parseInt(searchParams.get('roomsCount') || '1', 10);

  const nights = useMemo(() => {
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();
    if (isNaN(inTime) || isNaN(outTime) || outTime <= inTime) return 1;
    return Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const [guestData, setGuestData] = useState({
    fullName: isAuthenticated && user ? user.name : 'Alexander Kensington',
    email: isAuthenticated && user ? user.email : 'a.kensington@capitalgroup.co.uk',
    phone: (isAuthenticated && user?.phone) || '+44 20 7946 0912',
    country: (isAuthenticated && user?.nationality) || 'Monaco / British',
    estimatedArrival: '14:00 - 16:00',
    specialRequests: 'Dom Pérignon upon arrival, feather-free pillows, sea view floor preferred.',
    wantsAirportPickup: true,
  });

  const [paymentMethod, setPaymentMethod] = useState('pay_at_hotel');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: isAuthenticated && user ? user.name : 'Alexander Kensington',
    expiry: '12/28',
    cvv: '888',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSuiteFree = useMemo(() => {
    if (!room) return false;
    return checkRoomAvailability(room.id, checkIn, checkOut);
  }, [room, checkIn, checkOut, checkRoomAvailability]);

  const handleUpdateGuestData = (updated) => {
    setGuestData(prev => ({ ...prev, ...updated }));
    if (updated.fullName) setFormErrors(prev => ({ ...prev, fullName: undefined }));
    if (updated.email) setFormErrors(prev => ({ ...prev, email: undefined }));
    if (updated.phone) setFormErrors(prev => ({ ...prev, phone: undefined }));
  };

  const validateForm = () => {
    const errors = {};
    if (!guestData.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!guestData.email.trim() || !guestData.email.includes('@')) {
      errors.email = 'Valid email address is required.';
    }
    if (!guestData.phone.trim()) errors.phone = 'Phone number is required for concierge contact.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Validation Error', 'Please complete all required guest fields.', 'error');
      return;
    }

    if (!isSuiteFree) {
      showToast(
        'Overlapping Reservation Detected',
        `Suite ${room.roomNumber} is already reserved for the selected dates. Please choose another suite or modify your dates.`,
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    const baseAmount = (room.pricePerNight || 0) * nights * roomsCount;
    const taxAmount = Math.round(baseAmount * 0.1);
    const serviceFee = Math.round(baseAmount * 0.05);
    const totalAmount = baseAmount + taxAmount + serviceFee;
    const paidAmount = paymentMethod === 'credit_card' ? totalAmount : 0;
    const paymentStatus = paymentMethod === 'credit_card' ? 'paid' : 'pending';

    setTimeout(() => {
      const res = createReservation({
        guestName: guestData.fullName,
        guestEmail: guestData.email,
        guestPhone: guestData.phone,
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.type,
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        roomCount: roomsCount,
        baseAmount,
        taxAmount,
        serviceFee,
        totalAmount,
        paidAmount,
        paymentStatus,
        paymentMethod,
        specialRequests: `${guestData.specialRequests} ${guestData.wantsAirportPickup ? '[Helipad/Airport Chauffeur Requested]' : ''
          } [Arrival: ${guestData.estimatedArrival}]`,
      });

      setIsSubmitting(false);

      if (res?.success && res.booking) {
        showToast('Reservation Guaranteed', res.message, 'success');
        navigate(`/customer/confirmation/${res.booking.id}`, {
          state: { booking: res.booking, room },
        });
      } else {
        showToast('Reservation Error', res?.message || 'Unable to confirm reservation.', 'error');
      }
    }, 600);
  };

  if (!room) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold">Suite Not Found</h2>
        <button
          onClick={() => navigate('/customer/discover/rooms')}
          className="px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 font-bold text-xs"
        >
          Return to Suites
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent dark:text-gray-300 dark:hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Suite Specifications</span>
        </button>
      </div>

      <PageHeader
        title="Sovereign Suite Reservation Checkout"
        description="Complete your guest clearance and guarantee your reservation at Lazfort Palace Monte-Carlo."
        badge="Instant ERP Central Guarantee"
      />

      <form onSubmit={handleConfirmReservation}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Forms: Guest Details & Payment Method) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Guest Details */}
            <GuestDetailsForm
              data={guestData}
              onChange={handleUpdateGuestData}
              errors={formErrors}
            />

            {/* Step 2: Payment Preference */}
            <PaymentSection
              selectedMethod={paymentMethod}
              onChangeMethod={setPaymentMethod}
              cardData={cardData}
              onChangeCardData={data => setCardData(prev => ({ ...prev, ...data }))}
            />

            {/* Step 3: Authorization Button */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-surface-dark/95 border border-border dark:border-white/10 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Lock className="w-4 h-4" />
                <span>256-Bit TLS Encryption & Direct ERP Inventory Synchronization</span>
              </div>
              <p className="text-[11px] text-charcoal-muted dark:text-gray-400 leading-relaxed">
                By confirming this reservation, you acknowledge the Lazfort Sovereign Hospitality
                charter and 48-hour complimentary cancellation guarantee.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || !isSuiteFree}
                className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest btn-3d shadow-gold transition-all flex items-center justify-center gap-2 ${isSuiteFree && !isSubmitting
                  ? 'gold-gradient-bg text-primary-900 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-400 dark:border-gray-700'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                    <span>Synchronizing with ERP Engine...</span>
                  </>
                ) : isSuiteFree ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Authorize & Confirm Sovereign Reservation</span>
                  </>
                ) : (
                  <span>Selected Suite Unavailable for Dates</span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-5">
            <BookingSummary
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              adults={adults}
              children={children}
              roomsCount={roomsCount}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingCheckoutPage;


