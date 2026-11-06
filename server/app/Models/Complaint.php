<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $table = 'complaints';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'complaint_id',
        'title',
        'customer_name',
        'hotel_name',
        'category',
        'priority',
        'status',
        'assigned_staff',
        'notes',
        'resolution_summary',
    ];

    protected $casts = [
        'notes' => 'array',
    ];
}

