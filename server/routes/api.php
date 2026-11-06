<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HotelErpController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Hotel ERP API Routes
|--------------------------------------------------------------------------
|
| Connected React Frontend to Laravel REST API endpoints.
| All responses formatted as JSON with CORS enabled.
|
*/

// Authentication Routes (Signup, Login, Current User)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/signup', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/me', [AuthController::class, 'me']);

// Diagnostic & Health
Route::get('/health', [HotelErpController::class, 'health']);
Route::get('/diag/db-test', [HotelErpController::class, 'diagDbTest']);

// Users / Super Admin User Management
Route::get('/users', [HotelErpController::class, 'getUsers']);
Route::post('/users', [HotelErpController::class, 'createUser']);
Route::put('/users/{id}', [HotelErpController::class, 'updateUser']);
Route::delete('/users/{id}', [HotelErpController::class, 'deleteUser']);

// Currencies
Route::get('/currencies', [HotelErpController::class, 'getCurrencies']);
Route::post('/currencies', [HotelErpController::class, 'createCurrency']);
Route::put('/currencies/{id}', [HotelErpController::class, 'updateCurrency']);
Route::delete('/currencies/{id}', [HotelErpController::class, 'deleteCurrency']);

// Hotels & Properties
Route::get('/hotels', [HotelErpController::class, 'getHotels']);
Route::post('/hotels', [HotelErpController::class, 'createHotel']);
Route::put('/hotels/{id}', [HotelErpController::class, 'updateHotel']);
Route::delete('/hotels/{id}', [HotelErpController::class, 'deleteHotel']);

// Rooms
Route::get('/rooms', [HotelErpController::class, 'getRooms']);
Route::post('/rooms', [HotelErpController::class, 'createRoom']);
Route::put('/rooms/{id}', [HotelErpController::class, 'updateRoom']);
Route::delete('/rooms/{id}', [HotelErpController::class, 'deleteRoom']);

// Bookings
Route::get('/bookings', [HotelErpController::class, 'getBookings']);
Route::post('/bookings', [HotelErpController::class, 'createBooking']);
Route::put('/bookings/{id}', [HotelErpController::class, 'updateBooking']);
Route::delete('/bookings/{id}', [HotelErpController::class, 'deleteBooking']);

// Guests
Route::get('/guests', [HotelErpController::class, 'getGuests']);
Route::post('/guests', [HotelErpController::class, 'createGuest']);
Route::put('/guests/{id}', [HotelErpController::class, 'updateGuest']);
Route::delete('/guests/{id}', [HotelErpController::class, 'deleteGuest']);

// Payments & Invoices
Route::get('/payments', [HotelErpController::class, 'getPayments']);
Route::post('/payments', [HotelErpController::class, 'createPayment']);
Route::get('/invoices', [HotelErpController::class, 'getInvoices']);
Route::post('/invoices', [HotelErpController::class, 'createInvoice']);

// Housekeeping
Route::get('/housekeeping/tasks', [HotelErpController::class, 'getHousekeepingTasks']);
Route::post('/housekeeping/tasks', [HotelErpController::class, 'createHousekeepingTask']);
Route::put('/housekeeping/tasks/{id}', [HotelErpController::class, 'updateHousekeepingTask']);

// Maintenance Tickets
Route::get('/maintenance/tickets', [HotelErpController::class, 'getMaintenanceTickets']);
Route::post('/maintenance/tickets', [HotelErpController::class, 'createMaintenanceTicket']);
Route::put('/maintenance/tickets/{id}', [HotelErpController::class, 'updateMaintenanceTicket']);

// Staff
Route::get('/staff', [HotelErpController::class, 'getStaff']);
Route::post('/staff', [HotelErpController::class, 'createStaff']);
Route::put('/staff/{id}', [HotelErpController::class, 'updateStaff']);
Route::delete('/staff/{id}', [HotelErpController::class, 'deleteStaff']);

// Folios
Route::get('/folios', [HotelErpController::class, 'getFolios']);
Route::post('/folios', [HotelErpController::class, 'createFolio']);
Route::put('/folios/{id}', [HotelErpController::class, 'updateFolio']);

