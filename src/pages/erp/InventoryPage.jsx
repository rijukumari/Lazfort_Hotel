import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { ModalFooter } from '../../components/ui/ModalFooter';
import { FormField, Input, Select } from '../../components/forms/FormField';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { mockSuppliers } from '../../data/mockERPData';
import {
  Boxes,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Truck,
  CheckCircle,
  Building,
} from 'lucide-react';

export const InventoryPage = () => {
  const { inventoryItems = [], stockMovements = [], recordStockMovement, addInventoryItem, getLowStockItems } = useERP();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('catalog');
  const [suppliersList, setSuppliersList] = useState(mockSuppliers);

  // Modals state
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Movement Modal State
  const [selectedItemId, setSelectedItemId] = useState(inventoryItems[0]?.id || '');
  const [movementType, setMovementType] = useState('receipt');
  const [movementQty, setMovementQty] = useState(10);
  const [movementReason, setMovementReason] = useState('Stock restock delivery');

  // Add Item Modal State
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Guest Amenities');
  const [newItemDept, setNewItemDept] = useState('Housekeeping');
  const [newItemUom, setNewItemUom] = useState('Units');
  const [newItemCurrentStock, setNewItemCurrentStock] = useState(50);
  const [newItemMinStock, setNewItemMinStock] = useState(20);
  const [newItemUnitCost, setNewItemUnitCost] = useState(45);
  const [newItemSupplier, setNewItemSupplier] = useState(mockSuppliers[0]?.name || 'Petrossian Paris');
  const [newItemLocation, setNewItemLocation] = useState('Main Store Room Wing A');

  // Add Supplier Modal State
  const [newSupName, setNewSupName] = useState('');
  const [newSupCode, setNewSupCode] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupLeadTime, setNewSupLeadTime] = useState(3);
  const [newSupTerms, setNewSupTerms] = useState('Net 30');

  const lowStockList = getLowStockItems ? getLowStockItems() : [];
  const totalStockValuation = inventoryItems.reduce((sum, item) => sum + (item.currentStock || 0) * (item.unitCost || 0), 0);

  const handleOpenMovementModal = (item, defaultType = 'receipt') => {
    if (item) setSelectedItemId(item.id);
    setMovementType(defaultType);
    setMovementQty(10);
    setMovementReason(defaultType === 'receipt' ? 'Supplier shipment delivery' : 'Internal departmental issue');
    setIsMovementModalOpen(true);
  };

  const handleMovementSubmit = async e => {
    e.preventDefault();
    const targetItem = inventoryItems.find(i => i.id === selectedItemId);
    if (!targetItem || movementQty <= 0) {
      showToast('Validation Error', 'Please select an item and valid quantity.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const previousStock = targetItem.currentStock || 0;
      const newStock = movementType === 'receipt' ? previousStock + movementQty : Math.max(0, previousStock - movementQty);

      const res = recordStockMovement({
        itemId: targetItem.id,
        itemName: targetItem.name,
        sku: targetItem.sku,
        type: movementType,
        quantity: movementQty,
        previousStock,
        newStock,
        unitCost: targetItem.unitCost,
        totalValue: movementQty * targetItem.unitCost,
        reason: movementReason,
        department: targetItem.department,
        performedBy: 'Inventory Controller',
      });

      if (res?.success) {
        showToast('Stock Ledger Updated', res.message, 'success');
        setIsMovementModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItemSubmit = async e => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemSku.trim()) {
      showToast('Validation Error', 'Item Name and SKU are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const res = addInventoryItem({
        sku: newItemSku.toUpperCase().trim(),
        name: newItemName.trim(),
        category: newItemCategory,
        department: newItemDept,
        unitOfMeasure: newItemUom,
        currentStock: Number(newItemCurrentStock),
        minimumStock: Number(newItemMinStock),
        reorderPoint: Number(newItemMinStock) + 10,
        unitCost: Number(newItemUnitCost),
        supplierId: 'sup-custom',
        supplierName: newItemSupplier,
        location: newItemLocation,
      });

      if (res?.success) {
        showToast('Item Registered', res.message, 'success');
        setIsAddItemModalOpen(false);
        setNewItemName('');
        setNewItemSku('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSupplierSubmit = async e => {
    e.preventDefault();
    if (!newSupName.trim()) {
      showToast('Validation Error', 'Supplier Name is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const newSupplier = {
        id: `sup-${Date.now()}`,
        name: newSupName.trim(),
        code: newSupCode.trim() || `SUP-${newSupName.slice(0, 3).toUpperCase()}-MC`,
        contactPerson: newSupContact.trim() || 'Procurement Agent',
        email: newSupEmail.trim() || 'vendor@luxurygoods.com',
        phone: newSupPhone.trim() || '+377 98 00 22 11',
        categories: ['Food & Beverage', 'Guest Amenities'],
        leadTimeDays: Number(newSupLeadTime),
        rating: 5.0,
        paymentTerms: newSupTerms,
        status: 'active',
      };

      setSuppliersList(prev => [newSupplier, ...prev]);
      showToast('Supplier Onboarded', `${newSupplier.name} added to approved vendors.`, 'success');
      setIsAddSupplierModalOpen(false);
      setNewSupName('');
      setNewSupCode('');
      setNewSupContact('');
      setNewSupEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Columns for Catalog
  const itemColumns = [
    {
      key: 'sku',
      header: 'SKU Code',
      sortable: true,
      render: item => <span className="font-mono text-xs font-bold text-accent">{item.sku}</span>,
    },
    {
      key: 'name',
      header: 'Item & Department',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight font-serif">{item.name}</p>
          <span className="text-[11px] text-charcoal-muted dark:text-gray-400">{item.department} • {item.location}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: item => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-ivory dark:bg-white/5 border border-border/80 dark:border-white/10">
          {item.category}
        </span>
      ),
    },
    {
      key: 'currentStock',
      header: 'Stock Level',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs font-bold ${
            item.currentStock <= item.minimumStock ? 'text-rose-600 dark:text-rose-400' : 'text-primary dark:text-white'
          }`}>
            {item.currentStock} {item.unitOfMeasure}
          </span>
          {item.currentStock <= item.minimumStock && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
              <AlertTriangle className="w-3 h-3" />
              Low
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'unitCost',
      header: 'Unit Cost ($)',
      sortable: true,
      render: item => <span className="font-mono text-xs font-semibold">${item.unitCost?.toLocaleString()}</span>,
    },
    {
      key: 'supplierName',
      header: 'Primary Supplier',
      render: item => <span className="text-xs text-charcoal/80 dark:text-gray-300">{item.supplierName}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenMovementModal(item, 'receipt')}
            className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-all text-xs flex items-center gap-1"
            title="Receive Stock"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            Receive
          </button>
          <button
            onClick={() => handleOpenMovementModal(item, 'issue')}
            className="p-1.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-all text-xs flex items-center gap-1"
            title="Issue Stock to Dept"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Issue
          </button>
        </div>
      ),
    },
  ];

  // Columns for Stock Movements
  const movementColumns = [
    {
      key: 'timestamp',
      header: 'Date & Time',
      sortable: true,
      render: m => <span className="font-mono text-xs">{m.timestamp?.slice(0, 16).replace('T', ' ')}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: m => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
          m.type === 'receipt'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
        }`}>
          {m.type}
        </span>
      ),
    },
    {
      key: 'itemName',
      header: 'SKU & Item',
      render: m => (
        <div>
          <p className="font-semibold text-xs text-primary dark:text-white leading-tight">{m.itemName}</p>
          <span className="text-[10px] font-mono text-accent">{m.sku}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity Transacted',
      render: m => (
        <span className={`font-mono text-xs font-bold ${
          m.type === 'receipt' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}>
          {m.type === 'receipt' ? '+' : '-'}{m.quantity}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reference / Reason',
      render: m => <span className="text-xs text-charcoal-muted">{m.reason}</span>,
    },
    {
      key: 'performedBy',
      header: 'Operator',
      render: m => <span className="text-xs font-mono">{m.performedBy}</span>,
    },
  ];

  // Columns for Suppliers
  const supplierColumns = [
    {
      key: 'code',
      header: 'Vendor Code',
      render: s => <span className="font-mono text-xs font-bold text-accent">{s.code}</span>,
    },
    {
      key: 'name',
      header: 'Supplier / Purveyor',
      render: s => (
        <div>
          <p className="font-semibold text-xs text-primary dark:text-white leading-tight font-serif">{s.name}</p>
          <span className="text-[11px] text-charcoal-muted">{s.contactPerson} • {s.email}</span>
        </div>
      ),
    },
    {
      key: 'leadTimeDays',
      header: 'Lead Time',
      render: s => <span className="font-mono text-xs">{s.leadTimeDays} Business Days</span>,
    },
    {
      key: 'paymentTerms',
      header: 'Terms',
      render: s => (
        <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-ivory dark:bg-white/5 border border-border/80">
          {s.paymentTerms}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Vendor Rating',
      render: s => <span className="text-xs font-bold text-accent font-mono">★ {s.rating}</span>,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Inventory & Central Stores Command"
        description="Lazfort ERP — Real-time luxury provisions, F&B ingredients, Egyptian linens, amenity reserves, and automated stock movements."
        badge="Module F: Inventory & Procurement"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddSupplierModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 cursor-pointer"
            >
              <Building className="w-4 h-4 text-accent" />
              Add Supplier
            </button>

            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200 cursor-pointer"
            >
              <Boxes className="w-4 h-4 text-accent" />
              Add Item
            </button>

            <button
              onClick={() => handleOpenMovementModal(undefined, 'receipt')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-950 text-xs font-bold uppercase tracking-wider btn-3d shadow-md shadow-accent/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Record Stock Receipt
            </button>
          </div>
        }
      />

      {/* Stats Grid */}
      <StatsGrid columns={4}>
        <StatCard
          title="Total SKUs In Store"
          value={inventoryItems.length}
          change="All Departments Tracked"
          isPositive={true}
          iconName="Boxes"
          subtitle="Monaco Main Depot"
        />
        <StatCard
          title="Total Stock Valuation"
          value={`$${totalStockValuation.toLocaleString()}`}
          change="Asset Ledger Reconciled"
          isPositive={true}
          iconName="Truck"
          subtitle="Average Cost Basis"
        />
        <StatCard
          title="Low Stock Threshold Alerts"
          value={lowStockList.length}
          change={lowStockList.length > 0 ? "Reorder Urgently" : "All Par Levels Met"}
          isPositive={lowStockList.length === 0}
          iconName="AlertTriangle"
          subtitle="Below Par Level"
        />
        <StatCard
          title="Audited Stock Movements"
          value={stockMovements.length}
          change="Immutable Ledger"
          isPositive={true}
          iconName="FileSpreadsheet"
          subtitle="Audit Trail Active"
        />
      </StatsGrid>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'catalog', label: 'Item Inventory Catalog', count: inventoryItems.length },
          { id: 'alerts', label: 'Low Stock Alerts', count: lowStockList.length },
          { id: 'movements', label: 'Stock Movement Audit', count: stockMovements.length },
          { id: 'suppliers', label: 'Approved Suppliers', count: suppliersList.length },
        ]}
        activeTab={activeTab}
        onChange={tabId => setActiveTab(tabId)}
      />

      {/* Tab Panels */}
      {activeTab === 'catalog' && (
        <DataTable
          data={inventoryItems}
          columns={itemColumns}
          keyExtractor={i => i.id}
          searchPlaceholder="Search inventory by SKU, item name, or department..."
        />
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {lowStockList.length === 0 ? (
            <div className="card-luxury p-8 text-center text-sm text-charcoal-muted">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All inventory items are currently above their required safety stock levels.
            </div>
          ) : (
            <DataTable
              data={lowStockList}
              columns={itemColumns}
              keyExtractor={i => i.id}
              searchPlaceholder="Search low stock items..."
            />
          )}
        </div>
      )}

      {activeTab === 'movements' && (
        <DataTable
          data={stockMovements}
          columns={movementColumns}
          keyExtractor={m => m.id}
          searchPlaceholder="Search movement history by item, reason, or operator..."
        />
      )}

      {activeTab === 'suppliers' && (
        <DataTable
          data={suppliersList}
          columns={supplierColumns}
          keyExtractor={s => s.id}
          searchPlaceholder="Search suppliers by name or vendor code..."
        />
      )}

      {/* Stock Movement Modal */}
      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsMovementModalOpen(false);
        }}
        title="Record Stock Movement & Goods Ledger"
        description="Post inventory receipt from supplier or issue to operating department"
        maxWidth="lg"
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleMovementSubmit} className="space-y-4">
          <FormField label="Target Item" required>
            <Select
              value={selectedItemId}
              onChange={e => setSelectedItemId(e.target.value)}
              options={inventoryItems.map(item => ({
                value: item.id,
                label: `${item.sku} — ${item.name} (${item.currentStock} ${item.unitOfMeasure} available)`,
              }))}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Transaction Type" required>
              <Select
                value={movementType}
                onChange={e => setMovementType(e.target.value)}
                options={[
                  { value: 'receipt', label: 'Receipt (+ Inbound Delivery)' },
                  { value: 'issue', label: 'Issue (- Outbound to Dept)' },
                  { value: 'adjustment', label: 'Audit Adjustment' },
                ]}
              />
            </FormField>

            <FormField label="Quantity" required>
              <Input
                type="number"
                min={1}
                required
                value={movementQty}
                onChange={e => setMovementQty(Number(e.target.value))}
              />
            </FormField>
          </div>

          <FormField label="Reason & Operational Reference" required>
            <Input
              type="text"
              required
              value={movementReason}
              onChange={e => setMovementReason(e.target.value)}
              placeholder="e.g. Inbound PO delivery / VIP Gala Provision"
            />
          </FormField>

          <ModalFooter
            onCancel={() => setIsMovementModalOpen(false)}
            cancelText="Cancel"
            confirmText="Record Movement"
            confirmVariant="gold"
            isSubmitting={isSubmitting}
          />
        </form>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsAddItemModalOpen(false);
        }}
        title="Add Inventory Item"
        description="Catalog a new product SKU into central hotel stores."
        maxWidth="lg"
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleAddItemSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="SKU Code" required hint="e.g. AMN-BULG-01">
              <Input
                required
                placeholder="SKU-XXX-01"
                value={newItemSku}
                onChange={e => setNewItemSku(e.target.value)}
              />
            </FormField>

            <FormField label="Item Name" required>
              <Input
                required
                placeholder="e.g. Bulgari White Tea Body Milk 75ml"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category" required>
              <Select
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value)}
              >
                <option value="Guest Amenities">Guest Amenities</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Housekeeping & Linen">Housekeeping & Linen</option>
                <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                <option value="Fine Wine & Spirits">Fine Wine & Spirits</option>
                <option value="Office & Stationery">Office & Stationery</option>
              </Select>
            </FormField>

            <FormField label="Department" required>
              <Input
                required
                value={newItemDept}
                onChange={e => setNewItemDept(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Current Stock" required>
              <Input
                type="number"
                min="0"
                value={newItemCurrentStock}
                onChange={e => setNewItemCurrentStock(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Min Par Level" required>
              <Input
                type="number"
                min="1"
                value={newItemMinStock}
                onChange={e => setNewItemMinStock(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Unit Cost ($)" required>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newItemUnitCost}
                onChange={e => setNewItemUnitCost(Number(e.target.value))}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Unit of Measure" required>
              <Select
                value={newItemUom}
                onChange={e => setNewItemUom(e.target.value)}
              >
                <option value="Units">Units</option>
                <option value="Boxes">Boxes</option>
                <option value="Bottles">Bottles</option>
                <option value="Kg">Kg</option>
                <option value="Liters">Liters</option>
                <option value="Sets">Sets</option>
              </Select>
            </FormField>

            <FormField label="Primary Supplier">
              <Select
                value={newItemSupplier}
                onChange={e => setNewItemSupplier(e.target.value)}
              >
                {suppliersList.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Storage Depot / Location">
            <Input
              value={newItemLocation}
              onChange={e => setNewItemLocation(e.target.value)}
            />
          </FormField>

          <ModalFooter
            onCancel={() => setIsAddItemModalOpen(false)}
            cancelText="Cancel"
            confirmText="Catalog Inventory Item"
            confirmVariant="gold"
            isSubmitting={isSubmitting}
          />
        </form>
      </Modal>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddSupplierModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsAddSupplierModalOpen(false);
        }}
        title="Onboard Approved Purveyor / Supplier"
        description="Register a verified vendor into the luxury supply chain."
        maxWidth="lg"
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleAddSupplierSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Vendor Name" required>
              <Input
                required
                placeholder="e.g. Domaine de la Romanée-Conti"
                value={newSupName}
                onChange={e => setNewSupName(e.target.value)}
              />
            </FormField>

            <FormField label="Vendor Code" hint="Leave blank to auto-generate">
              <Input
                placeholder="SUP-DRC-FR"
                value={newSupCode}
                onChange={e => setNewSupCode(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contact Person">
              <Input
                placeholder="e.g. Bertrand de Villaine"
                value={newSupContact}
                onChange={e => setNewSupContact(e.target.value)}
              />
            </FormField>

            <FormField label="Official Email">
              <Input
                type="email"
                placeholder="orders@romanee-conti.fr"
                value={newSupEmail}
                onChange={e => setNewSupEmail(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Lead Time (Days)">
              <Input
                type="number"
                min="1"
                value={newSupLeadTime}
                onChange={e => setNewSupLeadTime(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Commercial Payment Terms">
              <Select
                value={newSupTerms}
                onChange={e => setNewSupTerms(e.target.value)}
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 15">Net 15</option>
                <option value="Immediate">Immediate</option>
                <option value="Net 60">Net 60</option>
              </Select>
            </FormField>
          </div>

          <ModalFooter
            onCancel={() => setIsAddSupplierModalOpen(false)}
            cancelText="Cancel"
            confirmText="Approve Supplier"
            confirmVariant="gold"
            isSubmitting={isSubmitting}
          />
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;

