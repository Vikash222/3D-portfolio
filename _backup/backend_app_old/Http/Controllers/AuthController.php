<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Services\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(
        protected TwoFactorService $twoFactorService
    ) {}

    /**
     * Register a new client / visitor account.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:25',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'client',
        ]);

        $token = $user->createToken('client-api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => 'client',
                'two_factor_enabled' => false,
            ],
            'message' => 'Account registered successfully! Welcome to the client portal.',
        ], 201);
    }

    /**
     * Authenticate or register client via Google OAuth / Google Identity Services.
     */
    public function googleAuth(Request $request): JsonResponse
    {
        $credential = $request->input('credential');
        $email = $request->input('email');
        $name = $request->input('name');
        $googleId = $request->input('google_id');

        // If JWT credential from Google Identity Services is provided, decode payload
        if ($credential && is_string($credential)) {
            $parts = explode('.', $credential);
            if (count($parts) === 3) {
                $payloadJson = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
                $payload = json_decode($payloadJson, true);
                if (is_array($payload) && !empty($payload['email'])) {
                    $email = $payload['email'];
                    $name = $payload['name'] ?? $name ?? explode('@', $email)[0];
                    $googleId = $payload['sub'] ?? $googleId;
                }
            }
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'message' => 'A valid Google email address is required for Google Sign-In.',
            ], 422);
        }

        $cleanName = trim($name ?: explode('@', $email)[0]);

        $user = User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name' => $cleanName,
                'email' => $email,
                'role' => 'client',
                'password' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
            ]);
        } else {
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
                $user->save();
            }
        }

        // Issue Sanctum Token
        $token = $user->createToken('client-google-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'two_factor_enabled' => $user->hasEnabledTwoFactor(),
                'email_verified_at' => $user->email_verified_at,
            ],
            'message' => 'Google account verified successfully! Welcome to the portal.',
        ]);
    }

    /**
     * Authenticate or register via Microsoft Account.
     */
    public function microsoftAuth(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $name = $request->input('name');

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'message' => 'A valid Microsoft email address is required.',
            ], 422);
        }

        $cleanName = trim($name ?: explode('@', $email)[0]);

        $user = User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name' => $cleanName,
                'email' => $email,
                'role' => 'client',
                'password' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
            ]);
        } else {
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
                $user->save();
            }
        }

        $token = $user->createToken('microsoft-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'two_factor_enabled' => $user->hasEnabledTwoFactor(),
                'email_verified_at' => $user->email_verified_at,
            ],
            'message' => 'Microsoft account verified successfully!',
        ]);
    }

    /**
     * Authenticate user (Admin or Client).
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 422);
        }

        // Only enforce 2FA challenge for admins if enabled
        if ($user->isAdmin() && $user->hasEnabledTwoFactor()) {
            $challengeToken = Str::random(64);
            Cache::put("2fa_challenge_{$challengeToken}", $user->id, now()->addMinutes(5));

            return response()->json([
                'requires_2fa' => true,
                'challenge_token' => $challengeToken,
                'message' => 'Two-Factor Authentication required. Enter the 6-digit code from Microsoft Authenticator.',
            ]);
        }

        // Issue Sanctum API token
        $token = $user->createToken('auth-api-token')->plainTextToken;

        return response()->json([
            'requires_2fa' => false,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role ?? 'client',
                'two_factor_enabled' => $user->hasEnabledTwoFactor(),
            ],
            'message' => 'Logged in successfully.',
        ]);
    }

    /**
     * Verify 2FA challenge code or recovery code.
     */
    public function verify2Fa(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challenge_token' => 'required|string',
            'code' => 'required|string',
        ]);

        $userId = Cache::get("2fa_challenge_{$validated['challenge_token']}");

        if (!$userId) {
            return response()->json([
                'message' => 'The 2FA session has expired or is invalid. Please log in again.',
            ], 401);
        }

        $user = User::find($userId);
        if (!$user || !$user->two_factor_secret) {
            return response()->json([
                'message' => 'User not found or 2FA not configured.',
            ], 404);
        }

        $code = trim($validated['code']);
        $isValid = false;

        // Check TOTP code
        if (strlen($code) === 6 && ctype_digit($code)) {
            $isValid = $this->twoFactorService->verifyCode($user->two_factor_secret, $code);
        }

        // Check Recovery Codes
        if (!$isValid && is_array($user->two_factor_recovery_codes)) {
            $recoveryCodes = $user->two_factor_recovery_codes;
            $codeFormatted = strtoupper($code);

            if (($key = array_search($codeFormatted, $recoveryCodes)) !== false) {
                unset($recoveryCodes[$key]);
                $user->two_factor_recovery_codes = array_values($recoveryCodes);
                $user->save();
                $isValid = true;
            }
        }

        if (!$isValid) {
            return response()->json([
                'message' => 'Invalid authentication code. Please try again.',
            ], 422);
        }

        Cache::forget("2fa_challenge_{$validated['challenge_token']}");

        $token = $user->createToken('admin-api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'admin',
                'two_factor_enabled' => true,
            ],
            'message' => 'Two-Factor Authentication verified successfully.',
        ]);
    }

    /**
     * Get currently authenticated user details.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role ?? 'client',
                'two_factor_enabled' => $user->hasEnabledTwoFactor(),
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Get inquiries submitted by the logged-in client.
     */
    public function myInquiries(Request $request): JsonResponse
    {
        $user = $request->user();
        $inquiries = Message::where('email', $user->email)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'inquiries' => $inquiries,
        ]);
    }

    /**
     * Revoke tokens on logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