// Inventory
Route::get('/inventory', [HotelErpController::class, 'getInventory']);
Route::post('/inventory', [HotelErpController::class, 'createInventory']);
Route::put('/inventory/{id}', [HotelErpController::class, 'updateInventory']);

// Initial Database Seeding / Sync Endpoint
Route::post('/sync-seed', [HotelErpController::class, 'seedInitialData']);

// =========================================================================
// SUPER ADMIN BACKEND REST API ROUTES
// =========================================================================

// Super Admin Dashboard & System Analytics
Route::get('/super-admin/dashboard-stats', [HotelErpController::class, 'getSuperAdminDashboardStats']);

// Subscriptions & Plans
Route::get('/super-admin/subscription-plans', [HotelErpController::class, 'getSubscriptionPlans']);
Route::post('/super-admin/subscription-plans', [HotelErpController::class, 'createSubscriptionPlan']);
Route::put('/super-admin/subscription-plans/{id}', [HotelErpController::class, 'updateSubscriptionPlan']);
Route::delete('/super-admin/subscription-plans/{id}', [HotelErpController::class, 'deleteSubscriptionPlan']);

Route::get('/super-admin/subscriptions', [HotelErpController::class, 'getSubscriptions']);
Route::post('/super-admin/subscriptions', [HotelErpController::class, 'createSubscription']);
Route::put('/super-admin/subscriptions/{id}', [HotelErpController::class, 'updateSubscription']);

Route::get('/super-admin/plan-features', [HotelErpController::class, 'getPlanFeatures']);
Route::post('/super-admin/plan-features', [HotelErpController::class, 'createPlanFeature']);

// Refunds
Route::get('/super-admin/refund-requests', [HotelErpController::class, 'getRefundRequests']);
Route::post('/super-admin/refund-requests', [HotelErpController::class, 'createRefundRequest']);
Route::put('/super-admin/refund-requests/{id}', [HotelErpController::class, 'updateRefundRequest']);

// Announcements
Route::get('/super-admin/announcements', [HotelErpController::class, 'getAnnouncements']);
Route::post('/super-admin/announcements', [HotelErpController::class, 'createAnnouncement']);
Route::delete('/super-admin/announcements/{id}', [HotelErpController::class, 'deleteAnnouncement']);

// Support Tickets, Complaints & Contact Requests
Route::get('/super-admin/support-tickets', [HotelErpController::class, 'getSupportTickets']);
Route::post('/super-admin/support-tickets', [HotelErpController::class, 'createSupportTicket']);
Route::put('/super-admin/support-tickets/{id}', [HotelErpController::class, 'updateSupportTicket']);

Route::get('/super-admin/complaints', [HotelErpController::class, 'getComplaints']);
Route::post('/super-admin/complaints', [HotelErpController::class, 'createComplaint']);
Route::put('/super-admin/complaints/{id}', [HotelErpController::class, 'updateComplaint']);

Route::get('/super-admin/contact-requests', [HotelErpController::class, 'getContactRequests']);
Route::post('/super-admin/contact-requests', [HotelErpController::class, 'createContactRequest']);
Route::put('/super-admin/contact-requests/{id}', [HotelErpController::class, 'updateContactRequest']);

// Audit Logs & Platform Settings
Route::get('/super-admin/audit-logs', [HotelErpController::class, 'getAuditLogs']);
Route::post('/super-admin/audit-logs', [HotelErpController::class, 'createAuditLog']);

Route::get('/super-admin/platform-settings', [HotelErpController::class, 'getPlatformSettings']);
Route::post('/super-admin/platform-settings', [HotelErpController::class, 'savePlatformSettings']);

// Specific Hotel Management Endpoints
Route::get('/super-admin/hotels/details/{id?}', [HotelErpController::class, 'getHotelDetails']);
Route::get('/super-admin/hotels/approvals', [HotelErpController::class, 'getHotelApprovals']);
Route::get('/super-admin/hotels/status', [HotelErpController::class, 'getHotelStatuses']);

