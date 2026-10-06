<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class NavigationItem extends Model {
    protected $fillable = [
        'label', 'url', 'icon', 'is_visible', 'display_order'
    ];
    protected $casts = [
        'is_visible' => 'boolean',
        'display_order' => 'integer'
    ];
}
