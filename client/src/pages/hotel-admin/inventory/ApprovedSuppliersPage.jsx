import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building,
  Boxes,
  Eye,
  Clock,
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
  SupplierFormModal,
  DeleteConfirmationDialog,
} from '../../../components/inventory';

export const ApprovedSuppliersPage = () => {
  const {
    suppliers = [],
    inventoryItems = [],
    deleteSupplier,
    toggleSupplierStatus,
  } = useERP();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals state
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);

  // Compute total items supplied per supplier
  const supplierItemCounts = useMemo(() => {
    const map = {};
    inventoryItems.forEach(i => {
      const sup = i.supplierName || i.supplier;
      if (sup) {
        map[sup] = (map[sup] || 0) + 1;
      }
    });
    return map;
  }, [inventoryItems]);

  // Overall metric counts
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const inactiveSuppliers = suppliers.filter(s => s.status === 'inactive').length;
  const totalSuppliedCategories = useMemo(() => {
    const set = new Set();
    suppliers.forEach(s => {
      const cats = Array.isArray(s.categories) ? s.categories : [s.category];
      cats.forEach(c => c && set.add(c));
    });
    return Array.from(set);
  }, [suppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const name = (s.name || '').toLowerCase();
      const code = (s.code || '').toLowerCase();
      const contact = (s.contactPerson || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const phone = (s.phone || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || code.includes(q) || contact.includes(q) || email.includes(q) || phone.includes(q);
      const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

      let matchesCat = true;
      if (selectedCategory !== 'ALL') {
        const cats = Array.isArray(s.categories) ? s.categories : [s.category];
        matchesCat = cats.includes(selectedCategory);
      }

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [suppliers, searchQuery, selectedStatus, selectedCategory]);

  // Handle Delete Confirm
  const handleDeleteConfirm = () => {
    if (!supplierToDelete) return;
    deleteSupplier(supplierToDelete.id);
    showToast('Supplier Removed', `Supplier "${supplierToDelete.name}" removed from approved directory.`, 'success');
    setSupplierToDelete(null);
  };

  // Filter definitions
  const filterConfigs = [
    {
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'active', label: 'Active Purveyors' },
        { value: 'inactive', label: 'Inactive / Suspended' },
      ],
    },
    {
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [
        { value: 'ALL', label: 'All Supply Categories' },
        ...totalSuppliedCategories.map(c => ({ value: c, label: c })),
      ],
    },
  ];

  // Table columns per Section 4 requirements
  const columns = [
    {
      key: 'name',
      header: 'Supplier Name',
      sortable: true,
      render: row => (
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-primary dark:text-white leading-tight">{row.name}</p>
            {row.code && (
              <span className="font-mono text-[10px] text-accent px-1.5 py-0.2 rounded bg-accent/10 border border-accent/20">
                {row.code}
              </span>
            )}
          </div>
          <span className="text-[11px] text-charcoal-muted">Terms: {row.paymentTerms || 'Net 30'}</span>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      sortable: true,
      render: row => (
        <span className="text-xs text-charcoal dark:text-gray-200 font-medium">
          {row.contactPerson || 'Account Director'}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: row => (
        <a
          href={`mailto:${row.email}`}
          className="text-xs text-accent hover:underline flex items-center gap-1 font-mono"
        >
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[140px]">{row.email}</span>
        </a>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: row => (
        <span className="text-xs text-charcoal-muted font-mono flex items-center gap-1">
          <Phone className="w-3 h-3 text-accent shrink-0" />
          <span>{row.phone || 'N/A'}</span>
        </span>
      ),
    },
    {
      key: 'address',
      header: 'Address',
      render: row => (
        <span className="text-xs text-charcoal-muted truncate max-w-[150px] block" title={row.address}>
          {row.address || 'Monaco / European Union'}
        </span>
      ),
    },
    {
      key: 'categories',
      header: 'Supplied Categories',
      render: row => {
        const cats = Array.isArray(row.categories) ? row.categories : (row.category ? [row.category] : ['General']);
        return (
          <div className="flex flex-wrap gap-1">
            {cats.map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-ivory dark:bg-white/5 border border-border/80 dark:border-white/10 text-[10px] font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'totalItems',
      header: 'Total Items',
      sortable: true,
      className: 'whitespace-nowrap',
      render: row => {
        const count = supplierItemCounts[row.name] || 0;
        return (
          <span className="font-mono text-xs font-bold text-primary dark:text-white bg-ivory dark:bg-white/5 px-2.5 py-1 rounded-md border border-border/60 dark:border-white/10 whitespace-nowrap inline-flex items-center gap-1.5 shrink-0">
            <span>{count}</span>
            <span className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold">SKUs</span>
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Supplier Status',
      sortable: true,
      render: row => <InventoryStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: row => {
        const isActive = row.status === 'active';
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => {
                toggleSupplierStatus(row.id);
                showToast(
                  'Status Toggled',
                  `Supplier "${row.name}" marked as ${isActive ? 'Inactive' : 'Active'}.`,
                  'success'
                );
              }}
              className={`p-1.5 rounded-lg transition-colors ${isActive
                  ? 'text-emerald-600 hover:bg-rose-500/10 hover:text-rose-600'
                  : 'text-charcoal-muted hover:text-emerald-500 hover:bg-emerald-500/10'
                }`}
              title={isActive ? 'Deactivate supplier' : 'Approve / Activate supplier'}
            >
              {isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setEditingSupplier(row);
                setIsSupplierModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-accent/15 text-charcoal-muted hover:text-accent transition-colors"
              title="Edit Supplier Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSupplierToDelete(row)}
              className="p-1.5 rounded-lg hover:bg-rose-500/15 text-charcoal-muted hover:text-rose-500 transition-colors"
              title="Delete Supplier"
            >
              <Trash2 className="w-4 h-4" />
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
              Approved Purveyors & Suppliers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
              Verified Partners
            </span>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
            Certified luxury vendors, Michelin purveyors, linen manufacturers, and engineering contractors.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSupplier(null);
            setIsSupplierModalOpen(true);
          }}
          className="btn-primary-3d px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-gold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>



      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InventoryStatCard
          title="Total Vendors"
          value={totalSuppliers}
          subtitle="Registered in supply chain"
          icon={Truck}
          color="gold"
        />
        <InventoryStatCard
          title="Active & Approved"
          value={activeSuppliers}
          subtitle="Orders actively permitted"
          icon={CheckCircle}
          color="emerald"
        />
        <InventoryStatCard
          title="Inactive / Suspended"
          value={inactiveSuppliers}
          subtitle="Under procurement review"
          icon={XCircle}
          color="rose"
        />
        <InventoryStatCard
          title="Supplied Categories"
          value={totalSuppliedCategories.length}
          subtitle="Specialized provisioning fields"
          icon={Boxes}
          color="blue"
        />
      </div>

      {/* Search & Filters Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/40 dark:bg-black/20 p-2.5 rounded-2xl border border-border/60 dark:border-white/10">
        <InventorySearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search purveyors by company name, contact person, or email..."
          className="flex-1 max-w-none lg:max-w-md"
        />

        <InventoryFilters
          filters={filterConfigs}
          onReset={() => {
            setSelectedStatus('ALL');
            setSelectedCategory('ALL');
            setSearchQuery('');
          }}
        />
      </div>

      {/* Suppliers Table */}
      <InventoryDataTable
        columns={columns}
        data={filteredSuppliers}
        pageSize={10}
        emptyMessage={
          searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL'
            ? 'No approved purveyors match the applied filters.'
            : 'No suppliers registered in the directory yet.'
        }
        emptyAction={
          <button
            onClick={() => {
              setEditingSupplier(null);
              setIsSupplierModalOpen(true);
            }}
            className="btn-primary-3d px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard First Purveyor</span>
          </button>
        }
      />

      {/* Supplier Modal */}
      <SupplierFormModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setEditingSupplier(null);
        }}
        supplier={editingSupplier}
        onSuccess={() => {
          showToast(
            editingSupplier ? 'Purveyor Updated' : 'Purveyor Onboarded',
            editingSupplier ? 'Supplier profile updated successfully.' : 'New vendor registered in directory.',
            'success'
          );
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={!!supplierToDelete}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Remove Purveyor: ${supplierToDelete?.name}?`}
        message={`Are you sure you want to remove "${supplierToDelete?.name}" from the approved suppliers directory? Associated SKU records will remain in the catalog.`}
      />
    </div>
  );
};

export default ApprovedSuppliersPage;

