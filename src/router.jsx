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
import { PaymentTransactionsPage } from './pages/super-admin/billing/PaymentTransactionsPage';
import { RefundRequestsPage } from './pages/super-admin/billing/RefundRequestsPage';
import { RefundDetailPage } from './pages/super-admin/billing/RefundDetailPage';
import { BillingInvoicesPage } from './pages/super-admin/billing/BillingInvoicesPage';
import { InvoiceDetailPage } from './pages/super-admin/billing/InvoiceDetailPage';

// Super Admin Module 2: User Management
import { AllUsersPage } from './pages/super-admin/users/AllUsersPage';
import { ActiveUsersPage } from './pages/super-admin/users/ActiveUsersPage';
import { SuspendedUsersPage } from './pages/super-admin/users/SuspendedUsersPage';

// Super Admin Module 3: Platform Management
import { GlobalSettingsPage } from './pages/super-admin/platform/GlobalSettingsPage';
import { FeatureManagementPage } from './pages/super-admin/platform/FeatureManagementPage';
import { SystemAnnouncementsPage } from './pages/super-admin/platform/SystemAnnouncementsPage';

// Super Admin Module 4: Support & Tickets
import { SupportTicketsPage } from './pages/super-admin/support/SupportTicketsPage';
import { ComplaintsPage } from './pages/super-admin/support/ComplaintsPage';
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
import { RoomsManagementPage } from './pages/hotel-admin/RoomsManagementPage';
import { AddRoomPage } from './pages/hotel-admin/AddRoomPage';
import { AddRoomCategoryPage } from './pages/hotel-admin/AddRoomCategoryPage';
import { EditRoomPage } from './pages/hotel-admin/EditRoomPage';
import { RoomDetailPage } from './pages/hotel-admin/RoomDetailPage';
import { BookingsManagementPage } from './pages/hotel-admin/BookingsManagementPage';
import { NewBookingPage } from './pages/hotel-admin/NewBookingPage';
import { BookingFolioPage } from './pages/hotel-admin/BookingFolioPage';
import { FrontDeskPage } from './pages/hotel-admin/FrontDeskPage';
import { GuestsManagementPage } from './pages/hotel-admin/GuestsManagementPage';
import { AddGuestPage } from './pages/hotel-admin/AddGuestPage';
import { EditGuestPage } from './pages/hotel-admin/EditGuestPage';
import { GuestDetailPage } from './pages/hotel-admin/GuestDetailPage';
import { HousekeepingAdminPage } from './pages/hotel-admin/HousekeepingAdminPage';
import { RestaurantPage } from './pages/hotel-admin/RestaurantPage';
import { StaffManagementPage } from './pages/hotel-admin/StaffManagementPage';
import { AddStaffPage } from './pages/hotel-admin/AddStaffPage';
import { EditStaffPage } from './pages/hotel-admin/EditStaffPage';
import { StaffDetailPage } from './pages/hotel-admin/StaffDetailPage';

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
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/dashboard/*" element={<GenericDetailPage />} />
        
        {/* Super Admin - Hotel Management */}
        <Route path="/super-admin/hotels/add" element={<AddHotelPage />} />
        <Route path="/super-admin/hotels/edit/:id" element={<EditHotelPage />} />
        <Route path="/super-admin/hotels/details" element={<HotelDetailPage />} />
        <Route path="/super-admin/hotels/approvals/:id" element={<HotelApprovalDetailPage />} />
        <Route path="/super-admin/hotels/approvals" element={<HotelApprovalsPage />} />
        <Route path="/super-admin/hotels/status" element={<HotelStatusPage />} />
        <Route path="/super-admin/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/super-admin/hotels" element={<HotelsListPage />} />
        <Route path="/super-admin/hotel-admins" element={<GenericDetailPage />} />
        <Route path="/super-admin/hotel-admins/*" element={<GenericDetailPage />} />
        
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
        <Route path="/super-admin/billing" element={<PlatformRevenuePage />} />
        <Route path="/super-admin/billing/transactions" element={<PaymentTransactionsPage />} />
        <Route path="/super-admin/billing/refunds/:id" element={<RefundDetailPage />} />
        <Route path="/super-admin/billing/refunds" element={<RefundRequestsPage />} />
        <Route path="/super-admin/billing/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/super-admin/billing/invoices" element={<BillingInvoicesPage />} />
        <Route path="/super-admin/billing/*" element={<PlatformRevenuePage />} />

        {/* Module 2: User Management */}
        <Route path="/super-admin/users" element={<AllUsersPage />} />
        <Route path="/super-admin/users/active" element={<ActiveUsersPage />} />
        <Route path="/super-admin/users/suspended" element={<SuspendedUsersPage />} />
        <Route path="/super-admin/users/*" element={<AllUsersPage />} />

        {/* Module 3: Platform Management */}
        <Route path="/super-admin/platform" element={<GlobalSettingsPage />} />
        <Route path="/super-admin/platform/settings" element={<GlobalSettingsPage />} />
        <Route path="/super-admin/platform/features" element={<FeatureManagementPage />} />
        <Route path="/super-admin/platform/announcements" element={<SystemAnnouncementsPage />} />
        <Route path="/super-admin/platform/*" element={<GlobalSettingsPage />} />

        {/* Module 4: Support & Tickets */}
        <Route path="/super-admin/support" element={<SupportTicketsPage />} />
        <Route path="/super-admin/support/tickets" element={<SupportTicketsPage />} />
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
        <Route path="/hotel-admin/dashboard" element={<HotelAdminDashboard />} />
        <Route path="/hotel-admin/dashboard/*" element={<GenericDetailPage />} />
        <Route path="/hotel-admin/rooms/add" element={<AddRoomPage />} />
        <Route path="/hotel-admin/rooms/add-category" element={<AddRoomCategoryPage />} />
        <Route path="/hotel-admin/rooms/edit/:roomId" element={<EditRoomPage />} />
        <Route path="/hotel-admin/rooms/details/:roomId" element={<RoomDetailPage />} />
        <Route path="/hotel-admin/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/hotel-admin/rooms" element={<RoomsManagementPage />} />
        <Route path="/hotel-admin/rooms/*" element={<RoomsManagementPage />} />
        <Route path="/hotel-admin/bookings/new" element={<NewBookingPage />} />
        <Route path="/hotel-admin/bookings/folio/:bookingId" element={<BookingFolioPage />} />
        <Route path="/hotel-admin/bookings/:bookingId" element={<BookingFolioPage />} />
        <Route path="/hotel-admin/bookings" element={<BookingsManagementPage />} />
        <Route path="/hotel-admin/bookings/*" element={<BookingsManagementPage />} />
        <Route path="/hotel-admin/front-desk" element={<FrontDeskPage />} />
        <Route path="/hotel-admin/front-desk/*" element={<GenericDetailPage />} />
        <Route path="/hotel-admin/guests/add" element={<AddGuestPage />} />
        <Route path="/hotel-admin/guests/edit/:guestId" element={<EditGuestPage />} />
        <Route path="/hotel-admin/guests/details/:guestId" element={<GuestDetailPage />} />
        <Route path="/hotel-admin/guests/:guestId" element={<GuestDetailPage />} />
        <Route path="/hotel-admin/guests" element={<GuestsManagementPage />} />
        <Route path="/hotel-admin/guests/*" element={<GuestsManagementPage />} />
        <Route path="/hotel-admin/housekeeping" element={<HousekeepingAdminPage />} />
        <Route path="/hotel-admin/housekeeping/*" element={<GenericDetailPage />} />
        <Route path="/hotel-admin/restaurant" element={<RestaurantPage />} />
        <Route path="/hotel-admin/restaurant/*" element={<GenericDetailPage />} />
        <Route path="/hotel-admin/staff/add" element={<AddStaffPage />} />
        <Route path="/hotel-admin/staff/edit/:staffId" element={<EditStaffPage />} />
        <Route path="/hotel-admin/staff/details/:staffId" element={<StaffDetailPage />} />
        <Route path="/hotel-admin/staff/:staffId" element={<StaffDetailPage />} />
        <Route path="/hotel-admin/staff" element={<StaffManagementPage />} />
        <Route path="/hotel-admin/staff/*" element={<StaffManagementPage />} />

        {/* Hotel Admin ERP Additions */}
        <Route path="/hotel-admin/finance" element={<FinancePage />} />
        <Route path="/hotel-admin/finance/*" element={<FinancePage />} />
        <Route path="/hotel-admin/inventory" element={<InventoryPage />} />
        <Route path="/hotel-admin/inventory/*" element={<InventoryPage />} />
        <Route path="/hotel-admin/maintenance" element={<MaintenancePage />} />
        <Route path="/hotel-admin/maintenance/*" element={<MaintenancePage />} />
        <Route path="/hotel-admin/payroll" element={<PayrollPage />} />
        <Route path="/hotel-admin/payroll/*" element={<PayrollPage />} />
        <Route path="/hotel-admin/reports" element={<ReportsPage />} />
        <Route path="/hotel-admin/reports/*" element={<ReportsPage />} />
        <Route path="/hotel-admin/settings" element={<SettingsPage />} />
        <Route path="/hotel-admin/settings/*" element={<SettingsPage />} />
        <Route path="/hotel-admin/system/security" element={<SecuritySettingsPage />} />
        <Route path="/hotel-admin/system" element={<SettingsPage />} />
        <Route path="/hotel-admin/system/*" element={<SettingsPage />} />
        <Route path="/hotel-admin/security" element={<SecuritySettingsPage />} />
        <Route path="/hotel-admin/security/*" element={<SecuritySettingsPage />} />
        <Route path="/hotel-admin/profile" element={<SettingsPage />} />
        <Route path="/hotel-admin/profile/*" element={<SettingsPage />} />

        {/* --- 3. RECEPTIONIST PANEL ROUTES --- */}
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/dashboard/*" element={<GenericDetailPage />} />
        <Route path="/receptionist/reservations" element={<BookingsManagementPage />} />
        <Route path="/receptionist/reservations/*" element={<GenericDetailPage />} />
        <Route path="/receptionist/guest-services/*" element={<GuestsManagementPage />} />
        <Route path="/receptionist/guest-services" element={<GuestsManagementPage />} />
        <Route path="/receptionist/room-operations" element={<FrontDeskPage />} />
        <Route path="/receptionist/room-operations/*" element={<GenericDetailPage />} />
        <Route path="/receptionist/payments" element={<FinancePage />} />
        <Route path="/receptionist/payments/*" element={<FinancePage />} />
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
        <Route path="/receptionist/*" element={<GenericDetailPage />} />

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
        <Route path="/customer/feedback/*" element={<GenericDetailPage />} />
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

