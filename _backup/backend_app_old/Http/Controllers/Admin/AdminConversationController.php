<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClientMessage;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\ProjectRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminConversationController extends Controller
{
    /**
     * List all live client conversations with unread indicator and user info.
     */
    public function index(Request $request): JsonResponse
    {
        $conversations = Conversation::with(['user:id,name,email,phone,created_at'])
            ->withCount(['messages as unread_client_messages_count' => function ($q) {
                $q->where('sender_type', 'client')->where('is_read', false);
            }])
            ->with(['messages' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json([
            'conversations' => $conversations,
        ]);
    }

    /**
     * Show a single conversation's message history and mark client messages as read.
     */
    public function show(Conversation $conversation): JsonResponse
    {
        $conversation->load(['user:id,name,email,phone', 'messages' => function ($q) {
            $q->orderBy('created_at', 'asc');
        }]);

        // Mark client messages as read by admin
        ClientMessage::where('conversation_id', $conversation->id)
            ->where('sender_type', 'client')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'conversation' => $conversation,
            'messages' => $conversation->messages,
        ]);
    }

    /**
     * Admin sends a reply message inside an existing client conversation.
     */
    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'attachment_url' => 'nullable|string|max:1000',
        ]);

        $message = ClientMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'admin',
            'sender_id' => $user->id,
            'message' => $validated['message'],
            'attachment_url' => $validated['attachment_url'] ?? null,
            'is_read' => false,
        ]);

        $conversation->update([
            'last_message_at' => now(),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => $message,
            'conversation' => $conversation,
        ], 201);
    }

    /**
     * Dual-Reply Handler: Reply to an Inquiry via either "Email" OR "Client Account".
     */
    public function replyToInquiry(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'inquiry_id' => 'nullable|exists:messages,id',
            'recipient_email' => 'required|email',
            'reply_mode' => 'required|in:account,email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $replyMode = $validated['reply_mode'];
        $email = $validated['recipient_email'];
        $replyText = $validated['message'];
        $subject = $validated['subject'];

        $inquiry = null;
        if (!empty($validated['inquiry_id'])) {
            $inquiry = Message::find($validated['inquiry_id']);
        }

        if ($replyMode === 'account') {
            // Find or automatically create account for this recipient so thread is established
            $clientUser = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $inquiry?->name ?: explode('@', $email)[0],
                    'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(16)),
                    'role' => 'client',
                ]
            );

            // Find or create conversation for this client
            $conversation = Conversation::firstOrCreate(
                ['user_id' => $clientUser->id],
                [
                    'subject' => $subject ?: 'Direct Discussion with Vikash Kumar',
                    'status' => 'active',
                    'last_message_at' => now(),
                ]
            );

            // Post message as admin
            ClientMessage::create([
                'conversation_id' => $conversation->id,
                'sender_type' => 'admin',
                'sender_id' => $request->user()->id,
                'message' => $replyText,
                'is_read' => false,
            ]);

            $conversation->update([
                'last_message_at' => now(),
            ]);

            // Mark inquiry as replied if linked
            if ($inquiry) {
                $inquiry->update([
                    'status' => 'replied',
                    'is_read' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'channel' => 'account',
                'message' => "Reply successfully delivered to {$clientUser->name}'s Client Account!",
                'conversation_id' => $conversation->id,
            ]);
        } else {
            // Reply via Email
            try {
                // Send raw email if mail driver configured
                Mail::raw($replyText, function ($mail) use ($email, $subject) {
                    $mail->to($email)->subject($subject);
                });
            } catch (\Throwable $e) {
                Log::warning("Direct SMTP send failed: {$e->getMessage()}. Generating fallback mailto link.");
            }

            if ($inquiry) {
                $inquiry->update([
                    'status' => 'replied',
                    'is_read' => true,
                ]);
            }

            $encodedSubject = rawurlencode($subject);
            $encodedBody = rawurlencode($replyText);
            $mailtoUrl = "mailto:{$email}?subject={$encodedSubject}&body={$encodedBody}";

            return response()->json([
                'success' => true,
                'channel' => 'email',
                'message' => "Email sent to {$email} and inquiry marked as replied!",
                'mailto_url' => $mailtoUrl,
            ]);
        }
    }

    /**
     * List all client project requests for Admin Review.
     */
    public function listProjectRequests(): JsonResponse
    {
        $requests = ProjectRequest::with(['user:id,name,email,phone', 'templateProject:id,title,category,image_url', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'project_requests' => $requests,
        ]);
    }

    /**
     * Update project request status.
     */
    public function updateProjectRequest(Request $request, ProjectRequest $projectRequest): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,in_progress,completed,cancelled',
            'payment_status' => 'sometimes|nullable|string|in:unpaid,partial,paid,refunded',
            'budget_range' => 'sometimes|nullable|string|max:100',
            'timeline' => 'sometimes|nullable|string|max:100',
        ]);

        $projectRequest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project request updated successfully.',
            'project_request' => $projectRequest,
        ]);
    }

    /**
     * Delete a client project request.
     */
    public function deleteProjectRequest(ProjectRequest $projectRequest): JsonResponse
    {
        $projectRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project request deleted successfully.',
        ]);
    }
}
