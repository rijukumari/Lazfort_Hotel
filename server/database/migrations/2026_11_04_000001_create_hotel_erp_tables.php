<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Hotels table
        Schema::create('hotels', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. hotel-001
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('location')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('rating')->nullable();
            $table->string('status')->default('active'); // active, maintenance, pending
            $table->string('image')->nullable();
            $table->integer('total_rooms')->default(0);
            $table->string('subscription_plan')->default('Enterprise Luxury');
            $table->json('amenities')->nullable();
            $table->timestamps();
        });

        // 2. Room Categories / Types table
        Schema::create('room_categories', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->string('name');
            $table->decimal('base_price', 10, 2)->default(0.00);
            $table->integer('max_occupancy')->default(2);
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        // 3. Rooms table
        Schema::create('rooms', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. rm-101
            $table->string('room_number')->index();
            $table->string('type'); // Presidential Suite, Royal Penthouse, etc.
            $table->string('floor')->default('1');
            $table->decimal('price', 10, 2)->default(0.00);
            $table->string('status')->default('available'); // available, occupied, reserved, maintenance, cleaning
            $table->integer('capacity')->default(2);
            $table->string('bed_type')->nullable();
            $table->string('view')->nullable();
            $table->string('image')->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->text('description')->nullable();
            $table->string('hotel_id')->nullable();
            $table->timestamps();
        });

        // 4. Guests / Customers table
        Schema::create('guests', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. gst-001
            $table->string('name');
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('nationality')->nullable();
            $table->string('id_proof')->nullable(); // passport, id card
            $table->string('id_number')->nullable();
            $table->string('vip_tier')->default('Standard'); // VIP, Ultra-VIP, Platinum, Standard
            $table->string('status')->default('active'); // active, checked-in, checked-out
            $table->string('address')->nullable();
            $table->string('current_room')->nullable();
            $table->integer('total_stays')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0.00);
            $table->json('preferences')->nullable();
            $table->timestamps();
        });

        // 5. Bookings / Reservations table
        Schema::create('bookings', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. bk-001 or AUR-8821
            $table->string('booking_code')->nullable()->index();
            $table->string('guest_name');
            $table->string('guest_email')->nullable();
            $table->string('guest_phone')->nullable();
            $table->string('room_id')->nullable();
            $table->string('room_number')->nullable();
            $table->string('room_type')->nullable();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            $table->decimal('total_amount', 12, 2)->default(0.00);
            $table->decimal('paid_amount', 12, 2)->default(0.00);
            $table->string('status')->default('confirmed'); // pending, confirmed, checked_in, checked_out, cancelled
            $table->string('payment_status')->default('pending'); // paid, partial, pending, refunded
            $table->string('booking_source')->default('Direct Walk-in'); // Front Desk, Online, Agent
            $table->text('special_requests')->nullable();
            $table->string('rate_plan')->default('Flexible Luxury Tariff');
            $table->string('created_by')->nullable();
            $table->timestamps();
        });

        // 6. Payments & Receipts table
        Schema::create('payments', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. pay-001
            $table->string('transaction_ref')->unique();
            $table->string('booking_id')->nullable()->index();
            $table->string('guest_name');
            $table->string('room_number')->nullable();
            $table->decimal('amount', 12, 2)->default(0.00);
            $table->string('payment_method')->default('Credit Card'); // Credit Card, Cash, Wire, Centurion
            $table->string('status')->default('completed'); // completed, pending, refunded, failed
            $table->date('payment_date')->nullable();
            $table->string('card_last4')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        // 7. Invoices table
        Schema::create('invoices', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. INV-1001
            $table->string('invoice_number')->unique();
            $table->string('booking_id')->nullable()->index();
            $table->string('guest_name');
            $table->string('room_number')->nullable();
            $table->date('issue_date');
            $table->date('due_date')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0.00);
            $table->decimal('tax_amount', 12, 2)->default(0.00);
            $table->decimal('total_amount', 12, 2)->default(0.00);
            $table->decimal('amount_paid', 12, 2)->default(0.00);
            $table->string('status')->default('paid'); // paid, pending, overdue
            $table->json('items')->nullable();
            $table->timestamps();
        });

        // 8. Staff / Employees table
        Schema::create('staff', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. stf-001
            $table->string('employee_code')->nullable()->index();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('role'); // General Manager, Receptionist, Housekeeper, Concierge
            $table->string('department'); // Management, Front Office, Housekeeping, F&B
            $table->string('shift')->default('Morning');
            $table->string('status')->default('active'); // active, on_leave, inactive
            $table->decimal('salary', 10, 2)->default(0.00);
            $table->date('joining_date')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamps();
        });

        // 9. Housekeeping Tasks table
        Schema::create('housekeeping_tasks', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. hk-001
            $table->string('room_number')->index();
            $table->string('assigned_to')->nullable();
            $table->string('task_type')->default('Standard Turnover'); // Standard, Deep Clean, Inspection
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->string('status')->default('pending'); // pending, in_progress, completed, inspected
            $table->text('notes')->nullable();
            $table->dateTime('scheduled_time')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });

        // 10. Maintenance Tickets table
        Schema::create('maintenance_tickets', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. tkt-001
            $table->string('title');
            $table->string('room_number')->nullable();
            $table->string('category')->default('HVAC / Climate'); // Electrical, Plumbing, HVAC, Furniture
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->string('status')->default('open'); // open, in_progress, resolved, cancelled
            $table->string('reported_by')->nullable();
            $table->string('assigned_technician')->nullable();
            $table->text('description')->nullable();
            $table->decimal('estimated_cost', 10, 2)->default(0.00);
            $table->timestamps();
        });

        // 11. Guest Folios table
        Schema::create('guest_folios', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. fol-001
            $table->string('booking_id')->index();
            $table->string('guest_name');
            $table->string('room_number')->nullable();
            $table->decimal('total_charges', 12, 2)->default(0.00);
            $table->decimal('total_payments', 12, 2)->default(0.00);
            $table->decimal('balance', 12, 2)->default(0.00);
            $table->string('status')->default('open'); // open, settled, closed
            $table->json('transactions')->nullable();
            $table->timestamps();
        });

        // 12. Inventory Items table
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('category');
            $table->integer('current_stock')->default(0);
            $table->integer('min_stock_level')->default(10);
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->string('unit')->default('pcs');
            $table->string('supplier')->nullable();
            $table->string('status')->default('in_stock');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('guest_folios');
        Schema::dropIfExists('maintenance_tickets');
        Schema::dropIfExists('housekeeping_tasks');
        Schema::dropIfExists('staff');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('room_categories');
        Schema::dropIfExists('hotels');
    }
};

