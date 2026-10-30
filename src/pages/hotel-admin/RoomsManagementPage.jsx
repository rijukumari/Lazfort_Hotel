import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, StatusBadge, ConfirmDialog } from '../../components/ui';
import { RoomCard } from '../../components/hotel/RoomCard';
import { DataTable } from '../../components/data-display/DataTable';
import { Plus, LayoutGrid, List, Layers, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const RoomsManagementPage = () => {
  const navigate = useNavigate();
  const { rooms, updateRoomStatus, deleteRoom } = useERP();
  const [viewMode, setViewMode] = useState('grid');
  const [deleteSuiteId, setDeleteSuiteId] = useState(null);
  const { showToast } = useToast();

  const handleStatusChange = (roomId, newStatus) => {
    updateRoomStatus(roomId, newStatus);
    showToast('Suite Status Updated', `Room status updated to ${newStatus}.`, 'info');
  };

  const handleConfirmDelete = () => {
    if (!deleteSuiteId) return;
    deleteRoom(deleteSuiteId);
    setDeleteSuiteId(null);
    showToast('Suite Removed', 'Suite record successfully removed from hotel portfolio.', 'success');
  };

  const roomColumns = [
    {
      key: 'roomNumber',
      header: 'Suite No.',
      sortable: true,
      render: item => <span className="font-mono font-bold text-accent">{item.roomNumber}</span>,
    },
    {
      key: 'name',
      header: 'Suite Name & Tier',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white">{item.name}</p>
          <p className="text-xs text-charcoal-muted">{item.type} • Floor {item.floor}</p>
        </div>
      ),
    },
    {
      key: 'pricePerNight',
      header: 'Price / Night',
      sortable: true,
      render: item => (
        <span className="font-serif font-bold text-accent">
          ${item.pricePerNight.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} size="sm" />
          <select
            value={item.status}
            onChange={e => handleStatusChange(item.id, e.target.value)}
            className="text-[11px] bg-transparent border border-border dark:border-border-dark rounded px-1.5 py-0.5 cursor-pointer text-charcoal-muted hover:text-charcoal dark:hover:text-white"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      ),
    },
    {
      key: 'cleaningStatus',
      header: 'Hygiene',
      sortable: true,
      render: item => <StatusBadge status={item.cleaningStatus} size="sm" />,
    },
    {
      key: 'id',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/rooms/edit/${item.id}`)}
            className="p-1.5 text-xs text-charcoal-muted hover:text-accent rounded-lg hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            title="Edit Suite"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/rooms/${item.id}`)}
            className="p-1.5 text-xs text-charcoal-muted hover:text-accent rounded-lg hover:bg-ivory dark:hover:bg-primary-800 transition-colors"
            title="View Suite Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteSuiteId(item.id)}
            className="p-1.5 text-xs text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete Suite"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Suite & Inventory Management"
        description="Configure luxury suites, check current occupancy states, maintenance schedules, and nightly pricing."
        badge={`${rooms.length} Luxury Suites`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/90 dark:bg-primary-900/90 border border-border/80 dark:border-accent/25 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'grid'
                    ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                    : 'text-charcoal-muted hover:text-accent dark:hover:text-accent'
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'table'
                    ? 'gold-gradient-bg text-primary-900 font-bold shadow-sm'
                    : 'text-charcoal-muted hover:text-accent dark:hover:text-accent'
                  }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              icon={Layers}
              onClick={() => navigate('/hotel-admin/rooms/categories')}
            >
              Categories
            </Button>

            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/rooms/add')}
            >
              Add Suite
            </Button>
          </div>
        }
      />

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onViewDetails={r => navigate(`/hotel-admin/rooms/${r.id}`)}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={rooms}
          columns={roomColumns}
          keyExtractor={item => item.id}
          searchPlaceholder="Search rooms by number, name, or suite tier..."
          statusFilterKey="status"
          statusOptions={['available', 'occupied', 'reserved', 'cleaning', 'maintenance']}
        />
      )}

      {/* Delete Confirmation */}
      {deleteSuiteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteSuiteId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Suite from Portfolio?"
          message="Are you sure you want to permanently delete this suite record? This action cannot be reversed."
          confirmText="Confirm Delete"
          variant="danger"
        />
      )}
    </div>
  );
};

export default RoomsManagementPage;

