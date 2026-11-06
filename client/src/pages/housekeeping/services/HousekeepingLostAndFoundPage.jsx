import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge, Modal } from '../../../components/ui';
import { StatCard } from '../../../components/ui/StatCard';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  PackageSearch,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BedDouble,
  Lock,
  User,
  Eye,
  RotateCcw,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const HousekeepingLostAndFoundPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Lost & Found registry state
  const [items, setItems] = useState([
    {
      id: 'LNF-2026-104',
      item: 'Cartier 18K Yellow Gold Love Bracelet',
      suite: 'Suite 801 (Presidential Penthouse)',
      roomNumber: '801',
      guestName: 'Lady Eleanor Vance',
      guestContact: 'e.vance@vance-holdings.co.uk',
      category: 'Fine Jewelry & Watches',
      foundDate: '2026-10-30',
      foundBy: 'Svetlana Ivanova (Head Housekeeper)',
      vaultRef: 'Safe Vault B - Shelf 04',
      custodyStatus: 'Secured in Treasury Vault',
      returnStatus: 'Unclaimed',
      notes: 'Discovered inside master walk-in wardrobe velvet drawer during departure turnover.',
    },
    {
      id: 'LNF-2026-102',
      item: 'Apple MacBook Pro 16" (Space Black)',
      suite: 'Suite 502 (Executive Marina Suite)',
      roomNumber: '502',
      guestName: 'Viktor Romanov',
      guestContact: 'v.romanov@nordicinvest.se',
      category: 'Electronics & Computing',
      foundDate: '2026-10-28',
      foundBy: 'Marco Bellini (Turnover Specialist)',
      vaultRef: 'Safe Vault A - Locker 12',
      custodyStatus: 'Returned to Guest',
      returnStatus: 'Returned',
      returnedDate: '2026-10-29',
      notes: 'Hand-delivered to guest courier upon identity verification.',
    },
    {
      id: 'LNF-2026-099',
      item: 'Hermès Vintage Silk Foulard Scarf',
      suite: 'Riviera Poolside Cabana #4',
      roomNumber: 'Cabana 4',
      guestName: 'Contessa Beatrice Rossi',
      guestContact: 'beatrice.rossi@milano-atelier.it',
      category: 'Luxury Apparel & Fashion',
      foundDate: '2026-10-26',
      foundBy: 'Marie Laurent (Senior Valet)',
      vaultRef: 'Safe Vault C - Compartment 02',
      custodyStatus: 'Secured in Treasury Vault',
      returnStatus: 'Unclaimed',
      notes: 'Folded on teak lounge chair. Logged into sealed velvet preservation pouch.',
    },
    {
      id: 'LNF-2026-095',
      item: 'Montblanc Meisterstück 149 Platinum Fountain Pen',
      suite: 'Suite 703 (Diplomatic Suite)',
      roomNumber: '703',
      guestName: 'Hon. Arthur Pendelton',
      guestContact: 'a.pendelton@chamber.gov',
      category: 'Luxury Accessories',
      foundDate: '2026-10-24',
      foundBy: 'Elena Rostova (Lead Butler)',
      vaultRef: 'Safe Vault A - Drawer 08',
      custodyStatus: 'Claim In Progress',
      returnStatus: 'Pending Dispatch',
      notes: 'Found on mahogany library desk. Guest contacted via verified concierge email.',
    },
  ]);

  const [logForm, setLogForm] = useState({
    item: '',
    suite: 'Suite 101',
    guestName: '',
    guestContact: '',
    category: 'Fine Jewelry & Watches',
    foundBy: 'Housekeeping Specialist',
    vaultRef: 'Safe Vault B - Shelf 01',
    notes: '',
  });

  const handleReturnToGuest = (item) => {
    setItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, returnStatus: 'Returned', custodyStatus: 'Returned to Guest', returnedDate: new Date().toISOString().split('T')[0] } : i))
    );
    showToast('Item Released', `Property ${item.id} logged as verified and returned to ${item.guestName}.`, 'success');
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!logForm.item.trim()) {
      showToast('Validation Error', 'Item description is required.', 'error');
      return;
    }

    const newId = `LNF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newItem = {
      id: newId,
      item: logForm.item.trim(),
      suite: logForm.suite,
      roomNumber: logForm.suite.replace(/\D/g, '') || '101',
      guestName: logForm.guestName.trim() || 'Unidentified Guest',
      guestContact: logForm.guestContact.trim() || 'On Record',
      category: logForm.category,
      foundDate: new Date().toISOString().split('T')[0],
      foundBy: logForm.foundBy,
      vaultRef: logForm.vaultRef,
      custodyStatus: 'Secured in Treasury Vault',
      returnStatus: 'Unclaimed',
      notes: logForm.notes.trim() || 'Logged during housekeeping turnover.',
    };

    setItems([newItem, ...items]);
    setIsLogModalOpen(false);
    setLogForm({
      item: '',
      suite: 'Suite 101',
      guestName: '',
      guestContact: '',
      category: 'Fine Jewelry & Watches',
      foundBy: 'Housekeeping Specialist',
      vaultRef: 'Safe Vault B - Shelf 01',
      notes: '',
    });
    showToast('Property Registered', `Item ${newId} placed under vault custody.`, 'success');
  };

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        i.id.toLowerCase().includes(q) ||
        i.item.toLowerCase().includes(q) ||
        i.guestName.toLowerCase().includes(q) ||
        i.suite.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unclaimed' && i.returnStatus === 'Unclaimed') ||
        (statusFilter === 'returned' && i.returnStatus === 'Returned') ||
        (statusFilter === 'in_progress' && i.returnStatus === 'Pending Dispatch');

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const columns = [
    {
      key: 'id',
      header: 'Registry Ref',
      render: (i) => (
        <div>
          <span className="font-mono text-xs font-bold text-accent">{i.id}</span>
          <span className="block text-[10px] text-charcoal-muted dark:text-gray-400">{i.foundDate}</span>
        </div>
      ),
    },
    {
      key: 'item',
      header: 'Found Property',
      render: (i) => (
        <div className="max-w-xs">
          <p className="font-serif font-bold text-sm text-primary dark:text-white truncate">
            {i.item}
          </p>
          <span className="badge badge-gold font-mono text-[10px] px-2 py-0.5 mt-0.5">
            {i.category}
          </span>
        </div>
      ),
    },
    {
      key: 'suite',
      header: 'Location / Suite',
      render: (i) => (
        <div>
          <span className="text-xs font-bold text-primary dark:text-white block">{i.suite}</span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400">By {i.foundBy}</span>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Ownership',
      render: (i) => (
        <div>
          <span className="text-xs font-medium text-primary dark:text-white block">{i.guestName}</span>
          <span className="text-[10px] text-charcoal-muted dark:text-gray-400 truncate block max-w-[120px]">{i.guestContact}</span>
        </div>
      ),
    },
    {
      key: 'vaultRef',
      header: 'Treasury Custody',
      render: (i) => (
        <div className="flex items-center gap-1.5 text-xs text-charcoal dark:text-gray-300">
          <Lock className="w-3.5 h-3.5 text-accent" />
          <span>{i.vaultRef}</span>
        </div>
      ),
    },
    {
      key: 'returnStatus',
      header: 'Custody Status',
      render: (i) => (
        <StatusBadge
          status={i.returnStatus === 'Returned' ? 'completed' : i.returnStatus === 'Pending Dispatch' ? 'pending' : 'cancelled'}
          label={i.returnStatus}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (i) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedItem(i)}
          >
            Details
          </Button>
          {i.returnStatus !== 'Returned' && (
            <Button
              variant="outline"
              size="xs"
              icon={CheckCircle2}
              onClick={() => handleReturnToGuest(i)}
            >
              Release
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lost & Found Registry"
        subtitle="Secure high-value property custody, guest claims management, and vault preservation logs."
        icon={PackageSearch}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsLogModalOpen(true)}
          >
            Log Found Property
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Items"
          value={items.length}
          subtitle="Vault custody entries"
          icon={PackageSearch}
        />
        <StatCard
          title="Secured in Treasury Vault"
          value={items.filter(i => i.returnStatus === 'Unclaimed').length}
          subtitle="Awaiting guest verification"
          icon={Lock}
        />
        <StatCard
          title="Returned to Guest"
          value={items.filter(i => i.returnStatus === 'Returned').length}
          subtitle="Successfully repatriated"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Dispatch"
          value={items.filter(i => i.returnStatus === 'Pending Dispatch').length}
          subtitle="Courier / concierge routing"
          icon={Clock}
        />
      </div>

      {/* Table & Controls */}
      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search by registry ref, item, guest, suite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Custody Statuses</option>
              <option value="unclaimed">Secured (Unclaimed)</option>
              <option value="in_progress">Pending Dispatch</option>
              <option value="returned">Returned to Guest</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredItems}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No lost and found records match your search criteria."
        />
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log Found Luxury Property"
        >
          <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-charcoal-muted dark:text-gray-400 mb-1">Item Title & Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Patek Philippe Nautilus or Goyard Leather Wallet"
                value={logForm.item}
                onChange={(e) => setLogForm({ ...logForm, item: e.target.value })}
                className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-muted dark:text-gray-400 mb-1">Found Location / Suite</label>
                <input
                  type="text"
                  placeholder="e.g. Suite 801 or Helipad Lounge"
                  value={logForm.suite}
                  onChange={(e) => setLogForm({ ...logForm, suite: e.target.value })}
                  className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-charcoal-muted dark:text-gray-400 mb-1">Item Category</label>
                <select
                  value={logForm.category}
                  onChange={(e) => setLogForm({ ...logForm, category: e.target.value })}
                  className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
                >
                  <option value="Fine Jewelry & Watches">Fine Jewelry & Watches</option>
                  <option value="Electronics & Computing">Electronics & Computing</option>
                  <option value="Luxury Apparel & Fashion">Luxury Apparel & Fashion</option>
                  <option value="Luxury Accessories">Luxury Accessories</option>
                  <option value="Travel Documents & Identification">Travel Documents & ID</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-muted dark:text-gray-400 mb-1">Registered Guest Name</label>
                <input
                  type="text"
                  placeholder="Guest name if known"
                  value={logForm.guestName}
                  onChange={(e) => setLogForm({ ...logForm, guestName: e.target.value })}
                  className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-charcoal-muted dark:text-gray-400 mb-1">Treasury Vault Locker</label>
                <input
                  type="text"
                  value={logForm.vaultRef}
                  onChange={(e) => setLogForm({ ...logForm, vaultRef: e.target.value })}
                  className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted dark:text-gray-400 mb-1">Preservation Notes</label>
              <textarea
                rows="2"
                placeholder="Details of condition, markings, or security seal number..."
                value={logForm.notes}
                onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                className="luxury-input w-full px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsLogModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Lock}
              >
                Save to Vault Ledger
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Property Dossier • ${selectedItem.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-charcoal-bg dark:bg-[#080d19] border border-primary/10 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Property Description:</span>
                <span className="font-bold text-primary dark:text-white text-sm">{selectedItem.item}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Location Found:</span>
                <span className="text-primary dark:text-white font-medium">{selectedItem.suite}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Guest Claim Name:</span>
                <span className="text-accent font-bold">{selectedItem.guestName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Contact Address:</span>
                <span className="text-charcoal dark:text-gray-300">{selectedItem.guestContact}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted dark:text-gray-400">Treasury Vault Locker:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedItem.vaultRef}</span>
              </div>
              <div className="pt-2 border-t border-primary/10 dark:border-white/5">
                <span className="text-charcoal-muted dark:text-gray-400 block mb-1">Preservation Notes:</span>
                <p className="text-primary dark:text-white italic">{selectedItem.notes}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HousekeepingLostAndFoundPage;

