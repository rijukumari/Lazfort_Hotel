import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  PackageSearch,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  BedDouble,
  Tag,
  Key,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HousekeepingServicesPage = () => {
  const { showToast } = useToast();

  // Mode: 'list' | 'log'
  const [viewMode, setViewMode] = useState('list');

  const [lostItems, setLostItems] = useState([
    {
      id: 'LNF-2026-104',
      item: 'Cartier Gold Diamond Tennis Bracelet',
      suite: 'Suite 801 (Presidential Penthouse)',
      guestName: 'Lady Eleanor Vance',
      category: 'Jewelry & Valuables',
      foundDate: '2026-10-30',
      foundBy: 'Svetlana Ivanova (Head Housekeeper)',
      vaultRef: 'Safe Vault B - Shelf 04',
      status: 'Stored in Safe Vault',
    },
    {
      id: 'LNF-2026-102',
      item: 'Apple MacBook Pro 16" (Space Black)',
      suite: 'Suite 502 (Executive Marina Suite)',
      guestName: 'Viktor Romanov',
      category: 'Electronics',
      foundDate: '2026-10-28',
      foundBy: 'Marco Bellini',
      vaultRef: 'Safe Vault A - Locker 12',
      status: 'Returned to Guest',
      returnedDate: '2026-10-29',
    },
    {
      id: 'LNF-2026-099',
      item: 'Hermès Silk Scarf (Vintage Edition)',
      suite: 'Riviera Poolside Cabana #4',
      guestName: 'Sophia Loren Guest',
      category: 'Clothing & Apparel',
      foundDate: '2026-10-26',
      foundBy: 'Housekeeping Valet Lead',
      vaultRef: 'Safe Vault C - Compartment 02',
      status: 'Stored in Safe Vault',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [logForm, setLogForm] = useState({
    item: '',
    suite: 'Suite 801 (Presidential Penthouse)',
    guestName: '',
    category: 'Jewelry & Valuables',
    vaultRef: 'Safe Vault B - Shelf 05',
    notes: '',
  });

  const handleLogItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: `LNF-2026-${Math.floor(105 + Math.random() * 50)}`,
      item: logForm.item,
      suite: logForm.suite,
      guestName: logForm.guestName || 'In-House Guest',
      category: logForm.category,
      foundDate: new Date().toISOString().split('T')[0],
      foundBy: 'Logged by Housekeeping Specialist',
      vaultRef: logForm.vaultRef,
      status: 'Stored in Safe Vault',
    };

    setLostItems([newItem, ...lostItems]);
    setViewMode('list');
    setLogForm({
      item: '',
      suite: 'Suite 801 (Presidential Penthouse)',
      guestName: '',
      category: 'Jewelry & Valuables',
      vaultRef: 'Safe Vault B - Shelf 05',
      notes: '',
    });
    showToast(
      'Lost Property Logged',
      `${newItem.item} safely logged in vault registry (${newItem.id}).`,
      'success'
    );
  };

  const handleReturnToGuest = (item) => {
    setLostItems(prev =>
      prev.map(i =>
        i.id === item.id
          ? {
            ...i,
            status: 'Returned to Guest',
            returnedDate: new Date().toISOString().split('T')[0],
          }
          : i
      )
    );
    showToast(
      'Item Returned & Signed Off',
      `${item.item} released to guest verification receipt.`,
      'success'
    );
  };

  const filteredItems = lostItems.filter(i =>
    i.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.suite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FULL PAGE VIEW: LOG FOUND PROPERTY
  if (viewMode === 'log') {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <PageHeader
          title="Log Recovered Guest Belonging to Vault"
          description="Register recovered high-value item into the sovereign security vault custody system."
          badge="Vault Registry Terminal"
          actions={
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              Back to Lost & Found Registry
            </button>
          }
        />

        <div className="max-w-4xl mx-auto card-luxury-3d p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-border/80 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary dark:text-white">
                Custody Ingestion Parameters
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Every logged belonging generates a digital tracking number and tamper-seal voucher.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogItem} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Item Description & Brand
              </label>
              <input
                type="text"
                placeholder="e.g. Rolex Submariner Date (Silver/Blue) or Cartier Ring"
                value={logForm.item}
                onChange={e => setLogForm({ ...logForm, item: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Chamber / Suite / Area Recovered
                </label>
                <input
                  type="text"
                  value={logForm.suite}
                  onChange={e => setLogForm({ ...logForm, suite: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Registered Guest Name (If Known)
                </label>
                <input
                  type="text"
                  placeholder="Guest name or in-house folio..."
                  value={logForm.guestName}
                  onChange={e => setLogForm({ ...logForm, guestName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Property Category
                </label>
                <select
                  value={logForm.category}
                  onChange={e => setLogForm({ ...logForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                >
                  <option value="Jewelry & Valuables">Jewelry & Valuables</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing & Apparel">Clothing & Apparel</option>
                  <option value="Documents & Passport">Documents & Passport</option>
                  <option value="Personal Luggage">Personal Luggage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Assigned Vault Safe Locker
                </label>
                <input
                  type="text"
                  value={logForm.vaultRef}
                  onChange={e => setLogForm({ ...logForm, vaultRef: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ivory dark:bg-primary-900 border border-primary-500/20 text-xs text-primary dark:text-white focus:outline-none focus:border-accent font-medium shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80 dark:border-white/10">
              <span className="text-[11px] text-charcoal-muted font-mono">
                Item will be stored under 24/7 CCTV surveillance
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Lock into Vault Registry
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: LOST PROPERTY REGISTRY
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Housekeeping Services & Lost Property Registry"
        description="Official custody vault for left guest belongings, special amenities delivery, and turn-down services."
        badge="Sovereign Vault Registry"
        actions={
          <button
            type="button"
            onClick={() => setViewMode('log')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gold-gradient-bg text-primary-900 text-xs font-bold uppercase tracking-wider btn-3d shadow-gold"
          >
            <Plus className="w-4 h-4" />
            Log Found Property
          </button>
        }
      />

      {/* KPI Stats */}
      <StatsGrid columns={3}>
        <StatCard
          title="Items in Vault Custody"
          value={lostItems.filter(i => i.status.includes('Vault')).length}
          change="Secured in Biometric Safe"
          isPositive={true}
          iconName="ShieldCheck"
          subtitle="Monaco Vault Chamber"
        />
        <StatCard
          title="Returned to Guests"
          value={lostItems.filter(i => i.status.includes('Returned')).length}
          change="100% Verified Handover"
          isPositive={true}
          iconName="CheckCircle"
          subtitle="Signed Digital Receipts"
        />
        <StatCard
          title="Vault Security Inspection"
          value="Passed (Audit Level 5)"
          change="Audited Today by Security"
          isPositive={true}
          iconName="Sparkles"
          subtitle="Tamper-proof seals"
        />
      </StatsGrid>

      {/* Lost & Found Registry Table */}
      <div className="card-luxury-3d overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/70 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Custody Registry & Safe Vault Storage
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">
              Audit log of items found in hotel chambers, public salons, and cabanas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search items, suite..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-3.5 py-1.5 text-xs bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Tag Ref</th>
                <th className="py-3.5 px-4">Item Description</th>
                <th className="py-3.5 px-4">Chamber / Location</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Found Date & Staff</th>
                <th className="py-3.5 px-4">Vault Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-accent">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-primary dark:text-white">
                    {item.item}
                    {item.guestName && (
                      <span className="block text-[11px] text-charcoal-muted font-normal">
                        Registered Guest: {item.guestName}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-primary dark:text-gray-200">
                    {item.suite}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-accent">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs block">{item.foundDate}</span>
                    <span className="text-[11px] text-charcoal-muted">{item.foundBy}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                    {item.vaultRef}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${item.status.includes('Returned')
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        }`}
                    >
                      {item.status.includes('Returned') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status !== 'Returned to Guest' ? (
                      <button
                        type="button"
                        onClick={() => handleReturnToGuest(item)}
                        className="px-3 py-1.5 rounded-xl gold-gradient-bg text-primary-900 font-bold text-xs btn-3d shadow-gold"
                      >
                        Release to Guest
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-500 font-mono">
                        Handed Over
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingServicesPage;
