import React from 'react';
import { X, Printer, CheckCircle, Clock, UtensilsCrossed, AlertTriangle, FileText, Ban } from 'lucide-react';
import { Button } from '../ui/Button';
import { OrderStatusBadge } from './OrderStatusBadge';

export const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  onStatusChange,
  onCancelOrder,
  onPrintKOT,
  onGenerateBill,
}) => {
  if (!isOpen || !order) return null;

  const statusWorkflow = ['New', 'Accepted', 'Preparing', 'Ready', 'Served'];
  const currentIndex = statusWorkflow.indexOf(order.status);
  const nextStatus = currentIndex >= 0 && currentIndex < statusWorkflow.length - 1 ? statusWorkflow[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-accent/40 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase font-bold px-2.5 py-0.5 rounded-lg bg-accent/15 text-accent border border-accent/30">
                {order.orderNumber}
              </span>
              <OrderStatusBadge status={order.status} />
              <span className="text-xs text-charcoal-muted font-mono">{order.orderTime}</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white mt-1">
              {order.guestName}
            </h3>
            <p className="text-xs text-accent font-semibold">
              {order.roomNumber ? `Suite ${order.roomNumber} (In-Suite Service)` : order.tableNumber || 'Main Dining Room'} • {order.orderType}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-primary dark:hover:text-white hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Pipeline Visualizer */}
        <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-900/40 border border-border/80 dark:border-white/10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal-muted dark:text-gray-400 font-bold block mb-2">
            Kitchen Pipeline State
          </span>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border dark:bg-white/10 -z-0" />
            {statusWorkflow.map((st, i) => {
              const isPastOrCurrent = currentIndex >= i;
              const isCurrent = order.status === st;
              return (
                <div key={st} className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'gold-gradient-bg text-primary-950 scale-110 shadow-gold'
                        : isPastOrCurrent
                        ? 'bg-accent/20 text-accent border border-accent'
                        : 'bg-white dark:bg-primary-800 text-charcoal-muted border border-border dark:border-white/15'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[10px] font-mono tracking-wide ${
                      isCurrent ? 'text-accent font-bold' : 'text-charcoal-muted'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Selections Table */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-primary dark:text-white flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-accent" />
            <span>Michelin Culinary Selections</span>
          </h4>

          <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden divide-y divide-border/60 dark:divide-white/5 text-xs">
            {order.items?.map((it, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-accent/15 text-accent font-mono font-bold flex items-center justify-center text-xs">
                    {it.quantity}x
                  </span>
                  <div>
                    <p className="font-semibold text-primary dark:text-white">{it.name}</p>
                    <p className="text-[11px] text-charcoal-muted">Special Gastronomic Course</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-accent">
                    ${(Number(it.unitPrice) * Number(it.quantity)).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-charcoal-muted">
                    ${Number(it.unitPrice).toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions & Notes */}
        {order.notes && (
          <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-accent">
              Sommelier & In-Suite Delivery Directives
            </span>
            <p className="text-charcoal dark:text-gray-200">{order.notes}</p>
          </div>
        )}

        {/* Financial Overview */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-primary-900/50 border border-border/80 dark:border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-charcoal-muted">
            <span>Subtotal</span>
            <span className="font-mono font-semibold">${Number(order.subtotal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-charcoal-muted">
            <span>Statutory Hospitality VAT (10%)</span>
            <span className="font-mono font-semibold">${Number(order.tax || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-charcoal-muted">
            <span>Fine Dining Service Charge (5%)</span>
            <span className="font-mono font-semibold">${Number(order.serviceCharge || 0).toLocaleString()}</span>
          </div>
          {Number(order.discount || 0) > 0 && (
            <div className="flex justify-between text-emerald-500 font-semibold">
              <span>VIP Courtesy Privilege Discount</span>
              <span className="font-mono">-${Number(order.discount).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border/80 dark:border-white/10 font-bold text-sm">
            <span className="text-primary dark:text-white">Order Total</span>
            <span className="font-serif text-accent text-base">
              ${Number(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              icon={Printer}
              onClick={() => onPrintKOT?.(order)}
            >
              Print KOT Ticket
            </Button>
            {onGenerateBill && (
              <Button
                variant="outline"
                icon={FileText}
                onClick={() => onGenerateBill(order)}
              >
                Generate Bill
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {order.status !== 'Cancelled' && order.status !== 'Served' && (
              <Button
                variant="danger"
                icon={Ban}
                onClick={() => onCancelOrder?.(order.id)}
              >
                Cancel Order
              </Button>
            )}

            {nextStatus && (
              <Button
                variant="gold"
                icon={CheckCircle}
                onClick={() => onStatusChange?.(order.id, nextStatus)}
              >
                Mark As {nextStatus}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

