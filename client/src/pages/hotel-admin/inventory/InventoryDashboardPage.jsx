import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  AlertTriangle,
  DollarSign,
  Truck,
  History,
  Plus,
  PackagePlus,
  PackageMinus,
  Sliders,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  InventoryStatCard,
  InventoryNavTabs,
  InventoryStatusBadge,
  StockReceiptModal,
  StockIssueModal,
  StockAdjustmentModal,
  AddEditItemModal,
  TransactionDetailsModal,
} from '../../../components/inventory';

export const InventoryDashboardPage = () => {
  const navigate = useNavigate();
  const {
    inventoryItems = [],
    stockMovements = [],
    suppliers = [],
    getLowStockItems,
  } = useERP();
  const { showToast } = useToast();

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Compute live dashboard metrics
  const totalSkus = inventoryItems.length;
  const totalValuation = inventoryItems.reduce((acc, item) => {
    const qty = Number(item.currentStock ?? item.availableQuantity ?? 0);
    const cost = Number(item.unitCost ?? item.purchasePrice ?? item.unitPrice ?? 0);
    return acc + qty * cost;
  }, 0);

  const lowStockItems = getLowStockItems ? getLowStockItems() : [];
  const lowStockCount = lowStockItems.length;
  const totalMovementsCount = stockMovements.length;
  const approvedSuppliersCount = suppliers.filter(s => s.status === 'active').length;

  // Recent 6 transactions
  const recentTransactions = stockMovements.slice(0, 6);

  // Category distribution
  const categoriesMap = {};
  inventoryItems.forEach(i => {
    const cat = i.category || 'General';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              Inventory & Central Stores Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
              Live Stores Telemetry
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
            Lazfort Grand Palace — Sovereign SKU registry, real-time stock balances, valuation ledger, and supply purveyors.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Stock In (Receipt)</span>
          </button>
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all flex items-center gap-1.5"
          >
            <PackageMinus className="w-3.5 h-3.5" />
            <span>Stock Out (Issue)</span>
          </button>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="btn-primary-3d px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-gold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>



      {/* Top 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InventoryStatCard
          title="Total Registered SKUs"
          value={totalSkus}
          subtitle="Across 7 central hotel depots"
          icon={Boxes}
          color="gold"
          onClick={() => navigate('/hotel-admin/inventory/items')}
        />
        <InventoryStatCard
          title="Total Stock Valuation"
          value={`$${totalValuation.toLocaleString()}`}
          subtitle="Audited cost of on-hand inventory"
          icon={DollarSign}
          color="emerald"
        />
        <InventoryStatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle={lowStockCount > 0 ? 'Requires immediate restock' : 'All thresholds optimal'}
          icon={AlertTriangle}
          color={lowStockCount > 0 ? 'rose' : 'emerald'}
          trend={lowStockCount > 0 ? 'Action Required' : 'Optimal'}
          trendPositive={lowStockCount === 0}
          onClick={() => navigate('/hotel-admin/inventory/low-stock')}
        />
        <InventoryStatCard
          title="Stock Movement Ledger"
          value={totalMovementsCount}
          subtitle="Verified physical transactions"
          icon={History}
          color="blue"
          onClick={() => navigate('/hotel-admin/inventory/movements')}
        />
        <InventoryStatCard
          title="Approved Purveyors"
          value={approvedSuppliersCount}
          subtitle="Active luxury vendors"
          icon={Truck}
          color="amber"
          onClick={() => navigate('/hotel-admin/inventory/suppliers')}
        />
      </div>

      {/* Main Content Split: Category Distribution & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Card */}
        <div className="card-luxury-3d p-5 rounded-2xl border border-border dark:border-white/10 bg-white/80 dark:bg-[#111827]/80 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white">
                Category Inventory Distribution
              </h3>
              <p className="text-[11px] text-charcoal-muted">Proportion of provisions by division</p>
            </div>
            <span className="p-1.5 rounded-lg bg-accent/15 text-accent text-xs font-mono font-bold">
              {Object.keys(categoriesMap).length} Divisions
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(categoriesMap).map(([cat, count]) => {
              const pct = Math.round((count / Math.max(1, totalSkus)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-charcoal dark:text-gray-200">{cat}</span>
                    <span className="font-mono text-charcoal-muted text-[11px]">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-border/60 dark:bg-black/50 overflow-hidden border border-border/60 dark:border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Operations Button Strip */}
          <div className="pt-4 border-t border-border/80 dark:border-white/10 space-y-2">
            <p className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider">
              Quick Stores Workflows
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setIsAdjustmentModalOpen(true)}
                className="p-2.5 rounded-xl border border-border dark:border-white/10 hover:border-accent hover:text-accent bg-white/60 dark:bg-white/5 text-left font-semibold transition-all flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">Count Audit</span>
              </button>
              <button
                onClick={() => navigate('/hotel-admin/inventory/movements')}
                className="p-2.5 rounded-xl border border-border dark:border-white/10 hover:border-accent hover:text-accent bg-white/60 dark:bg-white/5 text-left font-semibold transition-all flex items-center gap-2"
              >
                <History className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">Audit Trail</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Stock Transactions Card (2 Cols) */}
        <div className="lg:col-span-2 card-luxury-3d p-5 rounded-2xl border border-border dark:border-white/10 bg-white/80 dark:bg-[#111827]/80 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 dark:border-white/10 pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-primary dark:text-white">
                Recent Physical Stock Transactions
              </h3>
              <p className="text-[11px] text-charcoal-muted">Verified goods receipts, issuances, and variances</p>
            </div>
            <button
              onClick={() => navigate('/hotel-admin/inventory/movements')}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View Complete Audit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-charcoal-muted">
              No stock movements recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider border-b border-border/60 dark:border-white/5">
                    <th className="pb-2">Transaction ID</th>
                    <th className="pb-2">Item Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5">
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-ivory/40 dark:hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-semibold text-accent">
                        {tx.transactionId || tx.id}
                      </td>
                      <td className="py-3 font-medium text-primary dark:text-white max-w-[140px] truncate">
                        {tx.itemName}
                      </td>
                      <td className="py-3">
                        <InventoryStatusBadge status={tx.movementType || tx.type} />
                      </td>
                      <td className="py-3 font-mono font-bold">
                        {tx.quantityChanged ?? tx.quantity}
                      </td>
                      <td className="py-3 text-charcoal-muted text-[11px] truncate max-w-[120px]">
                        {tx.department}
                      </td>
                      <td className="py-3 text-charcoal-muted text-[11px] font-mono">
                        {tx.transactionDate ? tx.transactionDate.slice(0, 10) : 'Today'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-accent hover:bg-accent/10 border border-accent/20 transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StockReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onSuccess={msg => showToast('Stock Received', msg, 'success')}
      />

      <StockIssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSuccess={msg => showToast('Stock Issued', msg, 'success')}
      />

      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        onSuccess={msg => showToast('Stock Reconciled', msg, 'success')}
      />

      <AddEditItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSuccess={() => showToast('Item Added', 'New SKU saved to catalog.', 'success')}
      />

      <TransactionDetailsModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
};

export default InventoryDashboardPage;

