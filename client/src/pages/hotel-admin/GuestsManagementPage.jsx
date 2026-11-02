import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, ConfirmDialog } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import { UserPlus, Edit, Eye, Trash2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';

export const GuestsManagementPage = () => {
  const navigate = useNavigate();
  const { guests, deleteGuest } = useERP();
  const { showToast } = useToast();
  const [deleteGuestId, setDeleteGuestId] = useState(null);

  const handleConfirmDelete = () => {
    if (!deleteGuestId) return;
    deleteGuest(deleteGuestId);
    setDeleteGuestId(null);
    showToast('Guest Removed', 'Guest profile removed successfully.', 'success');
  };

  const columns = [
    {
      key: 'name',
      header: 'VIP Guest',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30"
          />
          <div>
            <p className="font-semibold text-primary dark:text-white leading-tight font-serif">{item.name}</p>
            <p className="text-xs text-charcoal-muted">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'vipTier',
      header: 'Sovereign Tier',
      sortable: true,
      render: item => <StatusBadge status={item.vipTier} size="sm" />,
    },
    {
      key: 'nationality',
      header: 'Origin',
      sortable: true,
      render: item => <span className="text-xs">{item.nationality}</span>,
    },
    {
      key: 'totalStays',
      header: 'Stays',
      sortable: true,
      render: item => <span className="font-mono text-xs">{item.totalStays} Visits</span>,
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent text-xs">
          ${item.totalSpent?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'loyaltyPoints',
      header: 'Lazfort Points',
      sortable: true,
      render: item => (
        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          {item.loyaltyPoints?.toLocaleString()} pts
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/hotel-admin/guests/edit/${item.id}`)}
            className="p-1.5 rounded-xl border border-border dark:border-border-dark text-xs text-charcoal hover:text-accent dark:text-gray-200 transition-colors"
            title="Edit VIP Profile on Dedicated Page"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/guests/${item.id}`)}
            className="px-3 py-1.5 rounded-xl btn-secondary-3d text-xs font-semibold text-charcoal dark:text-gray-200"
            title="View Profile on Dedicated Page"
          >
            Profile
          </button>
          <button
            onClick={() => setDeleteGuestId(item.id)}
            className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Remove Guest Dossier"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="VIP Guest Registry & Loyalty Dossiers"
        description="Distinguished clientele, preferences, spending history, and bespoke concierge notes."
        badge={`${guests.length} Registered VIPs`}
        actions={
          <Button
            variant="gold"
            icon={UserPlus}
            onClick={() => navigate('/hotel-admin/guests/add')}
          >
            Enroll VIP Guest
          </Button>
        }
      />

      <DataTable
        data={guests}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search guest by name, email, or nationality..."
        pageSize={6}
      />

      {/* Delete Confirmation */}
      {deleteGuestId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteGuestId(null)}
          onConfirm={handleConfirmDelete}
          title="Remove VIP Guest Record?"
          message="Are you sure you want to remove this guest dossier from the active registry? All historical stays and preferences will be archived."
          confirmText="Confirm Removal"
          variant="danger"
        />
      )}
    </div>
  );
};

export default GuestsManagementPage;

