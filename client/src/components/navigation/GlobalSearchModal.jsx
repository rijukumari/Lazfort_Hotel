import React, { useState, useEffect } from 'react';
import { Search, BedDouble, Calendar, User, Building2, Users, ArrowRight, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import hotelApi from '../../services/hotelApi';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    rooms: [],
    bookings: [],
    guests: [],
    hotels: [],
    users: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  // Keyboard shortcut & escape listener
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

  // Debounced backend API Search (350ms)
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults({ rooms: [], bookings: [], guests: [], hotels: [], users: [] });
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await hotelApi.globalSearch(trimmed, role || '');
        if (res && res.status === 'success' && res.results) {
          setResults({
            rooms: res.results.rooms || [],
            bookings: res.results.bookings || [],
            guests: res.results.guests || [],
            hotels: res.results.hotels || [],
            users: res.results.users || [],
          });
        }
      } catch (err) {
        console.error('Failed to execute global search:', err);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query, role]);

  if (!isOpen) return null;

  const totalResults =
    results.rooms.length +
    results.bookings.length +
    results.guests.length +
    results.hotels.length +
    results.users.length;

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
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-accent" />
          )}
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search luxury suites, reservations, VIP guests, hotels or staff... (e.g. 'Penthouse', 'Julian', 'RES-')"
            className="flex-1 bg-transparent text-sm sm:text-base text-primary dark:text-white placeholder:text-charcoal-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-charcoal-muted dark:text-gray-400">
              <p className="font-serif text-sm text-primary dark:text-white font-semibold mb-1">
                Lazfort Universal Concierge Search
              </p>
              <p>Type keywords to search across live MySQL suites, bookings, VIP guests, properties and platform staff.</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark">
                  ESC to close
                </span>
                <span className="px-2 py-0.5 rounded bg-ivory dark:bg-primary-800 border border-border dark:border-border-dark">
                  Enter to select
                </span>
              </div>
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center text-xs text-charcoal-muted dark:text-gray-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span>Querying sovereign database for "{query}"...</span>
            </div>
          ) : hasSearched && totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted dark:text-gray-400">
              No luxury records found matching "{query}".
            </div>
          ) : (
            <>
              {/* Hotel Properties results */}
              {results.hotels.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2 flex items-center justify-between">
                    <span>Hotel Properties</span>
                    <span className="text-[10px] text-charcoal-muted font-normal">{results.hotels.length} matches</span>
                  </h5>
                  <div className="space-y-1">
                    {results.hotels.map(hotel => (
                      <div
                        key={hotel.id}
                        onClick={() => handleSelect(hotel.path || '/super-admin/hotels/details')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory dark:hover:bg-primary-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-semibold text-primary dark:text-white">
                              {hotel.name}{' '}
                              {hotel.code && <span className="font-mono text-accent">({hotel.code})</span>}
                            </p>
                            <p className="text-[11px] text-charcoal-muted">
                              {hotel.location} • Status: <span className="capitalize text-emerald-400">{hotel.status}</span>
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suites / Accommodations results */}
              {results.rooms.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2 flex items-center justify-between">
                    <span>Suites & Accommodations</span>
                    <span className="text-[10px] text-charcoal-muted font-normal">{results.rooms.length} matches</span>
                  </h5>
                  <div className="space-y-1">
                    {results.rooms.map(room => (
                      <div
                        key={room.id}
                        onClick={() => handleSelect(room.path || `/${role.replace(/_/g, '-')}/rooms`)}
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
                              {room.type} • ${Number(room.pricePerNight).toLocaleString()}/night
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bookings / Folios results */}
              {results.bookings.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2 flex items-center justify-between">
                    <span>Reservations & Folios</span>
                    <span className="text-[10px] text-charcoal-muted font-normal">{results.bookings.length} matches</span>
                  </h5>
                  <div className="space-y-1">
                    {results.bookings.map(bkg => (
                      <div
                        key={bkg.id}
                        onClick={() => handleSelect(bkg.path || `/${role.replace(/_/g, '-')}/bookings`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory dark:hover:bg-primary-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-semibold text-primary dark:text-white">
                              {bkg.bookingCode} — {bkg.guestName}
                            </p>
                            <p className="text-[11px] text-charcoal-muted">
                              Suite {bkg.roomNumber} • ${Number(bkg.totalAmount || 0).toLocaleString()} USD •{' '}
                              <span className="capitalize text-accent">{bkg.status}</span>
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIP Guests results */}
              {results.guests.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2 flex items-center justify-between">
                    <span>VIP Guest Profiles</span>
                    <span className="text-[10px] text-charcoal-muted font-normal">{results.guests.length} matches</span>
                  </h5>
                  <div className="space-y-1">
                    {results.guests.map(guest => (
                      <div
                        key={guest.id}
                        onClick={() => handleSelect(guest.path || `/${role.replace(/_/g, '-')}/guests`)}
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

              {/* System Identities & Staff results */}
              {results.users.length > 0 && (
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-accent tracking-wider mb-2 flex items-center justify-between">
                    <span>Platform Identities & Staff</span>
                    <span className="text-[10px] text-charcoal-muted font-normal">{results.users.length} matches</span>
                  </h5>
                  <div className="space-y-1">
                    {results.users.map(user => (
                      <div
                        key={user.id}
                        onClick={() => handleSelect(user.path || '/super-admin/users/all')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-ivory dark:hover:bg-primary-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs font-semibold text-primary dark:text-white">
                              {user.name}{' '}
                              <span className="text-[10px] text-accent font-mono">({user.role})</span>
                            </p>
                            <p className="text-[11px] text-charcoal-muted">
                              {user.email} • Status: <span className="capitalize text-emerald-400">{user.status}</span>
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


