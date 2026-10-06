<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminMessageController extends Controller {
    use ApiResponse;

    public function index(Request $request) {
        $query = Message::latest();
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('subject', 'like', "%{$s}%")
                  ->orWhere('message', 'like', "%{$s}%");
            });
        }
        return $this->success($query->paginate(15));
    }

    public function markRead($id) {
        $msg = Message::find($id);
        if (!$msg) return $this->error('Not found', 404);
        $newRead = !$msg->is_read;
        $msg->update([
            'is_read' => $newRead,
            'status' => $newRead ? 'read' : 'new'
        ]);
        return $this->success($msg);
    }

    public function updateStatus(Request $request, $id) {
        $request->validate(['status' => 'required|in:new,read,replied,archived,spam']);
        $msg = Message::find($id);
        if (!$msg) return $this->error('Not found', 404);
        $msg->update([
            'status' => $request->status,
            'is_read' => in_array($request->status, ['read', 'replied', 'archived'])
        ]);
        return $this->success($msg);
    }

    public function reply(Request $request, $id) {
        $request->validate(['reply_content' => 'required|string']);
        $msg = Message::find($id);
        if (!$msg) return $this->error('Not found', 404);
        $msg->update([
            'reply_content' => $request->reply_content,
            'replied_at' => now(),
            'status' => 'replied',
            'is_read' => true
        ]);

        $emailSent = false;
        try {
            if (config('mail.default') && $msg->email) {
                \Illuminate\Support\Facades\Mail::raw($request->reply_content, function ($mail) use ($msg) {
                    $mail->to($msg->email, $msg->name)
                         ->subject("Re: Inquiry - " . ($msg->subject ?: "Vikash Kumar Portfolio"));
                });
                $emailSent = true;
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Reply email delivery failed for {$msg->email}: " . $e->getMessage());
        }

        ActivityLog::create([
            'user_name' => $request->user()?->name ?? 'Admin',
            'action' => 'message_reply',
            'details' => "Replied to message from {$msg->email}",
            'ip_address' => $request->ip(),
        ]);
        return $this->success([
            'message' => $msg,
            'email_sent' => $emailSent,
        ], 'Reply recorded');
    }

    public function export() {
        return $this->success(Message::latest()->get());
    }

    public function destroy($id) {
        $msg = Message::find($id);
        if (!$msg) return $this->error('Not found', 404);
        $msg->delete();
        return $this->success(null, 'Message deleted');
    }
}
