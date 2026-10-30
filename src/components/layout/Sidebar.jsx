import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_CONFIG } from '../../config/navigation';
import { NavIcon } from '../navigation/NavIcon';
import { ChevronDown, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  onNavigateMobile,
}) => {
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Track expanded parent items
  const [openItems, setOpenItems] = useState({});
  // Hovered item for 3D tooltip in collapsed mode
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const navGroups = NAVIGATION_CONFIG[role] || [];

  const toggleItem = (itemId) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (onNavigateMobile) onNavigateMobile();
  };

  const isItemActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.children?.some(c => location.pathname === c.path)) return true;
    if (item.path === '/hotel-admin/dashboard' && (location.pathname.startsWith('/hotel-admin/dashboard') || location.pathname.startsWith('/admin/dashboard'))) return true;
    if (item.path === '/hotel-admin/rooms' && (location.pathname.startsWith('/hotel-admin/rooms') || location.pathname.startsWith('/admin/room-management') || location.pathname.startsWith('/admin/rooms'))) return true;
    if (item.path === '/hotel-admin/guests' && (location.pathname.startsWith('/hotel-admin/guests') || location.pathname.startsWith('/admin/guests'))) return true;
    if (item.path === '/hotel-admin/bookings' && (location.pathname.startsWith('/hotel-admin/bookings') || location.pathname.startsWith('/admin/bookings'))) return true;
    if (item.path === '/hotel-admin/payments' && (location.pathname.startsWith('/hotel-admin/payments') || location.pathname.startsWith('/admin/payments'))) return true;
    if (item.path === '/hotel-admin/marketing' && (location.pathname.startsWith('/hotel-admin/marketing') || location.pathname.startsWith('/admin/marketing'))) return true;
    if (item.path === '/hotel-admin/reviews' && (location.pathname.startsWith('/hotel-admin/reviews') || location.pathname.startsWith('/admin/reviews'))) return true;
    if (item.path === '/hotel-admin/reports' && (location.pathname.startsWith('/hotel-admin/reports') || location.pathname.startsWith('/admin/reports'))) return true;
    if (item.path === '/hotel-admin/settings' && (location.pathname.startsWith('/hotel-admin/settings') || location.pathname.startsWith('/admin/settings'))) return true;
    return false;
  };

  const isChildActive = (child) => {
    if (location.pathname === child.path) return true;
    // Handle cross-prefix aliases for dashboard, room-management, bookings, guests, payments and reports
    const subRoute = child.path.split('/').pop();
    if (subRoute && subRoute !== 'rooms' && subRoute !== 'bookings' && subRoute !== 'guests' && subRoute !== 'dashboard') {
      if (location.pathname.endsWith(`/${subRoute}`)) return true;
      if (subRoute === 'today-summary' && (location.pathname.endsWith('/today') || location.pathname.endsWith('/today-summary'))) return true;
      if (subRoute === 'occupancy-analytics' && (location.pathname.endsWith('/occupancy') || location.pathname.endsWith('/occupancy-analytics'))) return true;
      if (subRoute === 'revenue-analytics' && (location.pathname.endsWith('/revenue') || location.pathname.endsWith('/revenue-analytics'))) return true;
      if (subRoute === 'overview' && (location.pathname === '/hotel-admin/dashboard' || location.pathname === '/admin/dashboard' || location.pathname.endsWith('/overview'))) return true;
      if (subRoute === 'schedule' && (location.pathname.endsWith('/schedule') || location.pathname.endsWith('/shift-scheduling'))) return true;
      if (subRoute === 'leave' && (location.pathname.endsWith('/leave') || location.pathname.endsWith('/leave-requests'))) return true;
      if (
        location.pathname.includes(`/room-management/${subRoute}`) ||
        location.pathname.includes(`/rooms/${subRoute}`) ||
        location.pathname.includes(`/bookings/${subRoute}`) ||
        location.pathname.includes(`/guests/${subRoute}`) ||
        location.pathname.includes(`/dashboard/${subRoute}`) ||
        location.pathname.includes(`/payments/${subRoute}`) ||
        location.pathname.includes(`/marketing/${subRoute}`) ||
        location.pathname.includes(`/reports/${subRoute}`) ||
        location.pathname.includes(`/settings/${subRoute}`) ||
        location.pathname.includes(`/staff/${subRoute}`)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <aside
      className={`relative flex flex-col h-full sidebar-3d-bg text-white select-none transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* 3D Brand Insignia Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 relative overflow-hidden">
        {/* Shimmer light sweep across brand header */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        {!isCollapsed ? (
          <div
            className="flex items-center gap-3.5 overflow-hidden cursor-pointer group"
            onClick={() => handleNavigate(`/${role.replace(/_/g, '-')}/dashboard`)}
          >
            {/* 3D Glowing Crest */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/15 to-accent/5 border border-accent/50 flex items-center justify-center text-accent shadow-gold group-hover:scale-105 group-hover:border-accent transition-all duration-300">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-sm -z-10 group-hover:blur-md transition-all" />
            </div>

            <div className="truncate">
              <h2 className="font-serif font-bold text-xl tracking-wider text-white flex items-center gap-1.5">
                <span className="gold-gradient-text">LAZFORT</span>
                <span className="text-white text-sm font-sans tracking-widest">ERP</span>
              </h2>
              <p className="text-[10px] tracking-[0.2em] text-accent/90 uppercase font-mono font-medium">
                Resort & Palace
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/50 flex items-center justify-center text-accent shadow-gold cursor-pointer hover:scale-110 transition-transform"
            onClick={() => handleNavigate(`/${role.replace(/_/g, '-')}/dashboard`)}
            title="Lazfort ERP Luxury Management"
          >
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
        )}

        {/* 3D Desktop Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-gray-400 hover:text-accent transition-all duration-200 active:scale-90"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map(group => (
          <div key={group.id} className="space-y-1">
            {/* Group Title */}
            {!isCollapsed ? (
              <h3 className="px-3 text-[10px] uppercase font-bold text-gray-400/80 tracking-[0.15em] mb-2 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent" />
                {group.title}
              </h3>
            ) : (
              <div className="w-6 h-px bg-white/10 mx-auto my-3" />
            )}

            {/* Nav Items */}
            {group.items.map(item => {
              const active = isItemActive(item);
              const isOpen = openItems[item.id] ?? active;
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setHoveredItemId(item.id)}
                  onMouseLeave={() => isCollapsed && setHoveredItemId(null)}
                >
                  <button
                    onClick={() => {
                      if (hasChildren && !isCollapsed) {
                        toggleItem(item.id);
                      } else {
                        handleNavigate(item.path);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                      active
                        ? 'nav-item-active-3d text-white font-semibold'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.07] hover:translate-x-1'
                    }`}
                  >
                    {/* Active Left Glow Indicator */}
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-accent shadow-[0_0_8px_#C6A66B]" />
                    )}

                    <div className="flex items-center gap-3.5 truncate">
                      <div
                        className={`w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                          active
                            ? 'text-accent scale-110'
                            : 'text-gray-400 group-hover:text-accent group-hover:scale-110'
                        }`}
                      >
                        <NavIcon name={item.iconName} className="w-4 h-4 flex-shrink-0" />
                      </div>
                      {!isCollapsed && (
                        <span className="truncate tracking-wide">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && hasChildren && (
                      <span className="text-gray-400 group-hover:text-accent transition-transform duration-200 ml-2">
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* 3D Floating Tooltip in Collapsed Mode */}
                  {isCollapsed && hoveredItemId === item.id && (
                    <div className="fixed left-24 px-3.5 py-2 rounded-xl glass-dropdown border border-accent/40 text-white text-xs font-semibold shadow-2xl z-50 whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-150 pointer-events-none">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {item.label}
                      </p>
                    </div>
                  )}

                  {/* Child Accordion Links (Expanded Mode) */}
                  {!isCollapsed && hasChildren && isOpen && (
                    <div className="pl-9 pr-1 py-1 space-y-0.5 border-l border-white/10 ml-6 my-1">
                      {item.children?.map(child => {
                        const childActive = isChildActive(child);
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleNavigate(child.path)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all duration-150 text-left ${
                              childActive
                                ? 'text-accent font-semibold bg-accent/15 border-l-2 border-accent'
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.05] hover:translate-x-1'
                            }`}
                          >
                            <span className="truncate">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

