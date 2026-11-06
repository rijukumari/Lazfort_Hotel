import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, NavLink } from 'react-router-dom';
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

  const isChildActive = (child) => {
    // 1. Exact path match is primary
    if (location.pathname === child.path) return true;

    // 2. Strict exact alias matches per child ID (no startsWith to avoid multiple active items)
    // Staff
    if (child.id === 'ha-stf-all') return location.pathname === '/hotel-admin/staff' || location.pathname === '/admin/staff';
    if (child.id === 'ha-stf-add') return location.pathname === '/hotel-admin/staff/add' || location.pathname === '/admin/staff/add';
    if (child.id === 'ha-stf-dept') return location.pathname === '/hotel-admin/staff/departments' || location.pathname === '/admin/staff/departments' || location.pathname === '/hotel-admin/staff/departments/add' || location.pathname === '/admin/staff/departments/add' || location.pathname.startsWith('/hotel-admin/staff/departments/details/') || location.pathname.startsWith('/admin/staff/departments/details/') || location.pathname.startsWith('/hotel-admin/staff/departments/edit/') || location.pathname.startsWith('/admin/staff/departments/edit/');
    if (child.id === 'ha-stf-roles') return location.pathname === '/hotel-admin/staff/roles' || location.pathname === '/admin/staff/roles';
    if (child.id === 'ha-stf-att') return location.pathname === '/hotel-admin/staff/attendance' || location.pathname === '/admin/staff/attendance';
    if (child.id === 'ha-stf-sched') return location.pathname === '/hotel-admin/staff/schedule' || location.pathname === '/admin/staff/schedule' || location.pathname === '/hotel-admin/staff/shifts' || location.pathname === '/admin/staff/shifts';
    if (child.id === 'ha-stf-leave') return location.pathname === '/hotel-admin/staff/leave' || location.pathname === '/admin/staff/leave' || location.pathname === '/hotel-admin/staff/leave-requests' || location.pathname === '/admin/staff/leave-requests';

    // Dashboard
    if (child.id === 'ha-dash-ov') return location.pathname === '/hotel-admin/dashboard/overview' || location.pathname === '/admin/dashboard/overview';
    if (child.id === 'ha-dash-today') return location.pathname === '/hotel-admin/dashboard/today' || location.pathname === '/admin/dashboard/today' || location.pathname === '/hotel-admin/dashboard/today-summary' || location.pathname === '/admin/dashboard/today-summary';
    if (child.id === 'ha-dash-occ') return location.pathname === '/hotel-admin/dashboard/occupancy' || location.pathname === '/admin/dashboard/occupancy' || location.pathname === '/hotel-admin/dashboard/occupancy-analytics' || location.pathname === '/admin/dashboard/occupancy-analytics';
    if (child.id === 'ha-dash-rev') return location.pathname === '/hotel-admin/dashboard/revenue' || location.pathname === '/admin/dashboard/revenue' || location.pathname === '/hotel-admin/dashboard/revenue-analytics' || location.pathname === '/admin/dashboard/revenue-analytics';
    if (child.id === 'ha-dash-rec') return location.pathname === '/hotel-admin/dashboard/recent-bookings' || location.pathname === '/admin/dashboard/recent-bookings';

    // Rooms
    if (child.id === 'ha-rooms-all') return location.pathname === '/hotel-admin/rooms' || location.pathname === '/admin/rooms' || location.pathname === '/admin/room-management' || location.pathname === '/admin/room-management/rooms';
    if (child.id === 'ha-rooms-add') return location.pathname === '/hotel-admin/rooms/add' || location.pathname === '/admin/rooms/add' || location.pathname === '/admin/room-management/add';
    if (child.id === 'ha-rooms-cat') return location.pathname === '/hotel-admin/rooms/categories' || location.pathname === '/admin/rooms/categories' || location.pathname === '/admin/room-management/categories';
    if (child.id === 'ha-rooms-amen') return location.pathname === '/hotel-admin/rooms/amenities' || location.pathname === '/admin/rooms/amenities' || location.pathname === '/admin/room-management/amenities';
    if (child.id === 'ha-rooms-img') return location.pathname === '/hotel-admin/rooms/images' || location.pathname === '/admin/rooms/images' || location.pathname === '/admin/room-management/images';
    if (child.id === 'ha-rooms-prc') return location.pathname === '/hotel-admin/rooms/pricing' || location.pathname === '/admin/rooms/pricing' || location.pathname === '/admin/room-management/pricing';
    if (child.id === 'ha-rooms-avail') return location.pathname === '/hotel-admin/rooms/availability' || location.pathname === '/admin/rooms/availability' || location.pathname === '/admin/room-management/availability';
    if (child.id === 'ha-rooms-maint') return location.pathname === '/hotel-admin/rooms/maintenance' || location.pathname === '/admin/rooms/maintenance' || location.pathname === '/admin/room-management/maintenance';

    // Bookings
    if (child.id === 'ha-bkg-all') return location.pathname === '/hotel-admin/bookings' || location.pathname === '/admin/bookings';
    if (child.id === 'ha-bkg-new') return location.pathname === '/hotel-admin/bookings/new' || location.pathname === '/admin/bookings/new';
    if (child.id === 'ha-bkg-conf') return location.pathname === '/hotel-admin/bookings/confirmed' || location.pathname === '/admin/bookings/confirmed';
    if (child.id === 'ha-bkg-pend') return location.pathname === '/hotel-admin/bookings/pending' || location.pathname === '/admin/bookings/pending';
    if (child.id === 'ha-bkg-in') return location.pathname === '/hotel-admin/bookings/checked-in' || location.pathname === '/admin/bookings/checked-in';
    if (child.id === 'ha-bkg-out') return location.pathname === '/hotel-admin/bookings/checked-out' || location.pathname === '/admin/bookings/checked-out';
    if (child.id === 'ha-bkg-canc') return location.pathname === '/hotel-admin/bookings/cancelled' || location.pathname === '/admin/bookings/cancelled';
    if (child.id === 'ha-bkg-cal') return location.pathname === '/hotel-admin/bookings/calendar' || location.pathname === '/admin/bookings/calendar';

    // Front Desk
    if (child.id === 'ha-fd-rec') return location.pathname === '/hotel-admin/front-desk' || location.pathname === '/admin/front-desk';
    if (child.id === 'ha-fd-walk') return location.pathname === '/hotel-admin/front-desk/walk-in' || location.pathname === '/admin/front-desk/walk-in';
    if (child.id === 'ha-fd-alloc') return location.pathname === '/hotel-admin/front-desk/allocations' || location.pathname === '/admin/front-desk/allocations';
    if (child.id === 'ha-fd-checkin') return location.pathname === '/hotel-admin/front-desk/check-in' || location.pathname === '/admin/front-desk/check-in';
    if (child.id === 'ha-fd-checkout') return location.pathname === '/hotel-admin/front-desk/check-out' || location.pathname === '/admin/front-desk/check-out';
    if (child.id === 'ha-fd-trans') return location.pathname === '/hotel-admin/front-desk/transfers' || location.pathname === '/admin/front-desk/transfers';

    // Guests
    if (child.id === 'ha-gst-all') return location.pathname === '/hotel-admin/guests' || location.pathname === '/admin/guests';
    if (child.id === 'ha-gst-dtl') return location.pathname === '/hotel-admin/guests/details' || location.pathname === '/admin/guests/details';
    if (child.id === 'ha-gst-hist') return location.pathname === '/hotel-admin/guests/history' || location.pathname === '/admin/guests/history';
    if (child.id === 'ha-gst-vip') return location.pathname === '/hotel-admin/guests/vip' || location.pathname === '/admin/guests/vip';
    if (child.id === 'ha-gst-fb') return location.pathname === '/hotel-admin/guests/feedback' || location.pathname === '/admin/guests/feedback';

    // Housekeeping
    if (child.id === 'ha-hk-ov') return location.pathname === '/hotel-admin/housekeeping' || location.pathname === '/hotel-admin/housekeeping/overview' || location.pathname === '/admin/housekeeping' || location.pathname === '/admin/housekeeping/overview';
    if (child.id === 'ha-hk-clean') return location.pathname === '/hotel-admin/housekeeping/cleaning' || location.pathname === '/admin/housekeeping/cleaning';
    if (child.id === 'ha-hk-assign') return location.pathname === '/hotel-admin/housekeeping/assignments' || location.pathname === '/admin/housekeeping/assignments';
    if (child.id === 'ha-hk-insp') return location.pathname === '/hotel-admin/housekeeping/inspection' || location.pathname === '/admin/housekeeping/inspection';
    if (child.id === 'ha-hk-maint') return location.pathname === '/hotel-admin/housekeeping/maintenance' || location.pathname === '/admin/housekeeping/maintenance';
    if (child.id === 'ha-hk-lost') return location.pathname === '/hotel-admin/housekeeping/lost-found' || location.pathname === '/admin/housekeeping/lost-found';

    // Restaurant
    if (child.id === 'ha-rst-dash') return location.pathname === '/hotel-admin/restaurant' || location.pathname === '/hotel-admin/restaurant/overview' || location.pathname === '/admin/restaurant' || location.pathname === '/admin/restaurant/overview';
    if (child.id === 'ha-rst-cat') return location.pathname === '/hotel-admin/restaurant/categories' || location.pathname === '/admin/restaurant/categories';
    if (child.id === 'ha-rst-menu') return location.pathname === '/hotel-admin/restaurant/menu-items' || location.pathname === '/hotel-admin/restaurant/menu' || location.pathname === '/admin/restaurant/menu-items' || location.pathname === '/admin/restaurant/menu';
    if (child.id === 'ha-rst-orders') return location.pathname === '/hotel-admin/restaurant/orders' || location.pathname === '/admin/restaurant/orders';
    if (child.id === 'ha-rst-tbl') return location.pathname === '/hotel-admin/restaurant/tables' || location.pathname === '/admin/restaurant/tables';
    if (child.id === 'ha-rst-bill') return location.pathname === '/hotel-admin/restaurant/billing' || location.pathname === '/admin/restaurant/billing';

    // Inventory
    if (child.id === 'ha-inv-cat') return location.pathname === '/hotel-admin/inventory/items' || location.pathname === '/hotel-admin/inventory/catalog' || location.pathname === '/admin/inventory/items' || location.pathname === '/admin/inventory/catalog';
    if (child.id === 'ha-inv-alerts') return location.pathname === '/hotel-admin/inventory/low-stock' || location.pathname === '/hotel-admin/inventory/alerts' || location.pathname === '/admin/inventory/low-stock' || location.pathname === '/admin/inventory/alerts';
    if (child.id === 'ha-inv-mv') return location.pathname === '/hotel-admin/inventory/movements' || location.pathname === '/hotel-admin/inventory/movement' || location.pathname === '/admin/inventory/movements' || location.pathname === '/admin/inventory/movement';
    if (child.id === 'ha-inv-sup') return location.pathname === '/hotel-admin/inventory/suppliers' || location.pathname === '/admin/inventory/suppliers';

    // Maintenance
    if (child.id === 'ha-mnt-overview') return location.pathname === '/hotel-admin/maintenance/overview' || location.pathname === '/admin/maintenance/overview' || location.pathname === '/hotel-admin/maintenance' || location.pathname === '/admin/maintenance';
    if (child.id === 'ha-mnt-tickets') return location.pathname === '/hotel-admin/maintenance/tickets' || location.pathname === '/admin/maintenance/tickets';
    if (child.id === 'ha-mnt-assets') return location.pathname === '/hotel-admin/maintenance/assets' || location.pathname === '/hotel-admin/maintenance/register' || location.pathname === '/admin/maintenance/assets' || location.pathname === '/admin/maintenance/register';

    // Finance & General Ledger
    if (child.id === 'ha-pay-dash') return location.pathname === '/hotel-admin/finance' || location.pathname === '/hotel-admin/finance/overview' || location.pathname === '/admin/finance' || location.pathname === '/admin/finance/overview';
    if (child.id === 'ha-pay-tx') return location.pathname === '/hotel-admin/finance/folios' || location.pathname === '/admin/finance/folios';
    if (child.id === 'ha-pay-inv') return location.pathname === '/hotel-admin/finance/invoices' || location.pathname === '/admin/finance/invoices';
    if (child.id === 'ha-pay-coa') return location.pathname === '/hotel-admin/finance/accounts' || location.pathname === '/hotel-admin/finance/chart-of-accounts' || location.pathname === '/admin/finance/accounts' || location.pathname === '/admin/finance/chart-of-accounts';
    if (child.id === 'ha-pay-journal') return location.pathname === '/hotel-admin/finance/journals' || location.pathname === '/hotel-admin/finance/journal-entries' || location.pathname === '/admin/finance/journals' || location.pathname === '/admin/finance/journal-entries';
    if (child.id === 'ha-pay-ops') return location.pathname === '/hotel-admin/finance/payments' || location.pathname === '/hotel-admin/payments' || location.pathname === '/hotel-admin/payments/transactions' || location.pathname === '/admin/finance/payments' || location.pathname === '/admin/payments' || location.pathname === '/admin/payments/transactions';

    // Payroll
    if (child.id === 'ha-pr-runs') return location.pathname === '/hotel-admin/payroll' || location.pathname === '/hotel-admin/payroll/runs' || location.pathname === '/admin/payroll' || location.pathname === '/admin/payroll/runs';
    if (child.id === 'ha-pr-slips') return location.pathname === '/hotel-admin/payroll/payslips' || location.pathname === '/admin/payroll/payslips';

    // Marketing
    if (child.id === 'ha-mkt-off') return location.pathname === '/hotel-admin/marketing' || location.pathname === '/admin/marketing';
    if (child.id === 'ha-mkt-cup') return location.pathname === '/hotel-admin/marketing/coupons' || location.pathname === '/admin/marketing/coupons';
    if (child.id === 'ha-mkt-pkg') return location.pathname === '/hotel-admin/marketing/packages' || location.pathname === '/admin/marketing/packages';
    if (child.id === 'ha-mkt-ban') return location.pathname === '/hotel-admin/marketing/banners' || location.pathname === '/admin/marketing/banners';

    // Reviews
    if (child.id === 'ha-rev-all') return location.pathname === '/hotel-admin/reviews' || location.pathname === '/admin/reviews';
    if (child.id === 'ha-rev-rate') return location.pathname === '/hotel-admin/reviews/ratings' || location.pathname === '/admin/reviews/ratings';
    if (child.id === 'ha-rev-fb') return location.pathname === '/hotel-admin/reviews/feedback' || location.pathname === '/admin/reviews/feedback';

    // Reports
    if (child.id === 'ha-rep-rev') return location.pathname === '/hotel-admin/reports' || location.pathname === '/hotel-admin/reports/revenue' || location.pathname === '/admin/reports' || location.pathname === '/admin/reports/revenue';
    if (child.id === 'ha-rep-occ') return location.pathname === '/hotel-admin/reports/occupancy' || location.pathname === '/admin/reports/occupancy';
    if (child.id === 'ha-rep-bkg') return location.pathname === '/hotel-admin/reports/bookings' || location.pathname === '/admin/reports/bookings';
    if (child.id === 'ha-rep-canc') return location.pathname === '/hotel-admin/reports/cancellations' || location.pathname === '/admin/reports/cancellations';
    if (child.id === 'ha-rep-gst') return location.pathname === '/hotel-admin/reports/guests' || location.pathname === '/admin/reports/guests';
    if (child.id === 'ha-rep-stf') return location.pathname === '/hotel-admin/reports/staff' || location.pathname === '/admin/reports/staff';
    if (child.id === 'ha-rep-exp') return location.pathname === '/hotel-admin/reports/export' || location.pathname === '/admin/reports/export';

    // Receptionist Dashboard
    if (child.id === 'rc-dash-ov') return location.pathname === '/receptionist/dashboard' || location.pathname === '/hotel-admin/dashboard/front-desk';
    if (child.id === 'rc-dash-arr') return location.pathname === '/receptionist/dashboard/arrivals' || location.pathname === '/hotel-admin/dashboard/arrivals';
    if (child.id === 'rc-dash-dep') return location.pathname === '/receptionist/dashboard/departures' || location.pathname === '/hotel-admin/dashboard/departures';
    if (child.id === 'rc-dash-avail') return location.pathname === '/receptionist/dashboard/available' || location.pathname === '/receptionist/dashboard/available-rooms' || location.pathname === '/hotel-admin/dashboard/available-rooms';

    // Receptionist Reservations
    if (child.id === 'rc-res-all') return location.pathname === '/receptionist/reservations';
    if (child.id === 'rc-res-new') return location.pathname === '/receptionist/reservations/new';
    if (child.id === 'rc-res-walk') return location.pathname === '/receptionist/reservations/walk-in' || location.pathname === '/hotel-admin/front-desk/walk-in' || location.pathname === '/admin/front-desk/walk-in';
    if (child.id === 'rc-res-cal') return location.pathname === '/receptionist/reservations/calendar';
    if (child.id === 'rc-res-srch') return location.pathname === '/receptionist/reservations/search';
    if (child.id === 'rc-res-mod') return location.pathname === '/receptionist/reservations/modifications';
    if (child.id === 'rc-res-canc') return location.pathname === '/receptionist/reservations/cancellations';

    // Receptionist Guest Services
    if (child.id === 'rc-gst-reg') return location.pathname === '/receptionist/guest-services/registration';
    if (child.id === 'rc-gst-dir') return location.pathname === '/receptionist/guest-services/directory' || location.pathname === '/receptionist/guest-services';
    if (child.id === 'rc-gst-req') return location.pathname === '/receptionist/guest-services/requests';
    if (child.id === 'rc-gst-hist') return location.pathname === '/receptionist/guest-services/history';

    // Receptionist Room Operations
    if (child.id === 'rc-ro-avail') return location.pathname === '/receptionist/room-operations' || location.pathname === '/receptionist/room-operations/available';
    if (child.id === 'rc-ro-alloc') return location.pathname === '/receptionist/room-operations/allocation';
    if (child.id === 'rc-ro-trans') return location.pathname === '/receptionist/room-operations/transfers';
    if (child.id === 'rc-ro-checkin') return location.pathname === '/receptionist/room-operations/check-in';
    if (child.id === 'rc-ro-checkout') return location.pathname === '/receptionist/room-operations/check-out';
    if (child.id === 'rc-ro-timing') return location.pathname === '/receptionist/room-operations/timing';

    // Receptionist Payments
    if (child.id === 'rc-pay-collect') return location.pathname === '/receptionist/payments/collect' || location.pathname === '/receptionist/payments';
    if (child.id === 'rc-pay-hist') return location.pathname === '/receptionist/payments/history';
    if (child.id === 'rc-pay-gen') return location.pathname === '/receptionist/payments/invoice';
    if (child.id === 'rc-pay-rcpt') return location.pathname === '/receptionist/payments/receipt';
    if (child.id === 'rc-pay-pend') return location.pathname === '/receptionist/payments/pending';

    // Housekeeping Submenus
    if (child.id === 'hk-dash-ov') return location.pathname === '/housekeeping/dashboard';
    if (child.id === 'hk-dash-today') return location.pathname === '/housekeeping/dashboard/today';
    if (child.id === 'hk-dash-pend') return location.pathname === '/housekeeping/dashboard/pending';
    if (child.id === 'hk-cln-assign') return location.pathname === '/housekeeping/cleaning/assigned' || location.pathname === '/housekeeping/cleaning';
    if (child.id === 'hk-cln-todo') return location.pathname === '/housekeeping/cleaning/todo';
    if (child.id === 'hk-cln-prog') return location.pathname === '/housekeeping/cleaning/in-progress';
    if (child.id === 'hk-cln-done') return location.pathname === '/housekeeping/cleaning/completed';
    if (child.id === 'hk-cln-check') return location.pathname === '/housekeeping/cleaning/checklist';
    if (child.id === 'hk-cln-insp') return location.pathname === '/housekeeping/cleaning/inspection';
    if (child.id === 'hk-maint-req') return location.pathname === '/housekeeping/maintenance/requests' || location.pathname === '/housekeeping/maintenance';
    if (child.id === 'hk-maint-rep') return location.pathname === '/housekeeping/maintenance/report';
    if (child.id === 'hk-maint-hist') return location.pathname === '/housekeeping/maintenance/history';
    if (child.id === 'hk-oth-lost') return location.pathname === '/housekeeping/services/lost-found';
    if (child.id === 'hk-oth-sched') return location.pathname === '/housekeeping/services/schedule';
    if (child.id === 'hk-oth-notif') return location.pathname === '/housekeeping/services/notifications';

    // Staff Submenus
    if (child.id === 'stf-dash-ov') return location.pathname === '/staff/dashboard';
    if (child.id === 'stf-dash-today') return location.pathname === '/staff/today-overview' || location.pathname === '/staff/dashboard/today';
    if (child.id === 'stf-wrk-assign') return location.pathname === '/staff/work';
    if (child.id === 'stf-wrk-dtl') return location.pathname === '/staff/work/details';
    if (child.id === 'stf-wrk-hist') return location.pathname === '/staff/work/history';
    if (child.id === 'stf-att-my') return location.pathname === '/staff/attendance';
    if (child.id === 'stf-att-clock') return location.pathname === '/staff/attendance/check-in' || location.pathname === '/staff/attendance/clock';
    if (child.id === 'stf-att-hist') return location.pathname === '/staff/attendance/history';
    if (child.id === 'stf-sch-shifts') return location.pathname === '/staff/schedule';
    if (child.id === 'stf-sch-week') return location.pathname === '/staff/schedule/weekly';
    if (child.id === 'stf-sch-leave') return location.pathname === '/staff/schedule/leave-requests' || location.pathname === '/staff/schedule/leave';
    if (child.id === 'stf-sch-apply') return location.pathname === '/staff/schedule/apply-leave' || location.pathname === '/staff/schedule/apply';
    if (child.id === 'stf-com-ann') return location.pathname === '/staff/communication/announcements';
    if (child.id === 'stf-com-notif') return location.pathname === '/staff/communication/notifications';
    if (child.id === 'stf-com-msg') return location.pathname === '/staff/communication/messages';

    // Customer Submenus
    if (child.id === 'cs-bkg-all') return location.pathname === '/customer/bookings';
    if (child.id === 'cs-bkg-upc') return location.pathname === '/customer/upcoming-reservations' || location.pathname === '/customer/bookings/upcoming';
    if (child.id === 'cs-srv-req') return location.pathname === '/customer/guest-services';
    if (child.id === 'cs-srv-dining') return location.pathname === '/customer/dining';
    if (child.id === 'cs-srv-amen') return location.pathname === '/customer/amenities';
    if (child.id === 'cs-srv-suite') return location.pathname === '/customer/my-suite';

    // Settings
    if (child.id === 'ha-set-prof') return location.pathname === '/hotel-admin/settings' || location.pathname === '/hotel-admin/settings/profile' || location.pathname === '/admin/settings' || location.pathname === '/admin/settings/profile';
    if (child.id === 'ha-set-info') return location.pathname === '/hotel-admin/settings/info' || location.pathname === '/hotel-admin/settings/information' || location.pathname === '/admin/settings/info' || location.pathname === '/admin/settings/information';
    if (child.id === 'ha-set-brand') return location.pathname === '/hotel-admin/settings/branding' || location.pathname === '/admin/settings/branding';
    if (child.id === 'ha-set-rules') return location.pathname === '/hotel-admin/settings/rules' || location.pathname === '/hotel-admin/settings/check-in-rules' || location.pathname === '/admin/settings/rules' || location.pathname === '/admin/settings/check-in-rules';
    if (child.id === 'ha-set-canc') return location.pathname === '/hotel-admin/settings/cancellation' || location.pathname === '/hotel-admin/settings/cancellation-policy' || location.pathname === '/admin/settings/cancellation' || location.pathname === '/admin/settings/cancellation-policy';
    if (child.id === 'ha-set-tax') return location.pathname === '/hotel-admin/settings/taxes' || location.pathname === '/admin/settings/taxes';
    if (child.id === 'ha-set-notif') return location.pathname === '/hotel-admin/settings/notifications' || location.pathname === '/admin/settings/notifications';
    if (child.id === 'ha-set-pay') return location.pathname === '/hotel-admin/settings/payments' || location.pathname === '/admin/settings/payments';

    return false;
  };

  const isItemActive = (item) => {
    // If item has children, the parent item itself should show active styling
    // when any of its children is currently active
    if (item.children?.some(c => location.pathname === c.path || isChildActive(c))) return true;

    // For direct links without children
    if (!item.children || item.children.length === 0) {
      if (location.pathname === item.path) return true;
    }

    return false;
  };

  // Automatically keep the active navigation group expanded without closing other groups
  useEffect(() => {
    navGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.children?.some(c => location.pathname === c.path || isChildActive(c))) {
          setOpenItems(prev => {
            if (prev[item.id]) return prev;
            return {
              ...prev,
              [item.id]: true,
            };
          });
        }
      });
    });
  }, [location.pathname]);

  const toggleItem = (itemId, defaultOpen = false) => {
    setOpenItems(prev => {
      const isCurrentlyOpen = prev[itemId] !== undefined ? prev[itemId] : defaultOpen;
      return {
        ...prev,
        [itemId]: !isCurrentlyOpen,
      };
    });
  };

  const handleMobileClose = () => {
    if (onNavigateMobile) onNavigateMobile();
  };

  return (
    <aside
      className={`relative flex flex-col h-full sidebar-3d-bg text-white select-none transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* 3D Brand Insignia Header */}
      <div className={`h-20 flex items-center border-b border-white/10 relative overflow-hidden ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
        {/* Shimmer light sweep across brand header */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        {!isCollapsed ? (
          <>
            <Link
              to={`/${role.replace(/_/g, '-')}/dashboard`}
              onClick={handleMobileClose}
              className="flex items-center gap-3.5 overflow-hidden cursor-pointer group"
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
            </Link>

            {/* 3D Desktop Collapse Toggle Button (Expanded mode) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-gray-400 hover:text-accent transition-all duration-200 active:scale-90 flex-shrink-0"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* Collapsed mode: Logo container with clean, non-overlapping expand chevron positioned cleanly on hover/edge */
          <div className="relative flex items-center justify-center w-full">
            <Link
              to={`/${role.replace(/_/g, '-')}/dashboard`}
              onClick={handleMobileClose}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/50 flex items-center justify-center text-accent shadow-gold cursor-pointer hover:scale-105 transition-transform"
              title="Lazfort ERP Luxury Management"
            >
              <Sparkles className="w-5 h-5 text-accent" />
            </Link>

            {/* 3D Desktop Expand Toggle Button (Floating cleanly on border without overlapping the logo) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full bg-[#111827] hover:bg-accent border border-accent/40 text-accent hover:text-primary-950 shadow-gold transition-all duration-200 active:scale-90 z-40"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
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
              const isOpen = openItems[item.id] !== undefined ? openItems[item.id] : active;
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setHoveredItemId(item.id)}
                  onMouseLeave={() => isCollapsed && setHoveredItemId(null)}
                >
                  {/* Parent item rendering: button for dropdown, NavLink for direct destination */}
                  {hasChildren && !isCollapsed ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleItem(item.id, active);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                        active
                          ? 'nav-item-active-3d text-white font-semibold'
                          : 'text-gray-300 hover:text-white hover:bg-white/[0.07] hover:translate-x-1'
                      }`}
                    >
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
                        <span className="truncate tracking-wide">{item.label}</span>
                      </div>

                      <span className="text-gray-400 group-hover:text-accent transition-transform duration-200 ml-2">
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>
                  ) : (
                    <NavLink
                      to={hasChildren ? (item.children?.[0]?.path || item.path) : item.path}
                      end
                      onClick={(e) => {
                        const targetPath = hasChildren ? (item.children?.[0]?.path || item.path) : item.path;
                        if (location.pathname === targetPath) {
                          e.preventDefault();
                          return;
                        }
                        handleMobileClose();
                      }}
                      className={({ isActive }) => {
                        const isCurrentlyActive = isActive || active;
                        return `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                          isCurrentlyActive
                            ? 'nav-item-active-3d text-white font-semibold'
                            : 'text-gray-300 hover:text-white hover:bg-white/[0.07] hover:translate-x-1'
                        }`;
                      }}
                    >
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
                    </NavLink>
                  )}

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
                          <NavLink
                            key={child.id}
                            to={child.path}
                            end
                            onClick={(e) => {
                              if (location.pathname === child.path) {
                                e.preventDefault();
                                return;
                              }
                              handleMobileClose();
                            }}
                            className={() => {
                              return `w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all duration-150 text-left ${
                                childActive
                                  ? 'text-accent font-semibold bg-accent/15 border-l-2 border-accent'
                                  : 'text-gray-400 hover:text-white hover:bg-white/[0.05] hover:translate-x-1'
                              }`;
                            }}
                          >
                            <span className="truncate">{child.label}</span>
                          </NavLink>
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
