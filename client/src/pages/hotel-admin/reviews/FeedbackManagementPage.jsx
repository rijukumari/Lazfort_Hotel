import React, { useState, useMemo } from 'react';
import { PageHeader, Button, ConfirmDialog } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  MessageSquare,
  CornerDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  X,
  Search,
  Filter,
  UserCheck,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const INITIAL_FEEDBACKS = [
  {
    id: 'fdb-101',
    guestName: 'Baron Mateo Rossi',
    roomNumber: 'VL-301',
    bookingCode: 'AUR-9923',
    type: 'Suggestion',
    category: 'Private Dining',
    message: 'The private cliffside dining was exquisite. Would appreciate a slightly broader selection of vintage Barolo on the in-suite sommelier list.',
    date: '2026-10-29',
    status: 'Pending',
    assignedStaff: 'Sebastian Laurent (Head Butler)',
    response: '',
    respondedAt: null,
  },
  {
    id: 'fdb-102',
    guestName: 'Marcus Sterling',
    roomNumber: 'ST-402',
    bookingCode: 'AUR-9926',
    type: 'Complaint',
    category: 'Culinary Speed',
    message: 'Room service breakfast arrived 10 minutes late during peak morning conference hours. Needs faster courier coordination.',
    date: '2026-10-21',
    status: 'Pending',
    assignedStaff: 'Chef Jean-Luc (Executive Chef)',
    response: '',
    respondedAt: null,
  },
  {
    id: 'fdb-103',
    guestName: 'Dr. Vivienne Moreau',
    roomNumber: 'ST-804',
    bookingCode: 'AUR-9922',
    type: 'Inquiry',
    category: 'Spa & Wellness',
    message: 'Can the hydrotherapy pool temperature be adjusted to 38.5°C prior to our 08:00 AM session tomorrow?',
    date: '2026-10-28',
    status: 'Replied',
    assignedStaff: 'Elena Rostova (Spa Director)',
    response: 'Confirmed Dr. Moreau, the hydrotherapy sanctuary has been pre-calibrated to 38.5°C specifically for your arrival.',
    respondedAt: '2026-10-28 16:15',
  },
  {
    id: 'fdb-104',
    guestName: 'Sir Alexander Kensington',
    roomNumber: 'PH-1201',
    bookingCode: 'AUR-9921',
    type: 'Praise',
    category: 'Concierge Assistance',
    message: 'Special commendation for Head Butler Sebastian. Yacht transfer was arranged with zero friction.',
    date: '2026-10-26',
    status: 'Resolved',
    assignedStaff: 'Sebastian Laurent (Head Butler)',
    response: 'Thank you Sir Alexander, the butler team is delighted to have served you.',
    respondedAt: '2026-10-26 14:30',
  },
];

const STAFF_LIST = [
  'Sebastian Laurent (Head Butler)',
  'Elena Rostova (Spa Director)',
  'Chef Jean-Luc (Executive Chef)',
  'Antoine Mercier (Guest Relations)',
  'Marco Bellini (Chief Engineer)',
];

