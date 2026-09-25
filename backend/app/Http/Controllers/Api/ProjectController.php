<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
class ProjectController extends Controller {
    use ApiResponse;
    public function index(Request $request) {
        $query = Project::query();
        if ($request->has('tag')) {
            $query->whereJsonContains('tech_tags', $request->tag);
        }
        $projects = $query->orderBy('is_pinned', 'desc')
                          ->orderBy('display_order', 'asc')
                          ->orderBy('created_at', 'desc')->get();
        return $this->success($projects);
    }
    public function show($id) {
        $project = Project::find($id);
        return $project ? $this->success($project) : $this->error('Project not found', 404);
    }
}
