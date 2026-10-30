import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, SearchBar, Select, StatusBadge, Pagination, EmptyState } from '../../components/ui';
import { HotelCard } from '../../components/hotel/HotelCard';
import { DataTable } from '../../components/data-display/DataTable';
import { useERP } from '../../context/ERPContext';
import {
  Plus,
  LayoutGrid,
  List,
  Building2,
  MapPin,
  Eye,
  Edit,
  Star,
} from 'lucide-react';

export const HotelsListPage = () => {
  const { hotels } = useERP();
  const navigate = useNavigate();

  // View state
  const [viewMode, setViewMode] = useState('grid');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Extract unique territories
  const uniqueLocations = useMemo(() => {
    const locs = new Set();
    hotels.forEach(h => {
      const parts = h.location.split(',');
      locs.add(parts[parts.length - 1]?.trim() || h.location);
    });
    return Array.from(locs);
  }, [hotels]);

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter(hotel => {
        const matchesSearch =
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || hotel.status === statusFilter;
        const matchesLocation = locationFilter === 'all' || hotel.location.includes(locationFilter);
        const matchesTier = tierFilter === 'all' || hotel.subscriptionPlan === tierFilter;

        return matchesSearch && matchesStatus && matchesLocation && matchesTier;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'rooms') return b.totalRooms - a.totalRooms;
        if (sortBy === 'occupancy') return b.occupancyRate - a.occupancyRate;
        if (sortBy === 'revenue') return b.revenueThisMonth - a.revenueThisMonth;
        return 0;
      });
  }, [hotels, searchTerm, statusFilter, locationFilter, tierFilter, sortBy]);

  const totalPages = Math.ceil(filteredHotels.length / pageSize) || 1;
  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHotels.slice(start, start + pageSize);
  }, [filteredHotels, currentPage, pageSize]);

  const columns = [
    {
      key: 'name',
      header: 'Hotel Property',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-accent/30 shadow-sm shrink-0"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white font-serif">{item.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[10px] text-accent font-bold uppercase">{item.id}</span>
              <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                <MapPin className="w-3 h-3 text-accent" />
                {item.location}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'stars',
      header: 'Property Tier',
      sortable: true,
      render: item => (
        <div>
          <StatusBadge status={item.subscriptionPlan} size="sm" />
          <div className="flex items-center gap-1 mt-1 text-[11px] text-accent font-medium">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span>{item.stars || 5} Stars Palace</span>
          </div>
        </div>
      ),
    },
    {
      key: 'totalRooms',
      header: 'Luxury Keys',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs font-semibold text-primary dark:text-gray-200">
          {item.totalRooms} Suites
        </span>
      ),
    },
    {
      key: 'occupancyRate',
      header: 'Occupancy',
      sortable: true,
      render: item => (
        <div>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
            {item.occupancyRate}%
          </span>
          <div className="w-16 bg-gray-200 dark:bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${item.occupancyRate}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs text-charcoal-muted">
          {item.createdAt || '2025-01-15'}
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
      key: 'id',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/super-admin/hotels/edit/${item.id}`)}
            className="p-1.5 text-xs text-charcoal-muted hover:text-accent rounded-lg hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            title="Edit Property"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/super-admin/hotels/details?id=${item.id}`)}
            className="p-1.5 text-xs text-charcoal-muted hover:text-accent rounded-lg hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <PageHeader
        title="Global Luxury Properties Portfolio"
        description="Monitor, provision, and configure sovereign resorts and palace estates across global territories."
        badge={`${hotels.length} Properties`}
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/90 dark:bg-primary-900/90 border border-border/80 dark:border-accent/25 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                    : 'text-charcoal-muted hover:text-accent'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'table'
                    ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                    : 'text-charcoal-muted hover:text-accent'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/super-admin/hotels/add')}
            >
              Add Hotel
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card-luxury p-5 rounded-3xl border border-border/80 dark:border-accent/25 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5">
            <SearchBar
              placeholder="Search by hotel name, territory, or Property ID..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              onClear={() => setSearchTerm('')}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Select
              value={locationFilter}
              onChange={e => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
          </div>

          <div className="md:col-span-2">
            <Select
              value={tierFilter}
              onChange={e => {
                setTierFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Tiers</option>
              <option value="Palace Enterprise">Palace Enterprise</option>
              <option value="Grand Luxury">Grand Luxury</option>
              <option value="Boutique Elite">Boutique Elite</option>
            </Select>
          </div>

          <div className="md:col-span-1">
            <Select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="rooms">Keys</option>
              <option value="occupancy">Occ</option>
              <option value="revenue">Rev</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-charcoal-muted pt-1">
          <span>
            Showing <strong className="text-primary dark:text-white">{filteredHotels.length}</strong> of {hotels.length} properties
          </span>
          {(searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || tierFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setLocationFilter('all');
                setTierFilter('all');
                setCurrentPage(1);
              }}
              className="text-accent hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main View */}
      {filteredHotels.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Hotel Properties Found"
          description="No properties match your current search and filter criteria. Adjust your filters or onboard a new property."
          action={
            <Button variant="gold" onClick={() => navigate('/super-admin/hotels/add')}>
              Onboard New Property
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedHotels.map(hotel => (
              <div key={hotel.id} className="relative group">
                <HotelCard
                  hotel={hotel}
                  onSelect={() => navigate(`/super-admin/hotels/details?id=${hotel.id}`)}
                />
                <button
                  onClick={() => navigate(`/super-admin/hotels/edit/${hotel.id}`)}
                  className="absolute top-3 right-16 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:text-accent border border-white/20 hover:border-accent transition-all z-30"
                  title="Quick Edit Property"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <DataTable
          data={filteredHotels}
          columns={columns}
          keyExtractor={item => item.id}
          pageSize={8}
        />
      )}
    </div>
  );
};

export default HotelsListPage;

