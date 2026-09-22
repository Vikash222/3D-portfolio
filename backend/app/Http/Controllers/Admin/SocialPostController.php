<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocialPostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = SocialPost::orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json(['posts' => $posts]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'platform' => 'required|string|in:instagram,linkedin,github,twitter',
            'post_url' => 'required|url|max:500',
            'title' => 'nullable|string|max:200',
            'caption' => 'nullable|string|max:2000',
            'image_url' => 'nullable|string|max:500',
            'author_name' => 'nullable|string|max:100',
            'metrics' => 'nullable|array',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if (empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = SocialPost::create($validated);

        return response()->json([
            'success' => true,
            'post' => $post,
            'message' => 'Social post added to live feed successfully.',
        ], 201);
    }

    public function update(Request $request, SocialPost $socialPost): JsonResponse
    {
        $validated = $request->validate([
            'platform' => 'sometimes|required|string|in:instagram,linkedin,github,twitter',
            'post_url' => 'sometimes|required|url|max:500',
            'title' => 'nullable|string|max:200',
            'caption' => 'nullable|string|max:2000',
            'image_url' => 'nullable|string|max:500',
            'author_name' => 'nullable|string|max:100',
            'metrics' => 'nullable|array',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $socialPost->update($validated);

        return response()->json([
            'success' => true,
            'post' => $socialPost,
            'message' => 'Social post updated successfully.',
        ]);
    }

    public function destroy(SocialPost $socialPost): JsonResponse
    {
        $socialPost->delete();

        return response()->json([
            'success' => true,
            'message' => 'Social post removed from feed.',
        ]);
    }

    public function togglePin(SocialPost $socialPost): JsonResponse
    {
        $socialPost->is_pinned = !$socialPost->is_pinned;
        $socialPost->save();

        return response()->json([
            'success' => true,
            'is_pinned' => $socialPost->is_pinned,
            'message' => $socialPost->is_pinned ? 'Post pinned to top of feed.' : 'Post unpinned.',
        ]);
    }
}
