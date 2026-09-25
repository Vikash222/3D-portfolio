<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform',
        'post_url',
        'title',
        'caption',
        'image_url',
        'author_name',
        'metrics',
        'is_pinned',
        'published_at',
    ];

    protected $casts = [
        'metrics' => 'array',
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
    ];
}
