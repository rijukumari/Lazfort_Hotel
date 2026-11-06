import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  TrendingDown,
  Download,
  Eye,
  Edit2,
  Trash2,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Tag
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  MaintenanceNavTabs,
  AddAssetModal,
  AssetDetailsModal,
  RaiseTicketModal,
  DeleteConfirmationDialog
} from '../../../components/maintenance';

const CATEGORIES = [
  'All Categories',
  'HVAC & Climate Control',
  'Elevators & Vertical Transport',
  'Commercial Kitchen & Culinary Equipment',
  'Laundry & Dry-Cleaning Machinery',
  'Water Filtration, Pumps & Plumbing',
  'Emergency Generators & Power Distribution',
  'Smart In-Suite Automation & Audio/Visual',
  'Spa & Wellness Infrastructure',
  'Security & Surveillance Systems',
  'Luxury Transportation & Chauffeur Fleet'
];

export const AssetRegisterPage = () => {
  const { fixedAssets = [], deleteFixedAsset } = useERP();
  const { showToast } = useToast();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [conditionFilter, setConditionFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRaiseTicketOpen, setIsRaiseTicketOpen] = useState(false);
  const [ticketPrefillAsset, setTicketPrefillAsset] = useState(null);

  // Dynamic Depreciation Helper
  const now = new Date();
  const computeAssetMetrics = (asset) => {
    const cost = Number(asset.purchaseCost || asset.cost || 0);
    const salvage = Number(asset.salvageValue || 0);
    const usefulLife = Number(asset.usefulLifeYears || 10);
    const purchaseDate = new Date(asset.purchaseDate || Date.now());
    const ageYears = Math.max(0, (now - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25));

    const annualDepr = usefulLife > 0 ? (cost - salvage) / usefulLife : 0;
    const accumDepr = Math.min(cost - salvage, ageYears * annualDepr);
    const bookValue = Math.max(salvage, cost - accumDepr);

    return {
      cost,
      salvage,
      usefulLife,
      ageYears,
      accumDepr,
      bookValue
    };
  };

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return fixedAssets.filter((asset) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        asset.name?.toLowerCase().includes(q) ||
        asset.tag?.toLowerCase().includes(q) ||
        asset.serialNumber?.toLowerCase().includes(q) ||
        asset.location?.toLowerCase().includes(q) ||
        asset.supplier?.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === 'All Categories' || asset.category === categoryFilter;

      const matchesCondition =
        conditionFilter === 'all' || asset.condition === conditionFilter;

      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [fixedAssets, searchQuery, categoryFilter, conditionFilter]);

  // Overall Financial Aggregates
  const totals = useMemo(() => {
    return fixedAssets.reduce(
      (acc, asset) => {
        const m = computeAssetMetrics(asset);
        acc.grossCost += m.cost;
        acc.accumDepr += m.accumDepr;
        acc.bookValue += m.bookValue;
        return acc;
      },
      { grossCost: 0, accumDepr: 0, bookValue: 0 }
    );
  }, [fixedAssets]);

  const handleDeleteConfirm = () => {
    if (assetToDelete) {
      deleteFixedAsset(assetToDelete.id);
      showToast('Asset Deleted', `Asset ${assetToDelete.name} decommissioned and deleted.`, 'info');
      setAssetToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Asset ID',
      'Asset Name',
      'Category',
      'Location',
      'Purchase Date',
      'Purchase Cost',
      'Accumulated Depreciation',
      'Net Book Value',
      'Condition',
      'Supplier',
      'Warranty Expiry'
    ];

    const rows = filteredAssets.map((a) => {
      const m = computeAssetMetrics(a);
      return [
        `"${a.tag || a.id}"`,
        `"${a.name}"`,
        `"${a.category}"`,
        `"${a.location}"`,
        `"${a.purchaseDate}"`,
        m.cost,
        Math.round(m.accumDepr),
        Math.round(m.bookValue),
        `"${a.condition || 'Excellent'}"`,
        `"${a.supplier || ''}"`,
        `"${a.warrantyExpiry || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lazfort_Fixed_Asset_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Asset Register Exported', 'CSV report generated with full IAS-16 valuation.', 'success');
  };

  const conditionBadges = {
    Excellent: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    Good: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    Fair: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    Poor: 'bg-rose-500/15 text-rose-500 border-rose-500/30'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-gold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary dark:text-white">
              Fixed Capital Asset Register
            </h1>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              IAS-16 Fixed Asset Compliance, Depreciation Schedules & Physical Asset Condition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-white/10 text-xs font-semibold text-charcoal dark:text-gray-300 hover:bg-ivory dark:hover:bg-primary-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setAssetToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Capital Asset</span>
          </button>
        </div>
      </div>



      {/* Financial Valuation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">Registered Capital Assets</p>
            <p className="text-2xl font-serif font-bold text-primary dark:text-white mt-0.5">
              {fixedAssets.length}
            </p>
            <p className="text-[10px] text-accent font-mono mt-0.5">In Active Operation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">Gross Capital Outlay</p>
            <p className="text-2xl font-serif font-bold text-primary dark:text-white mt-0.5">
              ${Math.round(totals.grossCost).toLocaleString()}
            </p>
            <p className="text-[10px] text-charcoal-muted font-mono mt-0.5">Historical Purchase Cost</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-accent/40 bg-accent/10 dark:bg-accent/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-accent font-semibold">Net Book Value</p>
            <p className="text-2xl font-serif font-bold text-accent mt-0.5">
              ${Math.round(totals.bookValue).toLocaleString()}
            </p>
            <p className="text-[10px] text-accent/80 font-mono mt-0.5">Current Balance Sheet Value</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Accumulated Depreciation</p>
            <p className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              -${Math.round(totals.accumDepr).toLocaleString()}
            </p>
            <p className="text-[10px] text-rose-500 font-mono mt-0.5">
              {totals.grossCost > 0
                ? `${Math.round((totals.accumDepr / totals.grossCost) * 100)}% Depreciated`
                : '0%'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-muted dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by asset name, tag number, location or vendor..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white placeholder-charcoal-muted dark:placeholder-gray-500 shadow-inner"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-64 px-3.5 py-2.5 rounded-xl border border-border/80 dark:border-white/10 bg-ivory/60 dark:bg-primary-950/70 text-xs focus:outline-none focus:border-accent text-primary dark:text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-white dark:bg-primary-900 text-primary dark:text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60 dark:border-white/5 text-xs">
          <span className="text-charcoal-muted dark:text-gray-400 font-semibold mr-1">Condition:</span>
          {['all', 'Excellent', 'Good', 'Fair', 'Poor'].map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => setConditionFilter(cond)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                conditionFilter === cond
                  ? 'gold-gradient-bg text-primary-950 font-bold border-accent shadow-sm'
                  : 'filter-btn-inactive'
              }`}
            >
              {cond === 'all' ? 'All Conditions' : cond}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between bg-ivory/30 dark:bg-primary-800/40">
          <p className="text-xs font-semibold text-charcoal-muted dark:text-gray-400">
            Showing <span className="font-mono font-bold text-accent">{filteredAssets.length}</span> of {fixedAssets.length} Capital Assets
          </p>
          {(categoryFilter !== 'All Categories' || conditionFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('All Categories');
                setConditionFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredAssets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 dark:border-white/10 bg-ivory/80 dark:bg-primary-800/40 text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-gray-300 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Tag Ref</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Asset Name & Category</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Facility Location</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Purchase Cost</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Accumulated Depr</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Net Book Value</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Condition</th>
                  <th className="py-3.5 px-4 text-charcoal-muted dark:text-gray-300">Warranty</th>
                  <th className="py-3.5 px-4 text-right text-charcoal-muted dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/5">
                {filteredAssets.map((asset) => {
                  const m = computeAssetMetrics(asset);
                  const condStyle = conditionBadges[asset.condition] || conditionBadges.Excellent;

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-ivory/40 dark:hover:bg-primary-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-accent">
                        {asset.tag || asset.id}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-primary dark:text-white truncate">
                          {asset.name}
                        </p>
                        <p className="text-[11px] text-charcoal-muted truncate">
                          {asset.category}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-charcoal dark:text-gray-300">
                        {asset.location}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-primary dark:text-white">
                        ${m.cost.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-rose-600 dark:text-rose-400">
                        -${Math.round(m.accumDepr).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-accent">
                        ${Math.round(m.bookValue).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${condStyle}`}
                        >
                          {asset.condition || 'Excellent'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] font-mono text-charcoal-muted">
                        {asset.warrantyExpiry || 'Expired'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-accent hover:bg-accent/15 transition-colors"
                            title="View Asset Capital Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setTicketPrefillAsset(asset);
                              setIsRaiseTicketOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/15 transition-colors"
                            title="Raise Service Ticket for Asset"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setAssetToEdit(asset);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-charcoal-muted hover:text-accent hover:bg-accent/15 transition-colors"
                            title="Edit Asset Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setAssetToDelete(asset);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors"
                            title="Decommission Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-muted dark:text-gray-400">
            <Building2 className="w-12 h-12 text-accent/50 mx-auto mb-3" />
            <p className="font-serif font-bold text-base text-primary dark:text-white">
              No Capital Assets Found
            </p>
            <p className="text-xs mt-1">Register new property equipment or reset search filters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAssetToEdit(null);
        }}
        assetToEdit={assetToEdit}
        onSuccess={() => {
          showToast(
            assetToEdit ? 'Asset Updated' : 'Asset Registered',
            `Fixed asset record saved successfully.`,
            'success'
          );
        }}
      />

      <AssetDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
        onEdit={(a) => {
          setIsDetailsModalOpen(false);
          setAssetToEdit(a);
          setIsAddModalOpen(true);
        }}
        onRaiseTicket={(a) => {
          setIsDetailsModalOpen(false);
          setTicketPrefillAsset(a);
          setIsRaiseTicketOpen(true);
        }}
      />

      <RaiseTicketModal
        isOpen={isRaiseTicketOpen}
        onClose={() => {
          setIsRaiseTicketOpen(false);
          setTicketPrefillAsset(null);
        }}
        prefillAsset={ticketPrefillAsset}
        onSuccess={() => {
          showToast('Service Ticket Dispatched', 'Asset work order queued for maintenance team.', 'success');
        }}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAssetToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Decommission Fixed Asset"
        itemName={assetToDelete ? `${assetToDelete.tag || assetToDelete.id} - ${assetToDelete.name}` : ''}
        message="Are you certain you wish to purge this asset from the IAS-16 capital register? Historical depreciation logs will be permanently deleted."
      />
    </div>
  );
};

export default AssetRegisterPage;

