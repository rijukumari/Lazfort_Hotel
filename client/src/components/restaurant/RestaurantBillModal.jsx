import React, { useState, useEffect } from 'react';
import { X, Receipt, CheckCircle, Printer, Download, CreditCard, BedDouble, Plus, Trash2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const RestaurantBillModal = ({
  isOpen,
  onClose,
  bill = null,
  orderToBill = null,
  onSuccess,
}) => {
  const {
    restaurantOrders = [],
    folios = [],
    generateRestaurantBill,
    recordRestaurantBillPayment,
    postRestaurantBillToFolio,
  } = useERP();
  const { showToast } = useToast();

  const isNewBill = !bill && Boolean(orderToBill);

  const [selectedOrderId, setSelectedOrderId] = useState(orderToBill?.orderNumber || orderToBill?.id || '');
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [serviceChargeRate, setServiceChargeRate] = useState(5);
  const [taxRate, setTaxRate] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa/Mastercard)');
  const [targetRoom, setTargetRoom] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (bill) {
      setSubtotal(bill.subtotal || 0);
      setDiscount(bill.discount || 0);
      setTargetRoom(bill.roomNumber || '');
      setPaymentMethod(bill.paymentMethod || 'Credit Card (Visa/Mastercard)');
    } else if (orderToBill) {
      setSubtotal(orderToBill.subtotal || orderToBill.totalAmount || 0);
      setDiscount(orderToBill.discount || 0);
      setTargetRoom(orderToBill.roomNumber || '');
      setSelectedOrderId(orderToBill.orderNumber || orderToBill.id);
    }
  }, [bill, orderToBill, isOpen]);

  if (!isOpen) return null;

  const currentOrder =
    orderToBill ||
    restaurantOrders.find(o => o.orderNumber === selectedOrderId || o.id === selectedOrderId) ||
    {};

  const calculatedTax = Math.round(Math.max(0, subtotal - discount) * (taxRate / 100));
  const calculatedService = Math.round(Math.max(0, subtotal - discount) * (serviceChargeRate / 100));
  const grandTotal = Math.max(0, subtotal - discount + calculatedTax + calculatedService);

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!currentOrder || (!currentOrder.id && !currentOrder.orderNumber)) {
      showToast('Selection Required', 'Please select a culinary order to bill.', 'error');
      return;
    }

    const res = generateRestaurantBill(currentOrder, {
      subtotal,
      discount: Number(discount),
      tax: calculatedTax,
      serviceCharge: calculatedService,
      grandTotal,
      roomNumber: targetRoom || currentOrder.roomNumber,
      paymentMethod,
    });

    if (res?.success) {
      showToast('Bill Generated', res.message, 'success');
      if (onSuccess) onSuccess(res.bill);
      onClose();
    } else {
      showToast('Notice', res?.message || 'Bill creation issue.', 'info');
    }
  };

  const handleSettleDirectly = () => {
    if (!bill) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      const res = recordRestaurantBillPayment(bill.id || bill.billNumber, paymentMethod, bill.grandTotal);
      setIsProcessingPayment(false);
      if (res?.success) {
        showToast('Settlement Complete', res.message, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    }, 400);
  };

  const handlePostToFolio = () => {
    if (!bill) return;
    const roomToPost = targetRoom || bill.roomNumber;
    if (!roomToPost) {
      showToast('Room Required', 'Please enter or select a guest room number to post to folio.', 'error');
      return;
    }

    const res = postRestaurantBillToFolio(bill.id || bill.billNumber, roomToPost);
    if (res?.success) {
      showToast('Folio Charge Posted', res.message, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      showToast('Posting Intercepted', res.message, 'error');
    }
  };

  const handlePrint = () => {
    showToast('Printing Invoice', 'Folio receipt dispatched to Palace POS printer.', 'info');
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

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                  {bill ? `Invoice #${bill.billNumber}` : 'Generate Restaurant Bill'}
                </h3>
                {bill && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      bill.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {bill.paymentStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Lazfort Palace Fine Gastronomy & Suite Billing Terminal
              </p>
            </div>
          </div>

          {bill && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-ivory dark:bg-white/5 hover:bg-accent/20 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 transition-colors"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4 text-accent" />
              </button>
            </div>
          )}
        </div>

        {/* Form or Bill Detail */}
        {isNewBill ? (
          <form onSubmit={handleCreateBill} className="space-y-4">
            <div className="p-4 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/70 dark:border-white/10 space-y-2">
              <p className="text-xs font-semibold text-primary dark:text-white">
                Selected Order: #{currentOrder.orderNumber} ({currentOrder.orderType})
              </p>
              <p className="text-xs text-charcoal-muted">
                Guest: <span className="font-medium text-primary dark:text-white">{currentOrder.guestName}</span> •{' '}
                Location: <span className="text-accent">{currentOrder.roomNumber ? `Suite ${currentOrder.roomNumber}` : currentOrder.tableNumber || 'Dining Room'}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                  Subtotal ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={subtotal}
                  onChange={e => setSubtotal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                  VIP Courtesy Discount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={e => setDiscount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                  Monaco Luxury Tax Rate (%): {taxRate}%
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={taxRate}
                  onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                  Butler Service Charge (%): {serviceChargeRate}%
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={serviceChargeRate}
                  onChange={e => setServiceChargeRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Room linking for Folio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                Charge to Suite Folio (Optional Suite #)
              </label>
              <input
                type="text"
                value={targetRoom}
                onChange={e => setTargetRoom(e.target.value)}
                placeholder="e.g. 101, 202, PH-01"
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white"
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-muted">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Courtesy Discount</span>
                  <span className="font-mono">-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-muted">
                <span>Tax ({taxRate}%)</span>
                <span className="font-mono">${calculatedTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted">
                <span>Service Gratuity ({serviceChargeRate}%)</span>
                <span className="font-mono">${calculatedService.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-accent/20 flex justify-between font-serif font-bold text-base text-primary dark:text-white">
                <span>Grand Total</span>
                <span className="text-accent">${grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Issue Bill</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Existing Bill View */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                <p className="text-[10px] uppercase font-bold text-charcoal-muted">Bill Date</p>
                <p className="font-semibold text-primary dark:text-white mt-0.5">{bill.billDate}</p>
              </div>
              <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                <p className="text-[10px] uppercase font-bold text-charcoal-muted">Guest</p>
                <p className="font-semibold text-primary dark:text-white mt-0.5 truncate">{bill.guestName}</p>
              </div>
              <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                <p className="text-[10px] uppercase font-bold text-charcoal-muted">Location</p>
                <p className="font-semibold text-accent mt-0.5">{bill.roomNumber ? `Suite ${bill.roomNumber}` : bill.tableNumber || 'Dining'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-ivory/50 dark:bg-white/[0.02] border border-border/60 dark:border-white/5">
                <p className="text-[10px] uppercase font-bold text-charcoal-muted">Order Ref</p>
                <p className="font-mono font-semibold text-primary dark:text-white mt-0.5">{bill.orderId}</p>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-2.5 text-xs">
              <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
                <span>Food & Beverage Net</span>
                <span className="font-mono">${(bill.subtotal || 0).toLocaleString()}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Discount Applied</span>
                  <span className="font-mono">-${bill.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
                <span>Value Added Tax</span>
                <span className="font-mono">${(bill.tax || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
                <span>Service & Sommelier Fee</span>
                <span className="font-mono">${(bill.serviceCharge || 0).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-accent/20 flex justify-between font-serif font-bold text-lg text-primary dark:text-white">
                <span>Grand Amount</span>
                <span className="text-accent">${(bill.grandTotal || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Post to Folio or Direct Settlement Actions */}
            {bill.paymentStatus !== 'Paid' ? (
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#121926] border border-border/80 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-300">
                  Settlement Channels:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Charge to Suite Folio */}
                  <div className="p-3 rounded-xl border border-border/80 dark:border-white/10 space-y-2 bg-ivory/30 dark:bg-transparent">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-white">
                      <BedDouble className="w-4 h-4 text-accent" />
                      <span>Post to Guest Folio</span>
                    </div>
                    <input
                      type="text"
                      value={targetRoom}
                      onChange={e => setTargetRoom(e.target.value)}
                      placeholder="Room Number (e.g. 101)"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#101725] border border-border/80 dark:border-white/10 text-xs"
                    />
                    <button
                      onClick={handlePostToFolio}
                      className="w-full py-2 rounded-xl bg-accent text-white dark:text-primary-950 font-semibold text-xs shadow-gold hover:opacity-95 transition-all"
                    >
                      Post Charge to Folio
                    </button>
                  </div>

                  {/* Immediate Terminal Settlement */}
                  <div className="p-3 rounded-xl border border-border/80 dark:border-white/10 space-y-2 bg-ivory/30 dark:bg-transparent">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-white">
                      <CreditCard className="w-4 h-4 text-accent" />
                      <span>Direct Payment Terminal</span>
                    </div>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#101725] border border-border/80 dark:border-white/10 text-xs"
                    >
                      <option value="Credit Card (Visa/Mastercard)">Credit Card (Visa/Mastercard)</option>
                      <option value="Centurion Black Card">Centurion Black Card</option>
                      <option value="Cash (Monaco Treasury)">Cash (Monaco Treasury)</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                    </select>
                    <button
                      onClick={handleSettleDirectly}
                      disabled={isProcessingPayment}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      {isProcessingPayment ? 'Processing...' : 'Settle Now ($' + bill.grandTotal.toLocaleString() + ')'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Payment Fully Settled
                  </p>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Settled via {bill.paymentMethod} {bill.folioRef ? `(Folio ${bill.folioRef})` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantBillModal;

