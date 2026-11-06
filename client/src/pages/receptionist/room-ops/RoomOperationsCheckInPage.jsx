import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  KeyRound,
  CheckCircle,
  Search,
  Filter,
  ShieldCheck,
  Crown,
  FileCheck,
  CreditCard,
  User,
  X,
  Sparkles,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RoomOperationsCheckInPage = () => {
  const navigate = useNavigate();
  const { bookings = [], rooms = [], checkInGuest } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null);
  const [idType, setIdType] = useState('Passport');
  const [idNumber, setIdNumber] = useState('');
  const [depositAmount, setDepositAmount] = useState('1500');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter reservations eligible for check-in (status === 'confirmed' or 'pending')
  const checkInQueue = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'pending')
      .filter((b) => {
        return (
          !searchQuery ||
          b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(b.roomNumber).includes(searchQuery)
        );
      });
  }, [bookings, searchQuery]);

  const handleOpenCheckInModal = (bkg) => {
    setSelectedBookingForCheckIn(bkg);
    setIdNumber(bkg.idNumber || `MC-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmCheckIn = () => {
    if (!selectedBookingForCheckIn) return;

    setIsProcessing(true);
    setTimeout(() => {
      const res = checkInGuest(selectedBookingForCheckIn.id);
      setIsProcessing(false);

      if (res?.success) {
        if (showToast) {
          showToast(
            'Check-In Finalized',
            `Keycard issued for Suite ${selectedBookingForCheckIn.roomNumber}. Pre-authorization of $${depositAmount} captured.`,
            'success'
          );
        }
        setSelectedBookingForCheckIn(null);
      } else {
        if (showToast) {
          showToast('Check-In Failed', res?.message || 'Check-in could not be processed.', 'error');
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
      header: 'Guest Details',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight flex items-center gap-1.5 font-serif">
            {item.guestName}
            {item.vipStatus && <Crown className="w-3.5 h-3.5 text-accent" />}
          </p>
          <p className="text-[11px] text-charcoal-muted">{item.guestPhone || item.guestEmail}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Assigned Suite',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-primary dark:text-white">
          Chamber {item.roomNumber || 'Pending'} ({item.roomType || 'Standard'})
        </span>
      ),
    },
    {
      key: 'checkIn',
      header: 'Stay Window',
      render: (item) => (
        <span className="text-xs text-charcoal-muted font-mono">
          {item.checkIn} to {item.checkOut}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'action',
      header: 'Check-In Action',
      render: (item) => (
        <button
          onClick={() => handleOpenCheckInModal(item)}
          className="btn-luxury px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Verify & Check-In</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Guest Check-In Desk"
        subtitle="Search arriving patrons, verify legal identification, record security deposits & encode room keycards"
        badge="Room Operations"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Awaiting Check-In"
          value={String(checkInQueue.length)}
          subtitle="Confirmed bookings arriving"
          icon={KeyRound}
          isPositive={true}
        />
        <StatCard
          title="Document Verification Required"
          value={String(checkInQueue.length)}
          subtitle="Mandatory Monaco passport compliance"
          icon={ShieldCheck}
          isPositive={true}
        />
        <StatCard
          title="Incidentals Standard Pre-Auth"
          value="$1,500 USD"
          subtitle="Default suite guarantee deposit"
          icon={CreditCard}
          isPositive={true}
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

      {/* Check-In Queue Table */}
      <DataTable
        data={checkInQueue}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No pending check-in reservations found."
      />

      {/* Check-In Verification Modal */}
      {selectedBookingForCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg card-luxury-3d bg-white dark:bg-[#0c121c] border border-accent/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/70 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" /> Patron Verification & Check-In
                </h3>
                <p className="text-xs text-charcoal-muted mt-1">
                  Completing registration for <strong>{selectedBookingForCheckIn.guestName}</strong> (Suite {selectedBookingForCheckIn.roomNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForCheckIn(null)}
                className="p-1.5 rounded-full hover:bg-ivory dark:hover:bg-primary-900/40 text-charcoal-muted hover:text-accent transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto no-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                    ID Document Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Passport">Passport</option>
                    <option value="Diplomatic ID">Diplomatic ID</option>
                    <option value="National Identity Card">National Identity Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white font-mono"
                    placeholder="MC-99201"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal dark:text-gray-300 mb-1">
                  Incidentals Security Pre-Authorization ($)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Suite {selectedBookingForCheckIn.roomNumber} inspected and certified ready by Executive Housekeeper.</span>
              </div>
            </div>

            <div className="p-4 sm:px-6 border-t border-border/70 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedBookingForCheckIn(null)}
                className="px-4 py-2 rounded-xl border border-border dark:border-white/10 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmCheckIn}
                className="btn-luxury px-6 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Issuing Keycard...' : 'Encode Keycard & Confirm Check-In'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomOperationsCheckInPage;

