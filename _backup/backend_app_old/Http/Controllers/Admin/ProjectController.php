<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return response()->json(['projects' => $projects]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category' => 'required|string|max:100',
            'short_description' => 'required|string',
            'long_description' => 'nullable|string',
            'tech_stack' => 'nullable|array',
            'live_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'image_url' => 'nullable|string',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'project' => $project,
            'message' => 'Project created successfully.',
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json(['project' => $project]);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'category' => 'required|string|max:100',
            'short_description' => 'required|string',
            'long_description' => 'nullable|string',
            'tech_stack' => 'nullable|array',
            'live_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'image_url' => 'nullable|string',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'project' => $project,
            'message' => 'Project updated successfully.',
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();
        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ]);
    }
}
