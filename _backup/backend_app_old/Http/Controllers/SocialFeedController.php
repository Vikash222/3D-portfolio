<?php

namespace App\Http\Controllers;

use App\Models\SocialPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SocialFeedController extends Controller
{
    /**
     * Get aggregated live social media & activity feed.
     * Merges real-time GitHub public events with database-stored Instagram & LinkedIn posts.
     */
    public function index(Request $request): JsonResponse
    {
        // 1. Fetch live GitHub public events (cached for 180s to respect GitHub rate limits)
        $gitHubEvents = Cache::remember('vikash_github_events', 180, function () {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'VikashKumar-Portfolio/1.0',
                    'Accept' => 'application/vnd.github.v3+json',
                ])->timeout(5)->get('https://api.github.com/users/Vikash222/events/public');

                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                // Fall back gracefully
            }
            return [];
        });

        // 2. Normalize GitHub events into standard feed items
        $normalizedGithub = [];
        foreach (array_slice($gitHubEvents, 0, 10) as $event) {
            $type = $event['type'] ?? 'PushEvent';
            $repoName = $event['repo']['name'] ?? 'Vikash222/repository';
            $shortRepo = str_replace('Vikash222/', '', $repoName);
            $repoUrl = "https://github.com/{$repoName}";
            $createdAt = $event['created_at'] ?? now()->toIso8601String();

            $title = '';
            $caption = '';
            $postUrl = $repoUrl;

            if ($type === 'PushEvent') {
                $commits = $event['payload']['commits'] ?? [];
                $commitCount = count($commits);
                $commitMsg = $commits[0]['message'] ?? 'Code update & enhancements';
                $title = "Pushed {$commitCount} " . ($commitCount === 1 ? 'commit' : 'commits') . " to {$shortRepo}";
                $caption = $commitMsg;
                if (!empty($commits[0]['sha'])) {
                    $postUrl = "{$repoUrl}/commit/{$commits[0]['sha']}";
                }
            } elseif ($type === 'CreateEvent') {
                $refType = $event['payload']['ref_type'] ?? 'repository';
                $title = "Created new {$refType} on {$shortRepo}";
                $caption = $event['payload']['description'] ?? "New active engineering milestone in {$shortRepo}";
            } elseif ($type === 'WatchEvent') {
                $title = "Starred repository {$shortRepo}";
                $caption = "Exploring new architectures & tech solutions";
            } else {
                $title = "Active event on {$shortRepo}";
                $caption = "Open-source development contribution";
            }

            $normalizedGithub[] = [
                'id' => 'gh_' . ($event['id'] ?? uniqid()),
                'platform' => 'github',
                'title' => $title,
                'caption' => $caption,
                'post_url' => $postUrl,
                'repo_name' => $shortRepo,
                'author_name' => 'Vikash Kumar (@Vikash222)',
                'image_url' => null,
                'metrics' => [
                    'commits' => count($event['payload']['commits'] ?? []),
                    'branch' => str_replace('refs/heads/', '', $event['payload']['ref'] ?? 'main'),
                ],
                'is_pinned' => false,
                'published_at' => $createdAt,
            ];
        }

        // 3. Fetch Instagram, LinkedIn, and custom posts from Database
        $dbPosts = SocialPost::orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => 'sp_' . $post->id,
                    'platform' => $post->platform,
                    'title' => $post->title,
                    'caption' => $post->caption,
                    'post_url' => $post->post_url,
                    'repo_name' => null,
                    'author_name' => $post->author_name ?? 'Vikash Kumar',
                    'image_url' => $post->image_url,
                    'metrics' => $post->metrics,
                    'is_pinned' => (bool) $post->is_pinned,
                    'published_at' => $post->published_at ? $post->published_at->toIso8601String() : $post->created_at->toIso8601String(),
                ];
            })
            ->toArray();

        // 4. Merge and sort unified feed
        $unified = array_merge($dbPosts, $normalizedGithub);

        usort($unified, function ($a, $b) {
            // Pinned first
            if (($a['is_pinned'] ?? false) !== ($b['is_pinned'] ?? false)) {
                return ($b['is_pinned'] ?? false) ? 1 : -1;
            }
            // Then date descending
            return strtotime($b['published_at'] ?? 'now') - strtotime($a['published_at'] ?? 'now');
        });

        return response()->json([
            'feed' => $unified,
            'counts' => [
                'total' => count($unified),
                'github' => count($normalizedGithub),
                'instagram' => count(array_filter($dbPosts, fn($p) => $p['platform'] === 'instagram')),
                'linkedin' => count(array_filter($dbPosts, fn($p) => $p['platform'] === 'linkedin')),
            ],
            'last_synced' => now()->toIso8601String(),
        ]);
    }
}
