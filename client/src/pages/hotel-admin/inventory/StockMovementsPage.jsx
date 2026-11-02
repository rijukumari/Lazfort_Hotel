import React, { useState, useMemo } from 'react';
import {
  History,
  PackagePlus,
  PackageMinus,
  Sliders,
  Download,
  Eye,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  RotateCcw,
  DollarSign,
  Calendar,
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
  StockIssueModal,
  StockAdjustmentModal,
  TransactionDetailsModal,
} from '../../../components/inventory';

export const StockMovementsPage = () => {
  const { stockMovements = [] } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  // Modals state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Compute movement metrics
  const totalMovements = stockMovements.length;
  const stockReceivedCount = stockMovements.filter(
    m => (m.movementType || m.type || '').toLowerCase().includes('in') || (m.movementType || m.type || '').toLowerCase().includes('receipt')
  ).length;

  const stockIssuedCount = stockMovements.filter(
    m => (m.movementType || m.type || '').toLowerCase().includes('out') || (m.movementType || m.type || '').toLowerCase().includes('issue')
  ).length;

  const stockAdjustmentsCount = stockMovements.filter(
    m => (m.movementType || m.type || '').toLowerCase().includes('adjust') || (m.movementType || m.type || '').toLowerCase().includes('transfer')
  ).length;

  const totalMovementValue = stockMovements.reduce((sum, m) => {
    return sum + (Number(m.totalMovementValue || m.totalValue || 0));
  }, 0);

  // Extract unique departments
  const departmentsList = useMemo(() => {
    const set = new Set();
    stockMovements.forEach(m => {
      if (m.department) set.add(m.department);
      if (m.destinationDepartment) set.add(m.destinationDepartment);
    });
    return Array.from(set);
  }, [stockMovements]);

  // Filtered movements
  const filteredMovements = useMemo(() => {
    return stockMovements.filter(tx => {
      const q = searchQuery.toLowerCase().trim();
      const txId = (tx.transactionId || tx.id || '').toLowerCase();
      const name = (tx.itemName || tx.name || '').toLowerCase();
      const sku = (tx.sku || tx.itemCode || '').toLowerCase();
      const ref = (tx.referenceNumber || '').toLowerCase();
      const user = (tx.performedBy || '').toLowerCase();
      const dept = (tx.department || '').toLowerCase();

      const matchesSearch = !q || txId.includes(q) || name.includes(q) || sku.includes(q) || ref.includes(q) || user.includes(q) || dept.includes(q);

      let matchesType = true;
      const normType = (tx.movementType || tx.type || '').toLowerCase();
      if (selectedType !== 'ALL') {
        if (selectedType === 'Stock In') matchesType = normType.includes('in') || normType.includes('receipt');
        else if (selectedType === 'Stock Out') matchesType = normType.includes('out') || normType.includes('issue');
        else if (selectedType === 'Adjustment') matchesType = normType.includes('adjust');
        else if (selectedType === 'Department Transfer') matchesType = normType.includes('transfer');
        else if (selectedType === 'Return') matchesType = normType.includes('return');
      }

      const matchesDept = selectedDepartment === 'ALL' || tx.department === selectedDepartment || tx.destinationDepartment === selectedDepartment;
      const matchesDate = !selectedDate || (tx.transactionDate && tx.transactionDate.startsWith(selectedDate)) || (tx.timestamp && tx.timestamp.startsWith(selectedDate));

      return matchesSearch && matchesType && matchesDept && matchesDate;
    });
  }, [stockMovements, searchQuery, selectedType, selectedDepartment, selectedDate]);

  // CSV Export feature
  const handleExportCSV = () => {
    if (stockMovements.length === 0) {
      showToast('No Data', 'No transactions available to export.', 'info');
      return;
    }

    const headers = ['Transaction ID', 'Item Name', 'Movement Type', 'Previous Quantity', 'Quantity Changed', 'New Quantity', 'Reference #', 'Department', 'Performed By', 'Date'];
    const rows = stockMovements.map(m => [
      m.transactionId || m.id,
      `"${m.itemName?.replace(/"/g, '""') || ''}"`,
      m.movementType || m.type,
      m.previousQuantity ?? m.previousStock ?? 0,
      m.quantityChanged ?? m.quantity ?? 0,
      m.newQuantity ?? m.newStock ?? 0,
      m.referenceNumber || '',
      `"${m.department || ''}"`,
      `"${m.performedBy || ''}"`,
      m.transactionDate || m.timestamp || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lazfort_Stock_Movement_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'Stock movement audit report downloaded in CSV format.', 'success');
  };

  // Filter definitions
  const filterConfigs = [
    {
      value: selectedType,
      onChange: setSelectedType,
      options: [
        { value: 'ALL', label: 'All Movement Types' },
        { value: 'Stock In', label: 'Stock In (Receipts)' },
        { value: 'Stock Out', label: 'Stock Out (Issues)' },
        { value: 'Adjustment', label: 'Adjustments' },
        { value: 'Department Transfer', label: 'Department Transfers' },
        { value: 'Return', label: 'Vendor Returns' },
      ],
    },
    {
      value: selectedDepartment,
      onChange: setSelectedDepartment,
      options: [
        { value: 'ALL', label: 'All Departments' },
        ...departmentsList.map(d => ({ value: d, label: d })),
      ],
    },
  ];

  // Table columns per Section 3 requirements
  const columns = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs font-bold text-accent">
          {row.transactionId || row.id}
        </span>
      ),
    },
    {
      key: 'itemName',
      header: 'Item Name',
      sortable: true,
      render: row => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{row.itemName}</p>
          <span className="text-[10px] text-charcoal-muted font-mono">{row.sku || 'SKU'}</span>
        </div>
      ),
    },
    {
      key: 'movementType',
      header: 'Movement Type',
      sortable: true,
      render: row => <InventoryStatusBadge status={row.movementType || row.type} />,
    },
    {
      key: 'previousQuantity',
      header: 'Previous Qty',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs text-charcoal-muted">
          {row.previousQuantity ?? row.previousStock ?? 0}
        </span>
      ),
    },
    {
      key: 'quantityChanged',
      header: 'Qty Changed',
      sortable: true,
      render: row => {
        const norm = (row.movementType || row.type || '').toLowerCase();
        const isIn = norm.includes('in') || norm.includes('receipt');
        const qty = row.quantityChanged ?? row.quantity ?? 0;
        return (
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
              isIn
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
            }`}
          >
            {isIn ? `+${qty}` : `-${qty}`}
          </span>
        );
      },
    },
    {
      key: 'newQuantity',
      header: 'New Qty',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs font-bold text-primary dark:text-white">
          {row.newQuantity ?? row.newStock ?? 0}
        </span>
      ),
    },
    {
      key: 'referenceNumber',
      header: 'Reference Number',
      sortable: true,
      render: row => (
        <span className="font-mono text-xs text-charcoal-muted dark:text-gray-400">
          {row.referenceNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: row => (
        <span className="text-xs text-charcoal dark:text-gray-300 font-medium truncate max-w-[130px] block">
          {row.department || 'Central Stores'}
        </span>
      ),
    },
    {
      key: 'performedBy',
      header: 'Performed By',
      sortable: true,
      render: row => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400 truncate max-w-[120px] block">
          {row.performedBy || 'Storekeeper'}
        </span>
      ),
    },
    {
      key: 'transactionDate',
      header: 'Transaction Date',
      sortable: true,
      render: row => (
        <span className="font-mono text-[11px] text-charcoal-muted">
          {row.transactionDate ? row.transactionDate.slice(0, 16) : (row.timestamp ? row.timestamp.slice(0, 16).replace('T', ' ') : 'N/A')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: row => (
        <button
          onClick={() => setSelectedTx(row)}
          className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
          title="View Transaction Audit Details"
        >
          <Eye className="w-4 h-4" />
        </button>
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
              Stock Movement Audit Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
              Verified Audit Trail
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
            Immutable physical audit history of stock receipts, departmental issues, counts, and inter-facility transfers.
          </p>
        </div>

        {/* Action Controls */}
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
            onClick={() => setIsAdjustmentModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal dark:text-gray-200 bg-white/70 dark:bg-white/5 hover:bg-white border border-border dark:border-white/10 transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-accent" />
            <span>Adjustment / Transfer</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal dark:text-gray-200 bg-white/70 dark:bg-white/5 hover:bg-white border border-border dark:border-white/10 transition-all flex items-center gap-1.5"
            title="Export CSV audit report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>



      {/* 5 Key Metric Cards per Section 3 Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InventoryStatCard
          title="Total Stock Movements"
          value={totalMovements}
          subtitle="All recorded audit entries"
          icon={History}
          color="gold"
        />
        <InventoryStatCard
          title="Stock Received (In)"
          value={stockReceivedCount}
          subtitle="Vendor supplier restocks"
          icon={PackagePlus}
          color="emerald"
        />
        <InventoryStatCard
          title="Stock Issued (Out)"
          value={stockIssuedCount}
          subtitle="Departmental requisitions"
          icon={PackageMinus}
          color="blue"
        />
        <InventoryStatCard
          title="Stock Adjustments"
          value={stockAdjustmentsCount}
          subtitle="Audits, transfers & returns"
          icon={Sliders}
          color="amber"
        />
        <InventoryStatCard
          title="Total Movement Value"
          value={`$${totalMovementValue.toLocaleString()}`}
          subtitle="Transacted inventory balance"
          icon={DollarSign}
          color="gold"
        />
      </div>

      {/* Search & Filters Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/40 dark:bg-black/20 p-2.5 rounded-2xl border border-border/60 dark:border-white/10">
        <InventorySearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by transaction ID, SKU, product, user, or reference..."
          className="flex-1 max-w-none lg:max-w-md"
        />

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <InventoryFilters
            filters={filterConfigs}
            onReset={() => {
              setSelectedType('ALL');
              setSelectedDepartment('ALL');
              setSelectedDate('');
              setSearchQuery('');
            }}
          />

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-white/70 dark:bg-black/40 border border-border dark:border-white/10 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-charcoal dark:text-gray-200 text-xs focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Movements Data Table */}
      <InventoryDataTable
        columns={columns}
        data={filteredMovements}
        pageSize={10}
        emptyMessage={
          searchQuery || selectedType !== 'ALL' || selectedDepartment !== 'ALL' || selectedDate
            ? 'No stock movements match the specified filters.'
            : 'No stock movements recorded in the ledger yet.'
        }
      />

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

      <TransactionDetailsModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
};

export default StockMovementsPage;

