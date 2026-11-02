import React from 'react';
import { Modal } from '../ui/Modal';
import { Printer, Download, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const InvoiceModal = ({ isOpen, onClose, booking }) => {
  const { showToast } = useToast();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Invoice Downloaded', `Invoice for ${booking.bookingCode} generated as PDF.`, 'success');
  };

  const taxAmount = Math.round((booking.totalAmount || 0) * 0.12);
  const serviceCharge = Math.round((booking.totalAmount || 0) * 0.08);
  const grandTotal = (booking.totalAmount || 0) + taxAmount + serviceCharge;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" title="Luxury Guest Invoice">
      <div className="space-y-6 print:p-0">
        {/* Invoice Header */}
        <div className="flex items-start justify-between pb-6 border-b border-border dark:border-border-dark">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="font-serif text-2xl font-bold tracking-tight text-primary dark:text-white">
                AURELIA GRAND PALACE
              </h2>
            </div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
              Place du Casino, Monte-Carlo, MC 98000 Monaco
            </p>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              VAT No: MC-99214018 | reservations@aureliapalace.mc
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30 uppercase tracking-widest mb-1">
              Official Folio
            </span>
            <p className="text-xs text-charcoal-muted">Invoice Ref: INV-{booking.bookingCode}</p>
            <p className="text-xs text-charcoal-muted">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Guest & Stay Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-white/70 dark:bg-primary-950/70 p-4 rounded-2xl border border-border/80 dark:border-accent/20 shadow-sm">
          <div>
            <p className="font-semibold text-charcoal-muted dark:text-gray-400 uppercase tracking-wider text-[10px] font-mono">
              Distinguished Guest
            </p>
            <p className="font-serif text-base font-bold text-primary dark:text-white mt-1">
              {booking.guestName}
            </p>
            <p className="text-charcoal-muted dark:text-gray-400">{booking.guestEmail}</p>
            <p className="text-charcoal-muted dark:text-gray-400">{booking.guestPhone}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-charcoal-muted dark:text-gray-400 uppercase tracking-wider text-[10px] font-mono">
              Stay Particulars
            </p>
            <p className="font-medium text-primary dark:text-white mt-1">
              Suite: {booking.roomNumber} — {booking.roomType}
            </p>
            <p className="text-charcoal-muted dark:text-gray-400">Check-in: {booking.checkIn} (15:00)</p>
            <p className="text-charcoal-muted dark:text-gray-400">Check-out: {booking.checkOut} (12:00)</p>
            <p className="text-accent font-semibold">{booking.nights} Nights Stay</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-400 uppercase font-mono font-semibold">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-center">Nights / Qty</th>
                <th className="py-2.5 text-right">Rate</th>
                <th className="py-2.5 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/[0.06]">
              <tr>
                <td className="py-3">
                  <p className="font-semibold text-primary dark:text-white">
                    {booking.roomType} — Nightly Accommodation
                  </p>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                    Includes VIP Butler Service, Rolls-Royce Transfer & Champagne Bar
                  </p>
                </td>
                <td className="py-3 text-center">{booking.nights}</td>
                <td className="py-3 text-right">
                  ${Math.round((booking.totalAmount || 0) / (booking.nights || 1)).toLocaleString()}
                </td>
                <td className="py-3 text-right font-semibold text-accent">
                  ${(booking.totalAmount || 0).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <p className="font-semibold text-primary dark:text-white">
                    Luxury Hospitality Tax (12%)
                  </p>
                  <p className="text-[11px] text-charcoal-muted dark:text-gray-400">Monaco Principality Tourism Levy</p>
                </td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">${taxAmount.toLocaleString()}</td>
                <td className="py-3 text-right font-semibold">${taxAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-3">
                  <p className="font-semibold text-primary dark:text-white">
                    Bespoke Concierge & Spa Gratuity (8%)
                  </p>
                </td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">${serviceCharge.toLocaleString()}</td>
                <td className="py-3 text-right font-semibold">
                  ${serviceCharge.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="pt-4 border-t border-border/80 dark:border-white/10 flex flex-col items-end gap-1.5 text-xs">
          <div className="flex justify-between w-64 text-charcoal-muted dark:text-gray-400">
            <span>Subtotal:</span>
            <span>${(booking.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-64 text-charcoal-muted dark:text-gray-400">
            <span>Taxes & Levies:</span>
            <span>${(taxAmount + serviceCharge).toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-64 pt-2 border-t border-border/80 dark:border-white/10 font-serif text-base font-bold text-primary dark:text-white">
            <span>Grand Total:</span>
            <span className="text-accent">${grandTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-64 text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Amount Paid:</span>
            <span>-${(booking.paidAmount || 0).toLocaleString()}</span>
          </div>
          {grandTotal - (booking.paidAmount || 0) > 0 && (
            <div className="flex justify-between w-64 font-bold text-rose-600 dark:text-rose-400">
              <span>Balance Due:</span>
              <span>${(grandTotal - (booking.paidAmount || 0)).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold rounded-2xl btn-secondary-3d text-charcoal dark:text-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl btn-secondary-3d text-charcoal dark:text-gray-200"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            PDF Export
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-2xl gold-gradient-bg text-primary-900 btn-3d"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Folio
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;

