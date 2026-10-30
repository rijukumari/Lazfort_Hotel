import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Utensils,
  Wine,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChefHat
} from 'lucide-react';

const MENU_ITEMS = [
  {
    id: 'dish-1',
    name: 'Imperial Beluga Royal Caviar (50g)',
    category: 'starters',
    categoryLabel: 'Caviar & Starters',
    price: 480,
    description: 'Served on crushed sea ice with buckwheat blinis, organic crème fraîche, sieved quail egg, and mother-of-pearl spoons.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
  },
  {
    id: 'dish-2',
    name: 'Brittany Blue Lobster Carpaccio',
    category: 'starters',
    categoryLabel: 'Caviar & Starters',
    price: 145,
    description: 'Thinly sliced Mediterranean blue lobster, finger lime pearls, extra virgin Taggiasca olive oil, and fleur de sel.',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-3',
    name: 'A5 Miyazaki Wagyu Ribeye (250g)',
    category: 'mains',
    categoryLabel: 'Chef Mains',
    price: 260,
    description: 'Binchotan charcoal-grilled Japanese Miyazaki Wagyu, Pommes Purée Joël Robuchon, and Perigord black truffle jus.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
  },
  {
    id: 'dish-4',
    name: 'Mediterranean Wild Turbot & Artichokes',
    category: 'mains',
    categoryLabel: 'Chef Mains',
    price: 180,
    description: 'Line-caught local turbot pan-roasted in Normandy butter, purple artichoke barigoule, and champagne emulsion.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-5',
    name: 'Hand-Rolled Tagliolini with White Truffle',
    category: 'mains',
    categoryLabel: 'Chef Mains',
    price: 165,
    description: 'Fresh egg pasta tossed with 36-month aged mountain Parmigiano Reggiano and freshly shaved Alba white winter truffle.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281698?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-6',
    name: 'Valrhona Guanaja Chocolate Soufflé',
    category: 'desserts',
    categoryLabel: 'Desserts & Sweets',
    price: 45,
    description: 'Molten Grand Cru dark chocolate soufflé with Madagascar Bourbon vanilla bean crème anglaise.',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-7',
    name: 'Dom Pérignon Vintage Champagne (750ml)',
    category: 'wine',
    categoryLabel: 'Champagne & Cellar',
    price: 420,
    description: 'Chilled in silver ice bucket with crystal Baccarat flutes. Complex brioche, citrus zest, and minerality.',
    image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
  },
  {
    id: 'dish-8',
    name: 'Château Margaux Premier Grand Cru 2015',
    category: 'wine',
    categoryLabel: 'Champagne & Cellar',
    price: 1200,
    description: 'Decanted tableside by Head Sommelier. Seductive blackcurrant, cedarwood, and velvet tannins.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  }
];

export const RoomServicePage = () => {
  const { bookings, rooms, folios, postFolioCharge } = useERP();
  const { user } = useAuth();
  const { showToast } = useToast();

  const userBookings = (bookings || []).filter(b =>
    !user || user.role !== 'customer' ||
    b.guestEmail?.toLowerCase() === user.email?.toLowerCase() ||
    b.guestName?.toLowerCase() === user.name?.toLowerCase()
  );

  const currentBooking =
    userBookings.find(b => b.status === 'checked_in') ||
    userBookings.find(b => b.status === 'confirmed') ||
    (bookings && bookings[0]);

  const room = (rooms || []).find(r => r.id === currentBooking?.roomId) || (rooms && rooms[0]) || { roomNumber: '101' };
  const folio = (folios || []).find(f => f.bookingId === currentBooking?.id);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([
    { item: MENU_ITEMS[0], quantity: 1 },
    { item: MENU_ITEMS[6], quantity: 1 },
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredItems =
    selectedCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter(i => i.category === selectedCategory);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast('Added to Tray', `${item.name} added to in-suite dining order.`, 'info');
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev =>
      prev
        .map(c => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const serviceCharge = Math.round(subtotal * 0.05);
  const total = subtotal + tax + serviceCharge;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Tray Empty', 'Please select at least one item from the menu.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (folio && postFolioCharge) {
        postFolioCharge(folio.id, {
          date: new Date().toISOString().split('T')[0],
          category: 'room_service',
          description: `In-Suite Dining: ${cart.map(c => `${c.quantity}x ${c.item.name}`).join(', ')}`,
          quantity: 1,
          unitPrice: subtotal,
          taxAmount: tax + serviceCharge,
          totalAmount: total,
          postedBy: 'In-Suite Dining Engine',
        });
      }

      setIsSubmitting(false);
      setCart([]);
      showToast(
        'Order Dispatched to Kitchen',
        `Executive Chef Laurent has begun preparation for Suite ${room.roomNumber}. Your butler will deliver in approximately 25 minutes. Total €${total.toLocaleString()} billed to your stay folio.`,
        'success'
      );
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="In-Suite Michelin Dining & Sommelier Service"
        description={`Delivered silver-cloche to Suite ${room.roomNumber} with crystal stemware, artisanal bread, and dedicated butler presentation.`}
        badge="24/7 Palace Room Service"
      />

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Gourmet Selections' },
          { id: 'starters', label: 'Caviar & Starters' },
          { id: 'mains', label: 'Chef’s Entrées' },
          { id: 'desserts', label: 'Artisanal Desserts' },
          { id: 'wine', label: 'Champagne & Grand Crus' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat.id
                ? 'gold-gradient-bg text-primary-900 font-bold shadow-gold scale-105'
                : 'btn-secondary-3d text-charcoal-muted dark:text-gray-300 hover:text-accent'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2-Column: Menu Items & Interactive Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Menu Items Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="card-luxury-3d rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-all"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {item.isChefSpecial && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-primary-900 shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Signature
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <span className="text-[10px] font-mono uppercase text-accent font-bold">
                    {item.categoryLabel}
                  </span>
                  <span className="font-serif font-bold text-lg text-accent">
                    €{item.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 text-xs">
                <div>
                  <h4 className="font-serif font-bold text-base text-primary dark:text-white leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/70 dark:border-white/10 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Tray</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sticky In-Suite Tray Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-5">
          <div className="card-luxury-3d p-6 rounded-3xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 dark:border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Suite {room.roomNumber} Tray
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-accent px-2 py-0.5 rounded-full bg-accent/15">
                {cart.reduce((sum, c) => sum + c.quantity, 0)} Items
              </span>
            </div>

            {/* Tray items */}
            {cart.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-charcoal-muted dark:text-gray-400 text-xs">
                <ChefHat className="w-8 h-8 text-accent/40 mx-auto" />
                <p>Your room dining tray is empty.</p>
                <span className="text-[10px]">Select gourmet items from the menu to order.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map(c => (
                  <div
                    key={c.item.id}
                    className="p-3 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/70 dark:border-white/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="font-semibold text-primary dark:text-white truncate text-[11px]">
                        {c.item.name}
                      </h5>
                      <span className="text-[10px] text-accent font-mono">
                        €{c.item.price.toLocaleString()} each
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(c.item.id, -1)}
                        className="w-6 h-6 rounded-lg btn-secondary-3d font-bold flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs">{c.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(c.item.id, 1)}
                        className="w-6 h-6 rounded-lg btn-secondary-3d font-bold flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-semibold text-charcoal-muted dark:text-gray-300">
                Kitchen Instructions (Allergies / Bread)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra lemons, gluten-free bread..."
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-primary-900 border border-border dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            {/* Financial summary */}
            <div className="p-3.5 rounded-2xl bg-ivory/60 dark:bg-primary-900/30 border border-border/60 dark:border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-charcoal-muted dark:text-gray-300">
                <span>Subtotal:</span>
                <span className="font-mono">€{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted dark:text-gray-300">
                <span>Tax (10%):</span>
                <span className="font-mono">€{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted dark:text-gray-300">
                <span>Butler White-Glove Fee (5%):</span>
                <span className="font-mono">€{serviceCharge.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-border dark:border-white/10 flex justify-between font-bold text-primary dark:text-white text-sm">
                <span>Total to Folio:</span>
                <span className="font-serif text-accent text-base">€{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              disabled={isSubmitting || cart.length === 0}
              onClick={handlePlaceOrder}
              className={`w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs btn-3d shadow-gold transition-all flex items-center justify-center gap-2 ${cart.length > 0 && !isSubmitting
                  ? 'gold-gradient-bg text-primary-900 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-300 dark:border-gray-700'
                }`}
            >
              {isSubmitting ? (
                <span>Dispatching Order...</span>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  <span>Order to Suite {room.roomNumber}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted dark:text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Est. Butler Delivery: ~25 Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomServicePage;

