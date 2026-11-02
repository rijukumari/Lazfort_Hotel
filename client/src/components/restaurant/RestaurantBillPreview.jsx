import React, { useState } from 'react';
import { X, Printer, CreditCard, BedDouble, CheckCircle, FileText, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export const RestaurantBillPreview = ({
  isOpen,
  onClose,
  bill,
  onRecordPayment,
  onPostToFolio,
  onApplyDiscount,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa/Mastercard)');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [targetRoom, setTargetRoom] = useState(bill?.roomNumber || '');

  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = bill.paymentStatus === 'Paid';
  const isPosted = bill.postedToFolio;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-luxury w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-accent/40 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-border/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase font-bold px-2.5 py-0.5 rounded-lg bg-accent/15 text-accent border border-accent/30">
                {bill.billNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isPaid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {bill.paymentStatus}
              </span>
              {isPosted && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Posted to Folio
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-xl text-primary dark:text-white mt-1">
              Dining Invoice & Commercial Folio
            </h3>
            <p className="text-xs text-charcoal-muted">
              Order Ref: <span className="font-mono text-accent font-semibold">{bill.orderId}</span> • Generated {bill.billDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-primary dark:hover:text-white hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div id="printable-bill" className="p-6 rounded-2xl bg-white dark:bg-black/30 border border-border/80 dark:border-white/10 space-y-5 text-xs">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-border/70 dark:border-white/10">
            <div>
              <h2 className="font-serif font-bold text-lg text-primary dark:text-white">
                LAZFORT GRAND LUXE PALACE
              </h2>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Le Grand Colbert Restaurant & Sommelier Reserve
              </p>
              <p className="text-[10px] text-charcoal-muted">Tax Registration: MC-893021-X</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Invoice Ref</span>
              <p className="font-mono font-bold text-accent text-sm">{bill.billNumber}</p>
              <p className="text-[11px] text-charcoal-muted">{bill.billDate}</p>
            </div>
          </div>

          {/* Guest / Order Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2 border-b border-border/70 dark:border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Billed To Guest</span>
              <span className="font-semibold text-primary dark:text-white">{bill.guestName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Table / Suite</span>
              <span className="font-semibold text-accent font-mono">
                {bill.roomNumber ? `Suite ${bill.roomNumber}` : bill.tableNumber || 'Main Dining Hall'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-charcoal-muted block">Payment Method</span>
              <span className="font-semibold text-primary dark:text-white">{bill.paymentMethod}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 py-2">
            <div className="flex justify-between text-charcoal-muted">
              <span>Culinary Gross Subtotal</span>
              <span className="font-mono font-semibold">${Number(bill.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Statutory Monaco Hospitality VAT (10%)</span>
              <span className="font-mono font-semibold">${Number(bill.tax).toLocaleString()}</span>
            </div>
            {bill.serviceCharge !== undefined && (
              <div className="flex justify-between text-charcoal-muted">
                <span>Fine Dining Service Gratuity (5%)</span>
                <span className="font-mono font-semibold">${Number(bill.serviceCharge).toLocaleString()}</span>
              </div>
            )}
            {Number(bill.discount) > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>Promotional Privilege Deduction</span>
                <span className="font-mono">-${Number(bill.discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-border/80 dark:border-white/10 font-bold text-sm">
              <span className="text-primary dark:text-white">Grand Balance Total</span>
              <span className="font-serif text-accent text-lg">
                ${Number(bill.grandTotal).toLocaleString()}
              </span>
            </div>
          </div>

          {bill.notes && (
            <p className="text-[11px] text-charcoal-muted italic pt-1 border-t border-border/50">
              Note: {bill.notes}
            </p>
          )}
        </div>

        {/* Discount / Post to Folio / Payment Controls */}
        <div className="p-4 rounded-2xl bg-ivory/60 dark:bg-primary-900/40 border border-border/80 dark:border-white/10 space-y-4 text-xs">
          {!isPaid && !isPosted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                  Settle Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-primary-900 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none font-semibold text-accent"
                >
                  <option value="Credit Card (Visa/Mastercard)">Credit Card (Visa/Mastercard)</option>
                  <option value="Credit Card (Amex Centurion)">Credit Card (Amex Centurion)</option>
                  <option value="Cash (EUR)">Cash (EUR / USD)</option>
                  <option value="Direct Wire Transfer">Direct Wire Transfer</option>
                  <option value="Charge to Suite Folio">Charge to Suite Folio</option>
                </select>
              </div>

              {/* Room Target for Folio */}
              <div>
                <label className="block text-[11px] font-semibold text-primary dark:text-white mb-1.5 uppercase font-mono">
                  Target Suite Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. PH-1201"
                  value={targetRoom}
                  onChange={e => setTargetRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-primary-900 border border-border dark:border-white/10 text-xs focus:border-accent focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" icon={Printer} onClick={handlePrint}>
                Print Bill
              </Button>
              <Button variant="outline" icon={Download} onClick={handlePrint}>
                Download PDF
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {!isPosted && (
                <Button
                  variant="outline"
                  icon={BedDouble}
                  onClick={() => onPostToFolio?.(bill.id, targetRoom)}
                >
                  Post to Guest Folio
                </Button>
              )}

              {!isPaid && (
                <Button
                  variant="gold"
                  icon={CheckCircle}
                  onClick={() => onRecordPayment?.(bill.id, paymentMethod, bill.grandTotal)}
                >
                  Record Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBillPreview;

