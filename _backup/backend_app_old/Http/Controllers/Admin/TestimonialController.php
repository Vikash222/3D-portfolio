<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::orderBy('sort_order')->get();
        return response()->json(['testimonials' => $testimonials]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'role' => 'required|string|max:150',
            'company' => 'nullable|string|max:150',
            'content' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'avatar_url' => 'nullable|string',
            'is_verified' => 'boolean',
            'linkedin_url' => 'nullable|url',
            'project_context' => 'nullable|string|max:200',
            'sort_order' => 'integer',
        ]);

        $testimonial = Testimonial::create($validated);

        return response()->json([
            'success' => true,
            'testimonial' => $testimonial,
            'message' => 'Endorsement created successfully.',
        ], 201);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'role' => 'required|string|max:150',
            'company' => 'nullable|string|max:150',
            'content' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'avatar_url' => 'nullable|string',
            'is_verified' => 'boolean',
            'linkedin_url' => 'nullable|url',
            'project_context' => 'nullable|string|max:200',
            'sort_order' => 'integer',
        ]);

        $testimonial->update($validated);

        return response()->json([
            'success' => true,
            'testimonial' => $testimonial,
            'message' => 'Endorsement updated successfully.',
        ]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Endorsement deleted successfully.',
        ]);
    }
}
