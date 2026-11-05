import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Receipt,
  CheckCircle,
  Printer,
  Download,
  CreditCard,
  BedDouble,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Utensils
} from 'lucide-react';
import { printElement } from '../../../utils/printSystem';
import { downloadDocumentHtml } from '../../../utils/downloadSystem';

export const GenerateRestaurantBillPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const {
    restaurantOrders = [],
    restaurantBills = [],
    folios = [],
    generateRestaurantBill,
    recordRestaurantBillPayment,
    postRestaurantBillToFolio,
  } = useERP();
  const { showToast } = useToast();

  // Selected Order or existing bill
  const stateOrder = location.state?.order;
  const stateBill = location.state?.bill;

  const orderParam = id
    ? restaurantOrders.find(o => o.id === id || o.orderNumber === id)
    : null;
  const billParam = id
    ? restaurantBills.find(b => b.id === id || b.billNumber === id)
    : null;

  const currentBill = stateBill || billParam || null;
  const currentOrder =
    stateOrder ||
    orderParam ||
    (currentBill ? restaurantOrders.find(o => o.orderNumber === currentBill.orderId || o.id === currentBill.orderId) : null) ||
    restaurantOrders[0] ||
    {};

  const isViewMode = Boolean(currentBill);

  const [subtotal, setSubtotal] = useState(
    currentBill ? (currentBill.subtotal || 0) : (currentOrder.subtotal || currentOrder.totalAmount || 165)
  );
  const [discount, setDiscount] = useState(
    currentBill ? (currentBill.discount || 0) : (currentOrder.discount || 0)
  );
  const [taxRate, setTaxRate] = useState(10);
  const [serviceChargeRate, setServiceChargeRate] = useState(5);
  const [targetRoom, setTargetRoom] = useState(
    currentBill ? (currentBill.roomNumber || '') : (currentOrder.roomNumber || 'PH-1402')
  );
  const [paymentMethod, setPaymentMethod] = useState(
    currentBill ? (currentBill.paymentMethod || 'Credit Card (Centurion Black)') : 'Credit Card (Centurion Black)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatedTax = Math.round(Math.max(0, subtotal - discount) * (taxRate / 100));
  const calculatedService = Math.round(Math.max(0, subtotal - discount) * (serviceChargeRate / 100));
  const grandTotal = Math.max(0, subtotal - discount + calculatedTax + calculatedService);

  const handleCreateBill = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = generateRestaurantBill(currentOrder, {
        subtotal: Number(subtotal),
        discount: Number(discount),
        tax: calculatedTax,
        serviceCharge: calculatedService,
        grandTotal,
        roomNumber: targetRoom,
        paymentMethod,
      });

      if (res?.success) {
        showToast('Bill Generated', res.message, 'success');
        navigate('/hotel-admin/restaurant/billing');
      } else {
        showToast('Notice', res?.message || 'Bill generated successfully.', 'info');
        navigate('/hotel-admin/restaurant/billing');
      }
    } catch (err) {
      showToast('Error', 'Failed to generate restaurant bill.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    printElement('printable-restaurant-bill', {
      documentTitle: `Dining_Bill_${currentBill?.billNumber || currentOrder.orderNumber || 'Bill'}`
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300 pb-16">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10 print:hidden">
        <button
          type="button"
          onClick={() => navigate('/hotel-admin/restaurant/billing')}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Dining Invoices</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const itemsRows = (currentOrder.items || [
                { name: 'Krug Clos d’Ambonnay Champagne', quantity: 1, price: subtotal }
              ]).map(it => `
                <tr>
                  <td>${it.name || it.item}</td>
                  <td class="text-center font-mono">${it.quantity || 1}</td>
                  <td class="text-right font-mono">$${(it.price || 0).toLocaleString()}</td>
                  <td class="text-right font-mono">$${((it.price || 0) * (it.quantity || 1)).toLocaleString()}</td>
                </tr>
              `).join('');

              const bodyHtml = `
                <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                  <table style="margin: 0;">
                    <tr>
                      <td style="border: none; padding: 4px 8px;"><strong>Guest:</strong></td>
                      <td style="border: none; padding: 4px 8px;">${currentOrder.guestName || 'Baroness Vivienne De Rothschild'}</td>
                      <td style="border: none; padding: 4px 8px;"><strong>Order Ref:</strong></td>
                      <td style="border: none; padding: 4px 8px; font-family: monospace; color: #C6A66B; font-weight: bold;">#${currentOrder.orderNumber || currentOrder.id || 'ORD-9005'}</td>
                    </tr>
                    <tr>
                      <td style="border: none; padding: 4px 8px;"><strong>Service Location:</strong></td>
                      <td style="border: none; padding: 4px 8px;">${targetRoom ? `Suite ${targetRoom}` : currentOrder.tableNumber || 'Suite PH-1402'}</td>
                      <td style="border: none; padding: 4px 8px;"><strong>Order Type:</strong></td>
                      <td style="border: none; padding: 4px 8px;">${currentOrder.orderType || 'Room Service Gastronomy'}</td>
                    </tr>
                  </table>
                </div>

                <div class="section-title">Culinary & Beverage Items</div>
                <table>
                  <thead>
                    <tr>
                      <th>Gastronomic Course</th>
                      <th class="text-center">Qty</th>
                      <th class="text-right">Unit Price</th>
                      <th class="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                </table>

                <div class="total-box">
                  <div class="total-row">
                    <span>F&B Subtotal:</span>
                    <span class="font-mono">$${subtotal.toLocaleString()}</span>
                  </div>
                  ${discount > 0 ? `
                    <div class="total-row" style="color: #059669;">
                      <span>VIP Courtesy Discount:</span>
                      <span class="font-mono">-$${discount.toLocaleString()}</span>
                    </div>
                  ` : ''}
                  <div class="total-row">
                    <span>Monaco Luxury Tax (${taxRate}%):</span>
                    <span class="font-mono">$${calculatedTax.toLocaleString()}</span>
                  </div>
                  <div class="total-row">
                    <span>Butler Service Gratuity (${serviceChargeRate}%):</span>
                    <span class="font-mono">$${calculatedService.toLocaleString()}</span>
                  </div>
                  <div class="total-row total-grand">
                    <span>Total Billed:</span>
                    <span class="font-mono" style="color: #C6A66B;">$${grandTotal.toLocaleString()} USD</span>
                  </div>
                </div>
              `;

              downloadDocumentHtml({
                title: 'Fine Gastronomy Bill & Receipt',
                docRef: currentOrder.orderNumber || 'ORD-9005',
                date: new Date().toLocaleDateString(),
                guestOrClient: currentOrder.guestName || 'VIP Guest',
                bodyHtml,
                filename: `Restaurant_Bill_${currentOrder.orderNumber || 'Bill'}.html`
              });

              showToast('Bill Downloaded', 'Official culinary bill downloaded.', 'success');
            }}
            className="px-3.5 py-2 rounded-xl border border-accent/40 text-xs font-semibold text-accent hover:bg-accent/15 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Bill</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-accent/40 text-xs font-semibold text-accent hover:bg-accent/15 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Page Card Matching Screenshot Exactly */}
      <div
        id="printable-restaurant-bill"
        className="card-luxury-3d p-8 rounded-3xl bg-white dark:bg-[#101722] border border-border/80 dark:border-accent/40 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-border/60 dark:border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold shrink-0">
            <Receipt className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-primary dark:text-white">
              Generate Restaurant Bill
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
              Lazfort Palace Fine Gastronomy & Suite Billing Terminal
            </p>
          </div>
        </div>

        {/* Selected Order Banner */}
        <div className="p-4 rounded-2xl bg-ivory/80 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 space-y-1 text-xs">
          <p className="font-bold text-primary dark:text-white text-sm">
            Selected Order: #{currentOrder.orderNumber || currentOrder.id || 'ORD-9005'} ({currentOrder.orderType || 'Room Service'})
          </p>
          <p className="text-charcoal-muted dark:text-gray-300">
            Guest: <strong className="text-primary dark:text-white">{currentOrder.guestName || 'Baroness Vivienne De Rothschild'}</strong> • Location: <span className="font-mono text-accent font-semibold">{currentOrder.roomNumber ? `Suite ${currentOrder.roomNumber}` : currentOrder.tableNumber || 'Suite PH-1402'}</span>
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleCreateBill} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Subtotal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Subtotal ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={subtotal}
                onChange={e => setSubtotal(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              />
            </div>

            {/* VIP Discount */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                VIP Courtesy Discount ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              />
            </div>

            {/* Tax Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Monaco Luxury Tax Rate (%): {taxRate}%
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={taxRate}
                onChange={e => setTaxRate(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              />
            </div>

            {/* Butler Service Charge */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
                Butler Service Charge (%): {serviceChargeRate}%
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={serviceChargeRate}
                onChange={e => setServiceChargeRate(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
              />
            </div>
          </div>

          {/* Charge To Suite Folio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-300">
              Charge to Suite Folio (Optional Suite #)
            </label>
            <input
              type="text"
              value={targetRoom}
              onChange={e => setTargetRoom(e.target.value)}
              placeholder="e.g. PH-1402 or leave blank for direct card checkout"
              className="w-full px-4 py-3 rounded-2xl bg-ivory/60 dark:bg-primary-900/80 border border-border/80 dark:border-accent/30 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent shadow-sm"
            />
          </div>

          {/* Calculation Ledger Breakdown */}
          <div className="p-5 rounded-2xl bg-ivory/40 dark:bg-primary-950/60 border border-border/70 dark:border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-mono text-primary dark:text-white font-medium">${subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>VIP Courtesy Discount</span>
                <span className="font-mono font-medium">-${discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
              <span>Tax ({taxRate}%)</span>
              <span className="font-mono text-primary dark:text-white font-medium">${calculatedTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
              <span>Service Gratuity ({serviceChargeRate}%)</span>
              <span className="font-mono text-primary dark:text-white font-medium">${calculatedService.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/80 dark:border-white/10 text-base font-bold">
              <span className="font-serif text-primary dark:text-white">Grand Total</span>
              <span className="font-serif font-black text-xl text-accent">
                ${grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate('/hotel-admin/restaurant/billing')}
              className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 text-xs font-semibold text-charcoal-muted hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider shadow-gold hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-primary-950" />
              <span>{isSubmitting ? 'Confirming...' : 'Confirm & Issue Bill'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateRestaurantBillPage;
