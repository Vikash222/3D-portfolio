<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPricingController extends Controller
{
    /**
     * Display a listing of pricing packages.
     */
    public function index(): JsonResponse
    {
        $packages = PricingPackage::orderBy('sort_order', 'asc')->get();

        return response()->json([
            'packages' => $packages,
        ]);
    }

    /**
     * Store a newly created pricing package.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:pricing_packages,slug',
            'price_inr' => 'required|numeric|min:0',
            'tagline' => 'required|string|max:255',
            'features' => 'required|array',
            'delivery_days' => 'required|integer|min:1',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $package = PricingPackage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pricing package created successfully.',
            'package' => $package,
        ], 201);
    }

    /**
     * Display the specified package.
     */
    public function show(PricingPackage $pricingPackage): JsonResponse
    {
        return response()->json([
            'package' => $pricingPackage,
        ]);
    }

    /**
     * Update the specified pricing package.
     */
    public function update(Request $request, PricingPackage $pricingPackage): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:pricing_packages,slug,' . $pricingPackage->id,
            'price_inr' => 'sometimes|required|numeric|min:0',
            'tagline' => 'sometimes|required|string|max:255',
            'features' => 'sometimes|required|array',
            'delivery_days' => 'sometimes|required|integer|min:1',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $pricingPackage->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pricing package updated successfully.',
            'package' => $pricingPackage,
        ]);
    }

    /**
     * Remove the specified package.
     */
    public function destroy(PricingPackage $pricingPackage): JsonResponse
    {
        $pricingPackage->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pricing package deleted successfully.',
        ]);
    }
}
