<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{
    Profile, Project, Skill, Experience, Education, Certificate,
    Achievement, Testimonial, SocialLink, NavigationItem,
    AnalyticsEvent, AdminNotification, Message
};
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller {
    use ApiResponse;

    public function index() {
        $profile = Profile::first();
        $skills = Skill::where('is_enabled', true)->orderBy('display_order')->get();
        $projects = Project::where('status', 'published')->orderBy('is_pinned', 'desc')->orderBy('display_order')->get();
        $experiences = Experience::orderBy('display_order')->latest('start_date')->get();
        $educations = Education::orderBy('display_order')->get();
        $certificates = Certificate::orderBy('display_order')->get();
        $achievements = Achievement::orderBy('display_order')->get();
        $testimonials = Testimonial::where('is_approved', true)->where('is_published', true)->get();
        $socials = SocialLink::where('is_visible', true)->orderBy('display_order')->get();
        $navs = NavigationItem::where('is_visible', true)->orderBy('display_order')->get();

        return $this->success([
            'profile' => $profile,
            'skills' => $skills,
            'projects' => $projects,
            'experiences' => $experiences,
            'educations' => $educations,
            'certificates' => $certificates,
            'achievements' => $achievements,
            'testimonials' => $testimonials,
            'social_links' => $socials,
            'navigation_items' => $navs,
            'sections_config' => $profile?->sections_config ?? [],
            'theme_settings' => $profile?->theme_settings ?? [],
            'site_settings' => $profile?->site_settings ?? [],
        ]);
    }

    public function trackEvent(Request $request) {
        $ip = $request->ip();
        $userAgent = $request->userAgent() ?? '';
        
        // Detect basic device type
        $device = 'desktop';
        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', $userAgent)) {
            $device = 'tablet';
        } elseif (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', $userAgent)) {
            $device = 'mobile';
        }

        // Basic browser detection
        $browser = 'Unknown';
        if (str_contains($userAgent, 'Chrome') && !str_contains($userAgent, 'Edg')) $browser = 'Chrome';
        elseif (str_contains($userAgent, 'Safari') && !str_contains($userAgent, 'Chrome')) $browser = 'Safari';
        elseif (str_contains($userAgent, 'Firefox')) $browser = 'Firefox';
        elseif (str_contains($userAgent, 'Edg')) $browser = 'Edge';

        AnalyticsEvent::create([
            'ip_hash' => hash('sha256', $ip . date('Y-m-d')),
            'page' => $request->input('page', '/'),
            'referrer' => $request->input('referrer', 'Direct'),
            'device_type' => $device,
            'browser' => $browser,
            'os' => 'Client',
            'country' => 'Global',
        ]);

        return $this->success(null, 'Event tracked');
    }

    public function trackSocialClick($id) {
        $link = SocialLink::find($id);
        if ($link) {
            $link->increment('clicks_count');
        }
        return $this->success(null);
    }

    public function submitReview(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'designation' => 'nullable|string|max:100',
            'company' => 'nullable|string|max:100',
            'content' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $validated['is_approved'] = false; // Public submissions require admin approval
        $validated['is_published'] = true;
        $review = Testimonial::create($validated);

        AdminNotification::create([
            'title' => 'New Review Submitted',
            'message' => "{$review->name} submitted a {$review->rating}-star testimonial pending approval.",
            'type' => 'review',
            'link' => '/admin/reviews',
        ]);

        return $this->success($review, 'Thank you! Your review has been submitted for approval.');
    }
}
