<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get all inquiries with optional filter for unread/read.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Message::query();

        if ($request->has('filter')) {
            if ($request->filter === 'unread') {
                $query->where('is_read', false);
            } elseif ($request->filter === 'read') {
                $query->where('is_read', true);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $messages = $query->orderBy('created_at', 'desc')->get();
        $unreadCount = Message::where('is_read', false)->count();

        return response()->json([
            'messages' => $messages,
            'unread_count' => $unreadCount,
            'total_count' => Message::count(),
        ]);
    }

    /**
     * Get a specific message and mark it as read.
     */
    public function show(Message $message): JsonResponse
    {
        if (!$message->is_read) {
            $message->is_read = true;
            $message->status = 'read';
            $message->save();
        }

        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Toggle read status.
     */
    public function toggleRead(Message $message): JsonResponse
    {
        $message->is_read = !$message->is_read;
        $message->status = $message->is_read ? 'read' : 'unread';
        $message->save();

        return response()->json([
            'success' => true,
            'is_read' => $message->is_read,
            'message' => $message,
        ]);
    }

    /**
     * Update message status (e.g. 'replied', 'archived', 'in_progress').
     */
    public function updateStatus(Request $request, Message $message): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:unread,read,replied,in_progress,archived',
        ]);

        $message->status = $validated['status'];
        if ($validated['status'] === 'replied') {
            $message->is_read = true;
        }
        $message->save();

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    /**
     * Delete a single message.
     */
    public function destroy(Message $message): JsonResponse
    {
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully.',
        ]);
    }

    /**
     * Bulk delete or mark read.
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:messages,id',
            'action' => 'required|string|in:mark_read,mark_unread,delete',
        ]);

        $ids = $validated['ids'];

        if ($validated['action'] === 'mark_read') {
            Message::whereIn('id', $ids)->update(['is_read' => true, 'status' => 'read']);
        } elseif ($validated['action'] === 'mark_unread') {
            Message::whereIn('id', $ids)->update(['is_read' => false, 'status' => 'unread']);
        } elseif ($validated['action'] === 'delete') {
            Message::whereIn('id', $ids)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Bulk action performed successfully.',
        ]);
    }
}
