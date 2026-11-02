import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  PackagePlus,
  RefreshCw,
  Sliders,
  CheckCircle,
  Eye,
  Boxes,
  Zap,
  CheckCheck,
  Edit2,
  DollarSign,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  InventoryStatCard,
  InventoryNavTabs,
  InventorySearch,
  InventoryFilters,
  InventoryDataTable,
  InventoryStatusBadge,
  StockReceiptModal,
  AddEditItemModal,
} from '../../../components/inventory';

export const LowStockAlertsPage = () => {
  const {
    inventoryItems = [],
    recordStockMovement,
    updateItemMinStock,
    createInventoryReorder,
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL', 'critical', 'low_stock', 'out_of_stock'
  const [reorderItem, setReorderItem] = useState(null);
  const [editingMinItem, setEditingMinItem] = useState(null);
  const [minStockValue, setMinStockValue] = useState(10);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [viewItem, setViewItem] = useState(null);

  // Compute all alert items dynamically based on actual stock & minimum levels
  const allLowStockItems = useMemo(() => {
    return inventoryItems
      .filter(item => {
        const current = Number(item.currentStock ?? item.availableQuantity ?? 0);
        const min = Number(item.minimumStock ?? item.minStock ?? 10);
        return current <= min || item.status === 'low_stock' || item.status === 'out_of_stock';
      })
      .map(item => {
        const current = Number(item.currentStock ?? item.availableQuantity ?? 0);
        const min = Number(item.minimumStock ?? item.minStock ?? 10);
        const requiredQty = Math.max(min * 2 - current, min - current, 15);

        let priority = 'Moderate';
        let priorityKey = 'low_stock';
        if (current === 0) {
          priority = 'Critical';
          priorityKey = 'out_of_stock';
        } else if (current <= Math.floor(min / 2)) {
          priority = 'High';
          priorityKey = 'critical';
        }

        return {
          ...item,
          currentStock: current,
          minimumStock: min,
          requiredQuantity: requiredQty,
          priority,
          priorityKey,
        };
      });
  }, [inventoryItems]);

  // Overall metric counts
  const totalLowStock = allLowStockItems.length;
  const criticalItemsCount = allLowStockItems.filter(i => i.priority === 'Critical' || i.currentStock === 0).length;
  const outOfStockCount = allLowStockItems.filter(i => i.currentStock === 0).length;
  const reorderRequiredCount = allLowStockItems.filter(i => !resolvedIds.has(i.id)).length;
  const pendingReordersCount = allLowStockItems.filter(i => i.priority === 'Critical' || i.priority === 'High').length;

  // Filtered list
  const filteredAlerts = useMemo(() => {
    return allLowStockItems.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const code = (item.sku || item.itemCode || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const sup = (item.supplierName || item.supplier || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();

      const matchesSearch = !q || code.includes(q) || name.includes(q) || sup.includes(q) || cat.includes(q);

      let matchesPriority = true;
      if (priorityFilter === 'critical') {
        matchesPriority = item.priority === 'Critical' || item.priority === 'High';
      } else if (priorityFilter === 'out_of_stock') {
        matchesPriority = item.currentStock === 0;
      } else if (priorityFilter === 'low_stock') {
        matchesPriority = item.currentStock > 0;
      }

      return matchesSearch && matchesPriority;
    });
  }, [allLowStockItems, searchQuery, priorityFilter]);

  // Handle Expedited Reorder
  const handleCreateReorder = (item) => {
    const res = createInventoryReorder(item.id, item.requiredQuantity);
    if (res.success) {
      showToast('Reorder Dispatched', `Generated replenishment for ${item.name} (${item.requiredQuantity} units).`, 'success');
    } else {
      showToast('Error', res.message, 'error');
    }
  };

  // Handle Mark Resolved
  const handleToggleResolved = (itemId) => {
    setResolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        showToast('Alert Reopened', 'SKU alert marked as active.', 'info');
      } else {
        next.add(itemId);
        showToast('Alert Resolved', 'Threshold alert dismissed from active queue.', 'success');
      }
      return next;
    });
  };

  // Handle Edit Min Stock
  const handleSaveMinStock = (e) => {
    e.preventDefault();
    if (!editingMinItem) return;
    updateItemMinStock(editingMinItem.id, minStockValue);
    showToast('Threshold Updated', `Minimum stock level set to ${minStockValue}.`, 'success');
    setEditingMinItem(null);
  };

  // Table columns per Section 2 requirements
  const columns = [
    {
      key: 'sku',
      header: 'Item Code',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs font-bold text-accent">
          {row.sku || row.itemCode}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Item Name',
      sortable: true,
      render: row => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{row.name}</p>
          <span className="text-[10px] text-charcoal-muted">{row.location || 'Central Stores Vault'}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: row => (
        <span className="px-2 py-0.5 rounded-md bg-ivory dark:bg-white/5 border border-border/80 dark:border-white/10 text-[11px] font-medium">
          {row.category || 'General'}
        </span>
      ),
    },
    {
      key: 'currentStock',
      header: 'Current Stock',
      sortable: true,
      render: row => {
        const isZero = row.currentStock === 0;
        return (
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className={`font-bold text-xs ${
                isZero ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {row.currentStock} {row.unitOfMeasure || 'Units'}
            </span>
            {isZero && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
          </div>
        );
      },
    },
    {
      key: 'minimumStock',
      header: 'Min Stock Level',
      sortable: true,
      render: row => (
        <div className="flex items-center gap-1 font-mono text-xs text-charcoal-muted">
          <span>{row.minimumStock}</span>
          <button
            onClick={() => {
              setEditingMinItem(row);
              setMinStockValue(row.minimumStock);
            }}
            className="p-1 text-charcoal-muted hover:text-accent rounded"
            title="Edit Minimum Stock Level"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
    {
      key: 'requiredQuantity',
      header: 'Required Qty',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          +{row.requiredQuantity}
        </span>
      ),
    },
    {
      key: 'supplierName',
      header: 'Supplier',
      sortable: true,
      render: row => (
        <span className="text-xs text-charcoal-muted dark:text-gray-300 font-medium truncate max-w-[130px] block">
          {row.supplierName || row.supplier || 'Approved Purveyor'}
        </span>
      ),
    },
    {
      key: 'lastRestockedDate',
      header: 'Last Restock Date',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs text-charcoal-muted">
          {row.lastRestockedDate || '2026-10-15'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Alert Priority',
      sortable: true,
      render: row => {
        const isResolved = resolvedIds.has(row.id);
        if (isResolved) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
              <CheckCheck className="w-3 h-3" /> Resolved
            </span>
          );
        }
        return <InventoryStatusBadge status={row.priority} />;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: row => {
        const isResolved = resolvedIds.has(row.id);
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => handleCreateReorder(row)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1"
              title="Instantly trigger replenishment stock receipt"
            >
              <Zap className="w-3 h-3" />
              <span>Reorder</span>
            </button>
            <button
              onClick={() => setReorderItem(row)}
              className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
              title="Update / Receive Custom Stock"
            >
              <PackagePlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleResolved(row.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isResolved
                  ? 'text-emerald-600 bg-emerald-500/15'
                  : 'text-charcoal-muted hover:text-emerald-500 hover:bg-emerald-500/10'
              }`}
              title={isResolved ? 'Re-open alert' : 'Mark alert as resolved'}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Low Stock & Threshold Alerts
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                totalLowStock > 0
                  ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
              }`}
            >
              {totalLowStock > 0 ? `${totalLowStock} Depleted Items` : 'All Thresholds Optimal'}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
            Real-time proactive monitoring: automatically detects SKUs below buffer thresholds and generates replenishment orders.
          </p>
        </div>
      </div>



      {/* 5 Key Metric Cards per Section 2 Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InventoryStatCard
          title="Total Low Stock Items"
          value={totalLowStock}
          subtitle="Items at or below safety buffer"
          icon={AlertTriangle}
          color={totalLowStock > 0 ? 'amber' : 'emerald'}
        />
        <InventoryStatCard
          title="Critical Stock Items"
          value={criticalItemsCount}
          subtitle="Severely depleted reserves"
          icon={Zap}
          color="rose"
        />
        <InventoryStatCard
          title="Out of Stock Items"
          value={outOfStockCount}
          subtitle="Zero units on shelf"
          icon={Boxes}
          color="rose"
        />
        <InventoryStatCard
          title="Reorders Required"
          value={reorderRequiredCount}
          subtitle="Pending vendor purchase orders"
          icon={RefreshCw}
          color="gold"
        />
        <InventoryStatCard
          title="Pending Priority Reorders"
          value={pendingReordersCount}
          subtitle="High & critical tier urgency"
          icon={PackagePlus}
          color="blue"
        />
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/40 dark:bg-black/20 p-2.5 rounded-2xl border border-border/60 dark:border-white/10">
        <InventorySearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search depleted SKU code, product title, or supplier..."
          className="flex-1 max-w-none lg:max-w-md"
        />

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold uppercase text-charcoal-muted text-[10px] tracking-wider shrink-0">
            Priority Filter:
          </span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white/70 dark:bg-black/40 border border-border dark:border-white/10 focus:border-accent text-charcoal dark:text-gray-200 focus:outline-none cursor-pointer shadow-sm font-medium"
          >
            <option value="ALL" className="bg-white dark:bg-[#101725]">All Alerts ({allLowStockItems.length})</option>
            <option value="critical" className="bg-white dark:bg-[#101725]">Critical & High Priority</option>
            <option value="out_of_stock" className="bg-white dark:bg-[#101725]">Out of Stock Only</option>
            <option value="low_stock" className="bg-white dark:bg-[#101725]">Low Stock (Above 0)</option>
          </select>
        </div>
      </div>

      {/* Alerts Data Table */}
      <InventoryDataTable
        columns={columns}
        data={filteredAlerts}
        pageSize={10}
        emptyMessage={
          allLowStockItems.length === 0
            ? 'All inventory items are currently well-stocked above minimum thresholds!'
            : 'No depleted stock items match the active search and priority filter.'
        }
      />

      {/* Reorder / Stock Receipt Modal */}
      <StockReceiptModal
        isOpen={!!reorderItem}
        onClose={() => setReorderItem(null)}
        preselectedItem={reorderItem}
        onSuccess={msg => showToast('Stock Replenished', msg, 'success')}
      />

      {/* Edit Minimum Stock Level Dialog */}
      {editingMinItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury-3d w-full max-w-sm bg-white dark:bg-[#111827] border border-accent/40 rounded-3xl shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Edit Minimum Stock Threshold
              </h3>
              <p className="text-xs text-charcoal-muted mt-1 truncate">
                {editingMinItem.name} ({editingMinItem.sku})
              </p>
            </div>

            <form onSubmit={handleSaveMinStock} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-charcoal dark:text-gray-300">
                  New Alert Buffer Quantity ({editingMinItem.unitOfMeasure || 'Units'})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={minStockValue}
                  onChange={e => setMinStockValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/70 dark:bg-black/30 border border-border dark:border-white/15 focus:border-accent text-primary dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingMinItem(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-primary dark:hover:text-white border border-border dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-3d px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-gold"
                >
                  Save Threshold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlertsPage;

