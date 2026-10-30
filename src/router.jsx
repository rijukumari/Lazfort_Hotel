import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/super-admin/SuperAdminDashboard';
import { HotelsListPage } from './pages/super-admin/HotelsListPage';
import { AddHotelPage } from './pages/super-admin/AddHotelPage';
import { EditHotelPage } from './pages/super-admin/EditHotelPage';
import { HotelDetailPage } from './pages/super-admin/HotelDetailPage';
import { HotelApprovalsPage } from './pages/super-admin/HotelApprovalsPage';
import { HotelApprovalDetailPage } from './pages/super-admin/HotelApprovalDetailPage';
import { HotelStatusPage } from './pages/super-admin/HotelStatusPage';
import { SubscriptionPlansPage } from './pages/super-admin/SubscriptionPlansPage';
import { AddSubscriptionPlanPage } from './pages/super-admin/AddSubscriptionPlanPage';
import { PlanDetailPage } from './pages/super-admin/PlanDetailPage';
import { ActiveSubscriptionsPage } from './pages/super-admin/ActiveSubscriptionsPage';
import { ExpiredSubscriptionsPage } from './pages/super-admin/ExpiredSubscriptionsPage';
import { PlanFeaturesPage } from './pages/super-admin/PlanFeaturesPage';
import { AddPlanFeaturePage } from './pages/super-admin/AddPlanFeaturePage';
import { PlanFeatureDetailPage } from './pages/super-admin/PlanFeatureDetailPage';
import { RenewSubscriptionPage } from './pages/super-admin/RenewSubscriptionPage';
import { SubscriptionDetailPage } from './pages/super-admin/SubscriptionDetailPage';
import { ManageSubscriptionPage } from './pages/super-admin/ManageSubscriptionPage';

// Super Admin Module 1: Billing & Payments
import { PlatformRevenuePage } from './pages/super-admin/billing/PlatformRevenuePage';
import { AddGLAccountPage } from './pages/super-admin/billing/AddGLAccountPage';
import { FolioStatementPage } from './pages/super-admin/billing/FolioStatementPage';
import { AddFolioChargePage } from './pages/super-admin/billing/AddFolioChargePage';
import { SettleFolioPaymentPage } from './pages/super-admin/billing/SettleFolioPaymentPage';
import { PaymentTransactionsPage } from './pages/super-admin/billing/PaymentTransactionsPage';
import { TransactionDetailPage } from './pages/super-admin/billing/TransactionDetailPage';
import { RefundRequestsPage } from './pages/super-admin/billing/RefundRequestsPage';
import { RefundDetailPage } from './pages/super-admin/billing/RefundDetailPage';
import { BillingInvoicesPage } from './pages/super-admin/billing/BillingInvoicesPage';
import { InvoiceDetailPage } from './pages/super-admin/billing/InvoiceDetailPage';

// Super Admin Module 2: User Management
import { AllUsersPage } from './pages/super-admin/users/AllUsersPage';
import { AddUserPage } from './pages/super-admin/users/AddUserPage';
import { EditUserPage } from './pages/super-admin/users/EditUserPage';
import { UserDetailPage } from './pages/super-admin/users/UserDetailPage';
import { ActiveUsersPage } from './pages/super-admin/users/ActiveUsersPage';
import { SuspendedUsersPage } from './pages/super-admin/users/SuspendedUsersPage';

// Super Admin Module 3: Platform Management
import { GlobalSettingsPage } from './pages/super-admin/platform/GlobalSettingsPage';
import { FeatureManagementPage } from './pages/super-admin/platform/FeatureManagementPage';
import { SystemAnnouncementsPage } from './pages/super-admin/platform/SystemAnnouncementsPage';
import { AddAnnouncementPage } from './pages/super-admin/platform/AddAnnouncementPage';
import { AnnouncementDetailPage } from './pages/super-admin/platform/AnnouncementDetailPage';

// Super Admin Module 4: Support & Tickets
import { SupportTicketsPage } from './pages/super-admin/support/SupportTicketsPage';
import { SupportTicketDetailPage } from './pages/super-admin/support/SupportTicketDetailPage';
import { ComplaintsPage } from './pages/super-admin/support/ComplaintsPage';
import { ComplaintDetailPage } from './pages/super-admin/support/ComplaintDetailPage';
import { ContactRequestsPage } from './pages/super-admin/support/ContactRequestsPage';

// Super Admin Module 5: Platform Reports
import { PlatformReportsPage } from './pages/super-admin/reports/PlatformReportsPage';
import { HotelPerformancePage } from './pages/super-admin/reports/HotelPerformancePage';
import { RevenueReportsPage } from './pages/super-admin/reports/RevenueReportsPage';

// Super Admin Module 6: System & Security
import { AuditLogsPage } from './pages/super-admin/system/AuditLogsPage';
import { SystemHealthPage } from './pages/super-admin/system/SystemHealthPage';
import { BackupStatusPage } from './pages/super-admin/system/BackupStatusPage';
import { SecuritySettingsPage } from './pages/super-admin/system/SecuritySettingsPage';

