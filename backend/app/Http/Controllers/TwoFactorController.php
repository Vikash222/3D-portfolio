<?php

namespace App\Http\Controllers;

use App\Services\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class TwoFactorController extends Controller
{
    public function __construct(
        protected TwoFactorService $twoFactorService
    ) {}

    /**
     * Start 2FA setup by generating a secret key and otpauth URI.
     */
    public function setup(Request $request): JsonResponse
    {
        $user = $request->user();
        $secret = $this->twoFactorService->generateSecretKey();
        $appName = config('app.name', 'Portfolio Admin');
        $otpauthUri = $this->twoFactorService->getOtpAuthUri($appName, $user->email, $secret);

        // Store pending secret in cache for 15 minutes
        Cache::put("pending_2fa_secret_{$user->id}", $secret, now()->addMinutes(15));

        return response()->json([
            'secret' => $secret,
            'otpauth_uri' => $otpauthUri,
            'qr_data' => $otpauthUri, // Can be rendered directly via qrcode.react
            'message' => 'Scan this QR code in Microsoft Authenticator or enter the secret key manually.',
        ]);
    }

    /**
     * Confirm 2FA setup by verifying the first 6-digit code.
     */
    public function confirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        $pendingSecret = Cache::get("pending_2fa_secret_{$user->id}");

        if (!$pendingSecret) {
            return response()->json([
                'message' => '2FA setup session expired. Please start over.',
            ], 422);
        }

        if (!$this->twoFactorService->verifyCode($pendingSecret, $validated['code'])) {
            return response()->json([
                'message' => 'Invalid verification code. Please make sure your device clock is synchronized and try again.',
            ], 422);
        }

        $recoveryCodes = $this->twoFactorService->generateRecoveryCodes();

        $user->two_factor_secret = $pendingSecret;
        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_codes = $recoveryCodes;
        $user->save();

        Cache::forget("pending_2fa_secret_{$user->id}");

        return response()->json([
            'success' => true,
            'message' => 'Two-Factor Authentication has been successfully enabled with Microsoft Authenticator!',
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable 2FA.
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password verification failed. 2FA cannot be disabled.',
            ], 422);
        }

        $user->two_factor_secret = null;
        $user->two_factor_confirmed_at = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Two-Factor Authentication has been disabled.',
        ]);
    }

    /**
     * Regenerate backup recovery codes.
     */
    public function regenerateRecoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasEnabledTwoFactor()) {
            return response()->json([
                'message' => 'Two-Factor Authentication is not enabled.',
            ], 400);
        }

        $recoveryCodes = $this->twoFactorService->generateRecoveryCodes();
        $user->two_factor_recovery_codes = $recoveryCodes;
        $user->save();

        return response()->json([
            'recovery_codes' => $recoveryCodes,
            'message' => 'New recovery codes generated. Store them safely.',
        ]);
    }
}
