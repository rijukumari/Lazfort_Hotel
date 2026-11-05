import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';
import { Sparkles } from 'lucide-react';

// Helper for dynamic imports with named or default exports
const lazyLoad = (importFn, name) =>
  lazy(() =>
    importFn().then(m => ({
      default: (name && m[name]) || m.default || Object.values(m)[0],
    }))
  );

// Luxury Lazfort Page Transition / Loading Placeholder
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-200">
    <div className="relative">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/15 to-accent/5 border border-accent/40 flex items-center justify-center text-accent shadow-gold animate-pulse">
        <Sparkles className="w-6 h-6 text-accent" />
      </div>
      <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-md -z-10 animate-ping opacity-30" />
    </div>
    <div className="text-center space-y-1">
      <p className="font-serif text-sm font-bold text-primary dark:text-white tracking-wider">
        LAZFORT PALACE
      </p>
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        <span>Loading Chamber Console...</span>
      </div>
    </div>
  </div>
);

// --- LAZY-LOADED PAGE MODULES ---
// Auth Pages
const LoginPage = lazyLoad(() => import('./pages/auth/LoginPage'), 'LoginPage');
const SignupPage = lazyLoad(() => import('./pages/auth/SignupPage'), 'SignupPage');

// Public Hotel Pages
const HotelHomePage = lazyLoad(() => import('./pages/public/HotelHomePage'), 'HotelHomePage');
const HotelFacilitiesPage = lazyLoad(() => import('./pages/customer/HotelFacilitiesPage'), 'HotelFacilitiesPage');

// Super Admin Core
const SuperAdminDashboard = lazyLoad(() => import('./pages/super-admin/SuperAdminDashboard'), 'SuperAdminDashboard');
const HotelsListPage = lazyLoad(() => import('./pages/super-admin/HotelsListPage'), 'HotelsListPage');
const AddHotelPage = lazyLoad(() => import('./pages/super-admin/AddHotelPage'), 'AddHotelPage');
const EditHotelPage = lazyLoad(() => import('./pages/super-admin/EditHotelPage'), 'EditHotelPage');
const HotelDetailPage = lazyLoad(() => import('./pages/super-admin/HotelDetailPage'), 'HotelDetailPage');
const HotelApprovalsPage = lazyLoad(() => import('./pages/super-admin/HotelApprovalsPage'), 'HotelApprovalsPage');
const HotelApprovalDetailPage = lazyLoad(() => import('./pages/super-admin/HotelApprovalDetailPage'), 'HotelApprovalDetailPage');
const HotelStatusPage = lazyLoad(() => import('./pages/super-admin/HotelStatusPage'), 'HotelStatusPage');
const SubscriptionPlansPage = lazyLoad(() => import('./pages/super-admin/SubscriptionPlansPage'), 'SubscriptionPlansPage');
const AddSubscriptionPlanPage = lazyLoad(() => import('./pages/super-admin/AddSubscriptionPlanPage'), 'AddSubscriptionPlanPage');
const PlanDetailPage = lazyLoad(() => import('./pages/super-admin/PlanDetailPage'), 'PlanDetailPage');
const ActiveSubscriptionsPage = lazyLoad(() => import('./pages/super-admin/ActiveSubscriptionsPage'), 'ActiveSubscriptionsPage');
const ExpiredSubscriptionsPage = lazyLoad(() => import('./pages/super-admin/ExpiredSubscriptionsPage'), 'ExpiredSubscriptionsPage');
const PlanFeaturesPage = lazyLoad(() => import('./pages/super-admin/PlanFeaturesPage'), 'PlanFeaturesPage');
const AddPlanFeaturePage = lazyLoad(() => import('./pages/super-admin/AddPlanFeaturePage'), 'AddPlanFeaturePage');
const PlanFeatureDetailPage = lazyLoad(() => import('./pages/super-admin/PlanFeatureDetailPage'), 'PlanFeatureDetailPage');
const RenewSubscriptionPage = lazyLoad(() => import('./pages/super-admin/RenewSubscriptionPage'), 'RenewSubscriptionPage');
const SubscriptionDetailPage = lazyLoad(() => import('./pages/super-admin/SubscriptionDetailPage'), 'SubscriptionDetailPage');
const ManageSubscriptionPage = lazyLoad(() => import('./pages/super-admin/ManageSubscriptionPage'), 'ManageSubscriptionPage');

// Super Admin Billing
const PlatformRevenuePage = lazyLoad(() => import('./pages/super-admin/billing/PlatformRevenuePage'), 'PlatformRevenuePage');
const AddGLAccountPage = lazyLoad(() => import('./pages/super-admin/billing/AddGLAccountPage'), 'AddGLAccountPage');
const FolioStatementPage = lazyLoad(() => import('./pages/super-admin/billing/FolioStatementPage'), 'FolioStatementPage');
const AddFolioChargePage = lazyLoad(() => import('./pages/super-admin/billing/AddFolioChargePage'), 'AddFolioChargePage');
const SettleFolioPaymentPage = lazyLoad(() => import('./pages/super-admin/billing/SettleFolioPaymentPage'), 'SettleFolioPaymentPage');
const PaymentTransactionsPage = lazyLoad(() => import('./pages/super-admin/billing/PaymentTransactionsPage'), 'PaymentTransactionsPage');
const TransactionDetailPage = lazyLoad(() => import('./pages/super-admin/billing/TransactionDetailPage'), 'TransactionDetailPage');
const RefundRequestsPage = lazyLoad(() => import('./pages/super-admin/billing/RefundRequestsPage'), 'RefundRequestsPage');
const RefundDetailPage = lazyLoad(() => import('./pages/super-admin/billing/RefundDetailPage'), 'RefundDetailPage');
const BillingInvoicesPage = lazyLoad(() => import('./pages/super-admin/billing/BillingInvoicesPage'), 'BillingInvoicesPage');
const InvoiceDetailPage = lazyLoad(() => import('./pages/super-admin/billing/InvoiceDetailPage'), 'InvoiceDetailPage');

// Super Admin Users
const AllUsersPage = lazyLoad(() => import('./pages/super-admin/users/AllUsersPage'), 'AllUsersPage');
const AddUserPage = lazyLoad(() => import('./pages/super-admin/users/AddUserPage'), 'AddUserPage');
const EditUserPage = lazyLoad(() => import('./pages/super-admin/users/EditUserPage'), 'EditUserPage');
const UserDetailPage = lazyLoad(() => import('./pages/super-admin/users/UserDetailPage'), 'UserDetailPage');
const ActiveUsersPage = lazyLoad(() => import('./pages/super-admin/users/ActiveUsersPage'), 'ActiveUsersPage');
const SuspendedUsersPage = lazyLoad(() => import('./pages/super-admin/users/SuspendedUsersPage'), 'SuspendedUsersPage');

// Super Admin Platform & System Preferences
const SuperAdminProfilePage = lazyLoad(() => import('./pages/super-admin/profile/SuperAdminProfilePage'), 'SuperAdminProfilePage');
const SuperAdminSystemPreferencesPage = lazyLoad(() => import('./pages/super-admin/settings/SuperAdminSystemPreferencesPage'), 'SuperAdminSystemPreferencesPage');
const GlobalSettingsPage = lazyLoad(() => import('./pages/super-admin/platform/GlobalSettingsPage'), 'GlobalSettingsPage');
const FeatureManagementPage = lazyLoad(() => import('./pages/super-admin/platform/FeatureManagementPage'), 'FeatureManagementPage');
const SystemAnnouncementsPage = lazyLoad(() => import('./pages/super-admin/platform/SystemAnnouncementsPage'), 'SystemAnnouncementsPage');
const AddAnnouncementPage = lazyLoad(() => import('./pages/super-admin/platform/AddAnnouncementPage'), 'AddAnnouncementPage');
const AnnouncementDetailPage = lazyLoad(() => import('./pages/super-admin/platform/AnnouncementDetailPage'), 'AnnouncementDetailPage');

// Super Admin Support
const SupportTicketsPage = lazyLoad(() => import('./pages/super-admin/support/SupportTicketsPage'), 'SupportTicketsPage');
const SupportTicketDetailPage = lazyLoad(() => import('./pages/super-admin/support/SupportTicketDetailPage'), 'SupportTicketDetailPage');
const ComplaintsPage = lazyLoad(() => import('./pages/super-admin/support/ComplaintsPage'), 'ComplaintsPage');
const ComplaintDetailPage = lazyLoad(() => import('./pages/super-admin/support/ComplaintDetailPage'), 'ComplaintDetailPage');
const ContactRequestsPage = lazyLoad(() => import('./pages/super-admin/support/ContactRequestsPage'), 'ContactRequestsPage');

// Super Admin Reports & System
const PlatformReportsPage = lazyLoad(() => import('./pages/super-admin/reports/PlatformReportsPage'), 'PlatformReportsPage');
const HotelPerformancePage = lazyLoad(() => import('./pages/super-admin/reports/HotelPerformancePage'), 'HotelPerformancePage');
const SuperAdminRevenueReportsPage = lazyLoad(() => import('./pages/super-admin/reports/RevenueReportsPage'), 'RevenueReportsPage');
const AuditLogsPage = lazyLoad(() => import('./pages/super-admin/system/AuditLogsPage'), 'AuditLogsPage');
const SystemHealthPage = lazyLoad(() => import('./pages/super-admin/system/SystemHealthPage'), 'SystemHealthPage');
const BackupStatusPage = lazyLoad(() => import('./pages/super-admin/system/BackupStatusPage'), 'BackupStatusPage');
const SecuritySettingsPage = lazyLoad(() => import('./pages/super-admin/system/SecuritySettingsPage'), 'SecuritySettingsPage');

// Hotel Admin Dashboard Submenus
const HotelAdminDashboard = lazyLoad(() => import('./pages/hotel-admin/HotelAdminDashboard'), 'HotelAdminDashboard');
const DashboardOverviewPage = lazyLoad(() => import('./pages/hotel-admin/DashboardOverviewPage'), 'DashboardOverviewPage');
const TodaysSummaryPage = lazyLoad(() => import('./pages/hotel-admin/TodaysSummaryPage'), 'TodaysSummaryPage');
const OccupancyAnalyticsPage = lazyLoad(() => import('./pages/hotel-admin/OccupancyAnalyticsPage'), 'OccupancyAnalyticsPage');
const RevenueAnalyticsPage = lazyLoad(() => import('./pages/hotel-admin/RevenueAnalyticsPage'), 'RevenueAnalyticsPage');
const RecentBookingsPage = lazyLoad(() => import('./pages/hotel-admin/RecentBookingsPage'), 'RecentBookingsPage');

