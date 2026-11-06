import React, { useState } from 'react';
import { PageHeader, StatCard, Button, FormField, Input, Select, Modal } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { Package, Plus, Trash2, Sparkles, BedDouble, Calendar, Award } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const PackagesManagementPage = () => {
  const { showToast } = useToast();

  const [packages, setPackages] = useState([
    {
      id: 'PKG-1',
      title: 'Monaco Grand Prix Sovereign Experience',
      nights: '4 Nights',
      suiteCategory: 'Royal Penthouse Harbor Wing',
      inclusions: 'Helipad Transfer, Michelin 3-Star Dining, Trackside Terrace Pass',
      packagePrice: '$28,500',
      status: 'active',
    },
    {
      id: 'PKG-2',
      title: 'Royal Honeymoon & Thalasso Sanctuary',
      nights: '3 Nights',
      suiteCategory: 'Presidential Sea Haven',
      inclusions: 'Private Heated Seawater Lagoon, Daily Caviar Breakfast, Couple Thalasso Bath',
      packagePrice: '$14,200',
      status: 'active',
    },
    {
      id: 'PKG-3',
      title: 'Riviera Yacht Charter & Sommelier Retreat',
      nights: '5 Nights',
      suiteCategory: 'Imperial Diplomatic Suite',
      inclusions: 'Private 80ft Riva Yacht Day Charter, Sommelier Grand Cru Reserve Tasting',
      packagePrice: '$36,000',
      status: 'active',
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    nights: '3 Nights',
    suiteCategory: 'Presidential Sea Haven',
    inclusions: '',
    packagePrice: '$15,000',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newPkg = {
      id: `PKG-${Date.now()}`,
      title: formData.title.trim(),
      nights: formData.nights,
      suiteCategory: formData.suiteCategory,
      inclusions: formData.inclusions.trim(),
      packagePrice: formData.packagePrice.trim(),
      status: 'active',
    };

    setPackages([newPkg, ...packages]);
    setIsCreateOpen(false);
    setFormData({ title: '', nights: '3 Nights', suiteCategory: 'Presidential Sea Haven', inclusions: '', packagePrice: '$15,000' });
    if (showToast) showToast('Package Created', `Package ${newPkg.title} added to portfolio.`, 'success');
  };

  const handleDelete = (id) => {
    setPackages(packages.filter(p => p.id !== id));
    if (showToast) showToast('Package Removed', 'Package removed.', 'info');
  };

  const columns = [
    {
      key: 'title',
      header: 'Hospitality Experience Title',
      render: (item) => (
        <div>
          <h4 className="font-serif font-bold text-sm text-foreground">{item.title}</h4>
          <span className="text-[11px] text-accent font-medium">{item.suiteCategory} • {item.nights}</span>
        </div>
      ),
    },
    {
      key: 'inclusions',
      header: 'Curated Inclusions & Privileges',
      render: (item) => (
        <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
          {item.inclusions}
        </p>
      ),
    },
    {
      key: 'price',
      header: 'All-Inclusive Tariff',
      render: (item) => (
        <span className="font-mono text-sm font-bold text-accent">
          {item.packagePrice}
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
          title="Delete Package"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Curated Hospitality Packages & Experiences"
        description="Comprehensive luxury packages bundling suites, private yacht charters, Michelin gastronomy, and spa treatments."
        actions={
          <Button variant="gold" icon={Plus} onClick={() => setIsCreateOpen(true)}>
            Design New Package
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Curated Packages"
          value={packages.length}
          subtitle="Currently active for reservation"
          icon={Package}
        />
        <StatCard
          title="Avg Package Yield"
          value="$26,200"
          subtitle="Per stay booking"
          icon={Award}
        />
        <StatCard
          title="VIP Inclusion Score"
          value="5-Star Ultra"
          subtitle="All packages include private butler"
          icon={Sparkles}
        />
      </div>

      <div className="card-luxury-3d p-6 rounded-2xl bg-card border border-border">
        <DataTable data={packages} columns={columns} searchPlaceholder="Search packages by title or inclusions..." />
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Design Bespoke Hospitality Package"
        description="Bundle chamber tiers with experiential gastronomy and leisure privileges."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Package Title" required>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sovereign Summer Yacht & Penthouse Retreat"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (Nights)">
              <Select
                value={formData.nights}
                onChange={(e) => setFormData({ ...formData, nights: e.target.value })}
              >
                <option value="2 Nights">2 Nights</option>
                <option value="3 Nights">3 Nights</option>
                <option value="4 Nights">4 Nights</option>
                <option value="5 Nights">5 Nights</option>
                <option value="7 Nights (Weekly)">7 Nights</option>
              </Select>
            </FormField>

            <FormField label="All-Inclusive Tariff ($)">
              <Input
                value={formData.packagePrice}
                onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                placeholder="$20,000"
                required
              />
            </FormField>
          </div>

          <FormField label="Target Chamber Suite Tier">
            <Input
              value={formData.suiteCategory}
              onChange={(e) => setFormData({ ...formData, suiteCategory: e.target.value })}
              placeholder="e.g. Royal Penthouse Harbor Wing"
            />
          </FormField>

          <FormField label="Curated Privileges & Inclusions" required>
            <Input
              value={formData.inclusions}
              onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
              placeholder="Helipad transfer, Michelin gastronomy, vintage cellar tasting..."
              required
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit">
              Publish Package
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackagesManagementPage;

