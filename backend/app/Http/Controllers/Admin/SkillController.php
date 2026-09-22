<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(): JsonResponse
    {
        $skills = Skill::orderBy('sort_order')->get();
        return response()->json(['skills' => $skills]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'icon' => 'nullable|string|max:100',
            'proficiency' => 'required|integer|min:1|max:100',
            'level' => 'required|string|max:50',
            'sort_order' => 'integer',
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'skill' => $skill,
            'message' => 'Skill created successfully.',
        ], 201);
    }

    public function update(Request $request, Skill $skill): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'icon' => 'nullable|string|max:100',
            'proficiency' => 'required|integer|min:1|max:100',
            'level' => 'required|string|max:50',
            'sort_order' => 'integer',
        ]);

        $skill->update($validated);

        return response()->json([
            'success' => true,
            'skill' => $skill,
            'message' => 'Skill updated successfully.',
        ]);
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();
        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully.',
        ]);
    }
}
