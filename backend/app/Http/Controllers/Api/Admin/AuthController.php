<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Services\TwoFactorService;

class AuthController extends Controller {
    use ApiResponse;

    public function login(Request $request) {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Invalid credentials', 401);
        }
        if (!in_array($user->role, ['admin', 'super_admin', 'editor', 'moderator', 'viewer'])) {
            return $this->error('Unauthorized account level', 403);
        }

        // Check if 2FA (Microsoft Authenticator / TOTP) is enabled
        if ($user->hasEnabledTwoFactor()) {
            $challengeToken = Str::random(64);
            Cache::put("2fa_challenge_{$challengeToken}", $user->id, now()->addMinutes(5));

            return $this->success([
                'requires_2fa' => true,
                'challenge_token' => $challengeToken,
            ], 'Two-Factor Authentication required');
        }

        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;
        $user->update(['last_login_at' => now()]);

        ActivityLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => 'login',
            'details' => 'Admin successfully logged in',
            'ip_address' => $request->ip(),
        ]);

        return $this->success(['user' => $user, 'token' => $token, 'requires_2fa' => false], 'Logged in');
    }

    public function me(Request $request) {
        return $this->success($request->user());
    }

    public function logout(Request $request) {
        if ($request->user()) {
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'action' => 'logout',
                'details' => 'Admin logged out',
                'ip_address' => $request->ip(),
            ]);
            $request->user()->currentAccessToken()->delete();
        }
        return $this->success(null, 'Logged out');
    }

    public function updateAccount(Request $request) {
        $user = $request->user();
        $request->validate([
            'name' => 'nullable|string|max:100',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:6',
        ]);

        if ($request->filled('new_password')) {
            if (!$request->filled('current_password') || !Hash::check($request->current_password, $user->password)) {
                return $this->error('Current password is incorrect.', 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        $user->email = $request->email;
        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => 'security_update',
            'details' => 'Admin updated account credentials',
            'ip_address' => $request->ip(),
        ]);

        return $this->success($user, 'Account credentials updated successfully');
    }

    // --- 2FA (Microsoft Authenticator / TOTP) ---

    public function verify2Fa(Request $request) {
        $request->validate([
            'challenge_token' => 'required|string',
            'code' => 'required|string',
        ]);

        $userId = Cache::get("2fa_challenge_{$request->challenge_token}");
        if (!$userId) {
            return $this->error('The 2FA session has expired. Please log in again.', 401);
        }

        $user = User::find($userId);
        if (!$user || !$user->hasEnabledTwoFactor()) {
            return $this->error('User not found or 2FA not configured', 404);
        }

        $code = trim($request->code);
        $twoFactorService = app(TwoFactorService::class);
        $isValid = false;

        // Check 6-digit TOTP
        if (strlen($code) === 6 && ctype_digit($code)) {
            $isValid = $twoFactorService->verifyCode($user->two_factor_secret, $code);
        }

        // Check recovery codes (e.g. XXXX-XXXX)
        if (!$isValid && is_array($user->two_factor_recovery_codes)) {
            $recoveryCodes = $user->two_factor_recovery_codes;
            $codeUpper = strtoupper($code);
            if (($idx = array_search($codeUpper, $recoveryCodes)) !== false) {
                unset($recoveryCodes[$idx]);
                $user->two_factor_recovery_codes = array_values($recoveryCodes);
                $user->save();
                $isValid = true;
            }
        }

        if (!$isValid) {
            return $this->error('Invalid verification code. Please check your Microsoft Authenticator app.', 422);
        }

        Cache::forget("2fa_challenge_{$request->challenge_token}");

        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;
        $user->update(['last_login_at' => now()]);

        ActivityLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => 'login_2fa',
            'details' => 'Admin successfully passed Microsoft Authenticator 2FA challenge',
            'ip_address' => $request->ip(),
        ]);

        return $this->success(['user' => $user, 'token' => $token], '2FA verification successful');
    }

    public function get2FaStatus(Request $request) {
        $user = $request->user();
        return $this->success([
            'enabled' => $user->hasEnabledTwoFactor(),
            'confirmed_at' => $user->two_factor_confirmed_at,
            'recovery_codes' => $user->hasEnabledTwoFactor() ? ($user->two_factor_recovery_codes ?? []) : [],
        ]);
    }

    public function setup2Fa(Request $request) {
        $user = $request->user();
        $service = app(TwoFactorService::class);
        $secret = $service->generateSecretKey();
        $appName = 'Vikash Portfolio';
        $otpauthUri = $service->getOtpAuthUri($appName, $user->email, $secret);

        Cache::put("pending_2fa_secret_{$user->id}", $secret, now()->addMinutes(15));

        return $this->success([
            'secret' => $secret,
            'otpauth_uri' => $otpauthUri,
            'qr_data' => $otpauthUri,
        ], '2FA setup initiated');
    }

    public function confirm2Fa(Request $request) {
        $request->validate(['code' => 'required|string|size:6']);
        $user = $request->user();
        $pendingSecret = Cache::get("pending_2fa_secret_{$user->id}");

        if (!$pendingSecret) {
            return $this->error('2FA setup session expired. Please start over.', 422);
        }

        $service = app(TwoFactorService::class);
        if (!$service->verifyCode($pendingSecret, $request->code)) {
            return $this->error('Invalid 6-digit code. Please check Microsoft Authenticator and try again.', 422);
        }

        $recoveryCodes = $service->generateRecoveryCodes();
        $user->two_factor_secret = $pendingSecret;
        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_codes = $recoveryCodes;
        $user->save();

        Cache::forget("pending_2fa_secret_{$user->id}");

        ActivityLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => '2fa_enabled',
            'details' => 'Microsoft Authenticator 2-FA enabled',
            'ip_address' => $request->ip(),
        ]);

        return $this->success([
            'recovery_codes' => $recoveryCodes,
            'two_factor_enabled' => true,
        ], 'Microsoft Authenticator 2-FA enabled successfully!');
    }

    public function disable2Fa(Request $request) {
        $request->validate(['password' => 'required']);
        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return $this->error('Incorrect password. 2FA cannot be disabled.', 422);
        }

        $user->two_factor_secret = null;
        $user->two_factor_confirmed_at = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => '2fa_disabled',
            'details' => 'Microsoft Authenticator 2-FA disabled',
            'ip_address' => $request->ip(),
        ]);

        return $this->success(['two_factor_enabled' => false], '2FA has been disabled.');
    }
}
