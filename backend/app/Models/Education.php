<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Education extends Model {
    protected $table = 'educations';
    protected $fillable = [
        'institution', 'degree', 'field_of_study', 'start_date', 'end_date',
        'grade', 'description', 'institution_logo', 'certificate_url', 'display_order'
    ];
    protected $casts = [
        'display_order' => 'integer'
    ];
}
