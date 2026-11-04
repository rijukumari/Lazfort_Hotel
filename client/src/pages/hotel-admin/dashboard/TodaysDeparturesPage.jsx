import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, Button, StatusBadge } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  LogOut,
  Clock,
  DollarSign,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const TodaysDeparturesPage = () => {
  const navigate = useNavigate();
  const { bookings = [], folios = [], checkOutGuest } = useERP();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Filter ONLY scheduled departures (currently checked-in guests preparing to depart)
  const departuresData = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'checked_in')
      .map((b) => {
        const guestFolio = folios.find((f) => f.bookingId === b.id) || {
          balanceDue: b.totalAmount ? Math.round(b.totalAmount * 0.15) : 0,
          status: 'settled',
        };
        const balance = guestFolio.balanceDue || 0;
        return {
          ...b,
          checkOutTime: b.checkOutTime || '11:00',
          balanceDue: balance,
          paymentStatus: balance === 0 ? 'Settled in Full' : 'Pending Payment',
          folioId: guestFolio.id || `fol-${b.id}`,
        };
      })
      .filter((item) => {
        const matchSearch =
          !searchTerm ||
          item.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(item.roomNumber).includes(searchTerm);

        const matchPayment =
          paymentFilter === 'all' ||
          (paymentFilter === 'settled' && item.balanceDue === 0) ||
          (paymentFilter === 'pending' && item.balanceDue > 0);

        return matchSearch && matchPayment;
      });
  }, [bookings, folios, searchTerm, paymentFilter]);

  const handlePerformCheckOut = (bkg) => {
    const res = checkOutGuest(bkg.id);
    if (res?.success) {
      showToast(
        'Check-Out Completed',
        `Guest ${bkg.guestName} checked out from Suite ${bkg.roomNumber}. Folio closed.`,
        'success'
      );
    } else {
      showToast('Check-Out Error', res?.message || 'Check-out could not be processed.', 'error');
    }
  };

  const handleSettleFolio = (bkg) => {
    showToast(
      'Folio Terminal Dispatched',
      `Opening billing statement for ${bkg.guestName} ($${bkg.balanceDue}).`,
      'info'
    );
    navigate(`/hotel-admin/finance/folios`);
  };

  const totalOutstanding = departuresData.reduce((sum, d) => sum + d.balanceDue, 0);

  const columns = [
    {
      key: 'bookingCode',
      header: 'Reservation ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-accent">{item.bookingCode}</span>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.guestName}</p>
          <p className="text-[11px] text-charcoal-muted">Suite {item.roomNumber} ({item.roomType})</p>
        </div>
      ),
    },
    {
      key: 'checkOutTime',
      header: 'Departure Time',
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-charcoal dark:text-gray-200">
          <Clock className="w-3.5 h-3.5 text-accent" /> {item.checkOutTime}
        </span>
      ),
    },
    {
      key: 'balanceDue',
      header: 'Outstanding Balance',
      sortable: true,
      render: (item) => (
        <span
          className={`font-mono font-bold text-xs ${
            item.balanceDue > 0 ? 'text-amber-500' : 'text-emerald-500'
          }`}
        >
          ${item.balanceDue.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (item) =>
        item.balanceDue === 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Settled in Full
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Outstanding Folio
          </span>
        ),
    },
    {
      key: 'action',
      header: 'Departure Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.balanceDue > 0 && (
            <button
              onClick={() => handleSettleFolio(item)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-1"
            >
              <CreditCard className="w-3 h-3" /> Settle Folio
            </button>
          )}
          <button
            onClick={() => handlePerformCheckOut(item)}
            className="px-3.5 py-1.5 rounded-xl bg-charcoal dark:bg-surface-dark text-white text-xs font-semibold hover:bg-black dark:hover:bg-primary-800 border border-white/10 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-accent" />
            <span>Check-Out</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Today's Departures"
        subtitle="Scheduled check-outs for today: guest folio settlements, room inspections, and final keycard return"
        badge="Departures Desk"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Receipt}
              onClick={() => navigate('/hotel-admin/finance/folios')}
            >
              Guest Folios
            </Button>
          </div>
        }
      />

      {/* Departures Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Scheduled Departures"
          value={String(departuresData.length)}
          subtitle="Suites vacating today"
          icon={LogOut}
          isPositive={false}
        />
        <StatCard
          title="Outstanding Folio Sum"
          value={`$${totalOutstanding.toLocaleString()}`}
          subtitle="Pending settlement before departure"
          icon={DollarSign}
          isPositive={totalOutstanding === 0}
        />
        <StatCard
          title="Fully Settled Folios"
          value={String(departuresData.filter((d) => d.balanceDue === 0).length)}
          subtitle="Ready for rapid check-out"
          icon={CheckCircle2}
          isPositive={true}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="card-luxury-3d p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest name, suite, or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 rounded-xl focus:outline-none focus:border-accent text-charcoal dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-charcoal-muted flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-accent" /> Payment Status:
          </span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-primary-900/80 border border-border dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-accent"
          >
            <option value="all">All Scheduled Departures</option>
            <option value="settled">Settled in Full</option>
            <option value="pending">Pending Payment Only</option>
          </select>
        </div>
      </div>

      {/* Departures Data Table */}
      <DataTable
        data={departuresData}
        columns={columns}
        keyExtractor={(item) => item.id}
        pageSize={8}
        emptyMessage="No scheduled departures match your filter criteria for today."
      />
    </div>
  );
};

export default TodaysDeparturesPage;

