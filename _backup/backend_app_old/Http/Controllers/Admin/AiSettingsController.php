<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfileSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiSettingsController extends Controller
{
    /**
     * Get current AI configuration.
     */
    public function show(): JsonResponse
    {
        $profile = ProfileSetting::first();

        return response()->json([
            'gemini_api_key' => $profile?->gemini_api_key ? '••••••••' . substr($profile->gemini_api_key, -4) : '',
            'has_api_key' => !empty($profile?->gemini_api_key) || !empty(env('GEMINI_API_KEY')),
            'ai_system_prompt' => $profile?->ai_system_prompt ?: "You are Vikash Kumar's AI Twin and Portfolio Assistant. You represent Vikash with utmost professionalism, confidence, and warmth. Answer questions accurately based on the portfolio knowledge base.",
            'ai_welcome_message' => $profile?->ai_welcome_message ?: "Hello! I am Vikash's AI Digital Twin. Feel free to ask me anything about Vikash's 5+ years of software experience, 3D WebGL projects, tech stack, or booking a consultation.",
        ]);
    }

    /**
     * Update Gemini API settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'gemini_api_key' => 'nullable|string',
            'ai_system_prompt' => 'nullable|string',
            'ai_welcome_message' => 'nullable|string',
        ]);

        $profile = ProfileSetting::first();
        if (!$profile) {
            $profile = ProfileSetting::create(['name' => 'Vikash Kumar', 'email' => 'vikash@example.com']);
        }

        // Only overwrite key if user provided a non-masked value
        if (isset($validated['gemini_api_key']) && !str_starts_with($validated['gemini_api_key'], '••••')) {
            $profile->gemini_api_key = $validated['gemini_api_key'];
        }

        if (isset($validated['ai_system_prompt'])) {
            $profile->ai_system_prompt = $validated['ai_system_prompt'];
        }

        if (isset($validated['ai_welcome_message'])) {
            $profile->ai_welcome_message = $validated['ai_welcome_message'];
        }

        $profile->save();

        return response()->json([
            'success' => true,
            'message' => 'AI Assistant settings updated successfully.',
        ]);
    }

    /**
     * Test connection to Gemini API.
     */
    public function testConnection(Request $request): JsonResponse
    {
        $profile = ProfileSetting::first();
        $apiKey = $request->input('api_key') ?: ($profile?->gemini_api_key ?: env('GEMINI_API_KEY'));

        if (empty($apiKey) || str_starts_with($apiKey, '••••')) {
            $apiKey = $profile?->gemini_api_key ?: env('GEMINI_API_KEY');
        }

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid Gemini API Key to test.',
            ], 422);
        }

        try {
            $models = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
            $lastError = 'Connection error';

            foreach ($models as $m) {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$m}:generateContent?key={$apiKey}";
                $res = Http::timeout(12)->post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => 'Hello! Output: Connected.']]],
                    ],
                ]);

                if ($res->successful()) {
                    return response()->json([
                        'success' => true,
                        'message' => "Gemini API connection test passed successfully using model {$m}!",
                    ]);
                }

                $lastError = $res->json()['error']['message'] ?? 'Connection error';
            }

            return response()->json([
                'success' => false,
                'message' => 'Gemini API returned: ' . $lastError,
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
