<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Models\Skill;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
class AdminSkillController extends Controller {
    use ApiResponse;
    public function index() { return $this->success(Skill::orderBy('category')->orderBy('display_order')->get()); }
    public function store(StoreSkillRequest $request) { return $this->success(Skill::create($request->validated())); }
    public function show($id) {
        $skill = Skill::find($id);
        return $skill ? $this->success($skill) : $this->error('Not found', 404);
    }
    public function update(Request $request, $id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->update($request->all());
        return $this->success($skill);
    }
    public function destroy($id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->delete();
        return $this->success(null, 'Deleted');
    }
    public function updateOrder(Request $request, $id) {
        $skill = Skill::find($id);
        if (!$skill) return $this->error('Not found', 404);
        $skill->update(['display_order' => $request->display_order]);
        return $this->success($skill);
    }
}
