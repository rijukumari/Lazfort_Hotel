/**
 * Lazfort Hotel ERP - Navigation Configuration (Pure JavaScript)
 */

export const NAVIGATION_CONFIG = {
  super_admin: [
    {
      id: 'sa-core',
      title: 'Platform Core',
      role: 'super_admin',
      items: [
        {
          id: 'sa-dashboard',
          label: 'Dashboard',
          path: '/super-admin/dashboard',
          iconName: 'LayoutDashboard',
          children: [
            { id: 'sa-dash-ov', label: 'Overview', path: '/super-admin/dashboard' },
            { id: 'sa-dash-ana', label: 'System Analytics', path: '/super-admin/dashboard/analytics' },
            { id: 'sa-dash-act', label: 'Recent Activities', path: '/super-admin/dashboard/activities' }
          ]
        },
        {
          id: 'sa-hotels',
          label: 'Hotel Management',
          path: '/super-admin/hotels',
          iconName: 'Building2',
          children: [
            { id: 'sa-hotels-all', label: 'All Hotels', path: '/super-admin/hotels' },
            { id: 'sa-hotels-details', label: 'Hotel Details', path: '/super-admin/hotels/details' },
            { id: 'sa-hotels-approvals', label: 'Hotel Approvals', path: '/super-admin/hotels/approvals' },
            { id: 'sa-hotels-status', label: 'Hotel Status', path: '/super-admin/hotels/status' }
          ]
        },
        {
          id: 'sa-hotel-admins',
          label: 'Hotel Admin Management',
          path: '/super-admin/hotel-admins',
          iconName: 'UserCheck',
          children: [
            { id: 'sa-admins-all', label: 'All Hotel Admins', path: '/super-admin/hotel-admins' },
            { id: 'sa-admins-add', label: 'Add Admin', path: '/super-admin/hotel-admins/add' },
            { id: 'sa-admins-perms', label: 'Admin Permissions', path: '/super-admin/hotel-admins/permissions' }
          ]
        }
      ]
    },
    {
      id: 'sa-finance-users',
      title: 'Finance & Accounts',
      role: 'super_admin',
      items: [
        {
          id: 'sa-subscriptions',
          label: 'Subscription Management',
          path: '/super-admin/subscriptions',
          iconName: 'Crown',
          children: [
            { id: 'sa-sub-plans', label: 'Subscription Plans', path: '/super-admin/subscriptions' },
            { id: 'sa-sub-active', label: 'Active Subscriptions', path: '/super-admin/subscriptions/active' },
            { id: 'sa-sub-expired', label: 'Expired Subscriptions', path: '/super-admin/subscriptions/expired' },
            { id: 'sa-sub-features', label: 'Plan Features', path: '/super-admin/subscriptions/features' }
          ]
        },
        {
          id: 'sa-billing',
          label: 'Billing & Payments',
          path: '/super-admin/billing',
          iconName: 'CreditCard',
          children: [
            { id: 'sa-bill-rev', label: 'Platform Revenue', path: '/super-admin/billing' },
            { id: 'sa-bill-tx', label: 'Payment Transactions', path: '/super-admin/billing/transactions' },
            { id: 'sa-bill-refund', label: 'Refund Requests', path: '/super-admin/billing/refunds' },
            { id: 'sa-bill-inv', label: 'Invoices', path: '/super-admin/billing/invoices' }
          ]
        },
        {
          id: 'sa-users',
          label: 'User Management',
          path: '/super-admin/users',
          iconName: 'Users',
          children: [
            { id: 'sa-users-all', label: 'All Users', path: '/super-admin/users' },
            { id: 'sa-users-act', label: 'Active Users', path: '/super-admin/users/active' },
            { id: 'sa-users-sus', label: 'Suspended Users', path: '/super-admin/users/suspended' }
          ]
        }
      ]
    },
    {
      id: 'sa-governance',
      title: 'Governance & Reports',
      role: 'super_admin',
      items: [
        {
          id: 'sa-platform',
          label: 'Platform Management',
          path: '/super-admin/platform',
          iconName: 'Sliders',
          children: [
            { id: 'sa-plat-settings', label: 'Global Settings', path: '/super-admin/platform/settings' },
            { id: 'sa-plat-feat', label: 'Feature Management', path: '/super-admin/platform/features' },
            { id: 'sa-plat-ann', label: 'System Announcements', path: '/super-admin/platform/announcements' }
          ]
        },
        {
          id: 'sa-support',
          label: 'Support & Tickets',
          path: '/super-admin/support',
          iconName: 'HelpCircle',
          children: [
            { id: 'sa-sup-tickets', label: 'Support Tickets', path: '/super-admin/support' },
            { id: 'sa-sup-complaints', label: 'Complaints', path: '/super-admin/support/complaints' },
            { id: 'sa-sup-contact', label: 'Contact Requests', path: '/super-admin/support/contact' }
          ]
        },
        {
          id: 'sa-reports',
          label: 'Platform Reports',
          path: '/super-admin/reports',
          iconName: 'BarChart3',
          children: [
            { id: 'sa-rep-plat', label: 'Platform Reports', path: '/super-admin/reports' },
            { id: 'sa-rep-perf', label: 'Hotel Performance', path: '/super-admin/reports/performance' },
            { id: 'sa-rep-rev', label: 'Revenue Reports', path: '/super-admin/reports/revenue' }
          ]
        },
        {
          id: 'sa-system',
          label: 'System & Security',
          path: '/super-admin/system',
          iconName: 'ShieldCheck',
          children: [
            { id: 'sa-sys-audit', label: 'Audit Logs', path: '/super-admin/system/audit' },
            { id: 'sa-sys-health', label: 'System Health', path: '/super-admin/system/health' },
            { id: 'sa-sys-backup', label: 'Backup Status', path: '/super-admin/system/backups' },
            { id: 'sa-sys-sec', label: 'Security Settings', path: '/super-admin/system/security' }
          ]
        }
      ]
    }
  ],

  hotel_admin: [
    {
      id: 'ha-operations',
      title: 'Hotel Operations',
      role: 'hotel_admin',
      items: [
        {
          id: 'ha-dashboard',
          label: 'Dashboard',
          path: '/hotel-admin/dashboard',
          iconName: 'LayoutDashboard',
          children: [
            { id: 'ha-dash-ov', label: 'Overview', path: '/hotel-admin/dashboard/overview' },
            { id: 'ha-dash-today', label: "Today's Summary", path: '/hotel-admin/dashboard/today-summary' },
            { id: 'ha-dash-occ', label: 'Occupancy Analytics', path: '/hotel-admin/dashboard/occupancy-analytics' },
            { id: 'ha-dash-rev', label: 'Revenue Analytics', path: '/hotel-admin/dashboard/revenue-analytics' },
            { id: 'ha-dash-rec', label: 'Recent Bookings', path: '/hotel-admin/dashboard/recent-bookings' }
          ]
        },
        {
          id: 'ha-rooms',
          label: 'Room Management',
          path: '/hotel-admin/rooms',
          iconName: 'BedDouble',
          children: [
            { id: 'ha-rooms-all', label: 'All Rooms', path: '/hotel-admin/rooms' },
            { id: 'ha-rooms-add', label: 'Add Room', path: '/hotel-admin/rooms/add' },
            { id: 'ha-rooms-cat', label: 'Room Categories', path: '/hotel-admin/rooms/categories' },
            { id: 'ha-rooms-amen', label: 'Room Amenities', path: '/hotel-admin/rooms/amenities' },
            { id: 'ha-rooms-img', label: 'Room Images', path: '/hotel-admin/rooms/images' },
            { id: 'ha-rooms-prc', label: 'Room Pricing', path: '/hotel-admin/rooms/pricing' },
            { id: 'ha-rooms-avail', label: 'Room Availability', path: '/hotel-admin/rooms/availability' },
            { id: 'ha-rooms-maint', label: 'Room Maintenance', path: '/hotel-admin/rooms/maintenance' }
          ]
        },
        {
          id: 'ha-bookings',
          label: 'Booking Management',
          path: '/hotel-admin/bookings',
          iconName: 'CalendarCheck',
          children: [
            { id: 'ha-bkg-all', label: 'All Bookings', path: '/hotel-admin/bookings' },
            { id: 'ha-bkg-new', label: 'New Bookings', path: '/hotel-admin/bookings/new' },
            { id: 'ha-bkg-conf', label: 'Confirmed Bookings', path: '/hotel-admin/bookings/confirmed' },
            { id: 'ha-bkg-pend', label: 'Pending Bookings', path: '/hotel-admin/bookings/pending' },
            { id: 'ha-bkg-in', label: 'Checked-in Bookings', path: '/hotel-admin/bookings/checked-in' },
            { id: 'ha-bkg-out', label: 'Checked-out Bookings', path: '/hotel-admin/bookings/checked-out' },
            { id: 'ha-bkg-canc', label: 'Cancelled Bookings', path: '/hotel-admin/bookings/cancelled' },
            { id: 'ha-bkg-cal', label: 'Booking Calendar', path: '/hotel-admin/bookings/calendar' }
          ]
        },
        {
          id: 'ha-frontdesk',
          label: 'Front Desk',
          path: '/hotel-admin/front-desk',
          iconName: 'ConciergeBell',
          children: [
            { id: 'ha-fd-rec', label: 'Reception Overview', path: '/hotel-admin/front-desk' },
            { id: 'ha-fd-walk', label: 'Walk-in Bookings', path: '/hotel-admin/front-desk/walk-in' },
            { id: 'ha-fd-alloc', label: 'Room Allocation', path: '/hotel-admin/front-desk/allocations' },
            { id: 'ha-fd-checkin', label: 'Check-in', path: '/hotel-admin/front-desk/check-in' },
            { id: 'ha-fd-checkout', label: 'Check-out', path: '/hotel-admin/front-desk/check-out' },
            { id: 'ha-fd-trans', label: 'Room Transfers', path: '/hotel-admin/front-desk/transfers' }
          ]
        }
      ]
    },
    {
      id: 'ha-hospitality',
      title: 'Hospitality & Services',
      role: 'hotel_admin',
      items: [
        {
          id: 'ha-guests',
          label: 'Guest Management',
          path: '/hotel-admin/guests',
          iconName: 'Award',
          children: [
            { id: 'ha-gst-all', label: 'All Guests', path: '/hotel-admin/guests' },
            { id: 'ha-gst-dtl', label: 'Guest Details', path: '/hotel-admin/guests/details' },
            { id: 'ha-gst-hist', label: 'Guest History', path: '/hotel-admin/guests/history' },
            { id: 'ha-gst-vip', label: 'VIP Guests', path: '/hotel-admin/guests/vip' },
            { id: 'ha-gst-fb', label: 'Guest Feedback', path: '/hotel-admin/guests/feedback' }
          ]
        },
        {
          id: 'ha-housekeeping',
          label: 'Housekeeping',
          path: '/hotel-admin/housekeeping',
          iconName: 'Sparkles',
          children: [
            { id: 'ha-hk-ov', label: 'Housekeeping Overview', path: '/hotel-admin/housekeeping' },
            { id: 'ha-hk-clean', label: 'Room Cleaning', path: '/hotel-admin/housekeeping/cleaning' },
            { id: 'ha-hk-assign', label: 'Cleaning Assignments', path: '/hotel-admin/housekeeping/assignments' },
            { id: 'ha-hk-insp', label: 'Inspection', path: '/hotel-admin/housekeeping/inspection' },
            { id: 'ha-hk-maint', label: 'Maintenance Requests', path: '/hotel-admin/housekeeping/maintenance' },
            { id: 'ha-hk-lost', label: 'Lost & Found', path: '/hotel-admin/housekeeping/lost-found' }
          ]
        },
        {
          id: 'ha-restaurant',
          label: 'Restaurant & Dining',
          path: '/hotel-admin/restaurant',
          iconName: 'UtensilsCrossed',
          children: [
            { id: 'ha-rst-dash', label: 'Restaurant Dashboard', path: '/hotel-admin/restaurant' },
            { id: 'ha-rst-cat', label: 'Menu Categories', path: '/hotel-admin/restaurant/categories' },
            { id: 'ha-rst-menu', label: 'Menu Items', path: '/hotel-admin/restaurant/menu' },
            { id: 'ha-rst-orders', label: 'Food Orders', path: '/hotel-admin/restaurant/orders' },
            { id: 'ha-rst-tbl', label: 'Tables', path: '/hotel-admin/restaurant/tables' },
            { id: 'ha-rst-bill', label: 'Restaurant Billing', path: '/hotel-admin/restaurant/billing' }
          ]
        },
        {
          id: 'ha-staff',
          label: 'Staff Management',
          path: '/hotel-admin/staff',
          iconName: 'Users2',
          children: [
            { id: 'ha-stf-all', label: 'All Staff', path: '/hotel-admin/staff' },
            { id: 'ha-stf-add', label: 'Add Staff', path: '/hotel-admin/staff/add' },
            { id: 'ha-stf-dept', label: 'Departments', path: '/hotel-admin/staff/departments' },
            { id: 'ha-stf-roles', label: 'Roles & Permissions', path: '/hotel-admin/staff/roles' },
            { id: 'ha-stf-att', label: 'Attendance', path: '/hotel-admin/staff/attendance' },
            { id: 'ha-stf-sched', label: 'Shift Scheduling', path: '/hotel-admin/staff/schedule' },
            { id: 'ha-stf-leave', label: 'Leave Requests', path: '/hotel-admin/staff/leave' }
          ]
        },
        {
          id: 'ha-inventory',
          label: 'Inventory & Stores',
          path: '/hotel-admin/inventory',
          iconName: 'Boxes',
          children: [
            { id: 'ha-inv-cat', label: 'Item Catalog', path: '/hotel-admin/inventory' },
            { id: 'ha-inv-alerts', label: 'Low Stock Alerts', path: '/hotel-admin/inventory' },
            { id: 'ha-inv-mv', label: 'Stock Movements', path: '/hotel-admin/inventory' }
          ]
        },
        {
          id: 'ha-maintenance',
          label: 'Maintenance & Engineering',
          path: '/hotel-admin/maintenance',
          iconName: 'Wrench',
          children: [
            { id: 'ha-mnt-tickets', label: 'Maintenance Tickets', path: '/hotel-admin/maintenance' },
            { id: 'ha-mnt-assets', label: 'Asset Register', path: '/hotel-admin/maintenance' }
          ]
        }
      ]
    },
    {
      id: 'ha-admin-reports',
      title: 'Finance & Settings',
      role: 'hotel_admin',
      items: [
        {
          id: 'ha-payments',
          label: 'Finance & General Ledger',
          path: '/hotel-admin/payments',
          iconName: 'Receipt',
          children: [
            { id: 'ha-pay-tx', label: 'Guest Folios', path: '/hotel-admin/payments' },
            { id: 'ha-pay-inv', label: 'Invoices', path: '/hotel-admin/payments' },
            { id: 'ha-pay-coa', label: 'Chart of Accounts', path: '/hotel-admin/payments' },
            { id: 'ha-pay-journal', label: 'Journal Entries', path: '/hotel-admin/payments' }
          ]
        },
        {
          id: 'ha-payroll',
          label: 'Executive Payroll',
          path: '/hotel-admin/payroll',
          iconName: 'Wallet',
          children: [
            { id: 'ha-pr-runs', label: 'Payroll Runs', path: '/hotel-admin/payroll' },
            { id: 'ha-pr-slips', label: 'Employee Payslips', path: '/hotel-admin/payroll' }
          ]
        },
        {
          id: 'ha-marketing',
          label: 'Offers & Marketing',
          path: '/hotel-admin/marketing',
          iconName: 'Tag',
          children: [
            { id: 'ha-mkt-off', label: 'Offers & Discounts', path: '/hotel-admin/marketing' },
            { id: 'ha-mkt-cup', label: 'Coupons', path: '/hotel-admin/marketing/coupons' },
            { id: 'ha-mkt-pkg', label: 'Packages', path: '/hotel-admin/marketing/packages' },
            { id: 'ha-mkt-ban', label: 'Promotional Banners', path: '/hotel-admin/marketing/banners' }
          ]
        },
        {
          id: 'ha-reviews',
          label: 'Guest Reviews',
          path: '/hotel-admin/reviews',
          iconName: 'Star',
          children: [
            { id: 'ha-rev-all', label: 'Guest Reviews', path: '/hotel-admin/reviews' },
            { id: 'ha-rev-rate', label: 'Ratings', path: '/hotel-admin/reviews/ratings' },
            { id: 'ha-rev-fb', label: 'Feedback Management', path: '/hotel-admin/reviews/feedback' }
          ]
        },
        {
          id: 'ha-reports',
          label: 'Reports & Analytics',
          path: '/hotel-admin/reports',
          iconName: 'TrendingUp',
          children: [
            { id: 'ha-rep-rev', label: 'Revenue Reports', path: '/hotel-admin/reports' },
            { id: 'ha-rep-occ', label: 'Occupancy Reports', path: '/hotel-admin/reports/occupancy' },
            { id: 'ha-rep-bkg', label: 'Booking Reports', path: '/hotel-admin/reports/bookings' },
            { id: 'ha-rep-canc', label: 'Cancellation Reports', path: '/hotel-admin/reports/cancellations' },
            { id: 'ha-rep-gst', label: 'Guest Reports', path: '/hotel-admin/reports/guests' },
            { id: 'ha-rep-stf', label: 'Staff Reports', path: '/hotel-admin/reports/staff' },
            { id: 'ha-rep-exp', label: 'Export Reports', path: '/hotel-admin/reports/export' }
          ]
        },
        {
          id: 'ha-settings',
          label: 'Hotel Settings',
          path: '/hotel-admin/settings',
          iconName: 'Settings',
          children: [
            { id: 'ha-set-prof', label: 'Hotel Profile', path: '/hotel-admin/settings' },
            { id: 'ha-set-info', label: 'Hotel Information', path: '/hotel-admin/settings/info' },
            { id: 'ha-set-brand', label: 'Logo & Branding', path: '/hotel-admin/settings/branding' },
            { id: 'ha-set-rules', label: 'Check-in / Check-out Rules', path: '/hotel-admin/settings/rules' },
            { id: 'ha-set-canc', label: 'Cancellation Policy', path: '/hotel-admin/settings/cancellation' },
            { id: 'ha-set-tax', label: 'Taxes & Charges', path: '/hotel-admin/settings/taxes' },
            { id: 'ha-set-notif', label: 'Notification Preferences', path: '/hotel-admin/settings/notifications' },
            { id: 'ha-set-pay', label: 'Payment Preferences', path: '/hotel-admin/settings/payments' }
          ]
        }
      ]
    }
  ],

  receptionist: [
    {
      id: 'rc-desk',
      title: 'Front Desk Operations',
      role: 'receptionist',
      items: [
        {
          id: 'rc-dashboard',
          label: 'Dashboard',
          path: '/receptionist/dashboard',
          iconName: 'LayoutDashboard',
          children: [
            { id: 'rc-dash-ov', label: 'Front Desk Overview', path: '/receptionist/dashboard' },
            { id: 'rc-dash-arr', label: "Today's Arrivals", path: '/receptionist/dashboard/arrivals' },
            { id: 'rc-dash-dep', label: "Today's Departures", path: '/receptionist/dashboard/departures' },
            { id: 'rc-dash-avail', label: 'Available Rooms', path: '/receptionist/dashboard/available' }
          ]
        },
        {
          id: 'rc-reservations',
          label: 'Reservations',
          path: '/receptionist/reservations',
          iconName: 'CalendarDays',
          children: [
            { id: 'rc-res-all', label: 'All Bookings', path: '/receptionist/reservations' },
            { id: 'rc-res-new', label: 'New Booking', path: '/receptionist/reservations/new' },
            { id: 'rc-res-walk', label: 'Walk-in Booking', path: '/receptionist/reservations/walk-in' },
            { id: 'rc-res-cal', label: 'Booking Calendar', path: '/receptionist/reservations/calendar' },
            { id: 'rc-res-srch', label: 'Booking Search', path: '/receptionist/reservations/search' },
            { id: 'rc-res-mod', label: 'Booking Modifications', path: '/receptionist/reservations/modifications' },
            { id: 'rc-res-canc', label: 'Cancellation Requests', path: '/receptionist/reservations/cancellations' }
          ]
        },
        {
          id: 'rc-guest-services',
          label: 'Guest Services',
          path: '/receptionist/guest-services',
          iconName: 'HeartHandshake',
          children: [
            { id: 'rc-gst-reg', label: 'Guest Registration', path: '/receptionist/guest-services/registration' },
            { id: 'rc-gst-dir', label: 'Guest Directory', path: '/receptionist/guest-services/directory' },
            { id: 'rc-gst-req', label: 'Guest Requests', path: '/receptionist/guest-services/requests' },
            { id: 'rc-gst-hist', label: 'Guest History', path: '/receptionist/guest-services/history' }
          ]
        },
        {
          id: 'rc-room-ops',
          label: 'Room Operations',
          path: '/receptionist/room-operations',
          iconName: 'Key',
          children: [
            { id: 'rc-ro-avail', label: 'Room Availability', path: '/receptionist/room-operations' },
            { id: 'rc-ro-alloc', label: 'Room Allocation', path: '/receptionist/room-operations/allocation' },
            { id: 'rc-ro-trans', label: 'Room Transfers', path: '/receptionist/room-operations/transfers' },
            { id: 'rc-ro-checkin', label: 'Check-in', path: '/receptionist/room-operations/check-in' },
            { id: 'rc-ro-checkout', label: 'Check-out', path: '/receptionist/room-operations/check-out' },
            { id: 'rc-ro-timing', label: 'Early / Late Check-out', path: '/receptionist/room-operations/timing' }
          ]
        },
        {
          id: 'rc-payments',
          label: 'Payments',
          path: '/receptionist/payments',
          iconName: 'CreditCard',
          children: [
            { id: 'rc-pay-collect', label: 'Collect Payment', path: '/receptionist/payments/collect' },
            { id: 'rc-pay-hist', label: 'Payment History', path: '/receptionist/payments/history' },
            { id: 'rc-pay-gen', label: 'Generate Invoice', path: '/receptionist/payments/invoice' },
            { id: 'rc-pay-rcpt', label: 'Print Receipt', path: '/receptionist/payments/receipt' },
            { id: 'rc-pay-pend', label: 'Pending Payments', path: '/receptionist/payments/pending' }
          ]
        }
      ]
    }
  ],

  customer: [
    {
      id: 'cs-portal',
      title: 'Customer Suite Console',
      role: 'customer',
      items: [
        {
          id: 'cs-dashboard',
          label: 'Customer Dashboard',
          path: '/customer/dashboard',
          iconName: 'Compass',
        },
        {
          id: 'cs-book-room',
          label: 'Book a Room',
          path: '/customer/book',
          iconName: 'BedDouble',
        },
        {
          id: 'cs-available-rooms',
          label: 'Available Rooms',
          path: '/customer/rooms',
          iconName: 'Sparkles',
        },
        {
          id: 'cs-my-bookings',
          label: 'My Bookings',
          path: '/customer/bookings',
          iconName: 'Suitcase',
          children: [
            { id: 'cs-bkg-all', label: 'All Stays & Bookings', path: '/customer/bookings' },
            { id: 'cs-bkg-upc', label: 'Upcoming Reservations', path: '/customer/bookings' },
          ]
        },
        {
          id: 'cs-payments',
          label: 'Payments & Invoices',
          path: '/customer/payments',
          iconName: 'Receipt',
        },
        {
          id: 'cs-services',
          label: 'Guest Services',
          path: '/customer/guest-services',
          iconName: 'HeartHandshake',
          children: [
            { id: 'cs-srv-req', label: 'Service Requests', path: '/customer/guest-services' },
            { id: 'cs-srv-dining', label: 'In-Room Dining Menu', path: '/customer/dining' },
            { id: 'cs-srv-amen', label: 'Hotel Facilities (Suvidha)', path: '/customer/amenities' },
            { id: 'cs-srv-suite', label: 'Aapna Room Controls', path: '/customer/my-suite' },
          ]
        },
        {
          id: 'cs-profile',
          label: 'My Profile',
          path: '/customer/profile',
          iconName: 'User',
        },
        {
          id: 'cs-vip-benefits',
          label: 'VIP Benefits',
          path: '/customer/vip-benefits',
          iconName: 'Crown',
        },
      ]
    }
  ],

  housekeeping: [
    {
      id: 'hk-dept',
      title: 'Housekeeping Services',
      role: 'housekeeping',
      items: [
        {
          id: 'hk-dashboard',
          label: 'Dashboard',
          path: '/housekeeping/dashboard',
          iconName: 'LayoutDashboard',
          children: [
            { id: 'hk-dash-ov', label: 'Housekeeping Overview', path: '/housekeeping/dashboard' },
            { id: 'hk-dash-today', label: "Today's Tasks", path: '/housekeeping/dashboard/today' },
            { id: 'hk-dash-pend', label: 'Pending Tasks', path: '/housekeeping/dashboard/pending' }
          ]
        },
        {
          id: 'hk-cleaning',
          label: 'Room Cleaning',
          path: '/housekeeping/cleaning',
          iconName: 'Sparkles',
          children: [
            { id: 'hk-cln-assign', label: 'Assigned Rooms', path: '/housekeeping/cleaning' },
            { id: 'hk-cln-todo', label: 'Rooms to Clean', path: '/housekeeping/cleaning/todo' },
            { id: 'hk-cln-prog', label: 'In Progress', path: '/housekeeping/cleaning/in-progress' },
            { id: 'hk-cln-done', label: 'Completed Tasks', path: '/housekeeping/cleaning/completed' },
            { id: 'hk-cln-check', label: 'Cleaning Checklist', path: '/housekeeping/cleaning/checklist' },
            { id: 'hk-cln-insp', label: 'Room Inspection', path: '/housekeeping/cleaning/inspection' }
          ]
        },
        {
          id: 'hk-maintenance',
          label: 'Maintenance',
          path: '/housekeeping/maintenance',
          iconName: 'Wrench',
          children: [
            { id: 'hk-maint-req', label: 'Maintenance Requests', path: '/housekeeping/maintenance' },
            { id: 'hk-maint-rep', label: 'Report an Issue', path: '/housekeeping/maintenance/report' },
            { id: 'hk-maint-hist', label: 'Maintenance History', path: '/housekeeping/maintenance/history' }
          ]
        },
        {
          id: 'hk-other',
          label: 'Services & Schedule',
          path: '/housekeeping/services',
          iconName: 'CalendarCheck',
          children: [
            { id: 'hk-oth-lost', label: 'Lost & Found', path: '/housekeeping/services/lost-found' },
            { id: 'hk-oth-sched', label: 'My Schedule', path: '/housekeeping/services/schedule' },
            { id: 'hk-oth-notif', label: 'Notifications', path: '/housekeeping/services/notifications' }
          ]
        }
      ]
    }
  ],

  staff: [
    {
      id: 'stf-portal',
      title: 'Staff Portal',
      role: 'staff',
      items: [
        {
          id: 'stf-dashboard',
          label: 'Dashboard',
          path: '/staff/dashboard',
          iconName: 'LayoutDashboard',
          children: [
            { id: 'stf-dash-ov', label: 'My Dashboard', path: '/staff/dashboard' },
            { id: 'stf-dash-today', label: "Today's Overview", path: '/staff/dashboard/today' }
          ]
        },
        {
          id: 'stf-work',
          label: 'My Work',
          path: '/staff/work',
          iconName: 'Briefcase',
          children: [
            { id: 'stf-wrk-assign', label: 'Assigned Tasks', path: '/staff/work' },
            { id: 'stf-wrk-dtl', label: 'Task Details', path: '/staff/work/details' },
            { id: 'stf-wrk-hist', label: 'Task History', path: '/staff/work/history' }
          ]
        },
        {
          id: 'stf-attendance',
          label: 'Attendance',
          path: '/staff/attendance',
          iconName: 'Clock',
          children: [
            { id: 'stf-att-my', label: 'My Attendance', path: '/staff/attendance' },
            { id: 'stf-att-clock', label: 'Check-in / Check-out', path: '/staff/attendance/clock' },
            { id: 'stf-att-hist', label: 'Attendance History', path: '/staff/attendance/history' }
          ]
        },
        {
          id: 'stf-schedule',
          label: 'Schedule & Shifts',
          path: '/staff/schedule',
          iconName: 'CalendarDays',
          children: [
            { id: 'stf-sch-shifts', label: 'My Shifts', path: '/staff/schedule' },
            { id: 'stf-sch-week', label: 'Weekly Schedule', path: '/staff/schedule/weekly' },
            { id: 'stf-sch-leave', label: 'Leave Requests', path: '/staff/schedule/leave' },
            { id: 'stf-sch-apply', label: 'Apply for Leave', path: '/staff/schedule/apply' }
          ]
        },
        {
          id: 'stf-comm',
          label: 'Communication',
          path: '/staff/communication',
          iconName: 'MessageSquare',
          children: [
            { id: 'stf-com-ann', label: 'Announcements', path: '/staff/communication/announcements' },
            { id: 'stf-com-notif', label: 'Notifications', path: '/staff/communication/notifications' },
            { id: 'stf-com-msg', label: 'Messages', path: '/staff/communication/messages' }
          ]
        }
      ]
    }
  ]
};

export default NAVIGATION_CONFIG;

