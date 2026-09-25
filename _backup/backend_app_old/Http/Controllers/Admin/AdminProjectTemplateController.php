<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProjectTemplateController extends Controller
{
    /**
     * Display a listing of all project templates.
     */
    public function index(): JsonResponse
    {
        $templates = ProjectTemplate::orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();

        return response()->json([
            'templates' => $templates,
        ]);
    }

    /**
     * Store a newly created template in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'slug' => 'nullable|string|max:200|unique:project_templates,slug',
            'category' => 'required|string|max:100',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'budget_range' => 'nullable|string|max:100',
            'timeline' => 'nullable|string|max:100',
            'features' => 'nullable|array',
            'demo_url' => 'nullable|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . rand(100, 999);
        }

        $template = ProjectTemplate::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Showcase template created successfully.',
            'template' => $template,
        ], 201);
    }

    /**
     * Display the specified template.
     */
    public function show(ProjectTemplate $projectTemplate): JsonResponse
    {
        return response()->json([
            'template' => $projectTemplate,
        ]);
    }

    /**
     * Update the specified template in storage.
     */
    public function update(Request $request, ProjectTemplate $projectTemplate): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'slug' => 'nullable|string|max:200|unique:project_templates,slug,' . $projectTemplate->id,
            'category' => 'sometimes|required|string|max:100',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'budget_range' => 'nullable|string|max:100',
            'timeline' => 'nullable|string|max:100',
            'features' => 'nullable|array',
            'demo_url' => 'nullable|string|max:500',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $projectTemplate->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Showcase template updated successfully.',
            'template' => $projectTemplate,
        ]);
    }

    /**
     * Remove the specified template from storage.
     */
    public function destroy(ProjectTemplate $projectTemplate): JsonResponse
    {
        $projectTemplate->delete();

        return response()->json([
            'success' => true,
            'message' => 'Showcase template deleted successfully.',
        ]);
    }
}
