import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { mockMenuItems } from '../../data/mockERPData';
import { FormField, Select, Input, Button, Card } from '../../components/ui';
import { ArrowLeft, UtensilsCrossed, Sparkles } from 'lucide-react';

export const NewRestaurantOrderPage = () => {
  const navigate = useNavigate();
  const { rooms, submitRestaurantOrder } = useERP();
  const { showToast } = useToast();

  const [selectedRoomNumber, setSelectedRoomNumber] = useState(
    rooms.find(r => r.status === 'occupied')?.roomNumber || (rooms[0]?.roomNumber || '101')
  );
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(mockMenuItems[0]?.id || '');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = mockMenuItems.find(m => m.id === selectedMenuItemId) || mockMenuItems[0];
  const itemTotal = (selectedItem?.price || 0) * itemQuantity;
  const tax = Math.round(itemTotal * 0.1);
  const serviceCharge = Math.round(itemTotal * 0.15);
  const grandTotal = itemTotal + tax + serviceCharge;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = submitRestaurantOrder({
        outletName: 'Le Grand Colbert Haute Gastronomie',
        orderType: 'Room Service',
        roomNumber: selectedRoomNumber,
        paymentStatus: 'charged_to_room',
        items: [
          {
            menuItemId: selectedItem.id,
            name: selectedItem.name,
            quantity: itemQuantity,
            unitPrice: selectedItem.price,
            instructions: specialInstructions,
          },
        ],
      });

      if (res?.success) {
        showToast('Order Transmitted', res.message, 'success');
        navigate('/hotel-admin/restaurant');
      } else {
        showToast('Order Failed', res?.message || 'Failed to place order', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl pb-16">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/hotel-admin/restaurant"
          className="p-2.5 rounded-2xl bg-white dark:bg-primary-900 border border-border dark:border-white/10 hover:border-accent text-charcoal dark:text-gray-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-accent" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
              Gastronomic Dispatch
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary dark:text-white">
            Dispatch In-Suite Fine Dining Order
          </h1>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
            Post Michelin dining course directly to active Guest Folio with sommelier pairing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/70 dark:border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-primary dark:text-white">
                Order Specifications
              </h2>
              <p className="text-xs text-charcoal-muted">
                Select occupied suite and culinary selections
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Target Suite (Occupied Stays)" required>
              <Select
                value={selectedRoomNumber}
                onChange={e => setSelectedRoomNumber(e.target.value)}
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.roomNumber}>
                    Suite {r.roomNumber} — {r.type} ({(r.status || '').toUpperCase()})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Portions / Quantity" required>
              <Input
                type="number"
                min={1}
                max={20}
                required
                value={itemQuantity}
                onChange={e => setItemQuantity(Math.max(1, Number(e.target.value)))}
              />
            </FormField>
          </div>

          <FormField label="Michelin Signature Course / Wine Selection" required>
            <Select
              value={selectedMenuItemId}
              onChange={e => setSelectedMenuItemId(e.target.value)}
            >
              {mockMenuItems.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} — ${m.price.toLocaleString()} ({m.category})
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Chef & Sommelier Notes / Dietary Preferences">
            <Input
              type="text"
              placeholder="e.g. Medium rare, chilled crystal flutes, white-glove presentation"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
            />
          </FormField>

          {/* Pricing Estimation Summary */}
          <div className="p-4 rounded-2xl bg-ivory dark:bg-primary-950/60 border border-border/80 dark:border-white/10 space-y-2">
            <div className="flex justify-between text-xs text-charcoal-muted">
              <span>Item Subtotal ({itemQuantity}x)</span>
              <span>${itemTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-charcoal-muted">
              <span>Service Charge & White Glove Delivery (15%)</span>
              <span>${serviceCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-charcoal-muted">
              <span>Tax (10%)</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-border/60 dark:border-white/10 flex justify-between font-serif font-bold text-sm text-primary dark:text-white">
              <span>Folio Total Charge</span>
              <span className="text-accent text-base">${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/hotel-admin/restaurant')}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            type="submit"
            disabled={isSubmitting}
            icon={Sparkles}
          >
            {isSubmitting ? 'Transmitting...' : 'Transmit Order to Kitchen'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewRestaurantOrderPage;