export const FeedbackManagementPage = () => {
  const { showToast } = useToast();

  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_feedback_mgmt');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_FEEDBACKS;
  });

  const persistFeedbacks = (list) => {
    setFeedbacks(list);
    try {
      localStorage.setItem('lazfort_feedback_mgmt', JSON.stringify(list));
    } catch {}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Response Modal
  const [replyingItem, setReplyingItem] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [assignStaff, setAssignStaff] = useState('');
  const [newStatus, setNewStatus] = useState('Replied');

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(fb => {
      const matchesSearch =
        fb.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || fb.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || fb.type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [feedbacks, searchQuery, statusFilter, typeFilter]);

  const handleOpenReply = (item) => {
    setReplyingItem(item);
    setReplyText(item.response || '');
    setAssignStaff(item.assignedStaff || STAFF_LIST[0]);
    setNewStatus(item.status === 'Pending' ? 'Replied' : item.status);
  };

  const handleSaveReply = (e) => {
    e.preventDefault();
    if (!replyingItem) return;

    const updated = feedbacks.map(f => {
      if (f.id === replyingItem.id) {
        return {
          ...f,
          status: newStatus,
          response: replyText.trim(),
          assignedStaff: assignStaff,
          respondedAt: replyText.trim() ? new Date().toISOString().slice(0, 16).replace('T', ' ') : f.respondedAt,
        };
      }
      return f;
    });

    persistFeedbacks(updated);
    setReplyingItem(null);
    setReplyText('');
    showToast('Feedback Updated', 'Response recorded and dispatched to guest dossier.', 'success');
  };

  const handleQuickResolve = (id) => {
    const updated = feedbacks.map(f => f.id === id ? { ...f, status: 'Resolved' } : r);
    persistFeedbacks(updated);
    showToast('Feedback Resolved', 'Ticket marked as completely resolved.', 'success');
  };

  const columns = [
    {
      key: 'guest',
      header: 'Guest & Reservation',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white font-serif">{item.guestName}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
            <span className="font-mono text-accent font-bold">{item.bookingCode}</span>
            <span>•</span>
            <span>Suite {item.roomNumber}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type & Department',
      sortable: true,
      render: item => (
        <div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            item.type === 'Complaint'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              : item.type === 'Suggestion'
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}>
            {item.type}
          </span>
          <span className="text-[11px] text-charcoal-muted block mt-1">{item.category}</span>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Feedback Details & Concierge Reply',
      render: item => (
        <div className="space-y-1.5 max-w-md">
          <p className="text-xs text-charcoal dark:text-gray-200 leading-relaxed italic">
            "{item.message}"
          </p>
          {item.response && (
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-primary dark:text-white flex items-start gap-2">
              <CornerDownRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-accent block">Reply from {item.assignedStaff}:</span>
                <span>{item.response}</span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'assignedStaff',
      header: 'Assigned Staff',
      sortable: true,
      render: item => (
        <div className="text-xs">
          <p className="font-medium text-primary dark:text-white">{item.assignedStaff}</p>
          <span className="text-[10px] text-charcoal-muted font-mono">{item.date}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.status === 'Resolved'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : item.status === 'Replied'
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenReply(item)}
            className="px-2.5 py-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal dark:text-gray-200 hover:text-accent transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span>Respond</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Feedback & Complaint Management"
        description="Address guest concerns, dispatch tailored responses, assign resolutions to department heads, and monitor service recovery."
        badge={`${feedbacks.filter(f => f.status === 'Pending').length} Pending Requests`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Attention"
          value={feedbacks.filter(f => f.status === 'Pending').length}
          change="Urgent triage"
          isPositive={false}
          icon={Clock}
          subtitle="SLA: < 2 Hours"
        />
        <StatCard
          title="Replied & In Progress"
          value={feedbacks.filter(f => f.status === 'Replied').length}
          change="Concierge active"
          isPositive={true}
          icon={MessageSquare}
          subtitle="Guest in dialogue"
        />
        <StatCard
          title="Resolved Successfully"
          value={feedbacks.filter(f => f.status === 'Resolved').length}
          change="100% satisfaction"
          isPositive={true}
          icon={CheckCircle}
          subtitle="Closed tickets"
        />
        <StatCard
          title="Average Response Time"
          value="24 Mins"
          change="Below 45m benchmark"
          isPositive={true}
          icon={UserCheck}
          subtitle="Executive velocity"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl border border-border/80 dark:border-white/10 bg-white dark:bg-primary-900 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, reservation code, or feedback text..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white placeholder:text-charcoal-muted"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Replied">Replied</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer"
          >
            <option value="all">All Feedback Types</option>
            <option value="Complaint">Complaints</option>
            <option value="Suggestion">Suggestions</option>
            <option value="Inquiry">Inquiries</option>
            <option value="Praise">Praise</option>
          </select>
        </div>
      </div>

      <DataTable
        data={filteredFeedbacks}
        columns={columns}
        keyExtractor={item => item.id}
        searchable={false}
        pageSize={8}
      />

      {/* Response / Resolution Modal */}
      {replyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-primary-900 border border-border dark:border-accent/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-border/80 dark:border-white/10">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Respond to Guest Feedback
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Guest: {replyingItem.guestName} • Suite {replyingItem.roomNumber} ({replyingItem.bookingCode})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingItem(null)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 text-xs">
                <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider block">
                  Original Feedback ({replyingItem.category})
                </span>
                <p className="text-charcoal dark:text-gray-200 mt-1 italic leading-relaxed">
                  "{replyingItem.message}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200 mb-1.5">
                    Assign Staff Lead
                  </label>
                  <select
                    value={assignStaff}
                    onChange={(e) => setAssignStaff(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white"
                  >
                    {STAFF_LIST.map((staff, idx) => (
                      <option key={idx} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200 mb-1.5">
                    Updated Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Replied">Replied</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200 mb-1.5">
                  Official Concierge Response
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Draft bespoke concierge response to guest..."
                  className="w-full px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white placeholder:text-charcoal-muted resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReplyingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  icon={Send}
                >
                  Dispatch Response
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagementPage;
