<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
class AdminProjectController extends Controller {
    use ApiResponse;
    public function index() { return $this->success(Project::latest()->get()); }
    public function store(StoreProjectRequest $request) {
        $data = $request->validated();
        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_url'] = '/storage/' . $request->file('thumbnail')->store('projects', 'public');
        }
        $project = Project::create($data);
        return $this->success($project);
    }
    public function show($id) {
        $project = Project::find($id);
        return $project ? $this->success($project) : $this->error('Not found', 404);
    }
    public function update(Request $request, $id) {
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);
        $project->update($request->all());
        return $this->success($project);
    }
    public function destroy($id) {
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);
        $project->delete();
        return $this->success(null, 'Deleted');
    }
    public function togglePin($id) {
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);
        $project->update(['is_pinned' => !$project->is_pinned]);
        return $this->success($project);
    }
    public function updateOrder(Request $request, $id) {
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);
        $project->update(['display_order' => $request->display_order]);
        return $this->success($project);
    }
}
