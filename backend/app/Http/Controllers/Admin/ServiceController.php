<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::orderBy('sort_order')->get();
        return response()->json(['services' => $services]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'icon' => 'nullable|string|max:100',
            'color_gradient' => 'nullable|string|max:100',
            'sort_order' => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(4);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'service' => $service,
            'message' => 'Service created successfully.',
        ], 201);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'icon' => 'nullable|string|max:100',
            'color_gradient' => 'nullable|string|max:100',
            'sort_order' => 'integer',
        ]);

        $service->update($validated);

        return response()->json([
            'success' => true,
            'service' => $service,
            'message' => 'Service updated successfully.',
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully.',
        ]);
    }
}
