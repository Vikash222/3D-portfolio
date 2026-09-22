<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'category',
        'template_project_id',
        'budget_range',
        'timeline',
        'description',
        'features_json',
        'status',
        'payment_status',
    ];

    protected function casts(): array
    {
        return [
            'features_json' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function templateProject(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'template_project_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
