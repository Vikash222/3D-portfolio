<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\Message;
use App\Models\ProfileSetting;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPortfolioController extends Controller
{
    /**
     * Get aggregated portfolio data for public display.
     */
    public function index(): JsonResponse
    {
        $profile = ProfileSetting::first();
        if (!$profile) {
            $profile = ProfileSetting::create([
                'name' => 'Vikash Kumar',
                'title' => 'Lead Full-Stack Engineer & AI Architect',
                'tagline' => 'Engineering High-Performance Web Platforms, 3D Experiences & Resilient Cloud Architectures',
                'bio' => 'Passionate software engineer with 5+ years of experience building mission-critical distributed systems, interactive 3D web interfaces, and modern full-stack web applications. Dedicated to exceptional UX, rock-solid security, and scalable cloud backends.',
                'email' => 'vikash@example.com',
                'phone' => '+91 98765 43210',
                'location' => 'Bengaluru, India / Remote Global',
                'status_badge' => 'Available for High-Impact Roles',
                'years_experience' => 5,
                'projects_completed' => 45,
                'satisfied_clients' => 30,
                'code_commits' => '18K+',
            ]);
        }

        $skills = Skill::orderBy('sort_order')->get();
        $projects = Project::orderBy('sort_order')->get();
        $experiences = Experience::orderBy('sort_order')->get();
        $services = Service::orderBy('sort_order')->get();
        $testimonials = Testimonial::orderBy('sort_order')->get();
        $pricingPackages = \App\Models\PricingPackage::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'profile' => $profile,
            'skills' => $skills,
            'projects' => $projects,
            'experiences' => $experiences,
            'services' => $services,
            'testimonials' => $testimonials,
            'pricing_packages' => $pricingPackages,
        ]);
    }

    /**
     * Get active freelance pricing packages.
     */
    public function pricingPackages(): JsonResponse
    {
        $packages = \App\Models\PricingPackage::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'pricing_packages' => $packages,
        ]);
    }

    /**
     * Get active showcase project templates for the interactive builder.
     */
    public function projectTemplates(): JsonResponse
    {
        $templates = \App\Models\ProjectTemplate::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'project_templates' => $templates,
        ]);
    }

    /**
     * Handle incoming contact inquiry from the frontend form.
     */
    public function contact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string|min:10|max:5000',
        ]);

        $message = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'] ?? 'Portfolio Inquiry',
            'message' => $validated['message'],
            'is_read' => false,
            'status' => 'unread',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. I will get back to you shortly.',
            'data' => [
                'id' => $message->id,
                'created_at' => $message->created_at,
            ]
        ], 201);
    }
}
