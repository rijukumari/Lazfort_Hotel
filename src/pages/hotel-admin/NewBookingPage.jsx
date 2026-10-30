import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { FormField, Input, Select, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  CalendarCheck,
  Save,
  Bed,
  User,
} from 'lucide-react';

export const NewBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rooms, createReservation } = useERP();
  const { showToast } = useToast();

  const queryRoomId = searchParams.get('roomId');
  const initialRoomId = (queryRoomId && rooms.find(r => r.id === queryRoomId)) ? queryRoomId : (rooms[0]?.id || '');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+377 98 00 12 34');
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [nights, setNights] = useState(3);
  const [adults, setAdults] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('High floor suite, champagne welcoming, airport limousine');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const totalAmount = selectedRoom ? selectedRoom.pricePerNight * Number(nights) : 0;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) {
      showToast('Validation Error', 'Guest name and email are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const checkOutDate = new Date(checkIn);
      checkOutDate.setDate(checkOutDate.getDate() + Number(nights));

      const result = createReservation({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim() || '+377 98 00 12 34',
        roomId: selectedRoom?.id,
        roomNumber: selectedRoom?.roomNumber,
        roomType: selectedRoom?.type,
        checkIn,
        checkOut: checkOutDate.toISOString().split('T')[0],
        nights: Number(nights),
        adults: Number(adults),
        children: 0,
        totalAmount,
        paidAmount: totalAmount,
        specialRequests,
      });

      if (!result?.success) {
        showToast('Reservation Error', result?.message || 'Could not create reservation.', 'error');
        return;
      }

      showToast(
        'Reservation Confirmed',
        `Luxury booking confirmed for ${guestName} in Suite ${selectedRoom?.roomNumber}.`,
        'success'
      );
      navigate('/hotel-admin/bookings');
    } catch {
      showToast('Error', 'Failed to create reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Return to Reservations</span>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <CalendarCheck className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Create New Reservation & Folio
            </h1>
          </div>
          <p className="text-xs text-charcoal-muted">
            Provision guest stay dates, allocate luxury inventory, and establish folio escrow billing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Guest Identity */}
          <Card variant="luxury" className="p-6 sm:p-8 space-y-5">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              <span>Guest Identity & Contacts</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Guest Full Name" required>
                <Input
                  required
                  placeholder="e.g. Lord Alexander Sinclair"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                />
              </FormField>

              <FormField label="Official Contact Email" required>
                <Input
                  type="email"
                  required
                  placeholder="alexander.sinclair@sovereign.mc"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Direct Telephone">
              <Input
                placeholder="+377 98 00 12 34"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
              />
            </FormField>
          </Card>

          {/* Stay & Room Allocation */}
          <Card variant="luxury" className="p-6 sm:p-8 space-y-5">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-accent" />
              <span>Suite Allocation & Dates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Assigned Suite" required>
                <Select
                  value={selectedRoomId}
                  onChange={e => setSelectedRoomId(e.target.value)}
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      Suite {room.roomNumber} - {room.name} (${room.pricePerNight?.toLocaleString()}/night)
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Arrival Check-In Date" required>
                <Input
                  type="date"
                  required
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Length of Stay (Nights)" required>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={nights}
                  onChange={e => setNights(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Total Adult Guests" required>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value))}
                />
              </FormField>
            </div>

            <FormField label="Special Concierge Requests & Preferences">
              <textarea
                rows={3}
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vintage champagne on arrival, hypoallergenic goose-down pillows, airport limousine..."
                className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
              />
            </FormField>
          </Card>
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="luxury" className="p-6 space-y-5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-accent block">
              Reservation Summary
            </span>

            {selectedRoom && (
              <div>
                <h4 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Suite {selectedRoom.roomNumber}
                </h4>
                <p className="text-xs text-charcoal-muted mt-0.5">{selectedRoom.name}</p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-900/50 border border-border/80 text-center">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Total Folio Charge</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">
                ${totalAmount?.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                {nights} nights &times; ${selectedRoom?.pricePerNight?.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 text-xs border-y border-border/80 dark:border-white/10 py-4">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Guest Name</span>
                <span className="font-semibold text-primary dark:text-white">{guestName || 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Check-In</span>
                <span className="font-mono text-primary dark:text-white">{checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Adult Guests</span>
                <span className="font-mono text-primary dark:text-white">{adults} Guests</span>
              </div>
            </div>

            <Button
              variant="gold"
              icon={Save}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default NewBookingPage;

