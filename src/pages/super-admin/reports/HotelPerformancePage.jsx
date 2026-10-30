import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatCard, StatsGrid } from '../../../components/ui/StatCard';
import { SimpleAreaChart } from '../../../components/data-display/SimpleChart';
import { weeklyOccupancyData } from '../../../data/mockAnalytics';
import { useToast } from '../../../context/ToastContext';
import {
  BedDouble,
  DollarSign,
  Percent,
  Download,
  Filter,
  TrendingUp,
} from 'lucide-react';

const mockHotelPerformances = [
  {
    id: 'hotel-01',
    name: 'Lazfort Grand Palace Monaco',
    destination: 'Monaco, French Riviera',
    totalRooms: 120,
    occupiedRooms: 113,
    availableRooms: 7,
    totalBookings: 1420,
    grossRevenue: 1840000,
    adr: 2450,
    revPar: 2307,
  },
  {
    id: 'hotel-02',
    name: 'The Ritz-Crest Alpine Sanctuary',
    destination: 'St. Moritz, Switzerland',
    totalRooms: 84,
    occupiedRooms: 74,
    availableRooms: 10,
    totalBookings: 890,
    grossRevenue: 1290000,
    adr: 1850,
    revPar: 1637,
  },
  {
    id: 'hotel-03',
    name: 'Seraphina Azure Lagoon Resort',
    destination: 'Bora Bora, French Polynesia',
    totalRooms: 45,
    occupiedRooms: 43,
    availableRooms: 2,
    totalBookings: 610,
    grossRevenue: 980000,
    adr: 3100,
    revPar: 3001,
  },
  {
    id: 'hotel-04',
    name: 'The Golden Pavilion Heritage Manor',
    destination: 'Kyoto, Japan',
    totalRooms: 52,
    occupiedRooms: 47,
    availableRooms: 5,
    totalBookings: 540,
    grossRevenue: 740000,
    adr: 1620,
    revPar: 1474,
  },
  {
    id: 'hotel-05',
    name: 'Villa Bellissima Bellagio',
    destination: 'Lake Como, Italy',
    totalRooms: 38,
    occupiedRooms: 34,
    availableRooms: 4,
    totalBookings: 382,
    grossRevenue: 620000,
    adr: 1950,
    revPar: 1743,
  },
];

