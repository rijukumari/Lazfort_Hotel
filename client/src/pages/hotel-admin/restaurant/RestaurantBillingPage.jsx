import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  CreditCard,
  BedDouble,
  CheckCircle,
  Eye,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  RestaurantStatCard,
  RestaurantNavTabs,
  RestaurantSearch,
  RestaurantFilters,
  RestaurantDataTable,
  RestaurantBillModal,
} from '../../../components/restaurant';

export const RestaurantBillingPage = () => {
  const navigate = useNavigate();
  const {
    restaurantBills = [],
    restaurantOrders = [],
    folios = [],
    recordRestaurantBillPayment,
    postRestaurantBillToFolio,
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [orderToBill, setOrderToBill] = useState(null);

  // Filtered Bills
  const filteredBills = useMemo(() => {
    return restaurantBills.filter(bill => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        bill.billNumber?.toLowerCase().includes(q) ||
        bill.guestName?.toLowerCase().includes(q) ||
        bill.orderId?.toLowerCase().includes(q) ||
        (bill.roomNumber && bill.roomNumber.toLowerCase().includes(q));

      const matchesPay =
        paymentFilter === 'all' ||
        (paymentFilter === 'paid' && bill.paymentStatus === 'Paid') ||
        (paymentFilter === 'unpaid' && (bill.paymentStatus === 'Unpaid' || bill.paymentStatus === 'Pending'));

      return matchesSearch && matchesPay;
    });
  }, [restaurantBills, searchQuery, paymentFilter]);

  // Financial Computations
  const totalBilled = restaurantBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalSettled = restaurantBills.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const totalPending = totalBilled - totalSettled;
  const postedToFolios = restaurantBills.filter(b => b.postedToFolio).length;

  const handleQuickPay = (bill, e) => {
    e.stopPropagation();
    const res = recordRestaurantBillPayment(bill.id || bill.billNumber, 'Credit Card (Visa/Mastercard)', bill.grandTotal);
    if (res?.success) {
      showToast('Settlement Recorded', res.message, 'success');
    }
  };

  const handlePrint = (bill, e) => {
    e.stopPropagation();
    showToast('Invoice Dispatched', `Receipt for #${bill.billNumber} sent to printer.`, 'info');
  };

  const columns = [
    {
      key: 'billNumber',
      header: 'Bill Ref & Date',
      sortable: true,
      render: b => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">#{b.billNumber}</span>
          <span className="text-[10px] text-charcoal-muted block">{b.billDate || b.createdAt?.slice(0, 16)}</span>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest & Suite',
      sortable: true,
      render: b => (
        <div>
          <p className="font-semibold text-primary dark:text-white text-xs">{b.guestName}</p>
          <p className="text-[11px] text-charcoal-muted">
            {b.roomNumber ? `Suite ${b.roomNumber}` : b.tableNumber || 'Dining Room'} • Order #{b.orderId}
          </p>
        </div>
      ),
    },
    {
      key: 'subtotal',
      header: 'F&B Net',
      render: b => (
        <span className="font-mono text-xs text-charcoal/90 dark:text-gray-300">
          ${(b.subtotal || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'tax',
      header: 'Tax & Service',
      render: b => (
        <span className="font-mono text-xs text-charcoal-muted">
          +${((b.tax || 0) + (b.serviceCharge || 0)).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Total Payable',
      sortable: true,
      render: b => (
        <span className="font-serif font-bold text-accent text-sm">
          ${(b.grandTotal || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Settlement Status',
      sortable: true,
      render: b => (
        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              b.paymentStatus === 'Paid'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${b.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{b.paymentStatus}</span>
          </span>
          {b.postedToFolio && (
            <span className="text-[10px] text-accent block font-mono mt-0.5">
              Folio: {b.folioRef}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: b => (
        <div className="flex items-center justify-end gap-1.5">
          {b.paymentStatus !== 'Paid' && (
            <button
              onClick={e => handleQuickPay(b, e)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
              title="Fast Settle"
            >
              Settle
            </button>
          )}

          <button
            onClick={e => handlePrint(b, e)}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Print Receipt"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              navigate(`/hotel-admin/restaurant/billing/${b.id || b.billNumber}`, {
                state: { bill: b }
              });
            }}
            className="p-1.5 rounded-lg hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors cursor-pointer"
            title="View Invoice Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Restaurant Billing & Guest Folio Charges
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Gastronomic POS
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Generate dining invoices, apply courtesy discounts, calculate tax & post charges to resident folios.
          </p>
        </div>

        <button
          onClick={() => {
            const firstUnbilled = restaurantOrders.find(o => !restaurantBills.some(b => b.orderId === (o.orderNumber || o.id))) || restaurantOrders[0];
            navigate('/hotel-admin/restaurant/billing/create', {
              state: { order: firstUnbilled }
            });
          }}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Bill</span>
        </button>
      </div>



      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <RestaurantStatCard
          title="Total Dining Invoices"
          value={`$${totalBilled.toLocaleString()}`}
          subtitle={`${restaurantBills.length} recorded bills`}
          icon={Receipt}
        />
        <RestaurantStatCard
          title="Settled Invoices"
          value={`$${totalSettled.toLocaleString()}`}
          subtitle="Fully collected"
          icon={CheckCircle}
        />
        <RestaurantStatCard
          title="Pending Settlements"
          value={`$${totalPending.toLocaleString()}`}
          subtitle="Unpaid or on open tables"
          icon={Clock}
        />
        <RestaurantStatCard
          title="Posted to Folios"
          value={postedToFolios}
          subtitle="Charged directly to suites"
          icon={BedDouble}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <RestaurantSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by bill #, guest name, order ref, room..."
        />

        <div className="flex items-center gap-2">
          <RestaurantFilters
            activeFilter={paymentFilter}
            onSelectFilter={setPaymentFilter}
            options={[
              { value: 'all', label: 'All Bills', count: restaurantBills.length },
              { value: 'paid', label: 'Paid', count: restaurantBills.filter(b => b.paymentStatus === 'Paid').length },
              { value: 'unpaid', label: 'Pending', count: restaurantBills.filter(b => b.paymentStatus !== 'Paid').length },
            ]}
          />
        </div>
      </div>

      {/* Billing Data Table */}
      <RestaurantDataTable
        columns={columns}
        data={filteredBills}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        emptyTitle="No dining invoices match your query"
        emptyDescription="Generate a bill from active culinary orders or adjust your search parameters."
        emptyActionLabel="Generate Bill"
        onEmptyAction={() => {
          const firstUnbilled = restaurantOrders.find(o => !restaurantBills.some(b => b.orderId === (o.orderNumber || o.id))) || restaurantOrders[0];
          navigate('/hotel-admin/restaurant/billing/create', {
            state: { order: firstUnbilled }
          });
        }}
      />

      {/* Modal removed in favor of dedicated standalone page /hotel-admin/restaurant/billing/create */}
    </div>
  );
};

export default RestaurantBillingPage;

