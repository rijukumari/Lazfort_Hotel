import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge, Modal, FormField, Input, Select } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  Download,
  Printer,
  Plus,
  Search,
  Filter,
  FileText,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const PaymentsPage = () => {
  const navigate = useNavigate();
  const { bookings = [], folios = [], settleFolioPayment } = useERP();
  const { showToast } = useToast();

  // Initial Seed Transactions merged with Folio Payments
  const [extraTransactions, setExtraTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_payments');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load stored payments', e);
    }
    return [
      {
        id: 'TX-98421',
        transactionRef: 'TX-98421',
        guestName: 'Duke William Somerset',
        bookingCode: 'AUR-9921',
        bookingId: 'bkg-1',
        paymentMethod: 'Centurion Black Card',
        amount: 14400,
        date: '2026-10-28',
        status: 'paid',
        notes: 'Advance deposit settled via luxury concierge terminal',
      },
      {
        id: 'TX-98422',
        transactionRef: 'TX-98422',
        guestName: 'Baroness Genevieve von Stauffen',
        bookingCode: 'AUR-9922',
        bookingId: 'bkg-2',
        paymentMethod: 'International Wire Transfer',
        amount: 8600,
        date: '2026-10-29',
        status: 'paid',
        notes: 'Direct swift wire transfer from UBS Zurich',
      },
      {
        id: 'TX-98423',
        transactionRef: 'TX-98423',
        guestName: 'Lady Vivienne Westwood-Hyde',
        bookingCode: 'AUR-9923',
        bookingId: 'bkg-3',
        paymentMethod: 'Visa Infinite Private',
        amount: 5200,
        date: '2026-10-30',
        status: 'pending',
        notes: 'Pre-authorization held at check-in',
      },
      {
        id: 'TX-98424',
        transactionRef: 'TX-98424',
        guestName: 'Archduke Franz Ferdinand',
        bookingCode: 'AUR-9925',
        bookingId: 'bkg-5',
        paymentMethod: 'Amex Centurion',
        amount: 3200,
        date: '2026-10-27',
        status: 'refunded',
        notes: 'Cancelled stay - refund returned to original payment card',
      },
      {
        id: 'TX-98425',
        transactionRef: 'TX-98425',
        guestName: 'Prince Khalid Al-Mansoor',
        bookingCode: 'AUR-9926',
        bookingId: 'bkg-6',
        paymentMethod: 'Bank Wire',
        amount: 21500,
        date: '2026-10-26',
        status: 'paid',
        notes: 'Presidential Penthouse 4 nights settled in full',
      },
      {
        id: 'TX-98426',
        transactionRef: 'TX-98426',
        guestName: 'Countess Eleanor Vance',
        bookingCode: 'AUR-9927',
        bookingId: 'bkg-7',
        paymentMethod: 'Mastercard World Elite',
        amount: 4100,
        date: '2026-10-25',
        status: 'failed',
        notes: 'Card authorization timed out by issuing bank',
      },
    ];
  });

  const persistTransactions = (list) => {
    setExtraTransactions(list);
    try {
      localStorage.setItem('lazfort_payments', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save payments', e);
    }
  };

  // Compile real transactions from all folios + stored payments
  const allTransactions = useMemo(() => {
    const folioPayments = [];
    folios.forEach(f => {
      (f.payments || []).forEach((p, idx) => {
        folioPayments.push({
          id: p.id || `TX-FOLIO-${f.bookingCode}-${idx}`,
          transactionRef: p.transactionReference || `TX-${f.bookingCode}-${idx + 1}`,
          guestName: f.guestName,
          bookingCode: f.bookingCode,
          bookingId: f.bookingId,
          folioId: f.id,
          paymentMethod: p.paymentMethod || 'Credit Card',
          amount: p.amount,
          date: p.date || new Date().toISOString().split('T')[0],
          status: 'paid',
          notes: p.notes || `Folio payment for Suite ${f.roomNumber}`,
        });
      });
    });

    // Merge and remove duplicates by ID
    const map = new Map();
    [...extraTransactions, ...folioPayments].forEach(t => map.set(t.id, t));
    return Array.from(map.values());
  }, [folios, extraTransactions]);

  // Filters & State
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [viewTx, setViewTx] = useState(null);
  const [receiptTx, setReceiptTx] = useState(null);
  const [refundTx, setRefundTx] = useState(null);
  const [refundReason, setRefundReason] = useState('Guest requested refund');
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [processFormData, setProcessFormData] = useState({
    bookingId: '',
    guestName: '',
    amount: '',
    paymentMethod: 'Centurion Black Card',
    notes: 'Front Desk settlement',
  });

  // KPI Computations
  const totalVolume = useMemo(() => allTransactions.reduce((acc, t) => acc + (t.status === 'paid' ? t.amount : 0), 0), [allTransactions]);
  const paidCount = useMemo(() => allTransactions.filter(t => t.status === 'paid').length, [allTransactions]);
  const pendingCount = useMemo(() => allTransactions.filter(t => t.status === 'pending').length, [allTransactions]);
  const failedCount = useMemo(() => allTransactions.filter(t => t.status === 'failed').length, [allTransactions]);
  const refundedCount = useMemo(() => allTransactions.filter(t => t.status === 'refunded').length, [allTransactions]);
  const refundedVolume = useMemo(() => allTransactions.reduce((acc, t) => acc + (t.status === 'refunded' ? t.amount : 0), 0), [allTransactions]);

  // Filtered List
  const filteredList = useMemo(() => {
    return allTransactions.filter(item => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchMethod = methodFilter === 'all' || item.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());
      return matchStatus && matchMethod;
    });
  }, [allTransactions, statusFilter, methodFilter]);

  // Handle Process New Payment
  const handleProcessPayment = (e) => {
    e.preventDefault();
    const amountNum = Number(processFormData.amount);
    if (!amountNum || amountNum <= 0) {
      showToast('Validation Error', 'Payment amount must be greater than zero.', 'error');
      return;
    }

    const txCode = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const selectedBooking = bookings.find(b => b.id === processFormData.bookingId);

    const newTx = {
      id: txCode,
      transactionRef: txCode,
      guestName: processFormData.guestName || selectedBooking?.guestName || 'VIP Guest',
      bookingCode: selectedBooking?.bookingCode || `LAZ-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: processFormData.bookingId || 'bkg-manual',
      paymentMethod: processFormData.paymentMethod,
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      notes: processFormData.notes,
    };

    // If linked to folio, record in ERP
    if (selectedBooking) {
      const targetFolio = folios.find(f => f.bookingId === selectedBooking.id);
      if (targetFolio && settleFolioPayment) {
        settleFolioPayment(targetFolio.id, {
          amount: amountNum,
          paymentMethod: processFormData.paymentMethod,
          transactionReference: txCode,
          date: newTx.date,
          notes: processFormData.notes,
        });
      }
    }

    const updated = [newTx, ...extraTransactions];
    persistTransactions(updated);
    setProcessModalOpen(false);
    setProcessFormData({ bookingId: '', guestName: '', amount: '', paymentMethod: 'Centurion Black Card', notes: '' });
    showToast('Payment Settled', `Transaction ${txCode} for $${amountNum.toLocaleString()} processed successfully.`, 'success');
  };

  // Handle Refund
  const handleConfirmRefund = () => {
    if (!refundTx) return;
    const updated = allTransactions.map(t => {
      if (t.id === refundTx.id) {
        return {
          ...t,
          status: 'refunded',
          refundDate: new Date().toISOString().split('T')[0],
          refundReason,
        };
      }
      return t;
    });
    persistTransactions(updated);
    showToast('Refund Processed', `Refund of $${refundTx.amount.toLocaleString()} issued for ${refundTx.transactionRef}.`, 'success');
    setRefundTx(null);
  };

  // Download Receipt File
  const handleDownloadReceipt = (tx) => {
    const text = `
LAZFORT HOTEL & RESIDENCES - MONTE-CARLO
TRANSACTION PAYMENT RECEIPT
========================================
Transaction ID : ${tx.transactionRef || tx.id}
Receipt Date   : ${tx.date}
Guest Name     : ${tx.guestName}
Booking Ref    : ${tx.bookingCode}
Payment Method : ${tx.paymentMethod}
Amount Paid    : $${tx.amount.toLocaleString()} USD
Status         : ${tx.status.toUpperCase()}
Notes          : ${tx.notes || 'N/A'}
========================================
Lazfort Treasury & Financial Accounting
Thank you for your patronage.
    `.trim();

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${tx.transactionRef || tx.id}.txt`;
    link.click();
    showToast('Receipt Downloaded', `Receipt for ${tx.transactionRef} saved.`, 'success');
  };

  const columns = [
    {
      key: 'transactionRef',
      header: 'Transaction ID',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-accent text-xs">{item.transactionRef || item.id}</span>
          <p className="text-[10px] text-charcoal-muted uppercase">{item.date}</p>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.guestName}</p>
          <span className="font-mono text-[11px] text-charcoal-muted">Ref: {item.bookingCode}</span>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <CreditCard className="w-3.5 h-3.5 text-accent" />
          <span>{item.paymentMethod}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount (USD)',
      sortable: true,
      render: item => (
        <span className={`font-serif font-bold text-sm ${item.status === 'refunded' ? 'text-rose-500 line-through' : 'text-accent'}`}>
          ${item.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => {
        let badgeColor = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        if (item.status === 'pending') badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        if (item.status === 'failed') badgeColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        if (item.status === 'refunded') badgeColor = 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewTx(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Transaction Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setReceiptTx(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-primary dark:hover:text-white transition-colors"
            title="View Receipt"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDownloadReceipt(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Download Receipt TXT"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {item.status === 'paid' && (
            <button
              onClick={() => setRefundTx(item)}
              className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
              title="Process Refund"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Payment Operations & Merchant Terminal"
        description="Consolidated transaction settlement ledger, merchant gateway terminals, folio collections, and refund dispute logs."
        badge={`$${(totalVolume / 1000).toFixed(0)}k Processed`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Receipt}
              onClick={() => navigate('/hotel-admin/finance')}
            >
              Finance Ledger
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => setProcessModalOpen(true)}
            >
              Process Payment
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Settled Volume"
          value={`$${totalVolume.toLocaleString()}`}
          change={`${paidCount} Transactions Cleared`}
          isPositive={true}
          icon={DollarSign}
          subtitle="Processed volume MTD"
        />
        <StatCard
          title="Successful Payments"
          value={paidCount}
          change="Cleared & Deposited"
          isPositive={true}
          icon={CheckCircle}
          subtitle="Immediate bank credit"
        />
        <StatCard
          title="Pending Payments"
          value={pendingCount}
          change="Pre-authorizations"
          isPositive={pendingCount === 0}
          icon={Clock}
          subtitle="Awaiting checkout settlement"
        />
        <StatCard
          title="Failed Payments"
          value={failedCount}
          change="Terminal declines"
          isPositive={failedCount === 0}
          icon={XCircle}
          subtitle="Requires guest follow-up"
        />
        <StatCard
          title="Refunded Payments"
          value={refundedCount}
          change={`$${refundedVolume.toLocaleString()}`}
          isPositive={refundedCount === 0}
          icon={RotateCcw}
          subtitle="Returned to cardholders"
        />
      </div>

      {/* Filter and Control Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-charcoal-muted">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid & Cleared</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-charcoal-muted">Payment Channel:</span>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-primary-900/70 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 focus:outline-none focus:border-accent"
          >
            <option value="all">All Channels</option>
            <option value="centurion">Centurion Black Card</option>
            <option value="wire">Bank Wire Transfer</option>
            <option value="visa">Visa Infinite</option>
            <option value="mastercard">Mastercard</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredList}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search transactions by guest, reference, or payment method..."
        pageSize={8}
      />

      {/* Process Payment Modal */}
      {processModalOpen && (
        <Modal
          isOpen={processModalOpen}
          onClose={() => setProcessModalOpen(false)}
          title="Terminal: Collect & Process Payment"
        >
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <FormField label="Link to Reservation (Optional)">
              <Select
                value={processFormData.bookingId}
                onChange={e => {
                  const b = bookings.find(item => item.id === e.target.value);
                  setProcessFormData({
                    ...processFormData,
                    bookingId: e.target.value,
                    guestName: b ? b.guestName : processFormData.guestName,
                    amount: b ? b.totalAmount : processFormData.amount,
                  });
                }}
                options={[
                  { value: '', label: '-- Manual Walk-in / Direct Payment --' },
                  ...bookings.map(b => ({
                    value: b.id,
                    label: `${b.bookingCode} - ${b.guestName} (Suite ${b.roomNumber}) - $${b.totalAmount}`
                  }))
                ]}
              />
            </FormField>

            <FormField label="Guest Full Name">
              <Input
                value={processFormData.guestName}
                onChange={e => setProcessFormData({ ...processFormData, guestName: e.target.value })}
                placeholder="e.g. Sir Alexander Kensington"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Settlement Amount ($ USD)">
                <Input
                  type="number"
                  value={processFormData.amount}
                  onChange={e => setProcessFormData({ ...processFormData, amount: e.target.value })}
                  placeholder="e.g. 5000"
                  required
                />
              </FormField>

              <FormField label="Payment Method">
                <Select
                  value={processFormData.paymentMethod}
                  onChange={e => setProcessFormData({ ...processFormData, paymentMethod: e.target.value })}
                  options={[
                    { value: 'Centurion Black Card', label: 'Centurion Black Card (Amex)' },
                    { value: 'Visa Infinite Private', label: 'Visa Infinite / Signature' },
                    { value: 'Mastercard World Elite', label: 'Mastercard World Elite' },
                    { value: 'International Wire Transfer', label: 'International Bank Wire' },
                    { value: 'Cash / Private Escrow', label: 'Cash / Private Vault Escrow' },
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Terminal Transaction Memo / Notes">
              <Input
                value={processFormData.notes}
                onChange={e => setProcessFormData({ ...processFormData, notes: e.target.value })}
                placeholder="Front desk checkout charge, minibar or concierge transfer"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setProcessModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Authorize & Clear Payment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Transaction Modal */}
      {viewTx && (
        <Modal
          isOpen={!!viewTx}
          onClose={() => setViewTx(null)}
          title={`Transaction Audit: ${viewTx.transactionRef || viewTx.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-charcoal-light/10 dark:bg-white/5">
              <div>
                <span className="text-charcoal-muted block">Client / Resident</span>
                <span className="font-semibold text-primary dark:text-white text-sm">{viewTx.guestName}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Booking Ref</span>
                <span className="font-mono font-bold text-accent">{viewTx.bookingCode}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Amount Cleared</span>
                <span className="font-serif font-bold text-base text-accent">${viewTx.amount?.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-charcoal-muted block">Settlement Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {viewTx.status}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/70 dark:border-white/10 space-y-1">
              <span className="text-charcoal-muted block font-semibold">Payment Channel & Protocol</span>
              <p className="text-primary dark:text-white">{viewTx.paymentMethod}</p>
              <p className="text-charcoal-muted">{viewTx.notes || 'No merchant notes attached.'}</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setViewTx(null)}>
                Close
              </Button>
              <Button
                variant="gold"
                icon={Printer}
                onClick={() => {
                  setReceiptTx(viewTx);
                  setViewTx(null);
                }}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Receipt Modal */}
      {receiptTx && (
        <Modal
          isOpen={!!receiptTx}
          onClose={() => setReceiptTx(null)}
          title="Payment Voucher Receipt"
        >
          <div className="space-y-4 p-4 border border-dashed border-accent/40 rounded-xl bg-ivory/50 dark:bg-primary-950/50">
            <div className="text-center space-y-1 pb-3 border-b border-border/80 dark:border-white/10">
              <h2 className="font-serif font-bold text-xl text-primary dark:text-white">LAZFORT PALACE</h2>
              <p className="text-[10px] uppercase font-mono tracking-widest text-accent">Monte-Carlo • Principality of Monaco</p>
              <p className="text-xs text-charcoal-muted">Merchant Receipt #{receiptTx.transactionRef || receiptTx.id}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Guest Name:</span>
                <strong className="text-primary dark:text-white">{receiptTx.guestName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Booking Reference:</span>
                <span className="font-mono text-accent">{receiptTx.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Payment Date:</span>
                <span>{receiptTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Payment Method:</span>
                <span>{receiptTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/80 dark:border-white/10">
                <span>Total Amount Charged:</span>
                <span className="font-serif text-accent">${receiptTx.amount?.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-charcoal-muted">
              Cleared through Lazfort Central Bank Gateway. Tax settled in full.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setReceiptTx(null)}>
                Dismiss
              </Button>
              <Button variant="gold" icon={Printer} onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Refund Modal */}
      {refundTx && (
        <Modal
          isOpen={!!refundTx}
          onClose={() => setRefundTx(null)}
          title={`Process Refund: ${refundTx.transactionRef || refundTx.id}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
              <p className="font-bold text-rose-600 dark:text-rose-400">
                Initiate full refund of ${refundTx.amount?.toLocaleString()} USD to {refundTx.guestName}?
              </p>
              <p className="text-charcoal-muted">
                Transaction will be reversed via {refundTx.paymentMethod}. Funds will credit within 1-2 business days.
              </p>
            </div>

            <FormField label="Refund Reason">
              <Input
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="Reason for refund processing..."
                required
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setRefundTx(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmRefund}>
                Confirm Reversal & Refund
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentsPage;

