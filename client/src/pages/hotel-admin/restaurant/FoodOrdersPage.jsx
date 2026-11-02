import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Printer,
  Receipt,
  XCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  CreditCard,
  BedDouble,
  Ban
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  RestaurantStatCard,
  RestaurantNavTabs,
  RestaurantSearch,
  RestaurantFilters,
  RestaurantDataTable,
  OrderStatusBadge,
} from '../../../components/restaurant';

const STATUS_FILTERS = ['all', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'];

export const FoodOrdersPage = () => {
  const navigate = useNavigate();
  const {
    restaurantOrders = [],
    updateRestaurantOrderStatus,
    cancelRestaurantOrder,
    generateRestaurantBill,
    recordRestaurantBillPayment,
    postRestaurantBillToFolio
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dedicated Page State: 'list' | 'details' | 'bill'
  const [pageView, setPageView] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [billOrder, setBillOrder] = useState(null);

  // Billing form state
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa/Mastercard)');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return restaurantOrders.filter(order => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.guestName?.toLowerCase().includes(q) ||
        (order.roomNumber && order.roomNumber.toLowerCase().includes(q)) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(q));

      const matchesStatus =
        selectedStatus === 'all' ||
        order.status === selectedStatus ||
        (selectedStatus === 'Pending' && order.status === 'New');

      const matchesType =
        selectedType === 'all' || order.orderType === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [restaurantOrders, searchQuery, selectedStatus, selectedType]);

  const handleQuickStatus = (orderId, newStatus) => {
    updateRestaurantOrderStatus(orderId, newStatus);
    showToast('Order Status Advanced', `Order #${orderId} marked as ${newStatus}.`, 'success');
  };

  const handleCancel = (orderId) => {
    cancelRestaurantOrder(orderId, 'Cancelled via Food Order Console');
    showToast('Order Cancelled', `Order #${orderId} was cancelled.`, 'info');
    if (pageView === 'details') setPageView('list');
  };

  const handleProcessPayment = () => {
    if (!billOrder) return;
    const orderId = billOrder.orderNumber || billOrder.id;
    updateRestaurantOrderStatus(orderId, 'Completed');
    showToast('Payment Settled', `Bill settled for ${billOrder.guestName} via ${paymentMethod}.`, 'success');
    setPageView('list');
  };

  const handleChargeToFolio = () => {
    if (!billOrder) return;
    const orderId = billOrder.orderNumber || billOrder.id;
    updateRestaurantOrderStatus(orderId, 'Completed');
    showToast('Posted to Suite Folio', `Bill of $${billOrder.totalAmount} charged to Suite ${billOrder.roomNumber || '701'} Folio.`, 'success');
    setPageView('list');
  };

  // Stats
  const totalOrders = restaurantOrders.length;
  const activeOrders = restaurantOrders.filter(
    o => o.status === 'Pending' || o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Ready' || o.status === 'New'
  ).length;
  const completedOrders = restaurantOrders.filter(o => o.status === 'Served' || o.status === 'Completed').length;
  const totalDiningRevenue = restaurantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order Reference',
      sortable: true,
      render: o => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">#{o.orderNumber || o.id}</span>
          <p className="text-[10px] text-charcoal-muted flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5" />
            <span>{o.orderTime || 'Just now'}</span>
          </p>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest & Destination',
      sortable: true,
      render: o => (
        <div>
          <p className="font-semibold text-primary dark:text-white text-xs">{o.guestName}</p>
          <p className="text-[11px] text-accent font-medium">
            {o.roomNumber ? `Suite ${o.roomNumber}` : o.tableNumber || 'Main Salon'} • {o.orderType}
          </p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Ordered Selections',
      render: o => (
        <div className="text-xs space-y-0.5 max-w-xs">
          {o.items?.map((it, idx) => (
            <p key={idx} className="truncate text-charcoal/90 dark:text-gray-300">
              {it.quantity}x {it.name}
            </p>
          ))}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Tariff',
      sortable: true,
      render: o => (
        <div>
          <span className="font-serif font-bold text-accent text-sm">
            ${(o.totalAmount || 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
            {o.paymentStatus || 'Pending'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Preparation Stage',
      sortable: true,
      render: o => <OrderStatusBadge status={o.status} />,
    },
    {
      key: 'actions',
      header: 'Quick Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: o => (
        <div className="flex items-center justify-end gap-1.5">
          {o.status === 'Pending' || o.status === 'New' ? (
            <button
              onClick={() => handleQuickStatus(o.orderNumber || o.id, 'Accepted')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
              title="Accept Order"
            >
              Accept
            </button>
          ) : o.status === 'Accepted' ? (
            <button
              onClick={() => handleQuickStatus(o.orderNumber || o.id, 'Preparing')}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
              title="Mark Preparing"
            >
              Prepare
            </button>
          ) : o.status === 'Preparing' ? (
            <button
              onClick={() => handleQuickStatus(o.orderNumber || o.id, 'Ready')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
              title="Mark Ready"
            >
              Ready
            </button>
          ) : o.status === 'Ready' ? (
            <button
              onClick={() => handleQuickStatus(o.orderNumber || o.id, 'Served')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
              title="Mark Served"
            >
              Served
            </button>
          ) : null}

          {/* Bill Action */}
          <button
            onClick={() => {
              setBillOrder(o);
              setPageView('bill');
            }}
            className="p-1.5 rounded-lg bg-ivory dark:bg-white/5 hover:bg-accent/20 text-charcoal-muted hover:text-accent transition-colors"
            title="Generate Bill for this Order"
          >
            <Receipt className="w-3.5 h-3.5" />
          </button>

          {/* Inspect Details */}
          <button
            onClick={() => {
              setSelectedOrder(o);
              setPageView('details');
            }}
            className="p-1.5 rounded-lg bg-ivory dark:bg-white/5 hover:bg-accent/20 text-charcoal-muted hover:text-accent transition-colors"
            title="View Order Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Dedicated Full Page View: Order Details
  if (pageView === 'details' && selectedOrder) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-[#101725] text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Orders Queue</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast('Kitchen Dispatch', `KOT #${selectedOrder.orderNumber} sent to Chef Line.`, 'success');
              }}
              className="px-3.5 py-2 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold text-primary dark:text-white flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print KOT Ticket</span>
            </button>
            <button
              onClick={() => {
                setBillOrder(selectedOrder);
                setPageView('bill');
              }}
              className="px-4 py-2 rounded-xl bg-accent text-white dark:text-primary-950 text-xs font-bold shadow-gold flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Create Bill</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#101725]/90 backdrop-blur-xl border border-accent/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 dark:border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Placed at {selectedOrder.orderTime || 'Today'} • {selectedOrder.orderType}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-serif font-bold text-2xl text-accent">
                ${(selectedOrder.totalAmount || 0).toLocaleString()}
              </span>
              <p className="text-xs text-charcoal-muted dark:text-gray-400">
                Payment: {selectedOrder.paymentStatus || 'Pending'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-ivory/60 dark:bg-white/5 border border-border/60 dark:border-white/10 text-xs">
            <div>
              <p className="text-charcoal-muted font-medium">Guest Name</p>
              <p className="font-bold text-primary dark:text-white text-sm mt-0.5">{selectedOrder.guestName}</p>
            </div>
            <div>
              <p className="text-charcoal-muted font-medium">Destination</p>
              <p className="font-bold text-accent text-sm mt-0.5">
                {selectedOrder.roomNumber ? `Suite ${selectedOrder.roomNumber}` : selectedOrder.tableNumber || 'Main Salon'}
              </p>
            </div>
            <div>
              <p className="text-charcoal-muted font-medium">Order Type</p>
              <p className="font-bold text-primary dark:text-white text-sm mt-0.5">{selectedOrder.orderType}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
              Course Selections & Portions
            </h4>
            <div className="rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden divide-y divide-border/60 dark:divide-white/5">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white/50 dark:bg-[#121926]/50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-accent/15 text-accent font-mono font-bold flex items-center justify-center text-xs">
                      {item.quantity}
                    </span>
                    <div>
                      <p className="font-semibold text-primary dark:text-white">{item.name}</p>
                      {item.notes && <p className="text-[11px] text-accent italic">{item.notes}</p>}
                    </div>
                  </div>
                  <span className="font-serif font-bold text-primary dark:text-white">
                    ${(item.price || 0) * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {selectedOrder.specialInstructions && (
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-xs space-y-1">
              <span className="font-bold text-accent font-mono uppercase tracking-wider text-[11px]">
                Special Guest Instructions:
              </span>
              <p className="text-primary dark:text-gray-300">{selectedOrder.specialInstructions}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-border/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleCancel(selectedOrder.orderNumber || selectedOrder.id)}
              className="px-4 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 text-xs font-semibold flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>

            <div className="flex items-center gap-2">
              {selectedOrder.status !== 'Served' && selectedOrder.status !== 'Completed' && (
                <button
                  onClick={() => {
                    handleQuickStatus(selectedOrder.orderNumber || selectedOrder.id, 'Served');
                    setPageView('list');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Mark as Served to Table / Suite
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dedicated Full Page View: Billing & Payment
  if (pageView === 'bill' && billOrder) {
    const subtotal = billOrder.subtotal || billOrder.totalAmount || 0;
    const tax = Math.round(subtotal * 0.10);
    const serviceCharge = Math.round(subtotal * 0.05);
    const total = Math.max(0, subtotal - discount + tax + serviceCharge);

    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageView('list')}
            className="p-2.5 rounded-xl border border-border/80 dark:border-white/10 hover:border-accent bg-white dark:bg-[#101725] text-primary dark:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>Back to Orders</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#101725]/90 backdrop-blur-xl border border-accent/30 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 dark:border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-gold shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
                  Gastronomic Settlement Dossier
                </h2>
                <p className="text-xs text-charcoal-muted dark:text-gray-400">
                  Billing for Order #{billOrder.orderNumber} • {billOrder.guestName}
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast('Printing Receipt', `Printed official receipt for Order #${billOrder.orderNumber}.`, 'info')}
              className="px-3.5 py-2 rounded-xl border border-border/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-semibold text-primary dark:text-white flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Guest Check</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                Order Summary
              </h4>
              <div className="rounded-2xl border border-border/80 dark:border-white/10 p-4 space-y-2 bg-ivory/40 dark:bg-white/5">
                {billOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-primary dark:text-white">{it.quantity}x {it.name}</span>
                    <span className="font-mono font-semibold">${(it.price || 0) * (it.quantity || 1)}</span>
                  </div>
                ))}
                <div className="border-t border-border/60 dark:border-white/10 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Subtotal:</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>VAT / Luxury Tax (10%):</span>
                    <span>${tax}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Service Gratuity (5%):</span>
                    <span>${serviceCharge}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-rose-500 font-semibold">
                      <span>VIP Privilege Discount:</span>
                      <span>-${discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-serif font-bold text-accent pt-2 border-t border-border/60 dark:border-white/10">
                    <span>Total Due:</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-muted">
                Settlement Channel
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                    Privilege Discount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                    Settlement Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/50 dark:bg-white/5 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Credit Card (Visa/Mastercard)">Credit Card (Visa / Mastercard)</option>
                    <option value="American Express Centurion">American Express Centurion</option>
                    <option value="Cash Settlement">Cash Currency</option>
                    <option value="Direct Charge to Suite Folio">Direct Charge to Suite Folio</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full py-3 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 font-bold text-xs shadow-gold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Settle Bill Now (${total})</span>
                </button>

                <button
                  type="button"
                  onClick={handleChargeToFolio}
                  className="w-full py-2.5 rounded-xl border border-accent/40 hover:bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <BedDouble className="w-4 h-4" />
                  <span>Charge Directly to Guest Suite Folio</span>
                </button>
              </div>
            </div>
          </div>
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
              Food & Dining Orders
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              Live Kitchen Queue
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Real-time culinary order flow, line-cook dispatch, and table service status.
          </p>
        </div>

        <button
          onClick={() => navigate('/hotel-admin/restaurant/order')}
          className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Food Order</span>
        </button>
      </div>



      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RestaurantStatCard
          title="Total Orders"
          value={totalOrders}
          subtitle="Orders placed today"
          icon={ChefHat}
        />
        <RestaurantStatCard
          title="Active in Kitchen"
          value={activeOrders}
          subtitle="Pending preparation & live"
          icon={Clock}
        />
        <RestaurantStatCard
          title="Completed & Served"
          value={completedOrders}
          subtitle="Delivered to guests"
          icon={CheckCircle}
        />
        <RestaurantStatCard
          title="Culinary Revenue"
          value={`$${totalDiningRevenue.toLocaleString()}`}
          subtitle="Gross dining tariffs"
          icon={Receipt}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <RestaurantSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by order #, guest, suite or table..."
        />

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-[#121926] border border-border/80 dark:border-white/10 text-xs text-primary dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Service Types</option>
            <option value="Dine-in">Dine-in Salon</option>
            <option value="Room Service">In-Suite Dining</option>
            <option value="Poolside">Pool & Riviera</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_FILTERS.map(st => {
          const isSelected = selectedStatus === st;
          const count =
            st === 'all'
              ? totalOrders
              : restaurantOrders.filter(o => o.status === st || (st === 'Pending' && o.status === 'New')).length;

          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-accent text-white dark:text-primary-950 border-accent shadow-sm'
                  : 'bg-white/60 dark:bg-[#121926] border-border/80 dark:border-white/10 text-charcoal-muted hover:text-primary dark:hover:text-white'
              }`}
            >
              <span>{st === 'all' ? 'All Orders' : st}</span>
              <span
                className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/30 dark:bg-black/30 font-bold' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Data Table */}
      <RestaurantDataTable
        columns={columns}
        data={filteredOrders}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        emptyTitle="No orders match your filter"
        emptyDescription="All dining orders are fulfilled or none have been placed yet."
        emptyActionLabel="Create New Order"
        onEmptyAction={() => navigate('/hotel-admin/restaurant/order')}
      />
    </div>
  );
};

export default FoodOrdersPage;
