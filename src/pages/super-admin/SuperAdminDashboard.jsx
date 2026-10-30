import React from 'react';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { SimpleAreaChart, SimpleBarChart } from '../../components/data-display/SimpleChart';
import { monthlyRevenueData, weeklyOccupancyData, superAdminMetrics } from '../../data/mockAnalytics';
import { DataTable } from '../../components/data-display/DataTable';
import { Plus, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hotels } = useERP();

  const hotelColumns = [
    {
      key: 'name',
      header: 'Hotel Property',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-accent/30 shadow-sm"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight">{item.name}</p>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">{item.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subscriptionPlan',
      header: 'Plan Tier',
      sortable: true,
      render: item => <StatusBadge status={item.subscriptionPlan} size="sm" />,
    },
    {
      key: 'totalRooms',
      header: 'Inventory',
      sortable: true,
      render: item => <span className="font-mono text-xs">{item.totalRooms} Suites</span>,
    },
    {
      key: 'occupancyRate',
      header: 'Occupancy',
      sortable: true,
      render: item => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
          {item.occupancyRate}%
        </span>
      ),
    },
    {
      key: 'revenueThisMonth',
      header: 'Monthly Rev',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent text-xs">
          ${(item.revenueThisMonth / 1000).toFixed(0)}k
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Manage',
      render: item => (
        <button
          onClick={() => {
            showToast('Property Selected', `Switched management context to ${item.name}`, 'info');
            navigate('/hotel-admin/dashboard');
          }}
          className="p-2 rounded-xl btn-secondary-3d text-accent cursor-pointer"
          title="Open property console"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Global Hotel Portfolio Overview"
        description="Consolidated intelligence across all luxury global properties, sovereign suites, and platform subscriptions."
        badge="Platform Controller"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/super-admin/hotels/add')}
          >
            Add New Property
          </Button>
        }
      />

      {/* Top Stats Grid */}
      <StatsGrid columns={4}>
        <StatCard
          title="Consolidated Platform Revenue"
          value={superAdminMetrics.totalRevenue}
          change={superAdminMetrics.revenueGrowth}
          isPositive={true}
          iconName="DollarSign"
        />
        <StatCard
          title="Platform Active Hotels"
          value={hotels.length}
          change="+2 new"
          isPositive={true}
          iconName="Building2"
        />
        <StatCard
          title="Avg Sovereign Occupancy"
          value={superAdminMetrics.avgOccupancy}
          change="+4.2%"
          isPositive={true}
          iconName="TrendingUp"
        />
        <StatCard
          title="Platform Health Score"
          value="99.98%"
          change="Optimal"
          isPositive={true}
          iconName="ShieldCheck"
        />
      </StatsGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Revenue Trajectory (Annual)
              </h3>
              <p className="text-xs text-charcoal-muted">Monthly billing across all subscribed properties</p>
            </div>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <SimpleAreaChart data={monthlyRevenueData} height={240} />
        </div>

        <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Weekly Occupancy Benchmarks
              </h3>
              <p className="text-xs text-charcoal-muted">Cross-property average occupancy percentage</p>
            </div>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <SimpleBarChart data={weeklyOccupancyData} height={240} />
        </div>
      </div>

      {/* Hotel Fleet Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
            Monitored Global Properties
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/super-admin/hotels')}
          >
            View Full Fleet
          </Button>
        </div>

        <DataTable
          data={hotels}
          columns={hotelColumns}
          keyExtractor={item => item.id}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

