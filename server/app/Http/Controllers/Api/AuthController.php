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
     * Ensure database tables & schema additions are created (Cached statically)
     */
    protected function ensureUsersTable()
    {
        static $checked = false;
        if ($checked) return;
        $checked = true;

        try {
            if (!Schema::hasTable('users') || !Schema::hasTable('personal_access_tokens')) {
                Artisan::call('migrate', ['--force' => true]);
            }

            if (Schema::hasTable('users')) {
                if (!Schema::hasColumn('users', 'role')) {
                    DB::statement("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'customer' AFTER email");
                }
                if (!Schema::hasColumn('users', 'hotel_id')) {
                    DB::statement("ALTER TABLE users ADD COLUMN hotel_id VARCHAR(50) NULL AFTER role");
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

                // Ensure Super Admin user exists in MySQL users table with proper Bcrypt hash
                $superAdmin = User::where('email', 'julian@grandluxe-group.com')->first();
                if (!$superAdmin) {
                    User::create([
                        'custom_id' => 'usr-sa-1',
                        'name' => 'Julian St. Clair',
                        'email' => 'julian@grandluxe-group.com',
                        'password' => Hash::make('password123'),
                        'role' => 'super_admin',
                        'hotel_name' => 'Lazfort Global Corporate Office',
                        'phone' => '+377 98 00 11 01',
                        'status' => 'active',
                        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    ]);
                } else if ($superAdmin->role !== 'super_admin') {
                    $superAdmin->update(['role' => 'super_admin']);
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

        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
                'role' => 'nullable|string',
            ]);

            $email = strtolower(trim($validated['email']));
            $inputPassword = $validated['password'];

            // Query user strictly from MySQL database
            $user = User::where('email', $email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid clearance credentials. No account found with this email.',
                ], 401);
            }

            // Check if account suspended
            if (isset($user->status) && strtolower($user->status) === 'suspended') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This account has been administratively suspended.',
                ], 403);
            }

            // Verify password using Laravel Hash::check() against MySQL bcrypt hash
            // (Also accepts default demo clearance passcode for pre-seeded console demo users)
            $isDemoPreset = in_array($inputPassword, ['••••••••••••', 'password123', 'admin123', 'password']);
            $isPasswordValid = Hash::check($inputPassword, $user->password) ||
                               ($isDemoPreset && in_array($email, [
                                   'julian@grandluxe-group.com',
                                   'gm@lazfort.com',
                                   'camilla.v@lazfort.com',
                                   'a.kensington@capitalgroup.co.uk',
                                   'margaux.d@lazfort.com',
                                   'antoine.m@lazfort.com'
                               ]));

            if (!$isPasswordValid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid security passcode. Clearance denied.',
                ], 401);
            }

            // Trust the database role, NOT the frontend role
            $dbRole = $this->normalizeRole($user->role);

            // Generate real Sanctum token if supported, or fallback to personal_access_tokens
            try {
                $token = $user->createToken('lazfort_auth_token')->plainTextToken;
            } catch (\Throwable $te) {
                $token = 'tk_' . bin2hex(random_bytes(32));
                try {
                    DB::table('personal_access_tokens')->insert([
                        'tokenable_type' => get_class($user),
                        'tokenable_id' => $user->id,
                        'name' => 'lazfort_auth_token',
                        'token' => hash('sha256', $token),
                        'abilities' => '["*"]',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } catch (\Throwable $ie) {}
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
                    'role' => $dbRole,
                    'hotelId' => $user->hotel_id,
                    'hotelName' => $user->hotel_name ?? 'Lazfort Global Corporate Office',
                    'hotelAccess' => $user->hotel_access ? explode(',', $user->hotel_access) : [$user->hotel_name ?? 'All Properties'],
                    'phone' => $user->phone,
                    'status' => $user->status ?? 'active',
                    'avatar' => $user->avatar ?: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                ],
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Authentication service exception: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Authentication service error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $this->ensureUsersTable();
        $user = $request->user();

        // If default Sanctum user is not resolved, inspect bearer token directly
        if (!$user) {
            $bearer = $request->bearerToken();
            if ($bearer) {
                // If token contains id|token format (Standard Sanctum)
                if (str_contains($bearer, '|')) {
                    [$id, $plainToken] = explode('|', $bearer, 2);
                    $tokenRecord = DB::table('personal_access_tokens')
                        ->where('id', $id)
                        ->first();
                    if ($tokenRecord && hash_equals($tokenRecord->token, hash('sha256', $plainToken))) {
                        $user = User::find($tokenRecord->tokenable_id);
                    }
                } else {
                    $tokenRecord = DB::table('personal_access_tokens')
                        ->where('token', hash('sha256', $bearer))
                        ->orWhere('token', $bearer)
                        ->first();
                    if ($tokenRecord) {
                        $user = User::find($tokenRecord->tokenable_id);
                    }
                }
            }
        }

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
                'hotelId' => $user->hotel_id,
                'hotelName' => $user->hotel_name,
                'hotelAccess' => $user->hotel_access ? explode(',', $user->hotel_access) : [$user->hotel_name ?? 'All Properties'],
                'phone' => $user->phone,
                'status' => $user->status,
                'avatar' => $user->avatar,
            ],
        ]);
    }

    /**
     * Invalidate user authentication token & logout
     */
    public function logout(Request $request)
    {
        $this->ensureUsersTable();
        try {
            // If authenticated via Sanctum token, revoke current token
            if ($request->user() && method_exists($request->user(), 'currentAccessToken') && $request->user()->currentAccessToken()) {
                $request->user()->currentAccessToken()->delete();
            }

            // Also check Authorization header token and invalidate from personal_access_tokens table if present
            $bearer = $request->bearerToken();
            if ($bearer && Schema::hasTable('personal_access_tokens')) {
                // If it's a token hash or plain token
                DB::table('personal_access_tokens')
                    ->where('token', hash('sha256', $bearer))
                    ->orWhere('token', $bearer)
                    ->delete();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Session invalidated and logged out successfully.',
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to revoke authentication session.',
            ], 500);
        }
    }
}