// Hotel Admin Rooms Submenus
const RoomsManagementPage = lazyLoad(() => import('./pages/hotel-admin/RoomsManagementPage'), 'RoomsManagementPage');
const AddRoomPage = lazyLoad(() => import('./pages/hotel-admin/AddRoomPage'), 'AddRoomPage');
const AddRoomCategoryPage = lazyLoad(() => import('./pages/hotel-admin/AddRoomCategoryPage'), 'AddRoomCategoryPage');
const EditRoomPage = lazyLoad(() => import('./pages/hotel-admin/EditRoomPage'), 'EditRoomPage');
const RoomDetailPage = lazyLoad(() => import('./pages/hotel-admin/RoomDetailPage'), 'RoomDetailPage');
const RoomCategoriesPage = lazyLoad(() => import('./pages/hotel-admin/RoomCategoriesPage'), 'RoomCategoriesPage');
const RoomAmenitiesPage = lazyLoad(() => import('./pages/hotel-admin/RoomAmenitiesPage'), 'RoomAmenitiesPage');
const RoomImagesPage = lazyLoad(() => import('./pages/hotel-admin/RoomImagesPage'), 'RoomImagesPage');
const RoomPricingPage = lazyLoad(() => import('./pages/hotel-admin/RoomPricingPage'), 'RoomPricingPage');
const RoomAvailabilityPage = lazyLoad(() => import('./pages/hotel-admin/RoomAvailabilityPage'), 'RoomAvailabilityPage');
const RoomMaintenancePage = lazyLoad(() => import('./pages/hotel-admin/RoomMaintenancePage'), 'RoomMaintenancePage');

// Hotel Admin Bookings Submenus
const BookingsManagementPage = lazyLoad(() => import('./pages/hotel-admin/BookingsManagementPage'), 'BookingsManagementPage');
const NewBookingPage = lazyLoad(() => import('./pages/hotel-admin/NewBookingPage'), 'NewBookingPage');
const ConfirmedBookingsPage = lazyLoad(() => import('./pages/hotel-admin/ConfirmedBookingsPage'), 'ConfirmedBookingsPage');
const PendingBookingsPage = lazyLoad(() => import('./pages/hotel-admin/PendingBookingsPage'), 'PendingBookingsPage');
const CheckedInBookingsPage = lazyLoad(() => import('./pages/hotel-admin/CheckedInBookingsPage'), 'CheckedInBookingsPage');
const CheckedOutBookingsPage = lazyLoad(() => import('./pages/hotel-admin/CheckedOutBookingsPage'), 'CheckedOutBookingsPage');
const CancelledBookingsPage = lazyLoad(() => import('./pages/hotel-admin/CancelledBookingsPage'), 'CancelledBookingsPage');
const BookingCalendarPage = lazyLoad(() => import('./pages/hotel-admin/BookingCalendarPage'), 'BookingCalendarPage');
const BookingFolioPage = lazyLoad(() => import('./pages/hotel-admin/BookingFolioPage'), 'BookingFolioPage');

// Front Desk
const FrontDeskPage = lazyLoad(() => import('./pages/hotel-admin/FrontDeskPage'), 'FrontDeskPage');
const SuiteTransferPage = lazyLoad(() => import('./pages/hotel-admin/SuiteTransferPage'), 'SuiteTransferPage');

// Hotel Admin Guests Submenus
const GuestsManagementPage = lazyLoad(() => import('./pages/hotel-admin/GuestsManagementPage'), 'GuestsManagementPage');
const GuestDetailsListingPage = lazyLoad(() => import('./pages/hotel-admin/GuestDetailsListingPage'), 'GuestDetailsListingPage');
const GuestHistoryPage = lazyLoad(() => import('./pages/hotel-admin/GuestHistoryPage'), 'GuestHistoryPage');
const VIPGuestsPage = lazyLoad(() => import('./pages/hotel-admin/VIPGuestsPage'), 'VIPGuestsPage');
const GuestFeedbackPage = lazyLoad(() => import('./pages/hotel-admin/GuestFeedbackPage'), 'GuestFeedbackPage');
const AddGuestPage = lazyLoad(() => import('./pages/hotel-admin/AddGuestPage'), 'AddGuestPage');
const EditGuestPage = lazyLoad(() => import('./pages/hotel-admin/EditGuestPage'), 'EditGuestPage');
const GuestDetailPage = lazyLoad(() => import('./pages/hotel-admin/GuestDetailPage'), 'GuestDetailPage');

// Housekeeping Submenus
const HousekeepingOverviewPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/HousekeepingOverviewPage'), 'HousekeepingOverviewPage');
const RoomCleaningPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/RoomCleaningPage'), 'RoomCleaningPage');
const CleaningAssignmentsPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/CleaningAssignmentsPage'), 'CleaningAssignmentsPage');
const AssignChamberTurnoverPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/AssignChamberTurnoverPage'), 'AssignChamberTurnoverPage');
const HousekeepingInspectionPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/HousekeepingInspectionPage'), 'HousekeepingInspectionPage');
const InspectionDetailPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/InspectionDetailPage'), 'InspectionDetailPage');
const HousekeepingMaintenancePage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/HousekeepingMaintenancePage'), 'HousekeepingMaintenancePage');
const LostAndFoundPage = lazyLoad(() => import('./pages/hotel-admin/housekeeping/LostAndFoundPage'), 'LostAndFoundPage');
const HousekeepingAdminPage = HousekeepingOverviewPage;
const ScheduleTurnoverPage = lazyLoad(() => import('./pages/hotel-admin/ScheduleTurnoverPage'), 'ScheduleTurnoverPage');

// Restaurant & Staff
const RestaurantPage = lazyLoad(() => import('./pages/hotel-admin/RestaurantPage'), 'RestaurantPage');
const NewRestaurantOrderPage = lazyLoad(() => import('./pages/hotel-admin/NewRestaurantOrderPage'), 'NewRestaurantOrderPage');
const RestaurantDashboardPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/RestaurantDashboardPage'), 'RestaurantDashboardPage');
const MenuCategoriesPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/MenuCategoriesPage'), 'MenuCategoriesPage');
const MenuItemsPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/MenuItemsPage'), 'MenuItemsPage');
const FoodOrdersPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/FoodOrdersPage'), 'FoodOrdersPage');
const RestaurantTablesPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/RestaurantTablesPage'), 'RestaurantTablesPage');
const RestaurantBillingPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/RestaurantBillingPage'), 'RestaurantBillingPage');
const GenerateRestaurantBillPage = lazyLoad(() => import('./pages/hotel-admin/restaurant/GenerateRestaurantBillPage'), 'GenerateRestaurantBillPage');
const StaffManagementPage = lazyLoad(() => import('./pages/hotel-admin/StaffManagementPage'), 'StaffManagementPage');
const AddStaffPage = lazyLoad(() => import('./pages/hotel-admin/AddStaffPage'), 'AddStaffPage');
const EditStaffPage = lazyLoad(() => import('./pages/hotel-admin/EditStaffPage'), 'EditStaffPage');
const StaffDetailPage = lazyLoad(() => import('./pages/hotel-admin/StaffDetailPage'), 'StaffDetailPage');
const DepartmentsPage = lazyLoad(() => import('./pages/hotel-admin/DepartmentsPage'), 'DepartmentsPage');
const AddDepartmentPage = lazyLoad(() => import('./pages/hotel-admin/staff/AddDepartmentPage'), 'AddDepartmentPage');
const EditDepartmentPage = lazyLoad(() => import('./pages/hotel-admin/staff/EditDepartmentPage'), 'EditDepartmentPage');
const DepartmentDetailPage = lazyLoad(() => import('./pages/hotel-admin/staff/DepartmentDetailPage'), 'DepartmentDetailPage');
const RolesPermissionsPage = lazyLoad(() => import('./pages/hotel-admin/RolesPermissionsPage'), 'RolesPermissionsPage');
const AttendancePage = lazyLoad(() => import('./pages/hotel-admin/AttendancePage'), 'AttendancePage');
const ShiftSchedulingPage = lazyLoad(() => import('./pages/hotel-admin/ShiftSchedulingPage'), 'ShiftSchedulingPage');
const LeaveRequestsPage = lazyLoad(() => import('./pages/hotel-admin/LeaveRequestsPage'), 'LeaveRequestsPage');

// Payments & Marketing
const PaymentsPage = lazyLoad(() => import('./pages/hotel-admin/PaymentsPage'), 'PaymentsPage');
const MarketingPage = lazyLoad(() => import('./pages/hotel-admin/MarketingPage'), 'MarketingPage');
const CouponsManagementPage = lazyLoad(() => import('./pages/hotel-admin/marketing/CouponsManagementPage'), 'CouponsManagementPage');
const PackagesManagementPage = lazyLoad(() => import('./pages/hotel-admin/marketing/PackagesManagementPage'), 'PackagesManagementPage');
const PromotionalBannersPage = lazyLoad(() => import('./pages/hotel-admin/marketing/PromotionalBannersPage'), 'PromotionalBannersPage');

// Front Desk Dashboard Dedicated Pages
const FrontDeskOverviewPage = lazyLoad(() => import('./pages/hotel-admin/dashboard/FrontDeskOverviewPage'), 'FrontDeskOverviewPage');
const TodaysArrivalsPage = lazyLoad(() => import('./pages/hotel-admin/dashboard/TodaysArrivalsPage'), 'TodaysArrivalsPage');
const TodaysDeparturesPage = lazyLoad(() => import('./pages/hotel-admin/dashboard/TodaysDeparturesPage'), 'TodaysDeparturesPage');
const AvailableRoomsPage = lazyLoad(() => import('./pages/hotel-admin/dashboard/AvailableRoomsPage'), 'AvailableRoomsPage');

