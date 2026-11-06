import React, { useState, useMemo } from 'react';
import { PageHeader, Button, ConfirmDialog } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import {
  Star,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const INITIAL_REVIEWS = [
  {
    id: 'rev-001',
    guestName: 'Sir Alexander Kensington',
    roomNumber: 'PH-1201',
    reservationId: 'AUR-9921',
    review: 'Extraordinary penthouse experience. The vintage Dom Pérignon was chilled to perfection, and Head Butler Sebastian coordinated our yacht transfer effortlessly.',
    rating: 5,
    date: '2026-10-26',
    status: 'approved',
    verifiedStay: true,
  },
  {
    id: 'rev-002',
    guestName: 'Dr. Vivienne Moreau',
    roomNumber: 'ST-804',
    reservationId: 'AUR-9922',
    review: 'The Royal Thalasso spa therapy exceeded all expectations. Extremely tranquil environment, impeccable cleanliness, and warm hospitality.',
    rating: 5,
    date: '2026-10-28',
    status: 'approved',
    verifiedStay: true,
  },
  {
    id: 'rev-003',
    guestName: 'Baron Mateo Rossi',
    roomNumber: 'VL-301',
    reservationId: 'AUR-9923',
    review: 'The private cliffside dining was exquisite. Would appreciate a slightly broader selection of vintage Barolo on the in-suite dining list.',
    rating: 4,
    date: '2026-10-29',
    status: 'pending',
    verifiedStay: true,
  },
  {
    id: 'rev-004',
    guestName: 'Evelyn St. Claire',
    roomNumber: 'EX-502',
    reservationId: 'AUR-9924',
    review: 'Swift check-in with instant keycard access. The panoramic sea view from floor 5 was breathtaking. Will return on every Monaco visit.',
    rating: 5,
    date: '2026-10-24',
    status: 'approved',
    verifiedStay: true,
  },
  {
    id: 'rev-005',
    guestName: 'Countess Beatrix Von Linden',
    roomNumber: 'PR-1001',
    reservationId: 'AUR-9925',
    review: 'Exemplary butler attention. Our luggage was unpacked with meticulous care and fresh orchids were arranged each morning.',
    rating: 5,
    date: '2026-10-22',
    status: 'approved',
    verifiedStay: true,
  },
  {
    id: 'rev-006',
    guestName: 'Marcus Sterling',
    roomNumber: 'ST-402',
    reservationId: 'AUR-9926',
    review: 'Room service breakfast arrived 10 minutes late during peak morning conference hours. Otherwise pristine room condition.',
    rating: 3,
    date: '2026-10-21',
    status: 'pending',
    verifiedStay: true,
  },
];

export const GuestReviewsPage = () => {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('lazfort_all_reviews');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_REVIEWS;
  });

  const persistReviews = (list) => {
    setReviews(list);
    try {
      localStorage.setItem('lazfort_all_reviews', JSON.stringify(list));
    } catch {}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch =
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reservationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.review.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating = ratingFilter === 'all' || r.rating === Number(ratingFilter);
      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, searchQuery, ratingFilter, statusFilter]);

  const handleApprove = (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    persistReviews(updated);
    showToast('Review Approved', 'Guest review published to verified public testimonials.', 'success');
  };

  const handleReject = (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r);
    persistReviews(updated);
    showToast('Review Rejected', 'Guest review flagged and hidden from public display.', 'info');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const updated = reviews.filter(r => r.id !== deleteId);
    persistReviews(updated);
    setDeleteId(null);
    showToast('Review Deleted', 'Review removed permanently.', 'info');
  };

  const columns = [
    {
      key: 'guest',
      header: 'Guest & Suite',
      sortable: true,
      render: item => (
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-primary dark:text-white font-serif">{item.guestName}</p>
            {item.verifiedStay && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent/15 text-accent font-mono font-bold" title="Verified Stay">
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-muted">
            <span className="font-mono text-accent font-bold">{item.reservationId}</span>
            <span>•</span>
            <span>Suite {item.roomNumber}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-1">
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
      ),
    },
    {
      key: 'review',
      header: 'Review Content',
      render: item => (
        <p className="text-xs text-charcoal dark:text-gray-200 line-clamp-2 italic max-w-md">
          "{item.review}"
        </p>
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
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.status === 'approved'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : item.status === 'rejected'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
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
            onClick={() => setViewItem(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {item.status !== 'approved' && (
            <button
              onClick={() => handleApprove(item.id)}
              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
              title="Approve Review"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {item.status !== 'rejected' && (
            <button
              onClick={() => handleReject(item.id)}
              className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
              title="Reject Review"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
            title="Delete Review"
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
        title="Guest Reviews & Testimonials"
        description="Review, moderate, and publish verified 5-star guest impressions across Lazfort Palace Grand."
        badge={`${reviews.length} Total Reviews`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={reviews.length}
          change="Verified stays"
          isPositive={true}
          icon={Star}
          subtitle="Monaco suites"
        />
        <StatCard
          title="Approved Public"
          value={reviews.filter(r => r.status === 'approved').length}
          change="Displayed on portal"
          isPositive={true}
          icon={CheckCircle}
          subtitle="Live testimonials"
        />
        <StatCard
          title="Pending Moderation"
          value={reviews.filter(r => r.status === 'pending').length}
          change="Awaiting triage"
          isPositive={false}
          icon={MessageSquare}
          subtitle="Needs review"
        />
        <StatCard
          title="Average Score"
          value="4.8"
          change="5.0 Star Benchmark"
          isPositive={true}
          icon={ShieldCheck}
          subtitle="Global satisfaction"
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
            placeholder="Search by guest name, suite, reservation ID, or review text..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white placeholder:text-charcoal-muted"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer"
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-ivory/60 dark:bg-primary-950/70 border border-border/80 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent text-primary dark:text-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <DataTable
        data={filteredReviews}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Filter guest reviews..."
        pageSize={8}
      />

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-primary-900 border border-border dark:border-accent/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-border/80 dark:border-white/10">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                  Review Dossier
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Reservation {viewItem.reservationId} • Suite {viewItem.roomNumber}
                </p>
              </div>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < viewItem.rating ? 'fill-accent text-accent' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted block">Guest</span>
                <span className="font-serif font-bold text-base text-primary dark:text-white">{viewItem.guestName}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted block">Stay Date</span>
                <span className="font-mono text-primary dark:text-white">{viewItem.date}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted block">Review Feedback</span>
                <p className="p-3.5 rounded-2xl bg-ivory/60 dark:bg-primary-950/60 border border-border/80 dark:border-white/10 text-charcoal dark:text-gray-200 leading-relaxed italic mt-1">
                  "{viewItem.review}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 dark:border-white/10">
              <Button variant="outline" onClick={() => setViewItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Guest Review"
        message="Are you sure you want to permanently remove this guest review record? This action cannot be reversed."
        confirmText="Delete Review"
        confirmVariant="danger"
      />
    </div>
  );
};

export default GuestReviewsPage;
