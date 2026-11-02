import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Edit2,
  Trash2,
  PackagePlus,
  PackageMinus,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  InventoryNavTabs,
  InventorySearch,
  InventoryFilters,
  InventoryDataTable,
  InventoryStatusBadge,
  AddEditItemModal,
  StockReceiptModal,
  StockIssueModal,
  DeleteConfirmationDialog,
} from '../../../components/inventory';

export const ItemCatalogPage = () => {
  const {
    inventoryItems = [],
    deleteInventoryItem,
    suppliers = [],
    getLowStockItems,
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [receiptItem, setReceiptItem] = useState(null);
  const [issueItem, setIssueItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Extract unique categories & suppliers for filtering
  const categoriesList = useMemo(() => {
    const set = new Set();
    inventoryItems.forEach(i => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [inventoryItems]);

  const suppliersList = useMemo(() => {
    const set = new Set();
    inventoryItems.forEach(i => {
      const sup = i.supplierName || i.supplier;
      if (sup) set.add(sup);
    });
    return Array.from(set);
  }, [inventoryItems]);

  // Filtered & searched data
  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const code = (item.sku || item.itemCode || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const sup = (item.supplierName || item.supplier || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const loc = (item.storageLocation || item.location || '').toLowerCase();

      const matchesSearch = !q || code.includes(q) || name.includes(q) || sup.includes(q) || cat.includes(q) || loc.includes(q);
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSup = selectedSupplier === 'ALL' || (item.supplierName === selectedSupplier || item.supplier === selectedSupplier);

      let matchesStatus = true;
      const currentStock = Number(item.currentStock ?? item.availableQuantity ?? 0);
      const minStock = Number(item.minimumStock ?? item.minStock ?? 10);

      if (selectedStatus === 'in_stock') {
        matchesStatus = currentStock > minStock && currentStock > 0;
      } else if (selectedStatus === 'low_stock') {
        matchesStatus = currentStock <= minStock && currentStock > 0;
      } else if (selectedStatus === 'out_of_stock') {
        matchesStatus = currentStock === 0;
      }

      return matchesSearch && matchesCat && matchesSup && matchesStatus;
    });
  }, [inventoryItems, searchQuery, selectedCategory, selectedSupplier, selectedStatus]);

  // Delete handler
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    deleteInventoryItem(itemToDelete.id);
    showToast('SKU Removed', `Item "${itemToDelete.name}" was removed from the catalog.`, 'success');
    setItemToDelete(null);
  };

  // Filter definitions
  const filterConfigs = [
    {
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [
        { value: 'ALL', label: 'All Categories' },
        ...categoriesList.map(c => ({ value: c, label: c })),
      ],
    },
    {
      value: selectedSupplier,
      onChange: setSelectedSupplier,
      options: [
        { value: 'ALL', label: 'All Suppliers' },
        ...suppliersList.map(s => ({ value: s, label: s })),
      ],
    },
    {
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: [
        { value: 'ALL', label: 'All Stock Statuses' },
        { value: 'in_stock', label: 'In Stock' },
        { value: 'low_stock', label: 'Low Stock' },
        { value: 'out_of_stock', label: 'Out of Stock' },
      ],
    },
  ];

  // Table columns per Section 1 requirements
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
          <p className="text-[10px] text-charcoal-muted truncate max-w-xs">{row.description || row.location || 'Central Depot'}</p>
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
      key: 'supplierName',
      header: 'Supplier',
      sortable: true,
      render: row => (
        <span className="text-xs text-charcoal-muted dark:text-gray-300 font-medium truncate max-w-[150px] block">
          {row.supplierName || row.supplier || 'Approved Vendor'}
        </span>
      ),
    },
    {
      key: 'unitOfMeasure',
      header: 'Unit',
      render: row => (
        <span className="font-mono text-xs text-charcoal-muted">
          {row.unitOfMeasure || row.unit || 'Units'}
        </span>
      ),
    },
    {
      key: 'currentStock',
      header: 'Available Qty',
      sortable: true,
      render: row => {
        const qty = Number(row.currentStock ?? row.availableQuantity ?? 0);
        const min = Number(row.minimumStock ?? row.minStock ?? 10);
        const isCritical = qty === 0;
        const isLow = qty <= min && !isCritical;
        return (
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className={`font-bold text-xs ${isCritical
                  ? 'text-rose-600 dark:text-rose-400'
                  : isLow
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-primary dark:text-white'
                }`}
            >
              {qty}
            </span>
            {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
          </div>
        );
      },
    },
    {
      key: 'minimumStock',
      header: 'Min Level',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs text-charcoal-muted">
          {row.minimumStock ?? row.minStock ?? 10}
        </span>
      ),
    },
    {
      key: 'unitCost',
      header: 'Unit Price',
      sortable: true,
      render: row => {
        const price = Number(row.unitCost ?? row.purchasePrice ?? row.unitPrice ?? 0);
        return <span className="font-mono text-xs font-semibold">${price.toFixed(2)}</span>;
      },
    },
    {
      key: 'totalValue',
      header: 'Total Value',
      sortable: true,
      render: row => {
        const qty = Number(row.currentStock ?? row.availableQuantity ?? 0);
        const price = Number(row.unitCost ?? row.purchasePrice ?? row.unitPrice ?? 0);
        const total = qty * price;
        return (
          <span className="font-serif font-bold text-xs text-accent">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: row => <InventoryStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: row => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setReceiptItem(row)}
            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors"
            title="Goods Receipt (Stock In)"
          >
            <PackagePlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIssueItem(row)}
            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-colors"
            title="Department Issue (Stock Out)"
          >
            <PackageMinus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingItem(row);
              setIsAddEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Item Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setItemToDelete(row)}
            className="p-1.5 rounded-lg hover:bg-rose-500/15 text-charcoal-muted hover:text-rose-500 transition-colors"
            title="Delete SKU from Catalog"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Item Inventory Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
              {inventoryItems.length} SKUs Listed
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
            Complete master registry of all resort provisions, luxury guest amenities, linens, and technical parts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsAddEditModalOpen(true);
          }}
          className="btn-primary-3d px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-gold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>



      {/* Search & Filters Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/40 dark:bg-black/20 p-2.5 rounded-2xl border border-border/60 dark:border-white/10">
        <InventorySearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by SKU code, item name, supplier, or location..."
          className="flex-1 max-w-none lg:max-w-md"
        />

        <InventoryFilters
          filters={filterConfigs}
          onReset={() => {
            setSelectedCategory('ALL');
            setSelectedSupplier('ALL');
            setSelectedStatus('ALL');
            setSearchQuery('');
          }}
        />
      </div>

      {/* Data Table */}
      <InventoryDataTable
        columns={columns}
        data={filteredItems}
        pageSize={10}
        emptyMessage={
          searchQuery || selectedCategory !== 'ALL' || selectedSupplier !== 'ALL' || selectedStatus !== 'ALL'
            ? 'No inventory items match the applied filters. Try adjusting your search.'
            : 'No inventory items registered in catalog.'
        }
        emptyAction={
          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddEditModalOpen(true);
            }}
            className="btn-primary-3d px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Item</span>
          </button>
        }
      />

      {/* Modals */}
      <AddEditItemModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSuccess={() => {
          showToast(
            editingItem ? 'Item Updated' : 'Item Registered',
            editingItem ? 'SKU details saved successfully.' : 'New item saved to master catalog.',
            'success'
          );
        }}
      />

      <StockReceiptModal
        isOpen={!!receiptItem}
        onClose={() => setReceiptItem(null)}
        preselectedItem={receiptItem}
        onSuccess={msg => showToast('Stock Received', msg, 'success')}
      />

      <StockIssueModal
        isOpen={!!issueItem}
        onClose={() => setIssueItem(null)}
        preselectedItem={issueItem}
        onSuccess={msg => showToast('Stock Issued', msg, 'success')}
      />

      <DeleteConfirmationDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove SKU: ${itemToDelete?.name}?`}
        message={`Are you sure you want to permanently delete SKU "${itemToDelete?.sku}" from the central inventory catalog? This will affect stock records and reorder thresholds.`}
      />
    </div>
  );
};

export default ItemCatalogPage;

