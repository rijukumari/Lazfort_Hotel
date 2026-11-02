import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge, Button, Modal, Input, Select, FormField } from '../../components/ui';
import { DataTable } from '../../components/data-display/DataTable';
import {
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Edit2,
  Clock,
  AlertCircle,
  CalendarCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useERP } from '../../context/ERPContext';

export const PendingBookingsPage = () => {
  const navigate = useNavigate();
  const { bookings, rooms, approveBooking, cancelBooking, updateBooking } = useERP();
  const { showToast } = useToast();

  const [editBooking, setEditBooking] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalAmount: 0,
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const handleApprove = (bookingId) => {
    const res = approveBooking(bookingId);
    if (res?.success) {
      showToast('Booking Approved', res.message, 'success');
    } else {
      showToast('Approval Failed', res?.message || 'Could not approve', 'error');
    }
  };

  const handleReject = (bookingId) => {
    const res = cancelBooking(bookingId, 'Booking request declined by front office');
    if (res?.success) {
      showToast('Booking Declined', 'Pending reservation request has been declined.', 'info');
    } else {
      showToast('Action Failed', res?.message || 'Could not decline booking', 'error');
    }
  };

  const openEditModal = (booking) => {
    setEditBooking(booking);
    setFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount || 0,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editBooking) return;
    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    const updated = {
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      roomId: formData.roomId,
      roomNumber: selectedRoom ? selectedRoom.roomNumber : editBooking.roomNumber,
      roomType: selectedRoom ? selectedRoom.type : editBooking.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      totalAmount: Number(formData.totalAmount),
    };

    const res = updateBooking(editBooking.id, updated);
    if (res?.success) {
      showToast('Booking Updated', 'Reservation details updated successfully.', 'success');
      setEditBooking(null);
    } else {
      showToast('Update Failed', res?.message || 'Could not update', 'error');
    }
  };

  const columns = [
    {
      key: 'bookingCode',
      header: 'Request Ref',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-bold text-amber-500">{item.bookingCode}</span>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase">
            <Clock className="w-3 h-3" /> Awaiting Review
          </div>
        </div>
      ),
    },
    {
      key: 'guestName',
      header: 'Guest Details',
      sortable: true,
      render: item => (
        <div>
          <p className="font-semibold text-primary dark:text-white">{item.guestName}</p>
          <p className="text-xs text-charcoal-muted">{item.guestEmail}</p>
          <p className="text-[11px] text-charcoal-muted">{item.guestPhone || 'No phone provided'}</p>
        </div>
      ),
    },
    {
      key: 'roomNumber',
      header: 'Requested Suite',
      sortable: true,
      render: item => (
        <div>
          <span className="font-mono font-semibold">Suite {item.roomNumber}</span>
          <p className="text-xs text-charcoal-muted">{item.roomType}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Requested Dates',
      sortable: true,
      render: item => (
        <div>
          <span className="text-xs font-medium">
            {item.checkIn} → {item.checkOut}
          </span>
          <p className="text-[11px] text-charcoal-muted font-mono">{item.nights} Nights</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Quote Value',
      sortable: true,
      render: item => (
        <div>
          <span className="font-serif font-bold text-accent text-sm">
            ${item.totalAmount?.toLocaleString()}
          </span>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
            {item.paymentStatus || 'Pending Deposit'}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Review & Action',
      render: item => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleApprove(item.id)}
            className="px-2.5 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            title="Approve & Confirm Reservation"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            onClick={() => handleReject(item.id)}
            className="px-2.5 py-1.5 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl text-[11px] font-bold hover:bg-rose-500/25 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            title="Decline Request"
          >
            <XCircle className="w-3.5 h-3.5" />
            Decline
          </button>
          <button
            onClick={() => openEditModal(item)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/hotel-admin/bookings/folio/${item.id}`)}
            className="p-2 rounded-xl btn-secondary-3d text-charcoal-muted hover:text-accent transition-colors"
            title="View Folio Statement"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Pending Reservation Requests"
        description="Review inbound booking requests, adjust room allocations, approve confirmed bookings or decline unavailable dates."
        badge={`${pendingBookings.length} Pending Approval`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={CalendarCheck}
              onClick={() => navigate('/hotel-admin/bookings/calendar')}
            >
              Booking Calendar
            </Button>
            <Button
              variant="gold"
              icon={Plus}
              onClick={() => navigate('/hotel-admin/bookings/new')}
            >
              Create New Booking
            </Button>
          </div>
        }
      />

      <DataTable
        data={pendingBookings}
        columns={columns}
        keyExtractor={item => item.id}
        searchPlaceholder="Search pending requests by guest name or room..."
        pageSize={8}
      />

      {/* Edit Booking Modal */}
      {editBooking && (
        <Modal
          isOpen={!!editBooking}
          onClose={() => setEditBooking(null)}
          title={`Edit Booking Request: ${editBooking.bookingCode}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <FormField label="Guest Full Name">
              <Input
                value={formData.guestName}
                onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Guest Email">
              <Input
                type="email"
                value={formData.guestEmail}
                onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                required
              />
            </FormField>

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

            <FormField label="Total Stay Amount ($ USD)">
              <Input
                type="number"
                value={formData.totalAmount}
                onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                required
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-white/10">
              <Button type="button" variant="outline" onClick={() => setEditBooking(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Save & Update Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PendingBookingsPage;

