import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader, FormField, Input, Select, Button } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  Bed,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const AddRoomPage = () => {
  const navigate = useNavigate();
  const { addRoom } = useERP();
  const { showToast } = useToast();

  const [roomNumber, setRoomNumber] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('Executive Suite');
  const [pricePerNight, setPricePerNight] = useState(1500);
  const [floor, setFloor] = useState(6);
  const [bedType, setBedType] = useState('King');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomNumber.trim() || !roomName.trim()) {
      showToast('Validation Error', 'Please specify room number and name.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const newRoom = {
        id: `room-${Date.now()}`,
        roomNumber: roomNumber.trim(),
        name: roomName.trim(),
        type: roomType,
        floor: Number(floor),
        capacity: 2,
        bedType,
        pricePerNight: Number(pricePerNight),
        status: 'available',
        amenities: ['Panoramic Balcony', 'Bulgari Toiletries', 'Nespresso Atelier', '24/7 Concierge'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        sizeSqFt: 1200,
        view: 'Ocean Front',
        rating: 4.9,
        cleaningStatus: 'clean',
        description: description || 'Bespoke luxury suite overlooking the French Riviera.',
      };

      addRoom(newRoom);
      showToast('Suite Added', `Suite ${newRoom.roomNumber} successfully added to hotel inventory.`, 'success');
      navigate('/hotel-admin/rooms');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Back button and Page Header */}
      <div className="space-y-4">
        <Link
          to="/hotel-admin/rooms"
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Suites & Inventory</span>
        </Link>

        <PageHeader
          title="Add New Luxury Suite"
          description="Introduce a new royal chamber, penthouse or ocean villa into the active hotel inventory."
          badge="Inventory Provisioning"
        />
      </div>

      {/* Main Form Container */}
      <form id="add-suite-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/25 p-6 sm:p-8 shadow-xl relative">
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="flex items-center gap-3 pb-6 border-b border-border dark:border-white/10 mb-6">
            <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Suite Specifications & Pricing
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Chamber code, nightly tariff, floor level, and bed arrangement.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Suite Code / Number" required>
                <Input
                  required
                  placeholder="e.g. PH-1402"
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                />
              </FormField>

              <FormField label="Suite Title" required>
                <Input
                  required
                  placeholder="e.g. The Grand Elysian Penthouse"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Suite Category" required>
                <Select
                  value={roomType}
                  onChange={e => setRoomType(e.target.value)}
                >
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Royal Penthouse">Royal Penthouse</option>
                  <option value="Deluxe Ocean Villa">Deluxe Ocean Villa</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Grand Heritage Room">Grand Heritage Room</option>
                  <option value="Junior Suite">Junior Suite</option>
                </Select>
              </FormField>

              <FormField label="Price Per Night ($ USD)" required>
                <Input
                  type="number"
                  min="100"
                  max="50000"
                  value={pricePerNight}
                  onChange={e => setPricePerNight(Number(e.target.value))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Floor Level">
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={floor}
                  onChange={e => setFloor(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Bed Configuration">
                <Select
                  value={bedType}
                  onChange={e => setBedType(e.target.value)}
                >
                  <option value="Super King">Super King</option>
                  <option value="King">King</option>
                  <option value="Twin">Twin</option>
                  <option value="Queen">Queen</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Suite Description & Highlights">
              <textarea
                rows={4}
                placeholder="Detail the hand-crafted marble, private infinity deck, butler station, and bespoke amenities..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border dark:border-white/10 mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/hotel-admin/rooms')}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              icon={Sparkles}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Suite...' : 'Create Suite Record'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoomPage;

