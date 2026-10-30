import React, { useState } from 'react';
import { PageHeader, StatCard, Modal, FormField, Select, Input, Button } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { mockMenuItems } from '../../data/mockERPData';
import { UtensilsCrossed, Wine, Clock, Plus } from 'lucide-react';

export const RestaurantPage = () => {
  const { restaurantOrders, submitRestaurantOrder, rooms } = useERP();
  const { showToast } = useToast();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(rooms.find(r => r.status === 'occupied')?.roomNumber || '101');
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(mockMenuItems[0].id);
  const [itemQuantity, setItemQuantity] = useState(1);

  const totalSales = restaurantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    const item = mockMenuItems.find(m => m.id === selectedMenuItemId) || mockMenuItems[0];

    const res = submitRestaurantOrder({
      outletName: 'Le Grand Colbert Haute Gastronomie',
      orderType: 'Room Service',
      roomNumber: selectedRoomNumber,
      paymentStatus: 'charged_to_room',
      items: [
        {
          menuItemId: item.id,
          name: item.name,
          quantity: itemQuantity,
          unitPrice: item.price,
        }
      ],
    });

    if (res?.success) {
      showToast('Order Placed', res.message, 'success');
      setIsOrderModalOpen(false);
    }
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
            onClick={() => setIsOrderModalOpen(true)}
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

      {/* Place In-Suite Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Dispatch In-Suite Fine Dining Order"
        subtitle="Post Michelin dining course directly to active Guest Folio"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
          <FormField label="Target Suite (Occupied Stays)" required>
            <Select
              value={selectedRoomNumber}
              onChange={e => setSelectedRoomNumber(e.target.value)}
            >
              {rooms.map(r => (
                <option key={r.id} value={r.roomNumber}>
                  Suite {r.roomNumber} — {r.type} ({(r.status || '').toUpperCase()})
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Michelin Signature Course" required>
            <Select
              value={selectedMenuItemId}
              onChange={e => setSelectedMenuItemId(e.target.value)}
            >
              {mockMenuItems.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.price.toLocaleString()} • {m.category})
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Portions / Quantity" required>
            <Input
              type="number"
              min={1}
              max={10}
              required
              value={itemQuantity}
              onChange={e => setItemQuantity(Number(e.target.value))}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOrderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
            >
              Transmit Order to Kitchen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantPage;