// Receptionist Dedicated Payment Pages
const CollectPaymentPage = lazyLoad(() => import('./pages/receptionist/payments/CollectPaymentPage'), 'CollectPaymentPage');
const PaymentHistoryPage = lazyLoad(() => import('./pages/receptionist/payments/PaymentHistoryPage'), 'PaymentHistoryPage');
const PendingPaymentsPage = lazyLoad(() => import('./pages/receptionist/payments/PendingPaymentsPage'), 'PendingPaymentsPage');
const PrintReceiptPage = lazyLoad(() => import('./pages/receptionist/payments/PrintReceiptPage'), 'PrintReceiptPage');

// Dedicated Room Cleaning Pages
const AssignedRoomsPage = lazyLoad(() => import('./pages/housekeeping/cleaning/AssignedRoomsPage'), 'AssignedRoomsPage');
const RoomsToCleanPage = lazyLoad(() => import('./pages/housekeeping/cleaning/RoomsToCleanPage'), 'RoomsToCleanPage');
const InProgressCleaningPage = lazyLoad(() => import('./pages/housekeeping/cleaning/InProgressCleaningPage'), 'InProgressCleaningPage');
const CompletedCleaningTasksPage = lazyLoad(() => import('./pages/housekeeping/cleaning/CompletedCleaningTasksPage'), 'CompletedCleaningTasksPage');
const CleaningChecklistPage = lazyLoad(() => import('./pages/housekeeping/cleaning/CleaningChecklistPage'), 'CleaningChecklistPage');

// Dedicated Housekeeping Maintenance Pages
const MaintenanceRequestsPage = lazyLoad(() => import('./pages/housekeeping/maintenance/MaintenanceRequestsPage'), 'MaintenanceRequestsPage');
const ReportIssuePage = lazyLoad(() => import('./pages/housekeeping/maintenance/ReportIssuePage'), 'ReportIssuePage');
const MaintenanceHistoryPage = lazyLoad(() => import('./pages/housekeeping/maintenance/MaintenanceHistoryPage'), 'MaintenanceHistoryPage');

// Dedicated Housekeeping Services & Schedule Pages
const HousekeepingLostAndFoundPage = lazyLoad(() => import('./pages/housekeeping/services/HousekeepingLostAndFoundPage'), 'HousekeepingLostAndFoundPage');
const HousekeepingMySchedulePage = lazyLoad(() => import('./pages/housekeeping/services/HousekeepingMySchedulePage'), 'HousekeepingMySchedulePage');
const HousekeepingNotificationsPage = lazyLoad(() => import('./pages/housekeeping/services/HousekeepingNotificationsPage'), 'HousekeepingNotificationsPage');

// Room Operations Dedicated Pages
const RoomOperationsAvailabilityPage = lazyLoad(() => import('./pages/receptionist/room-ops/RoomOperationsAvailabilityPage'), 'RoomOperationsAvailabilityPage');
const RoomAllocationPage = lazyLoad(() => import('./pages/receptionist/room-ops/RoomAllocationPage'), 'RoomAllocationPage');
const RoomTransfersPage = lazyLoad(() => import('./pages/receptionist/room-ops/RoomTransfersPage'), 'RoomTransfersPage');
const RoomOperationsCheckInPage = lazyLoad(() => import('./pages/receptionist/room-ops/RoomOperationsCheckInPage'), 'RoomOperationsCheckInPage');
const RoomOperationsCheckOutPage = lazyLoad(() => import('./pages/receptionist/room-ops/RoomOperationsCheckOutPage'), 'RoomOperationsCheckOutPage');
const EarlyLateCheckOutPage = lazyLoad(() => import('./pages/receptionist/room-ops/EarlyLateCheckOutPage'), 'EarlyLateCheckOutPage');

// Receptionist, Customer, Housekeeping, Staff Dashboards
const ReceptionistDashboard = lazyLoad(() => import('./pages/receptionist/ReceptionistDashboard'), 'ReceptionistDashboard');
const AdvanceNewBookingPage = lazyLoad(() => import('./pages/receptionist/reservations/AdvanceNewBookingPage'), 'AdvanceNewBookingPage');
const WalkInBookingPage = lazyLoad(() => import('./pages/receptionist/reservations/WalkInBookingPage'), 'WalkInBookingPage');
const BookingSearchPage = lazyLoad(() => import('./pages/receptionist/reservations/BookingSearchPage'), 'BookingSearchPage');
const BookingModificationsPage = lazyLoad(() => import('./pages/receptionist/reservations/BookingModificationsPage'), 'BookingModificationsPage');
const ReceptionistProfilePage = lazyLoad(() => import('./pages/receptionist/profile/ReceptionistProfilePage'), 'ReceptionistProfilePage');
const ReceptionistSystemPreferencesPage = lazyLoad(() => import('./pages/receptionist/settings/ReceptionistSystemPreferencesPage'), 'ReceptionistSystemPreferencesPage');
const GuestRegistrationPage = lazyLoad(() => import('./pages/receptionist/GuestRegistrationPage'), 'GuestRegistrationPage');
const GuestDirectoryPage = lazyLoad(() => import('./pages/receptionist/GuestDirectoryPage'), 'GuestDirectoryPage');
const GuestServicesRequestsPage = lazyLoad(() => import('./pages/receptionist/GuestServicesRequestsPage'), 'GuestServicesRequestsPage');
const CustomerDashboard = lazyLoad(() => import('./pages/customer/CustomerDashboard'), 'CustomerDashboard');
const CustomerBrowseRoomsPage = lazyLoad(() => import('./pages/customer/CustomerBrowseRoomsPage'), 'CustomerBrowseRoomsPage');
const RoomDetailsPage = lazyLoad(() => import('./pages/customer/RoomDetailsPage'), 'RoomDetailsPage');
const BookingCheckoutPage = lazyLoad(() => import('./pages/customer/BookingCheckoutPage'), 'BookingCheckoutPage');
const BookingConfirmationPage = lazyLoad(() => import('./pages/customer/BookingConfirmationPage'), 'BookingConfirmationPage');
const MyBookingsPage = lazyLoad(() => import('./pages/customer/MyBookingsPage'), 'MyBookingsPage');
const UpcomingReservationsPage = lazyLoad(() => import('./pages/customer/UpcomingReservationsPage'), 'UpcomingReservationsPage');
const BookingDetailPage = lazyLoad(() => import('./pages/customer/BookingDetailPage'), 'BookingDetailPage');
const MySuiteControlsPage = lazyLoad(() => import('./pages/customer/MySuiteControlsPage'), 'MySuiteControlsPage');
const RoomServicePage = lazyLoad(() => import('./pages/customer/RoomServicePage'), 'RoomServicePage');
const VIPBenefitsPage = lazyLoad(() => import('./pages/customer/VIPBenefitsPage'), 'VIPBenefitsPage');
const CustomerProfilePage = lazyLoad(() => import('./pages/customer/CustomerProfilePage'), 'CustomerProfilePage');
const CustomerSystemPreferencesPage = lazyLoad(() => import('./pages/customer/CustomerSystemPreferencesPage'), 'CustomerSystemPreferencesPage');
const CustomerSecurityPage = lazyLoad(() => import('./pages/customer/CustomerSecurityPage'), 'CustomerSecurityPage');
const CustomerPaymentsPage = lazyLoad(() => import('./pages/customer/CustomerPaymentsPage'), 'CustomerPaymentsPage');
const CustomerGuestServicesPage = lazyLoad(() => import('./pages/customer/CustomerGuestServicesPage'), 'CustomerGuestServicesPage');
const HousekeepingDashboard = lazyLoad(() => import('./pages/housekeeping/HousekeepingDashboard'), 'HousekeepingDashboard');
const HousekeepingTodayTasksPage = lazyLoad(() => import('./pages/housekeeping/HousekeepingTodayTasksPage'), 'HousekeepingTodayTasksPage');
const HousekeepingPendingTasksPage = lazyLoad(() => import('./pages/housekeeping/HousekeepingPendingTasksPage'), 'HousekeepingPendingTasksPage');
const HousekeepingServicesPage = lazyLoad(() => import('./pages/housekeeping/HousekeepingServicesPage'), 'HousekeepingServicesPage');
const HousekeepingProfilePage = lazyLoad(() => import('./pages/housekeeping/profile/HousekeepingProfilePage'), 'HousekeepingProfilePage');
const HousekeepingSystemPreferencesPage = lazyLoad(() => import('./pages/housekeeping/settings/HousekeepingSystemPreferencesPage'), 'HousekeepingSystemPreferencesPage');
const StaffDashboard = lazyLoad(() => import('./pages/staff/StaffDashboard'), 'StaffDashboard');
const StaffTodayOverviewPage = lazyLoad(() => import('./pages/staff/StaffTodayOverviewPage'), 'StaffTodayOverviewPage');
const StaffAssignedTasksPage = lazyLoad(() => import('./pages/staff/StaffAssignedTasksPage'), 'StaffAssignedTasksPage');
const StaffTaskDetailsPage = lazyLoad(() => import('./pages/staff/StaffTaskDetailsPage'), 'StaffTaskDetailsPage');
const StaffTaskHistoryPage = lazyLoad(() => import('./pages/staff/StaffTaskHistoryPage'), 'StaffTaskHistoryPage');
const StaffAttendancePage = lazyLoad(() => import('./pages/staff/StaffAttendancePage'), 'StaffAttendancePage');
const StaffCheckInCheckOutPage = lazyLoad(() => import('./pages/staff/StaffCheckInCheckOutPage'), 'StaffCheckInCheckOutPage');
const StaffAttendanceHistoryPage = lazyLoad(() => import('./pages/staff/StaffAttendanceHistoryPage'), 'StaffAttendanceHistoryPage');
const StaffSchedulePage = lazyLoad(() => import('./pages/staff/StaffSchedulePage'), 'StaffSchedulePage');
const StaffWeeklySchedulePage = lazyLoad(() => import('./pages/staff/StaffWeeklySchedulePage'), 'StaffWeeklySchedulePage');
const StaffLeaveRequestsPage = lazyLoad(() => import('./pages/staff/StaffLeaveRequestsPage'), 'StaffLeaveRequestsPage');
const StaffApplyLeavePage = lazyLoad(() => import('./pages/staff/StaffApplyLeavePage'), 'StaffApplyLeavePage');
const StaffAnnouncementsPage = lazyLoad(() => import('./pages/staff/StaffAnnouncementsPage'), 'StaffAnnouncementsPage');
const StaffNotificationsPage = lazyLoad(() => import('./pages/staff/StaffNotificationsPage'), 'StaffNotificationsPage');
const StaffMessagesPage = lazyLoad(() => import('./pages/staff/StaffMessagesPage'), 'StaffMessagesPage');
const StaffProfilePage = lazyLoad(() => import('./pages/staff/profile/StaffProfilePage'), 'StaffProfilePage');
const StaffSystemPreferencesPage = lazyLoad(() => import('./pages/staff/settings/StaffSystemPreferencesPage'), 'StaffSystemPreferencesPage');

