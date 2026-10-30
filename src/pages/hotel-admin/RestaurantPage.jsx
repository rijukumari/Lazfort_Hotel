import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { UtensilsCrossed, Wine, Clock, Plus, CheckCircle, Trash2 } from 'lucide-react';

export const RestaurantPage = () => {
  const navigate = useNavigate();
  const { restaurantOrders, updateRestaurantOrderStatus, deleteRestaurantOrder } = useERP();
  const { showToast } = useToast();
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const totalSales = restaurantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleStatusChange = (orderId, newStatus) => {
    updateRestaurantOrderStatus(orderId, newStatus);
    showToast('Order Status Updated', `Order #${orderId} marked as ${newStatus}.`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!deleteOrderId) return;
    deleteRestaurantOrder(deleteOrderId);
    setDeleteOrderId(null);
    showToast('Order Cancelled', 'Dining order removed from queue.', 'success');
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order Ref',
      sortable: true,
      render: item => <span className="font-mono text-xs font-bold text-accent">{item.orderNumber}</span>,
    },
    {
      key: 'orderType',
      header: 'Type & Location',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-primary dark:text-white text-xs">
            {item.orderType}
          </span>
          <span className="text-[11px] text-accent block">
            {item.roomNumber ? `Suite ${item.roomNumber}` : item.tableNumber || 'Main Dining Room'}
          </span>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Michelin Selections',
      render: item => (
        <div className="text-xs space-y-0.5">
          {item.items?.map((it, i) => (
            <p key={i} className="text-charcoal/90 dark:text-gray-300">
              {it.quantity}x {it.name} (${it.unitPrice?.toLocaleString()})
            </p>
          ))}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total (Inc. Tax & Service)',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-accent text-xs">
          ${item.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Folio Posting',
      render: item => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
          item.paymentStatus === 'charged_to_room'
            ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
        }`}>
          {item.paymentStatus?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      sortable: true,
      render: item => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
          item.status === 'delivered'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {item.status !== 'delivered' && (
            <button
              onClick={() => handleStatusChange(item.id, 'delivered')}
              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-all text-xs flex items-center gap-1 font-semibold"
              title="Mark Order as Delivered"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Deliver</span>
            </button>
          )}
          <button
            onClick={() => setDeleteOrderId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all text-xs"
            title="Cancel / Remove Order"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Michelin Dining & In-Suite Gastronomy"
        description="Le Grand Colbert & Azure Terrace — Live culinary dispatch, sommelier cellar orders, KOT kitchen tickets, and automated guest folio charges."
        badge="Module E: Food & Beverage"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/hotel-admin/restaurant/order')}
          >
            New In-Suite Order
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="F&B Dining Revenue"
          value={`$${totalSales.toLocaleString()}`}
          change="Caviar & Vintage Cellar"
          isPositive={true}
          icon={Wine}
          subtitle="Direct & Folio Charges"
        />
        <StatCard
          title="Active Culinary Dispatches"
          value={restaurantOrders.length}
          change="Fine Dining Kitchen Live"
          isPositive={true}
          icon={UtensilsCrossed}
          subtitle="Le Grand Colbert 3★"
        />
        <StatCard
          title="Silver Cloche SLA"
          value="24 Mins"
          change="Butler Chauffeur Delivery"
          isPositive={true}
          icon={Clock}
          subtitle="White-Glove Standard"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
            Active Gastronomic Dispatches & Folio Postings
          </h3>
          <span className="text-xs text-charcoal-muted">All room charges synchronize live to Guest Folios</span>
        </div>
        <DataTable
          data={restaurantOrders}
          columns={columns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search dining orders by room number or items..."
        />
      </div>

      {/* Delete Confirmation */}
      {deleteOrderId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteOrderId(null)}
          onConfirm={handleConfirmDelete}
          title="Cancel Gastronomy Order?"
          message="Are you sure you want to cancel this order ticket? The kitchen dispatch will be notified immediately."
          confirmText="Confirm Cancel"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RestaurantPage;

