<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model {
    protected $fillable = [
        'name', 'category', 'category_name', 'proficiency_level', 'proficiency', 'icon', 'display_order', 'is_enabled'
    ];
    protected $casts = [
        'proficiency_level' => 'integer',
        'proficiency' => 'integer',
        'display_order' => 'integer',
        'is_enabled' => 'boolean'
    ];
}
