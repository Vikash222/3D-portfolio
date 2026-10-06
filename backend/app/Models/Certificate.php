<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model {
    protected $fillable = [
        'title', 'issuer', 'issue_date', 'credential_id', 'credential_url',
        'image_url', 'description', 'display_order'
    ];
    protected $casts = [
        'display_order' => 'integer'
    ];
}
