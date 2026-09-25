<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Traits\ApiResponse;
class SkillController extends Controller {
    use ApiResponse;
    public function index() {
        $skills = Skill::orderBy('display_order')->get()->groupBy('category');
        return $this->success($skills);
    }
}
