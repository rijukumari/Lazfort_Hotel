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
