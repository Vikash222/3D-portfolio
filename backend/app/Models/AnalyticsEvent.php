<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class AnalyticsEvent extends Model {
    protected $fillable = [
        'ip_hash', 'page', 'referrer', 'device_type', 'browser', 'os', 'country'
    ];
}
