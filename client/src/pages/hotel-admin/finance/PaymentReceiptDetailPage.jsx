import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  DollarSign,
  Printer,
  CheckCircle2,
  RotateCcw,
  Calendar,
  User,
  ArrowLeft,
  Sparkles,
  Download,
  Building,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { PaymentStatusBadge } from '../../../components/finance';
import { printElement } from '../../../utils/printSystem';

export const PaymentReceiptDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payments = [] } = useERP();
  const { showToast } = useToast();

  const payment = useMemo(() => {
    return payments.find(p => p.id === id || p.transactionRef === id) || payments[0];
  }, [payments, id]);

  const handlePrint = () => {
    printElement('printable-payment-receipt', {
      documentTitle: `PaymentReceipt_${payment?.transactionRef || payment?.id || 'Receipt'}`
    });
    showToast('Receipt Printed', 'Voucher dispatched to terminal printer.', 'success');
  };

  const handleDownloadPdf = () => {
    const textContent = `
LAZFORT PALACE RESORT & ROYAL SUITES
OFFICIAL PAYMENT RECEIPT & SETTLEMENT SLIP
------------------------------------------------------------
Receipt / Ref:      ${payment?.transactionRef || payment?.id}
Date & Time:        ${payment?.date || '2026-11-05'} 14:32:00
Guest / Cardholder: ${payment?.guestName}
Folio / Booking:    ${payment?.bookingCode || 'CONCIERGE'}
Payment Channel:    ${payment?.paymentMethod}
Settled Amount:     $${Number(payment?.amount || 0).toLocaleString()} USD
Clearance Status:   AUTHORISED & CLEARED
Notes:              ${payment?.notes || 'Direct Front Desk Settlement'}
------------------------------------------------------------
Monaco Sovereign Treasury Clearance LZ-POS-FRONT01
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${payment?.transactionRef || payment?.id || 'TX'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast('Receipt Downloaded', 'Official payment document downloaded.', 'success');
  };

  if (!payment) {
    return (
      <div className="card-luxury-3d p-12 text-center space-y-4 max-w-xl mx-auto mt-10">
        <CreditCard className="w-12 h-12 text-accent/50 mx-auto" />
        <h2 className="font-serif font-bold text-xl text-primary dark:text-white">Transaction Not Found</h2>
        <p className="text-xs text-charcoal-muted">The requested payment slip could not be located in the ledger.</p>
        <button
          onClick={() => navigate('/hotel-admin/finance/payments')}
          className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 font-bold text-xs"
        >
          Return to Payments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10 print:hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Back to Transactions</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3.5 py-2 rounded-xl border border-accent/40 text-xs font-semibold text-accent hover:bg-accent/15 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Slip</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Thermal Voucher Card Preview */}
      <div
        id="printable-payment-receipt"
        className="card-luxury-3d p-8 max-w-xl mx-auto font-mono text-xs space-y-6 bg-white dark:bg-[#0c1322] text-[#111827] dark:text-[#f1f5f9] border border-border/80 dark:border-accent/25 shadow-2xl print:shadow-none print:border-none print:w-full print:max-w-none print:bg-white print:text-black"
      >
        {/* Header */}
        <div className="text-center space-y-2 border-b border-dashed border-border/80 dark:border-white/10 pb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold mb-2">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="font-serif font-black text-2xl tracking-wider text-primary dark:text-[#e6c387]">
            LAZFORT PALACE
          </h1>
          <p className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
            Luxury Grand Hotel & Royal Suites
          </p>
          <p className="text-[10px] text-charcoal-muted dark:text-gray-400">
            Place du Casino, 100 Avenue des Princes, Monte-Carlo, MC 98000 Monaco
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-bold">
              {payment.transactionRef || payment.id}
            </span>
            <PaymentStatusBadge status={payment.status} size="sm" />
          </div>
        </div>

        {/* Transaction Meta */}
        <div className="space-y-2 border-b border-dashed border-border/80 dark:border-white/10 pb-5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-charcoal-muted dark:text-gray-400">TRANSACTION REF:</span>
            <span className="font-bold font-mono text-accent">
              {payment.transactionRef || payment.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted dark:text-gray-400">DATE & TIME:</span>
            <span className="text-primary dark:text-white font-mono">
              {payment.date || new Date().toISOString().split('T')[0]} 14:32:00
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted dark:text-gray-400">CARDHOLDER / GUEST:</span>
            <span className="font-bold text-primary dark:text-white">
              {payment.guestName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted dark:text-gray-400">CHAMBER / FOLIO REF:</span>
            <span className="font-mono text-accent">
              {payment.bookingCode || 'CONCIERGE DIRECT'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted dark:text-gray-400">PAYMENT METHOD:</span>
            <span className="text-primary dark:text-white font-medium">
              {payment.paymentMethod}
            </span>
          </div>
        </div>

        {/* Items Breakdown */}
        <div className="space-y-2 border-b border-dashed border-border/80 dark:border-white/10 pb-5 text-[11px]">
          <div className="flex justify-between font-bold border-b border-border/60 dark:border-white/10 pb-1.5 text-charcoal-muted dark:text-gray-400 uppercase tracking-wider text-[10px]">
            <span>DESCRIPTION</span>
            <span>SETTLED</span>
          </div>
          <div className="flex justify-between text-primary dark:text-white">
            <span>Settlement — {payment.paymentMethod}</span>
            <span className="font-mono font-bold">${Number(payment.amount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
            <span>Statutory Luxury Chamber Levy & Tax (Included)</span>
            <span className="font-mono">$0.00</span>
          </div>
          {payment.notes && (
            <div className="text-[10px] text-charcoal-muted dark:text-gray-400 italic pt-1">
              Note: {payment.notes}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-b border-dashed border-border/80 dark:border-white/10 pb-5 text-[12px]">
          <div className="flex justify-between font-serif font-black text-xl pt-1 text-primary dark:text-white">
            <span>TOTAL CLEARED:</span>
            <span className="text-accent font-mono font-bold">
              ${Number(payment.amount || 0).toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] pt-1">
            <span className="text-charcoal-muted dark:text-gray-400">CLEARANCE GATEWAY:</span>
            <span className="font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
              AUTHORISED & CLEARED
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 space-y-1.5 text-[10px] text-charcoal-muted dark:text-gray-400">
          <p className="font-serif tracking-wider text-primary dark:text-white font-bold">
            THANK YOU FOR YOUR PATRONAGE
          </p>
          <p className="text-[9px] uppercase tracking-widest text-accent font-mono">
            LAZFORT GRAND HOTEL & RESORTS MONACO
          </p>
          <div className="pt-2 font-mono text-[9px] text-charcoal-muted/70 dark:text-gray-500">
            *** CUSTOMER SOVEREIGN RECEIPT COPY ***
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptDetailPage;

