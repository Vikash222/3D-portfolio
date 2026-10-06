<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Message extends Model {
    protected $fillable = [
        'name', 'email', 'phone', 'subject', 'message',
        'is_read', 'status', 'reply_content', 'replied_at', 'ip_address', 'user_agent'
    ];
    protected $casts = [
        'is_read' => 'boolean',
        'replied_at' => 'datetime'
    ];
}
