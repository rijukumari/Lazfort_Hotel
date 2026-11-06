import React, { useState, useMemo } from 'react';
import { PageHeader, Button, Modal, FormField, Input } from '../../../components/ui';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  User,
  BedDouble,
  Calendar,
  Send,
  Eye,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const INITIAL_LOST_ITEMS = [
  {
    id: 'LF-101',
    itemName: 'Cartier 18K Yellow Gold Love Bracelet',
    roomNumber: 'PH-1201',
    category: 'High Jewelry & Watches',
    dateFound: '2026-10-28',
    foundBy: 'Marie Laurent (Senior Valet)',
    description: 'Found inside master walk-in wardrobe velvet drawer.',
    guestName: 'Sir Alexander Kensington',
    guestContact: 'a.kensington@capitalgroup.co.uk',
    claimStatus: 'Secured in Vault',
    vaultBin: 'Vault-A / Compartment 14',
    claimedAt: null,
    claimedBy: null,
  },
  {
    id: 'LF-102',
    itemName: 'Patek Philippe Nautilus Presentation Box & Papers',
    roomNumber: 'ST-804',
    category: 'Luxury Accessories',
    dateFound: '2026-10-29',
    foundBy: 'Margaux Dubois (Head Butler)',
    description: 'Left on dressing vanity table adjacent to personal safe.',
    guestName: 'Dr. Vivienne Moreau',
    guestContact: 'v.moreau@geneve-clinic.ch',
    claimStatus: 'Claimed by Guest',
    vaultBin: 'Vault-B / Compartment 02',
    claimedAt: '2026-10-30 11:15',
    claimedBy: 'Dr. Vivienne Moreau (In Person / Passport ID)',
  },
  {
    id: 'LF-103',
    itemName: 'Montblanc Meisterstück Solitaire Platinum Pen',
    roomNumber: 'VL-301',
    category: 'Fine Writing Instruments',
    dateFound: '2026-10-30',
    foundBy: 'Jean-Luc Picard (Inspector)',
    description: 'Discovered between study desk mahogany blotter and phone.',
    guestName: 'Baron Mateo Rossi',
    guestContact: 'mateo.rossi@rossi-asset.mc',
    claimStatus: 'Secured in Vault',
    vaultBin: 'Vault-A / Compartment 22',
    claimedAt: null,
    claimedBy: null,
  },
  {
    id: 'LF-104',
    itemName: 'Bottega Veneta Intrecciato Leather Sunglasses Case',
    roomNumber: 'EX-510',
    category: 'Leather Goods',
    dateFound: '2026-10-27',
    foundBy: 'Elena Rostova (Chamber Specialist)',
    description: 'Found on private seaside balcony lounger table.',
    guestName: 'Countess Eleonora Rossi',
    guestContact: 'eleonora@monaco-yacht.mc',
    claimStatus: 'Shipped to Residence',
    vaultBin: 'Dispatched (DHL Sovereign Courier)',
    claimedAt: '2026-10-28 16:00',
    claimedBy: 'Courier Ref #DHL-MC-994821',
  },
];

