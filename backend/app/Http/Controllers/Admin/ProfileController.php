<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfileSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = ProfileSetting::first();
        if (!$profile) {
            $profile = ProfileSetting::create([
                'name' => 'Vikash Kumar',
                'title' => 'Senior Full-Stack & AI Systems Engineer',
                'tagline' => 'Crafting High-Performance Web Applications, 3D Interactive Interfaces & Scalable Cloud Backends',
                'bio' => 'Passionate software engineer building robust distributed systems and modern web experiences.',
                'email' => 'vikash@example.com',
                'location' => 'Bengaluru, India / Remote Worldwide',
                'years_experience' => 5,
                'projects_completed' => 42,
                'satisfied_clients' => 28,
                'code_commits' => '15K+',
            ]);
        }

        return response()->json(['profile' => $profile]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'title' => 'required|string|max:200',
            'tagline' => 'nullable|string|max:300',
            'bio' => 'nullable|string',
            'about_details' => 'nullable|array',
            'avatar_url' => 'nullable|string',
            'hero_image_url' => 'nullable|string',
            'camp_image_url' => 'nullable|string',
            'camp_title' => 'nullable|string|max:200',
            'camp_caption' => 'nullable|string',
            'camp_gallery' => 'nullable|array',
            'resume_url' => 'nullable|string',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:30',
            'location' => 'nullable|string|max:150',
            'github' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'twitter' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'status_badge' => 'nullable|string|max:100',
            'years_experience' => 'integer|min:0',
            'projects_completed' => 'integer|min:0',
            'satisfied_clients' => 'integer|min:0',
            'gemini_api_key' => 'nullable|string',
            'ai_system_prompt' => 'nullable|string',
            'ai_welcome_message' => 'nullable|string',
            'razorpay_key_id' => 'nullable|string|max:150',
            'razorpay_key_secret' => 'nullable|string|max:150',
            'razorpay_payment_link' => 'nullable|string|max:255',
            'freelance_status' => 'nullable|string|max:100',
        ]);

        $profile = ProfileSetting::first();
        if (!$profile) {
            $profile = ProfileSetting::create($validated);
        } else {
            $profile->update($validated);
        }

        return response()->json([
            'success' => true,
            'profile' => $profile,
            'message' => 'Profile settings updated successfully.',
        ]);
    }
}