export const HotelPerformancePage = () => {
  const { showToast } = useToast();
  const [selectedHotelId, setSelectedHotelId] = useState('all');

  const displayHotels = useMemo(() => {
    if (selectedHotelId === 'all') return mockHotelPerformances;
    return mockHotelPerformances.filter(h => h.id === selectedHotelId);
  }, [selectedHotelId]);

  const totalRoomsAgg = useMemo(() => displayHotels.reduce((acc, h) => acc + h.totalRooms, 0), [displayHotels]);
  const occupiedAgg = useMemo(() => displayHotels.reduce((acc, h) => acc + h.occupiedRooms, 0), [displayHotels]);
  const totalRevenueAgg = useMemo(() => displayHotels.reduce((acc, h) => acc + h.grossRevenue, 0), [displayHotels]);
  const avgAdrAgg = useMemo(
    () => (displayHotels.length > 0 ? displayHotels.reduce((acc, h) => acc + h.adr, 0) / displayHotels.length : 0),
    [displayHotels]
  );
  const occupancyRateAgg = useMemo(
    () => (totalRoomsAgg > 0 ? ((occupiedAgg / totalRoomsAgg) * 100).toFixed(1) : '0'),
    [occupiedAgg, totalRoomsAgg]
  );

  const handleExportCSV = () => {
    const headers = ['Hotel Name', 'Destination', 'Total Suites', 'Occupied', 'Available', 'Occupancy (%)', 'Total Bookings', 'Gross Revenue (USD)', 'ADR', 'RevPAR'];
    const rows = displayHotels.map(h => [
      `"${h.name}"`,
      `"${h.destination}"`,
      h.totalRooms,
      h.occupiedRooms,
      h.availableRooms,
      `${h.totalRooms > 0 ? ((h.occupiedRooms / h.totalRooms) * 100).toFixed(1) : 0}%`,
      h.totalBookings,
      h.grossRevenue,
      h.adr,
      h.revPar,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotel_performance_${selectedHotelId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Completed', 'Hotel performance comparison ledger exported as CSV.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Hotel Performance & Yield Analytics"
        subtitle="Individual resort occupancy benchmarking, ADR comparisons, and operational RevPAR analysis"
        breadcrumbs={[
          { label: 'Super Admin', path: '/super-admin/dashboard' },
          { label: 'Platform Reports', path: '/super-admin/reports' },
          { label: 'Hotel Performance' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-accent" />
              <select
                value={selectedHotelId}
                onChange={e => setSelectedHotelId(e.target.value)}
                className="input-luxury text-xs py-1.5 px-3 min-w-[200px]"
              >
                <option value="all">All Luxury Properties (Consolidated)</option>
                {mockHotelPerformances.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn-luxury-primary inline-flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Matrix
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Consolidated Occupancy Rate"
          value={`${occupancyRateAgg}%`}
          change="+4.8%"
          isPositive={true}
          period="exceeding 85% luxury benchmark"
          icon={<Percent className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Occupied Suites"
          value={`${occupiedAgg} / ${totalRoomsAgg}`}
          period="suites in guest residence"
          icon={<BedDouble className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Benchmark Average ADR"
          value={`$${Math.round(avgAdrAgg).toLocaleString()}`}
          period="average daily rate / night"
          icon={<DollarSign className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Realized Revenue"
          value={`$${totalRevenueAgg.toLocaleString()}`}
          period="current reporting cycle"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Comparison Matrix */}
      <div className="card-luxury p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Property Yield & Operational Matrix
            </h3>
            <p className="text-xs text-charcoal-muted">
              Audited comparative KPI table with RevPAR and live inventory availability
            </p>
          </div>
          <span className="text-xs font-mono text-accent font-bold">
            {displayHotels.length} Properties Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory dark:bg-white/5 border-b border-border dark:border-white/10 text-[10px] font-mono text-charcoal-muted uppercase">
              <tr>
                <th className="py-3 px-4">Hotel Property</th>
                <th className="py-3 px-4 text-center">Capacity</th>
                <th className="py-3 px-4 text-center">Occupied</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Occupancy %</th>
                <th className="py-3 px-4 text-center">Bookings</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">ADR</th>
                <th className="py-3 px-4 text-right">RevPAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-white/5">
              {displayHotels.map(h => {
                const occPercent = h.totalRooms > 0 ? ((h.occupiedRooms / h.totalRooms) * 100).toFixed(1) : '0';
                return (
                  <tr key={h.id} className="hover:bg-ivory/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-primary dark:text-white block">
                        {h.name}
                      </span>
                      <span className="text-[11px] text-charcoal-muted font-mono">{h.destination}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">{h.totalRooms}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-600 font-bold">{h.occupiedRooms}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-charcoal-muted">{h.availableRooms}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                      {occPercent}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{h.totalBookings.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-serif font-bold text-primary dark:text-white">
                      ${h.grossRevenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-accent">
                      ${h.adr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      ${h.revPar.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Occupancy Trend */}
      <div className="card-luxury p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-white/10">
          <div>
            <h3 className="font-serif font-bold text-base text-primary dark:text-white">
              Weekly Occupancy Demand Curve
            </h3>
            <p className="text-xs text-charcoal-muted">Peak weekend surge across all private suites</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold">
            Weekend Peak: 100% Full House
          </span>
        </div>

        <SimpleAreaChart
          data={weeklyOccupancyData}
          height={200}
          valueSuffix="%"
          color="#4F772D"
        />
      </div>
    </div>
  );
};

export default HotelPerformancePage;

