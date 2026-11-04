import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  LogOut,
  Receipt,
  Search,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RoomOperationsCheckOutPage = () => {
  const navigate = useNavigate();
  const { bookings = [], folios = [], checkOutGuest } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForCheckOut, setSelectedBookingForCheckOut] = useState(null);
  const [additionalMinibarFee, setAdditionalMinibarFee] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);

  // In-house residents eligible for checkout (status === 'checked_in')
  const checkoutQueue = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'checked_in')
      .map((b) => {
        const guestFolio = folios.find((f) => f.bookingId === b.id) || {
          balanceDue: b.totalAmount ? Math.round(b.totalAmount * 0.15) : 0,
        };
        return {
          ...b,
          balanceDue: guestFolio.balanceDue || 0,
          stayWindow: `${b.checkIn} to ${b.checkOut}`,
        };
      })
      .filter((b) => {
        return (
          !searchQuery ||
          b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(b.roomNumber).includes(searchQuery)
        );
      });
  }, [bookings, folios, searchQuery]);

  const handleOpenCheckOutModal = (bkg) => {
    setSelectedBookingForCheckOut(bkg);
    setAdditionalMinibarFee('0');
  };

  const handleConfirmCheckOut = () => {
    if (!selectedBookingForCheckOut) return;

    setIsProcessing(true);
    setTimeout(() => {
      const res = checkOutGuest(selectedBookingForCheckOut.id);
      setIsProcessing(false);

      if (res?.success) {
        if (showToast) {
          showToast(
            'Check-Out Complete',
            `Patron ${selectedBookingForCheckOut.guestName} has checked out from Suite ${selectedBookingForCheckOut.roomNumber}. Folio closed.`,
            'success'
          );
        }
        setSelectedBookingForCheckOut(null);
      } else {
        if (showToast) {
          showToast('Check-Out Failed', res?.message || 'Check-out could not be completed.', 'error');
        }
      }
    }, 400);
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.bookingCode}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Resident Patron',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight font-serif">
            {item.guestName}
          </p>
          <p className="text-[11px] text-charcoal-muted">Suite {item.roomNumber} ({item.roomType})</p>
        </div>
      ),
    },
    {
      key: 'stayWindow',
      header: 'Stay Window',
      render: (item) => (
        <span className="text-xs text-charcoal-muted font-mono">{item.stayWindow}</span>
      ),
    },
    {
      key: 'balanceDue',
      header: 'Folio Balance',
      sortable: true,
      render: (item) => (
        <span
          className={`font-mono font-bold text-xs ${
            item.balanceDue > 0 ? 'text-amber-500' : 'text-emerald-500'
          }`}
        >
          ${item.balanceDue.toLocaleString()} USD
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment Clearance',
      render: (item) =>
        item.balanceDue === 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Fully Settled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Folio Pending
          </span>
        ),
    },
    {
      key: 'action',
      header: 'Check-Out Action',
      render: (item) => (
        <button
          onClick={() => handleOpenCheckOutModal(item)}
          className="btn-luxury px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Process Check-Out</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Guest Check-Out & Folio Settlement"
        subtitle="Review resident stay charges, finalize incidental billing folios, and release chamber back to housekeeping"
        badge="Room Operations"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="In-House Stays"
          value={String(checkoutQueue.length)}
          subtitle="Currently active residents"
          icon={CreditCard}
          isPositive={true}
        />
        <StatCard
          title="Folio Clean & Settled"
          value={String(checkoutQueue.filter((b) => b.balanceDue === 0).length)}
          subtitle="Ready for rapid express checkout"
          icon={CheckCircle2}
          isPositive={true}
        />
        <StatCard
          title="Total Outstanding Receivables"
          value={`$${checkoutQueue.reduce((s, b) => s + b.balanceDue, 0).toLocaleString()} USD`}
          subtitle="Across pending guest folios"
          icon={DollarSign}
          isPositive={false}
        />
      </div>

      {/* Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-88">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reservation ID, patron name, or suite..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>
      </div>

      {/* Checkout Table */}
      <DataTable
        data={checkoutQueue}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No residents currently pending checkout."
      />

      {/* Finalize Check-Out Modal */}
      {selectedBookingForCheckOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg card-luxury-3d bg-white dark:bg-[#0c121c] border border-accent/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/70 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-accent" /> Settle Folio & Complete Departure
                </h3>
                <p className="text-xs text-charcoal-muted mt-1">
                  Finalizing checkout for <strong>{selectedBookingForCheckOut.guestName}</strong> (Suite {selectedBookingForCheckOut.roomNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForCheckOut(null)}
                className="p-1.5 rounded-full hover:bg-ivory dark:hover:bg-primary-900/40 text-charcoal-muted hover:text-accent transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs overflow-y-auto no-scrollbar flex-1">
              <div className="flex justify-between py-1 border-b border-border/40 dark:border-white/5">
                <span className="text-charcoal-muted">Base Folio Balance</span>
                <span className="font-mono font-bold text-primary dark:text-white">
                  ${selectedBookingForCheckOut.balanceDue.toLocaleString()} USD
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                  Additional Incidentals / Minibar Consumption ($)
                </label>
                <input
                  type="number"
                  value={additionalMinibarFee}
                  onChange={(e) => setAdditionalMinibarFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 flex justify-between items-center">
                <span className="font-semibold text-primary dark:text-white">Total Final Settlement:</span>
                <span className="font-mono text-sm font-bold text-accent">
                  ${(selectedBookingForCheckOut.balanceDue + (Number(additionalMinibarFee) || 0)).toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="p-4 sm:px-6 border-t border-border/70 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedBookingForCheckOut(null)}
                className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmCheckOut}
                className="btn-luxury px-6 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Finalizing Checkout...' : 'Confirm Departure & Release Room'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomOperationsCheckOutPage;

