import React from 'react';
import { X, Utensils, Printer, CheckCircle, Clock, Ban, DollarSign, ChefHat } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const FoodOrderDetailsModal = ({
  isOpen,
  onClose,
  order = null,
  onStatusChange,
}) => {
  const { updateRestaurantOrderStatus, cancelRestaurantOrder } = useERP();
  const { showToast } = useToast();

  if (!isOpen || !order) return null;

  const handleUpdateStatus = (newStatus) => {
    updateRestaurantOrderStatus(order.id || order.orderNumber, newStatus);
    showToast('Order Status Updated', `Order #${order.orderNumber} transitioned to ${newStatus}.`, 'success');
    if (onStatusChange) onStatusChange(newStatus);
    onClose();
  };

  const handleCancelOrder = () => {
    cancelRestaurantOrder(order.id || order.orderNumber, 'Cancelled via Order Console');
    showToast('Order Cancelled', `Order #${order.orderNumber} has been cancelled.`, 'info');
    if (onStatusChange) onStatusChange('Cancelled');
    onClose();
  };

  const handlePrintKOT = () => {
    showToast('Kitchen Ticket Dispatched', `KOT for #${order.orderNumber} sent to Executive Chef station.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#101725] rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
          title="Close Modal"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                  Order #{order.orderNumber}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Placement Time: {order.orderTime || order.createdAt?.slice(0, 16)}
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintKOT}
            className="px-3.5 py-2 rounded-xl bg-ivory dark:bg-white/5 hover:bg-accent/15 border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-200 flex items-center gap-1.5 transition-colors"
            title="Print Kitchen Order Ticket"
          >
            <Printer className="w-3.5 h-3.5 text-accent" />
            <span>Print KOT</span>
          </button>
        </div>

        {/* Order Meta Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
            <p className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400">Guest Name</p>
            <p className="text-xs font-semibold text-primary dark:text-white truncate mt-0.5">
              {order.guestName || 'VIP Resident'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
            <p className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400">Service Type</p>
            <p className="text-xs font-semibold text-accent truncate mt-0.5">{order.orderType}</p>
          </div>
          <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
            <p className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400">Location</p>
            <p className="text-xs font-semibold text-primary dark:text-white truncate mt-0.5">
              {order.roomNumber ? `Suite ${order.roomNumber}` : order.tableNumber || 'Main Dining'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
            <p className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400">Billing Status</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
              {order.paymentStatus || 'Pending'}
            </p>
          </div>
        </div>

        {/* Ordered Selections Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
            Culinary Selections ({order.items?.length || 0} items)
          </h4>
          <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden divide-y divide-border/60 dark:divide-white/5">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-3 flex items-center justify-between text-xs bg-white/40 dark:bg-transparent hover:bg-accent/[0.02]"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-primary dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Unit Price: ${Number(item.unitPrice || 0).toLocaleString()} • Qty: {item.quantity}
                  </p>
                </div>
                <div className="font-serif font-bold text-accent text-sm">
                  ${(Number(item.quantity) * Number(item.unitPrice || 0)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-2 text-xs">
          <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-mono text-primary dark:text-white">
              ${(order.subtotal || order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
            <span>Taxes & Service Charge</span>
            <span className="font-mono text-primary dark:text-white">
              ${((order.tax || 0) + (order.serviceCharge || 0)).toLocaleString()}
            </span>
          </div>
          <div className="pt-2 border-t border-accent/20 flex justify-between font-serif font-bold text-base text-primary dark:text-white">
            <span>Grand Total</span>
            <span className="text-accent">${(order.totalAmount || 0).toLocaleString()}</span>
          </div>
        </div>

        {order.notes && (
          <div className="p-3 rounded-xl bg-ivory dark:bg-white/5 border border-border/60 dark:border-white/5 text-xs">
            <span className="font-semibold text-charcoal-muted">Guest Instructions:</span>{' '}
            <span className="text-charcoal dark:text-gray-300">{order.notes}</span>
          </div>
        )}

        {/* Operational Status Action Bar */}
        <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted dark:text-gray-400">
            Workflow Transitions:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {order.status === 'Pending' || order.status === 'New' ? (
              <>
                <button
                  onClick={() => handleUpdateStatus('Accepted')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Accept Order</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Preparing')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Send to Kitchen (Preparing)</span>
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all ml-auto"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Reject Order</span>
                </button>
              </>
            ) : order.status === 'Accepted' || order.status === 'Preparing' ? (
              <>
                <button
                  onClick={() => handleUpdateStatus('Ready')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Ready for Butler / Server</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus('Served')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Mark Served to Table</span>
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all ml-auto"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Order</span>
                </button>
              </>
            ) : order.status === 'Ready' || order.status === 'Served' ? (
              <>
                <button
                  onClick={() => handleUpdateStatus('Completed')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-gold transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Order as Completed</span>
                </button>
              </>
            ) : (
              <p className="text-xs text-charcoal-muted italic">Order has reached final lifecycle state.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodOrderDetailsModal;

