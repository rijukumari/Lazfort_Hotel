import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import { SimpleAreaChart, SimpleBarChart } from '../../components/data-display/SimpleChart';
import { monthlyRevenueData, weeklyOccupancyData, superAdminMetrics } from '../../data/mockAnalytics';
import { DataTable } from '../../components/data-display/DataTable';
import { Plus, ArrowUpRight, Sparkles, Download, RefreshCw, Eye, Building2, Users, CreditCard, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';
import { hotelApi, invalidateApiCache } from '../../services/hotelApi';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hotels } = useERP();
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState(monthlyRevenueData);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch real MySQL metrics
  const loadStats = useCallback(async (force = false) => {
    try {
      setIsLoading(true);
      if (force) {
        invalidateApiCache('/super-admin/dashboard-stats');
      }
      const res = await hotelApi.getSuperAdminStats({ skipCache: force });
      if (res?.status === 'success' && res.metrics) {
        setDashboardMetrics(res.metrics);
        if (Array.isArray(res.monthlyRevenue) && res.monthlyRevenue.length > 0) {
          setRevenueChartData(res.monthlyRevenue);
        }
        if (Array.isArray(res.recentActivities)) {
          setRecentActivities(res.recentActivities);
        }
      }
    } catch (err) {
      console.warn('Could not load live dashboard stats from MySQL:', err.message);
      showToast('Live Sync Warning', 'Failed to refresh latest platform metrics.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Export properties data to CSV from real MySQL data
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      showToast('Preparing Export', 'Fetching live portfolio records from database...', 'info');
      const res = await hotelApi.exportModuleData('hotels');
      const dataToExport = (res?.status === 'success' && Array.isArray(res.data) && res.data.length > 0)
        ? res.data
        : hotels;

      if (!dataToExport || dataToExport.length === 0) {
        showToast('Export Notice', 'No properties available to export.', 'warning');
        return;
      }

      // Generate CSV string
      const headers = ['Hotel ID', 'Name', 'Location', 'Total Rooms', 'Plan', 'Status', 'Phone', 'Email'];
      const rows = dataToExport.map(h => [
        `"${h.id || ''}"`,
        `"${(h.name || '').replace(/"/g, '""')}"`,
        `"${(h.location || h.city || '').replace(/"/g, '""')}"`,
        h.total_rooms || h.totalRooms || 0,
        `"${h.subscription_plan || h.subscriptionPlan || 'Enterprise'}"`,
        `"${h.status || 'active'}"`,
        `"${h.phone || ''}"`,
        `"${h.email || ''}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `lazfort_hotels_portfolio_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Export Successful', `Exported ${dataToExport.length} properties to CSV file.`, 'success');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Export Failed', 'Unable to generate CSV export.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const hotelColumns = [
    {
      key: 'name',
      header: 'Hotel Property',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
            alt={item.name}
            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-accent/30 shadow-sm"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight">{item.name}</p>
            <p className="text-xs text-charcoal-muted dark:text-gray-400">{item.location || item.city || 'Global'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subscriptionPlan',
      header: 'Plan Tier',
      sortable: true,
      render: item => <StatusBadge status={item.subscription_plan || item.subscriptionPlan || 'Enterprise'} size="sm" />,
    },
    {
      key: 'totalRooms',
      header: 'Inventory',
      sortable: true,
      render: item => <span className="font-mono text-xs">{item.total_rooms || item.totalRooms || 0} Suites</span>,
    },
    {
      key: 'occupancyRate',
      header: 'Occupancy',
      sortable: true,
      render: item => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
          {item.occupancyRate || '85'}%
        </span>
      ),
    },
    {
      key: 'revenueThisMonth',
      header: 'Monthly Rev',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent text-xs">
          ${item.revenueThisMonth ? (item.revenueThisMonth / 1000).toFixed(0) + 'k' : '142k'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => <StatusBadge status={item.status || 'active'} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/hotels/details/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent cursor-pointer transition-colors"
            title="Inspect property profile"
          >
            <Eye className="w-4 h-4" />
          </button>
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
        </div>
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
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              icon={RefreshCw}
              loading={isLoading}
              onClick={() => loadStats(true)}
              className="hidden sm:inline-flex"
            >
              Sync Live
            </Button>
            <Button
              variant="outline"
              icon={Download}
              loading={isExporting}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/super-admin/hotels/add')}
            >
              Add New Property
            </Button>
          </div>
        }
      />

      {/* Top Stats Grid with Real Navigation Links */}
      <StatsGrid columns={4}>
        <div onClick={() => navigate('/super-admin/reports/revenue')} className="cursor-pointer">
          <StatCard
            title="Consolidated Platform Revenue"
            value={dashboardMetrics ? (
              typeof dashboardMetrics.totalRevenue === 'number'
                ? `$${dashboardMetrics.totalRevenue >= 1000000 
                    ? (dashboardMetrics.totalRevenue / 1000000).toFixed(2) + 'M' 
                    : dashboardMetrics.totalRevenue.toLocaleString()}`
                : `$${dashboardMetrics.totalRevenue}`
            ) : superAdminMetrics.totalRevenue}
            change={superAdminMetrics.revenueGrowth}
            isPositive={true}
            iconName="DollarSign"
            subtitle="View Revenue Reports →"
          />
        </div>
        <div onClick={() => navigate('/super-admin/hotels')} className="cursor-pointer">
          <StatCard
            title="Platform Registered Hotels"
            value={dashboardMetrics ? dashboardMetrics.totalHotels : hotels.length}
            change={dashboardMetrics ? `${dashboardMetrics.activeHotels} Active` : "+2 new"}
            isPositive={true}
            iconName="Building2"
            subtitle="Manage Properties →"
          />
        </div>
        <div onClick={() => navigate('/super-admin/users/all')} className="cursor-pointer">
          <StatCard
            title="Total Platform Users"
            value={dashboardMetrics ? dashboardMetrics.totalUsers : "2,480"}
            change={dashboardMetrics ? `${dashboardMetrics.totalAdmins} Admins` : "+4.2%"}
            isPositive={true}
            iconName="TrendingUp"
            subtitle="Inspect RBAC Users →"
          />
        </div>
        <div onClick={() => navigate('/super-admin/system/status')} className="cursor-pointer">
          <StatCard
            title="Platform Health Score"
            value={dashboardMetrics ? dashboardMetrics.healthScore : "99.98%"}
            change="Optimal"
            isPositive={true}
            iconName="ShieldCheck"
            subtitle="System Infrastructure →"
          />
        </div>
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
            <button
              onClick={() => navigate('/super-admin/reports/revenue')}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              Full Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SimpleAreaChart data={revenueChartData} height={240} />
        </div>

        <div className="card-luxury p-6 rounded-3xl border border-border/80 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                Weekly Occupancy Benchmarks
              </h3>
              <p className="text-xs text-charcoal-muted">Cross-property average occupancy percentage</p>
            </div>
            <button
              onClick={() => navigate('/super-admin/reports/occupancy')}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              Occupancy Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SimpleBarChart data={weeklyOccupancyData} height={240} />
        </div>
      </div>

      {/* Hotel Fleet Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Monitored Global Properties
            </h3>
            <p className="text-xs text-charcoal-muted">Live inventory, occupancy rating and operational status</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export Table
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/super-admin/hotels')}
            >
              View Full Fleet →
            </Button>
          </div>
        </div>

        <DataTable
          data={hotels}
          columns={hotelColumns}
          keyExtractor={item => item.id}
          showSearch={false}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;


