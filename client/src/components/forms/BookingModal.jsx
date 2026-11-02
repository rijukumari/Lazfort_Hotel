import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { ModalFooter } from '../ui/ModalFooter';
import { FormField, Input, Select, Textarea } from './FormField';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const BookingModal = ({
  isOpen,
  onClose,
  onSave,
  initialRoomId,
  initialData,
}) => {
  const { showToast } = useToast();
  const { rooms = [], createReservation } = useERP();

  const effectiveInitialRoomId = initialRoomId || initialData?.roomId;
  const [guestName, setGuestName] = useState(initialData?.guestName || '');
  const [guestEmail, setGuestEmail] = useState(initialData?.guestEmail || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(effectiveInitialRoomId || rooms[0]?.id || 'room-101');
  const [checkIn, setCheckIn] = useState(initialData?.checkIn || new Date().toISOString().split('T')[0]);
  const [nights, setNights] = useState(3);
  const [adults, setAdults] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const totalAmount = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!guestName || !guestEmail) {
      showToast('Validation Error', 'Please complete the guest name and email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const checkOutDate = new Date(checkIn);
      checkOutDate.setDate(checkOutDate.getDate() + Number(nights));

      const result = createReservation({
        guestName,
        guestEmail,
        guestPhone: guestPhone || '+377 98 00 12 34',
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

      if (!result.success) {
        showToast('Reservation Error', result.message, 'error');
        return;
      }

      if (onSave && result.booking) onSave(result.booking);
      showToast('Reservation Confirmed', result.message, 'success');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create VIP Reservation"
      description="Book a suite and automatically instantiate guest folios and ledger accounts."
      maxWidth="xl"
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Guest Full Name" required>
            <Input
              required
              placeholder="e.g. Duke William Somerset"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              required
              type="email"
              placeholder="guest@sovereign.org"
              value={guestEmail}
              onChange={e => setGuestEmail(e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Contact Phone">
            <Input
              placeholder="+377 98 00 00 00"
              value={guestPhone}
              onChange={e => setGuestPhone(e.target.value)}
            />
          </FormField>

          <FormField label="Select Luxury Suite" required>
            <Select
              value={selectedRoomId}
              onChange={e => setSelectedRoomId(e.target.value)}
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} - {r.name} (${r.pricePerNight}/night)
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Check-In Date" required>
            <Input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
          </FormField>

          <FormField label="Nights" required>
            <Input
              type="number"
              min="1"
              max="30"
              value={nights}
              onChange={e => setNights(Number(e.target.value))}
            />
          </FormField>

          <FormField label="Guests">
            <Input
              type="number"
              min="1"
              max="6"
              value={adults}
              onChange={e => setAdults(Number(e.target.value))}
            />
          </FormField>
        </div>

        <FormField label="Special Concierge Preferences / Dietary Requests">
          <Textarea
            rows={2}
            placeholder="e.g. Vintage champagne on arrival, late checkout, feather pillows..."
            value={specialRequests}
            onChange={e => setSpecialRequests(e.target.value)}
          />
        </FormField>

        {/* Pricing Summary Card */}
        <div className="p-4 bg-ivory/60 dark:bg-primary-950/70 rounded-2xl border border-border/80 dark:border-accent/25 flex items-center justify-between text-xs shadow-sm">
          <div>
            <span className="text-charcoal-muted dark:text-gray-400 font-mono">Estimated Total Stay Amount:</span>
            <p className="font-serif text-xl font-bold text-accent mt-0.5">
              ${totalAmount.toLocaleString()} USD
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl font-bold uppercase tracking-wider text-[10px] font-mono">
            Instant Confirmation
          </span>
        </div>

        <ModalFooter
          onCancel={onClose}
          cancelText="Cancel"
          confirmText="Confirm Reservation"
          confirmVariant="gold"
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  );
};

export default BookingModal;

