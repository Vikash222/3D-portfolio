<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model {
    protected $fillable = [
        'name', 'designation', 'company', 'avatar_url',
        'content', 'rating', 'is_approved', 'is_featured', 'is_published'
    ];
    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'is_featured' => 'boolean',
        'is_published' => 'boolean'
    ];
}