// ERP Modules - Maintenance & Engineering Dedicated Pages
const MaintenanceDashboardPage = lazyLoad(() => import('./pages/hotel-admin/maintenance/MaintenanceDashboardPage'), 'MaintenanceDashboardPage');
const MaintenanceTicketsPage = lazyLoad(() => import('./pages/hotel-admin/maintenance/MaintenanceTicketsPage'), 'MaintenanceTicketsPage');
const AssetRegisterPage = lazyLoad(() => import('./pages/hotel-admin/maintenance/AssetRegisterPage'), 'AssetRegisterPage');

// ERP Modules - Inventory Management Dedicated Pages
const InventoryDashboardPage = lazyLoad(() => import('./pages/hotel-admin/inventory/InventoryDashboardPage'), 'InventoryDashboardPage');
const ItemCatalogPage = lazyLoad(() => import('./pages/hotel-admin/inventory/ItemCatalogPage'), 'ItemCatalogPage');
const LowStockAlertsPage = lazyLoad(() => import('./pages/hotel-admin/inventory/LowStockAlertsPage'), 'LowStockAlertsPage');
const StockMovementsPage = lazyLoad(() => import('./pages/hotel-admin/inventory/StockMovementsPage'), 'StockMovementsPage');
const ApprovedSuppliersPage = lazyLoad(() => import('./pages/hotel-admin/inventory/ApprovedSuppliersPage'), 'ApprovedSuppliersPage');

// ERP Modules - Finance & General Ledger Dedicated Pages
const FinanceDashboardPage = lazyLoad(() => import('./pages/hotel-admin/finance/FinanceDashboardPage'), 'FinanceDashboardPage');
const GuestFoliosPage = lazyLoad(() => import('./pages/hotel-admin/finance/GuestFoliosPage'), 'GuestFoliosPage');
const CreateFolioPage = lazyLoad(() => import('./pages/hotel-admin/finance/CreateFolioPage'), 'CreateFolioPage');
const InvoicesPage = lazyLoad(() => import('./pages/hotel-admin/finance/InvoicesPage'), 'InvoicesPage');
const CreateInvoicePage = lazyLoad(() => import('./pages/hotel-admin/finance/CreateInvoicePage'), 'CreateInvoicePage');
const ChartOfAccountsPage = lazyLoad(() => import('./pages/hotel-admin/finance/ChartOfAccountsPage'), 'ChartOfAccountsPage');
const JournalEntriesPage = lazyLoad(() => import('./pages/hotel-admin/finance/JournalEntriesPage'), 'JournalEntriesPage');
const CreateJournalEntryPage = lazyLoad(() => import('./pages/hotel-admin/finance/CreateJournalEntryPage'), 'CreateJournalEntryPage');
const PaymentOperationsPage = lazyLoad(() => import('./pages/hotel-admin/finance/PaymentOperationsPage'), 'PaymentOperationsPage');
const PaymentReceiptDetailPage = lazyLoad(() => import('./pages/hotel-admin/finance/PaymentReceiptDetailPage'), 'PaymentReceiptDetailPage');

// ERP Modules - Executive Payroll Dedicated Pages
const PayrollRunsPage = lazyLoad(() => import('./pages/hotel-admin/payroll/PayrollRunsPage'), 'PayrollRunsPage');
const EmployeePayslipsPage = lazyLoad(() => import('./pages/hotel-admin/payroll/EmployeePayslipsPage'), 'EmployeePayslipsPage');

// ERP Modules - Guest Reviews Dedicated Pages
const GuestReviewsPage = lazyLoad(() => import('./pages/hotel-admin/reviews/GuestReviewsPage'), 'GuestReviewsPage');
const RatingsPage = lazyLoad(() => import('./pages/hotel-admin/reviews/RatingsPage'), 'RatingsPage');
const FeedbackManagementPage = lazyLoad(() => import('./pages/hotel-admin/reviews/FeedbackManagementPage'), 'FeedbackManagementPage');

// ERP Modules - Reports & Analytics Dedicated Pages
const RevenueReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/RevenueReportsPage'), 'RevenueReportsPage');
const OccupancyReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/OccupancyReportsPage'), 'OccupancyReportsPage');
const BookingReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/BookingReportsPage'), 'BookingReportsPage');
const CancellationReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/CancellationReportsPage'), 'CancellationReportsPage');
const GuestReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/GuestReportsPage'), 'GuestReportsPage');
const StaffReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/StaffReportsPage'), 'StaffReportsPage');
const ExportReportsPage = lazyLoad(() => import('./pages/hotel-admin/reports/ExportReportsPage'), 'ExportReportsPage');

// ERP Modules - Hotel Settings Dedicated Pages
const HotelProfilePage = lazyLoad(() => import('./pages/hotel-admin/settings/HotelProfilePage'), 'HotelProfilePage');
const HotelInformationPage = lazyLoad(() => import('./pages/hotel-admin/settings/HotelInformationPage'), 'HotelInformationPage');
const LogoBrandingPage = lazyLoad(() => import('./pages/hotel-admin/settings/LogoBrandingPage'), 'LogoBrandingPage');
const CheckInRulesPage = lazyLoad(() => import('./pages/hotel-admin/settings/CheckInRulesPage'), 'CheckInRulesPage');
const CancellationPolicyPage = lazyLoad(() => import('./pages/hotel-admin/settings/CancellationPolicyPage'), 'CancellationPolicyPage');
const TaxesChargesPage = lazyLoad(() => import('./pages/hotel-admin/settings/TaxesChargesPage'), 'TaxesChargesPage');
const NotificationPreferencesPage = lazyLoad(() => import('./pages/hotel-admin/settings/NotificationPreferencesPage'), 'NotificationPreferencesPage');
const PaymentPreferencesPage = lazyLoad(() => import('./pages/hotel-admin/settings/PaymentPreferencesPage'), 'PaymentPreferencesPage');
const AdminProfilePage = lazyLoad(() => import('./pages/hotel-admin/profile/AdminProfilePage'), 'AdminProfilePage');
const HotelSystemPreferencesPage = lazyLoad(() => import('./pages/hotel-admin/settings/HotelSystemPreferencesPage'), 'HotelSystemPreferencesPage');

// ERP Modules
const FinancePage = lazyLoad(() => import('./pages/erp/FinancePage'), 'FinancePage');
const InventoryPage = lazyLoad(() => import('./pages/erp/InventoryPage'), 'InventoryPage');
const AddInventoryItemPage = lazyLoad(() => import('./pages/erp/AddInventoryItemPage'), 'AddInventoryItemPage');
const RecordMovementPage = lazyLoad(() => import('./pages/erp/RecordMovementPage'), 'RecordMovementPage');
const AddSupplierPage = lazyLoad(() => import('./pages/erp/AddSupplierPage'), 'AddSupplierPage');
const MaintenancePage = lazyLoad(() => import('./pages/erp/MaintenancePage'), 'MaintenancePage');
const PayrollPage = lazyLoad(() => import('./pages/erp/PayrollPage'), 'PayrollPage');
const ReportsPage = lazyLoad(() => import('./pages/erp/ReportsPage'), 'ReportsPage');
const SettingsPage = lazyLoad(() => import('./pages/erp/SettingsPage'), 'SettingsPage');

