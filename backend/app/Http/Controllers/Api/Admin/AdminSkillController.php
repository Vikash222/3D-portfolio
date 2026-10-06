<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminSkillController extends Controller {
    use ApiResponse;

    public function index() {
        return $this->success(Skill::orderBy('category_name')->orderBy('display_order')->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'category_name' => 'required|string',
            'category' => 'nullable|string',
            'proficiency' => 'nullable|integer|min:10|max:100',
            'proficiency_level' => 'nullable|integer',
            'icon' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_enabled' => 'nullable|boolean',
        ]);
        if (empty($validated['category'])) {
            $validated['category'] = 'Web';
        }
        $skill = Skill::create($validated);
        return $this->success($skill, 'Skill created');
    }

    public function show($id) {
        $skill = Skill::find($id);
        return $skill ? $this->success($skill) : $this->error('Not found', 404);
    }

    public function update(Request $request, $id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->update($request->all());
        return $this->success($skill, 'Skill updated');
    }

    public function destroy($id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->delete();
        return $this->success(null, 'Skill deleted');
    }

    public function updateOrder(Request $request, $id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->update(['display_order' => $request->display_order]);
        return $this->success($skill);
    }

    public function toggleEnabled($id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->update(['is_enabled' => !$skill->is_enabled]);
        return $this->success($skill);
    }
}
