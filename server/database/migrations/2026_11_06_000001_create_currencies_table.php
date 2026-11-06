<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('currencies')) {
            Schema::create('currencies', function (Blueprint $table) {
                $table->id();
                $table->string('currency_name');
                $table->string('currency_code', 10)->unique();
                $table->string('currency_symbol', 10);
                $table->boolean('is_default')->default(false);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });

            // Seed default primary currencies
            $initialCurrencies = [
                ['currency_name' => 'US Dollar', 'currency_code' => 'USD', 'currency_symbol' => '$', 'is_default' => true, 'is_active' => true],
                ['currency_name' => 'Indian Rupee', 'currency_code' => 'INR', 'currency_symbol' => '₹', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'Euro', 'currency_code' => 'EUR', 'currency_symbol' => '€', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'British Pound', 'currency_code' => 'GBP', 'currency_symbol' => '£', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'UAE Dirham', 'currency_code' => 'AED', 'currency_symbol' => 'د.إ', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'Saudi Riyal', 'currency_code' => 'SAR', 'currency_symbol' => '﷼', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'Singapore Dollar', 'currency_code' => 'SGD', 'currency_symbol' => 'S$', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'Canadian Dollar', 'currency_code' => 'CAD', 'currency_symbol' => 'C$', 'is_default' => false, 'is_active' => true],
                ['currency_name' => 'Australian Dollar', 'currency_code' => 'AUD', 'currency_symbol' => 'A$', 'is_default' => false, 'is_active' => true],
            ];

            foreach ($initialCurrencies as $c) {
                DB::table('currencies')->insert(array_merge($c, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }

        // Add currency_code to hotels table if missing
        if (Schema::hasTable('hotels') && !Schema::hasColumn('hotels', 'currency_code')) {
            Schema::table('hotels', function (Blueprint $table) {
                $table->string('currency_code', 10)->default('USD')->after('subscription_plan');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('hotels') && Schema::hasColumn('hotels', 'currency_code')) {
            Schema::table('hotels', function (Blueprint $table) {
                $table->dropColumn('currency_code');
            });
        }
        Schema::dropIfExists('currencies');
    }
};

