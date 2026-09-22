<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'company',
        'role',
        'period',
        'location',
        'description',
        'highlights',
        'is_current',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'highlights' => 'array',
            'is_current' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
