<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminProfileController extends Controller {
    use ApiResponse;

    public function show() {
        return $this->success(Profile::first());
    }

    public function update(Request $request) {
        $profile = Profile::first();
        if (!$profile) return $this->error('Not found', 404);
        $profile->update($request->all());

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'profile_update',
            'details' => 'Updated portfolio content & settings',
            'ip_address' => $request->ip(),
        ]);

        return $this->success($profile, 'Portfolio content updated');
    }

    public function uploadImage(Request $request) {
        if ($request->hasFile('image')) {
            $request->validate(['image' => 'required|image|max:10240']);
            $path = $request->file('image')->store('profile', 'public');
            $url = '/storage/' . $path;
        } elseif ($request->hasFile('file')) {
            $request->validate(['file' => 'required|image|max:10240']);
            $path = $request->file('file')->store('profile', 'public');
            $url = '/storage/' . $path;
        } elseif ($request->filled('image_url')) {
            $url = $request->input('image_url');
        } else {
            return $this->error('No image file or URL provided', 422);
        }

        $profile = Profile::firstOrCreate(['id' => 1]);
        $profile->update(['profile_image_url' => $url]);

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'image_upload',
            'details' => 'Uploaded new profile photo',
            'ip_address' => $request->ip(),
        ]);

        return $this->success($profile, 'Profile photo updated');
    }

    public function uploadResume(Request $request) {
        $request->validate(['resume' => 'required|file|mimes:pdf|max:10240']);
        $profile = Profile::first();
        $path = $request->file('resume')->store('resume', 'public');
        $url = '/storage/' . $path;
        $profile->update(['resume_url' => $url]);

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'resume_upload',
            'details' => 'Uploaded new resume PDF',
            'ip_address' => $request->ip(),
        ]);

        return $this->success($profile, 'Resume updated');
    }
}
