<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model {
    protected $fillable = [
        'platform', 'username', 'url', 'icon', 'is_visible', 'display_order', 'clicks_count'
    ];
    protected $casts = [
        'is_visible' => 'boolean',
        'display_order' => 'integer',
        'clicks_count' => 'integer'
    ];
}
