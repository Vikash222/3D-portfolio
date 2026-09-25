<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Traits\ApiResponse;
class AdminMessageController extends Controller {
    use ApiResponse;
    public function index() {
        return $this->success(Message::latest()->paginate(10));
    }
    public function markRead($id) {
        $msg = Message::find($id);
        if (!$msg) return $this->error('Not found', 404);
        $msg->update(['is_read' => !$msg->is_read]);
        return $this->success($msg);
    }
    public function destroy($id) {
        $msg = Message::find($id);
        if (!$msg) return $this->error('Not found', 404);
        $msg->delete();
        return $this->success(null, 'Deleted');
    }
}
