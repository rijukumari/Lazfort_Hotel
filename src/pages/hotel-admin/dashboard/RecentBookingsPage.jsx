import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal, Input, Select, FormField } from '../../../components/ui';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  CalendarCheck,
  Plus,
  FileText,
  Edit2,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  Calendar,
  Filter
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { useToast } from '../../../context/ToastContext';

export const RecentBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, rooms, updateBooking } = useERP();
  const { showToast } = useToast();

  const [editBooking, setEditBooking] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalAmount: 0,
    status: 'confirmed',
  });

  const openEditModal = (booking) => {
    setEditBooking(booking);
    setFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone || '',
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount || 0,
      status: booking.status || 'confirmed',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editBooking) return;

    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    const updated = {
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      guestPhone: formData.guestPhone,
      roomId: formData.roomId,
      roomNumber: selectedRoom ? selectedRoom.roomNumber : editBooking.roomNumber,
      roomType: selectedRoom ? selectedRoom.type : editBooking.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      totalAmount: Number(formData.totalAmount),
      status: formData.status,
    };

    const res = updateBooking(editBooking.id, updated);
    if (res?.success) {
      showToast('Booking Updated', 'Reservation changes saved successfully.', 'success');
      setEditBooking(null);
    } else {
      showToast('Update Failed', res?.message || 'Could not update booking', 'error');
    }
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Booking ID',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-accent text-xs">{item.bookingCode}</span>
          <span className="block text-[10px] text-charcoal-muted uppercase">{item.paymentMethod || 'Guaranteed'}</span>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white leading-tight">{item.guestName}</p>
          <p className="text-[11px] text-charcoal-muted">{item.guestEmail}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Suite',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-semibold text-primary dark:text-white">Suite {item.roomNumber}</span>
          <p className="text-[11px] text-charcoal-muted">{item.roomType}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Check-In → Check-Out',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs font-medium">
            {item.checkIn} → {item.checkOut}
          </span>
          <p className="text-[11px] text-charcoal-muted font-mono">{item.nights} Nights • {item.adults || 2} Adults</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      sortable: true,
      render: item => (
        <div>
          <span className="font-serif font-bold text-accent text-xs">
            ${item.totalAmount?.toLocaleString()}
          </span>
          <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
            {item.paymentStatus || 'Paid'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Booking Status',
      sortable: true,
      render: item => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="View Folio Statement on Dedicated Page"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(item)}
            className="p-1.5 rounded-lg border border-border dark:border-white/10 hover:bg-ivory dark:hover:bg-white/5 text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Booking Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <PageHeader
        title="Recent Stays & Bookings Feed"
        description="Comprehensive real-time activity log of inbound bookings, VIP suite allocations, in-house guests, and settled folios."
        badge={`${bookings.length} Total Bookings`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={Calendar}
              onClick={() => navigate('/hotel-admin/bookings/calendar')}
            >
              Calendar Schedule
            </Button>
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

      <DataTable
        data={bookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search recent reservations by booking ID, guest, or suite..."
        statusFilterKey="status"
        statusOptions={['confirmed', 'checked_in', 'checked_out', 'pending', 'cancelled']}
        pageSize={8}
      />

      {/* Edit Booking Modal */}
      {editBooking && (
        <Modal
          isOpen={!!editBooking}
          onClose={() => setEditBooking(null)}
          title={`Edit Reservation: ${editBooking.bookingCode}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <FormField label="Guest Full Name">
              <Input
                value={formData.guestName}
                onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Email Address">
                <Input
                  type="email"
                  value={formData.guestEmail}
                  onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Contact Phone">
                <Input
                  value={formData.guestPhone}
                  onChange={e => setFormData({ ...formData, guestPhone: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Assigned Suite">
              <Select
                value={formData.roomId}
                onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                options={rooms.map(r => ({
                  value: r.id,
                  label: `Suite ${r.roomNumber} - ${r.type} ($${r.pricePerNight}/night)`
                }))}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Check-In Date">
                <Input
                  type="date"
                  value={formData.checkIn}
                  onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Check-Out Date">
                <Input
                  type="date"
                  value={formData.checkOut}
                  onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Total Stay Amount ($ USD)">
                <Input
                  type="number"
                  value={formData.totalAmount}
                  onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Booking Status">
                <Select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'checked_in', label: 'Checked In' },
                    { value: 'checked_out', label: 'Checked Out' },
                    { value: 'pending', label: 'Pending Approval' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setEditBooking(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RecentBookingsPage;