export const LostAndFoundPage = () => {
  const { rooms } = useERP();
  const { showToast } = useToast();

  const [items, setItems] = useState(INITIAL_LOST_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Register New Item Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    itemName: '',
    roomNumber: rooms[0]?.roomNumber || '101',
    category: 'High Jewelry & Watches',
    foundBy: 'Marie Laurent',
    dateFound: new Date().toISOString().split('T')[0],
    description: '',
    guestName: '',
    guestContact: '',
    vaultBin: 'Vault-A / Compartment 05',
  });

  // Return Item Modal
  const [returnModalItem, setReturnModalItem] = useState(null);
  const [returnForm, setReturnForm] = useState({
    recipientName: '',
    idType: 'Passport / National ID Check',
    releaseMethod: 'In Person Handover',
    notes: 'Identity confirmed via front desk clearance.',
  });

  const handleRegisterItem = (e) => {
    e.preventDefault();
    if (!registerForm.itemName.trim()) {
      showToast('Validation Error', 'Please specify the item name.', 'error');
      return;
    }

    const newItem = {
      id: `LF-${Math.floor(100 + Math.random() * 900)}`,
      itemName: registerForm.itemName,
      roomNumber: registerForm.roomNumber,
      category: registerForm.category,
      dateFound: registerForm.dateFound,
      foundBy: registerForm.foundBy,
      description: registerForm.description,
      guestName: registerForm.guestName || 'Pending Guest Folio Lookup',
      guestContact: registerForm.guestContact || 'Front Desk Concierge',
      claimStatus: 'Secured in Vault',
      vaultBin: registerForm.vaultBin,
      claimedAt: null,
      claimedBy: null,
    };

    setItems(prev => [newItem, ...prev]);
    showToast(
      'Lost Item Logged & Secured',
      `Registered "${newItem.itemName}" from Suite ${newItem.roomNumber} into Central Security Vault.`,
      'success'
    );

    setIsRegisterModalOpen(false);
    setRegisterForm({
      itemName: '',
      roomNumber: rooms[0]?.roomNumber || '101',
      category: 'High Jewelry & Watches',
      foundBy: 'Marie Laurent',
      dateFound: new Date().toISOString().split('T')[0],
      description: '',
      guestName: '',
      guestContact: '',
      vaultBin: 'Vault-A / Compartment 05',
    });
  };

  const handleOpenReturnModal = (item) => {
    setReturnModalItem(item);
    setReturnForm({
      recipientName: item.guestName,
      idType: 'Passport / Sovereign Clearance',
      releaseMethod: 'In Person Handover',
      notes: `Vault security clearance signed by Duty Manager for ${item.guestName}.`,
    });
  };

  const handleConfirmReturn = (e) => {
    e.preventDefault();
    if (!returnModalItem) return;

    setItems(prev =>
      prev.map(i => {
        if (i.id === returnModalItem.id) {
          return {
            ...i,
            claimStatus: returnForm.releaseMethod === 'Dispatched via Courier' ? 'Shipped to Residence' : 'Claimed by Guest',
            claimedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            claimedBy: `${returnForm.recipientName} (${returnForm.releaseMethod})`,
          };
        }
        return i;
      })
    );

    showToast(
      'Item Successfully Returned',
      `"${returnModalItem.itemName}" formally released to ${returnForm.recipientName}. Vault custody logged.`,
      'success'
    );
    setReturnModalItem(null);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.itemName.toLowerCase().includes(q) ||
        item.roomNumber.toLowerCase().includes(q) ||
        item.guestName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || item.claimStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const securedCount = items.filter(i => i.claimStatus === 'Secured in Vault').length;
  const claimedCount = items.filter(i => i.claimStatus === 'Claimed by Guest' || i.claimStatus === 'Shipped to Residence').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Housekeeping Lost & Found Vault"
        description="High-security registry for guest valuables recovered during chamber turnovers, chain of custody logs, and return procedures."
        badge="Vault Custody"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Register Recovered Item
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Secured in Vault</span>
            <span className="font-serif font-bold text-2xl text-accent mt-1 block">
              {securedCount} Valuables
            </span>
            <span className="text-[11px] text-charcoal-muted">Protected under biometric lock</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Returned to Guests</span>
            <span className="font-serif font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1 block">
              {claimedCount} Items
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% resolution rate</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="card-luxury-3d p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-charcoal-muted tracking-wider block">Total Catalogued</span>
            <span className="font-serif font-bold text-2xl text-primary dark:text-white mt-1 block">
              {items.length} Records
            </span>
            <span className="text-[11px] text-charcoal-muted">Full audit trail preserved</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-charcoal-light/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="card-luxury-3d p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search by Item Name, Suite #, Guest Name, or Ref ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/80 dark:border-white/10 text-xs">
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'Secured in Vault', label: `In Vault (${securedCount})` },
            { id: 'Claimed by Guest', label: `Claimed (${items.filter(i => i.claimStatus === 'Claimed by Guest').length})` },
            { id: 'Shipped to Residence', label: `Shipped (${items.filter(i => i.claimStatus === 'Shipped to Residence').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'gold-gradient-bg text-primary-900 shadow-sm'
                  : 'text-charcoal-muted hover:text-primary dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="card-luxury-3d p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
          <h3 className="font-serif font-bold text-base text-primary dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            <span>Recovered Guest Articles Ledger</span>
          </h3>
          <span className="text-xs font-mono text-charcoal-muted">
            Showing {filteredItems.length} of {items.length} articles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 dark:border-white/10 text-[11px] font-mono uppercase text-charcoal-muted">
                <th className="pb-3 px-3">Item Ref</th>
                <th className="pb-3 px-3">Recovered Article</th>
                <th className="pb-3 px-3">Chamber / Date</th>
                <th className="pb-3 px-3">Registered Guest</th>
                <th className="pb-3 px-3">Found By Attendant</th>
                <th className="pb-3 px-3">Vault Location</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    No lost and found records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-ivory/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-accent">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <span className="font-semibold text-primary dark:text-white block truncate">
                        {item.itemName}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block truncate">
                        {item.description}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-primary dark:text-white block">
                        Suite {item.roomNumber}
                      </span>
                      <span className="text-[10px] text-charcoal-muted font-mono block">
                        {item.dateFound}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-primary dark:text-white block truncate">
                        {item.guestName}
                      </span>
                      <span className="text-[10px] text-charcoal-muted truncate block">
                        {item.guestContact}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-charcoal dark:text-gray-300">
                      {item.foundBy}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-charcoal-muted">
                      {item.vaultBin}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono inline-flex items-center gap-1.5 ${
                        item.claimStatus === 'Secured in Vault'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.claimStatus === 'Secured in Vault' ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        <span>{item.claimStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {item.claimStatus === 'Secured in Vault' ? (
                        <button
                          onClick={() => handleOpenReturnModal(item)}
                          className="px-3 py-1.5 rounded-lg gold-gradient-bg text-primary-900 text-[11px] font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity"
                        >
                          Return Item
                        </button>
                      ) : (
                        <span className="text-[11px] text-charcoal-muted font-mono">
                          Released {item.claimedAt?.split(' ')[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Item Handover Modal */}
      {returnModalItem && (
        <Modal
          isOpen={true}
          onClose={() => setReturnModalItem(null)}
          title={`Process Return — ${returnModalItem.id}`}
          description={`Release custody of "${returnModalItem.itemName}" from central security.`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-ivory/60 dark:bg-primary-950/40 border border-border/80 dark:border-white/10 space-y-1">
              <span className="font-mono text-accent text-[10px] font-bold block">
                Recovered Article #{returnModalItem.id}
              </span>
              <p className="font-semibold text-primary dark:text-white text-sm">
                {returnModalItem.itemName}
              </p>
              <p className="text-[11px] text-charcoal-muted">
                Suite {returnModalItem.roomNumber} • Stored at {returnModalItem.vaultBin}
              </p>
            </div>

            <FormField label="Recipient / Claimant Full Name" required>
              <Input
                value={returnForm.recipientName}
                onChange={e => setReturnForm(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="e.g. Sir Alexander Kensington"
                required
              />
            </FormField>

            <FormField label="Release Method" required>
              <select
                value={returnForm.releaseMethod}
                onChange={e => setReturnForm(prev => ({ ...prev, releaseMethod: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="In Person Handover">In-Person Handover (Front Desk Verification)</option>
                <option value="Dispatched via Courier">Dispatched via Sovereign Courier / DHL</option>
                <option value="Butler In-Suite Delivery">Head Butler In-Suite Handover</option>
              </select>
            </FormField>

            <FormField label="Identity Verification Method" required>
              <Input
                value={returnForm.idType}
                onChange={e => setReturnForm(prev => ({ ...prev, idType: e.target.value }))}
                placeholder="e.g. Passport inspection / Room key validation"
                required
              />
            </FormField>

            <FormField label="Chain of Custody Notes">
              <textarea
                rows={2}
                value={returnForm.notes}
                onChange={e => setReturnForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" type="button" onClick={() => setReturnModalItem(null)}>
                Cancel
              </Button>
              <Button variant="gold" type="submit">
                Authorize Release & Handover
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Register Found Item Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register Recovered Chamber Valuables"
        description="Catalogue article found during room turnover and log vault storage."
        maxWidth="lg"
      >
        <form onSubmit={handleRegisterItem} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Article Name & Brand" required>
              <Input
                placeholder="e.g. Rolex Submariner Date Watch"
                value={registerForm.itemName}
                onChange={e => setRegisterForm(prev => ({ ...prev, itemName: e.target.value }))}
                required
              />
            </FormField>

            <FormField label="Recovered in Suite #" required>
              <select
                value={registerForm.roomNumber}
                onChange={e => setRegisterForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.roomNumber} className="dark:bg-primary-950">
                    Suite {room.roomNumber} ({room.type})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Article Category" required>
              <select
                value={registerForm.category}
                onChange={e => setRegisterForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-semibold text-primary dark:text-white focus:outline-none focus:border-accent"
              >
                <option value="High Jewelry & Watches">High Jewelry & Watches</option>
                <option value="Electronics & Mobile">Smartphones & Electronics</option>
                <option value="Leather Goods">Luxury Handbags & Leather Goods</option>
                <option value="Fine Writing Instruments">Fine Writing Instruments</option>
                <option value="Passports & Documents">Passports & Confidential Documents</option>
              </select>
            </FormField>

            <FormField label="Found by Attendant" required>
              <Input
                value={registerForm.foundBy}
                onChange={e => setRegisterForm(prev => ({ ...prev, foundBy: e.target.value }))}
                required
              />
            </FormField>

            <FormField label="Discovery Date" required>
              <Input
                type="date"
                value={registerForm.dateFound}
                onChange={e => setRegisterForm(prev => ({ ...prev, dateFound: e.target.value }))}
                required
              />
            </FormField>

            <FormField label="Vault Storage Compartment" required>
              <Input
                value={registerForm.vaultBin}
                onChange={e => setRegisterForm(prev => ({ ...prev, vaultBin: e.target.value }))}
                placeholder="e.g. Vault-A / Bin 12"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Registered Resident / Guest Name">
              <Input
                placeholder="e.g. Lord Alexander Sinclair"
                value={registerForm.guestName}
                onChange={e => setRegisterForm(prev => ({ ...prev, guestName: e.target.value }))}
              />
            </FormField>

            <FormField label="Guest Contact / Folio Reference">
              <Input
                placeholder="e.g. alexander@sovereign.mc"
                value={registerForm.guestContact}
                onChange={e => setRegisterForm(prev => ({ ...prev, guestContact: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="Exact Chamber Location & Physical Description">
            <textarea
              rows={2}
              value={registerForm.description}
              onChange={e => setRegisterForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. Discovered under bedside ottoman cushion inside silk pouch..."
              className="w-full px-3 py-2 rounded-xl bg-ivory/60 dark:bg-primary-900 border border-border/80 dark:border-white/10 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
            <Button variant="outline" type="button" onClick={() => setIsRegisterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              Catalogue in Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LostAndFoundPage;
