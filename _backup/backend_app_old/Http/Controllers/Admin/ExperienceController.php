<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index(): JsonResponse
    {
        $experiences = Experience::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json(['experiences' => $experiences]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company' => 'required|string|max:150',
            'role' => 'required|string|max:150',
            'period' => 'required|string|max:100',
            'location' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'highlights' => 'nullable|array',
            'is_current' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $experience = Experience::create($validated);

        return response()->json([
            'success' => true,
            'experience' => $experience,
            'message' => 'Experience record created successfully.',
        ], 201);
    }

    public function update(Request $request, Experience $experience): JsonResponse
    {
        $validated = $request->validate([
            'company' => 'required|string|max:150',
            'role' => 'required|string|max:150',
            'period' => 'required|string|max:100',
            'location' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'highlights' => 'nullable|array',
            'is_current' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $experience->update($validated);

        return response()->json([
            'success' => true,
            'experience' => $experience,
            'message' => 'Experience record updated successfully.',
        ]);
    }

    public function destroy(Experience $experience): JsonResponse
    {
        $experience->delete();
        return response()->json([
            'success' => true,
            'message' => 'Experience record deleted successfully.',
        ]);
    }
}
