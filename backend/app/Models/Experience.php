<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model {
    protected $fillable = [
        'company', 'position', 'period', 'start_date', 'end_date',
        'is_current', 'location', 'description', 'technologies',
        'company_logo', 'display_order'
    ];
    protected $casts = [
        'technologies' => 'array',
        'is_current' => 'boolean',
        'display_order' => 'integer'
    ];
}
