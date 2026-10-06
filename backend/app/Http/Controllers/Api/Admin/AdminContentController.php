<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\{
    Experience, Education, Certificate, Achievement,
    Testimonial, Blog, SocialLink, NavigationItem, Media, ActivityLog
};
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminContentController extends Controller {
    use ApiResponse;

    // --- EXPERIENCES ---
    public function experiences() {
        return $this->success(Experience::orderBy('display_order')->latest('start_date')->get());
    }
    public function storeExperience(Request $request) {
        $validated = $request->validate([
            'company' => 'required|string',
            'position' => 'required|string',
            'period' => 'nullable|string',
            'start_date' => 'nullable|string',
            'end_date' => 'nullable|string',
            'is_current' => 'nullable|boolean',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'company_logo' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);
        $item = Experience::create($validated);
        return $this->success($item, 'Experience created');
    }
    public function updateExperience(Request $request, $id) {
        $item = Experience::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Experience updated');
    }
    public function deleteExperience($id) {
        $item = Experience::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Experience deleted');
    }

    // --- EDUCATION ---
    public function educations() {
        return $this->success(Education::orderBy('display_order')->get());
    }
    public function storeEducation(Request $request) {
        $validated = $request->validate([
            'institution' => 'required|string',
            'degree' => 'required|string',
            'field_of_study' => 'nullable|string',
            'start_date' => 'nullable|string',
            'end_date' => 'nullable|string',
            'grade' => 'nullable|string',
            'description' => 'nullable|string',
            'institution_logo' => 'nullable|string',
            'certificate_url' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);
        $item = Education::create($validated);
        return $this->success($item, 'Education created');
    }
    public function updateEducation(Request $request, $id) {
        $item = Education::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Education updated');
    }
    public function deleteEducation($id) {
        $item = Education::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Education deleted');
    }

    // --- CERTIFICATES ---
    public function certificates() {
        return $this->success(Certificate::orderBy('display_order')->get());
    }
    public function storeCertificate(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'issuer' => 'required|string',
            'issue_date' => 'nullable|string',
            'credential_id' => 'nullable|string',
            'credential_url' => 'nullable|string',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);
        $item = Certificate::create($validated);
        return $this->success($item, 'Certificate created');
    }
    public function updateCertificate(Request $request, $id) {
        $item = Certificate::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Certificate updated');
    }
    public function deleteCertificate($id) {
        $item = Certificate::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Certificate deleted');
    }

    // --- ACHIEVEMENTS ---
    public function achievements() {
        return $this->success(Achievement::orderBy('display_order')->get());
    }
    public function storeAchievement(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'nullable|string',
            'image_url' => 'nullable|string',
            'external_link' => 'nullable|string',
            'display_order' => 'nullable|integer',
        ]);
        $item = Achievement::create($validated);
        return $this->success($item, 'Achievement created');
    }
    public function updateAchievement(Request $request, $id) {
        $item = Achievement::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Achievement updated');
    }
    public function deleteAchievement($id) {
        $item = Achievement::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Achievement deleted');
    }

    // --- TESTIMONIALS / REVIEWS ---
    public function testimonials() {
        return $this->success(Testimonial::latest()->get());
    }
    public function storeTestimonial(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'designation' => 'nullable|string',
            'company' => 'nullable|string',
            'avatar_url' => 'nullable|string',
            'content' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_approved' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
        ]);
        $item = Testimonial::create($validated);
        return $this->success($item, 'Review created');
    }
    public function updateTestimonial(Request $request, $id) {
        $item = Testimonial::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Review updated');
    }
    public function deleteTestimonial($id) {
        $item = Testimonial::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Review deleted');
    }
    public function toggleApproveTestimonial($id) {
        $item = Testimonial::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update(['is_approved' => !$item->is_approved]);
        return $this->success($item);
    }
    public function toggleFeatureTestimonial($id) {
        $item = Testimonial::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update(['is_featured' => !$item->is_featured]);
        return $this->success($item);
    }

    // --- BLOGS ---
    public function blogs() {
        return $this->success(Blog::latest()->get());
    }
    public function storeBlog(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'slug' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'status' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
        ]);
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . rand(100, 999);
        }
        $item = Blog::create($validated);
        return $this->success($item, 'Post created');
    }
    public function updateBlog(Request $request, $id) {
        $item = Blog::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Post updated');
    }
    public function deleteBlog($id) {
        $item = Blog::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Post deleted');
    }

    // --- SOCIAL LINKS ---
    public function socials() {
        return $this->success(SocialLink::orderBy('display_order')->get());
    }
    public function storeSocial(Request $request) {
        $validated = $request->validate([
            'platform' => 'required|string',
            'username' => 'nullable|string',
            'url' => 'required|string',
            'icon' => 'nullable|string',
            'is_visible' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);
        $item = SocialLink::create($validated);
        return $this->success($item, 'Social link created');
    }
    public function updateSocial(Request $request, $id) {
        $item = SocialLink::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Social link updated');
    }
    public function deleteSocial($id) {
        $item = SocialLink::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Social link deleted');
    }

    // --- NAVIGATION ITEMS ---
    public function navigation() {
        return $this->success(NavigationItem::orderBy('display_order')->get());
    }
    public function storeNavigation(Request $request) {
        $validated = $request->validate([
            'label' => 'required|string',
            'url' => 'required|string',
            'icon' => 'nullable|string',
            'is_visible' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);
        $item = NavigationItem::create($validated);
        return $this->success($item, 'Navigation item created');
    }
    public function updateNavigation(Request $request, $id) {
        $item = NavigationItem::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->update($request->all());
        return $this->success($item, 'Navigation item updated');
    }
    public function deleteNavigation($id) {
        $item = NavigationItem::find($id);
        if (!$item) return $this->error('Not found', 404);
        $item->delete();
        return $this->success(null, 'Navigation item deleted');
    }

    // --- MEDIA LIBRARY ---
    public function media() {
        return $this->success(Media::latest()->get());
    }
    public function uploadMedia(Request $request) {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,pdf,mp4,webm,zip|max:10240', // 10MB max safe media types only
            'category' => 'nullable|string',
        ]);
        $file = $request->file('file');
        $category = $request->input('category', 'general');
        $filename = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads/' . $category, $filename, 'public');
        $dimensions = null;
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $imgSize = @getimagesize($file->getRealPath());
            if ($imgSize) $dimensions = "{$imgSize[0]}x{$imgSize[1]}";
        }

        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'url' => '/storage/' . $path,
            'path' => $path,
            'category' => $category,
            'size_bytes' => $file->getSize(),
            'dimensions' => $dimensions,
            'mime_type' => $file->getMimeType(),
        ]);

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'media_upload',
            'details' => "Uploaded file {$media->name} to category {$category}",
            'ip_address' => $request->ip(),
        ]);

        return $this->success($media, 'Media uploaded successfully');
    }
    public function deleteMedia($id) {
        $item = Media::find($id);
        if (!$item) return $this->error('Media not found', 404);
        $item->delete();
        return $this->success(null, 'Media deleted');
    }
}
