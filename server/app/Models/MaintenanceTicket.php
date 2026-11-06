<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceTicket extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'maintenance_tickets';

    protected $fillable = [
        'id',
        'title',
        'room_number',
        'category',
        'priority',
        'status',
        'reported_by',
        'assigned_technician',
        'description',
        'estimated_cost',
    ];

    protected $casts = [
        'estimated_cost' => 'float',
    ];
}

