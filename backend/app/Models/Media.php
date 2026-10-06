<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Media extends Model {
    protected $fillable = [
        'name', 'url', 'path', 'category', 'size_bytes', 'dimensions', 'mime_type'
    ];
    protected $casts = [
        'size_bytes' => 'integer'
    ];
}
