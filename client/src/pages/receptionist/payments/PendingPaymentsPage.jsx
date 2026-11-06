import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Clock,
  CheckCircle2,
  Search,
  DollarSign,
  CreditCard,
  AlertCircle,
  FileText,
  UserCheck,
  Send
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const PendingPaymentsPage = () => {
  const navigate = useNavigate();
  const { folios = [], bookings = [], processPayment } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [settlingItem, setSettlingItem] = useState(null);
  const [settleMethod, setSettleMethod] = useState('Centurion Black Card');

  // Collect pending folios and unpaid bookings
  const pendingItems = useMemo(() => {
    const list = [];

    // From folios with balance > 0
    folios.forEach((f) => {
      const bal = Number(f.balance) || 0;
      if (bal > 0) {
        list.push({
          id: `folio-${f.id}`,
          type: 'Folio',
          sourceId: f.id,
          reference: f.folioNumber || f.id,
          guestName: f.guestName,
          roomNumber: f.roomNumber || '—',
          amount: bal,
          status: 'pending',
          dueDate: f.checkOut || 'Due on Departure',
        });
      }
    });

    // From bookings with pending status or unpaid
    bookings.forEach((b) => {
      if (b.status === 'pending' || b.paymentStatus === 'unpaid') {
        const amt = Number(b.totalAmount) || 850;
        // avoid duplicate if already tracked by folio
        if (!list.some(item => item.guestName === b.guestName && item.roomNumber === b.roomNumber)) {
          list.push({
            id: `bkg-${b.id}`,
            type: 'Reservation',
            sourceId: b.id,
            reference: b.bookingCode || b.id,
            guestName: b.guestName,
            roomNumber: b.roomNumber || 'Unassigned',
            amount: amt,
            status: 'pending',
            dueDate: b.checkIn || 'Immediate',
          });
        }
      }
    });

    return list.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        item.guestName?.toLowerCase().includes(q) ||
        item.reference?.toLowerCase().includes(q) ||
        item.roomNumber?.toString().includes(q)
      );
    });
  }, [folios, bookings, searchQuery]);

  const totalOutstanding = useMemo(() => {
    return pendingItems.reduce((acc, curr) => acc + curr.amount, 0);
  }, [pendingItems]);

  const handleSettle = () => {
    if (!settlingItem) return;

    if (processPayment) {
      processPayment({
        guestName: settlingItem.guestName,
        bookingCode: settlingItem.type === 'Reservation' ? settlingItem.reference : undefined,
        folioId: settlingItem.type === 'Folio' ? settlingItem.sourceId : undefined,
        roomNumber: settlingItem.roomNumber,
        amount: settlingItem.amount,
        paymentMethod: settleMethod,
        reference: `SETTLE-${Date.now().toString().slice(-6)}`,
        status: 'paid',
        date: new Date().toISOString().split('T')[0],
      });
    }

    showToast(
      'Outstanding Settled',
      `Payment of $${settlingItem.amount} authorized for ${settlingItem.guestName}.`,
      'success'
    );
    setSettlingItem(null);
  };

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (item) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{item.reference}</span>
          <span className="text-[10px] block text-charcoal-muted dark:text-gray-400">{item.type}</span>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest / Suite',
      render: (item) => (
        <div>
          <p className="font-serif font-bold text-sm text-primary dark:text-white">{item.guestName}</p>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">Suite {item.roomNumber}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Outstanding Balance',
      render: (item) => (
        <span className="font-mono font-bold text-sm text-amber-400">
          ${item.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due By',
      render: (item) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400">{item.dueDate}</span>
      ),
    },
    {
      key: 'status',
      header: 'Settlement Status',
      render: () => <StatusBadge status="pending" label="Pending Balance" />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (item) => (
        <Button
          variant="primary"
          size="xs"
          icon={CreditCard}
          onClick={() => setSettlingItem(item)}
        >
          Collect Now
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Guest Settlements"
        subtitle="Unsettled balances, open room folios, and pending walk-in payment authorisations."
        icon={Clock}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={CreditCard}
            onClick={() => navigate('/receptionist/payments/collect')}
          >
            Collect Payment
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Unsettled Balances"
          value={`$${totalOutstanding.toLocaleString()}`}
          subtitle="Awaiting final checkout folio clearing"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Accounts"
          value={pendingItems.length}
          subtitle="Suites with outstanding folios"
          icon={AlertCircle}
        />
        <StatCard
          title="Average Due Amount"
          value={`$${pendingItems.length ? Math.round(totalOutstanding / pendingItems.length).toLocaleString() : '0'}`}
          subtitle="Per pending guest folio"
          icon={CreditCard}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by guest, folio, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pendingItems}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="All guest folios and charges are fully settled. No pending balances."
        />
      </div>

      {settlingItem && (
        <Modal
          isOpen={Boolean(settlingItem)}
          onClose={() => setSettlingItem(null)}
          title={`Settle Balance • ${settlingItem.guestName}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-muted dark:text-gray-400">Reference:</span>
                <span className="font-mono text-accent font-bold">{settlingItem.reference}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-muted dark:text-gray-400">Suite:</span>
                <span className="text-primary dark:text-white font-bold">{settlingItem.roomNumber}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-muted dark:text-gray-400">Outstanding Amount:</span>
                <span className="font-mono font-bold text-amber-400">${settlingItem.amount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-muted dark:text-gray-400 mb-1.5">
                Settlement Payment Channel
              </label>
              <select
                value={settleMethod}
                onChange={(e) => setSettleMethod(e.target.value)}
                className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
              >
                <option value="Centurion Black Card">Centurion Black Card</option>
                <option value="Visa Infinite Luxury">Visa Infinite Luxury</option>
                <option value="Mastercard World Elite">Mastercard World Elite</option>
                <option value="Cash Settlement (Treasury Vault)">Cash Settlement (Treasury Vault)</option>
                <option value="International Wire Transfer (UBS)">International Wire Transfer (UBS)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettlingItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={handleSettle}
              >
                Confirm Settlement
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PendingPaymentsPage;

