<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Project extends Model {
    protected $fillable = [
        'title', 'description', 'long_description', 'tech_tags', 'thumbnail_url',
        'thumbnail_public_id', 'github_link', 'live_link', 'is_pinned', 'display_order'
    ];
    protected $casts = [
        'tech_tags' => 'array', 'is_pinned' => 'boolean', 'display_order' => 'integer'
    ];
}
