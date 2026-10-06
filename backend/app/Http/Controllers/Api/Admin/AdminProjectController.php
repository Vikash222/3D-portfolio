<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminProjectController extends Controller {
    use ApiResponse;

    public function index(Request $request) {
        $query = Project::query();
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
            });
        }
        return $this->success($query->orderBy('is_pinned', 'desc')->orderBy('display_order')->latest()->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'nullable|string',
            'long_description' => 'nullable|string',
            'tech_tags' => 'nullable|array',
            'thumbnail_url' => 'nullable|string',
            'screenshots' => 'nullable|array',
            'video_url' => 'nullable|string',
            'features' => 'nullable|array',
            'github_link' => 'nullable|string',
            'live_link' => 'nullable|string',
            'is_pinned' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft,archived',
            'display_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_url'] = '/storage/' . $request->file('thumbnail')->store('projects', 'public');
        }

        $project = Project::create($data);

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'project_create',
            'details' => "Created project '{$project->title}'",
            'ip_address' => $request->ip(),
        ]);

        return $this->success($project, 'Project created');
    }

    public function show($id) {
        $project = Project::find($id);
        return $project ? $this->success($project) : $this->error('Not found', 404);
    }

    public function update(Request $request, $id) {
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);

        $data = $request->all();
        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_url'] = '/storage/' . $request->file('thumbnail')->store('projects', 'public');
        }

        $project->update($data);

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'project_update',
            'details' => "Updated project '{$project->title}'",
            'ip_address' => $request->ip(),
        ]);

        return $this->success($project, 'Project updated');
    }

    public function destroy($id) {
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);
        $title = $project->title;
        $project->delete();

        ActivityLog::create([
            'user_name' => request()->user()?->name ?? 'Admin',
            'action' => 'project_delete',
            'details' => "Deleted project '{$title}'",
            'ip_address' => request()->ip(),
        ]);

        return $this->success(null, 'Project deleted');
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

    public function updateStatus(Request $request, $id) {
        $request->validate(['status' => 'required|in:published,draft,archived']);
        $project = Project::find($id);
        if (!$project) return $this->error('Not found', 404);
        $project->update(['status' => $request->status]);
        return $this->success($project);
    }
}
