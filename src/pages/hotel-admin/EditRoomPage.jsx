import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader, FormField, Input, Select, Button } from '../../components/ui';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import {
  Edit,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const EditRoomPage = () => {
  const { id, roomId } = useParams();
  const effectiveId = roomId || id;
  const navigate = useNavigate();
  const { rooms, updateRoom } = useERP();
  const { showToast } = useToast();

  const room = rooms.find(r => r.id === effectiveId) || rooms[0];

  const [editPrice, setEditPrice] = useState(room ? room.pricePerNight : 1500);
  const [editName, setEditName] = useState(room ? room.name : '');
  const [editBedType, setEditBedType] = useState(room ? room.bedType : 'King');
  const [editDescription, setEditDescription] = useState(room ? room.description || '' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setEditPrice(room.pricePerNight);
      setEditName(room.name);
      setEditBedType(room.bedType);
      setEditDescription(room.description || '');
    }
  }, [room]);

  if (!room) {
    return (
      <div className="space-y-6">
        <Link to="/hotel-admin/rooms" className="text-xs text-charcoal-muted hover:text-accent">
          ← Back to Suites
        </Link>
        <p className="text-sm">Suite not found.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      updateRoom(room.id, {
        name: editName,
        pricePerNight: Number(editPrice),
        bedType: editBedType,
        description: editDescription,
      });

      showToast('Suite Updated', `Suite ${room.roomNumber} details updated successfully.`, 'success');
      navigate('/hotel-admin/rooms');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="space-y-4">
        <Link
          to="/hotel-admin/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
          <span>Back to Suites & Inventory</span>
        </Link>

        <PageHeader
          title={`Edit Suite: ${room.roomNumber}`}
          description={`Update commercial pricing, suite nomenclature, or specifications for ${room.name}.`}
          badge={`Suite ${room.roomNumber}`}
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/hotel-admin/rooms')}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                icon={Sparkles}
                type="submit"
                form="edit-suite-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          }
        />
      </div>

      <form id="edit-suite-form" onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-2xl rounded-3xl border border-accent/30 p-6 sm:p-8 shadow-xl relative">
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="flex items-center gap-3 pb-6 border-b border-border dark:border-white/10 mb-6">
            <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
                Modify Suite Attributes
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-0.5">
                Floor {room.floor} • Tier: {room.type}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <FormField label="Suite Title" required>
              <Input
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Nightly Rate ($ USD)" required>
                <Input
                  type="number"
                  min="100"
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Bed Configuration">
                <Select
                  value={editBedType}
                  onChange={e => setEditBedType(e.target.value)}
                >
                  <option value="Super King">Super King</option>
                  <option value="King">King</option>
                  <option value="Twin">Twin</option>
                  <option value="Queen">Queen</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Architectural Description">
              <textarea
                rows={4}
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-primary-900/60 border border-border/80 dark:border-accent/20 text-charcoal dark:text-gray-100 placeholder:text-charcoal-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none text-sm"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border dark:border-white/10 mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/hotel-admin/rooms')}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRoomPage;

