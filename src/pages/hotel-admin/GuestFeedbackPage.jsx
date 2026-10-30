import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { StatCard, StatsGrid } from '../../components/ui/StatCard';
import {
  MessageSquare,
  Star,
  Search,
  Filter,
  Trash2,
  CornerDownRight,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  Send,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

const initialFeedbackData = [
  {
    id: 'fb-001',
    guestId: 'gst-001',
    guestName: 'Sir Alexander Kensington',
    bookingId: 'bkg-1001',
    bookingCode: 'AUR-9921',
    roomNumber: 'PH-1201',
    rating: 5,
    category: 'Concierge & Suite Quality',
    review: 'Extraordinary penthouse experience. The vintage Dom Pérignon was chilled to perfection, and Head Butler Sebastian coordinated our yacht transfer effortlessly.',
    date: '2026-10-26',
    status: 'Responded',
    response: 'It was our sovereign honor to host you, Sir Alexander. We eagerly look forward to your return to the Monaco Grand Penthouse.',
    respondedAt: '2026-10-26 14:30',
  },
  {
    id: 'fb-002',
    guestId: 'gst-002',
    guestName: 'Dr. Vivienne Moreau',
    bookingId: 'bkg-1002',
    bookingCode: 'AUR-9922',
    roomNumber: 'ST-804',
    rating: 5,
    category: 'Spa & Wellness',
    review: 'The Royal Thalasso spa therapy exceeded all expectations. Extremely tranquil environment, impeccable cleanliness, and warm hospitality.',
    date: '2026-10-28',
    status: 'Responded',
    response: 'Thank you Dr. Moreau for your gracious compliments. The wellness team has been informed and sends their highest regards.',
    respondedAt: '2026-10-28 16:15',
  },
  {
    id: 'fb-003',
    guestId: 'gst-003',
    guestName: 'Baron Mateo Rossi',
    bookingId: 'bkg-1003',
    bookingCode: 'AUR-9923',
    roomNumber: 'VL-301',
    rating: 4,
    category: 'Private Dining',
    review: 'The private cliffside dining was exquisite. Would appreciate a slightly broader selection of vintage Barolo on the in-suite dining list.',
    date: '2026-10-29',
    status: 'Pending',
    response: '',
    respondedAt: null,
  },
  {
    id: 'fb-004',
    guestId: 'gst-004',
    guestName: 'Evelyn St. Claire',
    bookingId: 'bkg-1004',
    bookingCode: 'AUR-9924',
    roomNumber: 'EX-502',
    rating: 5,
    category: 'Front Desk & Reception',
    review: 'Swift check-in with instant keycard access. The panoramic sea view from floor 5 was breathtaking. Will return on every Monaco visit.',
    date: '2026-10-24',
    status: 'Responded',
    response: 'Delighted to hear your stay was seamless, Evelyn. Safe travels and we look forward to your next visit!',
    respondedAt: '2026-10-24 18:00',
  },
  {
    id: 'fb-005',
    guestId: 'gst-005',
    guestName: 'Countess Beatrix Von Linden',
    bookingId: 'bkg-1005',
    bookingCode: 'AUR-9925',
    roomNumber: 'PR-1001',
    rating: 5,
    category: 'Butler Service',
    review: 'Exemplary butler attention. Our luggage was unpacked with meticulous care and fresh orchids were arranged each morning.',
    date: '2026-10-22',
    status: 'Responded',
    response: 'Countess Von Linden, your satisfaction is our highest reward. Sebastian and the butler division thank you warmly.',
    respondedAt: '2026-10-22 20:00',
  },
];

export const GuestFeedbackPage = () => {
  const navigate = useNavigate();
  const { guests } = useERP();
  const { showToast } = useToast();

  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_guest_feedbacks');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load feedbacks', e);
    }
    return initialFeedbackData;
  });

  const persistFeedbacks = (list) => {
    setFeedbacks(list);
    try {
      localStorage.setItem('lazfort_guest_feedbacks', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist feedbacks', e);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteId, setDeleteId] = useState(null);
  const [replyingItem, setReplyingItem] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(fb => {
      const matchesSearch =
        fb.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating = ratingFilter === 'all' || fb.rating === Number(ratingFilter);
      const matchesStatus = statusFilter === 'all' || fb.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [feedbacks, searchQuery, ratingFilter, statusFilter]);

  const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / Math.max(1, feedbacks.length)).toFixed(1);
  const fiveStarCount = feedbacks.filter(f => f.rating === 5).length;
  const pendingCount = feedbacks.filter(f => f.status === 'Pending').length;

  const handleOpenReply = (item) => {
    setReplyingItem(item);
    setReplyText(item.response || '');
  };

  const handleSaveReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingItem) return;

    const updated = feedbacks.map(f => {
      if (f.id === replyingItem.id) {
        return {
          ...f,
          status: 'Responded',
          response: replyText.trim(),
          respondedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        };
      }
      return f;
    });

    persistFeedbacks(updated);
    setReplyingItem(null);
    setReplyText('');
    showToast('Feedback Response Dispatched', 'Concierge reply recorded and published to guest portal.', 'success');
  };

  const handleDeleteFeedback = () => {
    if (!deleteId) return;
    const updated = feedbacks.filter(f => f.id !== deleteId);
    persistFeedbacks(updated);
    setDeleteId(null);
    showToast('Review Removed', 'Guest feedback record removed.', 'info');
  };

  const columns = [
    {
      key: 'guestName',
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
      key: 'rating',
      header: 'Rating & Sentiment',
      sortable: true,
      render: item => (
        <div>
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-3.5 h-3.5 ${
                  idx < item.rating ? 'fill-accent text-accent' : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="font-mono text-xs font-bold text-primary dark:text-white ml-1">
              {item.rating}.0
            </span>
          </div>
          <span className="text-[10px] text-charcoal-muted block mt-0.5">{item.category}</span>
        </div>
      ),
    },
    {
      key: 'review',
      header: 'Guest Review & Concierge Response',
      render: item => (
        <div className="space-y-1.5 max-w-md">
          <p className="text-xs text-charcoal dark:text-gray-200 leading-relaxed italic">
            "{item.review}"
          </p>
          {item.response && (
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-[11px] text-primary dark:text-white flex items-start gap-2">
              <CornerDownRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-accent block">Concierge Response:</span>
                <span>{item.response}</span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: item => (
        <span className="text-xs font-mono text-charcoal-muted">{item.date}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            item.status === 'Responded'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
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
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors flex items-center gap-1 text-xs"
            title="Reply to Guest Feedback"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reply</span>
          </button>
          <button
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Remove Review"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Guest Feedback & Experience Reviews"
        description="Monitor guest satisfaction, reviews across suites & facilities, and dispatch tailored concierge responses."
        badge={`${feedbacks.length} Guest Reviews`}
      />

      {/* KPI Cards */}
      <StatsGrid cols={4}>
        <StatCard
          title="Overall Satisfaction"
          value={`${avgRating} / 5.0`}
          subtitle="based on all verified stays"
          icon={<Star className="w-5 h-5 text-accent fill-accent" />}
        />
        <StatCard
          title="5-Star Perfect Ratings"
          value={fiveStarCount}
          subtitle="flawless guest impressions"
          icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Pending Responses"
          value={pendingCount}
          subtitle="awaiting concierge review"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Response Rate"
          value={`${Math.round(((feedbacks.length - pendingCount) / Math.max(1, feedbacks.length)) * 100)}%`}
          subtitle="replied by management"
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
        />
      </StatsGrid>

      {/* Search & Filters */}
      <div className="card-luxury p-6 rounded-2xl border border-border/80 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by guest name, reservation, or review text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-luxury pl-10 text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-accent" />
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[130px]"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-luxury text-xs py-1.5 px-3 min-w-[140px]"
            >
              <option value="all">All Statuses</option>
              <option value="responded">Responded</option>
              <option value="pending">Pending Reply</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredFeedbacks}
          keyExtractor={item => item.id}
          pageSize={8}
          emptyMessage="No guest feedback entries match current filters."
        />
      </div>

      {/* Reply Modal */}
      {replyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-luxury w-full max-w-lg p-6 rounded-2xl border border-accent/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <h3 className="font-serif font-bold text-base text-primary dark:text-white">
                  Respond to {replyingItem.guestName}
                </h3>
              </div>
              <button
                onClick={() => setReplyingItem(null)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-primary dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory/60 dark:bg-white/5 border border-border/60 text-xs space-y-1">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted">Guest Review:</span>
              <p className="italic text-charcoal dark:text-gray-200">"{replyingItem.review}"</p>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                  Management Official Reply *
                </label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Draft your personalized, white-glove response to the resident..."
                  className="input-luxury text-xs w-full resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setReplyingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gold"
                  type="submit"
                  icon={Send}
                >
                  Dispatch Reply
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteFeedback}
          title="Remove Feedback Entry?"
          message="Are you sure you wish to delete this guest review record from the system?"
          confirmText="Confirm Deletion"
          variant="danger"
        />
      )}
    </div>
  );
};

export default GuestFeedbackPage;

