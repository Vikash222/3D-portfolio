<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model {
    protected $fillable = [
        'title', 'message', 'type', 'link', 'is_read'
    ];
    protected $casts = [
        'is_read' => 'boolean'
    ];
}
