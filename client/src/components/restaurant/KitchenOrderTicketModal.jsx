import React from 'react';
import { X, Printer, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '../ui/Button';

export const KitchenOrderTicketModal = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury w-full max-w-md p-6 sm:p-7 rounded-3xl border border-accent/40 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Kitchen Order Ticket (KOT)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Printable Ticket */}
        <div id="printable-kot" className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-dashed border-border dark:border-white/20 font-mono text-xs space-y-4 text-charcoal dark:text-gray-100 shadow-inner">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-border/80 dark:border-white/20">
            <h2 className="font-serif font-bold text-base tracking-widest text-primary dark:text-white">
              LAZFORT GRAND PALACE
            </h2>
            <p className="text-[10px] uppercase text-accent font-bold">
              Executive Kitchen Dispatch
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span>KOT #: {order.orderNumber}</span>
              <span>{order.orderTime || new Date().toISOString().slice(0, 16)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-b border-dashed border-border/80 dark:border-white/20">
            <div>
              <span className="text-charcoal-muted block">Location:</span>
              <span className="font-bold text-accent">
                {order.roomNumber ? `Suite ${order.roomNumber}` : order.tableNumber || 'Main Dining Room'}
              </span>
            </div>
            <div>
              <span className="text-charcoal-muted block">Order Type:</span>
              <span className="font-bold">{order.orderType}</span>
            </div>
            <div className="col-span-2">
              <span className="text-charcoal-muted block">Guest:</span>
              <span className="font-bold">{order.guestName}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-[11px] uppercase border-b border-border/60 pb-1">
              <span>Item & Course</span>
              <span>Qty</span>
            </div>
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-semibold">{it.name}</span>
                <span className="font-bold px-2 py-0.5 rounded bg-accent/15 text-accent">
                  x{it.quantity}
                </span>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className="pt-2 border-t border-dashed border-border/80 text-[11px] text-amber-600 dark:text-amber-400">
              <span className="font-bold block">Chef Directive:</span>
              <span>{order.notes}</span>
            </div>
          )}

          <div className="text-center pt-2 text-[10px] text-charcoal-muted uppercase">
            *** Expedite White-Glove Standard ***
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="gold" icon={Printer} onClick={handlePrint}>
            Print Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KitchenOrderTicketModal;

