import React, { useState, useEffect } from 'react';
import { Search, BedDouble, Calendar, User, ArrowRight, X } from 'lucide-react';
import { mockRooms } from '../../data/mockRooms';
import { mockBookings } from '../../data/mockBookings';
import { mockGuests } from '../../data/mockGuests';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter items
  const matchedRooms = cleanQuery
    ? mockRooms.filter(
        r =>
          r.name?.toLowerCase().includes(cleanQuery) ||
          r.roomNumber?.toLowerCase().includes(cleanQuery) ||
          r.type?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedBookings = cleanQuery
    ? mockBookings.filter(
        b =>
          b.bookingCode?.toLowerCase().includes(cleanQuery) ||
          b.guestName?.toLowerCase().includes(cleanQuery) ||
          b.roomNumber?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedGuests = cleanQuery
    ? mockGuests.filter(
        g =>
          g.name?.toLowerCase().includes(cleanQuery) ||
          g.email?.toLowerCase().includes(cleanQuery) ||
          g.idNumber?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults = matchedRooms.length + matchedBookings.length + matchedGuests.length;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-primary/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Box */}
        <div className="p-4 border-b border-border dark:border-border-dark flex items-center gap-3">
          <Search className="w-5 h-5 text-accent" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search luxury suites, reservations, VIP guests, or folios... (e.g. 'Penthouse', 'Alexander', 'AUR-9921')"
            className="flex-1 bg-transparent text-sm sm:text-base text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!cleanQuery ? (
            <div className="py-8 text-center text-xs text-charcoal-muted dark:text-gray-400">
              <p className="font-serif text-sm text-primary dark:text-white font-semibold mb-1">
                Lazfort Universal Concierge Search
              </p>
              <p>Type keywords to search across active suites, bookings, and VIP guest records.</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark">
                  ESC to close
                </span>
                <span className="px-2 py-0.5 rounded bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark">
                  Enter to select
                </span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted dark:text-gray-400">
              No luxury records found matching "{query}".
            </div>
          ) : (
            <>
              {/* Rooms results */}
              {matchedRooms.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2">
                    Suites & Accommodations
                  </h5>
                  <div className="space-y-1">
                    {matchedRooms.map(room => (
                      <div
                        key={room.id}
                        onClick={() => handleSelect(`/${role.replace(/_/g, '-')}/rooms`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory dark:hover:bg-primary-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <BedDouble className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-semibold text-primary dark:text-white">
                              {room.name}{' '}
                              <span className="font-mono text-accent">({room.roomNumber})</span>
                            </p>
                            <p className="text-[11px] text-charcoal-muted">
                              {room.type} • ${room.pricePerNight}/night
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bookings results */}
              {matchedBookings.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2">
                    Reservations & Folios
                  </h5>
                  <div className="space-y-1">
                    {matchedBookings.map(bkg => (
                      <div
                        key={bkg.id}
                        onClick={() => handleSelect(`/${role.replace(/_/g, '-')}/bookings`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory dark:hover:bg-primary-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-semibold text-primary dark:text-white">
                              {bkg.bookingCode} — {bkg.guestName}
                            </p>
                            <p className="text-[11px] text-charcoal-muted">
                              Suite {bkg.roomNumber} • ${bkg.totalAmount?.toLocaleString()} USD
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guests results */}
              {matchedGuests.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2">
                    VIP Guest Profiles
                  </h5>
                  <div className="space-y-1">
                    {matchedGuests.map(guest => (
                      <div
                        key={guest.id}
                        onClick={() => handleSelect(`/${role.replace(/_/g, '-')}/guests`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory dark:hover:bg-primary-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-semibold text-primary dark:text-white">
                              {guest.name} ({guest.vipTier} Tier)
                            </p>
                            <p className="text-[11px] text-charcoal-muted">
                              {guest.email} • {guest.nationality}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;

