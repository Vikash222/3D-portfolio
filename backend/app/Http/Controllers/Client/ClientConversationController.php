<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ClientMessage;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientConversationController extends Controller
{
    /**
     * Get or create the authenticated client's active 1-on-1 conversation.
     */
    public function getActiveConversation(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::with(['messages' => function ($q) {
            $q->orderBy('created_at', 'asc');
        }])->where('user_id', $user->id)->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => $user->id,
                'subject' => 'Discussion with Vikash Kumar',
                'status' => 'active',
                'last_message_at' => now(),
            ]);

            // Create initial welcome message from Vikash
            ClientMessage::create([
                'conversation_id' => $conversation->id,
                'sender_type' => 'admin',
                'sender_id' => null,
                'message' => "Hi {$user->name}! 👋 Welcome to your private client portal. Feel free to describe your project requirements, request a custom quote, or ask any technical questions. I'm here to help!",
                'is_read' => false,
            ]);

            $conversation->load('messages');
        }

        return response()->json([
            'conversation' => $conversation,
            'messages' => $conversation->messages,
        ]);
    }

    /**
     * Send a new message in the client conversation.
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'attachment_url' => 'nullable|string|max:1000',
        ]);

        $conversation = Conversation::firstOrCreate(
            ['user_id' => $user->id],
            [
                'subject' => 'Discussion with Vikash Kumar',
                'status' => 'active',
                'last_message_at' => now(),
            ]
        );

        $message = ClientMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'client',
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
     * Mark unread messages in the conversation as read by the client.
     */
    public function markAsRead(Request $request): JsonResponse
    {
        $user = $request->user();
        $conversation = Conversation::where('user_id', $user->id)->first();

        if ($conversation) {
            ClientMessage::where('conversation_id', $conversation->id)
                ->where('sender_type', 'admin')
                ->where('is_read', false)
                ->update(['is_read' => true]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Messages marked as read.',
        ]);
    }
}