// Hotel Admin Pages
import { HotelAdminDashboard } from './pages/hotel-admin/HotelAdminDashboard';
import { DashboardOverviewPage } from './pages/hotel-admin/DashboardOverviewPage';
import { TodaysSummaryPage } from './pages/hotel-admin/TodaysSummaryPage';
import { OccupancyAnalyticsPage } from './pages/hotel-admin/OccupancyAnalyticsPage';
import { RevenueAnalyticsPage } from './pages/hotel-admin/RevenueAnalyticsPage';
import { RecentBookingsPage } from './pages/hotel-admin/RecentBookingsPage';
import { RoomsManagementPage } from './pages/hotel-admin/RoomsManagementPage';
import { AddRoomPage } from './pages/hotel-admin/AddRoomPage';
import { AddRoomCategoryPage } from './pages/hotel-admin/AddRoomCategoryPage';
import { EditRoomPage } from './pages/hotel-admin/EditRoomPage';
import { RoomDetailPage } from './pages/hotel-admin/RoomDetailPage';
import { RoomCategoriesPage } from './pages/hotel-admin/RoomCategoriesPage';
import { RoomAmenitiesPage } from './pages/hotel-admin/RoomAmenitiesPage';
import { RoomImagesPage } from './pages/hotel-admin/RoomImagesPage';
import { RoomPricingPage } from './pages/hotel-admin/RoomPricingPage';
import { RoomAvailabilityPage } from './pages/hotel-admin/RoomAvailabilityPage';
import { RoomMaintenancePage } from './pages/hotel-admin/RoomMaintenancePage';
import { BookingsManagementPage } from './pages/hotel-admin/BookingsManagementPage';
import { NewBookingPage } from './pages/hotel-admin/NewBookingPage';
import { ConfirmedBookingsPage } from './pages/hotel-admin/ConfirmedBookingsPage';
import { PendingBookingsPage } from './pages/hotel-admin/PendingBookingsPage';
import { CheckedInBookingsPage } from './pages/hotel-admin/CheckedInBookingsPage';
import { CheckedOutBookingsPage } from './pages/hotel-admin/CheckedOutBookingsPage';
import { CancelledBookingsPage } from './pages/hotel-admin/CancelledBookingsPage';
import { BookingCalendarPage } from './pages/hotel-admin/BookingCalendarPage';
import { BookingFolioPage } from './pages/hotel-admin/BookingFolioPage';
import { FrontDeskPage } from './pages/hotel-admin/FrontDeskPage';
import { SuiteTransferPage } from './pages/hotel-admin/SuiteTransferPage';
import { GuestsManagementPage } from './pages/hotel-admin/GuestsManagementPage';
import { GuestDetailsListingPage } from './pages/hotel-admin/GuestDetailsListingPage';
import { GuestHistoryPage } from './pages/hotel-admin/GuestHistoryPage';
import { VIPGuestsPage } from './pages/hotel-admin/VIPGuestsPage';
import { GuestFeedbackPage } from './pages/hotel-admin/GuestFeedbackPage';
import { AddGuestPage } from './pages/hotel-admin/AddGuestPage';
import { EditGuestPage } from './pages/hotel-admin/EditGuestPage';
import { GuestDetailPage } from './pages/hotel-admin/GuestDetailPage';
import { HousekeepingAdminPage } from './pages/hotel-admin/HousekeepingAdminPage';
import { ScheduleTurnoverPage } from './pages/hotel-admin/ScheduleTurnoverPage';
import { RestaurantPage } from './pages/hotel-admin/RestaurantPage';
import { NewRestaurantOrderPage } from './pages/hotel-admin/NewRestaurantOrderPage';
import { StaffManagementPage } from './pages/hotel-admin/StaffManagementPage';
import { AddStaffPage } from './pages/hotel-admin/AddStaffPage';
import { EditStaffPage } from './pages/hotel-admin/EditStaffPage';
import { StaffDetailPage } from './pages/hotel-admin/StaffDetailPage';
import { ShiftSchedulingPage } from './pages/hotel-admin/ShiftSchedulingPage';
import { LeaveRequestsPage } from './pages/hotel-admin/LeaveRequestsPage';
import { PaymentsPage } from './pages/hotel-admin/PaymentsPage';
import { MarketingPage } from './pages/hotel-admin/MarketingPage';

// Receptionist Pages
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerBrowseRoomsPage } from './pages/customer/CustomerBrowseRoomsPage';
import { RoomDetailsPage } from './pages/customer/RoomDetailsPage';
import { BookingCheckoutPage } from './pages/customer/BookingCheckoutPage';
import { BookingConfirmationPage } from './pages/customer/BookingConfirmationPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { BookingDetailPage } from './pages/customer/BookingDetailPage';
import { HotelFacilitiesPage } from './pages/customer/HotelFacilitiesPage';
import { MySuiteControlsPage } from './pages/customer/MySuiteControlsPage';
import { RoomServicePage } from './pages/customer/RoomServicePage';
import { VIPBenefitsPage } from './pages/customer/VIPBenefitsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerPaymentsPage } from './pages/customer/CustomerPaymentsPage';
import { CustomerGuestServicesPage } from './pages/customer/CustomerGuestServicesPage';
import { HotelHomePage } from './pages/public/HotelHomePage';

// Housekeeping Pages
import { HousekeepingDashboard } from './pages/housekeeping/HousekeepingDashboard';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';

// Common & Fallback Pages
import { GenericDetailPage } from './pages/common/GenericDetailPage';
import { NotFoundPage, UnauthorizedPage } from './pages/common/NotFoundPage';

// Complete ERP Modules
import { FinancePage } from './pages/erp/FinancePage';
import { InventoryPage } from './pages/erp/InventoryPage';
import { AddInventoryItemPage } from './pages/erp/AddInventoryItemPage';
import { RecordMovementPage } from './pages/erp/RecordMovementPage';
import { AddSupplierPage } from './pages/erp/AddSupplierPage';
import { MaintenancePage } from './pages/erp/MaintenancePage';
import { PayrollPage } from './pages/erp/PayrollPage';
import { ReportsPage } from './pages/erp/ReportsPage';
import { SettingsPage } from './pages/erp/SettingsPage';

