<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Profile extends Model {
    protected $fillable = [
        'name', 'tagline', 'bio', 'profile_image_url', 'profile_image_public_id',
        'resume_url', 'resume_public_id', 'resume_downloads', 'github_url',
        'linkedin_url', 'email'
    ];
    protected $casts = ['resume_downloads' => 'integer'];
}
