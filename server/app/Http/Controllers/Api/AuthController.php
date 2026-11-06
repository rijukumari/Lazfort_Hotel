<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Ensure database tables & schema additions are created
     */
    protected function ensureUsersTable()
    {
        try {
            if (!Schema::hasTable('users') || !Schema::hasTable('personal_access_tokens')) {
                Artisan::call('migrate', ['--force' => true]);
            }

            // Create personal_access_tokens if still missing
            if (!Schema::hasTable('personal_access_tokens')) {
                Schema::create('personal_access_tokens', function ($table) {
                    $table->id();
                    $table->morphs('tokenable');
                    $table->string('name');
                    $table->string('token', 64)->unique();
                    $table->text('abilities')->nullable();
                    $table->timestamp('last_used_at')->nullable();
                    $table->timestamp('expires_at')->nullable();
                    $table->timestamps();
                });
            }

            if (Schema::hasTable('users')) {
                if (!Schema::hasColumn('users', 'role')) {
                    DB::statement("ALTER TABLE users ADD COLUMN role VARCHAR(100) DEFAULT 'customer' AFTER email");
                }
                if (!Schema::hasColumn('users', 'hotel_name')) {
                    DB::statement("ALTER TABLE users ADD COLUMN hotel_name VARCHAR(255) NULL AFTER role");
                }
                if (!Schema::hasColumn('users', 'phone')) {
                    DB::statement("ALTER TABLE users ADD COLUMN phone VARCHAR(100) NULL AFTER email");
                }
                if (!Schema::hasColumn('users', 'status')) {
                    DB::statement("ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active' AFTER role");
                }
                if (!Schema::hasColumn('users', 'avatar')) {
                    DB::statement("ALTER TABLE users ADD COLUMN avatar VARCHAR(500) NULL AFTER status");
                }
                if (!Schema::hasColumn('users', 'custom_id')) {
                    DB::statement("ALTER TABLE users ADD COLUMN custom_id VARCHAR(50) NULL AFTER id");
                }
            }
        } catch (\Throwable $e) {
            Log::warning('AuthController ensureUsersTable warning: ' . $e->getMessage());
        }
    }

    /**
     * Normalize role strings from frontend into standard role keys
     */
    protected function normalizeRole($roleInput)
    {
        $roleMap = [
            'super_admin' => 'super_admin',
            'super admin' => 'super_admin',
            'hotel_admin' => 'hotel_admin',
            'hotel admin' => 'hotel_admin',
            'receptionist' => 'receptionist',
            'customer' => 'customer',
            'vip customer' => 'customer',
            'housekeeping' => 'housekeeping',
            'staff' => 'staff',
        ];

        $lower = strtolower(trim($roleInput ?? ''));
        return $roleMap[$lower] ?? 'customer';
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $this->ensureUsersTable();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string',
            'hotelName' => 'nullable|string',
            'hotel_name' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $email = strtolower(trim($validated['email']));

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'The email address is already registered. Please sign in or use another email.',
            ], 422);
        }

        // Enforce safe role assignment on public registration:
        // Do not allow users to grant themselves 'super_admin' through public signup.
        $requestedRole = $this->normalizeRole($request->input('role') ?? 'customer');
        if ($requestedRole === 'super_admin') {
            $requestedRole = 'hotel_admin'; // Fallback to hotel_admin or customer
        }

        $hotelName = $request->input('hotelName') ?: $request->input('hotel_name') ?: 'Lazfort Grand Palace & Royal Spa';
        $customId = 'usr-' . strtolower(substr($requestedRole, 0, 2)) . '-' . time();

        $user = User::create([
            'custom_id' => $customId,
            'name' => trim($validated['name']),
            'email' => $email,
            'password' => Hash::make($validated['password']),
            'role' => $requestedRole,
            'hotel_name' => $hotelName,
            'phone' => $request->input('phone'),
            'status' => 'active',
            'avatar' => $request->input('avatar') ?: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        ]);

        // Generate token safely
        try {
            $token = $user->createToken('lazfort_auth_token')->plainTextToken;
        } catch (\Throwable $tokenEx) {
            Log::info('createToken fallback: ' . $tokenEx->getMessage());
            $token = 'tk_' . bin2hex(random_bytes(32));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'User registered and saved to database successfully',
            'token' => $token,
            'user' => [
                'id' => $user->custom_id ?: ('usr-' . $user->id),
                'db_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'hotelName' => $user->hotel_name,
                'phone' => $user->phone,
                'status' => $user->status,
                'avatar' => $user->avatar,
            ],
        ], 201);
    }

    /**
     * Authenticate user & return token
     */
    public function login(Request $request)
    {
        $this->ensureUsersTable();

        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'role' => 'nullable|string',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid clearance credentials. No account found with this email.',
            ], 401);
        }

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid security passcode. Clearance denied.',
            ], 401);
        }

        // Check if account suspended
        if (isset($user->status) && $user->status === 'suspended') {
            return response()->json([
                'status' => 'error',
                'message' => 'This account has been administratively suspended.',
            ], 403);
        }

        // Optional role match validation
        if ($request->filled('role')) {
            $requestedRole = $this->normalizeRole($request->input('role'));
            // Allow login but sync/update if appropriate
        }

        // Generate token safely
        try {
            $token = $user->createToken('lazfort_auth_token')->plainTextToken;
        } catch (\Throwable $tokenEx) {
            Log::info('createToken fallback: ' . $tokenEx->getMessage());
            $token = 'tk_' . bin2hex(random_bytes(32));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Authentication successful',
            'token' => $token,
            'user' => [
                'id' => $user->custom_id ?: ('usr-' . $user->id),
                'db_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?: 'hotel_admin',
                'hotelName' => $user->hotel_name ?? 'Lazfort Grand Palace & Royal Spa',
                'phone' => $user->phone,
                'status' => $user->status ?? 'active',
                'avatar' => $user->avatar ?: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            ],
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $this->ensureUsersTable();
        $user = $request->user();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->custom_id ?: ('usr-' . $user->id),
                'db_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'hotelName' => $user->hotel_name,
                'phone' => $user->phone,
                'status' => $user->status,
                'avatar' => $user->avatar,
            ],
        ]);
    }
}

