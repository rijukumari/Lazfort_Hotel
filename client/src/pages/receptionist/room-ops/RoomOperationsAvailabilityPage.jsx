import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  BedDouble,
  Calendar,
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';

export const RoomOperationsAvailabilityPage = () => {
  const navigate = useNavigate();
  const { rooms = [], bookings = [] } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchDate, setSearchDate] = useState('2026-11-03');

  // Compute status breakdown
  const availableRooms = rooms.filter((r) => r.status === 'available');
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied');
  const reservedRooms = rooms.filter((r) => r.status === 'reserved');
  const blockedRooms = rooms.filter((r) => r.status === 'maintenance' || r.status === 'blocked');

  // Room type classifications
  const roomTypes = useMemo(() => {
    const set = new Set();
    rooms.forEach((r) => {
      if (r.type) set.add(r.type);
    });
    return Array.from(set);
  }, [rooms]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch =
        !searchQuery ||
        String(room.roomNumber).includes(searchQuery) ||
        room.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        room.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchType =
        typeFilter === 'all' ||
        room.type?.toLowerCase() === typeFilter.toLowerCase();

      return matchSearch && matchStatus && matchType;
    });
  }, [rooms, searchQuery, statusFilter, typeFilter]);

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
      header: 'Chamber Classification',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">
            {item.type || item.name}
          </p>
          <p className="text-[11px] text-charcoal-muted">Floor {item.floor || 3} • {item.capacity || 2} Guests</p>
        </div>
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
      header: 'Housekeeping',
      render: (item) => {
        const hk = item.housekeepingStatus || 'clean';
        const isClean = hk.toLowerCase() === 'clean' || hk.toLowerCase() === 'inspected';
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
              isClean
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="capitalize">{hk}</span>
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Operational Status',
      sortable: true,
      render: (item) => {
        const s = item.status?.toLowerCase();
        if (s === 'available') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          );
        }
        if (s === 'occupied') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
              <Lock className="w-3 h-3" /> Occupied
            </span>
          );
        }
        if (s === 'reserved') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
              <Clock className="w-3 h-3" /> Reserved
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            Blocked / Out of Order
          </span>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      render: (item) => (
        <button
          onClick={() => navigate(`/hotel-admin/bookings/new?roomId=${item.id}&roomNumber=${item.roomNumber}`)}
          className="btn-luxury px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Book
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Chamber Availability Matrix"
        subtitle="Real-time occupancy status across all palace suites: vacant, resident-occupied, reserved & maintenance blocked"
        badge="Room Operations"
        actions={
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => navigate('/hotel-admin/bookings/new')}
          >
            Create Reservation
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Available Chambers"
          value={String(availableRooms.length)}
          subtitle="Vacant for immediate check-in"
          icon={CheckCircle2}
          isPositive={true}
        />
        <StatCard
          title="Occupied Suites"
          value={String(occupiedRooms.length)}
          subtitle="In-house patron resident stays"
          icon={Lock}
          isPositive={false}
        />
        <StatCard
          title="Reserved Chambers"
          value={String(reservedRooms.length)}
          subtitle="Confirmed bookings upcoming"
          icon={Clock}
          isPositive={true}
        />
        <StatCard
          title="Blocked / Maintenance"
          value={String(blockedRooms.length)}
          subtitle="Under technical refurbishment"
          icon={ShieldCheck}
          isPositive={false}
        />
      </div>

      {/* Filter and Date Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chamber number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <Calendar className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-charcoal-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="occupied">Occupied Only</option>
              <option value="reserved">Reserved Only</option>
              <option value="maintenance">Blocked / Maintenance</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-charcoal-muted">Room Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Classifications</option>
              {roomTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <DataTable
        data={filteredRooms}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No chambers match your availability criteria."
      />
    </div>
  );
};

export default RoomOperationsAvailabilityPage;

