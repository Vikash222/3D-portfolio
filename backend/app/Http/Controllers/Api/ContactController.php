<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\Message;
use App\Traits\ApiResponse;
class ContactController extends Controller {
    use ApiResponse;
    public function store(ContactRequest $request) {
        $msg = Message::create(array_merge($request->validated(), ['ip_address' => $request->ip()]));
        return $this->success($msg, 'Message sent successfully');
    }
}
