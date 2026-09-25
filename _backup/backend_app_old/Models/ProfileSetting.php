<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'tagline',
        'bio',
        'about_details',
        'avatar_url',
        'hero_image_url',
        'camp_image_url',
        'camp_title',
        'camp_caption',
        'camp_gallery',
        'resume_url',
        'email',
        'phone',
        'location',
        'github',
        'linkedin',
        'twitter',
        'instagram',
        'status_badge',
        'years_experience',
        'projects_completed',
        'satisfied_clients',
        'code_commits',
        'gemini_api_key',
        'ai_system_prompt',
        'ai_welcome_message',
        'razorpay_key_id',
        'razorpay_key_secret',
        'razorpay_payment_link',
        'freelance_status',
    ];

    protected function casts(): array
    {
        return [
            'about_details' => 'array',
            'camp_gallery' => 'array',
            'years_experience' => 'integer',
            'projects_completed' => 'integer',
            'satisfied_clients' => 'integer',
        ];
    }
}
