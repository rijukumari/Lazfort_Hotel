import React, { useState } from 'react';
import { PageHeader, StatCard, Button, StatusBadge, Modal, FormField, Input, Select, Tabs } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  Tag,
  Percent,
  Sparkles,
  Gift,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  Copy,
  Layers
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const MarketingPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('offers');

  const [offers, setOffers] = useState([
    {
      id: 'OFF-1',
      title: 'Monaco Grand Prix VIP Weekend',
      category: 'Seasonal Package',
      discount: '15% Off',
      validUntil: '2027-05-30',
      minStay: '3 Nights',
      status: 'active',
      code: 'GRANDPRIX27',
      applicableSuites: 'Presidential Suites & Penthouses',
    },
    {
      id: 'OFF-2',
      title: 'Royal Honeymoon & Spa Escape',
      category: 'Experience Package',
      discount: '$500 Spa Credit',
      validUntil: '2027-12-31',
      minStay: '2 Nights',
      status: 'active',
      code: 'ROYALSPA',
      applicableSuites: 'Deluxe Ocean Villas',
    },
    {
      id: 'OFF-3',
      title: 'Early Bird Riviera Advance Booking',
      category: 'Early Reservation',
      discount: '20% Off',
      validUntil: '2027-03-31',
      minStay: '4 Nights',
      status: 'active',
      code: 'RIVIERA20',
      applicableSuites: 'All Suite Categories',
    },
    {
      id: 'OFF-4',
      title: 'Yacht Show Port Hercule Access',
      category: 'Special Event',
      discount: 'Chauffeur + Helipad',
      validUntil: '2026-11-15',
      minStay: '5 Nights',
      status: 'expired',
      code: 'YACHTSHOW',
      applicableSuites: 'Royal Penthouses',
    },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Seasonal Package',
    discount: '',
    code: '',
    validUntil: '',
    minStay: '2 Nights',
    applicableSuites: 'All Suite Categories',
  });

  const handleCreateOffer = (e) => {
    e.preventDefault();
    const newOffer = {
      id: `OFF-${Date.now().toString().slice(-4)}`,
      ...formData,
      status: 'active',
    };
    setOffers([newOffer, ...offers]);
    setCreateModalOpen(false);
    setFormData({
      title: '',
      category: 'Seasonal Package',
      discount: '',
      code: '',
      validUntil: '',
      minStay: '2 Nights',
      applicableSuites: 'All Suite Categories',
    });
    showToast('Promotion Created', `Promotional package ${newOffer.title} is now active.`, 'success');
  };

  const handleDeleteOffer = (id) => {
    setOffers(offers.filter(o => o.id !== id));
    showToast('Offer Removed', 'Promotional offer removed from active catalog.', 'info');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast('Code Copied', `Promo code ${code} copied to clipboard.`, 'success');
  };

  const columns = [
    {
      key: 'title',
      header: 'Promotional Campaign',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.title}</p>
          <span className="text-[11px] text-accent font-medium">{item.category}</span>
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Promo Code',
      sortable: true,
      render: item => (
        <button
          onClick={() => handleCopyCode(item.code)}
          className="px-2 py-1 rounded bg-accent/10 border border-accent/30 font-mono text-accent text-xs font-bold hover:bg-accent/20 flex items-center gap-1 active:scale-95"
          title="Click to copy promo code"
        >
          <Copy className="w-3 h-3" />
          <span>{item.code}</span>
        </button>
      ),
    },
    {
      key: 'discount',
      header: 'Benefit / Discount',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400 text-xs">
          {item.discount}
        </span>
      ),
    },
    {
      key: 'validity',
      header: 'Terms & Validity',
      sortable: true,
      render: item => (
        <div className="text-xs">
          <p className="text-charcoal-muted">Valid until {item.validUntil}</p>
          <p className="text-[10px] text-charcoal-muted font-mono">{item.minStay} Min Stay</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          item.status === 'active'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-charcoal/10 dark:bg-white/10 text-charcoal-muted border border-border/80'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleDeleteOffer(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete Promotion"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Offers, Packages & Marketing Engine"
        description="Curate promotional discounts, bespoke hospitality packages, VIP privilege coupons, and banner campaigns."
        badge={`${offers.filter(o => o.status === 'active').length} Active Campaigns`}
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Promotional Offer
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Promotions"
          value={offers.filter(o => o.status === 'active').length}
          change="Publicly redeemable"
          isPositive={true}
          icon={Tag}
          subtitle="Direct booking engine"
        />
        <StatCard
          title="Promotional Revenue"
          value="$384,500"
          change="+24% conversion lift"
          isPositive={true}
          icon={Sparkles}
          subtitle="Generated via campaigns"
        />
        <StatCard
          title="Voucher Redemptions"
          value="142 Stays"
          change="Grand Prix leading"
          isPositive={true}
          icon={Gift}
          subtitle="Validated this quarter"
        />
        <StatCard
          title="Average Discount Impact"
          value="16.2%"
          change="Maintains 82% margin"
          isPositive={true}
          icon={Percent}
          subtitle="Yield protected"
        />
      </div>

      <DataTable
        data={offers}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search offers by campaign name, code, or suite category..."
        pageSize={8}
      />

      {/* Create Offer Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Promotional Campaign"
        >
          <form onSubmit={handleCreateOffer} className="space-y-4">
            <FormField label="Campaign Title">
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Monte-Carlo Jazz Festival Package"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Promotion Code">
                <Input
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. JAZZ2027"
                  required
                />
              </FormField>

              <FormField label="Discount / Value Benefit">
                <Input
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="e.g. 15% Off or $300 Dining Credit"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Offer Category">
                <Select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'Seasonal Package', label: 'Seasonal Package' },
                    { value: 'Experience Package', label: 'Experience Package' },
                    { value: 'Early Reservation', label: 'Early Reservation' },
                    { value: 'VIP Privilege', label: 'VIP Privilege' },
                  ]}
                />
              </FormField>

              <FormField label="Valid Until Date">
                <Input
                  type="date"
                  value={formData.validUntil}
                  onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Publish Campaign
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MarketingPage;

