import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/data-display/DataTable';
import {
  History,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Briefcase,
  User,
  BedDouble,
  Calendar,
  Eye
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StaffTaskHistoryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [historyTasks] = useState([
    {
      id: 'TSK-2026-879',
      title: 'Private Yacht Charter Documentation Handover',
      suite: 'Suite 804 (Royal Penthouse)',
      guestName: 'Sir Alexander Kensington',
      category: 'Concierge Booking',
      completedDate: 'Yesterday at 16:45',
      durationMinutes: 35,
      status: 'Completed',
      signedBy: 'Guest Butler',
    },
    {
      id: 'TSK-2026-874',
      title: 'Bulgari Eau Parfumée Presentation Set Delivery',
      suite: 'Suite 601 (Azure Suite)',
      guestName: 'Baroness Helga von Berg',
      category: 'VIP Amenities',
      completedDate: 'Oct 31, 2026 14:10',
      durationMinutes: 20,
      status: 'Completed',
      signedBy: 'Guest Direct',
    },
    {
      id: 'TSK-2026-868',
      title: 'Helicopter Transit Baggage Transfer from Nice Cote d’Azur',
      suite: 'Penthouse 1201',
      guestName: 'Lord Alistair Sterling',
      category: 'Transportation',
      completedDate: 'Oct 30, 2026 11:20',
      durationMinutes: 50,
      status: 'Completed',
      signedBy: 'Chief Valet',
    },
    {
      id: 'TSK-2026-855',
      title: 'Monaco F1 VIP Paddock Pass Hand-Delivery',
      suite: 'Suite 703 (Diplomatic Suite)',
      guestName: 'Dr. Vivienne Moreau',
      category: 'VIP Ticketing',
      completedDate: 'Oct 29, 2026 18:30',
      durationMinutes: 25,
      status: 'Completed',
      signedBy: 'Guest Direct',
    },
  ]);

  const filteredTasks = useMemo(() => {
    return historyTasks.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.guestName.toLowerCase().includes(q) ||
        t.suite.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [historyTasks, searchQuery, categoryFilter]);

  const handleExportCSV = () => {
    const headers = ['Task Ref', 'Mission Title', 'Guest', 'Chamber', 'Category', 'Completed Date', 'Duration'];
    const rows = filteredTasks.map(t => [
      `"${t.id}"`,
      `"${t.title}"`,
      `"${t.guestName}"`,
      `"${t.suite}"`,
      `"${t.category}"`,
      `"${t.completedDate}"`,
      `"${t.durationMinutes} mins"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Staff_Duty_History_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Log Exported', 'Staff operational duty history downloaded.', 'success');
  };

  const columns = [
    {
      key: 'id',
      header: 'Task Ref',
      render: (t) => (
        <span className="font-mono text-xs font-bold text-accent">
          {t.id}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Service Rendered',
      render: (t) => (
        <div className="max-w-xs">
          <p className="font-serif font-bold text-sm text-primary dark:text-white truncate">
            {t.title}
          </p>
          <span className="text-[11px] text-charcoal-muted dark:text-gray-400 block truncate">
            {t.suite} • {t.guestName}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (t) => (
        <span className="badge badge-gold font-mono text-[10px] px-2 py-0.5">
          {t.category}
        </span>
      ),
    },
    {
      key: 'completedDate',
      header: 'Fulfillment Timestamp',
      render: (t) => (
        <span className="text-xs text-charcoal-muted dark:text-gray-400">
          {t.completedDate}
        </span>
      ),
    },
    {
      key: 'durationMinutes',
      header: 'Fulfillment SLA',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{t.durationMinutes} mins</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Record Status',
      render: () => <StatusBadge status="completed" label="Fulfilled & Archived" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Task History & Archive"
        subtitle="Historical log of executed guest service work orders, concierge errands, and mission timestamps."
        icon={History}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Briefcase}
              onClick={() => navigate('/staff/work')}
            >
              Active Tasks
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Fulfilled Missions"
          value={historyTasks.length}
          subtitle="Archive records on file"
          icon={CheckCircle2}
        />
        <StatCard
          title="Average Fulfillment Time"
          value="32.5 mins"
          subtitle="Meets 5-star concierge SLA"
          icon={Clock}
        />
        <StatCard
          title="Guest Satisfaction Score"
          value="100%"
          subtitle="Zero service complaints logged"
          icon={Briefcase}
        />
      </div>

      <div className="luxury-card p-6 rounded-2xl border border-primary/20 dark:border-accent/20 bg-charcoal-card dark:bg-[#0c1424] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
            <input
              type="text"
              placeholder="Search historical missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input w-full pl-10 pr-4 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="luxury-input px-3 py-2 rounded-xl border border-primary/20 dark:border-white/10 bg-charcoal-bg dark:bg-[#080d19] text-primary dark:text-white text-xs"
            >
              <option value="all">All Service Categories</option>
              <option value="Concierge Booking">Concierge Booking</option>
              <option value="VIP Amenities">VIP Amenities</option>
              <option value="Transportation">Transportation</option>
              <option value="VIP Ticketing">VIP Ticketing</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTasks}
          keyField="id"
          pagination={true}
          pageSize={8}
          emptyMessage="No historical tasks found matching your search."
        />
      </div>
    </div>
  );
};

export default StaffTaskHistoryPage;

