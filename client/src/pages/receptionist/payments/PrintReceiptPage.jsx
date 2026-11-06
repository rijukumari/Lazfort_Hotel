import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Button } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  Printer,
  Receipt,
  Search,
  Download,
  CreditCard,
  Building,
  User,
  Calendar,
  CheckCircle2,
  DollarSign,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import { printElement } from '../../../utils/printSystem';

export const PrintReceiptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { payments = [] } = useERP();
  const { showToast } = useToast();

  const statePayment = location.state?.selectedPayment;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(statePayment || payments[0] || null);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        p.guestName?.toLowerCase().includes(q) ||
        p.transactionRef?.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.roomNumber?.toString().includes(q)
      );
    });
  }, [payments, searchQuery]);

  const handlePrint = () => {
    printElement('printable-receipt-slip', {
      documentTitle: `Receipt_${selectedReceipt?.transactionRef || 'LZ-Receipt'}`
    });
    showToast('Receipt Printed', 'Voucher dispatched to terminal printer.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Print Guest Receipts"
        subtitle="Official luxury settlement slips, chamber transaction receipts, and front desk payment vouchers."
        icon={Printer}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/receptionist/payments/history')}
            >
              Back to History
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
              disabled={!selectedReceipt}
            >
              Print Receipt Slip
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Transaction Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-luxury-3d p-4 rounded-3xl">
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
              <input
                type="text"
                placeholder="Search guest or transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-2xl border border-border dark:border-white/10 bg-ivory dark:bg-primary-900/80 text-primary dark:text-white text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredPayments.map((p) => {
                const isSelected = selectedReceipt && (selectedReceipt.id === p.id || selectedReceipt.transactionRef === p.transactionRef);
                return (
                  <div
                    key={p.id || p.transactionRef}
                    onClick={() => setSelectedReceipt(p)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-xs ${isSelected
                        ? 'border-accent bg-accent/15 ring-1 ring-accent/40 shadow-gold'
                        : 'border-border/60 dark:border-white/5 bg-ivory/60 dark:bg-primary-900/40 hover:border-accent/40'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-serif font-bold text-sm text-primary dark:text-white">
                          {p.guestName}
                        </p>
                        <p className="font-mono text-[11px] text-accent">
                          {p.transactionRef || p.reference || p.id}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-500">
                        ${Number(p.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[10px] text-charcoal-muted dark:text-gray-400">
                      <span>Suite {p.roomNumber || 'Counter'}</span>
                      <span>{p.date || 'Today'}</span>
                    </div>
                  </div>
                );
              })}

              {filteredPayments.length === 0 && (
                <p className="text-center py-6 text-xs text-charcoal-muted dark:text-gray-400">
                  No matching transactions.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Thermal / Voucher Receipt Preview */}
        <div className="lg:col-span-7">
          {selectedReceipt ? (
            <div
              id="printable-receipt-slip"
              className="card-luxury-3d p-8 max-w-md mx-auto font-mono text-xs space-y-4 bg-white dark:bg-[#0c1322] text-[#111827] dark:text-[#f1f5f9] border border-border/80 dark:border-accent/20 shadow-xl dark:shadow-2xl print:shadow-none print:border-none print:w-full print:max-w-none print:bg-white print:text-black"
            >
              {/* Header */}
              <div className="text-center space-y-1.5 border-b border-dashed border-border/80 dark:border-white/10 pb-5">
                <div className="w-10 h-10 mx-auto rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-gold mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-serif font-black text-2xl tracking-wider text-primary dark:text-[#e6c387]">
                  LAZFORT PALACE
                </h2>
                <p className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
                  Luxury Grand Hotel & Royal Suites
                </p>
                <p className="text-[10px] text-charcoal-muted dark:text-gray-400">
                  Place du Casino, 100 Avenue des Princes, Monte-Carlo, MC 98000 Monaco
                </p>
                <p className="text-[10px] font-mono text-accent/80">
                  Terminal Clearance: LZ-POS-FRONT01 • Sovereign Folio
                </p>
              </div>

              {/* Transaction Meta */}
              <div className="space-y-1.5 border-b border-dashed border-border/80 dark:border-white/10 pb-4 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted dark:text-gray-400">RECEIPT NO:</span>
                  <span className="font-bold font-mono text-accent">
                    {selectedReceipt.transactionRef || selectedReceipt.reference || 'LZ-99120'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted dark:text-gray-400">DATE / TIME:</span>
                  <span className="text-primary dark:text-white font-mono">
                    {selectedReceipt.date || new Date().toISOString().split('T')[0]} 14:32:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted dark:text-gray-400">GUEST / PATRON:</span>
                  <span className="font-bold text-primary dark:text-white">
                    {selectedReceipt.guestName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted dark:text-gray-400">CHAMBER / SUITE:</span>
                  <span className="text-primary dark:text-white font-mono">
                    Suite {selectedReceipt.roomNumber || 'Counter'}
                  </span>
                </div>
                {selectedReceipt.bookingCode && (
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted dark:text-gray-400">BOOKING REF:</span>
                    <span className="font-mono text-accent">
                      {selectedReceipt.bookingCode}
                    </span>
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 border-b border-dashed border-border/80 dark:border-white/10 pb-4 text-[11px]">
                <div className="flex justify-between font-bold border-b border-border/60 dark:border-white/10 pb-1 text-charcoal-muted dark:text-gray-400 uppercase tracking-wider text-[10px]">
                  <span>DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                <div className="flex justify-between text-primary dark:text-white">
                  <span>Settlement - {selectedReceipt.paymentMethod || 'Centurion Black Card'}</span>
                  <span className="font-mono font-bold">${Number(selectedReceipt.amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted dark:text-gray-400">
                  <span>Taxes & Chamber Luxury Surcharge (Included)</span>
                  <span className="font-mono">$0.00</span>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-b border-dashed border-border/80 dark:border-white/10 pb-4 text-[12px]">
                <div className="flex justify-between font-serif font-black text-lg pt-1 text-primary dark:text-white">
                  <span>TOTAL PAID:</span>
                  <span className="text-accent font-mono font-bold">
                    ${Number(selectedReceipt.amount || 0).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-charcoal-muted dark:text-gray-400">CLEARANCE STATUS:</span>
                  <span className="font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                    AUTHORISED & CLEARED
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-2 space-y-1 text-[10px] text-charcoal-muted dark:text-gray-400">
                <p className="font-serif tracking-wider text-primary dark:text-white font-bold">
                  THANK YOU FOR YOUR PATRONAGE
                </p>
                <p className="text-[9px] uppercase tracking-widest text-accent">
                  LAZFORT GRAND HOTEL RESERVES ALL RIGHTS
                </p>
                <div className="pt-2 font-mono text-[9px] text-charcoal-muted/70 dark:text-gray-500">
                  *** LUXURY SOVEREIGN CUSTOMER COPY ***
                </div>
              </div>
            </div>
          ) : (
            <div className="card-luxury-3d p-12 text-center text-charcoal-muted dark:text-gray-400">
              <Receipt className="w-12 h-12 text-accent/40 mx-auto mb-3" />
              <p className="font-serif font-bold text-base text-primary dark:text-white">
                Select a Transaction to Preview
              </p>
              <p className="text-xs mt-1">Pick a settlement from the left ledger to print an official voucher.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintReceiptPage;