export const AppRouter = () => {
  const { role, isAuthenticated } = useAuth();
  const defaultPath = `/${role.replace(/_/g, '-')}/dashboard`;

  return (
    <Routes>
      {/* Public Hotel Landing Pages */}
      <Route path="/home" element={<HotelHomePage />} />
      <Route path="/hotel" element={<HotelHomePage />} />
      <Route path="/amenities" element={<HotelFacilitiesPage />} />
      <Route path="/facilities" element={<HotelFacilitiesPage />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={defaultPath} replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={defaultPath} replace /> : <SignupPage />}
      />

      {/* Root redirect: if logged in -> role dashboard, else -> login */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? defaultPath : '/login'} replace />}
      />

      {/* Protected Dashboard Layout wrapper */}
      <Route element={<DashboardLayout />}>
        {/* --- 1. SUPER ADMIN PANEL ROUTES --- */}
        <Route path="/super-admin/dashboard/analytics" element={<PlatformReportsPage />} />
        <Route path="/super-admin/dashboard/activities" element={<AuditLogsPage />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/dashboard/*" element={<SuperAdminDashboard />} />
        
        {/* Super Admin - Hotel Management */}
        <Route path="/super-admin/hotels/add" element={<AddHotelPage />} />
        <Route path="/super-admin/hotels/edit/:id" element={<EditHotelPage />} />
        <Route path="/super-admin/hotels/details" element={<HotelDetailPage />} />
        <Route path="/super-admin/hotels/approvals/:id" element={<HotelApprovalDetailPage />} />
        <Route path="/super-admin/hotels/approvals" element={<HotelApprovalsPage />} />
        <Route path="/super-admin/hotels/status" element={<HotelStatusPage />} />
        <Route path="/super-admin/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/super-admin/hotels" element={<HotelsListPage />} />
        <Route path="/super-admin/hotel-admins/add" element={<AddUserPage />} />
        <Route path="/super-admin/hotel-admins/permissions" element={<AllUsersPage />} />
        <Route path="/super-admin/hotel-admins" element={<AllUsersPage />} />
        <Route path="/super-admin/hotel-admins/*" element={<AllUsersPage />} />
        
        {/* Subscription Management */}
        <Route path="/super-admin/subscriptions/renew/:id" element={<RenewSubscriptionPage />} />
        <Route path="/super-admin/subscriptions/details/:id" element={<SubscriptionDetailPage />} />
        <Route path="/super-admin/subscriptions/manage/:id" element={<ManageSubscriptionPage />} />
        <Route path="/super-admin/subscriptions/plans/add" element={<AddSubscriptionPlanPage />} />
        <Route path="/super-admin/subscriptions/plans/edit/:id" element={<AddSubscriptionPlanPage />} />
        <Route path="/super-admin/subscriptions/plans/details/:id" element={<PlanDetailPage />} />
        <Route path="/super-admin/subscriptions/features/add" element={<AddPlanFeaturePage />} />
        <Route path="/super-admin/subscriptions/features/edit/:id" element={<AddPlanFeaturePage />} />
        <Route path="/super-admin/subscriptions/features/details/:id" element={<PlanFeatureDetailPage />} />
        <Route path="/super-admin/subscriptions" element={<SubscriptionPlansPage />} />
        <Route path="/super-admin/subscriptions/plans" element={<SubscriptionPlansPage />} />
        <Route path="/super-admin/subscriptions/active" element={<ActiveSubscriptionsPage />} />
        <Route path="/super-admin/subscriptions/expired" element={<ExpiredSubscriptionsPage />} />
        <Route path="/super-admin/subscriptions/features" element={<PlanFeaturesPage />} />
        <Route path="/super-admin/subscriptions/*" element={<SubscriptionPlansPage />} />

        {/* Module 1: Billing & Payments */}
        <Route path="/super-admin/billing/accounts/add" element={<AddGLAccountPage />} />
        <Route path="/super-admin/billing/accounts/edit/:id" element={<AddGLAccountPage />} />
        <Route path="/super-admin/billing/folios/statement/:id" element={<FolioStatementPage />} />
        <Route path="/super-admin/billing/folios/charge/:id" element={<AddFolioChargePage />} />
        <Route path="/super-admin/billing/folios/pay/:id" element={<SettleFolioPaymentPage />} />
        <Route path="/super-admin/billing" element={<PlatformRevenuePage />} />
        <Route path="/super-admin/billing/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="/super-admin/billing/transactions" element={<PaymentTransactionsPage />} />
        <Route path="/super-admin/billing/refunds/:id" element={<RefundDetailPage />} />
        <Route path="/super-admin/billing/refunds" element={<RefundRequestsPage />} />
        <Route path="/super-admin/billing/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/super-admin/billing/invoices" element={<BillingInvoicesPage />} />
        <Route path="/super-admin/billing/*" element={<PlatformRevenuePage />} />

        {/* Module 2: User Management */}
        <Route path="/super-admin/users/add" element={<AddUserPage />} />
        <Route path="/super-admin/users/edit/:id" element={<EditUserPage />} />
        <Route path="/super-admin/users/details/:id" element={<UserDetailPage />} />
        <Route path="/super-admin/users" element={<AllUsersPage />} />
        <Route path="/super-admin/users/active" element={<ActiveUsersPage />} />
        <Route path="/super-admin/users/suspended" element={<SuspendedUsersPage />} />
        <Route path="/super-admin/users/*" element={<AllUsersPage />} />

        {/* Module 3: Platform Management */}
        <Route path="/super-admin/platform/announcements/add" element={<AddAnnouncementPage />} />
        <Route path="/super-admin/platform/announcements/edit/:id" element={<AddAnnouncementPage />} />
        <Route path="/super-admin/platform/announcements/details/:id" element={<AnnouncementDetailPage />} />
        <Route path="/super-admin/platform/announcements" element={<SystemAnnouncementsPage />} />
        <Route path="/super-admin/platform" element={<GlobalSettingsPage />} />
        <Route path="/super-admin/platform/settings" element={<GlobalSettingsPage />} />
        <Route path="/super-admin/platform/features" element={<FeatureManagementPage />} />
        <Route path="/super-admin/platform/*" element={<GlobalSettingsPage />} />

        {/* Module 4: Support & Tickets */}
        <Route path="/super-admin/support/tickets/:id" element={<SupportTicketDetailPage />} />
        <Route path="/super-admin/support" element={<SupportTicketsPage />} />
        <Route path="/super-admin/support/tickets" element={<SupportTicketsPage />} />
        <Route path="/super-admin/support/complaints/details/:id" element={<ComplaintDetailPage />} />
        <Route path="/super-admin/support/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/super-admin/support/complaints" element={<ComplaintsPage />} />
        <Route path="/super-admin/support/contact" element={<ContactRequestsPage />} />
        <Route path="/super-admin/support/*" element={<SupportTicketsPage />} />

        {/* Module 5: Platform Reports */}
        <Route path="/super-admin/reports" element={<PlatformReportsPage />} />
        <Route path="/super-admin/reports/platform" element={<PlatformReportsPage />} />
        <Route path="/super-admin/reports/performance" element={<HotelPerformancePage />} />
        <Route path="/super-admin/reports/revenue" element={<RevenueReportsPage />} />
        <Route path="/super-admin/reports/*" element={<PlatformReportsPage />} />

        {/* Module 6: System & Security */}
        <Route path="/super-admin/system" element={<AuditLogsPage />} />
        <Route path="/super-admin/system/audit" element={<AuditLogsPage />} />
        <Route path="/super-admin/system/health" element={<SystemHealthPage />} />
        <Route path="/super-admin/system/backups" element={<BackupStatusPage />} />
        <Route path="/super-admin/system/security" element={<SecuritySettingsPage />} />
        <Route path="/super-admin/system/*" element={<AuditLogsPage />} />

        {/* --- 2. HOTEL ADMIN PANEL ROUTES --- */}
        {/* Hotel Admin Dashboard Submenus - Dedicated Pages */}
        <Route path="/hotel-admin/dashboard/overview" element={<DashboardOverviewPage />} />
        <Route path="/hotel-admin/dashboard/today-summary" element={<TodaysSummaryPage />} />
        <Route path="/hotel-admin/dashboard/today" element={<TodaysSummaryPage />} />
        <Route path="/hotel-admin/dashboard/occupancy-analytics" element={<OccupancyAnalyticsPage />} />
        <Route path="/hotel-admin/dashboard/occupancy" element={<OccupancyAnalyticsPage />} />
        <Route path="/hotel-admin/dashboard/revenue-analytics" element={<RevenueAnalyticsPage />} />
        <Route path="/hotel-admin/dashboard/revenue" element={<RevenueAnalyticsPage />} />
        <Route path="/hotel-admin/dashboard/recent-bookings" element={<RecentBookingsPage />} />
        <Route path="/hotel-admin/dashboard" element={<DashboardOverviewPage />} />

        {/* Admin Aliases for Dashboard */}
        <Route path="/admin/dashboard/overview" element={<DashboardOverviewPage />} />
        <Route path="/admin/dashboard/today-summary" element={<TodaysSummaryPage />} />
        <Route path="/admin/dashboard/today" element={<TodaysSummaryPage />} />
        <Route path="/admin/dashboard/occupancy-analytics" element={<OccupancyAnalyticsPage />} />
        <Route path="/admin/dashboard/occupancy" element={<OccupancyAnalyticsPage />} />
        <Route path="/admin/dashboard/revenue-analytics" element={<RevenueAnalyticsPage />} />
        <Route path="/admin/dashboard/revenue" element={<RevenueAnalyticsPage />} />
        <Route path="/admin/dashboard/recent-bookings" element={<RecentBookingsPage />} />
        <Route path="/admin/dashboard" element={<DashboardOverviewPage />} />

        {/* Room Management Submenus Dedicated Pages */}
        <Route path="/hotel-admin/rooms/categories" element={<RoomCategoriesPage />} />
        <Route path="/hotel-admin/rooms/amenities" element={<RoomAmenitiesPage />} />
        <Route path="/hotel-admin/rooms/images" element={<RoomImagesPage />} />
        <Route path="/hotel-admin/rooms/pricing" element={<RoomPricingPage />} />
        <Route path="/hotel-admin/rooms/availability" element={<RoomAvailabilityPage />} />
        <Route path="/hotel-admin/rooms/maintenance" element={<RoomMaintenancePage />} />
        <Route path="/hotel-admin/rooms/add" element={<AddRoomPage />} />
        <Route path="/hotel-admin/rooms/add-category" element={<AddRoomCategoryPage />} />
        <Route path="/hotel-admin/rooms/transfer" element={<SuiteTransferPage />} />
        <Route path="/hotel-admin/rooms/edit/:roomId" element={<EditRoomPage />} />
        <Route path="/hotel-admin/rooms/details/:roomId" element={<RoomDetailPage />} />
        <Route path="/hotel-admin/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/hotel-admin/rooms" element={<RoomsManagementPage />} />
        <Route path="/hotel-admin/rooms/*" element={<RoomsManagementPage />} />

        {/* Admin Aliases for Room Management */}
        <Route path="/admin/room-management/rooms" element={<RoomsManagementPage />} />
        <Route path="/admin/room-management/categories" element={<RoomCategoriesPage />} />
        <Route path="/admin/room-management/amenities" element={<RoomAmenitiesPage />} />
        <Route path="/admin/room-management/images" element={<RoomImagesPage />} />
        <Route path="/admin/room-management/pricing" element={<RoomPricingPage />} />
        <Route path="/admin/room-management/availability" element={<RoomAvailabilityPage />} />
        <Route path="/admin/room-management/maintenance" element={<RoomMaintenancePage />} />
        <Route path="/admin/room-management/add" element={<AddRoomPage />} />
        <Route path="/admin/room-management/edit/:roomId" element={<EditRoomPage />} />
        <Route path="/admin/room-management/details/:roomId" element={<RoomDetailPage />} />
        <Route path="/admin/room-management/:roomId" element={<RoomDetailPage />} />
        <Route path="/admin/room-management" element={<RoomsManagementPage />} />
        <Route path="/admin/room-management/*" element={<RoomsManagementPage />} />

        <Route path="/admin/rooms/categories" element={<RoomCategoriesPage />} />
        <Route path="/admin/rooms/amenities" element={<RoomAmenitiesPage />} />
        <Route path="/admin/rooms/images" element={<RoomImagesPage />} />
        <Route path="/admin/rooms/pricing" element={<RoomPricingPage />} />
        <Route path="/admin/rooms/availability" element={<RoomAvailabilityPage />} />
        <Route path="/admin/rooms/maintenance" element={<RoomMaintenancePage />} />
        <Route path="/admin/rooms/add" element={<AddRoomPage />} />
        <Route path="/admin/rooms" element={<RoomsManagementPage />} />
        <Route path="/admin/rooms/*" element={<RoomsManagementPage />} />

        {/* Booking Management Submenus - Dedicated Pages */}
        <Route path="/hotel-admin/bookings/new" element={<NewBookingPage />} />
        <Route path="/hotel-admin/bookings/confirmed" element={<ConfirmedBookingsPage />} />
        <Route path="/hotel-admin/bookings/pending" element={<PendingBookingsPage />} />
        <Route path="/hotel-admin/bookings/checked-in" element={<CheckedInBookingsPage />} />
        <Route path="/hotel-admin/bookings/checked-out" element={<CheckedOutBookingsPage />} />
        <Route path="/hotel-admin/bookings/cancelled" element={<CancelledBookingsPage />} />
        <Route path="/hotel-admin/bookings/calendar" element={<BookingCalendarPage />} />
        <Route path="/hotel-admin/bookings/folio/:bookingId" element={<BookingFolioPage />} />
        <Route path="/hotel-admin/bookings/:bookingId/folio" element={<BookingFolioPage />} />
        <Route path="/hotel-admin/bookings/:bookingId" element={<BookingFolioPage />} />
        <Route path="/hotel-admin/bookings" element={<BookingsManagementPage />} />
        <Route path="/hotel-admin/bookings/*" element={<BookingsManagementPage />} />

        {/* Admin Aliases for Booking Management */}
        <Route path="/admin/bookings/new" element={<NewBookingPage />} />
        <Route path="/admin/bookings/confirmed" element={<ConfirmedBookingsPage />} />
        <Route path="/admin/bookings/pending" element={<PendingBookingsPage />} />
        <Route path="/admin/bookings/checked-in" element={<CheckedInBookingsPage />} />
        <Route path="/admin/bookings/checked-out" element={<CheckedOutBookingsPage />} />
        <Route path="/admin/bookings/cancelled" element={<CancelledBookingsPage />} />
        <Route path="/admin/bookings/calendar" element={<BookingCalendarPage />} />
        <Route path="/admin/bookings/folio/:bookingId" element={<BookingFolioPage />} />
        <Route path="/admin/bookings/:bookingId/folio" element={<BookingFolioPage />} />
        <Route path="/admin/bookings/:bookingId" element={<BookingFolioPage />} />
        <Route path="/admin/bookings" element={<BookingsManagementPage />} />
        <Route path="/admin/bookings/*" element={<BookingsManagementPage />} />

        {/* Front Desk Submenus */}
        <Route path="/hotel-admin/front-desk/walk-in" element={<NewBookingPage />} />
        <Route path="/hotel-admin/front-desk/allocations" element={<FrontDeskPage />} />
        <Route path="/hotel-admin/front-desk/check-in" element={<CheckedInBookingsPage />} />
        <Route path="/hotel-admin/front-desk/check-out" element={<CheckedOutBookingsPage />} />
        <Route path="/hotel-admin/front-desk/transfers" element={<SuiteTransferPage />} />
        <Route path="/hotel-admin/front-desk" element={<FrontDeskPage />} />
        <Route path="/hotel-admin/front-desk/*" element={<FrontDeskPage />} />

        {/* Admin Aliases for Front Desk */}
        <Route path="/admin/front-desk/walk-in" element={<NewBookingPage />} />
        <Route path="/admin/front-desk/allocations" element={<FrontDeskPage />} />
        <Route path="/admin/front-desk/check-in" element={<CheckedInBookingsPage />} />
        <Route path="/admin/front-desk/check-out" element={<CheckedOutBookingsPage />} />
        <Route path="/admin/front-desk/transfers" element={<SuiteTransferPage />} />
        <Route path="/admin/front-desk" element={<FrontDeskPage />} />
        <Route path="/admin/front-desk/*" element={<FrontDeskPage />} />

        {/* Guest Management Submenu Dedicated Pages */}
        <Route path="/hotel-admin/guests/details" element={<GuestDetailsListingPage />} />
        <Route path="/hotel-admin/guests/history" element={<GuestHistoryPage />} />
        <Route path="/hotel-admin/guests/vip" element={<VIPGuestsPage />} />
        <Route path="/hotel-admin/guests/feedback" element={<GuestFeedbackPage />} />
        <Route path="/hotel-admin/guests/add" element={<AddGuestPage />} />
        <Route path="/hotel-admin/guests/edit/:guestId" element={<EditGuestPage />} />
        <Route path="/hotel-admin/guests/details/:guestId" element={<GuestDetailPage />} />
        <Route path="/hotel-admin/guests/:guestId" element={<GuestDetailPage />} />
        <Route path="/hotel-admin/guests" element={<GuestsManagementPage />} />
        <Route path="/hotel-admin/guests/*" element={<GuestsManagementPage />} />

        {/* Admin Aliases for Guest Management */}
        <Route path="/admin/guests/details" element={<GuestDetailsListingPage />} />
        <Route path="/admin/guests/history" element={<GuestHistoryPage />} />
        <Route path="/admin/guests/vip" element={<VIPGuestsPage />} />
        <Route path="/admin/guests/feedback" element={<GuestFeedbackPage />} />
        <Route path="/admin/guests/add" element={<AddGuestPage />} />
        <Route path="/admin/guests/edit/:guestId" element={<EditGuestPage />} />
        <Route path="/admin/guests/details/:guestId" element={<GuestDetailPage />} />
        <Route path="/admin/guests/:guestId" element={<GuestDetailPage />} />
        <Route path="/admin/guests" element={<GuestsManagementPage />} />
        <Route path="/admin/guests/*" element={<GuestsManagementPage />} />

        {/* Housekeeping Submenus */}
        <Route path="/hotel-admin/housekeeping/schedule" element={<ScheduleTurnoverPage />} />
        <Route path="/hotel-admin/housekeeping/cleaning" element={<HousekeepingAdminPage />} />
        <Route path="/hotel-admin/housekeeping/assignments" element={<HousekeepingAdminPage />} />
        <Route path="/hotel-admin/housekeeping/inspection" element={<HousekeepingAdminPage />} />
        <Route path="/hotel-admin/housekeeping/maintenance" element={<MaintenancePage />} />
        <Route path="/hotel-admin/housekeeping/lost-found" element={<HousekeepingAdminPage />} />
        <Route path="/hotel-admin/housekeeping" element={<HousekeepingAdminPage />} />
        <Route path="/hotel-admin/housekeeping/*" element={<HousekeepingAdminPage />} />

        {/* Admin Aliases for Housekeeping */}
        <Route path="/admin/housekeeping/schedule" element={<ScheduleTurnoverPage />} />
        <Route path="/admin/housekeeping/cleaning" element={<HousekeepingAdminPage />} />
        <Route path="/admin/housekeeping/assignments" element={<HousekeepingAdminPage />} />
        <Route path="/admin/housekeeping/inspection" element={<HousekeepingAdminPage />} />
        <Route path="/admin/housekeeping/maintenance" element={<MaintenancePage />} />
        <Route path="/admin/housekeeping/lost-found" element={<HousekeepingAdminPage />} />
        <Route path="/admin/housekeeping" element={<HousekeepingAdminPage />} />
        <Route path="/admin/housekeeping/*" element={<HousekeepingAdminPage />} />

        {/* Restaurant Submenus */}
        <Route path="/hotel-admin/restaurant/order" element={<NewRestaurantOrderPage />} />
        <Route path="/hotel-admin/restaurant/categories" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/menu" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/orders" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/tables" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/room-service" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/billing" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/*" element={<RestaurantPage />} />

        {/* Admin Aliases for Restaurant */}
        <Route path="/admin/restaurant/order" element={<NewRestaurantOrderPage />} />
        <Route path="/admin/restaurant/categories" element={<RestaurantPage />} />
        <Route path="/admin/restaurant/menu" element={<RestaurantPage />} />
        <Route path="/admin/restaurant/orders" element={<RestaurantPage />} />
        <Route path="/admin/restaurant/tables" element={<RestaurantPage />} />
        <Route path="/admin/restaurant/room-service" element={<RestaurantPage />} />
        <Route path="/admin/restaurant/billing" element={<RestaurantPage />} />
        <Route path="/admin/restaurant" element={<RestaurantPage />} />
        <Route path="/admin/restaurant/*" element={<RestaurantPage />} />

        {/* Staff Management Submenus */}
        <Route path="/hotel-admin/staff/add" element={<AddStaffPage />} />
        <Route path="/hotel-admin/staff/departments" element={<StaffManagementPage />} />
        <Route path="/hotel-admin/staff/roles" element={<StaffManagementPage />} />
        <Route path="/hotel-admin/staff/shifts" element={<ShiftSchedulingPage />} />
        <Route path="/hotel-admin/staff/schedule" element={<ShiftSchedulingPage />} />
        <Route path="/hotel-admin/staff/shift-scheduling" element={<ShiftSchedulingPage />} />
        <Route path="/hotel-admin/staff/leave" element={<LeaveRequestsPage />} />
        <Route path="/hotel-admin/staff/leave-requests" element={<LeaveRequestsPage />} />
        <Route path="/hotel-admin/staff/attendance" element={<StaffManagementPage />} />
        <Route path="/hotel-admin/staff/edit/:staffId" element={<EditStaffPage />} />
        <Route path="/hotel-admin/staff/details/:staffId" element={<StaffDetailPage />} />
        <Route path="/hotel-admin/staff/:staffId" element={<StaffDetailPage />} />
        <Route path="/hotel-admin/staff" element={<StaffManagementPage />} />
        <Route path="/hotel-admin/staff/*" element={<StaffManagementPage />} />

        {/* Admin Aliases for Staff */}
        <Route path="/admin/staff/add" element={<AddStaffPage />} />
        <Route path="/admin/staff/departments" element={<StaffManagementPage />} />
        <Route path="/admin/staff/roles" element={<StaffManagementPage />} />
        <Route path="/admin/staff/shifts" element={<ShiftSchedulingPage />} />
        <Route path="/admin/staff/schedule" element={<ShiftSchedulingPage />} />
        <Route path="/admin/staff/shift-scheduling" element={<ShiftSchedulingPage />} />
        <Route path="/admin/staff/leave" element={<LeaveRequestsPage />} />
        <Route path="/admin/staff/leave-requests" element={<LeaveRequestsPage />} />
        <Route path="/admin/staff/attendance" element={<StaffManagementPage />} />
        <Route path="/admin/staff/edit/:staffId" element={<EditStaffPage />} />
        <Route path="/admin/staff/details/:staffId" element={<StaffDetailPage />} />
        <Route path="/admin/staff/:staffId" element={<StaffDetailPage />} />
        <Route path="/admin/staff" element={<StaffManagementPage />} />
        <Route path="/admin/staff/*" element={<StaffManagementPage />} />

        {/* Hotel Admin ERP Additions */}
        {/* Payments, Billing & Finance */}
        <Route path="/hotel-admin/payments" element={<PaymentsPage />} />
        <Route path="/hotel-admin/payments/transactions" element={<PaymentsPage />} />
        <Route path="/hotel-admin/payments/invoices" element={<FinancePage />} />
        <Route path="/hotel-admin/payments/coa" element={<FinancePage />} />
        <Route path="/hotel-admin/payments/journal" element={<FinancePage />} />
        <Route path="/hotel-admin/payments/*" element={<PaymentsPage />} />
        <Route path="/hotel-admin/billing" element={<FinancePage />} />
        <Route path="/hotel-admin/billing/*" element={<FinancePage />} />
        <Route path="/hotel-admin/invoices" element={<FinancePage />} />
        <Route path="/hotel-admin/invoices/*" element={<FinancePage />} />
        <Route path="/hotel-admin/finance" element={<FinancePage />} />
        <Route path="/hotel-admin/finance/*" element={<FinancePage />} />

        {/* Admin Aliases for Payments & Finance */}
        <Route path="/admin/payments" element={<PaymentsPage />} />
        <Route path="/admin/payments/transactions" element={<PaymentsPage />} />
        <Route path="/admin/payments/invoices" element={<FinancePage />} />
        <Route path="/admin/payments/coa" element={<FinancePage />} />
        <Route path="/admin/payments/journal" element={<FinancePage />} />
        <Route path="/admin/payments/*" element={<PaymentsPage />} />
        <Route path="/admin/finance" element={<FinancePage />} />
        <Route path="/admin/finance/*" element={<FinancePage />} />

        {/* Marketing & Offers */}
        <Route path="/hotel-admin/marketing" element={<MarketingPage />} />
        <Route path="/hotel-admin/marketing/coupons" element={<MarketingPage />} />
        <Route path="/hotel-admin/marketing/packages" element={<MarketingPage />} />
        <Route path="/hotel-admin/marketing/banners" element={<MarketingPage />} />
        <Route path="/hotel-admin/marketing/*" element={<MarketingPage />} />
        <Route path="/admin/marketing" element={<MarketingPage />} />
        <Route path="/admin/marketing/*" element={<MarketingPage />} />

        {/* Guest Reviews & Feedback */}
        <Route path="/hotel-admin/reviews" element={<GuestFeedbackPage />} />
        <Route path="/hotel-admin/reviews/ratings" element={<GuestFeedbackPage />} />
        <Route path="/hotel-admin/reviews/feedback" element={<GuestFeedbackPage />} />
        <Route path="/hotel-admin/reviews/*" element={<GuestFeedbackPage />} />
        <Route path="/admin/reviews" element={<GuestFeedbackPage />} />
        <Route path="/admin/reviews/*" element={<GuestFeedbackPage />} />

        {/* Inventory Management */}
        <Route path="/hotel-admin/inventory/add" element={<AddInventoryItemPage />} />
        <Route path="/hotel-admin/inventory/movement" element={<RecordMovementPage />} />
        <Route path="/hotel-admin/inventory/suppliers/add" element={<AddSupplierPage />} />
        <Route path="/hotel-admin/inventory" element={<InventoryPage />} />
        <Route path="/hotel-admin/inventory/*" element={<InventoryPage />} />
        <Route path="/admin/inventory/add" element={<AddInventoryItemPage />} />
        <Route path="/admin/inventory/movement" element={<RecordMovementPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/inventory/*" element={<InventoryPage />} />

        {/* Maintenance & Engineering */}
        <Route path="/hotel-admin/maintenance" element={<MaintenancePage />} />
        <Route path="/hotel-admin/maintenance/*" element={<MaintenancePage />} />
        <Route path="/admin/maintenance" element={<MaintenancePage />} />
        <Route path="/admin/maintenance/*" element={<MaintenancePage />} />

        {/* Payroll */}
        <Route path="/hotel-admin/payroll" element={<PayrollPage />} />
        <Route path="/hotel-admin/payroll/*" element={<PayrollPage />} />
        <Route path="/admin/payroll" element={<PayrollPage />} />
        <Route path="/admin/payroll/*" element={<PayrollPage />} />

        {/* Reports Submenus */}
        <Route path="/hotel-admin/reports/occupancy" element={<OccupancyAnalyticsPage />} />
        <Route path="/hotel-admin/reports/bookings" element={<RecentBookingsPage />} />
        <Route path="/hotel-admin/reports/cancellations" element={<CancelledBookingsPage />} />
        <Route path="/hotel-admin/reports/guests" element={<GuestHistoryPage />} />
        <Route path="/hotel-admin/reports/staff" element={<ReportsPage />} />
        <Route path="/hotel-admin/reports/export" element={<ReportsPage />} />
        <Route path="/hotel-admin/reports" element={<ReportsPage />} />
        <Route path="/hotel-admin/reports/*" element={<ReportsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/reports/*" element={<ReportsPage />} />

        {/* Hotel Settings Submenus */}
        <Route path="/hotel-admin/settings/info" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/branding" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/rules" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/cancellation" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/taxes" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/notifications" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/payments" element={<PaymentsPage />} />
        <Route path="/hotel-admin/settings" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/*" element={<SettingsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/settings/*" element={<SettingsPage />} />

        <Route path="/hotel-admin/system/security" element={<SecuritySettingsPage />} />
        <Route path="/hotel-admin/system" element={<SettingsPage />} />
        <Route path="/hotel-admin/system/*" element={<SettingsPage />} />
        <Route path="/hotel-admin/security" element={<SecuritySettingsPage />} />
        <Route path="/hotel-admin/security/*" element={<SecuritySettingsPage />} />
        <Route path="/hotel-admin/profile" element={<SettingsPage />} />
        <Route path="/hotel-admin/profile/*" element={<SettingsPage />} />

        {/* --- 3. RECEPTIONIST PANEL ROUTES --- */}
        <Route path="/receptionist/dashboard/arrivals" element={<TodaysSummaryPage />} />
        <Route path="/receptionist/dashboard/departures" element={<TodaysSummaryPage />} />
        <Route path="/receptionist/dashboard/available" element={<RoomAvailabilityPage />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/dashboard/*" element={<ReceptionistDashboard />} />

        <Route path="/receptionist/reservations/new" element={<NewBookingPage />} />
        <Route path="/receptionist/reservations/walk-in" element={<NewBookingPage />} />
        <Route path="/receptionist/reservations/calendar" element={<BookingCalendarPage />} />
        <Route path="/receptionist/reservations/cancellations" element={<CancelledBookingsPage />} />
        <Route path="/receptionist/reservations/search" element={<BookingsManagementPage />} />
        <Route path="/receptionist/reservations/modifications" element={<BookingsManagementPage />} />
        <Route path="/receptionist/reservations" element={<BookingsManagementPage />} />
        <Route path="/receptionist/reservations/*" element={<BookingsManagementPage />} />

        <Route path="/receptionist/guest-services/registration" element={<AddGuestPage />} />
        <Route path="/receptionist/guest-services/directory" element={<GuestsManagementPage />} />
        <Route path="/receptionist/guest-services/history" element={<GuestHistoryPage />} />
        <Route path="/receptionist/guest-services/requests" element={<GuestsManagementPage />} />
        <Route path="/receptionist/guest-services" element={<GuestsManagementPage />} />
        <Route path="/receptionist/guest-services/*" element={<GuestsManagementPage />} />

        <Route path="/receptionist/room-operations/allocation" element={<FrontDeskPage />} />
        <Route path="/receptionist/room-operations/transfers" element={<SuiteTransferPage />} />
        <Route path="/receptionist/room-operations/check-in" element={<CheckedInBookingsPage />} />
        <Route path="/receptionist/room-operations/check-out" element={<CheckedOutBookingsPage />} />
        <Route path="/receptionist/room-operations/timing" element={<FrontDeskPage />} />
        <Route path="/receptionist/room-operations" element={<FrontDeskPage />} />
        <Route path="/receptionist/room-operations/*" element={<FrontDeskPage />} />

        <Route path="/receptionist/payments/collect" element={<PaymentsPage />} />
        <Route path="/receptionist/payments/history" element={<PaymentsPage />} />
        <Route path="/receptionist/payments/invoice" element={<FinancePage />} />
        <Route path="/receptionist/payments/receipt" element={<PaymentsPage />} />
        <Route path="/receptionist/payments/pending" element={<PaymentsPage />} />
        <Route path="/receptionist/payments" element={<PaymentsPage />} />
        <Route path="/receptionist/payments/*" element={<PaymentsPage />} />

        <Route path="/receptionist/settings" element={<SettingsPage />} />
        <Route path="/receptionist/settings/*" element={<SettingsPage />} />
        <Route path="/receptionist/system/security" element={<SecuritySettingsPage />} />
        <Route path="/receptionist/system" element={<SettingsPage />} />
        <Route path="/receptionist/system/*" element={<SettingsPage />} />
        <Route path="/receptionist/security" element={<SecuritySettingsPage />} />
        <Route path="/receptionist/security/*" element={<SecuritySettingsPage />} />
        <Route path="/receptionist/profile" element={<SettingsPage />} />
        <Route path="/receptionist/profile/*" element={<SettingsPage />} />
        <Route path="/receptionist/reports" element={<ReportsPage />} />
        <Route path="/receptionist/reports/*" element={<ReportsPage />} />
        <Route path="/receptionist/*" element={<ReceptionistDashboard />} />

        {/* --- 4. CUSTOMER PANEL ROUTES --- */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/dashboard/*" element={<GenericDetailPage />} />
        <Route path="/customer/book" element={<CustomerBrowseRoomsPage />} />
        <Route path="/customer/rooms" element={<CustomerBrowseRoomsPage />} />
        <Route path="/customer/rooms/available" element={<CustomerBrowseRoomsPage />} />
        <Route path="/customer/discover/rooms" element={<CustomerBrowseRoomsPage />} />
        <Route path="/customer/discover/*" element={<CustomerBrowseRoomsPage />} />
        <Route path="/customer/rooms/:roomId" element={<RoomDetailsPage />} />
        <Route path="/customer/checkout" element={<BookingCheckoutPage />} />
        <Route path="/customer/confirmation/:bookingId" element={<BookingConfirmationPage />} />
        <Route path="/customer/bookings" element={<MyBookingsPage />} />
        <Route path="/customer/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/customer/payments" element={<CustomerPaymentsPage />} />
        <Route path="/customer/payments/*" element={<CustomerPaymentsPage />} />
        <Route path="/customer/guest-services" element={<CustomerGuestServicesPage />} />
        <Route path="/customer/guest-services/*" element={<CustomerGuestServicesPage />} />
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
        <Route path="/customer/vip-benefits" element={<VIPBenefitsPage />} />
        <Route path="/customer/my-suite" element={<MySuiteControlsPage />} />
        <Route path="/customer/amenities" element={<HotelFacilitiesPage />} />
        <Route path="/customer/facilities" element={<HotelFacilitiesPage />} />
        <Route path="/customer/dining" element={<RoomServicePage />} />
        <Route path="/customer/settings" element={<CustomerProfilePage />} />
        <Route path="/customer/settings/*" element={<CustomerProfilePage />} />
        <Route path="/customer/system" element={<CustomerProfilePage />} />
        <Route path="/customer/system/*" element={<CustomerProfilePage />} />
        <Route path="/customer/security" element={<CustomerProfilePage />} />
        <Route path="/customer/security/*" element={<CustomerProfilePage />} />
        <Route path="/customer/feedback" element={<GuestFeedbackPage />} />
        <Route path="/customer/feedback/*" element={<GuestFeedbackPage />} />
        <Route path="/customer/*" element={<CustomerDashboard />} />

        {/* --- 5. HOUSEKEEPING PANEL ROUTES --- */}
        <Route path="/housekeeping/dashboard" element={<HousekeepingDashboard />} />
        <Route path="/housekeeping/dashboard/*" element={<GenericDetailPage />} />
        <Route path="/housekeeping/cleaning" element={<HousekeepingDashboard />} />
        <Route path="/housekeeping/cleaning/*" element={<HousekeepingDashboard />} />
        <Route path="/housekeeping/maintenance" element={<MaintenancePage />} />
        <Route path="/housekeeping/maintenance/*" element={<MaintenancePage />} />
        <Route path="/housekeeping/services/*" element={<GenericDetailPage />} />
        <Route path="/housekeeping/settings" element={<SettingsPage />} />
        <Route path="/housekeeping/settings/*" element={<SettingsPage />} />
        <Route path="/housekeeping/system/security" element={<SecuritySettingsPage />} />
        <Route path="/housekeeping/system" element={<SettingsPage />} />
        <Route path="/housekeeping/system/*" element={<SettingsPage />} />
        <Route path="/housekeeping/security" element={<SecuritySettingsPage />} />
        <Route path="/housekeeping/security/*" element={<SecuritySettingsPage />} />
        <Route path="/housekeeping/profile" element={<SettingsPage />} />
        <Route path="/housekeeping/profile/*" element={<SettingsPage />} />
        <Route path="/housekeeping/reports" element={<ReportsPage />} />
        <Route path="/housekeeping/reports/*" element={<ReportsPage />} />
        <Route path="/housekeeping/*" element={<GenericDetailPage />} />

        {/* --- 6. STAFF PANEL ROUTES --- */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/dashboard/*" element={<GenericDetailPage />} />
        <Route path="/staff/work" element={<StaffDashboard />} />
        <Route path="/staff/work/*" element={<GenericDetailPage />} />
        <Route path="/staff/attendance/*" element={<GenericDetailPage />} />
        <Route path="/staff/schedule/*" element={<GenericDetailPage />} />
        <Route path="/staff/communication/*" element={<GenericDetailPage />} />
        <Route path="/staff/settings" element={<SettingsPage />} />
        <Route path="/staff/settings/*" element={<SettingsPage />} />
        <Route path="/staff/system/security" element={<SecuritySettingsPage />} />
        <Route path="/staff/system" element={<SettingsPage />} />
        <Route path="/staff/system/*" element={<SettingsPage />} />
        <Route path="/staff/security" element={<SecuritySettingsPage />} />
        <Route path="/staff/security/*" element={<SecuritySettingsPage />} />
        <Route path="/staff/profile" element={<SettingsPage />} />
        <Route path="/staff/profile/*" element={<SettingsPage />} />
        <Route path="/staff/reports" element={<ReportsPage />} />
        <Route path="/staff/reports/*" element={<ReportsPage />} />
        <Route path="/staff/*" element={<GenericDetailPage />} />
      </Route>

      {/* Special Pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;

