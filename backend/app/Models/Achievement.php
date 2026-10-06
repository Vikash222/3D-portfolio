<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model {
    protected $fillable = [
        'title', 'description', 'date', 'image_url', 'external_link', 'display_order'
    ];
    protected $casts = [
        'display_order' => 'integer'
    ];
}
