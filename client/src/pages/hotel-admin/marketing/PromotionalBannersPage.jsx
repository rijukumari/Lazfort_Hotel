import React, { useState } from 'react';
import { PageHeader, StatCard, Button, FormField, Input, Select, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { Image, Plus, Trash2, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const PromotionalBannersPage = () => {
  const { showToast } = useToast();

  const [banners, setBanners] = useState([
    {
      id: 'BAN-1',
      title: 'Monaco Grand Prix 2027 Pre-Booking Showcase',
      placement: 'Guest Portal Hero Billboard',
      targetUrl: '/booking/monaco-grand-prix',
      impressions: 48500,
      clicks: 3420,
      ctr: '7.05%',
      status: 'active',
    },
    {
      id: 'BAN-2',
      title: 'Royal Thalasso Sanctuary Winter Wellness Pass',
      placement: 'In-Suite Smart Console & TV',
      targetUrl: '/amenities/spa',
      impressions: 21900,
      clicks: 1890,
      ctr: '8.63%',
      status: 'active',
    },
    {
      id: 'BAN-3',
      title: 'Michelin Star Chef Laurent Vane Seasonal Tasting Menu',
      placement: 'Restaurant & Dining Sub-Hero',
      targetUrl: '/restaurant/menu',
      impressions: 34100,
      clicks: 2950,
      ctr: '8.65%',
      status: 'active',
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    placement: 'Guest Portal Hero Billboard',
    targetUrl: '/booking',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newBanner = {
      id: `BAN-${Date.now()}`,
      title: formData.title.trim(),
      placement: formData.placement,
      targetUrl: formData.targetUrl.trim(),
      impressions: 0,
      clicks: 0,
      ctr: '0.00%',
      status: 'active',
    };

    setBanners([newBanner, ...banners]);
    setIsCreateOpen(false);
    setFormData({ title: '', placement: 'Guest Portal Hero Billboard', targetUrl: '/booking' });
    if (showToast) showToast('Campaign Banner Deployed', `Banner ${newBanner.title} activated.`, 'success');
  };

  const handleDelete = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    if (showToast) showToast('Banner Removed', 'Banner deactivated.', 'info');
  };

  const columns = [
    {
      key: 'title',
      header: 'Campaign Banner Title',
      render: (item) => (
        <div>
          <h4 className="font-serif font-bold text-sm text-foreground">{item.title}</h4>
          <span className="text-[11px] text-accent font-medium">{item.placement}</span>
        </div>
      ),
    },
    {
      key: 'targetUrl',
      header: 'Destination Link',
      render: (item) => (
        <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
          {item.targetUrl}
          <ExternalLink className="w-3 h-3 text-accent" />
        </span>
      ),
    },
    {
      key: 'impressions',
      header: 'Impressions / Clicks',
      render: (item) => (
        <div className="text-xs">
          <span className="font-semibold text-foreground">{item.impressions.toLocaleString()} views</span>
          <span className="text-muted-foreground text-[11px] block">{item.clicks.toLocaleString()} clicks</span>
        </div>
      ),
    },
    {
      key: 'ctr',
      header: 'Conversion CTR',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">
          {item.ctr}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
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
          title="Delete Banner"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Promotional Banners & Billboard Placements"
        description="High-resolution visual banner placements across the guest booking portal, mobile app, and in-suite interactive TV consoles."
        actions={
          <Button variant="gold" icon={Plus} onClick={() => setIsCreateOpen(true)}>
            Deploy New Banner
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Billboard Slots"
          value={banners.length}
          subtitle="Broadcasting across portals"
          icon={Image}
        />
        <StatCard
          title="Total Impressions"
          value={banners.reduce((a, b) => a + b.impressions, 0).toLocaleString()}
          subtitle="Guest visual exposures"
          icon={Eye}
        />
        <StatCard
          title="Avg Campaign CTR"
          value="8.11%"
          subtitle="Top decile hospitality engagement"
          icon={Sparkles}
        />
      </div>

      <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
        <DataTable data={banners} columns={columns} searchPlaceholder="Search banners by title or placement..." />
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Deploy New Campaign Billboard"
        description="Choose placement channel and destination checkout routing."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Campaign Title" required>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Monaco Grand Prix 2027 VIP Hospitality Showcase"
              required
            />
          </FormField>

          <FormField label="Billboard Placement Channel">
            <Select
              value={formData.placement}
              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
            >
              <option value="Guest Portal Hero Billboard">Guest Portal Hero Billboard (1920×600)</option>
              <option value="In-Suite Smart Console & TV">In-Suite Smart Console & TV (1080p)</option>
              <option value="Restaurant & Dining Sub-Hero">Restaurant & Dining Sub-Hero (1200×400)</option>
              <option value="Mobile App Header Spotlight">Mobile App Header Spotlight</option>
            </Select>
          </FormField>

          <FormField label="Destination Target URL" required>
            <Input
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="/booking/experience"
              required
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              Deploy Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PromotionalBannersPage;

