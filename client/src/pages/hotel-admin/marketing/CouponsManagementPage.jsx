import React, { useState } from 'react';
import { PageHeader, StatCard, Button, FormField, Input, Select, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { Ticket, Plus, Trash2, Calendar, Copy, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const CouponsManagementPage = () => {
  const { showToast } = useToast();

  const [coupons, setCoupons] = useState([
    {
      id: 'CPN-1',
      code: 'SOVEREIGN25',
      description: 'Exclusive 25% discount for Monaco Yacht Club members',
      discountType: 'Percentage (25%)',
      validUntil: '2027-06-30',
      minSpend: '$2,500',
      usesCount: 48,
      status: 'active',
    },
    {
      id: 'CPN-2',
      code: 'ROYALSPA100',
      description: '$100 complimentary Thalasso Sanctuary voucher',
      discountType: 'Fixed Credit ($100)',
      validUntil: '2027-12-31',
      minSpend: '$1,000',
      usesCount: 89,
      status: 'active',
    },
    {
      id: 'CPN-3',
      code: 'VIPDINE2026',
      description: 'Michelin 3-Star Sommelier wine pairing inclusion',
      discountType: 'Experience Gift',
      validUntil: '2026-12-15',
      minSpend: '$1,800',
      usesCount: 120,
      status: 'active',
    },
    {
      id: 'CPN-4',
      code: 'AUTUMN500',
      description: 'Past seasonal executive retreat promotion',
      discountType: 'Fixed Credit ($500)',
      validUntil: '2026-10-01',
      minSpend: '$5,000',
      usesCount: 62,
      status: 'expired',
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'Percentage (15%)',
    minSpend: '$1,500',
    validUntil: '2027-12-31',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const newCoupon = {
      id: `CPN-${Date.now()}`,
      code: formData.code.toUpperCase().trim(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      validUntil: formData.validUntil,
      minSpend: formData.minSpend,
      usesCount: 0,
      status: 'active',
    };

    setCoupons([newCoupon, ...coupons]);
    setIsCreateOpen(false);
    setFormData({ code: '', description: '', discountType: 'Percentage (15%)', minSpend: '$1,500', validUntil: '2027-12-31' });
    if (showToast) showToast('VIP Coupon Created', `Voucher code ${newCoupon.code} published.`, 'success');
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
    if (showToast) showToast('Coupon Removed', 'Voucher deleted from registry.', 'info');
  };

  const columns = [
    {
      key: 'code',
      header: 'Voucher Code',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-accent px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/25 text-xs">
            {item.code}
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(item.code);
              if (showToast) showToast('Code Copied', `Copied ${item.code} to clipboard`, 'info');
            }}
            className="p-1 text-muted-foreground hover:text-accent transition-colors"
            title="Copy Code"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description & Benefit',
      render: (item) => (
        <div>
          <p className="text-xs font-semibold text-foreground">{item.description}</p>
          <p className="text-[11px] text-accent font-medium mt-0.5">{item.discountType}</p>
        </div>
      ),
    },
    {
      key: 'requirements',
      header: 'Min Spend & Validity',
      render: (item) => (
        <div className="text-xs">
          <span className="text-foreground font-medium block">Min: {item.minSpend}</span>
          <span className="text-[11px] text-muted-foreground">Expires: {item.validUntil}</span>
        </div>
      ),
    },
    {
      key: 'usesCount',
      header: 'Redemptions',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {item.usesCount} Stays
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            item.status === 'active'
              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
              : 'bg-muted/30 text-muted-foreground border-border'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <button
          onClick={() => handleDelete(item.id)}
          className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
          title="Delete Voucher"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="VIP Privilege Coupons & Vouchers"
        description="Exclusive digital voucher codes, diplomatic discounts, and tracked promotional redemption quotas."
        actions={
          <Button variant="gold" icon={Plus} onClick={() => setIsCreateOpen(true)}>
            Issue New VIP Coupon
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Vouchers"
          value={coupons.filter(c => c.status === 'active').length}
          subtitle="Currently redeemable"
          icon={Ticket}
        />
        <StatCard
          title="Total Redemptions"
          value={coupons.reduce((acc, c) => acc + c.usesCount, 0)}
          subtitle="Guest reservations applied"
          icon={CheckCircle2}
        />
        <StatCard
          title="Yield Protection"
          value="100% Monitored"
          subtitle="Minimum spend threshold locked"
          icon={ShieldCheck}
        />
      </div>

      <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
        <DataTable data={coupons} columns={columns} searchPlaceholder="Search by voucher code or benefit..." />
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Issue New Privilege Coupon Code"
        description="Configure promotional coupon rules, discount values, and expiration parameters."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Coupon Code" required>
            <Input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. MONACOVIP30"
              required
            />
          </FormField>

          <FormField label="Benefit Description" required>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. 20% discount on Grand Diplomatic Penthouse"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Discount Type">
              <Select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="Percentage (10%)">10% Off</option>
                <option value="Percentage (15%)">15% Off</option>
                <option value="Percentage (25%)">25% Off</option>
                <option value="Fixed Credit ($250)">$250 Suite Credit</option>
                <option value="Fixed Credit ($500)">$500 Suite Credit</option>
              </Select>
            </FormField>

            <FormField label="Min Spend Required">
              <Input
                value={formData.minSpend}
                onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                placeholder="$2,000"
              />
            </FormField>
          </div>

          <FormField label="Expiration Date">
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              Publish Coupon Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CouponsManagementPage;

