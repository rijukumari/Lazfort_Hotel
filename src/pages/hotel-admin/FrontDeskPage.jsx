import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button } from '../../components/ui';
import { CalendarView } from '../../components/data-display/CalendarView';
import { Plus, ArrowRightLeft, Sparkles, BedDouble, CheckCircle, LogOut } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const FrontDeskPage = () => {
  const navigate = useNavigate();
  const { rooms, bookings } = useERP();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Concierge & Front Desk Operations"
        description="Lazfort Palace Monte-Carlo — Real-time guest arrivals, key allocations, walk-in reservations, and suite occupancy timeline."
        badge="Front Office Command"
        actions={
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Button
              variant="outline"
              icon={ArrowRightLeft}
              onClick={() => navigate('/hotel-admin/rooms/transfer')}
            >
              Suite Transfer
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              New Walk-In Stay
            </Button>
          </div>
        }
      />

      {/* Front Desk Snapshot Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Arrivals"
          value={`${bookings.filter(b => b.status === 'confirmed').length} Expected`}
          change={`${bookings.filter(b => b.status === 'checked_in').length} Checked-In`}
          isPositive={true}
          icon={CheckCircle}
          subtitle="Helipad & Chauffeur"
        />
        <StatCard
          title="Scheduled Departures"
          value={`${bookings.filter(b => b.status === 'checked_in').length} Departures`}
          change="All folios live tracked"
          isPositive={true}
          icon={LogOut}
          subtitle="Luggage Porter Ready"
        />
        <StatCard
          title="Suites Ready For Allocation"
          value={`${rooms.filter(r => r.status === 'available').length} Clean`}
          change="Inspected by Housekeeping"
          isPositive={true}
          icon={Sparkles}
          subtitle="Sanitized 100%"
        />
        <StatCard
          title="Walk-in Inventory"
          value={`${rooms.filter(r => r.status === 'available').length} Suites`}
          change="Presidential & Penthouse open"
          isPositive={true}
          icon={BedDouble}
          subtitle="Instant Key Issuance"
        />
      </div>

      {/* Interactive Suite Availability Timeline Grid */}
      <CalendarView />
    </div>
  );
};

export default FrontDeskPage;
