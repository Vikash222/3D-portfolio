<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Message;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
class AdminProfileController extends Controller {
    use ApiResponse;
    public function stats() {
        $profile = Profile::first();
        return $this->success([
            'total_projects' => Project::count(),
            'total_messages' => Message::count(),
            'unread_messages' => Message::where('is_read', false)->count(),
            'resume_downloads' => $profile ? $profile->resume_downloads : 0,
            'pinned_projects' => Project::where('is_pinned', true)->count(),
            'last_login' => request()->user()->last_login_at
        ]);
    }
    public function show() { return $this->success(Profile::first()); }
    public function update(Request $request) {
        $profile = Profile::first();
        if (!$profile) return $this->error('Not found', 404);
        $profile->update($request->all());
        return $this->success($profile);
    }
    public function uploadImage(Request $request) {
        $request->validate(['image' => 'required|image']);
        $profile = Profile::first();
        $path = $request->file('image')->store('profile', 'public');
        $profile->update(['profile_image_url' => '/storage/'.$path]);
        return $this->success($profile);
    }
    public function uploadResume(Request $request) {
        $request->validate(['resume' => 'required|file|mimes:pdf']);
        $profile = Profile::first();
        $path = $request->file('resume')->store('resume', 'public');
        $profile->update(['resume_url' => '/storage/'.$path]);
        return $this->success($profile);
    }
}
