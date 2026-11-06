import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  BedDouble,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const AvailableRoomsPage = () => {
  const navigate = useNavigate();
  const { rooms = [] } = useERP();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter ONLY currently available rooms
  const availableRooms = useMemo(() => {
    return rooms
      .filter((r) => r.status === 'available')
      .filter((room) => {
        const matchSearch =
          !searchTerm ||
          String(room.roomNumber).includes(searchTerm) ||
          room.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.floor?.toString().includes(searchTerm);

        const matchCategory =
          categoryFilter === 'all' ||
          room.category?.toLowerCase() === categoryFilter.toLowerCase() ||
          room.type?.toLowerCase().includes(categoryFilter.toLowerCase());

        return matchSearch && matchCategory;
      });
  }, [rooms, searchTerm, categoryFilter]);

  const handleBookRoom = (room) => {
    showToast(
      'Chamber Allocation Initiated',
      `Directing to walk-in booking reservation for Suite ${room.roomNumber}.`,
      'info'
    );
    navigate(`/hotel-admin/bookings/new?roomId=${room.id}&roomNumber=${room.roomNumber}`);
  };

  const categories = useMemo(() => {
    const set = new Set();
    rooms.forEach((r) => {
      if (r.category) set.add(r.category);
      if (r.type) set.add(r.type);
    });
    return Array.from(set);
  }, [rooms]);

  const columns = [
    {
      key: 'roomNumber',
      header: 'Chamber Number',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-sm font-bold text-accent">
          Suite {item.roomNumber}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Room Classification',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">
            {item.type || item.name}
          </p>
          <p className="text-[11px] text-charcoal-muted">
            {item.category || 'Luxury Accommodation'} • Floor {item.floor || 3}
          </p>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Guest Capacity',
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-charcoal dark:text-gray-300">
          <Users className="w-3.5 h-3.5 text-accent" /> {item.capacity || 2} Persons
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Nightly Tariff',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-bold text-xs text-primary dark:text-white">
          ${item.price || item.basePrice || 1200}
          <span className="text-[10px] text-charcoal-muted font-normal"> / night</span>
        </span>
      ),
    },
    {
      key: 'housekeepingStatus',
      header: 'Hygiene & Cleanliness',
      render: (item) => {
        const hkStatus = item.housekeepingStatus || 'clean';
        const isClean = hkStatus.toLowerCase() === 'clean' || hkStatus.toLowerCase() === 'inspected';
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
              isClean
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="capitalize">{hkStatus}</span>
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Availability',
      render: () => (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Available Now
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Allocation Action',
      render: (item) => (
        <button
          onClick={() => handleBookRoom(item)}
          className="btn-luxury px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Allocate / Book</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Available Rooms & Suites"
        subtitle="Real-time vacant chambers ready for guest reservation, immediate walk-in, or VIP room upgrades"
        badge="Chamber Availability"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Reservation
            </Button>
          </div>
        }
      />

      {/* Available Rooms Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Ready Chambers"
          value={String(availableRooms.length)}
          subtitle="Vacant & sanitised for immediate check-in"
          icon={BedDouble}
          isPositive={true}
        />
        <StatCard
          title="Inspected & Pristine"
          value={String(
            availableRooms.filter(
              (r) =>
                (r.housekeepingStatus || 'clean').toLowerCase() === 'inspected' ||
                (r.housekeepingStatus || 'clean').toLowerCase() === 'clean'
            ).length
          )}
          subtitle="Hygiene certified by Executive Housekeeper"
          icon={Sparkles}
          isPositive={true}
        />
        <StatCard
          title="Total Chamber Portfolio"
          value={String(rooms.length)}
          subtitle="Suites in Lazfort Grand Palace"
          icon={ShieldCheck}
          isPositive={true}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suite number, category, floor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-charcoal-muted flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-accent" /> Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Available Classifications</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Rooms Data Table */}
      <DataTable
        data={availableRooms}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No available chambers found matching your criteria."
      />
    </div>
  );
};

export default AvailableRoomsPage;

