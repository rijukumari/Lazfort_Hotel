import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, ConfirmDialog } from '../../components/ui';
import { mockPlanFeatures } from '../../data/mockSubscriptions';
import { useERP } from '../../context/ERPContext';
import { FeatureTable } from '../../components/subscription/FeatureTable';
import { SearchFilter } from '../../components/subscription/SearchFilter';
import { SubscriptionNavTabs } from '../../components/subscription/SubscriptionNavTabs';
import { useToast } from '../../context/ToastContext';
import { Plus } from 'lucide-react';

export const PlanFeaturesPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { planFeatures = mockPlanFeatures, updatePlanFeature } = useERP();
  const features = planFeatures;

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [featureToToggle, setFeatureToToggle] = useState(null);

  const allCategories = [
    'Hotel Management',
    'Room Management',
    'Reservations and Booking',
    'Front Desk',
    'Customer Panel',
    'Housekeeping',
    'Restaurant & POS',
    'Inventory & Procurement',
    'Staff & HR',
    'Reports & Analytics',
    'Platform Settings',
  ];

  // Filtered & Paginated Features
  const filteredFeatures = useMemo(() => {
    return features.filter(feat => {
      const matchesSearch =
        feat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feat.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || feat.category === selectedCategory;
      const matchesStatus =
        statusFilter === 'all' || feat.status === statusFilter;
      const matchesPlan =
        planFilter === 'all' || feat.applicablePlans.includes(planFilter);

      return matchesSearch && matchesCat && matchesStatus && matchesPlan;
    });
  }, [features, searchTerm, selectedCategory, statusFilter, planFilter]);

  const totalPages = Math.ceil(filteredFeatures.length / pageSize) || 1;
  const paginatedFeatures = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFeatures.slice(start, start + pageSize);
  }, [filteredFeatures, currentPage, pageSize]);

  const handleConfirmToggle = () => {
    if (!featureToToggle) return;
    const nextStatus = featureToToggle.status === 'enabled' ? 'disabled' : 'enabled';
    if (updatePlanFeature) {
      updatePlanFeature(featureToToggle.id, { status: nextStatus });
    }
    showToast(
      'Feature Status Updated',
      `Feature "${featureToToggle.name}" has been marked as ${nextStatus}.`,
      'info'
    );
    setFeatureToToggle(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Subscription Features Matrix"
        description="Govern granular system capabilities, allocate functional permissions across subscription tiers, and adjust operational quotas."
        badge={`${features.length} Features`}
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/super-admin/subscriptions/features/add')}
          >
            Add Feature
          </Button>
        }
      />

      {/* Navigation Sub-Tabs */}
      <SubscriptionNavTabs activeTab="features" />

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'gold-gradient-bg text-primary-950 shadow-sm font-bold'
              : 'bg-white/80 dark:bg-surface-dark/80 text-charcoal-muted hover:text-accent border border-border/80 dark:border-white/10'
          }`}
        >
          All Categories ({features.length})
        </button>
        {allCategories.map(cat => {
          const count = features.filter(f => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'gold-gradient-bg text-primary-950 shadow-sm font-bold'
                  : 'bg-white/80 dark:bg-surface-dark/80 text-charcoal-muted hover:text-accent border border-border/80 dark:border-white/10'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury p-4 rounded-2xl border border-border/80 dark:border-accent/25">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={val => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search features by name, code, or description..."
          filters={[
            {
              key: 'plan',
              label: 'Applicable Tier',
              value: planFilter,
              onChange: val => {
                setPlanFilter(val);
                setCurrentPage(1);
              },
              options: [
                { label: 'All Plans', value: 'all' },
                { label: 'Palace Enterprise', value: 'Palace Enterprise' },
                { label: 'Grand Luxury', value: 'Grand Luxury' },
                { label: 'Boutique Elite', value: 'Boutique Elite' },
              ],
            },
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              onChange: val => {
                setStatusFilter(val);
                setCurrentPage(1);
              },
              options: [
                { label: 'All Statuses', value: 'all' },
                { label: 'Enabled Features', value: 'enabled' },
                { label: 'Disabled Features', value: 'disabled' },
              ],
            },
          ]}
        />
      </div>

      {/* Feature Table with Direct Navigation */}
      <FeatureTable
        features={paginatedFeatures}
        onViewDetails={feat => navigate(`/super-admin/subscriptions/features/details/${feat.id}`)}
        onEdit={feat => navigate(`/super-admin/subscriptions/features/edit/${feat.id}`)}
        onToggleStatus={feat => setFeatureToToggle(feat)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Toggle Status Confirmation Dialog */}
      {featureToToggle && (
        <ConfirmDialog
          isOpen={!!featureToToggle}
          onCancel={() => setFeatureToToggle(null)}
          onConfirm={handleConfirmToggle}
          title={featureToToggle.status === 'enabled' ? 'Disable Feature Access?' : 'Enable Feature Access?'}
          message={`Are you sure you want to ${featureToToggle.status === 'enabled' ? 'disable' : 'enable'} the ${featureToToggle.name} capability?`}
          confirmText={featureToToggle.status === 'enabled' ? 'Disable Feature' : 'Enable Feature'}
          confirmVariant={featureToToggle.status === 'enabled' ? 'danger' : 'gold'}
        />
      )}
    </div>
  );
};

export default PlanFeaturesPage;

