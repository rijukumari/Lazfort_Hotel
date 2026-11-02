import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Eye,
  Trash2,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Save,
  Tag,
  BedDouble,
  User
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  FinanceNavTabs,
  PaymentStatusBadge,
  DeleteConfirmationDialog
} from '../../../components/finance';

const CHARGE_CATEGORIES = [
  { value: 'room_charge', label: 'Room & Suite Accommodation' },
  { value: 'restaurant', label: 'Michelin Dining & In-Suite Gastronomy' },
  { value: 'spa', label: 'Royal Spa, Thermal Baths & Wellness' },
  { value: 'minibar', label: 'Private Bar, Champagne & Caviar Restock' },
  { value: 'concierge', label: 'VIP Chauffeur, Yacht Charter & Concierge' },
  { value: 'laundry', label: 'Dry Cleaning & Express Valet Service' },
  { value: 'miscellaneous', label: 'Incidental / Custom Charge' },
];

const PAYMENT_METHODS = [
  'Centurion Black Card',
  'Visa Infinite Luxury',
  'Mastercard World Elite',
  'International Wire Transfer (UBS)',
  'Cash Settlement (Treasury Safe)',
  'Direct Corporate Ledger Billing',
];

export const GuestFoliosPage = () => {
  const {
    folios = [],
    bookings = [],
    createFolio,
    postFolioCharge,
    settleFolioPayment,
    deleteFolio
  } = useERP();
  const { showToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dedicated Page Views: 'list' | 'create' | 'details' | 'charge' | 'settle'
  const [pageView, setPageView] = useState('list');
  const [selectedFolio, setSelectedFolio] = useState(null);
  const [folioToDelete, setFolioToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Create Folio Form
  const [createForm, setCreateForm] = useState({
    bookingId: '',
    guestName: '',
    roomNumber: '101',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    initialRoomRate: '1850',
    notes: 'Direct VIP Folio Initialization',
  });
  const [createErrors, setCreateErrors] = useState({});

  // Add Charge Form
  const [chargeForm, setChargeForm] = useState({
    category: 'restaurant',
    description: '',
    quantity: '1',
    unitPrice: '',
    taxRate: '10',
  });
  const [chargeErrors, setChargeErrors] = useState({});

  // Settle Payment Form
  const [settleForm, setSettleForm] = useState({
    amount: '',
    paymentMethod: PAYMENT_METHODS[0],
    transactionReference: `TX-FOL-${Math.floor(10000 + Math.random() * 90000)}`,
    notes: 'Folio balance settlement',
  });
  const [settleErrors, setSettleErrors] = useState({});

  // Filtered Folios
  const filteredFolios = useMemo(() => {
    return folios.filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        f.guestName?.toLowerCase().includes(q) ||
        f.roomNumber?.toString().includes(q) ||
        f.bookingCode?.toLowerCase().includes(q) ||
        f.id?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [folios, searchQuery, statusFilter]);

  // Statistics
  const totalChargesAll = folios.reduce((s, f) => s + (Number(f.grandTotal) || 0), 0);
  const totalPaidAll = folios.reduce((s, f) => s + (Number(f.totalPaid) || 0), 0);
  const totalReceivables = folios.reduce((s, f) => s + (Number(f.balanceDue) || 0), 0);
  const openCount = folios.filter((f) => f.status === 'open').length;

  const handleDeleteConfirm = () => {
    if (folioToDelete) {
      deleteFolio(folioToDelete.id);
      showToast('Folio Deleted', `Folio record ${folioToDelete.bookingCode} removed.`, 'info');
      setFolioToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!createForm.guestName.trim()) errs.guestName = 'Guest name is required';
    if (!createForm.roomNumber.trim()) errs.roomNumber = 'Room number is required';
    if (!createForm.checkIn) errs.checkIn = 'Check-in date required';
    if (!createForm.checkOut) errs.checkOut = 'Check-out date required';
    if (Object.keys(errs).length > 0) {
      setCreateErrors(errs);
      return;
    }

    const rate = Number(createForm.initialRoomRate) || 0;
    const initialCharge = rate > 0 ? [{
      id: `chg-${Date.now()}`,
      date: createForm.checkIn,
      category: 'room_charge',
      description: `Suite ${createForm.roomNumber} — Initial Night Rate`,
      quantity: 1,
      unitPrice: rate,
      taxAmount: Math.round(rate * 0.1),
      totalAmount: Math.round(rate * 1.1),
      postedBy: 'Front Desk Concierge',
    }] : [];

    createFolio({
      guestName: createForm.guestName.trim(),
      roomNumber: createForm.roomNumber.trim(),
      checkIn: createForm.checkIn,
      checkOut: createForm.checkOut,
      notes: createForm.notes.trim(),
      charges: initialCharge,
      payments: [],
      grandTotal: rate > 0 ? Math.round(rate * 1.1) : 0,
      totalPaid: 0,
      balanceDue: rate > 0 ? Math.round(rate * 1.1) : 0,
      status: 'open',
    });

    showToast('Folio Opened', `Folio opened for ${createForm.guestName}.`, 'success');
    setPageView('list');
  };

  const handleChargeSubmit = (e) => {
    e.preventDefault();
    if (!selectedFolio) return;
    const errs = {};
    if (!chargeForm.description.trim()) errs.description = 'Description is required';
    if (!chargeForm.unitPrice || Number(chargeForm.unitPrice) <= 0) {
      errs.unitPrice = 'Valid price is required';
    }
    if (Object.keys(errs).length > 0) {
      setChargeErrors(errs);
      return;
    }

    const qty = Number(chargeForm.quantity) || 1;
    const price = Number(chargeForm.unitPrice) || 0;
    const subtotal = qty * price;
    const taxRate = Number(chargeForm.taxRate) || 10;
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const totalAmount = subtotal + taxAmount;

    postFolioCharge(selectedFolio.id, {
      date: new Date().toISOString().split('T')[0],
      category: chargeForm.category,
      description: chargeForm.description.trim(),
      quantity: qty,
      unitPrice: price,
      taxAmount,
      totalAmount,
      postedBy: 'Finance Controller',
    });

    showToast('Charge Posted', `$${totalAmount} posted to Suite ${selectedFolio.roomNumber} Folio.`, 'success');
    setPageView('list');
  };

  const handleSettleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFolio) return;
    const errs = {};
    if (!settleForm.amount || Number(settleForm.amount) <= 0) {
      errs.amount = 'Valid settlement amount is required';
    }
    if (Object.keys(errs).length > 0) {
      setSettleErrors(errs);
      return;
    }

    settleFolioPayment(selectedFolio.id, {
      amount: Number(settleForm.amount),
      paymentMethod: settleForm.paymentMethod,
      transactionReference: settleForm.transactionReference,
      notes: settleForm.notes.trim(),
      date: new Date().toISOString().split('T')[0],
    });

    showToast('Payment Recorded', `$${settleForm.amount} payment settled on folio.`, 'success');
    setPageView('list');
  };

  // Dedicated View: Create Folio
  if (pageView === 'create') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Folios</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Initialize Guest Folio Statement
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Open master billing record for in-suite charges, culinary billing, and concierge settlements.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Guest Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.guestName}
                  onChange={e => setCreateForm({ ...createForm, guestName: e.target.value })}
                  placeholder="e.g. Duke Sterling of Kent"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
                {createErrors.guestName && (
                  <p className="mt-1 text-[11px] text-rose-500">{createErrors.guestName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Suite / Chamber <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.roomNumber}
                  onChange={e => setCreateForm({ ...createForm, roomNumber: e.target.value })}
                  placeholder="e.g. 701 or Penthouse North"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono font-bold"
                />
                {createErrors.roomNumber && (
                  <p className="mt-1 text-[11px] text-rose-500">{createErrors.roomNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Check-in Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={createForm.checkIn}
                  onChange={e => setCreateForm({ ...createForm, checkIn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Check-out Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={createForm.checkOut}
                  onChange={e => setCreateForm({ ...createForm, checkOut: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Initial Room Tariff ($ USD)
                </label>
                <input
                  type="number"
                  value={createForm.initialRoomRate}
                  onChange={e => setCreateForm({ ...createForm, initialRoomRate: e.target.value })}
                  placeholder="1850"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Folio Billing Notes
              </label>
              <textarea
                rows={3}
                value={createForm.notes}
                onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
                placeholder="VIP credit guarantees, corporate billing instructions..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('list')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Initialize Folio Statement</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dedicated View: Folio Details Dossier
  if (pageView === 'details' && selectedFolio) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to All Folios</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast('Printing Folio', `Printed guest statement ${selectedFolio.bookingCode}.`, 'info');
              }}
              className="px-3.5 py-2 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-primary dark:text-white flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
            <button
              onClick={() => setPageView('charge')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Charge</span>
            </button>
            {(selectedFolio.balanceDue || 0) > 0 && (
              <button
                onClick={() => {
                  setSettleForm({
                    ...settleForm,
                    amount: (selectedFolio.balanceDue || '').toString()
                  });
                  setPageView('settle');
                }}
                className="px-4 py-2 rounded-xl bg-accent text-primary-950 text-xs font-bold shadow-gold flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Settle Payment</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-accent/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 dark:border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-lg">
                  {selectedFolio.bookingCode || selectedFolio.id}
                </span>
                <PaymentStatusBadge status={selectedFolio.status} />
              </div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white mt-2">
                {selectedFolio.guestName}
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Suite {selectedFolio.roomNumber} • Residency: {selectedFolio.checkIn || '2026-10-25'} to {selectedFolio.checkOut || '2026-10-30'}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-charcoal-muted dark:text-gray-400 font-mono">Total Charges</p>
                <p className="font-serif font-bold text-xl text-primary dark:text-white">
                  ${(selectedFolio.grandTotal || 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-500 font-mono">Paid to Date</p>
                <p className="font-serif font-bold text-xl text-emerald-500">
                  ${(selectedFolio.totalPaid || 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-rose-500 font-mono">Balance Due</p>
                <p className="font-serif font-bold text-2xl text-rose-500">
                  ${(selectedFolio.balanceDue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Charges Ledger Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
              Statement Itemized Charges Ledger
            </h4>
            <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory/60 dark:bg-primary-950/40 border-b border-border/80 dark:border-white/10 text-[11px] uppercase tracking-wider text-charcoal-muted">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Specification</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Tariff</th>
                    <th className="py-2.5 px-4 text-right">Tax</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {selectedFolio.charges && selectedFolio.charges.length > 0 ? (
                    selectedFolio.charges.map((c, i) => (
                      <tr key={i} className="hover:bg-ivory/40 dark:hover:bg-primary-800/30">
                        <td className="py-2.5 px-4 font-mono text-charcoal-muted">{c.date}</td>
                        <td className="py-2.5 px-4 capitalize font-semibold">{c.category?.replace(/_/g, ' ')}</td>
                        <td className="py-2.5 px-4 text-primary dark:text-gray-200">{c.description}</td>
                        <td className="py-2.5 px-4 text-center font-mono">{c.quantity || 1}</td>
                        <td className="py-2.5 px-4 text-right font-mono">${(c.unitPrice || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-charcoal-muted">${(c.taxAmount || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-accent">${(c.totalAmount || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-charcoal-muted">
                        No individual charges posted to this folio yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments Ledger Table */}
          {selectedFolio.payments && selectedFolio.payments.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                Settled Payments & Remittances
              </h4>
              <div className="rounded-2xl border border-emerald-500/30 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <tr>
                      <th className="py-2.5 px-4">Date</th>
                      <th className="py-2.5 px-4">Payment Method</th>
                      <th className="py-2.5 px-4">Reference</th>
                      <th className="py-2.5 px-4 text-right">Amount Settled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10">
                    {selectedFolio.payments.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-4 font-mono">{p.date}</td>
                        <td className="py-2.5 px-4 font-semibold">{p.paymentMethod}</td>
                        <td className="py-2.5 px-4 font-mono text-charcoal-muted">{p.transactionReference || p.reference}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-500">
                          ${(p.amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dedicated View: Post Charge
  if (pageView === 'charge' && selectedFolio) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('details')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Folio Dossier</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-blue-500/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Post Incidental or Service Charge
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Suite {selectedFolio.roomNumber} • {selectedFolio.guestName} ({selectedFolio.bookingCode})
              </p>
            </div>
          </div>

          <form onSubmit={handleChargeSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Charge Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={chargeForm.category}
                  onChange={e => setChargeForm({ ...chargeForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {CHARGE_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={chargeForm.quantity}
                  onChange={e => setChargeForm({ ...chargeForm, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Unit Price ($ USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={chargeForm.unitPrice}
                  onChange={e => setChargeForm({ ...chargeForm, unitPrice: e.target.value })}
                  placeholder="e.g. 450"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono font-bold text-accent"
                />
                {chargeErrors.unitPrice && (
                  <p className="mt-1 text-[11px] text-rose-500">{chargeErrors.unitPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  VAT / Luxury Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={chargeForm.taxRate}
                  onChange={e => setChargeForm({ ...chargeForm, taxRate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Specification & Reference <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={chargeForm.description}
                onChange={e => setChargeForm({ ...chargeForm, description: e.target.value })}
                placeholder="e.g. Dom Pérignon Vintage 2013 & Beluga Caviar Sevruga"
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
              {chargeErrors.description && (
                <p className="mt-1 text-[11px] text-rose-500">{chargeErrors.description}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('details')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Post Charge to Statement</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dedicated View: Settle Payment
  if (pageView === 'settle' && selectedFolio) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('details')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-primary-900 text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Folio Statement</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-primary-900 border border-emerald-500/40 shadow-xl space-y-6">
          <div className="flex items-center gap-3.5 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                Record Payment Settlement
              </h2>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Outstanding Balance: ${(selectedFolio.balanceDue || 0).toLocaleString()} • {selectedFolio.guestName}
              </p>
            </div>
          </div>

          <form onSubmit={handleSettleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Settlement Amount ($ USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settleForm.amount}
                  onChange={e => setSettleForm({ ...settleForm, amount: e.target.value })}
                  placeholder={(selectedFolio.balanceDue || 0).toString()}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono font-bold text-emerald-500 text-base"
                />
                {settleErrors.amount && (
                  <p className="mt-1 text-[11px] text-rose-500">{settleErrors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Settlement Channel / Method
                </label>
                <select
                  value={settleForm.paymentMethod}
                  onChange={e => setSettleForm({ ...settleForm, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Bank / Terminal Reference ID
              </label>
              <input
                type="text"
                value={settleForm.transactionReference}
                onChange={e => setSettleForm({ ...settleForm, transactionReference: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                Settlement Audit Remarks
              </label>
              <textarea
                rows={2}
                value={settleForm.notes}
                onChange={e => setSettleForm({ ...settleForm, notes: e.target.value })}
                placeholder="Verified at front desk counter by night audit..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-primary-950/50 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPageView('details')}
                className="px-5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-primary-800 text-xs font-semibold text-charcoal-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Confirm Settlement</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Guest Folios & In-House Billing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Live Guest Ledgers
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Real-time chamber charges, restaurant chits, spa bookings, and credit card settlements.
          </p>
        </div>

        <button
          onClick={() => setPageView('create')}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-primary-950 text-xs font-bold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Guest Folio</span>
        </button>
      </div>



      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Open Folios</p>
            <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
              {openCount}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">Active In-House Residencies</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Total Charges</p>
            <p className="font-serif font-bold text-2xl text-primary dark:text-white mt-1">
              ${totalChargesAll.toLocaleString()}
            </p>
            <p className="text-[10px] text-charcoal-muted font-mono mt-0.5">All Ledger Postings</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Total Settled</p>
            <p className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
              ${totalPaidAll.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-600 font-mono mt-0.5">Deposits & Payments</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400 font-medium">Outstanding Due</p>
            <p className="font-serif font-bold text-2xl text-rose-600 dark:text-rose-400 mt-1">
              ${totalReceivables.toLocaleString()}
            </p>
            <p className="text-[10px] text-rose-500 font-mono mt-0.5">Due at Checkout</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by guest name, room number, or folio ref..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-ivory/50 dark:bg-primary-950/60 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {['all', 'open', 'settled', 'void'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                  statusFilter === st
                    ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                    : 'bg-ivory/80 dark:bg-primary-950/40 border-border/80 dark:border-white/10 text-charcoal-muted dark:text-gray-300 hover:text-accent hover:border-accent/40'
                }`}
              >
                {st === 'all' ? 'All Folios' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Folios Data Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredFolios.length}</span> of {folios.length} Folios
          </p>
          {(statusFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredFolios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-950/80 text-[11px] uppercase tracking-wider text-charcoal dark:text-gray-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Folio ID</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Guest Name</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Chamber</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Check-in</th>
                  <th className="py-3.5 px-4 text-charcoal dark:text-gray-200">Check-out</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Total Charges</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Amount Paid</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Balance Due</th>
                  <th className="py-3.5 px-4 text-center text-charcoal dark:text-gray-200">Status</th>
                  <th className="py-3.5 px-4 text-right text-charcoal dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredFolios.map((folio) => (
                  <tr
                    key={folio.id}
                    className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {folio.bookingCode || folio.id}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                      {folio.guestName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium">
                      Suite {folio.roomNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {folio.checkIn || '2026-10-25'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {folio.checkOut || '2026-10-30'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-primary dark:text-white">
                      ${(folio.grandTotal || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      ${(folio.totalPaid || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={(folio.balanceDue || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        ${(folio.balanceDue || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <PaymentStatusBadge status={folio.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedFolio(folio);
                            setPageView('details');
                          }}
                          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
                          title="View Statement & Charges"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedFolio(folio);
                            setPageView('charge');
                          }}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/15 transition-colors"
                          title="Post Charge to Folio"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        {(folio.balanceDue || 0) > 0 && (
                          <button
                            onClick={() => {
                              setSelectedFolio(folio);
                              setSettleForm({
                                ...settleForm,
                                amount: (folio.balanceDue || '').toString()
                              });
                              setPageView('settle');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/15 transition-colors"
                            title="Record Payment"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setFolioToDelete(folio);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                          title="Delete Folio Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-muted dark:text-gray-400">
            <Receipt className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No Guest Folios Found
            </p>
            <p className="text-xs mt-1">Initialize a new guest folio or reset search filters.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFolioToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Purge Guest Folio Record"
        itemName={folioToDelete ? `${folioToDelete.bookingCode} - ${folioToDelete.guestName}` : ''}
        message="Are you certain you wish to purge this folio? All posted charges and payments will be removed."
      />
    </div>
  );
};

export default GuestFoliosPage;
