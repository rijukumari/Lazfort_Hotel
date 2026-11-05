<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Staff;
use App\Models\HousekeepingTask;
use App\Models\MaintenanceTicket;
use App\Models\GuestFolio;
use App\Models\InventoryItem;
use App\Models\RoomCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HotelErpController extends Controller
{
    // Health check
    public function health()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Hotel ERP Laravel REST API is online',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    // ----------------------------------------------------
    // HOTEL / PROPERTY OPERATIONS
    // ----------------------------------------------------
    public function getHotels()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('hotels')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $hotels = Hotel::orderBy('created_at', 'desc')->get();
            return response()->json($hotels);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getHotels error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createHotel(Request $request)
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('hotels')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }

            $validated = $request->validate([
                'name' => 'required|string',
                'location' => 'nullable|string',
                'total_rooms' => 'nullable|numeric',
                'subscription_plan' => 'nullable|string',
                'brand' => 'nullable|string',
                'address' => 'nullable|string',
                'city' => 'nullable|string',
                'country' => 'nullable|string',
                'phone' => 'nullable|string',
                'email' => 'nullable|string',
                'rating' => 'nullable|string',
                'status' => 'nullable|string',
                'image' => 'nullable|string',
                'amenities' => 'nullable|array',
            ]);

            $id = $request->input('id') ?: 'hotel-' . Str::slug($validated['name']) . '-' . rand(100, 999);
            $totalRooms = $request->input('total_rooms') ?? $request->input('totalRooms') ?? 0;
            $subscriptionPlan = $request->input('subscription_plan') ?? $request->input('subscriptionPlan') ?? 'Palace Enterprise';

            $hotel = Hotel::updateOrCreate(
                ['id' => $id],
                [
                    'id' => $id,
                    'name' => $validated['name'],
                    'brand' => $request->input('brand') ?: 'Lazfort Sovereign Portfolio',
                    'location' => $validated['location'] ?? $request->input('address') ?? 'Global Luxury Destination',
                    'address' => $request->input('address') ?: ($validated['location'] ?? null),
                    'city' => $request->input('city') ?: null,
                    'country' => $request->input('country') ?: null,
                    'phone' => $request->input('phone') ?: ($request->input('adminContact') ?: '+1 (800) 555-0199'),
                    'email' => $request->input('email') ?: ($request->input('adminEmail') ?: 'contact@lazfort.com'),
                    'rating' => $request->input('rating') ?: '5 Star Ultra-Luxury',
                    'status' => $request->input('status') ?: 'active',
                    'image' => $request->input('image') ?: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                    'total_rooms' => (int)$totalRooms,
                    'subscription_plan' => $subscriptionPlan,
                    'amenities' => $request->input('amenities') ?: ['Private Helipad', 'Michelin Gastronomy', 'Sovereign Spa', 'Royal Butler Fleet'],
                ]
            );

            return response()->json($hotel, 201);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('createHotel error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateHotel(Request $request, $id)
    {
        try {
            $hotel = Hotel::findOrFail($id);
            $hotel->update($request->all());
            return response()->json($hotel);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function deleteHotel($id)
    {
        try {
            $hotel = Hotel::findOrFail($id);
            $hotel->delete();
            return response()->json(['message' => 'Property deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ----------------------------------------------------
    // ROOM OPERATIONS
    // ----------------------------------------------------
    public function getRooms()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('rooms')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $rooms = Room::all();
            return response()->json($rooms);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getRooms error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createRoom(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'floor' => 'nullable|string',
            'status' => 'nullable|string',
            'capacity' => 'nullable|integer',
            'bed_type' => 'nullable|string',
            'view' => 'nullable|string',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $id = $request->input('id') ?: 'rm-' . Str::slug($validated['room_number']);
        $room = Room::updateOrCreate(
            ['id' => $id],
            array_merge($validated, ['id' => $id])
        );

        return response()->json($room, 201);
    }

    public function updateRoom(Request $request, $id)
    {
        $room = Room::findOrFail($id);
        $room->update($request->all());
        return response()->json($room);
    }

    public function deleteRoom($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
        return response()->json(['message' => 'Room deleted successfully']);
    }

    // ----------------------------------------------------
    // BOOKING OPERATIONS
    // ----------------------------------------------------
    public function getBookings()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('bookings')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $bookings = Booking::orderBy('created_at', 'desc')->get();
            return response()->json($bookings);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getBookings error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createBooking(Request $request)
    {
        $validated = $request->validate([
            'guest_name' => 'required|string',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date',
            'room_number' => 'nullable|string',
            'room_type' => 'nullable|string',
            'total_amount' => 'nullable|numeric',
            'paid_amount' => 'nullable|numeric',
            'status' => 'nullable|string',
            'guest_email' => 'nullable|email',
            'guest_phone' => 'nullable|string',
            'special_requests' => 'nullable|string',
            'booking_source' => 'nullable|string',
        ]);

        $id = $request->input('id') ?: 'bk-' . strtoupper(Str::random(6));
        $bookingCode = $request->input('booking_code') ?: 'AUR-' . rand(1000, 9999);

        $booking = Booking::create(array_merge($request->all(), [
            'id' => $id,
            'booking_code' => $bookingCode,
        ]));

        // If walk-in or immediate check-in, update room status
        if ($booking->room_number && in_array($booking->status, ['checked_in', 'occupied'])) {
            Room::where('room_number', $booking->room_number)->update(['status' => 'occupied']);
        }

        return response()->json($booking, 201);
    }

    public function updateBooking(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update($request->all());

        if ($request->has('status') && $booking->room_number) {
            if ($request->input('status') === 'checked_out') {
                Room::where('room_number', $booking->room_number)->update(['status' => 'cleaning']);
            } elseif ($request->input('status') === 'checked_in') {
                Room::where('room_number', $booking->room_number)->update(['status' => 'occupied']);
            }
        }

        return response()->json($booking);
    }

    public function deleteBooking($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully']);
    }

    // ----------------------------------------------------
    // GUEST OPERATIONS
    // ----------------------------------------------------
    public function getGuests()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('guests')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $guests = Guest::all();
            return response()->json($guests);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getGuests error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createGuest(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        $id = $request->input('id') ?: 'gst-' . Str::slug($validated['name']) . '-' . rand(100, 999);
        $guest = Guest::updateOrCreate(
            ['id' => $id],
            array_merge($request->all(), ['id' => $id])
        );

        return response()->json($guest, 201);
    }

    public function updateGuest(Request $request, $id)
    {
        $guest = Guest::findOrFail($id);
        $guest->update($request->all());
        return response()->json($guest);
    }

    public function deleteGuest($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();
        return response()->json(['message' => 'Guest deleted successfully']);
    }

    // ----------------------------------------------------
    // PAYMENTS & INVOICES OPERATIONS
    // ----------------------------------------------------
    public function getPayments()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('payments')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $payments = Payment::orderBy('created_at', 'desc')->get();
            return response()->json($payments);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getPayments error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createPayment(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'guest_name' => 'required|string',
            'payment_method' => 'nullable|string',
        ]);

        $id = $request->input('id') ?: 'pay-' . strtoupper(Str::random(6));
        $ref = $request->input('transaction_ref') ?: 'TX-INV-' . rand(10000, 99999);

        $payment = Payment::create(array_merge($request->all(), [
            'id' => $id,
            'transaction_ref' => $ref,
            'payment_date' => $request->input('payment_date') ?: now()->toDateString(),
        ]));

        return response()->json($payment, 201);
    }

    public function getInvoices()
    {
        $invoices = Invoice::orderBy('created_at', 'desc')->get();
        return response()->json($invoices);
    }

    public function createInvoice(Request $request)
    {
        $id = $request->input('id') ?: 'inv-' . strtoupper(Str::random(6));
        $num = $request->input('invoice_number') ?: 'INV-' . rand(1000, 9999);

        $invoice = Invoice::create(array_merge($request->all(), [
            'id' => $id,
            'invoice_number' => $num,
            'issue_date' => $request->input('issue_date') ?: now()->toDateString(),
        ]));

        return response()->json($invoice, 201);
    }

    // ----------------------------------------------------
    // HOUSEKEEPING & MAINTENANCE OPERATIONS
    // ----------------------------------------------------
    public function getHousekeepingTasks()
    {
        $tasks = HousekeepingTask::all();
        return response()->json($tasks);
    }

    public function createHousekeepingTask(Request $request)
    {
        $id = $request->input('id') ?: 'hk-' . strtoupper(Str::random(6));
        $task = HousekeepingTask::create(array_merge($request->all(), ['id' => $id]));
        return response()->json($task, 201);
    }

    public function updateHousekeepingTask(Request $request, $id)
    {
        $task = HousekeepingTask::findOrFail($id);
        $task->update($request->all());
        return response()->json($task);
    }

    public function getMaintenanceTickets()
    {
        $tickets = MaintenanceTicket::all();
        return response()->json($tickets);
    }

    public function createMaintenanceTicket(Request $request)
    {
        $id = $request->input('id') ?: 'tkt-' . strtoupper(Str::random(6));
        $ticket = MaintenanceTicket::create(array_merge($request->all(), ['id' => $id]));
        return response()->json($ticket, 201);
    }

    public function updateMaintenanceTicket(Request $request, $id)
    {
        $ticket = MaintenanceTicket::findOrFail($id);
        $ticket->update($request->all());
        return response()->json($ticket);
    }

    // ----------------------------------------------------
    // STAFF OPERATIONS
    // ----------------------------------------------------
    public function getStaff()
    {
        $staff = Staff::all();
        return response()->json($staff);
    }

    public function createStaff(Request $request)
    {
        $id = $request->input('id') ?: 'stf-' . strtoupper(Str::random(6));
        $staff = Staff::create(array_merge($request->all(), ['id' => $id]));
        return response()->json($staff, 201);
    }

    public function updateStaff(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);
        $staff->update($request->all());
        return response()->json($staff);
    }

    public function deleteStaff($id)
    {
        $staff = Staff::findOrFail($id);
        $staff->delete();
        return response()->json(['message' => 'Staff record removed']);
    }

    // ----------------------------------------------------
    // GUEST FOLIOS OPERATIONS
    // ----------------------------------------------------
    public function getFolios()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('guest_folios')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $folios = GuestFolio::orderBy('created_at', 'desc')->get();
            return response()->json($folios);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('getFolios error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function createFolio(Request $request)
    {
        try {
            $id = $request->input('id') ?: 'fol-' . strtoupper(Str::random(6));
            $folio = GuestFolio::create(array_merge($request->all(), ['id' => $id]));
            return response()->json($folio, 201);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateFolio(Request $request, $id)
    {
        try {
            $folio = GuestFolio::findOrFail($id);
            $folio->update($request->all());
            return response()->json($folio);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ----------------------------------------------------
    // INVENTORY ITEMS OPERATIONS
    // ----------------------------------------------------
    public function getInventory()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('inventory_items')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            }
            $items = InventoryItem::orderBy('created_at', 'desc')->get();
            return response()->json($items);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function createInventory(Request $request)
    {
        try {
            $id = $request->input('id') ?: 'inv-' . strtoupper(Str::random(6));
            $item = InventoryItem::create(array_merge($request->all(), ['id' => $id]));
            return response()->json($item, 201);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateInventory(Request $request, $id)
    {
        try {
            $item = InventoryItem::findOrFail($id);
            $item->update($request->all());
            return response()->json($item);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ----------------------------------------------------
    // SYNC / SEED ENDPOINT (Seed Initial Data if DB is Empty)
    // ----------------------------------------------------
    public function seedInitialData(Request $request)
    {
        $data = $request->all();

        // Seed hotels
        if (!empty($data['hotels'])) {
            foreach ($data['hotels'] as $h) {
                Hotel::updateOrCreate(['id' => $h['id']], [
                    'id' => $h['id'],
                    'name' => $h['name'],
                    'brand' => $h['brand'] ?? 'Lazfort Sovereign Portfolio',
                    'location' => $h['location'] ?? $h['address'] ?? 'Global Luxury Destination',
                    'address' => $h['address'] ?? ($h['location'] ?? null),
                    'city' => $h['city'] ?? null,
                    'country' => $h['country'] ?? null,
                    'phone' => $h['phone'] ?? '+1 (800) 555-0199',
                    'email' => $h['email'] ?? 'contact@lazfort.com',
                    'rating' => $h['rating'] ?? '5 Star Ultra-Luxury',
                    'status' => $h['status'] ?? 'active',
                    'image' => $h['image'] ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                    'total_rooms' => (int)($h['totalRooms'] ?? $h['total_rooms'] ?? 80),
                    'subscription_plan' => $h['subscriptionPlan'] ?? $h['subscription_plan'] ?? 'Palace Enterprise',
                    'amenities' => $h['amenities'] ?? ['Private Helipad', 'Michelin Gastronomy', 'Sovereign Spa', 'Royal Butler Fleet'],
                ]);
            }
        }

        // Seed rooms
        if (!empty($data['rooms'])) {
            foreach ($data['rooms'] as $r) {
                Room::updateOrCreate(['id' => $r['id']], [
                    'id' => $r['id'],
                    'room_number' => $r['roomNumber'] ?? $r['room_number'] ?? '',
                    'type' => $r['type'] ?? 'Suite',
                    'floor' => $r['floor'] ?? '1',
                    'price' => $r['price'] ?? 0,
                    'status' => $r['status'] ?? 'available',
                    'capacity' => $r['capacity'] ?? 2,
                    'bed_type' => $r['bedType'] ?? $r['bed_type'] ?? null,
                    'view' => $r['view'] ?? null,
                    'image' => $r['image'] ?? null,
                    'amenities' => $r['amenities'] ?? [],
                    'description' => $r['description'] ?? null,
                ]);
            }
        }

        // Seed bookings
        if (!empty($data['bookings'])) {
            foreach ($data['bookings'] as $b) {
                Booking::updateOrCreate(['id' => $b['id']], [
                    'id' => $b['id'],
                    'booking_code' => $b['bookingCode'] ?? $b['code'] ?? null,
                    'guest_name' => $b['guestName'] ?? $b['name'] ?? 'Guest',
                    'guest_email' => $b['guestEmail'] ?? $b['email'] ?? null,
                    'guest_phone' => $b['guestPhone'] ?? $b['phone'] ?? null,
                    'room_number' => $b['roomNumber'] ?? $b['room_number'] ?? null,
                    'room_type' => $b['roomType'] ?? $b['room_type'] ?? null,
                    'check_in_date' => $b['checkInDate'] ?? $b['checkIn'] ?? now()->toDateString(),
                    'check_out_date' => $b['checkOutDate'] ?? $b['checkOut'] ?? now()->addDays(2)->toDateString(),
                    'adults' => $b['adults'] ?? 1,
                    'children' => $b['children'] ?? 0,
                    'total_amount' => $b['totalAmount'] ?? $b['total'] ?? 0,
                    'paid_amount' => $b['paidAmount'] ?? $b['paid'] ?? 0,
                    'status' => $b['status'] ?? 'confirmed',
                    'payment_status' => $b['paymentStatus'] ?? 'paid',
                    'booking_source' => $b['source'] ?? 'Direct Walk-in',
                ]);
            }
        }

        // Seed guests
        if (!empty($data['guests'])) {
            foreach ($data['guests'] as $g) {
                Guest::updateOrCreate(['id' => $g['id']], [
                    'id' => $g['id'],
                    'name' => $g['name'],
                    'email' => $g['email'] ?? null,
                    'phone' => $g['phone'] ?? null,
                    'nationality' => $g['nationality'] ?? null,
                    'vip_tier' => $g['vipTier'] ?? 'Standard',
                    'status' => $g['status'] ?? 'active',
                    'total_stays' => $g['totalStays'] ?? 0,
                    'total_spent' => $g['totalSpent'] ?? 0,
                ]);
            }
        }

        // Seed payments
        if (!empty($data['payments'])) {
            foreach ($data['payments'] as $p) {
                Payment::updateOrCreate(['id' => $p['id']], [
                    'id' => $p['id'],
                    'transaction_ref' => $p['transactionRef'] ?? $p['transaction_ref'] ?? ('TX-' . rand(10000, 99999)),
                    'booking_id' => $p['bookingCode'] ?? $p['bookingId'] ?? null,
                    'guest_name' => $p['guestName'] ?? 'Guest',
                    'room_number' => $p['roomNumber'] ?? null,
                    'amount' => $p['amount'] ?? 0,
                    'payment_method' => $p['paymentMethod'] ?? 'Credit Card',
                    'status' => $p['status'] ?? 'completed',
                    'payment_date' => $p['date'] ?? now()->toDateString(),
                    'notes' => $p['notes'] ?? null,
                ]);
            }
        }

        // Seed invoices
        if (!empty($data['invoices'])) {
            foreach ($data['invoices'] as $inv) {
                Invoice::updateOrCreate(['id' => $inv['id']], [
                    'id' => $inv['id'],
                    'invoice_number' => $inv['invoiceNumber'] ?? ('INV-' . rand(1000, 9999)),
                    'booking_id' => $inv['bookingCode'] ?? null,
                    'guest_name' => $inv['guestName'] ?? 'Guest',
                    'room_number' => $inv['roomNumber'] ?? null,
                    'issue_date' => $inv['issuedDate'] ?? now()->toDateString(),
                    'due_date' => $inv['dueDate'] ?? now()->addDays(7)->toDateString(),
                    'subtotal' => $inv['subtotal'] ?? 0,
                    'tax_amount' => $inv['taxAmount'] ?? 0,
                    'total_amount' => $inv['totalAmount'] ?? 0,
                    'amount_paid' => $inv['amountPaid'] ?? 0,
                    'status' => $inv['status'] ?? 'paid',
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Initial ERP records populated in MySQL database successfully',
        ]);
    }
}

