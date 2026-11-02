import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  DollarSign,
  Clock,
  CheckCircle,
  Grid,
  TrendingUp,
  Plus,
  ArrowRight,
  Eye,
  FileText,
  Wine,
  Sparkles,
  Users
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  RestaurantStatCard,
  RestaurantNavTabs,
  OrderStatusBadge,
  TableStatusBadge,
  FoodOrderDetailsModal,
  RestaurantBillModal,
} from '../../../components/restaurant';

export const RestaurantDashboardPage = () => {
  const navigate = useNavigate();
  const {
    restaurantOrders = [],
    restaurantTables = [],
    menuItems = [],
    menuCategories = [],
    restaurantBills = [],
  } = useERP();
  const { showToast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [billOrder, setBillOrder] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Computations
  const totalRevenue = restaurantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = restaurantOrders.filter(
    o => o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Ready' || o.status === 'New' || o.status === 'Pending'
  ).length;
  const pendingOrders = restaurantOrders.filter(o => o.status === 'Pending' || o.status === 'New').length;
  const completedOrders = restaurantOrders.filter(o => o.status === 'Completed' || o.status === 'Served').length;

  const totalTables = restaurantTables.length;
  const availableTables = restaurantTables.filter(t => t.status === 'Available').length;
  const occupiedTables = restaurantTables.filter(t => t.status === 'Occupied').length;
  const reservedTables = restaurantTables.filter(t => t.status === 'Reserved').length;

  const recentOrders = restaurantOrders.slice(0, 6);
  const popularDishes = menuItems.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Restaurant & Dining Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
              3 Michelin Stars
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400">
            Lazfort Palace Monte-Carlo — Haute Gastronomy, In-Suite Banquets & POS Settlement
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => navigate('/hotel-admin/restaurant/orders')}
            className="px-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:border-accent text-xs font-semibold text-primary dark:text-white flex items-center gap-2 transition-all shadow-sm"
          >
            <Clock className="w-4 h-4 text-accent" />
            <span>Kitchen Queue</span>
          </button>
          <button
            onClick={() => navigate('/hotel-admin/restaurant/order')}
            className="px-4 py-2.5 rounded-xl bg-accent hover:opacity-95 text-white dark:text-primary-950 text-xs font-semibold shadow-gold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Dining Order</span>
          </button>
        </div>
      </div>



      {/* Executive KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RestaurantStatCard
          title="Total Dining Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle="Food, Grand Cru & Room Service"
          change="+18.4% vs last period"
          isPositive={true}
          icon={DollarSign}
        />
        <RestaurantStatCard
          title="Active Live Orders"
          value={activeOrders}
          subtitle={`${pendingOrders} awaiting chef approval`}
          change="Real-time kitchen queue"
          isPositive={true}
          icon={Clock}
          badgeText="Active"
        />
        <RestaurantStatCard
          title="Table Occupancy"
          value={`${occupiedTables} / ${totalTables}`}
          subtitle={`${availableTables} available • ${reservedTables} reserved`}
          change={`${Math.round((occupiedTables / Math.max(1, totalTables)) * 100)}% Occupied`}
          isPositive={occupiedTables < totalTables}
          icon={Grid}
        />
        <RestaurantStatCard
          title="Completed Turnovers"
          value={completedOrders}
          subtitle="Orders delivered today"
          change="99.4% Fulfillment"
          isPositive={true}
          icon={CheckCircle}
        />
      </div>

      {/* Two Column Layout: Recent Orders + Floor Status & Popular Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders Live Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Recent Culinary Orders</span>
            </h3>
            <button
              onClick={() => navigate('/hotel-admin/restaurant/orders')}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl overflow-hidden divide-y divide-border/60 dark:divide-white/5 shadow-sm">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-muted">
                No active food orders in queue.
              </div>
            ) : (
              recentOrders.map(order => (
                <div
                  key={order.id || order.orderNumber}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent/[0.02] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-accent">
                        #{order.orderNumber}
                      </span>
                      <OrderStatusBadge status={order.status} size="sm" />
                      <span className="text-[11px] text-charcoal-muted dark:text-gray-400">
                        {order.orderType}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary dark:text-white">
                      {order.guestName} •{' '}
                      <span className="text-charcoal-muted font-normal">
                        {order.roomNumber ? `Suite ${order.roomNumber}` : order.tableNumber || 'Main Dining'}
                      </span>
                    </p>
                    <p className="text-[11px] text-charcoal-muted dark:text-gray-400 truncate max-w-md">
                      {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Chef Tasting Menu'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <p className="font-serif font-bold text-accent text-sm">
                        ${(order.totalAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        {order.paymentStatus || 'Pending'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-ivory dark:bg-white/5 hover:bg-accent/20 text-charcoal-muted hover:text-accent border border-border/70 dark:border-white/10 transition-colors"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Floor Table Status & Signature Creations */}
        <div className="space-y-6">
          {/* Floor Tables Status Snapshot */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-accent" />
                <span>Floor Map Snapshot</span>
              </h3>
              <button
                onClick={() => navigate('/hotel-admin/restaurant/tables')}
                className="text-xs text-accent hover:underline font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {restaurantTables.slice(0, 9).map(tbl => (
                <div
                  key={tbl.id}
                  onClick={() => navigate('/hotel-admin/restaurant/tables')}
                  className="p-2.5 rounded-xl border border-border/60 dark:border-white/10 bg-ivory/40 dark:bg-white/[0.02] text-center cursor-pointer hover:border-accent transition-all"
                >
                  <p className="font-mono text-xs font-bold text-primary dark:text-white">{tbl.tableNumber}</p>
                  <p className="text-[10px] text-charcoal-muted">{tbl.capacity} Seats</p>
                  <div className="mt-1">
                    <TableStatusBadge status={tbl.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Menu Creations */}
          <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-white/80 dark:bg-[#101725]/90 backdrop-blur-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Signature Selections</span>
              </h3>
              <button
                onClick={() => navigate('/hotel-admin/restaurant/menu-items')}
                className="text-xs text-accent hover:underline font-semibold"
              >
                Full Menu
              </button>
            </div>

            <div className="space-y-3">
              {popularDishes.map(dish => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/[0.03] transition-colors"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-11 h-11 rounded-xl object-cover border border-border/60 shrink-0"
                    onError={e => {
                      e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-primary dark:text-white truncate">
                      {dish.name}
                    </p>
                    <p className="text-[11px] text-charcoal-muted dark:text-gray-400">
                      {dish.categoryName || 'Chef Choice'} • {dish.preparationTime}
                    </p>
                  </div>
                  <span className="font-serif font-bold text-xs text-accent shrink-0">
                    ${dish.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Food Order Details Modal */}
      <FoodOrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default RestaurantDashboardPage;

