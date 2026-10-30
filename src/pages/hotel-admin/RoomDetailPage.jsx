import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { StatusBadge, Button, Card } from '../../components/ui';
import {
  ArrowLeft,
  Edit,
} from 'lucide-react';

export const RoomDetailPage = () => {
  const { id, roomId } = useParams();
  const effectiveId = roomId || id;
  const navigate = useNavigate();
  const { rooms } = useERP();

  const room = rooms.find(r => r.id === effectiveId) || rooms[0];

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-white/10 pb-5">
        <div className="space-y-1">
          <Link
            to="/hotel-admin/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-accent" />
            <span>Back to Suites & Inventory</span>
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
              {room.name}
            </h1>
            <StatusBadge status={room.status} size="md" />
          </div>
          <p className="text-xs text-charcoal-muted">
            Suite {room.roomNumber} • {room.type} • Floor {room.floor}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            icon={Edit}
            onClick={() => navigate(`/hotel-admin/rooms/edit/${room.id}`)}
          >
            Edit Suite Details
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/hotel-admin/rooms')}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-accent/30 shadow-xl group">
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'}
              alt={room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest block mb-1">
                {room.type}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">{room.name}</h2>
              <p className="text-xs text-gray-300 mt-1">
                Suite {room.roomNumber} • Level {room.floor}
              </p>
            </div>
          </div>

          <Card variant="luxury" className="p-6 sm:p-7 space-y-4">
            <h3 className="font-serif font-bold text-lg text-primary dark:text-white">
              Architectural Overview & Highlights
            </h3>
            <p className="text-xs text-charcoal dark:text-gray-300 leading-relaxed">
              {room.description}
            </p>

            {room.amenities && room.amenities.length > 0 && (
              <div className="pt-3 border-t border-border dark:border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted dark:text-gray-400 mb-2">
                  Bespoke Suite Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">Nightly Tariff</span>
              <p className="font-serif font-bold text-2xl text-accent mt-1">${room.pricePerNight?.toLocaleString()}</p>
              <span className="text-[11px] text-charcoal-muted">USD per night</span>
            </Card>

            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">Bed Configuration</span>
              <p className="font-semibold text-lg text-primary dark:text-white mt-1">{room.bedType}</p>
              <span className="text-[11px] text-charcoal-muted">Master suite setup</span>
            </Card>

            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">Floor Level</span>
              <p className="font-mono font-bold text-2xl text-primary dark:text-white mt-1">Level {room.floor}</p>
              <span className="text-[11px] text-charcoal-muted">Elevated panoramic view</span>
            </Card>

            <Card variant="luxury" className="p-5">
              <span className="text-[10px] uppercase font-mono text-charcoal-muted font-bold block">Cleaning Hygiene</span>
              <p className="font-semibold text-lg text-emerald-600 dark:text-emerald-400 mt-1 capitalize">{room.cleaningStatus}</p>
              <span className="text-[11px] text-charcoal-muted">Turnover verified</span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;

