<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Skill extends Model {
    protected $fillable = ['name', 'category', 'proficiency_level', 'icon', 'display_order'];
    protected $casts = ['proficiency_level' => 'integer', 'display_order' => 'integer'];
}
