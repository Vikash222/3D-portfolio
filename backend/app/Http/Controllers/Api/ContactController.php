<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\Message;
use App\Models\AdminNotification;
use App\Traits\ApiResponse;

class ContactController extends Controller {
    use ApiResponse;

    public function store(ContactRequest $request) {
        $msg = Message::create(array_merge($request->validated(), [
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'new'
        ]));

        AdminNotification::create([
            'title' => 'New Message Received',
            'message' => "{$msg->name} ({$msg->email}): " . substr($msg->message, 0, 80) . '...',
            'type' => 'message',
            'link' => '/admin/messages',
        ]);

        return $this->success($msg, 'Message sent successfully');
    }
}