// Common & Fallbacks
const GenericDetailPage = lazyLoad(() => import('./pages/common/GenericDetailPage'), 'GenericDetailPage');
const NotFoundPage = lazyLoad(() => import('./pages/common/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const UnauthorizedPage = lazyLoad(() => import('./pages/common/NotFoundPage').then(m => ({ default: m.UnauthorizedPage })));

export const AppRouter = () => {
  const { role, isAuthenticated } = useAuth();
  const defaultPath = `/${role.replace(/_/g, '-')}/dashboard`;

  return (
    <Suspense fallback={null}>
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

        {/* Root redirect */}
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

          {/* Super Admin Profile, Preferences & Security */}
          <Route path="/super-admin/profile" element={<SuperAdminProfilePage />} />
          <Route path="/super-admin/profile/*" element={<SuperAdminProfilePage />} />
          <Route path="/super-admin/preferences" element={<SuperAdminSystemPreferencesPage />} />
          <Route path="/super-admin/settings" element={<SuperAdminSystemPreferencesPage />} />
          <Route path="/super-admin/system/security" element={<SecuritySettingsPage />} />
          <Route path="/super-admin/security" element={<SecuritySettingsPage />} />

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
          <Route path="/super-admin/reports/revenue" element={<SuperAdminRevenueReportsPage />} />
          <Route path="/super-admin/reports/*" element={<PlatformReportsPage />} />

          {/* Module 6: System & Security */}
          <Route path="/super-admin/system" element={<AuditLogsPage />} />
          <Route path="/super-admin/system/audit" element={<AuditLogsPage />} />
          <Route path="/super-admin/system/health" element={<SystemHealthPage />} />
          <Route path="/super-admin/system/backups" element={<BackupStatusPage />} />
          <Route path="/super-admin/system/security" element={<SecuritySettingsPage />} />
          <Route path="/super-admin/system/*" element={<AuditLogsPage />} />

          {/* --- 2. HOTEL ADMIN PANEL ROUTES --- */}
          {/* Hotel Admin Front Desk Dashboard Submenus */}
          <Route path="/hotel-admin/dashboard/front-desk" element={<FrontDeskOverviewPage />} />
          <Route path="/hotel-admin/dashboard/arrivals" element={<TodaysArrivalsPage />} />
          <Route path="/hotel-admin/dashboard/departures" element={<TodaysDeparturesPage />} />
          <Route path="/hotel-admin/dashboard/available-rooms" element={<AvailableRoomsPage />} />

          {/* Hotel Admin Dashboard Submenus */}
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
          <Route path="/hotel-admin/front-desk/walk-in" element={<WalkInBookingPage />} />
          <Route path="/hotel-admin/front-desk/allocations" element={<FrontDeskPage />} />
          <Route path="/hotel-admin/front-desk/check-in" element={<CheckedInBookingsPage />} />
          <Route path="/hotel-admin/front-desk/check-out" element={<CheckedOutBookingsPage />} />
          <Route path="/hotel-admin/front-desk/transfers" element={<SuiteTransferPage />} />
          <Route path="/hotel-admin/front-desk" element={<FrontDeskPage />} />
          <Route path="/hotel-admin/front-desk/*" element={<FrontDeskPage />} />

          {/* Admin Aliases for Front Desk */}
          <Route path="/admin/front-desk/walk-in" element={<WalkInBookingPage />} />
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
          <Route path="/hotel-admin/housekeeping/assignments/create" element={<AssignChamberTurnoverPage />} />
          <Route path="/hotel-admin/housekeeping/assignments/assign" element={<AssignChamberTurnoverPage />} />
          <Route path="/hotel-admin/housekeeping/schedule" element={<ScheduleTurnoverPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning/assigned" element={<AssignedRoomsPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning/todo" element={<RoomsToCleanPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning/in-progress" element={<InProgressCleaningPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning/completed" element={<CompletedCleaningTasksPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning/checklist" element={<CleaningChecklistPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning/inspection" element={<HousekeepingInspectionPage />} />
          <Route path="/hotel-admin/housekeeping/cleaning" element={<RoomCleaningPage />} />
          <Route path="/hotel-admin/housekeeping/assignments" element={<CleaningAssignmentsPage />} />
          <Route path="/hotel-admin/housekeeping/inspection/details/:id" element={<InspectionDetailPage />} />
          <Route path="/hotel-admin/housekeeping/inspection/:id" element={<InspectionDetailPage />} />
          <Route path="/hotel-admin/housekeeping/inspection" element={<HousekeepingInspectionPage />} />
          <Route path="/hotel-admin/housekeeping/maintenance/requests" element={<MaintenanceRequestsPage />} />
          <Route path="/hotel-admin/housekeeping/maintenance/report" element={<ReportIssuePage />} />
          <Route path="/hotel-admin/housekeeping/maintenance/history" element={<MaintenanceHistoryPage />} />
          <Route path="/hotel-admin/housekeeping/maintenance" element={<HousekeepingMaintenancePage />} />
          <Route path="/hotel-admin/housekeeping/lost-found" element={<HousekeepingLostAndFoundPage />} />
          <Route path="/hotel-admin/housekeeping/schedule" element={<HousekeepingMySchedulePage />} />
          <Route path="/hotel-admin/housekeeping/notifications" element={<HousekeepingNotificationsPage />} />
          <Route path="/hotel-admin/housekeeping/overview" element={<HousekeepingOverviewPage />} />
          <Route path="/hotel-admin/housekeeping" element={<HousekeepingOverviewPage />} />
          <Route path="/hotel-admin/housekeeping/*" element={<HousekeepingOverviewPage />} />

          {/* Admin Aliases for Housekeeping */}
          <Route path="/admin/housekeeping/assignments/create" element={<AssignChamberTurnoverPage />} />
          <Route path="/admin/housekeeping/assignments/assign" element={<AssignChamberTurnoverPage />} />
          <Route path="/admin/housekeeping/schedule" element={<ScheduleTurnoverPage />} />
          <Route path="/admin/housekeeping/cleaning/assigned" element={<AssignedRoomsPage />} />
          <Route path="/admin/housekeeping/cleaning/todo" element={<RoomsToCleanPage />} />
          <Route path="/admin/housekeeping/cleaning/in-progress" element={<InProgressCleaningPage />} />
          <Route path="/admin/housekeeping/cleaning/completed" element={<CompletedCleaningTasksPage />} />
          <Route path="/admin/housekeeping/cleaning/checklist" element={<CleaningChecklistPage />} />
          <Route path="/admin/housekeeping/inspection/details/:id" element={<InspectionDetailPage />} />
          <Route path="/admin/housekeeping/inspection/:id" element={<InspectionDetailPage />} />
          <Route path="/admin/housekeeping/cleaning/inspection" element={<HousekeepingInspectionPage />} />
          <Route path="/admin/housekeeping/cleaning" element={<RoomCleaningPage />} />
          <Route path="/admin/housekeeping/assignments" element={<CleaningAssignmentsPage />} />
          <Route path="/admin/housekeeping/inspection" element={<HousekeepingInspectionPage />} />
          <Route path="/admin/housekeeping/maintenance/requests" element={<MaintenanceRequestsPage />} />
          <Route path="/admin/housekeeping/maintenance/report" element={<ReportIssuePage />} />
          <Route path="/admin/housekeeping/maintenance/history" element={<MaintenanceHistoryPage />} />
          <Route path="/admin/housekeeping/maintenance" element={<HousekeepingMaintenancePage />} />
          <Route path="/admin/housekeeping/lost-found" element={<HousekeepingLostAndFoundPage />} />
          <Route path="/admin/housekeeping/schedule" element={<HousekeepingMySchedulePage />} />
          <Route path="/admin/housekeeping/notifications" element={<HousekeepingNotificationsPage />} />
          <Route path="/admin/housekeeping/overview" element={<HousekeepingOverviewPage />} />
          <Route path="/admin/housekeeping" element={<HousekeepingOverviewPage />} />
          <Route path="/admin/housekeeping/*" element={<HousekeepingOverviewPage />} />

          {/* Restaurant Submenus Dedicated Pages */}
          <Route path="/hotel-admin/restaurant" element={<RestaurantDashboardPage />} />
          <Route path="/hotel-admin/restaurant/overview" element={<RestaurantDashboardPage />} />
          <Route path="/hotel-admin/restaurant/categories" element={<MenuCategoriesPage />} />
          <Route path="/hotel-admin/restaurant/menu-items" element={<MenuItemsPage />} />
          <Route path="/hotel-admin/restaurant/menu" element={<MenuItemsPage />} />
          <Route path="/hotel-admin/restaurant/orders" element={<FoodOrdersPage />} />
          <Route path="/hotel-admin/restaurant/order" element={<NewRestaurantOrderPage />} />
          <Route path="/hotel-admin/restaurant/tables" element={<RestaurantTablesPage />} />
          <Route path="/hotel-admin/restaurant/room-service" element={<FoodOrdersPage />} />
          <Route path="/hotel-admin/restaurant/billing/create" element={<GenerateRestaurantBillPage />} />
          <Route path="/hotel-admin/restaurant/billing/generate" element={<GenerateRestaurantBillPage />} />
          <Route path="/hotel-admin/restaurant/billing/:id" element={<GenerateRestaurantBillPage />} />
          <Route path="/hotel-admin/restaurant/billing" element={<RestaurantBillingPage />} />
          <Route path="/hotel-admin/restaurant/*" element={<RestaurantDashboardPage />} />

          {/* Admin Aliases for Restaurant */}
          <Route path="/admin/restaurant" element={<RestaurantDashboardPage />} />
          <Route path="/admin/restaurant/overview" element={<RestaurantDashboardPage />} />
          <Route path="/admin/restaurant/categories" element={<MenuCategoriesPage />} />
          <Route path="/admin/restaurant/menu-items" element={<MenuItemsPage />} />
          <Route path="/admin/restaurant/menu" element={<MenuItemsPage />} />
          <Route path="/admin/restaurant/orders" element={<FoodOrdersPage />} />
          <Route path="/admin/restaurant/order" element={<NewRestaurantOrderPage />} />
          <Route path="/admin/restaurant/tables" element={<RestaurantTablesPage />} />
          <Route path="/admin/restaurant/room-service" element={<FoodOrdersPage />} />
          <Route path="/admin/restaurant/billing/create" element={<GenerateRestaurantBillPage />} />
          <Route path="/admin/restaurant/billing/generate" element={<GenerateRestaurantBillPage />} />
          <Route path="/admin/restaurant/billing/:id" element={<GenerateRestaurantBillPage />} />
          <Route path="/admin/restaurant/billing" element={<RestaurantBillingPage />} />
          <Route path="/admin/restaurant/*" element={<RestaurantDashboardPage />} />

          {/* Staff Management Submenus */}
          <Route path="/hotel-admin/staff/add" element={<AddStaffPage />} />
          <Route path="/hotel-admin/staff/departments/add" element={<AddDepartmentPage />} />
          <Route path="/hotel-admin/staff/departments/edit/:id" element={<EditDepartmentPage />} />
          <Route path="/hotel-admin/staff/departments/details/:id" element={<DepartmentDetailPage />} />
          <Route path="/hotel-admin/staff/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/hotel-admin/staff/departments" element={<DepartmentsPage />} />
          <Route path="/hotel-admin/staff/roles" element={<RolesPermissionsPage />} />
          <Route path="/hotel-admin/staff/shifts" element={<ShiftSchedulingPage />} />
          <Route path="/hotel-admin/staff/schedule" element={<ShiftSchedulingPage />} />
          <Route path="/hotel-admin/staff/shift-scheduling" element={<ShiftSchedulingPage />} />
          <Route path="/hotel-admin/staff/leave" element={<LeaveRequestsPage />} />
          <Route path="/hotel-admin/staff/leave-requests" element={<LeaveRequestsPage />} />
          <Route path="/hotel-admin/staff/attendance" element={<AttendancePage />} />
          <Route path="/hotel-admin/staff/edit/:staffId" element={<EditStaffPage />} />
          <Route path="/hotel-admin/staff/details/:staffId" element={<StaffDetailPage />} />
          <Route path="/hotel-admin/staff/:staffId" element={<StaffDetailPage />} />
          <Route path="/hotel-admin/staff" element={<StaffManagementPage />} />
          <Route path="/hotel-admin/staff/*" element={<StaffManagementPage />} />

          {/* Admin Aliases for Staff */}
          <Route path="/admin/staff/add" element={<AddStaffPage />} />
          <Route path="/admin/staff/departments/add" element={<AddDepartmentPage />} />
          <Route path="/admin/staff/departments/edit/:id" element={<EditDepartmentPage />} />
          <Route path="/admin/staff/departments/details/:id" element={<DepartmentDetailPage />} />
          <Route path="/admin/staff/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/admin/staff/departments" element={<DepartmentsPage />} />
          <Route path="/admin/staff/roles" element={<RolesPermissionsPage />} />
          <Route path="/admin/staff/shifts" element={<ShiftSchedulingPage />} />
          <Route path="/admin/staff/schedule" element={<ShiftSchedulingPage />} />
          <Route path="/admin/staff/shift-scheduling" element={<ShiftSchedulingPage />} />
          <Route path="/admin/staff/leave" element={<LeaveRequestsPage />} />
          <Route path="/admin/staff/leave-requests" element={<LeaveRequestsPage />} />
          <Route path="/admin/staff/attendance" element={<AttendancePage />} />
          <Route path="/admin/staff/edit/:staffId" element={<EditStaffPage />} />
          <Route path="/admin/staff/details/:staffId" element={<StaffDetailPage />} />
          <Route path="/admin/staff/:staffId" element={<StaffDetailPage />} />
          <Route path="/admin/staff" element={<StaffManagementPage />} />
          <Route path="/admin/staff/*" element={<StaffManagementPage />} />

          {/* Hotel Admin ERP Additions */}
          {/* Finance & General Ledger Dedicated Submenus */}
          <Route path="/hotel-admin/finance" element={<FinanceDashboardPage />} />
          <Route path="/hotel-admin/finance/overview" element={<FinanceDashboardPage />} />
          <Route path="/hotel-admin/finance/folios/create" element={<CreateFolioPage />} />
          <Route path="/hotel-admin/finance/folios/new" element={<CreateFolioPage />} />
          <Route path="/hotel-admin/finance/folio/create" element={<CreateFolioPage />} />
          <Route path="/hotel-admin/finance/folios" element={<GuestFoliosPage />} />
          <Route path="/hotel-admin/finance/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/hotel-admin/finance/invoices/new" element={<CreateInvoicePage />} />
          <Route path="/hotel-admin/finance/invoice/create" element={<CreateInvoicePage />} />
          <Route path="/hotel-admin/finance/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/hotel-admin/finance/invoices" element={<InvoicesPage />} />
          <Route path="/hotel-admin/finance/accounts" element={<ChartOfAccountsPage />} />
          <Route path="/hotel-admin/finance/coa" element={<ChartOfAccountsPage />} />
          <Route path="/hotel-admin/finance/journals/create" element={<CreateJournalEntryPage />} />
          <Route path="/hotel-admin/finance/journals/new" element={<CreateJournalEntryPage />} />
          <Route path="/hotel-admin/finance/journal/create" element={<CreateJournalEntryPage />} />
          <Route path="/hotel-admin/finance/journals" element={<JournalEntriesPage />} />
          <Route path="/hotel-admin/finance/journal" element={<JournalEntriesPage />} />
          <Route path="/hotel-admin/finance/payments/receipt/:id" element={<PaymentReceiptDetailPage />} />
          <Route path="/hotel-admin/finance/payments/:id" element={<PaymentReceiptDetailPage />} />
          <Route path="/hotel-admin/finance/payments" element={<PaymentOperationsPage />} />
          <Route path="/hotel-admin/finance/*" element={<FinanceDashboardPage />} />

          {/* Payments Dedicated Operations */}
          <Route path="/hotel-admin/payments/receipt/:id" element={<PaymentReceiptDetailPage />} />
          <Route path="/hotel-admin/payments/:id" element={<PaymentReceiptDetailPage />} />
          <Route path="/hotel-admin/payments" element={<PaymentOperationsPage />} />
          <Route path="/hotel-admin/payments/transactions" element={<PaymentOperationsPage />} />
          <Route path="/hotel-admin/payments/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/hotel-admin/payments/invoices" element={<InvoicesPage />} />
          <Route path="/hotel-admin/payments/coa" element={<ChartOfAccountsPage />} />
          <Route path="/hotel-admin/payments/journal/create" element={<CreateJournalEntryPage />} />
          <Route path="/hotel-admin/payments/journals/create" element={<CreateJournalEntryPage />} />
          <Route path="/hotel-admin/payments/journal" element={<JournalEntriesPage />} />
          <Route path="/hotel-admin/payments/journals" element={<JournalEntriesPage />} />
          <Route path="/hotel-admin/payments/folios/create" element={<CreateFolioPage />} />
          <Route path="/hotel-admin/payments/folios" element={<GuestFoliosPage />} />
          <Route path="/hotel-admin/payments/*" element={<PaymentOperationsPage />} />

          <Route path="/hotel-admin/billing" element={<FinanceDashboardPage />} />
          <Route path="/hotel-admin/billing/*" element={<FinanceDashboardPage />} />
          <Route path="/hotel-admin/invoices" element={<InvoicesPage />} />
          <Route path="/hotel-admin/invoices/*" element={<InvoicesPage />} />

          {/* Admin Aliases for Payments & Finance */}
          <Route path="/admin/finance" element={<FinanceDashboardPage />} />
          <Route path="/admin/finance/overview" element={<FinanceDashboardPage />} />
          <Route path="/admin/finance/folios/create" element={<CreateFolioPage />} />
          <Route path="/admin/finance/folios" element={<GuestFoliosPage />} />
          <Route path="/admin/finance/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/admin/finance/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/admin/finance/invoices" element={<InvoicesPage />} />
          <Route path="/admin/finance/accounts" element={<ChartOfAccountsPage />} />
          <Route path="/admin/finance/coa" element={<ChartOfAccountsPage />} />
          <Route path="/admin/finance/journals/create" element={<CreateJournalEntryPage />} />
          <Route path="/admin/finance/journals/new" element={<CreateJournalEntryPage />} />
          <Route path="/admin/finance/journal/create" element={<CreateJournalEntryPage />} />
          <Route path="/admin/finance/journals" element={<JournalEntriesPage />} />
          <Route path="/admin/finance/journal" element={<JournalEntriesPage />} />
          <Route path="/admin/finance/payments" element={<PaymentOperationsPage />} />
          <Route path="/admin/finance/*" element={<FinanceDashboardPage />} />

          <Route path="/admin/payments" element={<PaymentOperationsPage />} />
          <Route path="/admin/payments/transactions" element={<PaymentOperationsPage />} />
          <Route path="/admin/payments/invoices" element={<InvoicesPage />} />
          <Route path="/admin/payments/coa" element={<ChartOfAccountsPage />} />
          <Route path="/admin/payments/journal" element={<JournalEntriesPage />} />
          <Route path="/admin/payments/journals" element={<JournalEntriesPage />} />
          <Route path="/admin/payments/folios" element={<GuestFoliosPage />} />
          <Route path="/admin/payments/*" element={<PaymentOperationsPage />} />

          {/* Marketing & Offers Dedicated Submenus */}
          <Route path="/hotel-admin/marketing/coupons" element={<CouponsManagementPage />} />
          <Route path="/hotel-admin/marketing/packages" element={<PackagesManagementPage />} />
          <Route path="/hotel-admin/marketing/banners" element={<PromotionalBannersPage />} />
          <Route path="/hotel-admin/marketing" element={<MarketingPage />} />
          <Route path="/hotel-admin/marketing/*" element={<MarketingPage />} />
          <Route path="/admin/marketing/coupons" element={<CouponsManagementPage />} />
          <Route path="/admin/marketing/packages" element={<PackagesManagementPage />} />
          <Route path="/admin/marketing/banners" element={<PromotionalBannersPage />} />
          <Route path="/admin/marketing" element={<MarketingPage />} />
          <Route path="/admin/marketing/*" element={<MarketingPage />} />

          {/* Guest Reviews & Feedback Dedicated Submenus */}
          <Route path="/hotel-admin/reviews/ratings" element={<RatingsPage />} />
          <Route path="/hotel-admin/reviews/feedback" element={<FeedbackManagementPage />} />
          <Route path="/hotel-admin/reviews" element={<GuestReviewsPage />} />
          <Route path="/hotel-admin/reviews/*" element={<GuestReviewsPage />} />
          <Route path="/admin/reviews/ratings" element={<RatingsPage />} />
          <Route path="/admin/reviews/feedback" element={<FeedbackManagementPage />} />
          <Route path="/admin/reviews" element={<GuestReviewsPage />} />
          <Route path="/admin/reviews/*" element={<GuestReviewsPage />} />

          {/* Inventory & Stores Management Submenus */}
          <Route path="/hotel-admin/inventory/items" element={<ItemCatalogPage />} />
          <Route path="/hotel-admin/inventory/catalog" element={<ItemCatalogPage />} />
          <Route path="/hotel-admin/inventory/low-stock" element={<LowStockAlertsPage />} />
          <Route path="/hotel-admin/inventory/alerts" element={<LowStockAlertsPage />} />
          <Route path="/hotel-admin/inventory/movements" element={<StockMovementsPage />} />
          <Route path="/hotel-admin/inventory/movement" element={<StockMovementsPage />} />
          <Route path="/hotel-admin/inventory/suppliers" element={<ApprovedSuppliersPage />} />
          <Route path="/hotel-admin/inventory/add" element={<AddInventoryItemPage />} />
          <Route path="/hotel-admin/inventory/suppliers/add" element={<AddSupplierPage />} />
          <Route path="/hotel-admin/inventory" element={<InventoryDashboardPage />} />
          <Route path="/hotel-admin/inventory/*" element={<InventoryDashboardPage />} />

          {/* Admin Aliases for Inventory */}
          <Route path="/admin/inventory/items" element={<ItemCatalogPage />} />
          <Route path="/admin/inventory/catalog" element={<ItemCatalogPage />} />
          <Route path="/admin/inventory/low-stock" element={<LowStockAlertsPage />} />
          <Route path="/admin/inventory/alerts" element={<LowStockAlertsPage />} />
          <Route path="/admin/inventory/movements" element={<StockMovementsPage />} />
          <Route path="/admin/inventory/movement" element={<StockMovementsPage />} />
          <Route path="/admin/inventory/suppliers" element={<ApprovedSuppliersPage />} />
          <Route path="/admin/inventory/add" element={<AddInventoryItemPage />} />
          <Route path="/admin/inventory/suppliers/add" element={<AddSupplierPage />} />
          <Route path="/admin/inventory" element={<InventoryDashboardPage />} />
          <Route path="/admin/inventory/*" element={<InventoryDashboardPage />} />

          {/* Maintenance & Engineering Dedicated Submenus */}
          <Route path="/hotel-admin/maintenance/overview" element={<MaintenanceDashboardPage />} />
          <Route path="/hotel-admin/maintenance/tickets" element={<MaintenanceTicketsPage />} />
          <Route path="/hotel-admin/maintenance/assets" element={<AssetRegisterPage />} />
          <Route path="/hotel-admin/maintenance/register" element={<AssetRegisterPage />} />
          <Route path="/hotel-admin/maintenance" element={<MaintenanceDashboardPage />} />
          <Route path="/hotel-admin/maintenance/*" element={<MaintenanceDashboardPage />} />

          {/* Admin Aliases for Maintenance */}
          <Route path="/admin/maintenance/overview" element={<MaintenanceDashboardPage />} />
          <Route path="/admin/maintenance/tickets" element={<MaintenanceTicketsPage />} />
          <Route path="/admin/maintenance/assets" element={<AssetRegisterPage />} />
          <Route path="/admin/maintenance/register" element={<AssetRegisterPage />} />
          <Route path="/admin/maintenance" element={<MaintenanceDashboardPage />} />
          <Route path="/admin/maintenance/*" element={<MaintenanceDashboardPage />} />

          {/* Payroll Dedicated Submenus */}
          <Route path="/hotel-admin/payroll/payslips" element={<EmployeePayslipsPage />} />
          <Route path="/hotel-admin/payroll/runs" element={<PayrollRunsPage />} />
          <Route path="/hotel-admin/payroll" element={<PayrollRunsPage />} />
          <Route path="/hotel-admin/payroll/*" element={<PayrollRunsPage />} />
          <Route path="/admin/payroll/payslips" element={<EmployeePayslipsPage />} />
          <Route path="/admin/payroll/runs" element={<PayrollRunsPage />} />
          <Route path="/admin/payroll" element={<PayrollRunsPage />} />
          <Route path="/admin/payroll/*" element={<PayrollRunsPage />} />

          {/* Reports Submenus - Dedicated 7 Pages */}
          <Route path="/hotel-admin/reports/revenue" element={<RevenueReportsPage />} />
          <Route path="/hotel-admin/reports/occupancy" element={<OccupancyReportsPage />} />
          <Route path="/hotel-admin/reports/bookings" element={<BookingReportsPage />} />
          <Route path="/hotel-admin/reports/cancellations" element={<CancellationReportsPage />} />
          <Route path="/hotel-admin/reports/guests" element={<GuestReportsPage />} />
          <Route path="/hotel-admin/reports/staff" element={<StaffReportsPage />} />
          <Route path="/hotel-admin/reports/export" element={<ExportReportsPage />} />
          <Route path="/hotel-admin/reports" element={<RevenueReportsPage />} />
          <Route path="/hotel-admin/reports/*" element={<RevenueReportsPage />} />
          <Route path="/admin/reports/revenue" element={<RevenueReportsPage />} />
          <Route path="/admin/reports/occupancy" element={<OccupancyReportsPage />} />
          <Route path="/admin/reports/bookings" element={<BookingReportsPage />} />
          <Route path="/admin/reports/cancellations" element={<CancellationReportsPage />} />
          <Route path="/admin/reports/guests" element={<GuestReportsPage />} />
          <Route path="/admin/reports/staff" element={<StaffReportsPage />} />
          <Route path="/admin/reports/export" element={<ExportReportsPage />} />
          <Route path="/admin/reports" element={<RevenueReportsPage />} />
          <Route path="/admin/reports/*" element={<RevenueReportsPage />} />

          {/* Hotel Settings Submenus - Dedicated 8 Pages */}
          <Route path="/hotel-admin/settings/profile" element={<HotelProfilePage />} />
          <Route path="/hotel-admin/settings/info" element={<HotelInformationPage />} />
          <Route path="/hotel-admin/settings/information" element={<HotelInformationPage />} />
          <Route path="/hotel-admin/settings/branding" element={<LogoBrandingPage />} />
          <Route path="/hotel-admin/settings/rules" element={<CheckInRulesPage />} />
          <Route path="/hotel-admin/settings/check-in-rules" element={<CheckInRulesPage />} />
          <Route path="/hotel-admin/settings/cancellation" element={<CancellationPolicyPage />} />
          <Route path="/hotel-admin/settings/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/hotel-admin/settings/taxes" element={<TaxesChargesPage />} />
          <Route path="/hotel-admin/settings/notifications" element={<NotificationPreferencesPage />} />
          <Route path="/hotel-admin/settings/payments" element={<PaymentPreferencesPage />} />
          <Route path="/hotel-admin/settings" element={<HotelProfilePage />} />
          <Route path="/hotel-admin/settings/*" element={<HotelProfilePage />} />

          {/* Admin Aliases for Settings */}
          <Route path="/admin/settings/profile" element={<HotelProfilePage />} />
          <Route path="/admin/settings/info" element={<HotelInformationPage />} />
          <Route path="/admin/settings/information" element={<HotelInformationPage />} />
          <Route path="/admin/settings/branding" element={<LogoBrandingPage />} />
          <Route path="/admin/settings/rules" element={<CheckInRulesPage />} />
          <Route path="/admin/settings/check-in-rules" element={<CheckInRulesPage />} />
          <Route path="/admin/settings/cancellation" element={<CancellationPolicyPage />} />
          <Route path="/admin/settings/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/admin/settings/taxes" element={<TaxesChargesPage />} />
          <Route path="/admin/settings/notifications" element={<NotificationPreferencesPage />} />
          <Route path="/admin/settings/payments" element={<PaymentPreferencesPage />} />
          <Route path="/admin/settings" element={<HotelProfilePage />} />
          <Route path="/admin/settings/*" element={<HotelProfilePage />} />

          <Route path="/hotel-admin/system-preferences" element={<HotelSystemPreferencesPage />} />
          <Route path="/hotel-admin/preferences" element={<HotelSystemPreferencesPage />} />
          <Route path="/hotel-admin/system/security" element={<SecuritySettingsPage />} />
          <Route path="/hotel-admin/system" element={<HotelSystemPreferencesPage />} />
          <Route path="/hotel-admin/system/*" element={<HotelSystemPreferencesPage />} />
          <Route path="/hotel-admin/security" element={<SecuritySettingsPage />} />
          <Route path="/hotel-admin/security/*" element={<SecuritySettingsPage />} />
          <Route path="/hotel-admin/profile" element={<AdminProfilePage />} />
          <Route path="/hotel-admin/profile/*" element={<AdminProfilePage />} />
          <Route path="/admin/system-preferences" element={<HotelSystemPreferencesPage />} />
          <Route path="/admin/preferences" element={<HotelSystemPreferencesPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/profile/*" element={<AdminProfilePage />} />

          {/* --- 3. RECEPTIONIST PANEL ROUTES --- */}
          <Route path="/receptionist/dashboard/front-desk" element={<FrontDeskOverviewPage />} />
          <Route path="/receptionist/dashboard/arrivals" element={<TodaysArrivalsPage />} />
          <Route path="/receptionist/dashboard/departures" element={<TodaysDeparturesPage />} />
          <Route path="/receptionist/dashboard/available-rooms" element={<AvailableRoomsPage />} />
          <Route path="/receptionist/dashboard/available" element={<AvailableRoomsPage />} />
          <Route path="/receptionist/dashboard" element={<FrontDeskOverviewPage />} />
          <Route path="/receptionist/dashboard/*" element={<FrontDeskOverviewPage />} />

          <Route path="/receptionist/reservations/new" element={<AdvanceNewBookingPage />} />
          <Route path="/receptionist/reservations/walk-in" element={<WalkInBookingPage />} />
          <Route path="/receptionist/reservations/calendar" element={<BookingCalendarPage />} />
          <Route path="/receptionist/reservations/cancellations" element={<CancelledBookingsPage />} />
          <Route path="/receptionist/reservations/search" element={<BookingSearchPage />} />
          <Route path="/receptionist/reservations/modifications" element={<BookingModificationsPage />} />
          <Route path="/receptionist/reservations" element={<BookingsManagementPage />} />
          <Route path="/receptionist/reservations/*" element={<BookingsManagementPage />} />

          <Route path="/receptionist/guest-services/registration" element={<GuestRegistrationPage />} />
          <Route path="/receptionist/guest-services/directory" element={<GuestDirectoryPage />} />
          <Route path="/receptionist/guest-services/history" element={<GuestHistoryPage />} />
          <Route path="/receptionist/guest-services/requests" element={<GuestServicesRequestsPage />} />
          <Route path="/receptionist/guest-services" element={<GuestDirectoryPage />} />
          <Route path="/receptionist/guest-services/*" element={<GuestDirectoryPage />} />

          <Route path="/receptionist/room-operations/allocation" element={<RoomAllocationPage />} />
          <Route path="/receptionist/room-operations/transfers" element={<RoomTransfersPage />} />
          <Route path="/receptionist/room-operations/check-in" element={<RoomOperationsCheckInPage />} />
          <Route path="/receptionist/room-operations/check-out" element={<RoomOperationsCheckOutPage />} />
          <Route path="/receptionist/room-operations/timing" element={<EarlyLateCheckOutPage />} />
          <Route path="/receptionist/room-operations" element={<RoomOperationsAvailabilityPage />} />
          <Route path="/receptionist/room-operations/*" element={<RoomOperationsAvailabilityPage />} />

          <Route path="/receptionist/payments/collect" element={<CollectPaymentPage />} />
          <Route path="/receptionist/payments/history" element={<PaymentHistoryPage />} />
          <Route path="/receptionist/payments/invoice" element={<InvoicesPage />} />
          <Route path="/receptionist/payments/receipt" element={<PrintReceiptPage />} />
          <Route path="/receptionist/payments/pending" element={<PendingPaymentsPage />} />
          <Route path="/receptionist/payments" element={<CollectPaymentPage />} />
          <Route path="/receptionist/payments/*" element={<CollectPaymentPage />} />

          <Route path="/receptionist/settings" element={<ReceptionistSystemPreferencesPage />} />
          <Route path="/receptionist/settings/*" element={<ReceptionistSystemPreferencesPage />} />
          <Route path="/receptionist/preferences" element={<ReceptionistSystemPreferencesPage />} />
          <Route path="/receptionist/system/security" element={<SecuritySettingsPage />} />
          <Route path="/receptionist/system" element={<ReceptionistSystemPreferencesPage />} />
          <Route path="/receptionist/system/*" element={<ReceptionistSystemPreferencesPage />} />
          <Route path="/receptionist/security" element={<SecuritySettingsPage />} />
          <Route path="/receptionist/security/*" element={<SecuritySettingsPage />} />
          <Route path="/receptionist/profile" element={<ReceptionistProfilePage />} />
          <Route path="/receptionist/profile/*" element={<ReceptionistProfilePage />} />
          <Route path="/receptionist/reports" element={<ReportsPage />} />
          <Route path="/receptionist/reports/*" element={<ReportsPage />} />
          <Route path="/receptionist/*" element={<ReceptionistDashboard />} />

          {/* --- 4. CUSTOMER PANEL ROUTES --- */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/dashboard/*" element={<CustomerDashboard />} />
          <Route path="/customer/book" element={<CustomerBrowseRoomsPage />} />
          <Route path="/customer/rooms" element={<CustomerBrowseRoomsPage />} />
          <Route path="/customer/rooms/available" element={<CustomerBrowseRoomsPage />} />
          <Route path="/customer/discover/rooms" element={<CustomerBrowseRoomsPage />} />
          <Route path="/customer/discover/*" element={<CustomerBrowseRoomsPage />} />
          <Route path="/customer/rooms/:roomId" element={<RoomDetailsPage />} />
          <Route path="/customer/checkout" element={<BookingCheckoutPage />} />
          <Route path="/customer/confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/customer/upcoming-reservations" element={<UpcomingReservationsPage />} />
          <Route path="/customer/bookings/upcoming" element={<UpcomingReservationsPage />} />
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
          <Route path="/customer/preferences" element={<CustomerSystemPreferencesPage />} />
          <Route path="/customer/settings" element={<CustomerSystemPreferencesPage />} />
          <Route path="/customer/settings/*" element={<CustomerSystemPreferencesPage />} />
          <Route path="/customer/system" element={<CustomerSystemPreferencesPage />} />
          <Route path="/customer/system/*" element={<CustomerSystemPreferencesPage />} />
          <Route path="/customer/security" element={<CustomerSecurityPage />} />
          <Route path="/customer/security/*" element={<CustomerSecurityPage />} />
          <Route path="/customer/feedback" element={<GuestFeedbackPage />} />
          <Route path="/customer/feedback/*" element={<GuestFeedbackPage />} />
          <Route path="/customer/*" element={<CustomerDashboard />} />

          {/* --- 5. HOUSEKEEPING PANEL ROUTES --- */}
          {/* Dashboard Submenu */}
          <Route path="/housekeeping/dashboard/today" element={<HousekeepingTodayTasksPage />} />
          <Route path="/housekeeping/dashboard/pending" element={<HousekeepingPendingTasksPage />} />
          <Route path="/housekeeping/dashboard" element={<HousekeepingOverviewPage />} />
          <Route path="/housekeeping/dashboard/*" element={<HousekeepingOverviewPage />} />

          {/* Cleaning Submenu Dedicated Individual Pages */}
          <Route path="/housekeeping/cleaning/assigned" element={<AssignedRoomsPage />} />
          <Route path="/housekeeping/cleaning/todo" element={<RoomsToCleanPage />} />
          <Route path="/housekeeping/cleaning/in-progress" element={<InProgressCleaningPage />} />
          <Route path="/housekeeping/cleaning/completed" element={<CompletedCleaningTasksPage />} />
          <Route path="/housekeeping/cleaning/checklist" element={<CleaningChecklistPage />} />
          <Route path="/housekeeping/cleaning/inspection" element={<HousekeepingInspectionPage />} />
          <Route path="/housekeeping/cleaning" element={<AssignedRoomsPage />} />
          <Route path="/housekeeping/cleaning/*" element={<AssignedRoomsPage />} />

          {/* Maintenance Submenu Dedicated Individual Pages */}
          <Route path="/housekeeping/maintenance/requests" element={<MaintenanceRequestsPage />} />
          <Route path="/housekeeping/maintenance/report" element={<ReportIssuePage />} />
          <Route path="/housekeeping/maintenance/history" element={<MaintenanceHistoryPage />} />
          <Route path="/housekeeping/maintenance" element={<MaintenanceRequestsPage />} />
          <Route path="/housekeeping/maintenance/*" element={<MaintenanceRequestsPage />} />

          {/* Services & Schedule Submenu Dedicated Individual Pages */}
          <Route path="/housekeeping/services/lost-found" element={<HousekeepingLostAndFoundPage />} />
          <Route path="/housekeeping/services/schedule" element={<HousekeepingMySchedulePage />} />
          <Route path="/housekeeping/services/notifications" element={<HousekeepingNotificationsPage />} />
          <Route path="/housekeeping/services" element={<HousekeepingLostAndFoundPage />} />
          <Route path="/housekeeping/services/*" element={<HousekeepingLostAndFoundPage />} />

          {/* System & Settings */}
          <Route path="/housekeeping/profile" element={<HousekeepingProfilePage />} />
          <Route path="/housekeeping/profile/*" element={<HousekeepingProfilePage />} />
          <Route path="/housekeeping/preferences" element={<HousekeepingSystemPreferencesPage />} />
          <Route path="/housekeeping/settings" element={<HousekeepingSystemPreferencesPage />} />
          <Route path="/housekeeping/settings/*" element={<HousekeepingSystemPreferencesPage />} />
          <Route path="/housekeeping/system/security" element={<SecuritySettingsPage />} />
          <Route path="/housekeeping/system" element={<HousekeepingSystemPreferencesPage />} />
          <Route path="/housekeeping/system/*" element={<HousekeepingSystemPreferencesPage />} />
          <Route path="/housekeeping/security" element={<SecuritySettingsPage />} />
          <Route path="/housekeeping/security/*" element={<SecuritySettingsPage />} />
          <Route path="/housekeeping/reports" element={<ReportsPage />} />
          <Route path="/housekeeping/reports/*" element={<ReportsPage />} />
          <Route path="/housekeeping/*" element={<HousekeepingOverviewPage />} />
















































































          {/* --- 6. STAFF PANEL ROUTES --- */}
          {/* Dashboard Submenu Dedicated Pages */}
          <Route path="/staff/today-overview" element={<StaffTodayOverviewPage />} />
          <Route path="/staff/dashboard/today" element={<StaffTodayOverviewPage />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/dashboard/*" element={<StaffDashboard />} />

          {/* My Work Submenu Dedicated Pages */}
          <Route path="/staff/work/details" element={<StaffTaskDetailsPage />} />
          <Route path="/staff/work/history" element={<StaffTaskHistoryPage />} />
          <Route path="/staff/work" element={<StaffAssignedTasksPage />} />
          <Route path="/staff/work/*" element={<StaffAssignedTasksPage />} />

          {/* Attendance Submenu Dedicated Pages */}
          <Route path="/staff/attendance/check-in" element={<StaffCheckInCheckOutPage />} />
          <Route path="/staff/attendance/clock" element={<StaffCheckInCheckOutPage />} />
          <Route path="/staff/attendance/history" element={<StaffAttendanceHistoryPage />} />
          <Route path="/staff/attendance" element={<StaffAttendancePage />} />
          <Route path="/staff/attendance/*" element={<StaffAttendancePage />} />

          {/* Schedule & Shifts Submenu Dedicated Pages */}
          <Route path="/staff/schedule/weekly" element={<StaffWeeklySchedulePage />} />
          <Route path="/staff/schedule/leave-requests" element={<StaffLeaveRequestsPage />} />
          <Route path="/staff/schedule/leave" element={<StaffLeaveRequestsPage />} />
          <Route path="/staff/schedule/apply-leave" element={<StaffApplyLeavePage />} />
          <Route path="/staff/schedule/apply" element={<StaffApplyLeavePage />} />
          <Route path="/staff/schedule" element={<StaffSchedulePage />} />
          <Route path="/staff/schedule/*" element={<StaffSchedulePage />} />

          {/* Communication Submenu Dedicated Pages */}
          <Route path="/staff/communication/announcements" element={<StaffAnnouncementsPage />} />
          <Route path="/staff/communication/notifications" element={<StaffNotificationsPage />} />
          <Route path="/staff/communication/messages" element={<StaffMessagesPage />} />
          <Route path="/staff/communication" element={<StaffAnnouncementsPage />} />
          <Route path="/staff/communication/*" element={<StaffAnnouncementsPage />} />
          <Route path="/staff/profile" element={<StaffProfilePage />} />
          <Route path="/staff/profile/*" element={<StaffProfilePage />} />
          <Route path="/staff/preferences" element={<StaffSystemPreferencesPage />} />
          <Route path="/staff/settings" element={<StaffSystemPreferencesPage />} />
          <Route path="/staff/settings/*" element={<StaffSystemPreferencesPage />} />
          <Route path="/staff/system/security" element={<SecuritySettingsPage />} />
          <Route path="/staff/system" element={<StaffSystemPreferencesPage />} />
          <Route path="/staff/system/*" element={<StaffSystemPreferencesPage />} />
          <Route path="/staff/security" element={<SecuritySettingsPage />} />
          <Route path="/staff/security/*" element={<SecuritySettingsPage />} />
          <Route path="/staff/reports" element={<ReportsPage />} />
          <Route path="/staff/reports/*" element={<ReportsPage />} />
          <Route path="/staff/*" element={<StaffDashboard />} />
        </Route>

        {/* Special Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
