<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Traits\ApiResponse;
class ProfileController extends Controller {
    use ApiResponse;
    public function show() {
        return $this->success(Profile::first());
    }
    public function downloadResume() {
        $profile = Profile::first();
        if ($profile && $profile->resume_url) {
            $profile->increment('resume_downloads');
            return $this->success(['resume_url' => $profile->resume_url]);
        }
        return $this->error('Resume not found', 404);
    }
}
