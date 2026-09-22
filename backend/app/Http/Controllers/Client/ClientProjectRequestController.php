<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ClientMessage;
use App\Models\Conversation;
use App\Models\ProjectRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientProjectRequestController extends Controller
{
    /**
     * List all project requests submitted by the authenticated client.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $requests = ProjectRequest::with(['templateProject', 'payments'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'project_requests' => $requests,
        ]);
    }

    /**
     * Submit a new project requirement / template order.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'template_project_id' => 'nullable|exists:projects,id',
            'budget_range' => 'required|string|max:100',
            'timeline' => 'required|string|max:100',
            'description' => 'required|string|max:10000',
            'features_json' => 'nullable|array',
        ]);

        $projectRequest = ProjectRequest::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'template_project_id' => $validated['template_project_id'] ?? null,
            'budget_range' => $validated['budget_range'],
            'timeline' => $validated['timeline'],
            'description' => $validated['description'],
            'features_json' => $validated['features_json'] ?? [],
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        $projectRequest->load('templateProject');

        // Post notice in the client's live conversation thread
        $conversation = Conversation::firstOrCreate(
            ['user_id' => $user->id],
            [
                'subject' => 'Discussion with Vikash Kumar',
                'status' => 'active',
                'last_message_at' => now(),
            ]
        );

        $templateNotice = $projectRequest->templateProject
            ? " (Based on showcase template: '{$projectRequest->templateProject->title}')"
            : "";

        ClientMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'client',
            'sender_id' => $user->id,
            'message' => "📋 [Project Request Submitted] {$projectRequest->title}{$templateNotice}\nBudget: {$projectRequest->budget_range} | Timeline: {$projectRequest->timeline}\n\n{$projectRequest->description}",
            'is_read' => false,
        ]);

        $conversation->update([
            'last_message_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project request submitted successfully! Vikash has been notified.',
            'project_request' => $projectRequest,
        ], 201);
    }

    /**
     * Get details of a single project request.
     */
    public function show(Request $request, ProjectRequest $projectRequest): JsonResponse
    {
        if ($projectRequest->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $projectRequest->load(['templateProject', 'payments']);

        return response()->json([
            'project_request' => $projectRequest,
        ]);
    }
}
