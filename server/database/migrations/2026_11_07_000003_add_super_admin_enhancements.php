<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for Super Admin relational enhancements.
     */
    public function up(): void
    {
        // 1. Add hotel_id and permissions to users if missing
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'hotel_id')) {
                    $table->string('hotel_id')->nullable()->after('hotel_access');
                }
                if (!Schema::hasColumn('users', 'permissions')) {
                    $table->json('permissions')->nullable()->after('role');
                }
            });
        }

        // 2. Add hotel_id and is_deleted to rooms if missing
        if (Schema::hasTable('rooms')) {
            Schema::table('rooms', function (Blueprint $table) {
                if (!Schema::hasColumn('rooms', 'hotel_id')) {
                    $table->string('hotel_id')->nullable()->after('id');
                }
                if (!Schema::hasColumn('rooms', 'is_deleted')) {
                    $table->boolean('is_deleted')->default(false)->after('status');
                }
            });
        }

        // 3. Add hotel_id to bookings if missing
        if (Schema::hasTable('bookings')) {
            Schema::table('bookings', function (Blueprint $table) {
                if (!Schema::hasColumn('bookings', 'hotel_id')) {
                    $table->string('hotel_id')->nullable()->after('id');
                }
            });
        }

        // 4. Add hotel_id and refund linkage to payments if missing
        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                if (!Schema::hasColumn('payments', 'hotel_id')) {
                    $table->string('hotel_id')->nullable()->after('id');
                }
                if (!Schema::hasColumn('payments', 'refund_request_id')) {
                    $table->string('refund_request_id')->nullable()->after('status');
                }
            });
        }

        // 5. Add hotel_id to invoices if missing
        if (Schema::hasTable('invoices')) {
            Schema::table('invoices', function (Blueprint $table) {
                if (!Schema::hasColumn('invoices', 'hotel_id')) {
                    $table->string('hotel_id')->nullable()->after('id');
                }
            });
        }

        // 6. Add replies JSON to support_tickets if missing
        if (Schema::hasTable('support_tickets')) {
            Schema::table('support_tickets', function (Blueprint $table) {
                if (!Schema::hasColumn('support_tickets', 'replies')) {
                    $table->json('replies')->nullable()->after('description');
                }
            });
        }

        // 7. Add rejection_reason to hotels if missing
        if (Schema::hasTable('hotels')) {
            Schema::table('hotels', function (Blueprint $table) {
                if (!Schema::hasColumn('hotels', 'rejection_reason')) {
                    $table->text('rejection_reason')->nullable()->after('status');
                }
            });
        }

        // 8. Ensure currencies decimal_precision column if missing
        if (Schema::hasTable('currencies')) {
            Schema::table('currencies', function (Blueprint $table) {
                if (!Schema::hasColumn('currencies', 'decimal_precision')) {
                    $table->unsignedTinyInteger('decimal_precision')->default(2)->after('currency_symbol');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Safe no-op to preserve existing records
    }
};

