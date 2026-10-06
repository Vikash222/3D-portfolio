<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    protected $fillable = [
        'title', 'description', 'category', 'long_description', 'tech_tags', 'thumbnail_url',
        'thumbnail_public_id', 'screenshots', 'video_url', 'features',
        'github_link', 'live_link', 'is_pinned', 'status', 'display_order', 'views_count'
    ];

    protected $casts = [
        'tech_tags' => 'array',
        'screenshots' => 'array',
        'features' => 'array',
        'is_pinned' => 'boolean',
        'display_order' => 'integer',
        'views_count' => 'integer'
    ];
}
