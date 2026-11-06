<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations for Super Admin Platform modules.
     */
    public function up(): void
    {
        // 1. Subscription Plans Table
        if (!Schema::hasTable('subscription_plans')) {
            Schema::create('subscription_plans', function (Blueprint $table) {
                $table->string('id')->primary(); // plan-01
                $table->string('name');
                $table->string('tier_code')->nullable();
                $table->decimal('price', 12, 2)->default(0);
                $table->string('currency', 10)->default('USD');
                $table->string('billing_cycle', 50)->default('monthly'); // monthly, annual
                $table->integer('max_rooms')->default(50);
                $table->integer('max_staff')->default(20);
                $table->text('description')->nullable();
                $table->json('features')->nullable();
                $table->string('status', 50)->default('active'); // active, inactive, archived
                $table->timestamps();
            });
        }

        // 2. Subscriptions (Hotels Active/Expired Subscriptions)
        if (!Schema::hasTable('subscriptions')) {
            Schema::create('subscriptions', function (Blueprint $table) {
                $table->string('id')->primary(); // sub-01
                $table->string('subscription_code')->unique()->nullable();
                $table->string('hotel_id')->nullable();
                $table->string('hotel_name')->nullable();
                $table->string('plan_id')->nullable();
                $table->string('plan_name')->nullable();
                $table->string('tier_code')->nullable();
                $table->decimal('amount', 12, 2)->default(0);
                $table->string('currency', 10)->default('USD');
                $table->string('billing_cycle', 50)->default('monthly');
                $table->string('status', 50)->default('active'); // active, expired, pending, cancelled
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->date('next_billing_date')->nullable();
                $table->boolean('auto_renew')->default(true);
                $table->timestamps();
            });
        }

        // 3. Plan Features Table
        if (!Schema::hasTable('plan_features')) {
            Schema::create('plan_features', function (Blueprint $table) {
                $table->string('id')->primary(); // feat-01
                $table->string('name');
                $table->string('code')->nullable();
                $table->string('category', 100)->default('Core Operations');
                $table->text('description')->nullable();
                $table->string('status', 50)->default('enabled');
                $table->timestamps();
            });
        }

        // 4. Refund Requests Table
        if (!Schema::hasTable('refund_requests')) {
            Schema::create('refund_requests', function (Blueprint $table) {
                $table->string('id')->primary(); // ref-01
                $table->string('request_id')->unique()->nullable();
                $table->string('original_tx_id')->nullable();
                $table->string('guest_name')->nullable();
                $table->string('hotel_id')->nullable();
                $table->string('hotel_name')->nullable();
                $table->string('booking_ref')->nullable();
                $table->decimal('requested_amount', 12, 2)->default(0);
                $table->string('currency', 10)->default('USD');
                $table->text('reason')->nullable();
                $table->string('request_date')->nullable();
                $table->string('status', 50)->default('pending'); // pending, approved, rejected
                $table->string('reviewed_by')->nullable();
                $table->string('reviewed_date')->nullable();
                $table->timestamps();
            });
        }

        // 5. Platform Settings Table
        if (!Schema::hasTable('platform_settings')) {
            Schema::create('platform_settings', function (Blueprint $table) {
                $table->id();
                $table->string('setting_key')->unique();
                $table->text('setting_value')->nullable();
                $table->string('category', 100)->default('general');
                $table->string('data_type', 50)->default('string');
                $table->timestamps();
            });
        }

        // 6. Platform Announcements Table
        if (!Schema::hasTable('announcements')) {
            Schema::create('announcements', function (Blueprint $table) {
                $table->string('id')->primary(); // ann-01
                $table->string('title');
                $table->text('message')->nullable();
                $table->string('type', 50)->default('Information'); // Maintenance, Warning, Information
                $table->string('audience', 100)->default('All Hotel Properties');
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->string('status', 50)->default('Published'); // Scheduled, Published, Draft, Archived
                $table->string('created_by')->nullable();
                $table->timestamps();
            });
        }

        // 7. Support Tickets Table
        if (!Schema::hasTable('support_tickets')) {
            Schema::create('support_tickets', function (Blueprint $table) {
                $table->string('id')->primary(); // tkt-01
                $table->string('ticket_id')->unique()->nullable();
                $table->string('subject');
                $table->string('client_name')->nullable();
                $table->string('hotel_name')->nullable();
                $table->string('category', 100)->default('General Inquiries');
                $table->string('priority', 50)->default('medium'); // low, medium, high, critical
                $table->string('status', 50)->default('open'); // open, in_progress, resolved, closed
                $table->string('assigned_agent')->nullable();
                $table->integer('replies_count')->default(0);
                $table->text('description')->nullable();
                $table->json('replies')->nullable();
                $table->timestamps();
            });
        }

        // 8. Complaints Table
        if (!Schema::hasTable('complaints')) {
            Schema::create('complaints', function (Blueprint $table) {
                $table->string('id')->primary(); // cmp-01
                $table->string('complaint_id')->unique()->nullable();
                $table->string('title');
                $table->string('customer_name')->nullable();
                $table->string('hotel_name')->nullable();
                $table->string('category', 100)->default('Service Quality');
                $table->string('priority', 50)->default('medium');
                $table->string('status', 50)->default('under_review'); // under_review, resolved, escalated
                $table->string('assigned_staff')->nullable();
                $table->json('notes')->nullable();
                $table->text('resolution_summary')->nullable();
                $table->timestamps();
            });
        }

        // 9. Contact Requests Table
        if (!Schema::hasTable('contact_requests')) {
            Schema::create('contact_requests', function (Blueprint $table) {
                $table->string('id')->primary(); // cnt-01
                $table->string('request_id')->unique()->nullable();
                $table->string('name');
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('company_or_hotel')->nullable();
                $table->string('inquiry_type', 100)->default('General Inquiry');
                $table->text('message')->nullable();
                $table->string('status', 50)->default('new'); // new, contacted, closed
                $table->text('follow_up_notes')->nullable();
                $table->timestamps();
            });
        }

        // 10. Audit Logs Table
        if (!Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->string('action'); // CREATE, UPDATE, DELETE, LOGIN, APPROVE
                $table->string('module'); // Platform Setting, Hotel Management, Subscription, User
                $table->string('target_id')->nullable();
                $table->text('description');
                $table->string('performed_by')->default('Super Administrator');
                $table->string('ip_address')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('contact_requests');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('platform_settings');
        Schema::dropIfExists('refund_requests');
        Schema::dropIfExists('plan_features');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('subscription_plans');
    }
};

