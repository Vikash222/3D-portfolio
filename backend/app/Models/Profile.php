<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model {
    protected $fillable = [
        'name', 'professional_name', 'tagline', 'headline', 'bio',
        'about_description', 'location', 'phone', 'availability_status',
        'profile_image_url', 'profile_image_public_id',
        'resume_url', 'resume_public_id', 'resume_downloads',
        'github_url', 'linkedin_url', 'email',
        'hero_settings', 'about_stats', 'contact_info',
        'seo_settings', 'theme_settings', 'sections_config', 'site_settings'
    ];

    protected $casts = [
        'resume_downloads' => 'integer',
        'hero_settings' => 'array',
        'about_stats' => 'array',
        'contact_info' => 'array',
        'seo_settings' => 'array',
        'theme_settings' => 'array',
        'sections_config' => 'array',
        'site_settings' => 'array',
    ];
}
