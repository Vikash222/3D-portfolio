<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model {
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'featured_image',
        'category', 'tags', 'status', 'seo_title', 'seo_description',
        'views_count', 'published_at'
    ];
    protected $casts = [
        'tags' => 'array',
        'views_count' => 'integer',
        'published_at' => 'datetime'
    ];
}
