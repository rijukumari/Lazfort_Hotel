import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { InvoiceModal } from '../../components/data-display/InvoiceModal';
import { BookingStatusBadge, PaymentStatusBadge } from '../../components/booking/BookingStatusBadge';
import {
  CreditCard,
  Receipt,
  FileText,
  DollarSign,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  BedDouble,
  Search
} from 'lucide-react';

export const CustomerPaymentsPage = () => {
  const { bookings, folios } = useERP();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);

  // Filter bookings for current customer
  const customerBookings = (bookings || []).filter(b =>
    !user || user.role !== 'customer' ||
    b.guestEmail?.toLowerCase() === user.email?.toLowerCase() ||
    b.guestName?.toLowerCase() === user.name?.toLowerCase()
  );

  const filteredBookings = customerBookings.filter(b => {
    if (filter === 'paid' && b.paymentStatus !== 'paid') return false;
    if (filter === 'pending' && b.paymentStatus === 'paid') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingCode?.toLowerCase().includes(q) ||
        b.roomNumber?.toLowerCase().includes(q) ||
        b.roomType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpent = customerBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const pendingAmount = customerBookings
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handlePayNow = (booking) => {
    showToast(
      'Payment Gateway Demo',
      `Demonstration mode: Payment of €${booking.totalAmount?.toLocaleString()} authorized for Folio #${booking.bookingCode}.`,
      'success'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Payments, Invoices & Folios"
        description="Review all luxury stay transactions, settlement histories, printable invoices, and digital receipts."
        badge={`${customerBookings.length} Total Folios`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (customerBookings.length > 0) {
                  setSelectedBookingForInvoice(customerBookings[0]);
                } else {
                  showToast('No Invoices', 'No active invoices to display.', 'info');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
            >
              <FileText className="w-4 h-4" />
              <span>Latest Official Folio</span>
            </button>
          </div>
        }
      />

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-luxury-3d p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400 font-mono tracking-wider block">
              Settled / Paid Stays
            </span>
            <p className="font-serif text-2xl font-bold text-primary dark:text-white mt-0.5">
              €{totalSpent.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Verified by Hotel Finance
            </span>
          </div>
        </div>

        <div className="card-luxury-3d p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400 font-mono tracking-wider block">
              Pending / Pay at Desk
            </span>
            <p className="font-serif text-2xl font-bold text-amber-500 mt-0.5">
              €{pendingAmount.toLocaleString()}
            </p>
            <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
              Payable upon suite check-in
            </span>
          </div>
        </div>

        <div className="card-luxury-3d p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent flex-shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-muted dark:text-gray-400 font-mono tracking-wider block">
              Total Invoices Issued
            </span>
            <p className="font-serif text-2xl font-bold text-accent mt-0.5">
              {customerBookings.length} Folios
            </p>
            <span className="text-[11px] text-accent font-medium">
              Tax Compliant Monaco VAT 10%
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-white/70 dark:bg-primary-900/40 rounded-2xl border border-border dark:border-white/10 w-full sm:w-auto">
          {['all', 'paid', 'pending'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                  : 'text-charcoal-muted dark:text-gray-300 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Invoices' : `${tab} Folios`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search folio code or suite..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-primary-900/60 border border-border dark:border-white/10 rounded-2xl text-xs text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Folios Table */}
      <div className="card-luxury-3d rounded-3xl overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-12 h-12 text-accent/40 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-primary dark:text-white">
              No Folios Found
            </h4>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 max-w-sm mx-auto">
              There are no billing records matching the current filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory/80 dark:bg-primary-950/80 border-b border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Folio / Code</th>
                  <th className="py-4 px-4">Suite Particulars</th>
                  <th className="py-4 px-4">Dates</th>
                  <th className="py-4 px-4">Total Amount</th>
                  <th className="py-4 px-4">Payment Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredBookings.map(b => (
                  <tr
                    key={b.id}
                    className="hover:bg-white/50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-accent">#{b.bookingCode}</span>
                      <span className="block text-[10px] text-charcoal-muted dark:text-gray-400 font-mono mt-0.5">
                        Direct Customer Portal
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-accent" />
                        <div>
                          <p className="font-semibold text-primary dark:text-white">
                            Suite {b.roomNumber}
                          </p>
                          <p className="text-[11px] text-charcoal-muted dark:text-gray-400">{b.roomType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-primary dark:text-white">
                        {b.checkIn} &rarr; {b.checkOut}
                      </span>
                      <span className="block text-[10px] text-charcoal-muted dark:text-gray-400 mt-0.5">
                        {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-serif font-bold text-accent text-sm">
                        €{b.totalAmount?.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-charcoal-muted dark:text-gray-400">
                        Inc. 10% VAT & 5% Service
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBookingForInvoice(b)}
                        className="px-3 py-1.5 rounded-xl btn-secondary-3d font-semibold text-xs text-charcoal dark:text-gray-200 hover:text-accent inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>

                      {b.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handlePayNow(b)}
                          className="px-3 py-1.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d inline-flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal Component */}
      <InvoiceModal
        isOpen={Boolean(selectedBookingForInvoice)}
        onClose={() => setSelectedBookingForInvoice(null)}
        booking={selectedBookingForInvoice}
      />
    </div>
  );
};

export default CustomerPaymentsPage;

