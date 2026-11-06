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

                // Ensure demo/default accounts exist in MySQL users table
                $defaultDemoAccounts = [
                    [
                        'name' => 'Julian St. Clair',
                        'email' => 'julian@grandluxe-group.com',
                        'role' => 'super_admin',
                        'hotel_name' => 'Lazfort Global Corporate Office',
                        'phone' => '+377 98 00 11 01',
                    ],
                    [
                        'name' => 'Lord Alistair Sterling',
                        'email' => 'gm@lazfort.com',
                        'role' => 'hotel_admin',
                        'hotel_name' => 'Lazfort Grand Palace & Royal Spa',
                        'phone' => '+377 98 00 10 00',
                    ],
                    [
                        'name' => 'Camilla Valente',
                        'email' => 'camilla.v@lazfort.com',
                        'role' => 'receptionist',
                        'hotel_name' => 'Lazfort Grand Palace',
                        'phone' => '+377 98 00 12 34',
                    ],
                    [
                        'name' => 'Sir Alexander Kensington',
                        'email' => 'a.kensington@capitalgroup.co.uk',
                        'role' => 'customer',
                        'hotel_name' => 'Lazfort Grand Palace & Royal Spa',
                        'phone' => '+44 20 7946 0912',
                    ],
                    [
                        'name' => 'Margaux Dubois',
                        'email' => 'margaux.d@lazfort.com',
                        'role' => 'housekeeping',
                        'hotel_name' => 'Lazfort Grand Palace',
                        'phone' => '+377 98 00 14 20',
                    ],
                    [
                        'name' => 'Antoine Mercier',
                        'email' => 'antoine.m@lazfort.com',
                        'role' => 'staff',
                        'hotel_name' => 'Lazfort Grand Palace',
                        'phone' => '+377 98 00 15 55',
                    ],
                ];

                foreach ($defaultDemoAccounts as $acc) {
                    $existing = User::where('email', $acc['email'])->first();
                    if (!$existing) {
                        User::create([
                            'custom_id' => 'usr-' . substr($acc['role'], 0, 2) . '-1',
                            'name' => $acc['name'],
                            'email' => $acc['email'],
                            'password' => Hash::make('password123'),
                            'role' => $acc['role'],
                            'hotel_name' => $acc['hotel_name'],
                            'phone' => $acc['phone'],
                            'status' => 'active',
                            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                        ]);
                    }
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

        // If demo preset account is selected or user not yet in DB, check demo presets
        $isDemoPlaceholderPassword = in_array($validated['password'], ['••••••••••••', 'password', 'password123', 'admin', 'admin123', 'secret123']);
        $demoEmails = [
            'julian@grandluxe-group.com' => ['name' => 'Julian St. Clair', 'role' => 'super_admin', 'hotel' => 'Lazfort Global Corporate Office'],
            'gm@lazfort.com' => ['name' => 'Lord Alistair Sterling', 'role' => 'hotel_admin', 'hotel' => 'Lazfort Grand Palace & Royal Spa'],
            'camilla.v@lazfort.com' => ['name' => 'Camilla Valente', 'role' => 'receptionist', 'hotel' => 'Lazfort Grand Palace'],
            'a.kensington@capitalgroup.co.uk' => ['name' => 'Sir Alexander Kensington', 'role' => 'customer', 'hotel' => 'Lazfort Grand Palace & Royal Spa'],
            'margaux.d@lazfort.com' => ['name' => 'Margaux Dubois', 'role' => 'housekeeping', 'hotel' => 'Lazfort Grand Palace'],
            'antoine.m@lazfort.com' => ['name' => 'Antoine Mercier', 'role' => 'staff', 'hotel' => 'Lazfort Grand Palace'],
        ];

        if (!$user && isset($demoEmails[$email])) {
            $demo = $demoEmails[$email];
            $user = User::create([
                'custom_id' => 'usr-' . substr($demo['role'], 0, 2) . '-1',
                'name' => $demo['name'],
                'email' => $email,
                'password' => Hash::make($validated['password']),
                'role' => $demo['role'],
                'hotel_name' => $demo['hotel'],
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            ]);
        }

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid clearance credentials. No account found with this email.',
            ], 401);
        }

        // Verify password (allow demo password tokens for quick role switcher or match hashed password)
        $passwordMatches = Hash::check($validated['password'], $user->password) ||
                           (isset($demoEmails[$email]) && $isDemoPlaceholderPassword);

        if (!$passwordMatches) {
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

